/**
 * PayTR Payment Provider
 * 
 * Handles Turkish payments via PayTR iFrame API
 */

import crypto from "crypto";
import type { CheckoutSession, CustomerInfo, SubscriptionStatus } from "./types";

export function isPaytrConfigured(): boolean {
    return !!(
        process.env.PAYTR_MERCHANT_ID &&
        process.env.PAYTR_MERCHANT_KEY &&
        process.env.PAYTR_MERCHANT_SALT
    );
}

/**
 * Generate PayTR Token for iFrame
 */
export async function createPaytrCheckoutSession(
    planId: string,
    price: number,
    customer: CustomerInfo,
    successUrl: string,
    cancelUrl: string
): Promise<CheckoutSession> {
    const merchantId = process.env.PAYTR_MERCHANT_ID;
    const merchantKey = process.env.PAYTR_MERCHANT_KEY;
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

    if (!merchantId || !merchantKey || !merchantSalt) {
        throw new Error("PayTR credentials are not configured");
    }

    const merchantOid = `ord_${customer.userId}_${Date.now()}`;
    const userIp = "127.0.0.1"; // In production, get meaningful IP
    const email = customer.email;
    const paymentAmount = Math.round(price * 100); // Kuruş cinsinden

    // Basket
    const userBasket = JSON.stringify([
        [`Mafilu ${planId} Abonelik`, price.toString(), 1]
    ]);

    // Token generation logic
    const noInstallment = "1"; // Taksit yok
    const maxInstallment = "1";
    const currency = "TL";
    const testMode = process.env.NODE_ENV === "production" ? "0" : "1";

    const rawStr = `${merchantId}${userIp}${merchantOid}${email}${paymentAmount}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`;
    const paytrToken = crypto
        .createHmac("sha256", merchantKey + merchantSalt)
        .update(rawStr)
        .digest("base64");

    // PayTR requires a POST request to get the actual token for the iframe
    // Note: For iFrame integration, you normally get a token to render the iframe on client side.
    // However, since we are abstracting this as a checkout URL redirection (like Stripe):
    // PayTR direct link implementation is different. 
    // Here we will return a special URL to our own internal page that renders the PayTR iframe.

    // For this abstraction, we'll return a URL to a local page that renders the iframe
    // using the parameters we just prepared. 
    // Ideally, we should POST to PayTR here to get the token, but PayTR iFrame API works by POSTing from the frontend or backend then rendering.

    // Simplified: We'll assume we have an endpoint that handles the POST and rendering.
    // For now, let's implement the actual POST request to PayTR to get the token if possible,
    // or setup the flow.

    // Actually, PayTR documentation says: Request to https://www.paytr.com/odeme/api/get-token
    const formData = new URLSearchParams();
    formData.append("merchant_id", merchantId);
    formData.append("user_ip", userIp);
    formData.append("merchant_oid", merchantOid);
    formData.append("email", email);
    formData.append("payment_amount", paymentAmount.toString());
    formData.append("paytr_token", paytrToken);
    formData.append("user_basket", userBasket);
    formData.append("debug_on", "1");
    formData.append("no_installment", noInstallment);
    formData.append("max_installment", maxInstallment);
    formData.append("user_name", customer.name);
    formData.append("user_address", "Istanbul, Turkey"); // Placeholder
    formData.append("user_phone", "05555555555"); // Placeholder
    formData.append("merchant_ok_url", successUrl);
    formData.append("merchant_fail_url", cancelUrl);
    formData.append("timeout_limit", "30");
    formData.append("currency", currency);
    formData.append("test_mode", testMode);

    try {
        const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        const result = await response.json();

        if (result.status === "success") {
            // PayTR returns a token. The frontend needs to inject this into an iframe.
            // Since our abstraction expects a redirect URL, we can redirect to an internal page
            // that accepts this token and renders the iframe.
            return {
                id: result.token,
                url: `/payment/paytr?token=${result.token}`,
                provider: "paytr",
            };
        } else {
            console.error("PayTR Token Error:", result.reason);
            throw new Error(`PayTR initialization failed: ${result.reason}`);
        }
    } catch (error) {
        console.error("PayTR Request Error:", error);
        throw error;
    }
}

/**
 * Subscription Status
 * PayTR is not a subscription engine like Stripe. It processes payments.
 * You handle recurrence in your own DB.
 */
export async function getPaytrSubscriptionStatus(
    _userId: string
): Promise<SubscriptionStatus | null> {
    return null;
}

export async function cancelPaytrSubscription(
    _subscriptionId: string
): Promise<boolean> {
    return true;
}
