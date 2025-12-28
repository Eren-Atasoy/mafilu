"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Film,
    Search,
    Bookmark,
    Menu,
    X,
    LogOut,
    Settings,
    Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
    const pathname = usePathname();
    const supabase = createClient();
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide navbar when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsScrolled(true);
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            // Background effect when scrolled
            setIsScrolled(currentScrollY > 20);

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    // Hide navbar on auth pages and producer/admin areas
    // Producer pages have their own sidebar navigation
    if (
        pathname?.startsWith("/login") ||
        pathname?.startsWith("/signup") ||
        pathname?.startsWith("/forgot-password") ||
        pathname?.startsWith("/reset-password") ||
        pathname?.startsWith("/producer-studio") ||
        pathname?.startsWith("/dashboard") ||
        pathname?.startsWith("/movies") ||
        pathname?.startsWith("/earnings") ||
        pathname?.startsWith("/settings") ||
        pathname?.startsWith("/admin")
    ) {
        return null;
    }

    const navLinks = [
        { href: "/browse", label: "Keşfet", icon: Search },
        { href: "/watchlist", label: "Listem", icon: Bookmark, auth: true },
        { href: "/subscription", label: "Premium", icon: Crown },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-[var(--mf-black-alt)]/90 backdrop-blur-lg border-b border-[var(--mf-primary-dark)]/10"
                : "bg-transparent"
                } ${isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                        <Film className="w-7 h-7 text-[var(--mf-primary-glow-alt)]" />
                        <span className="text-xl font-bold text-[var(--mf-text-high)] headline-serif tracking-tight">
                            Mafilu
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => {
                            if (link.auth && !user) return null;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 text-sm transition-colors ${pathname === link.href
                                        ? "text-[var(--mf-primary-glow-alt)]"
                                        : "text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)]"
                                        }`}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>


                                {/* User Menu */}
                                <div className="relative group">
                                    <button className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--mf-primary-dark)] to-[var(--mf-primary-glow-alt)] flex items-center justify-center text-white font-bold text-sm">
                                        {user.email?.[0].toUpperCase() || "U"}
                                    </button>

                                    {/* Dropdown */}
                                    <div className="absolute right-0 top-full mt-2 w-48 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded-xl bg-[var(--mf-dark-alt)] border border-[var(--mf-primary-dark)]/20 shadow-xl">
                                        <Link
                                            href="/account"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] hover:bg-[var(--mf-primary-dark)]/10"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Hesabım
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Çıkış Yap
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)]">
                                        Giriş
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-[var(--mf-primary-dark)] hover:bg-[var(--mf-primary-darker)]">
                                        Kayıt Ol
                                    </Button>
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)]"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[var(--mf-black-alt)]/95 backdrop-blur-lg border-t border-[var(--mf-primary-dark)]/10">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => {
                            if (link.auth && !user) return null;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === link.href
                                        ? "bg-[var(--mf-primary-dark)]/10 text-[var(--mf-primary-glow-alt)]"
                                        : "text-[var(--mf-text-medium)] hover:bg-[var(--mf-primary-dark)]/5"
                                        }`}
                                >
                                    <link.icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            );
                        })}

                    </div>
                </div>
            )}
        </nav>
    );
}
