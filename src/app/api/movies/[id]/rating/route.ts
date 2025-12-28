import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/movies/[id]/rating
 * Get user's rating for a movie
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: review } = await supabase
            .from("movie_reviews")
            .select("rating")
            .eq("movie_id", id)
            .eq("user_id", user.id)
            .single();

        return NextResponse.json({
            userRating: review?.rating || null,
        });
    } catch (error) {
        console.error("Error fetching rating:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

/**
 * POST /api/movies/[id]/rating
 * Set user's rating for a movie
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { rating } = await request.json() as { rating: number };

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        // Check if review exists
        const { data: existing } = await supabase
            .from("movie_reviews")
            .select("id")
            .eq("movie_id", id)
            .eq("user_id", user.id)
            .single();

        if (existing) {
            // Update existing review
            const { error: updateError } = await supabase
                .from("movie_reviews")
                .update({ rating })
                .eq("id", existing.id);

            if (updateError) throw updateError;
        } else {
            // Create new review
            const { error: insertError } = await supabase
                .from("movie_reviews")
                .insert({
                    movie_id: id,
                    user_id: user.id,
                    rating,
                });

            if (insertError) throw insertError;
        }

        // Get updated movie rating
        const { data: movie } = await supabase
            .from("movies")
            .select("average_rating, rating_count")
            .eq("id", id)
            .single();

        return NextResponse.json({
            success: true,
            userRating: rating,
            averageRating: movie?.average_rating || 0,
            ratingCount: movie?.rating_count || 0,
        });
    } catch (error) {
        console.error("Error setting rating:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

/**
 * DELETE /api/movies/[id]/rating
 * Remove user's rating
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { error: deleteError } = await supabase
            .from("movie_reviews")
            .delete()
            .eq("movie_id", id)
            .eq("user_id", user.id);

        if (deleteError) throw deleteError;

        // Get updated movie rating
        const { data: movie } = await supabase
            .from("movies")
            .select("average_rating, rating_count")
            .eq("id", id)
            .single();

        return NextResponse.json({
            success: true,
            averageRating: movie?.average_rating || 0,
            ratingCount: movie?.rating_count || 0,
        });
    } catch (error) {
        console.error("Error deleting rating:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

