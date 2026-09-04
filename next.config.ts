import type { NextConfig } from "next";

// CSP is set per-request in src/middleware.ts instead (needs a nonce); these headers are static.
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
  agentRules: false,
  async headers() {
    return [{ source: '/(.*)', headers: await securityHeaders() }];
  },
};

export default nextConfig;
