import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Film,
    Users,
    Clock,
    CheckCircle,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch statistics
    const [
        { count: totalMovies },
        { count: pendingMovies },
        { count: approvedMovies },
        { count: totalUsers },
        { data: recentPending },
    ] = await Promise.all([
        supabase.from("movies").select("*", { count: "exact", head: true }),
        supabase.from("movies").select("*", { count: "exact", head: true }).eq("status", "pending_review"),
        supabase.from("movies").select("*", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
            .from("movies")
            .select("id, title, created_at, profiles:producer_id(display_name)")
            .eq("status", "pending_review")
            .order("created_at", { ascending: false })
            .limit(5),
    ]);

    const stats = [
        {
            label: "Toplam Film",
            value: totalMovies || 0,
            icon: Film,
            color: "from-blue-500 to-blue-600",
        },
        {
            label: "Bekleyen Onay",
            value: pendingMovies || 0,
            icon: Clock,
            color: "from-yellow-500 to-orange-500",
            highlight: (pendingMovies || 0) > 0,
        },
        {
            label: "Onaylı Film",
            value: approvedMovies || 0,
            icon: CheckCircle,
            color: "from-green-500 to-emerald-600",
        },
        {
            label: "Toplam Kullanıcı",
            value: totalUsers || 0,
            icon: Users,
            color: "from-purple-500 to-violet-600",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400 mt-1">Platform yönetimi ve istatistikleri</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card
                        key={stat.label}
                        variant="glass"
                        className={stat.highlight ? "ring-2 ring-yellow-500/50" : ""}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">{stat.label}</p>
                                    <p className="text-3xl font-bold text-white mt-1">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pending Reviews */}
            <Card variant="glass">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Bekleyen Onaylar</CardTitle>
                    <Link
                        href="/admin/movies"
                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                        Tümünü Gör →
                    </Link>
                </CardHeader>
                <CardContent>
                    {recentPending && recentPending.length > 0 ? (
                        <div className="space-y-3">
                            {recentPending.map((movie) => (
                                <Link
                                    key={movie.id}
                                    href={`/admin/movies/${movie.id}`}
                                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-yellow-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white group-hover:text-red-400 transition-colors">
                                                {movie.title}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {(movie.profiles as { display_name?: string } | null)?.display_name || "Bilinmeyen Yapımcı"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {new Date(movie.created_at).toLocaleDateString("tr-TR")}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <p className="text-slate-400">Bekleyen film yok!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-3 gap-6">
                <Link href="/admin/movies">
                    <Card variant="glass" className="hover:border-red-500/30 transition-colors cursor-pointer h-full">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-4">
                                <Film className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-semibold text-white">Film Onayları</h3>
                            <p className="text-sm text-slate-500 mt-1">Bekleyen filmleri incele</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/users">
                    <Card variant="glass" className="hover:border-red-500/30 transition-colors cursor-pointer h-full">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center mb-4">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-semibold text-white">Kullanıcı Yönetimi</h3>
                            <p className="text-sm text-slate-500 mt-1">Kullanıcıları yönet</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/analytics">
                    <Card variant="glass" className="hover:border-red-500/30 transition-colors cursor-pointer h-full">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-semibold text-white">Analitik</h3>
                            <p className="text-sm text-slate-500 mt-1">Platform istatistikleri</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
