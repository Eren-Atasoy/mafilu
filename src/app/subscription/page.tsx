"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PLANS } from "@/lib/payment/types";

const planIcons = {
    free: Sparkles,
    basic: Zap,
    premium: Crown,
    producer_pro: Film,
};

const planGradients = {
    free: "from-slate-500 to-slate-600",
    basic: "from-blue-500 to-blue-600",
    premium: "from-purple-500 to-violet-600",
    producer_pro: "from-amber-500 to-orange-600",
};

export default function SubscriptionPage() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubscribe = async (planId: string) => {
        if (planId === "free") {
            router.push("/browse");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSelectedPlan(planId);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId,
                    provider: "stripe", // Default to Stripe, can add selector
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Checkout failed");
            }

            // Redirect to checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Bir hata oluştu");
        } finally {
            setIsLoading(false);
            setSelectedPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0510] relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] opacity-30" style={{
                    background: "radial-gradient(ellipse, rgba(124, 58, 237, 0.2) 0%, transparent 70%)",
                    filter: "blur(100px)"
                }} />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] opacity-20" style={{
                    background: "radial-gradient(ellipse, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
                    filter: "blur(100px)"
                }} />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#C4B5FD] text-sm mb-6">
                            <Sparkles className="w-4 h-4" />
                            Abonelik Planları
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-[#F5F3FF] headline-serif mb-4">
                            Size Uygun Planı Seçin
                        </h1>
                        <p className="text-[#A197B0] text-lg max-w-2xl mx-auto">
                            Bağımsız sinemanın en iyi yapımlarına erişin. İstediğiniz zaman iptal edebilirsiniz.
                        </p>
                    </motion.div>
                </div>

                {/* Error */}
                {error && (
                    <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                        {error}
                    </div>
                )}

                {/* Plans Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SUBSCRIPTION_PLANS.map((plan, index) => {
                        const Icon = planIcons[plan.id as keyof typeof planIcons] || Sparkles;
                        const gradient = planGradients[plan.id as keyof typeof planGradients] || planGradients.free;
                        const isPopular = plan.id === "premium";

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`relative ${isPopular ? "lg:-mt-4 lg:mb-4" : ""}`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white text-xs font-medium">
                                        En Popüler
                                    </div>
                                )}
                                <div
                                    className={`h-full p-6 rounded-2xl border transition-all duration-300 hover:border-[#7C3AED]/50 ${isPopular
                                        ? "border-[#7C3AED]/30 bg-[#150A24]/80"
                                        : "border-[#7C3AED]/10 bg-[#150A24]/50"
                                        }`}
                                >
                                    {/* Plan Icon */}
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Plan Name */}
                                    <h3 className="text-xl font-bold text-[#F5F3FF] mb-1">{plan.name}</h3>
                                    <p className="text-sm text-[#6B5F7C] mb-4">{plan.description}</p>

                                    {/* Price */}
                                    <div className="mb-6">
                                        <span className="text-3xl font-bold text-[#F5F3FF]">
                                            {plan.price === 0 ? "Ücretsiz" : `₺${plan.price}`}
                                        </span>
                                        {plan.price > 0 && (
                                            <span className="text-[#6B5F7C] text-sm">/ay</span>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-2 text-sm text-[#A197B0]">
                                                <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <Button
                                        onClick={() => handleSubscribe(plan.id)}
                                        disabled={isLoading}
                                        className={`w-full ${isPopular
                                            ? "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                                            : plan.price === 0
                                                ? "bg-slate-700 hover:bg-slate-600"
                                                : "bg-[#7C3AED] hover:bg-[#6D28D9]"
                                            }`}
                                    >
                                        {isLoading && selectedPlan === plan.id ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                İşleniyor...
                                            </span>
                                        ) : plan.price === 0 ? (
                                            "Ücretsiz Başla"
                                        ) : (
                                            "Abone Ol"
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* FAQ or Additional Info */}
                <div className="mt-16 text-center">
                    <p className="text-[#6B5F7C] text-sm">
                        Tüm planlar 7 gün ücretsiz deneme süresi içerir. İstediğiniz zaman iptal edebilirsiniz.
                    </p>
                </div>
            </main>
        </div>
    );
}
