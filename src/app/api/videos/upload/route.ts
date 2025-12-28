import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bunnyStream } from "@/lib/bunny";

/**
 * POST /api/videos/upload
 * 
 * Creates a video entry on Bunny.net and returns upload credentials
 * for direct browser-to-CDN upload (TUS protocol)
 */
export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user is a producer
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "producer" && profile?.role !== "admin") {
            return NextResponse.json(
                { error: "Only producers can upload videos" },
                { status: 403 }
            );
        }

        // Get request body
        const body = await request.json();
        const { title, movieId } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        // Security: Validate title length
        if (title.length > 200) {
            return NextResponse.json(
                { error: "Title too long (max 200 characters)" },
                { status: 400 }
            );
        }

        // Check Bunny.net configuration
        if (!bunnyStream.isConfigured()) {
            return NextResponse.json(
                {
                    error: "Video service not configured",
                    message: "Bunny.net credentials are missing. Please configure BUNNY_STREAM_API_KEY and BUNNY_STREAM_LIBRARY_ID."
                },
                { status: 503 }
            );
        }

        // Create video on Bunny.net and get upload URL
        const uploadData = await bunnyStream.getDirectUploadUrl(title);

        if (!uploadData) {
            return NextResponse.json(
                { error: "Failed to create video upload" },
                { status: 500 }
            );
        }

        // If movieId provided, update movie with bunny_video_id
        if (movieId) {
            // Security: Verify movie ownership before linking
            const { data: existingMovie, error: movieError } = await supabase
                .from("movies")
                .select("id, producer_id")
                .eq("id", movieId)
                .eq("producer_id", user.id)
                .single();

            if (!movieError && existingMovie) {
                const { error: updateError } = await supabase
                    .from("movies")
                    .update({ bunny_video_id: uploadData.videoId })
                    .eq("id", movieId)
                    .eq("producer_id", user.id);

                if (updateError) {
                    console.error("Failed to update movie with video ID:", updateError);
                }
            }
        }

        // Security: Return minimal data, API key is necessary for direct upload
        // Note: API key exposure is a known trade-off for direct upload
        // Mitigation: Key only works for uploads to this specific video ID
        return NextResponse.json({
            success: true,
            videoId: uploadData.videoId,
            uploadUrl: uploadData.uploadUrl,
            accessKey: uploadData.authorizationSignature, // Required for direct upload, scoped to this video
            libraryId: uploadData.libraryId,
            expiresAt: uploadData.authorizationExpire,
        });
    } catch (error) {
        console.error("Video upload error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
