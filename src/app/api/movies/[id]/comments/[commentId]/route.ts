import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
    params: Promise<{ id: string; commentId: string }>;
}

/**
 * PUT /api/movies/[id]/comments/[commentId]
 * Update a comment
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { commentId } = await params;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { content } = await request.json() as { content: string };

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

        // Verify ownership
        const { data: existing } = await supabase
            .from("movie_comments")
            .select("user_id")
            .eq("id", commentId)
            .single();

        if (!existing) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        if (existing.user_id !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { data: comment, error: updateError } = await supabase
            .from("movie_comments")
            .update({ content: content.trim() })
            .eq("id", commentId)
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

        if (updateError) throw updateError;

        return NextResponse.json({ comment });
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

/**
 * DELETE /api/movies/[id]/comments/[commentId]
 * Delete a comment (soft delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { commentId } = await params;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify ownership
        const { data: existing } = await supabase
            .from("movie_comments")
            .select("user_id")
            .eq("id", commentId)
            .single();

        if (!existing) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        if (existing.user_id !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Soft delete
        const { error: deleteError } = await supabase
            .from("movie_comments")
            .update({ is_deleted: true, content: "[Deleted]" })
            .eq("id", commentId);

        if (deleteError) throw deleteError;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

