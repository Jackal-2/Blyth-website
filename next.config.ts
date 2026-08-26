import type { NextConfig } from "next";

// This is a static marketing site with no client-server data flow (no
// forms, no fetch/API calls, no third-party scripts as of this writing —
// see the security audit that added this), so the CSP below can be strict.
// Revisit connect-src/script-src if a contact form or analytics script is
// ever added here. Next.js sets none of this by default, unlike the
// backend's `helmet()` hardening (see Blyth-Backend/src/app.ts).
async function securityHeaders() {
  const headers = [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  ];

  // `next dev`'s hot-reload/fast-refresh client relies on eval() and inline
  // <script> injection to patch modules in place — a strict script-src
  // blocks that outright and blanks the whole app. CSP is a production
  // concern anyway (it's there to contain an XSS bug in front of real
  // users), so it's skipped entirely in dev rather than loosened with
  // 'unsafe-eval', which would just mask the dev-only issue instead of
  // fixing it. The other headers above are harmless either way and stay on
  // in dev too, so you can still verify they're present with the network
  // tab if you want.
  if (process.env.NODE_ENV === 'production') {
    const csp = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ');
    headers.push({ key: 'Content-Security-Policy', value: csp });
  }

  return headers;
}

const nextConfig: NextConfig = {
  /* config options here */
  agentRules: false,
  async headers() {
    return [{ source: '/(.*)', headers: await securityHeaders() }];
  },
};

export default nextConfig;
