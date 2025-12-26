import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Plus,
    Film,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Edit
} from "lucide-react";

export default async function MoviesPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: movies } = await supabase
        .from("movies")
        .select("*")
        .eq("producer_id", user?.id)
        .order("created_at", { ascending: false });

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Filmlerim</h1>
                    <p className="text-slate-400 mt-1">Tüm filmlerinizi yönetin</p>
                </div>
                <Link href="/movies/new">
                    <Button>
                        <Plus className="w-5 h-5" />
                        Yeni Film Ekle
                    </Button>
                </Link>
            </div>

            {/* Movies Grid */}
            {movies && movies.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movies.map((movie) => {
                        const status = statusConfig[movie.status as keyof typeof statusConfig];
                        const StatusIcon = status?.icon || Clock;

                        return (
                            <Card key={movie.id} variant="glass" className="overflow-hidden group">
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-slate-800">
                                    {movie.thumbnail_url ? (
                                        <Image
                                            src={movie.thumbnail_url}
                                            alt={movie.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Film className="w-12 h-12 text-slate-600" />
                                        </div>
                                    )}

                                    {/* Status badge */}
                                    <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status?.bg} ${status?.border} border backdrop-blur-sm`}>
                                        <StatusIcon className={`w-3.5 h-3.5 ${status?.color}`} />
                                        <span className={`text-xs font-medium ${status?.color}`}>{status?.label}</span>
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <Link
                                            href={`/movies/${movie.id}`}
                                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </Link>
                                        <Link
                                            href={`/movies/${movie.id}/edit`}
                                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Content */}
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-white truncate">{movie.title}</h3>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                                        <span>{genreLabels[movie.genre] || movie.genre}</span>
                                        <span>•</span>
                                        <span>{movie.release_year || "—"}</span>
                                    </div>
                                    {movie.description && (
                                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                            {movie.description}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card variant="glass">
                    <CardContent className="py-16 text-center">
                        <Film className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Henüz film eklemediniz</h3>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto">
                            Bağımsız sinema dünyasına katılın ve filmlerinizi milyonlarca izleyiciyle paylaşın.
                        </p>
                        <Link href="/movies/new">
                            <Button size="lg">
                                <Plus className="w-5 h-5" />
                                İlk Filminizi Ekleyin
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
