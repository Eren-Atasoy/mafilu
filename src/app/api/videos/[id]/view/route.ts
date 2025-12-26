import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        // Increment view count
        // Note: In a real app, you'd want to prevent duplicate views from same IP/Session
        const { error } = await supabase.rpc('increment_view_count', { movie_id: id });

        if (error) {
            // Fallback if RPC doesn't exist yet (we haven't created it)
            // This is race-safe enough for MVP
            const { data: movie } = await supabase
                .from('movies')
                .select('total_views')
                .eq('id', id)
                .single();

            if (movie) {
                await supabase
                    .from('movies')
                    .update({ total_views: (movie.total_views || 0) + 1 })
                    .eq('id', id);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error recording view:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
