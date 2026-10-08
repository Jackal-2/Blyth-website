import { promises as dnsPromises } from "node:dns";
import http from "node:http";
import https from "node:https";
import ipaddr from "ipaddr.js";
import { getImageDimensions, IMAGE_CONTENT_TYPE, type ImageDimensions } from "./imageDimensions";


function stripBrackets(hostname: string): string {
  return hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
}

function isSafeIpLiteral(ip: string): boolean {
  try {
    return ipaddr.process(ip).range() === "unicast";
  } catch {
    return false;
  }
}

export type SafeAddress = { ip: string; family: 4 | 6 };

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
  return true;
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
    return null;
  }
}

const MAX_FETCH_BYTES = 8 * 1024 * 1024; // 8MB
const FETCH_TIMEOUT_MS = 6000;

export interface SafeFetchResult {
  contentType: string;
  body: Buffer;
}

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
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
        path: `${parsed.pathname}${parsed.search}`,
        method: "GET",
        headers: { Host: parsed.host, "User-Agent": "Blythbot-fetch/1.0" },
        timeout: FETCH_TIMEOUT_MS,
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

const MAX_IMAGE_DIMENSION = 2048;
const MAX_IMAGE_PIXELS = MAX_IMAGE_DIMENSION * MAX_IMAGE_DIMENSION; // ~4.19MP

function isWithinDimensionLimits(dims: ImageDimensions | null): dims is ImageDimensions {
  if (!dims) return false;
  return dims.width <= MAX_IMAGE_DIMENSION && dims.height <= MAX_IMAGE_DIMENSION && dims.width * dims.height <= MAX_IMAGE_PIXELS;
}

export interface SafeImageFetchResult extends SafeFetchResult {
  format: ImageDimensions["format"];
}

export async function fetchImageSafely(url: string): Promise<SafeImageFetchResult | null> {
  const result = await fetchSafely(url, { allowedContentTypes: ALLOWED_IMAGE_TYPES });
  if (!result) return null;

  const dims = getImageDimensions(result.body);
  if (!isWithinDimensionLimits(dims)) return null;

  return { ...result, format: dims.format };
}

export async function fetchImageAsDataUri(url: string): Promise<string | null> {
  const dataUriMatch = url.match(/^data:image\/(?:png|jpe?g|webp);base64,(.+)$/is);
  if (dataUriMatch) {
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
  return `data:${IMAGE_CONTENT_TYPE[result.format]};base64,${result.body.toString("base64")}`;
}
