import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toProxiedImageUrl } from "../photoProxy";

describe("toProxiedImageUrl", () => {
  it("leaves a data: URI untouched (no network request either way)", () => {
    const dataUri =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
    expect(toProxiedImageUrl(dataUri)).toBe(dataUri);
  });

  it("accepts jpg/jpeg/webp data URIs too, case-insensitively", () => {
    expect(toProxiedImageUrl("data:image/JPEG;base64,abc")).toBe("data:image/JPEG;base64,abc");
    expect(toProxiedImageUrl("data:image/jpg;base64,abc")).toBe("data:image/jpg;base64,abc");
    expect(toProxiedImageUrl("data:image/webp;base64,abc")).toBe("data:image/webp;base64,abc");
  });

  it("rewrites an http(s) URL to the same-origin /api/photo proxy, URL-encoded", () => {
    const url = "https://cdn.example.com/photos/a b.jpg?x=1&y=2";
    expect(toProxiedImageUrl(url)).toBe(`/api/photo?u=${encodeURIComponent(url)}`);
  });

  it("never puts the raw URL directly in the result (always goes through encodeURIComponent)", () => {
    const url = "https://evil.example.com/?redirect=//attacker.example.com";
    const proxied = toProxiedImageUrl(url);
    expect(proxied.startsWith("/api/photo?u=")).toBe(true);
    expect(proxied).not.toContain("//attacker.example.com");
  });
});

describe("toProxiedImageUrl — own-media bypass (media.ts)", () => {
  // media.ts (isOwnMediaUrl) reads MEDIA_BASE_URL at module load time — same
  // reasoning as media.test.ts: each scenario needs vi.resetModules() plus a
  // fresh dynamic import of photoProxy.ts (which imports media.ts) rather
  // than the shared top-level import above.
  const ORIGINAL = process.env.MEDIA_BASE_URL;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.MEDIA_BASE_URL;
    else process.env.MEDIA_BASE_URL = ORIGINAL;
    vi.resetModules();
  });

  it("links directly to a URL already on the configured media host, skipping the proxy", async () => {
    process.env.MEDIA_BASE_URL = "https://media.example.com/";
    const { toProxiedImageUrl: proxied } = await import("../photoProxy");
    const url = "https://media.example.com/listings/abc.jpg";
    expect(proxied(url)).toBe(url);
  });

  it("still proxies a different host even with MEDIA_BASE_URL configured", async () => {
    process.env.MEDIA_BASE_URL = "https://media.example.com/";
    const { toProxiedImageUrl: proxied } = await import("../photoProxy");
    const url = "https://cdn.example.com/listings/abc.jpg";
    expect(proxied(url)).toBe(`/api/photo?u=${encodeURIComponent(url)}`);
  });

  it("proxies everything when MEDIA_BASE_URL isn't configured, even a URL that looks like a media host", async () => {
    delete process.env.MEDIA_BASE_URL;
    const { toProxiedImageUrl: proxied } = await import("../photoProxy");
    const url = "https://media.example.com/listings/abc.jpg";
    expect(proxied(url)).toBe(`/api/photo?u=${encodeURIComponent(url)}`);
  });
});
