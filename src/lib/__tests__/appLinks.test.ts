import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// appLinks.ts reads its env vars at module load time (same reasoning as
// media.ts/urlSafety.ts elsewhere in this codebase) — each scenario needs
// vi.resetModules() plus a fresh dynamic import, not a shared top-level
// import.

const ENV_KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_APP_SCHEME",
  "NEXT_PUBLIC_ANDROID_PACKAGE",
  "NEXT_PUBLIC_IOS_BUNDLE_ID",
  "NEXT_PUBLIC_APP_STORE_URL",
  "NEXT_PUBLIC_PLAY_STORE_URL",
] as const;

let original: Record<string, string | undefined>;

beforeEach(() => {
  original = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
  vi.resetModules();
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (original[k] === undefined) delete process.env[k];
    else process.env[k] = original[k];
  }
  vi.resetModules();
});

describe("webUrlFor", () => {
  it("defaults to the real production domain when NEXT_PUBLIC_SITE_URL is unset", async () => {
    for (const k of ENV_KEYS) delete process.env[k];
    const { webUrlFor } = await import("../appLinks");
    expect(webUrlFor("listing", "abc123")).toBe("https://blythapp.com/listings/abc123");
  });

  it("uses the website's own plural URL segments (listings/helpers/feed)", async () => {
    for (const k of ENV_KEYS) delete process.env[k];
    const { webUrlFor } = await import("../appLinks");
    expect(webUrlFor("helper", "xyz789")).toBe("https://blythapp.com/helpers/xyz789");
    expect(webUrlFor("feed", "p1")).toBe("https://blythapp.com/feed/p1");
  });

  it("respects NEXT_PUBLIC_SITE_URL when set", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://staging.example.com";
    const { webUrlFor } = await import("../appLinks");
    expect(webUrlFor("listing", "abc123")).toBe("https://staging.example.com/listings/abc123");
  });

  it("URL-encodes the id", async () => {
    for (const k of ENV_KEYS) delete process.env[k];
    const { webUrlFor } = await import("../appLinks");
    expect(webUrlFor("listing", "has space")).toContain("has%20space");
  });
});

describe("appLinksFor", () => {
  it("uses the app's real singular route names, not the website's plural ones", async () => {
    // Blyth-frontend/app/listing/[id].tsx and app/provider/[id].tsx are
    // singular and "provider" (not "helper") — a bug here would send every
    // tap on the app link to a route that doesn't exist.
    for (const k of ENV_KEYS) delete process.env[k];
    const { appLinksFor } = await import("../appLinks");
    expect(appLinksFor("listing", "abc123").ios).toBe("blyth://listing/abc123");
    expect(appLinksFor("helper", "xyz789").ios).toBe("blyth://provider/xyz789");
  });

  it("defaults the scheme and Android package to the real app.json values", async () => {
    for (const k of ENV_KEYS) delete process.env[k];
    const { appLinksFor } = await import("../appLinks");
    const android = appLinksFor("listing", "abc123").android;
    expect(android).toContain("scheme=blyth;");
    expect(android).toContain("package=com.caxapok.blyth;");
  });

  it("omits the browser_fallback_url when the Play Store URL isn't set yet", async () => {
    for (const k of ENV_KEYS) delete process.env[k];
    const { appLinksFor } = await import("../appLinks");
    expect(appLinksFor("listing", "abc123").android).not.toContain("browser_fallback_url");
  });

  it("includes an encoded browser_fallback_url once the Play Store URL is set", async () => {
    for (const k of ENV_KEYS) delete process.env[k];
    process.env.NEXT_PUBLIC_PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.caxapok.blyth";
    const { appLinksFor } = await import("../appLinks");
    const android = appLinksFor("listing", "abc123").android;
    expect(android).toContain(
      `S.browser_fallback_url=${encodeURIComponent("https://play.google.com/store/apps/details?id=com.caxapok.blyth")}`,
    );
  });

  it("URL-encodes the id in both the iOS and Android links", async () => {
    for (const k of ENV_KEYS) delete process.env[k];
    const { appLinksFor } = await import("../appLinks");
    const links = appLinksFor("listing", "has space");
    expect(links.ios).toBe("blyth://listing/has%20space");
    expect(links.android).toContain("listing/has%20space");
  });

  it("respects env overrides for the scheme and package", async () => {
    process.env.NEXT_PUBLIC_APP_SCHEME = "blythdev";
    process.env.NEXT_PUBLIC_ANDROID_PACKAGE = "com.caxapok.blyth.dev";
    const { appLinksFor } = await import("../appLinks");
    const links = appLinksFor("listing", "abc123");
    expect(links.ios).toBe("blythdev://listing/abc123");
    expect(links.android).toContain("scheme=blythdev;package=com.caxapok.blyth.dev;");
  });
});

describe("STORE_URLS", () => {
  it("is empty until the app is published, rather than undefined", async () => {
    for (const k of ENV_KEYS) delete process.env[k];
    const { STORE_URLS } = await import("../appLinks");
    expect(STORE_URLS.ios).toBe("");
    expect(STORE_URLS.android).toBe("");
  });
});

// ANDROID_PACKAGE, IOS_BUNDLE_ID and ASSOCIATED_PATH_PATTERNS are consumed
// by the .well-known/apple-app-site-association and .well-known/
// assetlinks.json route handlers (Universal Links / App Links domain
// verification) — exported from here specifically so those files can't
// silently drift from the identifiers appLinksFor already uses to build
// the blyth:// / intent:// links themselves.
describe("ANDROID_PACKAGE / IOS_BUNDLE_ID — exported for the .well-known route handlers", () => {
  it("default to the real app.json values", async () => {
    for (const k of ENV_KEYS) delete process.env[k];
    const { ANDROID_PACKAGE, IOS_BUNDLE_ID } = await import("../appLinks");
    expect(ANDROID_PACKAGE).toBe("com.caxapok.blyth");
    expect(IOS_BUNDLE_ID).toBe("com.caxapok.blyth");
  });

  it("respects env overrides independently of each other", async () => {
    process.env.NEXT_PUBLIC_ANDROID_PACKAGE = "com.caxapok.blyth.dev";
    process.env.NEXT_PUBLIC_IOS_BUNDLE_ID = "com.caxapok.blyth.staging";
    const { ANDROID_PACKAGE, IOS_BUNDLE_ID } = await import("../appLinks");
    expect(ANDROID_PACKAGE).toBe("com.caxapok.blyth.dev");
    expect(IOS_BUNDLE_ID).toBe("com.caxapok.blyth.staging");
  });
});

describe("ASSOCIATED_PATH_PATTERNS", () => {
  it("derives one wildcard pattern per type that has a real app route, matching the website's own plural URL segments", async () => {
    for (const k of ENV_KEYS) delete process.env[k];
    const { ASSOCIATED_PATH_PATTERNS } = await import("../appLinks");
    expect(ASSOCIATED_PATH_PATTERNS.sort()).toEqual(["/helpers/*", "/listings/*"].sort());
  });

  it("excludes /feed — there's no app/feed/[id].tsx screen for the OS to hand a tap to", async () => {
    for (const k of ENV_KEYS) delete process.env[k];
    const { ASSOCIATED_PATH_PATTERNS } = await import("../appLinks");
    expect(ASSOCIATED_PATH_PATTERNS).not.toContain("/feed/*");
  });
});
