import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bunnyStream } from "@/lib/bunny";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// Export maxDuration for Vercel (60 seconds max for Hobby plan)
export const maxDuration = 60;

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id: videoId } = await params;
        const supabase = await createClient();

        // 1. Auth Check
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Check if user is a producer/admin
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

        // 3. Check Ownership (optional - video might not be linked to movie yet)
        const { data: movie } = await supabase
            .from("movies")
            .select("id, producer_id")
            .eq("bunny_video_id", videoId)
            .single();

        // If movie exists, verify ownership
        if (movie && movie.producer_id !== user.id && profile?.role !== "admin") {
            return NextResponse.json(
                { error: "You don't have permission to upload to this video" },
                { status: 403 }
            );
        }

        // 3. Proxy Upload to Bunny
        if (!bunnyStream.isConfigured()) {
            return NextResponse.json({ error: "Service not configured" }, { status: 503 });
        }

        // Read the stream from request
        const blob = await request.blob();
        const arrayBuffer = await blob.arrayBuffer();

        // Log file size for debugging
        const fileSizeMB = (arrayBuffer.byteLength / (1024 * 1024)).toFixed(2);
        console.log(`Uploading video ${videoId}, size: ${fileSizeMB} MB`);

        // Use service to upload
        // Note: For large files, loading into memory (ArrayBuffer) is bad practice in Node.
        // But Next.js App Router Request body handling is stream-based.
        // We really want to pipe `request.body` directly to `fetch`.

        const uploadResult = await bunnyStream.uploadVideo(videoId, arrayBuffer);

        if (!uploadResult.success) {
            return NextResponse.json(
                { 
                    error: uploadResult.error || "Upload to provider failed",
                    details: uploadResult.error
                },
                { status: 502 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Upload proxy error:", error);
        return NextResponse.json({ 
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
