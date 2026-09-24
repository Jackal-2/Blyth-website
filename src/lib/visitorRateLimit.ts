// A lightweight, dependency-free, in-memory rate limiter for the share
// pages/routes (see middleware.ts) — the other half of the backend's
// shareInternalLimiter (Blyth-Backend/src/middleware/rateLimit.ts). The
// backend can't tell visitors apart at all here: every share-card request
// it sees arrives from this website's own server, so its per-IP limiter
// groups every visitor into one client. This limiter runs a step earlier,
// on the website itself, which is the one place a real visitor IP is
// actually available — so one visitor hammering a share page hits their
// own limit here before it can even reach the backend's shared allowance.
//
// Deliberately simple, and deliberately not a full solution:
//  - In-memory only. Fine for a single Node process (this site's current
//    "next start" / one-container deployment); a multi-instance deployment
//    would need a shared store (e.g. Redis, which the backend already uses
//    — see Blyth-Backend/src/utils/realtimeAdapter.ts) instead, since each
//    instance would otherwise track its own separate counts.
//  - The visitor "key" is only as trustworthy as the request headers this
//    site is willing to trust — see getVisitorKey in middleware.ts, which
//    only reads a forwarded-for header when TRUST_WEBSITE_PROXY says a real
//    reverse proxy is actually setting it (mirrors the backend's own
//    TRUST_PROXY gate in app.ts, for the same reason: trusting that header
//    blindly lets it be forged to dodge the limit entirely).

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Sweeps expired buckets periodically instead of on every check, so this
// stays cheap under load — Map.size only grows with distinct keys/window.
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
let lastSweep = Date.now();
function sweepExpired(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkVisitorRateLimit(key: string, windowMs: number, max: number): boolean {
  const now = Date.now();
  sweepExpired(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  existing.count += 1;
  return existing.count <= max;
}
