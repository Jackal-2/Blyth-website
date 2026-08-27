import type { NextConfig } from "next";

// This is a static marketing site with no client-server data flow (no
// forms, no fetch/API calls, no third-party scripts as of this writing —
// see the security audit that added this), so these can be strict. Revisit
// connect-src/script-src if a contact form or analytics script is ever
// added here. Next.js sets none of this by default, unlike the backend's
// `helmet()` hardening (see Blyth-Backend/src/app.ts).
//
// Content-Security-Policy is NOT set here — it needs a fresh nonce per
// request (for Next's own inline hydration scripts and layout.tsx's inline
// scroll-restoration script), and this config's headers() has no access to
// a per-request value. That header is set in src/middleware.ts instead;
// see the comment there for what broke without it. Everything below is
// genuinely static and safe to set the same way on every response.
async function securityHeaders() {
  return [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  ];
}

const nextConfig: NextConfig = {
  /* config options here */
  agentRules: false,
  async headers() {
    return [{ source: '/(.*)', headers: await securityHeaders() }];
  },
};

export default nextConfig;
