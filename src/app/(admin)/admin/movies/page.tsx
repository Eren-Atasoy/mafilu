import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Calendar,
    User,
    Film,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
    pending_review: { label: "Bekliyor", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock },
    approved: { label: "Onaylı", color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle },
    rejected: { label: "Reddedildi", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
    draft: { label: "Taslak", color: "bg-slate-500/10 text-slate-400 border-slate-500/20", icon: Film },
};

export default async function AdminMoviesPage() {
    const supabase = await createClient();

    const { data: movies } = await supabase
        .from("movies")
        .select(`
            *,
            profiles:producer_id (
                display_name,
                full_name,
                email
            )
        `)
        .order("created_at", { ascending: false });

    // Group by status
    const pending = movies?.filter(m => m.status === "pending_review") || [];
    const approved = movies?.filter(m => m.status === "approved") || [];
    const rejected = movies?.filter(m => m.status === "rejected") || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Film Onayları</h1>
                <p className="text-slate-400 mt-1">Yapımcıların gönderdiği filmleri incele ve onayla</p>
            </div>

            {/* Status Tabs Summary */}
            <div className="flex gap-4">
                <div className="px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <span className="text-yellow-400 font-medium">{pending.length}</span>
                    <span className="text-slate-400 ml-2">Bekleyen</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-green-400 font-medium">{approved.length}</span>
                    <span className="text-slate-400 ml-2">Onaylı</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="text-red-400 font-medium">{rejected.length}</span>
                    <span className="text-slate-400 ml-2">Reddedildi</span>
                </div>
            </div>

            {/* Pending Reviews Section */}
            {pending.length > 0 && (
                <Card variant="glass" className="border-yellow-500/20">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-500" />
                            Bekleyen Onaylar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pending.map((movie) => (
                                <MovieRow key={movie.id} movie={movie} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* All Movies */}
            <Card variant="glass">
                <CardHeader>
                    <CardTitle className="text-lg">Tüm Filmler</CardTitle>
                </CardHeader>
                <CardContent>
                    {movies && movies.length > 0 ? (
                        <div className="space-y-4">
                            {movies.map((movie) => (
                                <MovieRow key={movie.id} movie={movie} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">Henüz film yok</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

interface MovieRowProps {
    movie: {
        id: string;
        title: string;
        status: string;
        bunny_video_id?: string;
        created_at: string;
        total_views?: number;
        profiles?: { display_name?: string } | null;
    };
}

function MovieRow({ movie }: MovieRowProps) {
    const status = statusConfig[movie.status] || statusConfig.draft;
    const StatusIcon = status.icon;

    return (
        <Link
            href={`/admin/movies/${movie.id}`}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors group"
        >
            <div className="flex items-center gap-4">
                {/* Thumbnail placeholder */}
                <div className="w-20 h-12 rounded-lg bg-slate-700 flex items-center justify-center overflow-hidden">
                    {movie.bunny_video_id ? (
                        <img
                            src={`https://vz-ff7f3a9c-9a3.b-cdn.net/${movie.bunny_video_id}/thumbnail.jpg`}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Film className="w-6 h-6 text-slate-500" />
                    )}
                </div>

                <div>
                    <p className="font-medium text-white group-hover:text-red-400 transition-colors">
                        {movie.title}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {movie.profiles?.display_name || "Bilinmiyor"}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(movie.created_at).toLocaleDateString("tr-TR")}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {movie.total_views || 0}
                        </span>
                    </div>
                </div>
            </div>

            <Badge className={status.color}>
                <StatusIcon className="w-3.5 h-3.5 mr-1" />
                {status.label}
            </Badge>
        </Link>
    );
}
