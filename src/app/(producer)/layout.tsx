import { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
    Film,
    LayoutDashboard,
    Video,
    DollarSign,
    Settings,
    LogOut,
    Menu,
    Sparkles
} from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/movies", icon: Video, label: "Filmlerim" },
    { href: "/earnings", icon: DollarSign, label: "Kazançlarım" },
    { href: "/settings", icon: Settings, label: "Ayarlar" },
];

export default async function ProducerLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="min-h-screen flex" style={{ background: "linear-gradient(180deg, #0A0510 0%, #1A0B2E 100%)" }}>
            {/* Sidebar */}
            <aside className="hidden lg:flex w-72 flex-col border-r border-[#7C3AED]/10" style={{ background: "rgba(21, 10, 36, 0.8)" }}>
                {/* Logo */}
                <div className="p-6 border-b border-[#7C3AED]/10">
                    <Link href="/" className="inline-flex items-center gap-3 text-xl font-bold text-white">
                        <Film className="w-8 h-8 text-[#A855F7]" />
                        <span className="text-gradient headline-serif text-2xl">
                            Mafilu
                        </span>
                    </Link>
                    <p className="text-xs text-[#6B5F7C] mt-2">Producer Studio</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#A197B0] hover:text-white transition-all duration-300 relative overflow-hidden"
                            style={{
                                background: "transparent",
                            }}
                        >
                            {/* Hover glow */}
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
                                borderRadius: "12px"
                            }} />
                            <item.icon className="w-5 h-5 relative z-10 group-hover:text-[#A855F7] transition-colors" />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Pro badge */}
                <div className="px-4 mb-4">
                    <div className="p-4 rounded-xl" style={{
                        background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)",
                        border: "1px solid rgba(124, 58, 237, 0.2)"
                    }}>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-[#A855F7]" />
                            <span className="text-sm font-medium text-[#C4B5FD]">Pro Üyelik</span>
                        </div>
                        <p className="text-xs text-[#6B5F7C]">Sınırsız film yükleme ve premium özellikler</p>
                    </div>
                </div>

                {/* User section */}
                <div className="p-4 border-t border-[#7C3AED]/10">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-semibold" style={{
                            background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)"
                        }}>
                            {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#F5F3FF] truncate">
                                {profile?.full_name || "Kullanıcı"}
                            </p>
                            <p className="text-xs text-[#6B5F7C] truncate">
                                {profile?.role === "producer" ? "Yapımcı" : "İzleyici"}
                            </p>
                        </div>
                    </div>
                    <form action="/api/auth/signout" method="post">
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#6B5F7C] hover:text-red-400 transition-all duration-300 mt-2"
                            style={{
                                background: "transparent"
                            }}
                        >
                            <LogOut className="w-5 h-5" />
                            Çıkış Yap
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-xl" style={{
                background: "rgba(10, 5, 16, 0.8)",
                borderBottom: "1px solid rgba(124, 58, 237, 0.1)"
            }}>
                <div className="flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold text-white">
                        <Film className="w-7 h-7 text-[#A855F7]" />
                        <span className="text-gradient headline-serif">
                            Mafilu
                        </span>
                    </Link>
                    <button className="p-2 text-[#A197B0] hover:text-white rounded-lg" style={{
                        background: "rgba(124, 58, 237, 0.1)"
                    }}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-auto">
                {/* Background glows */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-30" style={{
                        background: "radial-gradient(ellipse, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
                        filter: "blur(80px)"
                    }} />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-20" style={{
                        background: "radial-gradient(ellipse, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
                        filter: "blur(80px)"
                    }} />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
