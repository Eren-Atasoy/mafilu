import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Add movie to watchlist
export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { movieId } = await request.json();
        if (!movieId) {
            return NextResponse.json({ error: "movieId is required" }, { status: 400 });
        }

        // Check if already in watchlist
        const { data: existing } = await supabase
            .from("watchlist")
            .select("id")
            .eq("user_id", user.id)
            .eq("movie_id", movieId)
            .single();

        if (existing) {
            // Remove from watchlist
            await supabase
                .from("watchlist")
                .delete()
                .eq("user_id", user.id)
                .eq("movie_id", movieId);

            return NextResponse.json({ added: false, message: "Removed from watchlist" });
        }

        // Add to watchlist
        const { error } = await supabase
            .from("watchlist")
            .insert({
                user_id: user.id,
                movie_id: movieId,
            });

        if (error) throw error;

        return NextResponse.json({ added: true, message: "Added to watchlist" });
    } catch (error) {
        console.error("Watchlist error:", error);
        return NextResponse.json(
            { error: "Failed to update watchlist" },
            { status: 500 }
        );
    }
}

// Check if movie is in watchlist
export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const movieId = searchParams.get("movieId");

        if (movieId) {
            // Check specific movie
            const { data } = await supabase
                .from("watchlist")
                .select("id")
                .eq("user_id", user.id)
                .eq("movie_id", movieId)
                .single();

            return NextResponse.json({ inWatchlist: !!data });
        }

        // Get all watchlist items
        const { data: watchlist } = await supabase
            .from("watchlist")
            .select(`
                id,
                added_at,
                movies:movie_id (
                    id,
                    title,
                    genre,
                    bunny_video_id,
                    total_views
                )
            `)
            .eq("user_id", user.id)
            .order("added_at", { ascending: false });

        return NextResponse.json({ watchlist: watchlist || [] });
    } catch (error) {
        console.error("Watchlist fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch watchlist" },
            { status: 500 }
        );
    }
}
