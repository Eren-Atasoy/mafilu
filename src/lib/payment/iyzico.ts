/**
 * Iyzico Payment Provider
 * 
 * Handles Turkish payments via Iyzico
 */

import Iyzipay from "iyzipay";
import type { CheckoutSession, CustomerInfo, SubscriptionStatus } from "./types";

// Initialize Iyzico (lazy)
let iyzicoInstance: Iyzipay | null = null;

function getIyzico(): Iyzipay {
    if (!iyzicoInstance) {
        const apiKey = process.env.IYZICO_API_KEY;
        const secretKey = process.env.IYZICO_SECRET_KEY;
        const baseUrl = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

        if (!apiKey || !secretKey) {
            throw new Error("IYZICO_API_KEY and IYZICO_SECRET_KEY are not configured");
        }

        iyzicoInstance = new Iyzipay({
            apiKey,
            secretKey,
            uri: baseUrl,
        });
    }
    return iyzicoInstance;
}

export function isIyzicoConfigured(): boolean {
    return !!(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

/**
 * Create an Iyzico checkout form for subscription
 */
export async function createIyzicoCheckoutSession(
    planId: string,
    price: number,
    customer: CustomerInfo,
    successUrl: string,
    cancelUrl: string
): Promise<CheckoutSession> {
    const iyzico = getIyzico();

    return new Promise((resolve, reject) => {
        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: `sub_${customer.userId}_${Date.now()}`,
            price: price.toString(),
            paidPrice: price.toString(),
            currency: Iyzipay.CURRENCY.TRY,
            basketId: `basket_${customer.userId}`,
            paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
            callbackUrl: successUrl,
            enabledInstallments: [1],
            buyer: {
                id: customer.userId,
                name: customer.name.split(" ")[0] || "Ad",
                surname: customer.name.split(" ").slice(1).join(" ") || "Soyad",
                gsmNumber: "+905000000000", // Placeholder - should be collected
                email: customer.email,
                identityNumber: "11111111111", // Placeholder - should be collected for real
                registrationAddress: "Türkiye",
                ip: "127.0.0.1",
                city: "Istanbul",
                country: "Turkey",
            },
            shippingAddress: {
                contactName: customer.name,
                city: "Istanbul",
                country: "Turkey",
                address: "Türkiye",
            },
            billingAddress: {
                contactName: customer.name,
                city: "Istanbul",
                country: "Turkey",
                address: "Türkiye",
            },
            basketItems: [
                {
                    id: planId,
                    name: `Mafilu ${planId} Abonelik`,
                    category1: "Subscription",
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: price.toString(),
                },
            ],
        };

        iyzico.checkoutFormInitialize.create(request, (err: Error | null, result: {
            status: string;
            paymentPageUrl?: string;
            token?: string;
            errorMessage?: string;
        }) => {
            if (err) {
                reject(err);
                return;
            }

            if (result.status !== "success") {
                reject(new Error(result.errorMessage || "Iyzico checkout failed"));
                return;
            }

            resolve({
                id: result.token || "",
                url: result.paymentPageUrl || "",
                provider: "iyzico",
            });
        });
    });
}

/**
 * Retrieve Iyzico checkout result
 */
export async function retrieveIyzicoCheckoutResult(token: string): Promise<{
    success: boolean;
    paymentId?: string;
    errorMessage?: string;
}> {
    const iyzico = getIyzico();

    return new Promise((resolve, reject) => {
        const request = {
            locale: Iyzipay.LOCALE.TR,
            token,
        };

        iyzico.checkoutForm.retrieve(request, (err: Error | null, result: {
            status: string;
            paymentId?: string;
            errorMessage?: string;
        }) => {
            if (err) {
                reject(err);
                return;
            }

            resolve({
                success: result.status === "success",
                paymentId: result.paymentId,
                errorMessage: result.errorMessage,
            });
        });
    });
}

/**
 * Get subscription status (Iyzico uses recurring payments differently)
 * In production, you'd track this in your database
 */
export async function getIyzicoSubscriptionStatus(
    _userId: string
): Promise<SubscriptionStatus | null> {
    // Iyzico doesn't have a direct subscription API like Stripe
    // You need to track subscriptions in your database
    // This would query your subscriptions table
    return null;
}

/**
 * Cancel Iyzico subscription
 * Since Iyzico uses card storage + recurring charges, 
 * cancellation means stopping future charges
 */
export async function cancelIyzicoSubscription(
    _subscriptionId: string
): Promise<boolean> {
    // In production, mark subscription as cancelled in database
    // and stop recurring payment jobs
    return true;
}
