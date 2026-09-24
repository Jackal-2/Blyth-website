import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// media.ts reads MEDIA_BASE_URL at module load time (same reasoning as
// urlSafety.ts/objectStorage.ts elsewhere in this codebase) — each scenario
// needs vi.resetModules() plus a fresh dynamic import, not a shared
// top-level import.

const ORIGINAL = process.env.MEDIA_BASE_URL;

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.MEDIA_BASE_URL;
  else process.env.MEDIA_BASE_URL = ORIGINAL;
  vi.resetModules();
  vi.restoreAllMocks();
});

describe("isOwnMediaUrl", () => {
  it("trusts nothing when MEDIA_BASE_URL is unset", async () => {
    delete process.env.MEDIA_BASE_URL;
    const { isOwnMediaUrl } = await import("../media");
    expect(isOwnMediaUrl("https://media.example.com/listings/abc.jpg")).toBe(false);
  });

  it("accepts a URL on the configured media host with a matching path prefix", async () => {
    process.env.MEDIA_BASE_URL = "https://media.example.com/";
    const { isOwnMediaUrl } = await import("../media");
    expect(isOwnMediaUrl("https://media.example.com/listings/abc.jpg")).toBe(true);
  });

  it("rejects a different host entirely", async () => {
    process.env.MEDIA_BASE_URL = "https://media.example.com/";
    const { isOwnMediaUrl } = await import("../media");
    expect(isOwnMediaUrl("https://cdn.example.com/listings/abc.jpg")).toBe(false);
  });

  it("rejects a look-alike host — a real subdomain/suffix attack, not just a different domain", async () => {
    process.env.MEDIA_BASE_URL = "https://media.example.com/";
    const { isOwnMediaUrl } = await import("../media");
    expect(isOwnMediaUrl("https://media.example.com.attacker.net/x.jpg")).toBe(false);
    expect(isOwnMediaUrl("https://evil-media.example.com/x.jpg")).toBe(false);
  });

  it("rejects bare http even on the right host", async () => {
    process.env.MEDIA_BASE_URL = "https://media.example.com/";
    const { isOwnMediaUrl } = await import("../media");
    expect(isOwnMediaUrl("http://media.example.com/listings/abc.jpg")).toBe(false);
  });

  it("respects a configured path prefix, not just the host", async () => {
    process.env.MEDIA_BASE_URL = "https://cdn.example.com/my-bucket/";
    const { isOwnMediaUrl } = await import("../media");
    expect(isOwnMediaUrl("https://cdn.example.com/my-bucket/listings/abc.jpg")).toBe(true);
    // Same host, but outside the configured prefix — e.g. a different
    // tenant's bucket on a shared provider domain.
    expect(isOwnMediaUrl("https://cdn.example.com/someone-elses-bucket/x.jpg")).toBe(false);
  });

  it("rejects unparsable input rather than throwing", async () => {
    process.env.MEDIA_BASE_URL = "https://media.example.com/";
    const { isOwnMediaUrl } = await import("../media");
    expect(isOwnMediaUrl("not a url")).toBe(false);
  });

  it("treats a malformed MEDIA_BASE_URL as unset (warns, doesn't throw)", async () => {
    process.env.MEDIA_BASE_URL = "not a valid url";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { isOwnMediaUrl } = await import("../media");
    expect(isOwnMediaUrl("https://media.example.com/x.jpg")).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("MEDIA_BASE_URL"));
  });
});
