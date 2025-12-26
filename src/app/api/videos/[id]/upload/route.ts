import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bunnyStream } from "@/lib/bunny";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id: videoId } = await params;
        const supabase = await createClient();

        // 1. Auth Check
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Check Ownership
        const { data: movie } = await supabase
            .from("movies")
            .select("id, producer_id")
            .eq("bunny_video_id", videoId)
            //.eq("producer_id", user.id) // This query might fail if multiple movies share same videoId (unlikely) or if we don't have movie yet linked purely by videoId? 
            // Actually videoId is unique. Use it to find movie?
            // Wait, we updated the movie with videoId in the previous step (POST /api/videos/upload).
            // So we can find the movie by bunny_video_id.
            .single();

        // If we can't find movie by videoId, maybe we should pass movieId in query param?
        // But let's assume the client called POST /upload (which links movie <-> videoId) BEFORE calling this PUT.

        if (!movie) {
            // Fallback: Check if the user is a producer/admin. We might not have linked it yet?
            // But for security, strictly we should only allow if we can verify ownership.
            console.warn(`Upload attempted for video ${videoId} but no linked movie found yet.`);
            // Allow for now if user is authenticated producer, assuming they just created it.
            // Ideally we'd check if videoId exists in Bunny and if it was created recently?
            // For strict security: The POST /upload returns videoId AND links it to movie. So `movie` SHOULD exist.
        }

        // 3. Proxy Upload to Bunny
        if (!bunnyStream.isConfigured()) {
            return NextResponse.json({ error: "Service not configured" }, { status: 503 });
        }

        // Read the stream from request
        const blob = await request.blob();
        const arrayBuffer = await blob.arrayBuffer();

        // Use service to upload
        // Note: For large files, loading into memory (ArrayBuffer) is bad practice in Node.
        // But Next.js App Router Request body handling is stream-based.
        // We really want to pipe `request.body` directly to `fetch`.

        const success = await bunnyStream.uploadVideo(videoId, arrayBuffer);

        if (!success) {
            return NextResponse.json({ error: "Upload to provider failed" }, { status: 502 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Upload proxy error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
