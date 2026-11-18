import { NextRequest, NextResponse } from "next/server";

// Google redirects here because this exact URL is the Authorized redirect URI
// registered for the OAuth client in Google Cloud Console. The authorization
// code is then handed to the Express API, which performs the token exchange.
export const dynamic = "force-dynamic";

function getServerBaseUrl(): string {
  const explicit =
    process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "") || "http://localhost:5000";
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const clientOrigin = request.nextUrl.origin;

  const googleError = params.get("error");
  if (googleError) {
    const message = params.get("error_description") || googleError;
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(message)}`, clientOrigin),
      302
    );
  }

  const code = params.get("code");
  const state = params.get("state");

  if (!code) {
    return NextResponse.redirect(
      new URL(
        `/sign-in?error=${encodeURIComponent("Google authorization code missing")}`,
        clientOrigin
      ),
      302
    );
  }

  const target = new URL(`${getServerBaseUrl()}/api/auth/google/callback`);
  target.searchParams.set("code", code);
  if (state) target.searchParams.set("state", state);

  return NextResponse.redirect(target, 302);
}
