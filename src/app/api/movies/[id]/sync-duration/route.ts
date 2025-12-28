
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bunnyStream } from "@/lib/bunny";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // Fix for Next.js 15
) {
    try {
        const { id } = await context.params;
        const supabase = await createClient();

        // 1. Auth & Admin check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin" && profile?.role !== "producer") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2. Get Movie
        const { data: movie } = await supabase
            .from("movies")
            .select("bunny_video_id")
            .eq("id", id)
            .single();

        if (!movie?.bunny_video_id) {
            return NextResponse.json({ error: "No video linked" }, { status: 404 });
        }

        // 3. Get Duration from Bunny
        const videoStatus = await bunnyStream.getVideoStatus(movie.bunny_video_id);

        if (!videoStatus) {
            return NextResponse.json({ error: "Bunny video not found" }, { status: 404 });
        }

        const durationSeconds = videoStatus.length;

        // 4. Update DB
        const { error: updateError } = await supabase
            .from("movies")
            .update({ duration_seconds: durationSeconds })
            .eq("id", id);

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true,
            duration: durationSeconds,
            formatted: formatDuration(durationSeconds)
        });

    } catch (error) {
        console.error("Sync duration error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}s ${m}dk`;
    return `${m}dk`;
}
