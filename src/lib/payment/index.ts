/**
 * Payment Service
 * 
 * Unified interface for payment operations
 */

export * from "./types";
export * from "./stripe";
export * from "./iyzico";

import { createStripeCheckoutSession, isStripeConfigured } from "./stripe";
import { createIyzicoCheckoutSession, isIyzicoConfigured } from "./iyzico";
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
        if (!plan.stripePriceId) {
            throw new Error(`Stripe price not configured for plan: ${planId}`);
        }
        return createStripeCheckoutSession(
            plan.stripePriceId,
            customer,
            successUrl,
            cancelUrl
        );
    }

    if (provider === "iyzico") {
        if (!isIyzicoConfigured()) {
            throw new Error("Iyzico is not configured");
        }
        return createIyzicoCheckoutSession(
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

    if (isIyzicoConfigured()) {
        providers.push("iyzico");
    }

    return providers;
}
