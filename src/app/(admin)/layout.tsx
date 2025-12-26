import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
    LayoutDashboard,
    Film,
    Users,
    Settings,
    LogOut,
    Shield,
    BarChart3,
} from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        redirect("/"); // Non-admins redirected to home
    }

    const navItems = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/movies", icon: Film, label: "Film Onayları" },
        { href: "/admin/users", icon: Users, label: "Kullanıcılar" },
        { href: "/admin/analytics", icon: BarChart3, label: "Analitik" },
        { href: "/admin/settings", icon: Settings, label: "Ayarlar" },
    ];

    return (
        <div className="min-h-screen bg-[#0A0510]">
            {/* Admin Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#0D0518] border-r border-red-500/20">
                {/* Logo */}
                <div className="flex h-16 items-center gap-3 border-b border-red-500/20 px-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                            Mafilu
                        </span>
                        <p className="text-xs text-red-400/60">Admin Panel</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/10 transition-colors group"
                        >
                            <item.icon className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-500/20">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <form action="/api/auth/signout" method="post">
                        <button
                            type="submit"
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Çıkış Yap</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pl-64">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
