import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Eye,
    Film,
    Calendar,
    CreditCard,
    ArrowUpRight,
    Clock,
    CheckCircle,
    XCircle
} from "lucide-react";

// Mock earnings data - in production, this will come from Stripe/Iyzico + view analytics
const mockEarnings = {
    totalEarnings: 2450.75,
    thisMonth: 385.50,
    lastMonth: 420.25,
    pendingPayout: 185.50,
    totalViews: 12580,
    monthlyChange: -8.25,
    transactions: [
        { id: 1, type: "earning", title: "Kayıp Şehir - İzlenme geliri", amount: 45.50, date: "2024-12-25", status: "completed" },
        { id: 2, type: "earning", title: "Gece Yarısı - İzlenme geliri", amount: 32.00, date: "2024-12-24", status: "completed" },
        { id: 3, type: "payout", title: "Banka hesabına transfer", amount: -200.00, date: "2024-12-20", status: "completed" },
        { id: 4, type: "earning", title: "Kayıp Şehir - İzlenme geliri", amount: 28.75, date: "2024-12-18", status: "pending" },
        { id: 5, type: "earning", title: "Sessiz Çığlık - İzlenme geliri", amount: 15.25, date: "2024-12-15", status: "completed" },
    ],
    topMovies: [
        { title: "Kayıp Şehir", views: 4520, earnings: 1250.50 },
        { title: "Gece Yarısı", views: 3200, earnings: 680.25 },
        { title: "Sessiz Çığlık", views: 2100, earnings: 320.00 },
    ],
};

export default async function EarningsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    // In production, fetch real earnings data from transactions table
    const { data: movies } = await supabase
        .from("movies")
        .select("id, title, total_views, total_earnings")
        .eq("producer_id", user?.id)
        .order("total_earnings", { ascending: false })
        .limit(5);

    const earnings = mockEarnings; // Replace with real data

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#F5F3FF] headline-serif">Kazançlarım</h1>
                <p className="text-[#A197B0] mt-1">Gelirlerinizi takip edin ve ödemelerinizi yönetin</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#A197B0]">Toplam Kazanç</p>
                                <p className="text-3xl font-bold text-[#F5F3FF] mt-1">
                                    ${earnings.totalEarnings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)"
                            }}>
                                <DollarSign className="w-6 h-6 text-[#A855F7]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#A197B0]">Bu Ay</p>
                                <p className="text-3xl font-bold text-[#F5F3FF] mt-1">
                                    ${earnings.thisMonth.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    {earnings.monthlyChange >= 0 ? (
                                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-red-400" />
                                    )}
                                    <span className={`text-sm ${earnings.monthlyChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                        {earnings.monthlyChange >= 0 ? "+" : ""}{earnings.monthlyChange}%
                                    </span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#A197B0]">Bekleyen Ödeme</p>
                                <p className="text-3xl font-bold text-[#F5F3FF] mt-1">
                                    ${earnings.pendingPayout.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#A197B0]">Toplam İzlenme</p>
                                <p className="text-3xl font-bold text-[#F5F3FF] mt-1">
                                    {earnings.totalViews.toLocaleString()}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Eye className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Transactions */}
                <div className="lg:col-span-2">
                    <Card variant="glass">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Son İşlemler</CardTitle>
                                <CardDescription>Kazanç ve ödeme geçmişiniz</CardDescription>
                            </div>
                            <button className="flex items-center gap-1 text-sm text-[#A855F7] hover:text-[#C4B5FD] transition-colors">
                                Tümünü Gör <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {earnings.transactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center gap-4 p-4 rounded-xl transition-colors"
                                        style={{ background: "rgba(21, 10, 36, 0.4)" }}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === "earning" ? "bg-emerald-500/10" : "bg-blue-500/10"
                                            }`}>
                                            {tx.type === "earning" ? (
                                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                            ) : (
                                                <CreditCard className="w-5 h-5 text-blue-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[#F5F3FF] truncate">{tx.title}</p>
                                            <p className="text-sm text-[#6B5F7C]">{tx.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${tx.amount >= 0 ? "text-emerald-400" : "text-blue-400"}`}>
                                                {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                                            </p>
                                            <div className="flex items-center gap-1 justify-end">
                                                {tx.status === "completed" ? (
                                                    <>
                                                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                                                        <span className="text-xs text-emerald-400">Tamamlandı</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="w-3 h-3 text-amber-400" />
                                                        <span className="text-xs text-amber-400">Bekliyor</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Movies */}
                <div>
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-lg">En Çok Kazandıran Filmler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {earnings.topMovies.map((movie, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                                        style={{ background: "rgba(21, 10, 36, 0.4)" }}
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{
                                            background: index === 0
                                                ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
                                                : index === 1
                                                    ? "linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)"
                                                    : "rgba(124, 58, 237, 0.2)",
                                            color: index < 2 ? "#1A0B2E" : "#A855F7"
                                        }}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[#F5F3FF] truncate">{movie.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-[#6B5F7C]">
                                                <Eye className="w-3 h-3" />
                                                <span>{movie.views.toLocaleString()} izlenme</span>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-emerald-400">
                                            ${movie.earnings.toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payout Info */}
                    <Card variant="glass" className="mt-6">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                                    background: "linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)"
                                }}>
                                    <CreditCard className="w-5 h-5 text-[#A855F7]" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#F5F3FF]">Ödeme Bilgisi</h3>
                                    <p className="text-sm text-[#A197B0] mt-1">
                                        Minimum ödeme tutarı $50&apos;dır. Ödemeler her ayın 1&apos;inde yapılır.
                                    </p>
                                    <button className="text-sm text-[#A855F7] hover:text-[#C4B5FD] mt-2 transition-colors">
                                        Ödeme ayarları →
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
