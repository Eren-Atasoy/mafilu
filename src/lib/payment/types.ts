/**
 * Payment Provider Abstraction Layer
 * 
 * Supports both Stripe (international) and PayTR (Turkey)
 */

export type PaymentProvider = "stripe" | "paytr";

export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: "USD" | "TRY";
    interval: "month" | "year";
    features: string[];
    stripePriceId?: string;
}

export interface CheckoutSession {
    id: string;
    url: string;
    provider: PaymentProvider;
}

export interface SubscriptionStatus {
    active: boolean;
    planId: string;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    provider: PaymentProvider;
}

export interface CustomerInfo {
    email: string;
    name: string;
    userId: string;
}

// Subscription Plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: "free",
        name: "Ücretsiz",
        description: "Temel erişim",
        price: 0,
        currency: "TRY",
        interval: "month",
        features: [
            "Sınırlı film izleme",
            "Standart kalite (720p)",
            "Reklamlı içerik",
        ],
    },
    {
        id: "basic",
        name: "Temel",
        description: "Bağımsız sinema tutkunları için",
        price: 49.99,
        currency: "TRY",
        interval: "month",
        features: [
            "Sınırsız film izleme",
            "HD kalite (1080p)",
            "Reklamsız deneyim",
            "1 cihaz",
        ],
        stripePriceId: process.env.STRIPE_BASIC_PRICE_ID || "price_test_basic", // Test price ID - replace with real one from Stripe
    },
    {
        id: "premium",
        name: "Premium",
        description: "Tam deneyim",
        price: 99.99,
        currency: "TRY",
        interval: "month",
        features: [
            "Sınırsız film izleme",
            "4K Ultra HD kalite",
            "Reklamsız deneyim",
            "4 cihaz aynı anda",
            "Çevrimdışı indirme",
            "Erken erişim yapımları",
        ],
        stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID || "price_test_premium", // Test price ID - replace with real one from Stripe
    },
    {
        id: "producer_pro",
        name: "Yapımcı Pro",
        description: "Filmlerinizi yayınlayın",
        price: 199.99,
        currency: "TRY",
        interval: "month",
        features: [
            "Premium üyelik tüm avantajları",
            "Sınırsız film yükleme",
            "Gelişmiş analitik",
            "Öncelikli destek",
            "%70 gelir paylaşımı",
        ],
        stripePriceId: process.env.STRIPE_PRODUCER_PRICE_ID || "price_test_producer", // Test price ID - replace with real one from Stripe
    },
];

export function getPlanById(planId: string): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId);
}

export function getDefaultProvider(currency?: string): PaymentProvider {
    // Default to PayTR for TRY, Stripe for others
    return currency === "TRY" ? "paytr" : "stripe";
}
