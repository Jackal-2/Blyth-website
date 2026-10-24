import type { NextConfig } from "next";

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
  output: 'standalone',
  async headers() {
    return [
      { source: '/(.*)', headers: await securityHeaders() },
      // The email logo (public/email/) is linked from every email Blyth sends,
      // so let mail apps cache it for a day.
      { source: '/email/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }] },
    ];
  },
};

export default nextConfig;
