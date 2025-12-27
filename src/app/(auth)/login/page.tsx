"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle } from "lucide-react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const isConfirmed = searchParams.get("confirmed") === "true";
    const isPasswordReset = searchParams.get("reset") === "success";
    const authError = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(authError ? "Kimlik doğrulama hatası oluştu." : null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Card with cosmic glass effect */}
            <div className="relative">
                {/* Glow behind card */}
                <div
                    className="absolute -inset-4 opacity-50 blur-3xl"
                    style={{
                        background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, transparent 70%)"
                    }}
                />

                {/* Main card */}
                <div className="relative glass-card p-8 sm:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                            style={{
                                background: "rgba(139, 92, 246, 0.1)",
                                border: "1px solid rgba(139, 92, 246, 0.2)"
                            }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Sparkles className="w-4 h-4 text-[#A855F7]" />
                            <span className="text-sm text-[#C4B5FD]">Sinema dünyasına hoş geldiniz</span>
                        </motion.div>

                        <motion.h1
                            className="text-3xl font-bold headline-serif text-[#F5F3FF] mb-3"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Giriş Yapın
                        </motion.h1>
                        <motion.p
                            className="text-[#A197B0]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Hesabınıza erişin ve yolculuğa devam edin
                        </motion.p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Success Message - Email Confirmed */}
                        {isConfirmed && (
                            <motion.div
                                className="p-4 rounded-xl text-sm flex items-center gap-3"
                                style={{
                                    background: "rgba(34, 197, 94, 0.1)",
                                    border: "1px solid rgba(34, 197, 94, 0.2)",
                                }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <p className="text-green-400">E-posta adresiniz onaylandı! Şimdi giriş yapabilirsiniz.</p>
                            </motion.div>
                        )}

                        {/* Success Message - Password Reset */}
                        {isPasswordReset && (
                            <motion.div
                                className="p-4 rounded-xl text-sm flex items-center gap-3"
                                style={{
                                    background: "rgba(34, 197, 94, 0.1)",
                                    border: "1px solid rgba(34, 197, 94, 0.2)",
                                }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <p className="text-green-400">Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz.</p>
                            </motion.div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                className="p-4 rounded-xl text-sm"
                                style={{
                                    background: "rgba(239, 68, 68, 0.1)",
                                    border: "1px solid rgba(239, 68, 68, 0.2)",
                                }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <p className="text-red-400">{error}</p>
                            </motion.div>
                        )}

                        {/* Email Input */}
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="text-sm font-medium text-[#C4B5FD]">E-posta</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5F7C] group-focus-within:text-[#A855F7] transition-colors" />
                                <input
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-13 pl-12 pr-4 rounded-xl text-[#F5F3FF] placeholder:text-[#6B5F7C] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                                    style={{
                                        background: "rgba(21, 10, 36, 0.6)",
                                        border: "1px solid rgba(124, 58, 237, 0.2)",
                                    }}
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Password Input */}
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className="text-sm font-medium text-[#C4B5FD]">Şifre</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5F7C] group-focus-within:text-[#A855F7] transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-13 pl-12 pr-12 rounded-xl text-[#F5F3FF] placeholder:text-[#6B5F7C] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                                    style={{
                                        background: "rgba(21, 10, 36, 0.6)",
                                        border: "1px solid rgba(124, 58, 237, 0.2)",
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5F7C] hover:text-[#A855F7] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Forgot Password */}
                        <motion.div
                            className="flex justify-end"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[#A855F7] hover:text-[#C4B5FD] transition-colors"
                            >
                                Şifrenizi mi unuttunuz?
                            </Link>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full h-13 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #7C3AED 100%)",
                                backgroundSize: "200% 200%",
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            {/* Glow effect */}
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="absolute inset-[-10px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.4)_0%,transparent_60%)] blur-xl" />
                            </span>

                            {isLoading ? (
                                <span className="relative flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Giriş yapılıyor...
                                </span>
                            ) : (
                                <span className="relative">Giriş Yap</span>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <motion.div
                        className="my-8 flex items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-transparent" />
                        <span className="text-sm text-[#6B5F7C]">veya</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-transparent" />
                    </motion.div>

                    {/* Sign Up Link */}
                    <motion.p
                        className="text-center text-[#A197B0]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        Hesabınız yok mu?{" "}
                        <Link
                            href="/signup"
                            className="text-[#A855F7] hover:text-[#C4B5FD] font-medium transition-colors"
                        >
                            Kayıt olun
                        </Link>
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="w-full max-w-md p-8 sm:p-10 glass-card">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#A197B0]">Yükleniyor...</p>
                </div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
