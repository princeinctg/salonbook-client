import { NextRequest, NextResponse } from "next/server";
import { PRODUCTION_SERVER_URL } from "@/lib/config";

// Google redirects here because this exact URL is the Authorized redirect URI
// registered for the OAuth client in Google Cloud Console. The authorization
// code is then handed to the Express API, which performs the token exchange.
export const dynamic = "force-dynamic";

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

function isLoopbackHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]"
  );
}

function isLoopbackUrl(value: string): boolean {
  try {
    return isLoopbackHost(new URL(value).hostname);
  } catch {
    return false;
  }
}

function getServerBaseUrl(): string {
  const isProduction = process.env.NODE_ENV === "production";
  const explicit =
    process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  const value = explicit?.trim();

  // A localhost value must never be used by a deployed Vercel runtime.
  if (value && !(isProduction && isLoopbackUrl(value))) {
    return trimTrailingSlashes(value);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (apiUrl && !(isProduction && isLoopbackUrl(apiUrl))) {
    return trimTrailingSlashes(apiUrl.replace(/\/api\/?$/, ""));
  }

  return isProduction ? PRODUCTION_SERVER_URL : "http://localhost:5000";
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
