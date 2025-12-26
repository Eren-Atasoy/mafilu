import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bunnyStream } from "@/lib/bunny";

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/videos/[id]/status
 * 
 * Get video processing status from Bunny.net
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id: videoId } = await params;

        // Authenticate user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check Bunny.net configuration
        if (!bunnyStream.isConfigured()) {
            return NextResponse.json(
                { error: "Video service not configured" },
                { status: 503 }
            );
        }

        // Get video status
        const status = await bunnyStream.getVideoStatus(videoId);

        if (!status) {
            return NextResponse.json(
                { error: "Video not found" },
                { status: 404 }
            );
        }

        // Map status codes to readable strings
        const statusMap: Record<number, string> = {
            0: "created",
            1: "uploading",
            2: "processing",
            3: "transcoding",
            4: "finished",
            5: "error",
        };

        return NextResponse.json({
            videoId: status.guid,
            status: statusMap[status.status] || "unknown",
            statusCode: status.status,
            progress: status.encodeProgress,
            duration: status.length,
            width: status.width,
            height: status.height,
            resolutions: status.availableResolutions?.split(",") || [],
            isReady: status.status === 4,
            playbackUrl: status.status === 4 ? bunnyStream.getPlaybackUrl(videoId) : null,
            thumbnailUrl: status.status === 4 ? bunnyStream.getThumbnailUrl(videoId) : null,
            embedUrl: bunnyStream.getEmbedUrl(videoId),
        });
    } catch (error) {
        console.error("Video status error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/videos/[id]
 * 
 * Delete a video from Bunny.net
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id: videoId } = await params;

        // Authenticate user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user owns a movie with this video
        const { data: movie } = await supabase
            .from("movies")
            .select("id, producer_id")
            .eq("bunny_video_id", videoId)
            .single();

        if (!movie || movie.producer_id !== user.id) {
            return NextResponse.json(
                { error: "Not authorized to delete this video" },
                { status: 403 }
            );
        }

        // Check Bunny.net configuration
        if (!bunnyStream.isConfigured()) {
            return NextResponse.json(
                { error: "Video service not configured" },
                { status: 503 }
            );
        }

        // Delete from Bunny.net
        const deleted = await bunnyStream.deleteVideo(videoId);

        if (!deleted) {
            return NextResponse.json(
                { error: "Failed to delete video" },
                { status: 500 }
            );
        }

        // Clear bunny_video_id from movie
        await supabase
            .from("movies")
            .update({ bunny_video_id: null })
            .eq("id", movie.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Video delete error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
