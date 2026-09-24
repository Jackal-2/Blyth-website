import { promises as dnsPromises } from "node:dns";
import http from "node:http";
import https from "node:https";
import ipaddr from "ipaddr.js";
import { getImageDimensions, IMAGE_CONTENT_TYPE, type ImageDimensions } from "./imageDimensions";

// SSRF-safe fetching of user-supplied URLs (listing/avatar/cover photo URLs
// today; anything else that ever needs to fetch a user-supplied URL
// server-side should go through fetchSafely / fetchImageAsDataUri too).
//
// Checking "is this hostname safe" and then handing the URL to a separate,
// later fetch isn't enough: DNS can answer differently between the check and
// the actual connection (a short/zero-TTL record returning a safe address
// for the check and an internal one for the real request — the same reason
// Satori's own internal <img> fetch was never safe to lean on directly). So
// instead: resolve to ONE specific, already-validated address, then pin the
// actual connection to exactly that address (via a custom `lookup`) rather
// than re-resolving.
//
// IP classification (private/loopback/link-local/reserved/etc.) is
// intentionally NOT hand-rolled — ipaddr.js's `.range()` covers the full,
// RFC-cited set (RFC1918 private, RFC3927 link-local, RFC6598 CGNAT,
// RFC5737/3879/6890 reserved & deprecated ranges, IPv6 unique-local, and
// more) and normalizes IPv4-mapped IPv6 and numeric-encoded hosts (decimal /
// hex / octal, e.g. "2852039166" for 169.254.169.254) to their real address
// automatically. This is an ALLOWLIST: only "unicast" (an ordinary
// public/routable address) is accepted — everything else in ipaddr.js's
// range list is rejected by default, so a newly-added special-purpose range
// is safe-by-default rather than needing this file updated to catch it.
//
// Mirrors Blyth-Backend/src/utils/urlSafety.ts — kept as two copies (no
// shared package between the two repos) but intentionally structured
// identically so a fix to one is easy to port to the other.

function stripBrackets(hostname: string): string {
  return hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
}

function isSafeIpLiteral(ip: string): boolean {
  try {
    return ipaddr.process(ip).range() === "unicast";
  } catch {
    return false; // unparsable — can't vouch for it
  }
}

export type SafeAddress = { ip: string; family: 4 | 6 };

// Synchronous — no DNS involved. Not currently called on the website (no
// save-time form lives here), kept for parity with the backend copy and in
// case a future website-side form ever needs it.
export function isUrlHostSafeAtSaveTime(url: string): boolean {
  if (/^data:image\/(png|jpe?g|webp);base64,/i.test(url)) return true;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
  const hostname = stripBrackets(parsed.hostname);
  if (hostname.toLowerCase() === "localhost") return false;
  if (ipaddr.isValid(hostname)) return isSafeIpLiteral(hostname);
  return true; // an ordinary domain name — re-checked (with DNS) at fetch time
}

async function resolveSafeIp(hostname: string): Promise<SafeAddress | null> {
  const bare = stripBrackets(hostname);

  if (ipaddr.isValid(bare)) {
    if (!isSafeIpLiteral(bare)) return null;
    const addr = ipaddr.process(bare);
    return { ip: addr.toString(), family: addr.kind() === "ipv6" ? 6 : 4 };
  }
  if (bare.toLowerCase() === "localhost") return null;

  try {
    const records = await dnsPromises.lookup(bare, { all: true, verbatim: true });
    const safe = records.find((r) => isSafeIpLiteral(r.address));
    if (!safe) return null;
    return { ip: safe.address, family: safe.family === 6 ? 6 : 4 };
  } catch {
    return null; // can't resolve it — safest is to skip the fetch, not attempt it
  }
}

const MAX_FETCH_BYTES = 8 * 1024 * 1024; // 8MB
const FETCH_TIMEOUT_MS = 6000;

export interface SafeFetchResult {
  contentType: string;
  body: Buffer;
}

// The actual HTTP mechanics, GIVEN an address already cleared by
// resolveSafeIp — separated out so the destination check and the fetch
// mechanics (redirect handling, size/type limits) are two independently
// testable things. Exported so it can be tested directly against a real
// (safe, loopback) local server without needing a DNS environment that
// resolves to something "unsafe" to exercise redirect/status/size handling —
// feature code should call fetchSafely / fetchImageAsDataUri, not this.
export async function fetchViaPinnedConnection(
  parsed: URL,
  resolved: SafeAddress,
  opts?: { allowedContentTypes?: Set<string> },
): Promise<SafeFetchResult | null> {
  const client = parsed.protocol === "https:" ? https : http;
  const allowedTypes = opts?.allowedContentTypes;

  return new Promise((resolve) => {
    const req = client.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname, // still drives the Host header + (https) SNI/cert check
        port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
        path: `${parsed.pathname}${parsed.search}`,
        method: "GET",
        headers: { Host: parsed.host, "User-Agent": "Blythbot-fetch/1.0" },
        timeout: FETCH_TIMEOUT_MS,
        // Forces the socket to connect to the address already validated by
        // resolveSafeIp, instead of letting this request re-resolve the
        // hostname itself. Node's net module (Happy Eyeballs / RFC 8305)
        // calls this with { all: true } and expects the array-shaped
        // callback in current versions; older call sites expect the
        // single-address form — handle both rather than assuming one.
        lookup: (_hostname: string, options: unknown, callback: (...args: unknown[]) => void) => {
          if (options && typeof options === "object" && "all" in options && (options as { all?: boolean }).all) {
            callback(null, [{ address: resolved.ip, family: resolved.family }]);
          } else {
            callback(null, resolved.ip, resolved.family);
          }
        },
      } as http.RequestOptions,
      (res) => {
        const status = res.statusCode ?? 0;
        const contentType = (res.headers["content-type"] ?? "").split(";")[0].trim().toLowerCase();
        // Any redirect (3xx) — or anything else that isn't a plain 200 — is
        // treated as a failure. Nothing here ever reads a Location header,
        // so a redirect target is never followed, let alone re-validated.
        if (status !== 200 || (allowedTypes && !allowedTypes.has(contentType))) {
          res.resume();
          resolve(null);
          return;
        }
        const contentLength = Number(res.headers["content-length"] ?? 0);
        if (contentLength > MAX_FETCH_BYTES) {
          res.destroy();
          resolve(null);
          return;
        }

        const chunks: Buffer[] = [];
        let total = 0;
        res.on("data", (chunk: Buffer) => {
          total += chunk.length;
          if (total > MAX_FETCH_BYTES) {
            res.destroy();
            resolve(null);
            return;
          }
          chunks.push(chunk);
        });
        res.on("end", () => {
          if (total === 0) {
            resolve(null);
            return;
          }
          resolve({ contentType, body: Buffer.concat(chunks) });
        });
        res.on("error", () => resolve(null));
      },
    );

    req.on("timeout", () => req.destroy());
    req.on("error", () => resolve(null));
    req.end();
  });
}

// Fetches a user-supplied URL with the connection pinned to a pre-validated
// address and without following redirects. Returns null on anything
// unsafe/unreachable/oversized; callers decide what to fall back to.
export async function fetchSafely(
  url: string,
  opts?: { allowedContentTypes?: Set<string> },
): Promise<SafeFetchResult | null> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  const resolved = await resolveSafeIp(parsed.hostname);
  if (!resolved) return null;

  return fetchViaPinnedConnection(parsed, resolved, opts);
}

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

// A small, highly-compressed image can still be enormous once decoded (a
// 30000x30000 solid-color PNG is tiny on the wire) — the MAX_FETCH_BYTES
// cap above only bounds the file's size on the wire, not its decoded pixel
// count, which is what actually drives memory use in Satori/resvg (the OG
// image renderer) or any other consumer of these bytes. Checked against the
// header only (see imageDimensions.ts) — never against a full decode.
// Matches the backend's own downsize target (see
// Blyth-Backend/src/utils/objectStorage.ts) — no reason for an image this
// site accepts to be any larger than what actually ends up stored.
const MAX_IMAGE_DIMENSION = 2048;
// A second, independent bound on top of the per-dimension cap above. Not
// strictly load-bearing on its own when both dimensions are already capped
// equally (their product can't exceed MAX_IMAGE_DIMENSION² either way) —
// kept as defense-in-depth, so a future change that loosens one axis
// without revisiting this still has the total pixel count checked
// separately. Mirrors the backend's own independent sharp-level
// MAX_INPUT_PIXELS ceiling underneath its per-dimension check
// (objectStorage.ts).
const MAX_IMAGE_PIXELS = MAX_IMAGE_DIMENSION * MAX_IMAGE_DIMENSION; // ~4.19MP

// Single place both dimension-guard call sites go through, so the
// per-dimension cap and the total-pixel-count cap can't drift out of sync
// between them.
function isWithinDimensionLimits(dims: ImageDimensions | null): dims is ImageDimensions {
  if (!dims) return false;
  return dims.width <= MAX_IMAGE_DIMENSION && dims.height <= MAX_IMAGE_DIMENSION && dims.width * dims.height <= MAX_IMAGE_PIXELS;
}

export interface SafeImageFetchResult extends SafeFetchResult {
  // The format actually verified from the image's own header bytes (see
  // imageDimensions.ts) — not result.contentType, which is only ever the
  // upstream server's own claimed Content-Type header and is trivially
  // spoofable (a server can serve an .exe with "Content-Type: image/png").
  // Any caller that sets its own response Content-Type from this result
  // (the photo proxy) must use this field, not result.contentType.
  format: ImageDimensions["format"];
}

// Every image-consuming caller (the OG card renderer, the page's own photo
// proxy) should go through this — not fetchSafely directly — so the
// dimension guard applies everywhere, not just wherever someone remembered
// to add it.
export async function fetchImageSafely(url: string): Promise<SafeImageFetchResult | null> {
  const result = await fetchSafely(url, { allowedContentTypes: ALLOWED_IMAGE_TYPES });
  if (!result) return null;

  const dims = getImageDimensions(result.body);
  // No recognized header despite a matching Content-Type, either dimension
  // over its cap, or the total pixel count over its own cap — reject either
  // way; can't vouch for something we can't read the real dimensions of. A
  // header that doesn't parse as any of the three formats we accept is
  // exactly the "claims image/png, isn't one" case this guard exists for.
  if (!isWithinDimensionLimits(dims)) return null;

  return { ...result, format: dims.format };
}

// Convenience wrapper for the common case: fetch a user-supplied image URL
// and get back an inline data: URI (or null), suitable for embedding directly
// (e.g. into a next/og ImageResponse) with no further network access needed.
export async function fetchImageAsDataUri(url: string): Promise<string | null> {
  const dataUriMatch = url.match(/^data:image\/(?:png|jpe?g|webp);base64,(.+)$/is);
  if (dataUriMatch) {
    // No network fetch involved either way, but this still ends up decoded
    // by Satori server-side (unlike the same data: URI sitting in a page's
    // own <img src>, which the visitor's own browser decodes) — so it needs
    // the same dimension check a fetched image gets, just applied to the
    // base64 payload directly instead of to fetchSafely's result.
    let decoded: Buffer;
    try {
      decoded = Buffer.from(dataUriMatch[1], "base64");
    } catch {
      return null;
    }
    const dims = getImageDimensions(decoded);
    if (!isWithinDimensionLimits(dims)) return null;
    return url;
  }

  const result = await fetchImageSafely(url);
  if (!result) return null;
  // Keyed off the verified format, not result.contentType (the upstream
  // server's own claim) — see SafeImageFetchResult.
  return `data:${IMAGE_CONTENT_TYPE[result.format]};base64,${result.body.toString("base64")}`;
}
