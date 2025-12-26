"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
            });

            if (error) {
                setError(error.message);
            } else {
                setIsSuccess(true);
            }
        } catch {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative">
                    <div
                        className="absolute -inset-4 opacity-50 blur-3xl"
                        style={{
                            background: "radial-gradient(ellipse at center, rgba(34, 197, 94, 0.3) 0%, transparent 70%)"
                        }}
                    />
                    <div className="relative glass-card p-8 sm:p-10 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#F5F3FF] mb-3">E-posta Gönderildi!</h1>
                        <p className="text-[#A197B0] mb-6">
                            Şifre sıfırlama bağlantısı <span className="text-[#C4B5FD]">{email}</span> adresine gönderildi.
                            Lütfen e-postanızı kontrol edin.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-[#A855F7] hover:text-[#C4B5FD] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Giriş sayfasına dön
                        </Link>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative">
                <div
                    className="absolute -inset-4 opacity-50 blur-3xl"
                    style={{
                        background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, transparent 70%)"
                    }}
                />

                <div className="relative glass-card p-8 sm:p-10">
                    {/* Back Link */}
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-[#A197B0] hover:text-[#C4B5FD] transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Geri dön
                    </Link>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h1
                            className="text-3xl font-bold headline-serif text-[#F5F3FF] mb-3"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Şifrenizi mi Unuttunuz?
                        </motion.h1>
                        <motion.p
                            className="text-[#A197B0]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                        </motion.p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                            transition={{ delay: 0.5 }}
                        >
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="absolute inset-[-10px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.4)_0%,transparent_60%)] blur-xl" />
                            </span>

                            {isLoading ? (
                                <span className="relative flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Gönderiliyor...
                                </span>
                            ) : (
                                <span className="relative flex items-center justify-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Sıfırlama Bağlantısı Gönder
                                </span>
                            )}
                        </motion.button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
