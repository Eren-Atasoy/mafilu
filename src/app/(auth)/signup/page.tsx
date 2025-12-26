"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Eye, EyeOff, Check, Sparkles, Stars } from "lucide-react";

export default function SignupPage() {
    const supabase = createClient();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const passwordRequirements = [
        { met: password.length >= 8, text: "En az 8 karakter" },
        { met: /[A-Z]/.test(password), text: "En az 1 büyük harf" },
        { met: /[0-9]/.test(password), text: "En az 1 rakam" },
    ];

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor");
            setIsLoading(false);
            return;
        }

        if (!passwordRequirements.every(req => req.met)) {
            setError("Şifre gereksinimlerini karşılamıyor");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
            }
        } catch {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    // Success State
    if (success) {
        return (
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative">
                    {/* Glow */}
                    <div
                        className="absolute -inset-4 opacity-60 blur-3xl"
                        style={{
                            background: "radial-gradient(ellipse at center, rgba(34, 197, 94, 0.3) 0%, transparent 70%)"
                        }}
                    />

                    <div className="relative glass-card p-10 text-center">
                        {/* Success Icon */}
                        <motion.div
                            className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
                            style={{
                                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(52, 211, 153, 0.1) 100%)",
                                border: "1px solid rgba(34, 197, 94, 0.3)"
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Check className="w-10 h-10 text-emerald-400" />
                            </motion.div>
                        </motion.div>

                        <motion.h2
                            className="text-2xl font-bold headline-serif text-[#F5F3FF] mb-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            E-postanızı Kontrol Edin
                        </motion.h2>

                        <motion.p
                            className="text-[#A197B0] mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Hesabınızı doğrulamak için{" "}
                            <span className="text-[#C4B5FD] font-medium">{email}</span>{" "}
                            adresine bir doğrulama bağlantısı gönderdik.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link href="/login">
                                <button
                                    className="w-full h-12 rounded-xl font-medium transition-all duration-300"
                                    style={{
                                        background: "rgba(139, 92, 246, 0.1)",
                                        border: "1px solid rgba(139, 92, 246, 0.3)",
                                        color: "#C4B5FD"
                                    }}
                                >
                                    Giriş Sayfasına Dön
                                </button>
                            </Link>
                        </motion.div>
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
            {/* Card */}
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
                            <Stars className="w-4 h-4 text-[#A855F7]" />
                            <span className="text-sm text-[#C4B5FD]">Yolculuğunuz burada başlıyor</span>
                        </motion.div>

                        <motion.h1
                            className="text-3xl font-bold headline-serif text-[#F5F3FF] mb-3"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Hesap Oluşturun
                        </motion.h1>
                        <motion.p
                            className="text-[#A197B0]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Bağımsız sinema dünyasına katılın
                        </motion.p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    className="p-4 rounded-xl text-sm"
                                    style={{
                                        background: "rgba(239, 68, 68, 0.1)",
                                        border: "1px solid rgba(239, 68, 68, 0.2)",
                                    }}
                                    initial={{ opacity: 0, scale: 0.95, height: 0 }}
                                    animate={{ opacity: 1, scale: 1, height: "auto" }}
                                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                >
                                    <p className="text-red-400">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Full Name Input */}
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="text-sm font-medium text-[#C4B5FD]">Ad Soyad</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5F7C] group-focus-within:text-[#A855F7] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Adınız ve soyadınız"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full h-13 pl-12 pr-4 rounded-xl text-[#F5F3FF] placeholder:text-[#6B5F7C] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                                    style={{
                                        background: "rgba(21, 10, 36, 0.6)",
                                        border: "1px solid rgba(124, 58, 237, 0.2)",
                                    }}
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Email Input */}
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
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
                            transition={{ delay: 0.6 }}
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

                            {/* Password Requirements */}
                            <div className="grid grid-cols-3 gap-2 pt-2">
                                {passwordRequirements.map((req, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex items-center gap-1.5"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.7 + i * 0.1 }}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${req.met
                                                ? 'bg-emerald-500/20 border-emerald-500/50'
                                                : 'bg-[#1A0B2E] border-[#6B5F7C]/30'
                                                }`}
                                            style={{ border: "1px solid" }}
                                        >
                                            {req.met && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                                        </div>
                                        <span className={`text-xs transition-colors ${req.met ? 'text-emerald-400' : 'text-[#6B5F7C]'}`}>
                                            {req.text}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Confirm Password */}
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <label className="text-sm font-medium text-[#C4B5FD]">Şifre Tekrar</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5F7C] group-focus-within:text-[#A855F7] transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-13 pl-12 pr-4 rounded-xl text-[#F5F3FF] placeholder:text-[#6B5F7C] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                                    style={{
                                        background: "rgba(21, 10, 36, 0.6)",
                                        border: `1px solid ${password && confirmPassword && password !== confirmPassword ? 'rgba(239, 68, 68, 0.5)' : 'rgba(124, 58, 237, 0.2)'}`,
                                    }}
                                    required
                                />
                                {password && confirmPassword && password === confirmPassword && (
                                    <motion.div
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <Check className="w-5 h-5 text-emerald-400" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full h-13 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            style={{
                                background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #7C3AED 100%)",
                                backgroundSize: "200% 200%",
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            {/* Glow effect */}
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="absolute inset-[-10px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.4)_0%,transparent_60%)] blur-xl" />
                            </span>

                            {isLoading ? (
                                <span className="relative flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Hesap oluşturuluyor...
                                </span>
                            ) : (
                                <span className="relative flex items-center justify-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Kayıt Ol
                                </span>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <motion.div
                        className="my-8 flex items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-transparent" />
                        <span className="text-sm text-[#6B5F7C]">veya</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-transparent" />
                    </motion.div>

                    {/* Login Link */}
                    <motion.p
                        className="text-center text-[#A197B0]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                    >
                        Zaten hesabınız var mı?{" "}
                        <Link
                            href="/login"
                            className="text-[#A855F7] hover:text-[#C4B5FD] font-medium transition-colors"
                        >
                            Giriş yapın
                        </Link>
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
}
