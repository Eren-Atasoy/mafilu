import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { bunnyStream } from "@/lib/bunny";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Edit,
    Play,
    Eye,
    Calendar,
    Clock,
    Tag,
    CheckCircle,
    XCircle,
    AlertCircle,
    Trash2,
    Share2,
    BarChart3
} from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    // Fetch movie
    const { data: movie, error } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .eq("producer_id", user?.id)
        .single();

    if (error || !movie) {
        notFound();
    }

    const statusConfig = {
        draft: { label: "Taslak", icon: Clock, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
        pending_review: { label: "İnceleniyor", icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
        in_review: { label: "İnceleniyor", icon: AlertCircle, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        approved: { label: "Yayında", icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
        rejected: { label: "Reddedildi", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
        archived: { label: "Arşivlendi", icon: Clock, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
    };

    const genreLabels: Record<string, string> = {
        drama: "Drama",
        comedy: "Komedi",
        thriller: "Gerilim",
        documentary: "Belgesel",
        horror: "Korku",
        sci_fi: "Bilim Kurgu",
        romance: "Romantik",
        animation: "Animasyon",
        experimental: "Deneysel",
        short_film: "Kısa Film",
    };

    const status = statusConfig[movie.status as keyof typeof statusConfig];
    const StatusIcon = status?.icon || Clock;

    // Get video embed URL if available
    const embedUrl = movie.bunny_video_id
        ? bunnyStream.getEmbedUrl(movie.bunny_video_id)
        : null;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/movies"
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-[#A197B0] hover:text-white transition-colors"
                        style={{ background: "rgba(124, 58, 237, 0.1)" }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[#F5F3FF] headline-serif">{movie.title}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status?.bg} ${status?.border} border`}>
                                <StatusIcon className={`w-3.5 h-3.5 ${status?.color}`} />
                                <span className={`text-xs font-medium ${status?.color}`}>{status?.label}</span>
                            </div>
                            <span className="text-sm text-[#6B5F7C]">{genreLabels[movie.genre] || movie.genre}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                        Paylaş
                    </Button>
                    <Link href={`/movies/${id}/edit`}>
                        <Button size="sm">
                            <Edit className="w-4 h-4" />
                            Düzenle
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Video Player */}
                    <Card variant="glass" className="overflow-hidden">
                        <div className="relative aspect-video bg-[#0A0510]">
                            {embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    className="absolute inset-0 w-full h-full"
                                    allowFullScreen
                                    allow="autoplay; encrypted-media; fullscreen"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <Play className="w-16 h-16 text-[#6B5F7C] mb-4" />
                                    <p className="text-[#6B5F7C]">Video henüz yüklenmedi</p>
                                    {movie.status === "draft" && (
                                        <Link href={`/movies/${id}/edit`} className="mt-4">
                                            <Button size="sm">
                                                Video Yükle
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Description */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-lg">Açıklama</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-[#A197B0] leading-relaxed">
                                {movie.description || "Açıklama eklenmemiş."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    {movie.tags && movie.tags.length > 0 && (
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-[#A855F7]" />
                                    Etiketler
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {movie.tags.map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 rounded-full text-sm text-[#C4B5FD]"
                                            style={{
                                                background: "rgba(124, 58, 237, 0.1)",
                                                border: "1px solid rgba(124, 58, 237, 0.2)"
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Stats */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-[#A855F7]" />
                                İstatistikler
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(21, 10, 36, 0.4)" }}>
                                <div className="flex items-center gap-3">
                                    <Eye className="w-5 h-5 text-blue-400" />
                                    <span className="text-[#A197B0]">Toplam İzlenme</span>
                                </div>
                                <span className="font-semibold text-[#F5F3FF]">{movie.total_views || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(21, 10, 36, 0.4)" }}>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-emerald-400" />
                                    <span className="text-[#A197B0]">Yapım Yılı</span>
                                </div>
                                <span className="font-semibold text-[#F5F3FF]">{movie.release_year || "—"}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(21, 10, 36, 0.4)" }}>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-amber-400" />
                                    <span className="text-[#A197B0]">Oluşturulma</span>
                                </div>
                                <span className="font-semibold text-[#F5F3FF]">
                                    {new Date(movie.created_at).toLocaleDateString("tr-TR")}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-lg">İşlemler</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {movie.status === "draft" && (
                                <form action={`/api/movies/${id}/submit`} method="POST">
                                    <Button type="submit" className="w-full">
                                        <CheckCircle className="w-4 h-4" />
                                        İncelemeye Gönder
                                    </Button>
                                </form>
                            )}
                            {movie.status === "approved" && (
                                <Button variant="outline" className="w-full">
                                    <Eye className="w-4 h-4" />
                                    Herkese Açık Görüntüle
                                </Button>
                            )}
                            <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10">
                                <Trash2 className="w-4 h-4" />
                                Filmi Sil
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Review Notes (if rejected) */}
                    {movie.status === "rejected" && movie.review_notes && (
                        <Card variant="glass" className="border-red-500/20">
                            <CardHeader>
                                <CardTitle className="text-lg text-red-400">Ret Notu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-[#A197B0]">{movie.review_notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
