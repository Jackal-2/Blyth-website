import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { config, getVisitorKey } from "../middleware";

function fakeRequest(headers: Record<string, string>): NextRequest {
  return { headers: new Headers(headers) } as unknown as NextRequest;
}

// Same shape as fakeRequest above, plus a nextUrl.pathname — middleware()
// itself (not just getVisitorKey) reads that to decide which rate-limit
// branch applies.
function fakeRouteRequest(pathname: string, headers: Record<string, string> = {}): NextRequest {
  return { headers: new Headers(headers), nextUrl: { pathname } } as unknown as NextRequest;
}

const ORIGINAL_TRUST = process.env.TRUST_WEBSITE_PROXY;
const ORIGINAL_HOPS = process.env.TRUST_WEBSITE_PROXY_HOPS;

afterEach(() => {
  if (ORIGINAL_TRUST === undefined) delete process.env.TRUST_WEBSITE_PROXY;
  else process.env.TRUST_WEBSITE_PROXY = ORIGINAL_TRUST;
  if (ORIGINAL_HOPS === undefined) delete process.env.TRUST_WEBSITE_PROXY_HOPS;
  else process.env.TRUST_WEBSITE_PROXY_HOPS = ORIGINAL_HOPS;
});

describe("getVisitorKey", () => {
  it("returns the shared bucket when proxy trust is off", () => {
    delete process.env.TRUST_WEBSITE_PROXY;
    const req = fakeRequest({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getVisitorKey(req)).toBe("shared");
  });

  it("TRUST_WEBSITE_PROXY=false does not enable proxy trust (strict string check)", () => {
    process.env.TRUST_WEBSITE_PROXY = "false";
    const req = fakeRequest({ "x-forwarded-for": "1.2.3.4" });
    expect(getVisitorKey(req)).toBe("shared");
  });

  it("with one trusted hop (default), takes the last entry", () => {
    process.env.TRUST_WEBSITE_PROXY = "true";
    delete process.env.TRUST_WEBSITE_PROXY_HOPS;
    const req = fakeRequest({ "x-forwarded-for": "client-spoofed, real-edge-ip" });
    expect(getVisitorKey(req)).toBe("real-edge-ip");
  });

  it("with two trusted hops, takes the second-from-last entry, not the last", () => {
    process.env.TRUST_WEBSITE_PROXY = "true";
    process.env.TRUST_WEBSITE_PROXY_HOPS = "2";
    // client, cdn, load-balancer — load-balancer's own hop is the least
    // trustworthy of the two proxy-appended entries; the real visitor
    // address is what the CDN (first trusted hop) recorded.
    const req = fakeRequest({ "x-forwarded-for": "client-spoofed, cdn-saw-this-client, load-balancer-ip" });
    expect(getVisitorKey(req)).toBe("cdn-saw-this-client");
  });

  it("falls back to shared when fewer hops are present than configured", () => {
    process.env.TRUST_WEBSITE_PROXY = "true";
    process.env.TRUST_WEBSITE_PROXY_HOPS = "3";
    const req = fakeRequest({ "x-forwarded-for": "only-one-entry" });
    expect(getVisitorKey(req)).toBe("shared");
  });

  it("a non-positive or unparsable hop count falls back to 1 hop", () => {
    process.env.TRUST_WEBSITE_PROXY = "true";
    process.env.TRUST_WEBSITE_PROXY_HOPS = "not-a-number";
    const req = fakeRequest({ "x-forwarded-for": "client-spoofed, real-edge-ip" });
    expect(getVisitorKey(req)).toBe("real-edge-ip");

    process.env.TRUST_WEBSITE_PROXY_HOPS = "0";
    expect(getVisitorKey(req)).toBe("real-edge-ip");

    process.env.TRUST_WEBSITE_PROXY_HOPS = "-1";
    expect(getVisitorKey(req)).toBe("real-edge-ip");
  });

  it("falls back to shared when the header is missing entirely", () => {
    process.env.TRUST_WEBSITE_PROXY = "true";
    const req = fakeRequest({});
    expect(getVisitorKey(req)).toBe("shared");
  });
});

describe("middleware — rate-limit fallback when visitors can't be told apart", () => {
  const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

  beforeEach(() => {
    // middleware() short-circuits (no rate limit, no CSP) outside production.
    process.env.NODE_ENV = "production";
    delete process.env.TRUST_WEBSITE_PROXY;
    // checkVisitorRateLimit keeps its bucket Map at module scope (see
    // visitorRateLimit.ts) — reset the module graph per test so the
    // "shared"/per-visitor-IP buckets used below start fresh, rather than
    // accumulating counts across tests that reuse the same key.
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
    delete process.env.TRUST_WEBSITE_PROXY;
  });

  it("never 429s a share page when every visitor maps to the shared bucket (no real per-visitor limit exists to enforce)", async () => {
    const { middleware } = await import("../middleware");
    // Well past the old shared VISITOR_MAX_REQUESTS (60) — none of these
    // should be blocked now that share pages skip the shared-bucket check.
    for (let i = 0; i < 200; i++) {
      const res = middleware(fakeRouteRequest("/listings/abc123"));
      expect(res.status).not.toBe(429);
    }
  });

  it("still caps the photo proxy under the shared bucket, at a high ceiling rather than no limit at all", async () => {
    const { middleware } = await import("../middleware");
    let blockedAt = -1;
    for (let i = 0; i < 1205; i++) {
      const res = middleware(fakeRouteRequest("/api/photo"));
      if (res.status === 429) {
        blockedAt = i;
        break;
      }
    }
    // 1200 is SHARED_PHOTO_PROXY_MAX_REQUESTS — request #1200 (0-indexed:
    // 1200th call, index 1200) is the first one over the ceiling.
    expect(blockedAt).toBe(1200);
  });

  it("still enforces the normal per-visitor limit on a share page once visitors CAN be told apart", async () => {
    process.env.TRUST_WEBSITE_PROXY = "true";
    const { middleware } = await import("../middleware");
    let blockedAt = -1;
    for (let i = 0; i < 65; i++) {
      const res = middleware(fakeRouteRequest("/listings/abc123", { "x-forwarded-for": "203.0.113.9" }));
      if (res.status === 429) {
        blockedAt = i;
        break;
      }
    }
    // VISITOR_MAX_REQUESTS is 60 — the 61st call (index 60) is the first
    // one over the ceiling. Unchanged by this round's fix, which only
    // touches the "shared" (can't-tell-visitors-apart) case.
    expect(blockedAt).toBe(60);
  });
});

describe("config.matcher — .well-known must bypass this middleware entirely", () => {
  // Next.js applies `matcher` at the framework/edge level before middleware()
  // ever runs, so this can't be exercised by calling middleware() directly —
  // it tests the matcher pattern itself, anchored the same way Next.js
  // anchors it against a request path.
  const matcherRegex = new RegExp(`^${config.matcher[0]}$`);

  it("excludes both .well-known verification paths Universal Links / App Links depend on", () => {
    expect(matcherRegex.test("/.well-known/apple-app-site-association")).toBe(false);
    expect(matcherRegex.test("/.well-known/assetlinks.json")).toBe(false);
  });

  it("still matches ordinary routes that need the CSP nonce and rate limiting", () => {
    expect(matcherRegex.test("/listings/abc123")).toBe(true);
    expect(matcherRegex.test("/api/photo")).toBe(true);
    expect(matcherRegex.test("/")).toBe(true);
  });

  it("still excludes the pre-existing static-asset and favicon exclusions", () => {
    expect(matcherRegex.test("/_next/static/chunk.js")).toBe(false);
    expect(matcherRegex.test("/_next/image?url=x")).toBe(false);
    expect(matcherRegex.test("/favicon.ico")).toBe(false);
  });
});
