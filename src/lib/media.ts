const mediaBase = parseMediaBase();

function parseMediaBase(): URL | null {
  const raw = process.env.MEDIA_BASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw);
  } catch {
    console.warn(`MEDIA_BASE_URL is set to "${raw}", which is not a valid URL — treating it as unset.`);
    return null;
  }
}

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
