import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkVisitorRateLimit } from "@/lib/visitorRateLimit";

const SHARE_PATH_PATTERN = /^\/(listings|helpers)\/[^/]+$|^\/api\/photo$/;
const PHOTO_PROXY_PATH = "/api/photo";
const VISITOR_WINDOW_MS = 60 * 1000;
const VISITOR_MAX_REQUESTS = 60;
const SHARED_PHOTO_PROXY_MAX_REQUESTS = 1200;

function trustedProxyHops(): number {
  const raw = Number(process.env.TRUST_WEBSITE_PROXY_HOPS);
  return Number.isInteger(raw) && raw > 0 ? raw : 1;
}

export function getVisitorKey(request: NextRequest): string {
  if (process.env.TRUST_WEBSITE_PROXY === "true") {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
      const hops = forwardedFor
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const ip = hops[hops.length - trustedProxyHops()];
      if (ip) return ip;
    }
  }
  return "shared";
}

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  if (SHARE_PATH_PATTERN.test(request.nextUrl.pathname)) {
    const key = getVisitorKey(request);
    const isSharedBucket = key === "shared";
    const isPhotoProxy = request.nextUrl.pathname === PHOTO_PROXY_PATH;
    if (isSharedBucket && !isPhotoProxy) {
    } else {
      const max = isSharedBucket ? SHARED_PHOTO_PROXY_MAX_REQUESTS : VISITOR_MAX_REQUESTS;
      if (!checkVisitorRateLimit(key, VISITOR_WINDOW_MS, max)) {
        return new NextResponse("Too many requests. Try again in a minute.", { status: 429 });
      }
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|\\.well-known).*)"],
};
