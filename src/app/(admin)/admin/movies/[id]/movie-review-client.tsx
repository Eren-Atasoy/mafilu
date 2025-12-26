"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    Film,
    AlertTriangle,
    LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface MovieData {
    id: string;
    title: string;
    status: string;
    genre?: string;
    release_year?: number;
    description?: string;
    created_at: string;
    submitted_at?: string;
    rejection_reason?: string;
    tags?: string[];
    profiles?: {
        display_name?: string;
        email?: string;
    } | null;
}

interface MovieReviewClientProps {
    movie: MovieData;
    embedUrl: string | null;
}

export default function MovieReviewClient({ movie, embedUrl }: MovieReviewClientProps) {
    const router = useRouter();
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("movies")
                .update({
                    status: "approved",
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", movie.id);

            if (error) throw error;

            router.push("/admin/movies");
            router.refresh();
        } catch (error) {
            console.error("Approve error:", error);
            alert("Onaylama sırasında bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            alert("Lütfen red sebebi girin");
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("movies")
                .update({
                    status: "rejected",
                    rejection_reason: rejectReason,
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", movie.id);

            if (error) throw error;

            router.push("/admin/movies");
            router.refresh();
        } catch (error) {
            console.error("Reject error:", error);
            alert("Reddetme sırasında bir hata oluştu");
        } finally {
            setIsLoading(false);
            setShowRejectModal(false);
        }
    };

    const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
        pending_review: { label: "Bekliyor", color: "bg-yellow-500/10 text-yellow-400", icon: Clock },
        approved: { label: "Onaylı", color: "bg-green-500/10 text-green-400", icon: CheckCircle },
        rejected: { label: "Reddedildi", color: "bg-red-500/10 text-red-400", icon: XCircle },
    };

    const status = statusConfig[movie.status] || statusConfig.pending_review;
    const StatusIcon = status.icon;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/movies"
                    className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">{movie.title}</h1>
                    <p className="text-slate-400">Film İnceleme</p>
                </div>
                <Badge className={status.color}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {status.label}
                </Badge>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content: Video & Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Video Player */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-lg">Video Önizleme</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {embedUrl ? (
                                <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                                    <iframe
                                        src={embedUrl}
                                        className="absolute inset-0 w-full h-full"
                                        allow="autoplay; encrypted-media; fullscreen"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video bg-slate-800 rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <Film className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                                        <p className="text-slate-500">Video henüz yüklenmemiş</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Movie Details */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-lg">Film Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-500">Kategori</p>
                                    <p className="text-white">{movie.genre || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Yapım Yılı</p>
                                    <p className="text-white">{movie.release_year || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Oluşturulma</p>
                                    <p className="text-white">
                                        {new Date(movie.created_at).toLocaleDateString("tr-TR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Gönderilme</p>
                                    <p className="text-white">
                                        {movie.submitted_at
                                            ? new Date(movie.submitted_at).toLocaleDateString("tr-TR", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })
                                            : "-"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500 mb-2">Açıklama</p>
                                <p className="text-slate-300 whitespace-pre-wrap">
                                    {movie.description || "Açıklama girilmemiş."}
                                </p>
                            </div>

                            {movie.tags && movie.tags.length > 0 && (
                                <div>
                                    <p className="text-sm text-slate-500 mb-2">Etiketler</p>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.tags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-sm"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Producer Info & Actions */}
                <div className="space-y-6">
                    {/* Producer Info */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-lg">Yapımcı Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {movie.profiles?.display_name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <div>
                                    <p className="font-medium text-white">
                                        {movie.profiles?.display_name || "Bilinmiyor"}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {movie.profiles?.email || ""}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    {movie.status === "pending_review" && (
                        <Card variant="glass" className="border-yellow-500/20">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                    İnceleme Bekliyor
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    onClick={handleApprove}
                                    isLoading={isLoading}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Onayla
                                </Button>
                                <Button
                                    onClick={() => setShowRejectModal(true)}
                                    variant="outline"
                                    className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                                >
                                    <XCircle className="w-5 h-5 mr-2" />
                                    Reddet
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Rejection Reason (if rejected) */}
                    {movie.status === "rejected" && movie.rejection_reason && (
                        <Card variant="glass" className="border-red-500/20">
                            <CardHeader>
                                <CardTitle className="text-lg text-red-400">Red Sebebi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300">{movie.rejection_reason}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1A0B2E] rounded-2xl p-6 max-w-md w-full border border-red-500/20">
                        <h3 className="text-xl font-bold text-white mb-4">Filmi Reddet</h3>
                        <p className="text-slate-400 mb-4">
                            Lütfen yapımcıya iletilecek red sebebini yazın.
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Red sebebi..."
                            className="w-full h-32 px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        />
                        <div className="flex gap-3 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1"
                            >
                                İptal
                            </Button>
                            <Button
                                onClick={handleReject}
                                isLoading={isLoading}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                                Reddet
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
