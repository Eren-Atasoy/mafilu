import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession, getAvailableProviders } from "@/lib/payment";
import type { PaymentProvider } from "@/lib/payment";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Check auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get request body
        const { planId, provider } = await request.json() as {
            planId: string;
            provider: PaymentProvider;
        };

        if (!planId || !provider) {
            return NextResponse.json(
                { error: "planId and provider are required" },
                { status: 400 }
            );
        }

        // Check provider availability
        const availableProviders = getAvailableProviders();
        if (!availableProviders.includes(provider)) {
            return NextResponse.json(
                { error: `Provider ${provider} is not configured` },
                { status: 400 }
            );
        }

        // Get user profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, full_name, email")
            .eq("id", user.id)
            .single();

        const customerName = profile?.display_name || profile?.full_name || "Customer";
        const customerEmail = profile?.email || user.email || "";

        // Create checkout session
        const origin = request.headers.get("origin") || "http://localhost:3000";
        const successUrl = `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${origin}/subscription/cancel`;

        const session = await createCheckoutSession(
            planId,
            {
                userId: user.id,
                email: customerEmail,
                name: customerName,
            },
            provider,
            successUrl,
            cancelUrl
        );

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
            provider: session.provider,
        });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Checkout failed" },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Return available providers and plans
    const providers = getAvailableProviders();

    return NextResponse.json({
        providers,
        configured: providers.length > 0,
    });
}
