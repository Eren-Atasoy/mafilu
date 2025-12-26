import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Fetch trending movies (most viewed)
        const { data: trending } = await supabase
            .from("movies")
            .select("id, title, genre, total_views, bunny_video_id")
            .eq("status", "approved")
            .order("total_views", { ascending: false })
            .limit(4);

        // Fetch new movies (most recent)
        const { data: newMovies } = await supabase
            .from("movies")
            .select("id, title, genre, total_views, bunny_video_id")
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .limit(4);

        return NextResponse.json({
            trending: trending || [],
            new: newMovies || [],
        });
    } catch (error) {
        console.error("Featured movies error:", error);
        return NextResponse.json(
            { trending: [], new: [] },
            { status: 500 }
        );
    }
}
