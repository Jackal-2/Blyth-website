import { isValidEntityId } from "./entityId";

// Server-only. The one place every website-to-backend "hit a narrow public
// endpoint by id" call goes through — id validation, encoding, and the
// shared-secret header all live here once instead of being copied into each
// caller. See lib/listings.ts, lib/providers.ts, lib/posts.ts.
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000/api";

// Sent so the backend's shareRateLimit (see Blyth-Backend/src/middleware/shareAuth.ts)
// gives this site's requests their own allowance instead of sharing the
// public per-IP bucket with every other caller — every visitor's share-card
// request arrives at the backend from this same server, so an
// unauthenticated per-IP limit there would otherwise group all of them into
// one client. Harmless if unset: the backend just falls back to the
// ordinary public limiter, same as before this existed.
const INTERNAL_SHARE_HEADERS = process.env.INTERNAL_SHARE_API_KEY
  ? { "x-internal-share-key": process.env.INTERNAL_SHARE_API_KEY }
  : undefined;

// buildPath receives the already-validated, already-encoded id and returns
// the backend path (no leading API_BASE — e.g. `/posts/${id}/public`, since
// callers don't all share the same route shape). responseKey names the
// field to pull off the parsed JSON body.
export async function fetchInternalById<T>(
  id: string,
  buildPath: (encodedId: string) => string,
  responseKey: string,
): Promise<T | null> {
  if (!isValidEntityId(id)) return null;
  try {
    const res = await fetch(`${API_BASE}${buildPath(encodeURIComponent(id))}`, {
      cache: "no-store",
      headers: INTERNAL_SHARE_HEADERS,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data[responseKey] as T;
  } catch {
    return null;
  }
}
