"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { User, Mail, Crown, Film, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Profile {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
    role?: string;
    subscription_status?: string;
    subscription_tier?: string;
}

export default function AccountPage() {
    const router = useRouter();
    const supabase = createClient();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            setProfile({
                id: user.id,
                email: user.email,
                ...data,
            });
            setLoading(false);
        }

        loadProfile();
    }, [supabase, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--mf-black)]">
                <div className="w-10 h-10 border-2 border-[var(--mf-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--mf-black)] pt-24 pb-16">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] opacity-20" style={{
                    background: "radial-gradient(ellipse, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
                    filter: "blur(100px)"
                }} />
            </div>

            <main className="relative z-10 max-w-3xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="headline-serif text-4xl font-light text-[var(--mf-text-high)] mb-2">
                        Hesabım
                    </h1>
                    <p className="text-[var(--mf-text-medium)]">
                        Hesap bilgilerinizi ve aboneliğinizi yönetin
                    </p>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 mb-6"
                >
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--mf-primary)] to-[var(--mf-primary-glow)] flex items-center justify-center text-white text-2xl font-semibold">
                            {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <h2 className="text-xl font-medium text-[var(--mf-text-high)]">
                                {profile?.full_name || "Kullanıcı"}
                            </h2>
                            <p className="text-[var(--mf-text-medium)] text-sm">{profile?.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-[var(--mf-text-low)]" />
                                <span className="text-[var(--mf-text-medium)]">Ad Soyad</span>
                            </div>
                            <span className="text-[var(--mf-text-high)]">{profile?.full_name || "-"}</span>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[var(--mf-text-low)]" />
                                <span className="text-[var(--mf-text-medium)]">E-posta</span>
                            </div>
                            <span className="text-[var(--mf-text-high)]">{profile?.email}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Subscription Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 mb-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Crown className="w-5 h-5 text-[var(--mf-primary)]" />
                        <h3 className="text-lg font-medium text-[var(--mf-text-high)]">Abonelik</h3>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-[var(--mf-text-high)] font-medium">
                                {profile?.subscription_tier === "premium" ? "Premium" :
                                    profile?.subscription_tier === "basic" ? "Basic" : "Ücretsiz"}
                            </p>
                            <p className="text-sm text-[var(--mf-text-medium)]">
                                {profile?.subscription_status === "active" ? "Aktif" : "Pasif"}
                            </p>
                        </div>
                        <Link href="/subscription">
                            <Button className="bg-[var(--mf-primary)] hover:bg-[var(--mf-primary-glow)]">
                                {profile?.subscription_tier === "premium" ? "Yönet" : "Yükselt"}
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Producer Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link
                        href="/dashboard"
                        className="glass-card p-5 flex items-center justify-between mb-6 hover:border-[var(--border-glow)] transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--mf-primary)]/20 to-[var(--mf-accent)]/20 flex items-center justify-center">
                                <Film className="w-6 h-6 text-[var(--mf-primary)]" />
                            </div>
                            <div>
                                <p className="text-[var(--mf-text-high)] font-medium">Yapımcı Paneli</p>
                                <p className="text-sm text-[var(--mf-text-medium)]">Film yükle ve kazanç takip et</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[var(--mf-text-low)]" />
                    </Link>
                </motion.div>

                {/* Logout */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <button
                        onClick={handleLogout}
                        className="w-full p-4 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-3"
                    >
                        <LogOut className="w-5 h-5" />
                        Çıkış Yap
                    </button>
                </motion.div>
            </main>
        </div>
    );
}
