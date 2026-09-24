// Whether a URL is already on this app's own object-storage host — mirrors
// the backend's own host-restriction (Backend repo's utils/objectStorage.ts
// `objectStoragePublicHost()` + utils/urlSafety.ts `isUrlHostSafeAtSaveTime`,
// which once object storage is configured only accept a saved image field
// on that exact host). This file doesn't call the backend to find out what
// that host is — MEDIA_BASE_URL has to be set to the exact same value as
// the backend's OBJECT_STORAGE_PUBLIC_URL_BASE for the two to agree.
//
// Parsed once at module load, not per call — matches the pattern in
// urlSafety.ts/objectStorage.ts of reading config once rather than
// re-parsing env on every request.
const mediaBase = parseMediaBase();

function parseMediaBase(): URL | null {
  const raw = process.env.MEDIA_BASE_URL;
  if (!raw) return null; // not configured yet — isOwnMediaUrl below trusts nothing
  try {
    return new URL(raw);
  } catch {
    // Set but not a real URL — almost certainly a typo. Treating it as
    // "trust nothing" (same as unset) is the safe direction; the alternative
    // (throwing at import time) would take the whole site down over a typo
    // in a variable that's still optional today.
    console.warn(`MEDIA_BASE_URL is set to "${raw}", which is not a valid URL — treating it as unset.`);
    return null;
  }
}

// Own-host URLs can be trusted directly, without going through the photo
// proxy (see photoProxy.ts) — this app already restricts new image fields
// to this exact host once object storage is configured, so a URL that
// matches isn't an arbitrary external address.
//
// Always an exact origin + path-prefix comparison via URL parsing, never a
// substring check: "media.example.com.attacker.net" or
// "evil-media.example.com" would both pass a naive .includes()/.startsWith()
// on the raw string, but neither has mediaBase's actual origin.
export function isOwnMediaUrl(raw: string): boolean {
  if (!mediaBase) return false;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }
  return parsed.protocol === "https:" && parsed.origin === mediaBase.origin && parsed.pathname.startsWith(mediaBase.pathname);
}
