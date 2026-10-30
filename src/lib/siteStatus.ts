const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000/api";

const INTERNAL_SHARE_HEADERS = process.env.INTERNAL_SHARE_API_KEY
  ? { "x-internal-share-key": process.env.INTERNAL_SHARE_API_KEY }
  : undefined;

let lastKnown = true;

export async function isComingSoon(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/public/site`, {
      next: { revalidate: 30 },
      headers: INTERNAL_SHARE_HEADERS,
    });
    if (!res.ok) return lastKnown;
    const data = (await res.json()) as { comingSoon?: unknown };
    if (typeof data.comingSoon === "boolean") lastKnown = data.comingSoon;
    return lastKnown;
  } catch {
    return lastKnown;
  }
}
