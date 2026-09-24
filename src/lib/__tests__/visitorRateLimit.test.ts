import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkVisitorRateLimit } from "../visitorRateLimit";

// The module keeps its bucket Map at module scope, so isolate each test with
// its own key rather than resetting module state between them.
let keySeq = 0;
function freshKey() {
  keySeq += 1;
  return `visitor-${keySeq}`;
}

describe("checkVisitorRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the max within the window", () => {
    const key = freshKey();
    for (let i = 0; i < 5; i++) {
      expect(checkVisitorRateLimit(key, 60_000, 5)).toBe(true);
    }
  });

  it("blocks once the max is exceeded within the window", () => {
    const key = freshKey();
    for (let i = 0; i < 5; i++) checkVisitorRateLimit(key, 60_000, 5);
    expect(checkVisitorRateLimit(key, 60_000, 5)).toBe(false);
  });

  it("resets the count once the window has elapsed", () => {
    const key = freshKey();
    for (let i = 0; i < 5; i++) checkVisitorRateLimit(key, 60_000, 5);
    expect(checkVisitorRateLimit(key, 60_000, 5)).toBe(false);

    vi.advanceTimersByTime(60_001);
    expect(checkVisitorRateLimit(key, 60_000, 5)).toBe(true);
  });

  it("keeps separate buckets per key — one visitor's limit doesn't affect another's", () => {
    const keyA = freshKey();
    const keyB = freshKey();
    for (let i = 0; i < 5; i++) checkVisitorRateLimit(keyA, 60_000, 5);
    expect(checkVisitorRateLimit(keyA, 60_000, 5)).toBe(false);
    expect(checkVisitorRateLimit(keyB, 60_000, 5)).toBe(true);
  });

  it("falls back to a single shared bucket when every visitor maps to the same key", () => {
    // This is the getVisitorKey(request) === "shared" case in middleware.ts —
    // every caller is grouped into one bucket, which the middleware relies on
    // as a ceiling (not a per-visitor limit) when TRUST_WEBSITE_PROXY is off.
    const sharedKey = "shared";
    let allowedCount = 0;
    for (let i = 0; i < 10; i++) {
      if (checkVisitorRateLimit(sharedKey, 60_000, 3)) allowedCount++;
    }
    expect(allowedCount).toBe(3);
  });
});
