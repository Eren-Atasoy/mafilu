import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Eye, DollarSign, Users, Film } from "lucide-react";

export default async function AdminAnalyticsPage() {
    // Placeholder data - will be replaced with real analytics
    const stats = [
        { label: "Bu Ay İzlenme", value: "12,450", change: "+18%", icon: Eye },
        { label: "Toplam Gelir", value: "₺24,500", change: "+12%", icon: DollarSign },
        { label: "Yeni Kullanıcı", value: "156", change: "+8%", icon: Users },
        { label: "Yeni Film", value: "23", change: "+5%", icon: Film },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Platform Analitik</h1>
                <p className="text-slate-400 mt-1">Genel platform istatistikleri ve trendler</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                    <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        {stat.change}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                                    <stat.icon className="w-6 h-6 text-red-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Placeholder Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg">Günlük İzlenme</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-xl">
                            <div className="text-center">
                                <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                                <p className="text-slate-500">Grafik yakında eklenecek</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-lg">Gelir Trendi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-xl">
                            <div className="text-center">
                                <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                                <p className="text-slate-500">Grafik yakında eklenecek</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Content */}
            <Card variant="glass">
                <CardHeader>
                    <CardTitle className="text-lg">En Çok İzlenen Filmler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">Analitik verileri yakında eklenecek</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
