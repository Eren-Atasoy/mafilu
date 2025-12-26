import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifyStripeWebhook } from "@/lib/payment/stripe";
import type Stripe from "stripe";

// Use service role for webhook handler
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const headersList = await headers();
        const signature = headersList.get("stripe-signature");

        if (!signature) {
            return NextResponse.json(
                { error: "Missing stripe-signature header" },
                { status: 400 }
            );
        }

        // Verify webhook
        const event = verifyStripeWebhook(body, signature);

        // Handle events
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutComplete(session);
                break;
            }
            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdate(subscription);
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionCanceled(subscription);
                break;
            }
            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                await handlePaymentFailed(invoice);
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Webhook failed" },
            { status: 400 }
        );
    }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) {
        console.error("No userId in session metadata");
        return;
    }

    // The subscription is handled by subscription.created event
    console.log(`Checkout complete for user: ${userId}`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    // Get user from customer
    // In production, you'd store customer ID mapping
    // For now, we'll use metadata from the first item
    const priceId = subscription.items.data[0]?.price.id;

    // Determine plan from price ID
    let planType = "basic";
    if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
        planType = "premium";
    } else if (priceId === process.env.STRIPE_PRODUCER_PRICE_ID) {
        planType = "producer_pro";
    }

    // Upsert subscription in database
    const { error } = await supabaseAdmin
        .from("subscriptions")
        .upsert({
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customerId,
            plan_type: planType,
            status: subscription.status === "active" ? "active" : "past_due",
            current_period_start: new Date((subscription as unknown as { current_period_start: number }).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: "stripe_subscription_id",
        });

    if (error) {
        console.error("Failed to update subscription:", error);
    }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    const { error } = await supabaseAdmin
        .from("subscriptions")
        .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);

    if (error) {
        console.error("Failed to cancel subscription:", error);
    }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    const subscriptionId = (invoice as unknown as { subscription?: string }).subscription;
    if (!subscriptionId) return;

    const { error } = await supabaseAdmin
        .from("subscriptions")
        .update({
            status: "past_due",
            updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscriptionId);

    if (error) {
        console.error("Failed to update subscription status:", error);
    }
}
