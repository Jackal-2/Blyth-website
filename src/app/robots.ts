import type { MetadataRoute } from 'next';

// Found missing entirely in the security audit — the marketing site had no robots.txt
// at all. Two things this closes:
//  1. Keeps the internal photo-proxy API route out of crawlers (nothing else under
//     /api needs to be public — see src/app/api).
//  2. Blocks indexing outright on any non-production deploy (VERCEL_ENV is set
//     automatically by Vercel to 'production' | 'preview' | 'development' — no new
//     config needed), so the staging site never gets indexed as duplicate content
//     alongside the real one.
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === 'production'
    : process.env.NODE_ENV === 'production';

  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
  };
}
