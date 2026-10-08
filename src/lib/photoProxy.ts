import { isOwnMediaUrl } from "./media";

const DATA_URI_PATTERN = /^data:image\/(png|jpe?g|webp);base64,/i;

export function toProxiedImageUrl(rawUrl: string): string {
  if (DATA_URI_PATTERN.test(rawUrl)) return rawUrl;
  if (isOwnMediaUrl(rawUrl)) return rawUrl;
  return `/api/photo?u=${encodeURIComponent(rawUrl)}`;
}
