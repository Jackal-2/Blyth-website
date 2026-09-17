export interface PublicPost {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  author: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

// Server-only; hits Blyth-Backend's public GET /posts/:id/public — a
// dedicated public route, since the rest of /posts requires auth (feed
// posts aren't listed anywhere unauthenticated, only readable one at a
// time by id). Mirrors lib/providers.ts and lib/listings.ts.
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000/api";

export async function fetchPublicPost(id: string): Promise<PublicPost | null> {
  try {
    const res = await fetch(`${API_BASE}/posts/${id}/public`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.post as PublicPost;
  } catch {
    return null;
  }
}
