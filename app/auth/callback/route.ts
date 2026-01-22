import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    console.log("Auth Callback: Processing request", {
      code: !!code,
      next,
      origin,
    });

    if (code) {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        console.log("Auth Callback: Session exchanged successfully", {
          userId: data.session?.user.id,
          hasSession: !!data.session,
        });

        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        let redirectUrl = `${origin}${next}`;
        if (!isLocalEnv && forwardedHost) {
          redirectUrl = `https://${forwardedHost}${next}`;
        }

        console.log("Auth Callback: Redirecting to", redirectUrl);
        return NextResponse.redirect(redirectUrl);
      }

      console.error("Auth Callback: Error exchanging code", error);
    } else {
      console.error("Auth Callback: No code provided");
    }

    return NextResponse.redirect(
      `${origin}/login?error=Could not verify email`,
    );
  } catch (err) {
    console.error("Auth Callback: Unexpected error", err);
    return NextResponse.redirect(
      `${new URL(request.url).origin}/login?error=Server Error`,
    );
  }
}
