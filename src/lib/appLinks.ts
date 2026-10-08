
export type ShareType = "listing" | "helper" | "feed";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blythapp.com";
const SCHEME = process.env.NEXT_PUBLIC_APP_SCHEME ?? "blyth";
export const ANDROID_PACKAGE = process.env.NEXT_PUBLIC_ANDROID_PACKAGE ?? "com.caxapok.blyth";
export const IOS_BUNDLE_ID = process.env.NEXT_PUBLIC_IOS_BUNDLE_ID ?? "com.caxapok.blyth";

export const IOS_APP_ID = process.env.NEXT_PUBLIC_IOS_APP_ID ?? "";

export const STORE_URLS = {
  ios: process.env.NEXT_PUBLIC_APP_STORE_URL ?? "",
  android: process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? "",
};

const WEB_PATH: Record<ShareType, string> = { listing: "listings", helper: "helpers", feed: "feed" };

export function webUrlFor(type: ShareType, id: string): string {
  return new URL(`/${WEB_PATH[type]}/${encodeURIComponent(id)}`, SITE_URL).toString();
}

const APP_PATH: Record<"listing" | "helper", string> = { listing: "listing", helper: "provider" };

export const ASSOCIATED_PATH_PATTERNS = (Object.keys(APP_PATH) as Array<keyof typeof APP_PATH>).map(
  (type) => `/${WEB_PATH[type]}/*`,
);

export function appLinksFor(type: "listing" | "helper", id: string) {
  const path = `${APP_PATH[type]}/${encodeURIComponent(id)}`;
  const fallback = STORE_URLS.android ? `;S.browser_fallback_url=${encodeURIComponent(STORE_URLS.android)}` : "";
  return {
    ios: `${SCHEME}://${path}`,
    android: `intent://${path}#Intent;scheme=${SCHEME};package=${ANDROID_PACKAGE}${fallback};end`,
  };
}
