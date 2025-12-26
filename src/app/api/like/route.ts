import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Toggle like on a movie
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

        // Check if already liked (using movie_reviews with rating = 5 as "like")
        const { data: existing } = await supabase
            .from("movie_reviews")
            .select("id, rating")
            .eq("user_id", user.id)
            .eq("movie_id", movieId)
            .single();

        if (existing) {
            if (existing.rating === 5) {
                // Unlike - remove the like
                await supabase
                    .from("movie_reviews")
                    .delete()
                    .eq("id", existing.id);

                return NextResponse.json({ liked: false });
            } else {
                // Update to like
                await supabase
                    .from("movie_reviews")
                    .update({ rating: 5 })
                    .eq("id", existing.id);

                return NextResponse.json({ liked: true });
            }
        }

        // Create new like
        const { error } = await supabase
            .from("movie_reviews")
            .insert({
                user_id: user.id,
                movie_id: movieId,
                rating: 5, // 5 = like
            });

        if (error) throw error;

        return NextResponse.json({ liked: true });
    } catch (error) {
        console.error("Like error:", error);
        return NextResponse.json(
            { error: "Failed to update like" },
            { status: 500 }
        );
    }
}

// Check if movie is liked and get like count
export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        const { searchParams } = new URL(request.url);
        const movieId = searchParams.get("movieId");

        if (!movieId) {
            return NextResponse.json({ error: "movieId is required" }, { status: 400 });
        }

        // Get like count
        const { count: likeCount } = await supabase
            .from("movie_reviews")
            .select("*", { count: "exact", head: true })
            .eq("movie_id", movieId)
            .eq("rating", 5);

        // Check if current user liked
        const { data: { user } } = await supabase.auth.getUser();
        let isLiked = false;

        if (user) {
            const { data: userLike } = await supabase
                .from("movie_reviews")
                .select("id")
                .eq("user_id", user.id)
                .eq("movie_id", movieId)
                .eq("rating", 5)
                .single();

            isLiked = !!userLike;
        }

        return NextResponse.json({
            likeCount: likeCount || 0,
            isLiked,
        });
    } catch (error) {
        console.error("Like fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch like status" },
            { status: 500 }
        );
    }
}
