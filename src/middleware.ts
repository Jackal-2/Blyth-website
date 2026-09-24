import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkVisitorRateLimit } from "@/lib/visitorRateLimit";

// Share pages/routes hit the backend on every visit (no-store fetches) and
// the backend can't tell visitors apart there — every one of them arrives
// from this site's own server, so a per-IP limit on the backend groups all
// of them into a single client (see shareInternalLimiter on the backend).
// This is the one place a real visitor identity is available, so it's
// checked here first. See visitorRateLimit.ts for the "in-memory, single
// process" caveat and the TRUST_WEBSITE_PROXY tradeoff below.
const SHARE_PATH_PATTERN = /^\/(listings|helpers)\/[^/]+$|^\/api\/photo$/;
const PHOTO_PROXY_PATH = "/api/photo";
const VISITOR_WINDOW_MS = 60 * 1000;
// Generous on purpose — a single helper profile view can legitimately fire
// off a couple dozen photo-proxy requests (one per listing thumbnail).
const VISITOR_MAX_REQUESTS = 60;
// Applied only to the photo proxy, and only in the "shared" (can't tell
// visitors apart) case below — high enough that ordinary shared-bucket
// traffic never trips it, but still a real ceiling on the one route in this
// group that costs the server an outbound fetch per request.
const SHARED_PHOTO_PROXY_MAX_REQUESTS = 1200;

// How many trusted reverse-proxy hops sit in front of this site when
// TRUST_WEBSITE_PROXY is on — 1 for a single load balancer/CDN, 2 for (say)
// a CDN in front of a load balancer that each append their own hop. Taking
// the LAST entry only works for exactly one hop: with two trusted hops in
// front, the last entry is the second proxy's own address, not the
// visitor's. Defaults to 1; anything non-positive or unparsable falls back
// to 1 rather than silently trusting the wrong entry.
function trustedProxyHops(): number {
  const raw = Number(process.env.TRUST_WEBSITE_PROXY_HOPS);
  return Number.isInteger(raw) && raw > 0 ? raw : 1;
}

// Exported for direct testability — not meant to be called from anywhere
// but middleware() below.
export function getVisitorKey(request: NextRequest): string {
  // Next.js no longer reads a real client IP for us — only trust a
  // forwarded-for header when a real reverse proxy is confirmed to be
  // setting it (mirrors the backend's own TRUST_PROXY gate in app.ts, and
  // for the same reason: an untrusted header here can be forged to dodge
  // the limit entirely). Without that confirmation, every visitor shares
  // one bucket for these routes — still a real ceiling, just not a
  // per-visitor one, until TRUST_WEBSITE_PROXY is set.
  //
  // Strict "true" check: TRUST_WEBSITE_PROXY=false is a non-empty string,
  // so a bare truthy check would treat it as enabled.
  if (process.env.TRUST_WEBSITE_PROXY === "true") {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
      // x-forwarded-for is a comma-separated hop list; each trusted proxy
      // appends its own view of the client to the end, so the trustworthy
      // entry is the Nth from the end (N = trustedProxyHops()), not always
      // the very last one. Earlier entries (including the first) are
      // client-supplied and spoofable.
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

// Mints a per-request CSP nonce (production only) so Next's and our own inline scripts run under a strict CSP.
export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  if (SHARE_PATH_PATTERN.test(request.nextUrl.pathname)) {
    const key = getVisitorKey(request);
    const isSharedBucket = key === "shared";
    const isPhotoProxy = request.nextUrl.pathname === PHOTO_PROXY_PATH;
    // "shared" means every visitor on this route is landing in one bucket
    // (TRUST_WEBSITE_PROXY is off) — not a per-visitor limit at all, just a
    // single counter for the whole site's traffic here. Enforcing the
    // normal per-visitor ceiling against that shared counter would 429 every
    // visitor once a single popular listing sees ordinary traffic, long
    // before anyone is actually abusing it. So share pages go unlimited here
    // (a real per-visitor limit needs TRUST_WEBSITE_PROXY set) — the photo
    // proxy still gets checked, at a much higher shared ceiling, since it's
    // the one route here that costs this server an outbound fetch per
    // request even from a perfectly ordinary visitor.
    if (isSharedBucket && !isPhotoProxy) {
      // no limit
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
  // Skip static assets and Next internals — they don't need a nonce. Also
  // skip .well-known: those routes serve Universal Links / App Links domain
  // verification (apple-app-site-association, assetlinks.json) and Apple's
  // and Google's own fetchers check them with no real "visitor" behind the
  // request. Nothing in this middleware currently rate-limits or redirects
  // them, but running .well-known through the same code path as ordinary
  // traffic is exactly the kind of thing a future change here (a redirect,
  // a stricter CSP, a new rate limit) could silently break — domain
  // verification would then fail with no visible error on this site's side.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|\\.well-known).*)"],
};
