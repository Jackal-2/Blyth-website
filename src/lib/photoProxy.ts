import { createHmac, timingSafeEqual } from "crypto";
import { isOwnMediaUrl } from "./media";

const DATA_URI_PATTERN = /^data:image\/(png|jpe?g|webp);base64,/i;

function photoProxySecret(): string | null {
  return process.env.PHOTO_PROXY_SECRET || process.env.INTERNAL_SHARE_API_KEY || null;
}

export function photoProxySignature(rawUrl: string): string | null {
  const secret = photoProxySecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(`photo-proxy:${rawUrl}`).digest("base64url").slice(0, 32);
}

export function isValidPhotoProxySignature(rawUrl: string, signature: string | null): boolean {
  const expected = photoProxySignature(rawUrl);
  if (!expected) return process.env.NODE_ENV !== "production";
  if (!signature || signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function toProxiedImageUrl(rawUrl: string): string {
  if (DATA_URI_PATTERN.test(rawUrl)) return rawUrl;
  if (isOwnMediaUrl(rawUrl)) return rawUrl;
  const signature = photoProxySignature(rawUrl);
  const base = `/api/photo?u=${encodeURIComponent(rawUrl)}`;
  return signature ? `${base}&s=${signature}` : base;
}
