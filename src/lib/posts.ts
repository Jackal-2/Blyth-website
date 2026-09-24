import { fetchInternalById } from "./internalFetch";

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
// time by id). Mirrors lib/providers.ts and lib/listings.ts. Id validation,
// encoding, and the shared-secret header all live in internalFetch.ts.
export function fetchPublicPost(id: string): Promise<PublicPost | null> {
  return fetchInternalById<PublicPost>(id, (eid) => `/posts/${eid}/public`, "post");
}
