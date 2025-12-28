import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/videos/[id]/progress
 * Get playback position for a movie
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get the most recent view for this user and movie
        const { data: view } = await supabase
            .from("movie_views")
            .select("watch_duration_seconds, completed")
            .eq("movie_id", id)
            .eq("user_id", user.id)
            .order("viewed_at", { ascending: false })
            .limit(1)
            .single();

        if (!view) {
            return NextResponse.json({ position: 0, completed: false });
        }

        return NextResponse.json({
            position: view.watch_duration_seconds || 0,
            completed: view.completed || false,
        });
    } catch (error) {
        console.error("Error fetching progress:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

/**
 * POST /api/videos/[id]/progress
 * Save playback position for a movie
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { position, completed } = await request.json() as {
            position: number;
            completed?: boolean;
        };

        if (typeof position !== "number" || position < 0) {
            return NextResponse.json(
                { error: "Invalid position" },
                { status: 400 }
            );
        }

        // Get movie duration to check if completed
        const { data: movie } = await supabase
            .from("movies")
            .select("duration_seconds")
            .eq("id", id)
            .single();

        const isCompleted = completed || (movie?.duration_seconds && position >= movie.duration_seconds * 0.9);

        // Check if view record exists
        const { data: existingView } = await supabase
            .from("movie_views")
            .select("id")
            .eq("movie_id", id)
            .eq("user_id", user.id)
            .order("viewed_at", { ascending: false })
            .limit(1)
            .single();

        if (existingView) {
            // Update existing view
            const { error: updateError } = await supabase
                .from("movie_views")
                .update({
                    watch_duration_seconds: Math.floor(position),
                    completed: isCompleted,
                    viewed_at: new Date().toISOString(),
                })
                .eq("id", existingView.id);

            if (updateError) throw updateError;
        } else {
            // Insert new view
            const { error: insertError } = await supabase
                .from("movie_views")
                .insert({
                    movie_id: id,
                    user_id: user.id,
                    watch_duration_seconds: Math.floor(position),
                    completed: isCompleted,
                });

            if (insertError) throw insertError;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving progress:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

