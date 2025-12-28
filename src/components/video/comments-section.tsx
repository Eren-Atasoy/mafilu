"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Edit2, Trash2, Reply, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Comment {
    id: string;
    content: string;
    parent_id: string | null;
    is_edited: boolean;
    created_at: string;
    updated_at: string;
    profiles: {
        id: string;
        display_name?: string;
        full_name?: string;
        avatar_url?: string;
    };
    replies?: Comment[];
}

interface CommentsSectionProps {
    movieId: string;
}

export function CommentsSection({ movieId }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [showMenu, setShowMenu] = useState<string | null>(null);
    const supabase = createClient();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        loadComments();
    }, [movieId]);

    const loadComments = async () => {
        try {
            const res = await fetch(`/api/movies/${movieId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data.comments || []);
            }
        } catch (error) {
            console.error("Failed to load comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Yorum yapmak için giriş yapmalısınız");
                return;
            }

            const res = await fetch(`/api/movies/${movieId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment }),
            });

            if (res.ok) {
                const data = await res.json();
                setComments([data.comment, ...comments]);
                setNewComment("");
            } else {
                alert("Yorum eklenirken bir hata oluştu");
            }
        } catch (error) {
            console.error("Failed to submit comment:", error);
            alert("Yorum eklenirken bir hata oluştu");
        }
    };

    const handleReply = async (parentId: string) => {
        if (!replyContent.trim()) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Yorum yapmak için giriş yapmalısınız");
                return;
            }

            const res = await fetch(`/api/movies/${movieId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: replyContent, parentId }),
            });

            if (res.ok) {
                const data = await res.json();
                // Add reply to the parent comment
                setComments(
                    comments.map((comment) =>
                        comment.id === parentId
                            ? { ...comment, replies: [...(comment.replies || []), data.comment] }
                            : comment
                    )
                );
                setReplyContent("");
                setReplyingTo(null);
            }
        } catch (error) {
            console.error("Failed to submit reply:", error);
        }
    };

    const handleEdit = async (commentId: string) => {
        if (!editContent.trim()) return;

        try {
            const res = await fetch(`/api/movies/${movieId}/comments/${commentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editContent }),
            });

            if (res.ok) {
                const data = await res.json();
                // Update comment in state
                const updateComment = (comment: Comment): Comment => {
                    if (comment.id === commentId) {
                        return { ...data.comment, replies: comment.replies };
                    }
                    if (comment.replies) {
                        return {
                            ...comment,
                            replies: comment.replies.map(updateComment),
                        };
                    }
                    return comment;
                };
                setComments(comments.map(updateComment));
                setEditingId(null);
                setEditContent("");
            }
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Yorumu silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/movies/${movieId}/comments/${commentId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                // Remove comment from state
                const removeComment = (comment: Comment): Comment | null => {
                    if (comment.id === commentId) return null;
                    if (comment.replies) {
                        return {
                            ...comment,
                            replies: comment.replies.filter((r) => r.id !== commentId),
                        };
                    }
                    return comment;
                };
                setComments(comments.map(removeComment).filter(Boolean) as Comment[]);
            }
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const getUserName = (profile: Comment["profiles"]) => {
        return profile.display_name || profile.full_name || "Anonim";
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-[var(--mf-primary-dark)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[var(--mf-text-accent)]" />
                <h2 className="text-xl font-bold text-[var(--mf-text-high)]">Yorumlar</h2>
                <span className="text-sm text-[var(--mf-text-muted)]">({comments.length})</span>
            </div>

            {/* New Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Yorumunuzu yazın..."
                    className="w-full min-h-[100px] px-4 py-3 rounded-xl bg-[var(--mf-dark-alt)]/60 border border-[var(--mf-primary-dark)]/20 text-[var(--mf-text-high)] placeholder:text-[var(--mf-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--mf-primary-dark)]/50 resize-none"
                    maxLength={1000}
                />
                <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--mf-text-muted)]">
                        {newComment.length}/1000
                    </span>
                    <Button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="bg-[var(--mf-primary-dark)] hover:bg-[var(--mf-primary-glow-alt)]"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Yorum Yap
                    </Button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-center py-12 text-[var(--mf-text-muted)]">
                        Henüz yorum yok. İlk yorumu siz yapın!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            movieId={movieId}
                            onReply={setReplyingTo}
                            onEdit={setEditingId}
                            onDelete={handleDelete}
                            replyingTo={replyingTo}
                            replyContent={replyContent}
                            onReplyContentChange={setReplyContent}
                            onReplySubmit={handleReply}
                            editingId={editingId}
                            editContent={editContent}
                            onEditContentChange={setEditContent}
                            onEditSubmit={handleEdit}
                            getUserName={getUserName}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

interface CommentItemProps {
    comment: Comment;
    movieId: string;
    onReply: (id: string | null) => void;
    onEdit: (id: string | null) => void;
    onDelete: (id: string) => void;
    replyingTo: string | null;
    replyContent: string;
    onReplyContentChange: (content: string) => void;
    onReplySubmit: (parentId: string) => void;
    editingId: string | null;
    editContent: string;
    onEditContentChange: (content: string) => void;
    onEditSubmit: (id: string) => void;
    getUserName: (profile: Comment["profiles"]) => string;
}

function CommentItem({
    comment,
    movieId,
    onReply,
    onEdit,
    onDelete,
    replyingTo,
    replyContent,
    onReplyContentChange,
    onReplySubmit,
    editingId,
    editContent,
    onEditContentChange,
    onEditSubmit,
    getUserName,
}: CommentItemProps) {
    const [showMenu, setShowMenu] = useState(false);
    const supabase = createClient();
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user?.id || null);
        };
        getUser();
    }, [supabase]);

    const isOwner = currentUser === comment.profiles.id;
    const isEditing = editingId === comment.id;
    const isReplying = replyingTo === comment.id;

    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--mf-primary-dark)] to-[var(--mf-primary-glow-alt)] flex items-center justify-center text-white font-bold flex-shrink-0">
                    {getUserName(comment.profiles)[0]?.toUpperCase() || "?"}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-medium text-[var(--mf-text-high)]">
                                {getUserName(comment.profiles)}
                            </p>
                            <p className="text-xs text-[var(--mf-text-muted)]">
                                {formatDistanceToNow(new Date(comment.created_at), {
                                    addSuffix: true,
                                    locale: tr,
                                })}
                                {comment.is_edited && " (düzenlendi)"}
                            </p>
                        </div>

                        {isOwner && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-1 hover:bg-[var(--mf-dark-alt)]/60 rounded"
                                >
                                    <MoreVertical className="w-4 h-4 text-[var(--mf-text-muted)]" />
                                </button>
                                {showMenu && (
                                    <div className="absolute right-0 top-8 bg-[var(--mf-dark-alt)] border border-[var(--mf-primary-dark)]/20 rounded-lg shadow-lg z-10 min-w-[120px]">
                                        <button
                                            onClick={() => {
                                                onEdit(comment.id);
                                                setEditContent(comment.content);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-[var(--mf-text-high)] hover:bg-[var(--mf-primary-dark)]/10 flex items-center gap-2"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => {
                                                onDelete(comment.id);
                                                setShowMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Sil
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => onEditContentChange(e.target.value)}
                                className="w-full min-h-[80px] px-3 py-2 rounded-lg bg-[var(--mf-dark-alt)]/60 border border-[var(--mf-primary-dark)]/20 text-[var(--mf-text-high)] focus:outline-none focus:ring-2 focus:ring-[var(--mf-primary-dark)]/50 resize-none"
                                maxLength={1000}
                            />
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => onEditSubmit(comment.id)}
                                    className="bg-[var(--mf-primary-dark)] hover:bg-[var(--mf-primary-glow-alt)]"
                                >
                                    Kaydet
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onEdit(null)}
                                >
                                    İptal
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-[var(--mf-text-high)] whitespace-pre-wrap">
                            {comment.content}
                        </p>
                    )}

                    {!isEditing && (
                        <button
                            onClick={() => onReply(isReplying ? null : comment.id)}
                            className="text-sm text-[var(--mf-primary-glow-alt)] hover:text-[var(--mf-primary-dark)] flex items-center gap-1"
                        >
                            <Reply className="w-4 h-4" />
                            Yanıtla
                        </button>
                    )}

                    {/* Reply Form */}
                    {isReplying && (
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-[var(--mf-primary-dark)]/20">
                            <textarea
                                value={replyContent}
                                onChange={(e) => onReplyContentChange(e.target.value)}
                                placeholder="Yanıtınızı yazın..."
                                className="w-full min-h-[80px] px-3 py-2 rounded-lg bg-[var(--mf-dark-alt)]/60 border border-[var(--mf-primary-dark)]/20 text-[var(--mf-text-high)] focus:outline-none focus:ring-2 focus:ring-[var(--mf-primary-dark)]/50 resize-none"
                                maxLength={1000}
                            />
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => onReplySubmit(comment.id)}
                                    disabled={!replyContent.trim()}
                                    className="bg-[var(--mf-primary-dark)] hover:bg-[var(--mf-primary-glow-alt)]"
                                >
                                    Yanıtla
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        onReply(null);
                                        onReplyContentChange("");
                                    }}
                                >
                                    İptal
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-[var(--mf-primary-dark)]/20">
                            {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--mf-primary-dark)] to-[var(--mf-primary-glow-alt)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {getUserName(reply.profiles)[0]?.toUpperCase() || "?"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-sm text-[var(--mf-text-high)]">
                                                    {getUserName(reply.profiles)}
                                                </p>
                                                <p className="text-xs text-[var(--mf-text-muted)]">
                                                    {formatDistanceToNow(new Date(reply.created_at), {
                                                        addSuffix: true,
                                                        locale: tr,
                                                    })}
                                                    {reply.is_edited && " (düzenlendi)"}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[var(--mf-text-high)] mt-1">
                                            {reply.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

