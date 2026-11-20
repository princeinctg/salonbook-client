/**
 * Centralised runtime URL configuration.
 *
 * Every API/OAuth URL is resolved here so a missing `NEXT_PUBLIC_*` variable can
 * never make a production deployment fall back to localhost. Local development
 * still uses localhost, and explicit non-localhost configuration always wins.
 */
const LOCAL_API_URL = "http://localhost:5000/api";
const LOCAL_SERVER_URL = "http://localhost:5000";

export const PRODUCTION_API_URL = "https://salonbook-server-kniz.onrender.com/api";
export const PRODUCTION_SERVER_URL = "https://salonbook-server-kniz.onrender.com";
export const PRODUCTION_CLIENT_URL = "https://salonbook-client.vercel.app";

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

/**
 * True when the current page is being served from localhost (or when running a
 * non-production build on the server). On Vercel/preview hosts this is false.
 */
function isLocalRuntime(): boolean {
  if (typeof window !== "undefined") {
    return isLoopbackHost(window.location.hostname);
  }
  return process.env.NODE_ENV !== "production";
}

function resolveUrl(
  configured: string | undefined,
  productionFallback: string,
  localFallback: string
): string {
  const value = configured?.trim();
  // Ignore a localhost value when the app itself is running on a deployed host.
  if (value && !(isLoopbackUrl(value) && !isLocalRuntime())) {
    return trimTrailingSlashes(value);
  }
  return isLocalRuntime() ? localFallback : productionFallback;
}

/** Base URL for Express API requests, always including the `/api` suffix. */
export function getApiBaseUrl(): string {
  return resolveUrl(process.env.NEXT_PUBLIC_API_URL, PRODUCTION_API_URL, LOCAL_API_URL);
}

/** Base URL of the Express server (no `/api` suffix). */
export function getServerBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  const value = explicit?.trim();
  if (value && !(isLoopbackUrl(value) && !isLocalRuntime())) {
    return trimTrailingSlashes(value);
  }

  const fromApi = getApiBaseUrl().replace(/\/api\/?$/, "");
  return (
    trimTrailingSlashes(fromApi) ||
    (isLocalRuntime() ? LOCAL_SERVER_URL : PRODUCTION_SERVER_URL)
  );
}

/**
 * Builds the backend Google OAuth start URL. The backend then redirects to
 * Google and Google returns to the Next.js callback bridge on the client.
 */
export function getGoogleAuthUrl(options: {
  returnTo?: string;
  redirect?: string;
} = {}): string {
  const base = getServerBaseUrl();
  const url = new URL(`${base}/api/auth/google`);
  url.searchParams.set(
    "returnTo",
    options.returnTo ||
      (typeof window !== "undefined" ? window.location.origin : PRODUCTION_CLIENT_URL)
  );
  if (options.redirect) url.searchParams.set("redirect", options.redirect);
  return url.toString();
}
