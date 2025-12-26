import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const type = requestUrl.searchParams.get("type"); // signup, recovery, invite, etc.
    const next = requestUrl.searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Email confirmation - redirect to login with success message
            if (type === "signup" || type === "email") {
                return NextResponse.redirect(
                    new URL("/login?confirmed=true", requestUrl.origin)
                );
            }

            // Password recovery - redirect to password reset page
            if (type === "recovery") {
                return NextResponse.redirect(
                    new URL("/reset-password", requestUrl.origin)
                );
            }

            // Default - redirect to dashboard
            return NextResponse.redirect(new URL(next, requestUrl.origin));
        }
    }

    // Auth code error - redirect to login with error
    return NextResponse.redirect(
        new URL("/login?error=auth_callback_error", requestUrl.origin)
    );
}

