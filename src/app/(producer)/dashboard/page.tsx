import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProducerAnalytics } from "@/lib/analytics/analytics-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus,
    Film,
    Eye,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Heart,
    BarChart3
} from "lucide-react";
import { ViewsChart } from "@/components/producer/views-chart";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    // Get analytics data
    const analytics = await getProducerAnalytics(user.id);

    // Get user's movies count by status
    const { data: movies } = await supabase
        .from("movies")
        .select("id, status, total_views")
        .eq("producer_id", user.id);

    const stats = {
        total: movies?.length || 0,
        approved: movies?.filter(m => m.status === "approved").length || 0,
        pending: movies?.filter(m => m.status === "pending_review").length || 0,
        draft: movies?.filter(m => m.status === "draft").length || 0,
    };

    // Get recent movies
    const { data: recentMovies } = await supabase
        .from("movies")
        .select("*")
        .eq("producer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

    const statusConfig = {
        draft: { label: "Taslak", icon: Clock, color: "text-slate-400", bg: "bg-slate-500/10" },
        pending_review: { label: "İnceleniyor", icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-500/10" },
        approved: { label: "Yayında", icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
        rejected: { label: "Reddedildi", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
        in_review: { label: "İnceleniyor", icon: AlertCircle, color: "text-blue-400", bg: "bg-blue-500/10" },
        archived: { label: "Arşivlendi", icon: Clock, color: "text-slate-400", bg: "bg-slate-500/10" },
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 mt-1">Filmlerinizi yönetin ve performanslarını takip edin</p>
                </div>
                <Link href="/movies/upload">
                    <Button>
                        <Plus className="w-5 h-5" />
                        Yeni Film Ekle
                    </Button>
                </Link>
            </div>

            {/* Stats Grid - With Real Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Toplam Film</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
                                <p className="text-xs text-green-400 mt-1">{stats.approved} yayında</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                <Film className="w-6 h-6 text-violet-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Toplam İzlenme</p>
                                <p className="text-3xl font-bold text-white mt-1">
                                    {analytics.totalViews.toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Tüm zamanlar</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Eye className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Toplam Beğeni</p>
                                <p className="text-3xl font-bold text-white mt-1">
                                    {analytics.totalLikes.toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Tüm filmler</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                                <Heart className="w-6 h-6 text-pink-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Tahmini Kazanç</p>
                                <p className="text-3xl font-bold text-white mt-1">
                                    ${analytics.estimatedRevenue.toFixed(2)}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Bu ay</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Views Chart */}
            <Card variant="glass">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-violet-400" />
                        Son 30 Gün İzlenme
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ViewsChart data={analytics.viewsByDay} />
                </CardContent>
            </Card>

            {/* Top Movies & Recent Movies Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Movies */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg">En Çok İzlenen Filmler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {analytics.topMovies.length > 0 ? (
                            <div className="space-y-4">
                                {analytics.topMovies.map((movie, index) => (
                                    <div
                                        key={movie.id}
                                        className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate">{movie.title}</p>
                                            <p className="text-xs text-slate-400">
                                                {movie.views.toLocaleString()} izlenme • {movie.likes} beğeni
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-8">Henüz izlenme verisi yok</p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Movies */}
                <Card variant="glass">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Son Filmlerim</CardTitle>
                        <Link href="/movies" className="text-sm text-violet-400 hover:text-violet-300">
                            Tümünü Gör →
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentMovies && recentMovies.length > 0 ? (
                            <div className="space-y-3">
                                {recentMovies.slice(0, 4).map((movie) => {
                                    const status = statusConfig[movie.status as keyof typeof statusConfig];
                                    const StatusIcon = status?.icon || Clock;

                                    return (
                                        <div
                                            key={movie.id}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                                        >
                                            <div className="w-16 h-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                                                <Film className="w-5 h-5 text-slate-500" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white text-sm truncate">{movie.title}</h3>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(movie.created_at).toLocaleDateString("tr-TR")}
                                                </p>
                                            </div>

                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${status?.bg}`}>
                                                <StatusIcon className={`w-3 h-3 ${status?.color}`} />
                                                <span className={`text-xs ${status?.color}`}>{status?.label}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Film className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-500">Henüz film eklemediniz</p>
                                <Link href="/movies/upload" className="inline-block mt-3">
                                    <Button size="sm">
                                        <Plus className="w-4 h-4" />
                                        Film Ekle
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Tips */}
            <Card variant="glass">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h3 className="font-medium text-white">Yapımcı İpucu</h3>
                            <p className="text-sm text-slate-400 mt-1">
                                Filmlerinizin daha fazla izlenmesi için kaliteli küçük resimler ve ilgi çekici açıklamalar kullanın.
                                Ayrıca doğru kategori ve etiket seçimi keşfedilebilirliği artırır.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
