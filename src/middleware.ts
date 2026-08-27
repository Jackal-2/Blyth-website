import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Runs on every page request so it can mint a fresh nonce per request — the
// static `headers()` config in next.config.ts can't do that, since it has
// no access to a per-request value. This owns the Content-Security-Policy
// header in production; next.config.ts keeps the other, non-per-request
// security headers.
//
// Why this exists: next.config.ts's CSP has `script-src 'self'` with no
// `'unsafe-inline'` and (deliberately, per its own comment) no exception in
// production. Next's App Router injects its own inline <script> tags to
// hydrate streamed Server Component payloads, and layout.tsx has one inline
// script of its own (the scroll-restoration snippet) — both are blocked
// outright by that CSP without a nonce, since inline scripts with no nonce
// and no 'unsafe-inline' never execute. The visible symptom was severe: with
// hydration never completing, every scroll-triggered reveal (react-awesome-
// reveal's Fade, used throughout Hero/FeaturesRing/Testimonials/etc.) stays
// at its initial opacity: 0 forever, and Hero's typewriter heading (TextType)
// never types past its empty initial string — so entire sections render
// literally invisible/empty in production while the plain, unconditional
// markup around them (the navbar links, the Features section's static
// heading) shows up fine. It worked in `next dev` because next.config.ts
// skips the CSP there entirely (also to protect fast refresh, which needs
// eval()).
//
// The fix: mint a nonce, put it in the CSP response header as
// 'nonce-<value>' (Next detects this and automatically applies the same
// nonce to its own internal inline scripts), and also forward it as an
// `x-nonce` request header so a Server Component can read it via
// `headers()` and apply it to layout.tsx's own inline script by hand.
export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
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
  // Everything except static assets and Next's own internals — those don't
  // render HTML that needs a nonce, and skipping them keeps the CSP header
  // (and the crypto.randomUUID() call that builds it) off pure asset
  // requests.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
