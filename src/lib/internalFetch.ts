import { isValidEntityId } from "./entityId";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000/api";

const INTERNAL_SHARE_HEADERS = process.env.INTERNAL_SHARE_API_KEY
  ? { "x-internal-share-key": process.env.INTERNAL_SHARE_API_KEY }
  : undefined;

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
