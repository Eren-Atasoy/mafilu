/**
 * Payment Service
 * 
 * Unified interface for payment operations
 */

export * from "./types";
export * from "./stripe";
export * from "./paytr";

import { createStripeCheckoutSession, isStripeConfigured } from "./stripe";
import { createPaytrCheckoutSession, isPaytrConfigured } from "./paytr";
import type { PaymentProvider, CheckoutSession, CustomerInfo } from "./types";
import { getPlanById } from "./types";

/**
 * Create a checkout session with the appropriate provider
 */
export async function createCheckoutSession(
    planId: string,
    customer: CustomerInfo,
    provider: PaymentProvider,
    successUrl: string,
    cancelUrl: string
): Promise<CheckoutSession> {
    const plan = getPlanById(planId);

    if (!plan) {
        throw new Error(`Plan not found: ${planId}`);
    }

    if (plan.price === 0) {
        throw new Error("Cannot checkout free plan");
    }

    if (provider === "stripe") {
        if (!isStripeConfigured()) {
            throw new Error("Stripe is not configured");
        }
        if (!plan.stripePriceId || plan.stripePriceId.startsWith("price_xxx") || plan.stripePriceId === "price_test_") {
            throw new Error(
                `Stripe price not configured for plan: ${planId}. ` +
                `Please create a product and price in Stripe Dashboard and add the price ID to .env.local. ` +
                `See STRIPE_PRICE_SETUP.md for instructions.`
            );
        }
        return createStripeCheckoutSession(
            plan.stripePriceId,
            customer,
            successUrl,
            cancelUrl
        );
    }

    if (provider === "paytr") {
        if (!isPaytrConfigured()) {
            throw new Error("PayTR is not configured");
        }
        return createPaytrCheckoutSession(
            planId,
            plan.price,
            customer,
            successUrl,
            cancelUrl
        );
    }

    throw new Error(`Unknown provider: ${provider}`);
}

/**
 * Get available payment providers
 */
export function getAvailableProviders(): PaymentProvider[] {
    const providers: PaymentProvider[] = [];

    if (isStripeConfigured()) {
        providers.push("stripe");
    }

    if (isPaytrConfigured()) {
        providers.push("paytr");
    }

    return providers;
}
