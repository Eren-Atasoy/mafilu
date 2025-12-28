/**
 * Stripe Payment Provider
 * 
 * Handles international payments via Stripe
 */

import Stripe from "stripe";
import type { CheckoutSession, CustomerInfo, SubscriptionStatus } from "./types";

// Initialize Stripe (lazy to avoid issues during build)
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
    if (!stripeInstance) {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            throw new Error("STRIPE_SECRET_KEY is not configured. Please add it to .env.local. See STRIPE_SETUP.md for instructions.");
        }
        
        // Validate test key format (helpful error message)
        if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("sk_live_")) {
            throw new Error("Invalid Stripe key format. Secret keys must start with 'sk_test_' (test mode) or 'sk_live_' (live mode). See STRIPE_SETUP.md for instructions.");
        }
        
        stripeInstance = new Stripe(secretKey, {
            apiVersion: "2024-12-18.acacia" as any, // Bypass TS check for specific version string conflict
        });
    }
    return stripeInstance;
}

export function isStripeConfigured(): boolean {
    return !!process.env.STRIPE_SECRET_KEY;
}

/**
 * Create a Stripe checkout session for subscription
 */
export async function createStripeCheckoutSession(
    priceId: string,
    customer: CustomerInfo,
    successUrl: string,
    cancelUrl: string
): Promise<CheckoutSession> {
    const stripe = getStripe();

    // Check if customer exists
    const existingCustomers = await stripe.customers.list({
        email: customer.email,
        limit: 1,
    });

    let customerId = existingCustomers.data[0]?.id;

    if (!customerId) {
        const newCustomer = await stripe.customers.create({
            email: customer.email,
            name: customer.name,
            metadata: {
                userId: customer.userId,
            },
        });
        customerId = newCustomer.id;
    }

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
            userId: customer.userId,
        },
    });

    return {
        id: session.id,
        url: session.url || "",
        provider: "stripe",
    };
}

/**
 * Get subscription status for a customer
 */
export async function getStripeSubscriptionStatus(
    customerId: string
): Promise<SubscriptionStatus | null> {
    const stripe = getStripe();

    const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
    });

    const subscription = subscriptions.data[0];
    if (!subscription) return null;

    return {
        active: subscription.status === "active",
        planId: subscription.items.data[0]?.price.id || "",
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        provider: "stripe",
    };
}

/**
 * Cancel a Stripe subscription
 */
export async function cancelStripeSubscription(
    subscriptionId: string,
    immediate = false
): Promise<boolean> {
    const stripe = getStripe();

    try {
        if (immediate) {
            await stripe.subscriptions.cancel(subscriptionId);
        } else {
            await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true,
            });
        }
        return true;
    } catch (error) {
        console.error("Failed to cancel Stripe subscription:", error);
        return false;
    }
}

/**
 * Create a Stripe customer portal session
 */
export async function createStripePortalSession(
    customerId: string,
    returnUrl: string
): Promise<string> {
    const stripe = getStripe();

    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });

    return session.url;
}

/**
 * Verify Stripe webhook signature
 */
export function verifyStripeWebhook(
    payload: string | Buffer,
    signature: string
): Stripe.Event {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
