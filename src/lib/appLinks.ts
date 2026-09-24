// Builds the three kinds of link a share page needs: the web share URL
// itself (also what the QR code encodes), the "open in the app" targets,
// and the app store URLs — one place so a change to the scheme or package
// name doesn't need to be re-typed everywhere it's used. See
// docs/share-links-and-deep-linking.md in the repo root for the full plan.
//
// NEXT_PUBLIC_* here because these render into the page as plain hrefs —
// none of them are secrets.

export type ShareType = "listing" | "helper" | "feed";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blythapp.com";
// Defaults match Blyth-frontend/app.json's "scheme" and bundleIdentifier/
// package — override via env only if those ever diverge from the app.
const SCHEME = process.env.NEXT_PUBLIC_APP_SCHEME ?? "blyth";
// Exported: also needed by the .well-known/assetlinks.json and
// apple-app-site-association route handlers (Universal Links / App Links
// domain verification — see docs/share-links-and-deep-linking.md, Part 4),
// which have to name the exact same app identifiers this file already uses
// to build the blyth:// / intent:// links themselves, so the two can't
// silently drift apart.
export const ANDROID_PACKAGE = process.env.NEXT_PUBLIC_ANDROID_PACKAGE ?? "com.caxapok.blyth";
// iOS's bundle identifier happens to equal ANDROID_PACKAGE's value today
// (see Blyth-frontend/app.json) but is tracked as its own constant/env var
// rather than reused, since nothing guarantees the two stay identical.
export const IOS_BUNDLE_ID = process.env.NEXT_PUBLIC_IOS_BUNDLE_ID ?? "com.caxapok.blyth";

// Unset until the app has a real App Store id — used for the iOS Smart App
// Banner (see generateMetadata in the share pages).
export const IOS_APP_ID = process.env.NEXT_PUBLIC_IOS_APP_ID ?? "";

// Empty until the app is published. Every consumer treats an empty store
// URL as "no store link yet" rather than crashing on it.
export const STORE_URLS = {
  ios: process.env.NEXT_PUBLIC_APP_STORE_URL ?? "",
  android: process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? "",
};

const WEB_PATH: Record<ShareType, string> = { listing: "listings", helper: "helpers", feed: "feed" };

/** The shared link itself — also what the QR code encodes. */
export function webUrlFor(type: ShareType, id: string): string {
  return new URL(`/${WEB_PATH[type]}/${encodeURIComponent(id)}`, SITE_URL).toString();
}

// The mobile app's own Expo Router screen names — NOT the same as the
// website's URL segments above. See Blyth-frontend/app/listing/[id].tsx and
// app/provider/[id].tsx: both singular, and "helper" is "provider" on the
// app side. There's no app/feed/[id].tsx yet, so feed posts have no app
// route of their own — feed/[id]/page.tsx links to the post's author
// profile instead, via appLinksFor("helper", ...).
const APP_PATH: Record<"listing" | "helper", string> = { listing: "listing", helper: "provider" };

// Derived from APP_PATH (which types the app can actually open), NOT from
// WEB_PATH — deliberately excludes "feed". If this listed every WEB_PATH
// segment, the OS would register the app as the handler for /feed/* App
// Links too; since there's no app/feed/[id].tsx screen, a tap on a feed
// share link outside the app would be intercepted, handed to the app, and
// dead-end on the home screen instead of ever showing the feed post's real
// landing page. Stays in sync automatically: a share type only gets
// advertised here once it also gets a real entry in APP_PATH.
export const ASSOCIATED_PATH_PATTERNS = (Object.keys(APP_PATH) as Array<keyof typeof APP_PATH>).map(
  (type) => `/${WEB_PATH[type]}/*`,
);

/**
 * "Open in the app" targets for a listing or helper profile. Android's
 * intent link falls back to the Play Store itself once STORE_URLS.android
 * is set; iOS has no such fallback built into a bare custom-scheme link
 * (Safari just shows an error), which is why the page always shows "Get the
 * app" next to it — see OpenInAppButtons.
 */
export function appLinksFor(type: "listing" | "helper", id: string) {
  const path = `${APP_PATH[type]}/${encodeURIComponent(id)}`;
  const fallback = STORE_URLS.android ? `;S.browser_fallback_url=${encodeURIComponent(STORE_URLS.android)}` : "";
  return {
    ios: `${SCHEME}://${path}`,
    android: `intent://${path}#Intent;scheme=${SCHEME};package=${ANDROID_PACKAGE}${fallback};end`,
  };
}
