// Builds a same-origin URL that proxies a user-supplied photo through
// /api/photo (see that route for why) instead of ever putting a raw,
// user-controlled URL into an <img src> the visitor's own browser would
// then request directly.
//
// A data: URI is left untouched: the browser decodes it straight out of the
// HTML with no network request at all, so there's nothing to proxy (and
// /api/photo would 404 it anyway — fetchSafely only handles http(s)).
import { isOwnMediaUrl } from "./media";

const DATA_URI_PATTERN = /^data:image\/(png|jpe?g|webp);base64,/i;

export function toProxiedImageUrl(rawUrl: string): string {
  if (DATA_URI_PATTERN.test(rawUrl)) return rawUrl;
  // Already our own storage host (see media.ts) — safe to link directly,
  // nothing external for the visitor's browser to leak IP/UA/Referer to.
  // Everything else still goes through the proxy.
  if (isOwnMediaUrl(rawUrl)) return rawUrl;
  return `/api/photo?u=${encodeURIComponent(rawUrl)}`;
}
