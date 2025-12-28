import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/movies/[id]/comments
 * Get comments for a movie
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: comments, error } = await supabase
            .from("movie_comments")
            .select(`
                id,
                content,
                parent_id,
                is_edited,
                created_at,
                updated_at,
                profiles:user_id (
                    id,
                    display_name,
                    full_name,
                    avatar_url
                )
            `)
            .eq("movie_id", id)
            .is("parent_id", null) // Only top-level comments
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Get replies for each comment
        const commentsWithReplies = await Promise.all(
            (comments || []).map(async (comment) => {
                const { data: replies } = await supabase
                    .from("movie_comments")
                    .select(`
                        id,
                        content,
                        parent_id,
                        is_edited,
                        created_at,
                        updated_at,
                        profiles:user_id (
                            id,
                            display_name,
                            full_name,
                            avatar_url
                        )
                    `)
                    .eq("parent_id", comment.id)
                    .order("created_at", { ascending: true });

                return {
                    ...comment,
                    replies: replies || [],
                };
            })
        );

        return NextResponse.json({ comments: commentsWithReplies });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

/**
 * POST /api/movies/[id]/comments
 * Create a new comment
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { content, parentId } = await request.json() as {
            content: string;
            parentId?: string;
        };

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: "Comment content is required" },
                { status: 400 }
            );
        }

        if (content.length > 1000) {
            return NextResponse.json(
                { error: "Comment is too long (max 1000 characters)" },
                { status: 400 }
            );
        }

        // If parentId is provided, verify it exists and belongs to the same movie
        if (parentId) {
            const { data: parent } = await supabase
                .from("movie_comments")
                .select("movie_id")
                .eq("id", parentId)
                .single();

            if (!parent || parent.movie_id !== id) {
                return NextResponse.json(
                    { error: "Invalid parent comment" },
                    { status: 400 }
                );
            }
        }

        const { data: comment, error: insertError } = await supabase
            .from("movie_comments")
            .insert({
                movie_id: id,
                user_id: user.id,
                content: content.trim(),
                parent_id: parentId || null,
            })
            .select(`
                id,
                content,
                parent_id,
                is_edited,
                created_at,
                updated_at,
                profiles:user_id (
                    id,
                    display_name,
                    full_name,
                    avatar_url
                )
            `)
            .single();

        if (insertError) throw insertError;

        return NextResponse.json({ comment }, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

