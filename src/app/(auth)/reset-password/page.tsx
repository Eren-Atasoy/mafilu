"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Lock, Eye, EyeOff, CheckCircle, Shield } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
    const router = useRouter();
    const supabase = createClient();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

    useEffect(() => {
        // Check if user has a valid recovery session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsValidSession(!!session);
        };
        checkSession();
    }, [supabase.auth]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (password.length < 8) {
            setError("Şifre en az 8 karakter olmalıdır.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                setError(error.message);
            } else {
                setIsSuccess(true);
                // Sign out and redirect to login after 3 seconds
                setTimeout(async () => {
                    await supabase.auth.signOut();
                    router.push("/login?reset=success");
                }, 3000);
            }
        } catch {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state
    if (isValidSession === null) {
        return (
            <div className="w-full max-w-md flex items-center justify-center p-10">
                <div className="w-8 h-8 border-2 border-[#7C3AED]/30 border-t-[#7C3AED] rounded-full animate-spin" />
            </div>
        );
    }

    // Invalid session
    if (!isValidSession) {
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
                            background: "radial-gradient(ellipse at center, rgba(239, 68, 68, 0.3) 0%, transparent 70%)"
                        }}
                    />
                    <div className="relative glass-card p-8 sm:p-10 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-8 h-8 text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#F5F3FF] mb-3">Geçersiz veya Süresi Dolmuş Bağlantı</h1>
                        <p className="text-[#A197B0] mb-6">
                            Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.
                            Lütfen yeni bir sıfırlama bağlantısı isteyin.
                        </p>
                        <Link
                            href="/forgot-password"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
                            style={{
                                background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
                            }}
                        >
                            Yeni Bağlantı İste
                        </Link>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Success state
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
                        <h1 className="text-2xl font-bold text-[#F5F3FF] mb-3">Şifre Güncellendi!</h1>
                        <p className="text-[#A197B0] mb-6">
                            Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
                        </p>
                        <div className="w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto" />
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
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-[#A855F7]" />
                        </div>
                        <motion.h1
                            className="text-3xl font-bold headline-serif text-[#F5F3FF] mb-3"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Yeni Şifre Belirleyin
                        </motion.h1>
                        <motion.p
                            className="text-[#A197B0]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Güvenli bir şifre seçin ve hesabınıza erişimi geri kazanın.
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

                        {/* New Password Input */}
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="text-sm font-medium text-[#C4B5FD]">Yeni Şifre</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5F7C] group-focus-within:text-[#A855F7] transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="En az 8 karakter"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-13 pl-12 pr-12 rounded-xl text-[#F5F3FF] placeholder:text-[#6B5F7C] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                                    style={{
                                        background: "rgba(21, 10, 36, 0.6)",
                                        border: "1px solid rgba(124, 58, 237, 0.2)",
                                    }}
                                    required
                                    minLength={8}
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

                        {/* Confirm Password Input */}
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className="text-sm font-medium text-[#C4B5FD]">Şifre Tekrar</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5F7C] group-focus-within:text-[#A855F7] transition-colors" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Şifrenizi tekrar girin"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-13 pl-12 pr-12 rounded-xl text-[#F5F3FF] placeholder:text-[#6B5F7C] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                                    style={{
                                        background: "rgba(21, 10, 36, 0.6)",
                                        border: "1px solid rgba(124, 58, 237, 0.2)",
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5F7C] hover:text-[#A855F7] transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Password Requirements */}
                        <motion.div
                            className="text-sm text-[#6B5F7C]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className={password.length >= 8 ? "text-green-400" : ""}>
                                ✓ En az 8 karakter
                            </p>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading || password.length < 8}
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
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="absolute inset-[-10px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.4)_0%,transparent_60%)] blur-xl" />
                            </span>

                            {isLoading ? (
                                <span className="relative flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Güncelleniyor...
                                </span>
                            ) : (
                                <span className="relative">Şifreyi Güncelle</span>
                            )}
                        </motion.button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
