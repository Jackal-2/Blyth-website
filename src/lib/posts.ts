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

export function fetchPublicPost(id: string): Promise<PublicPost | null> {
  return fetchInternalById<PublicPost>(id, (eid) => `/posts/${eid}/public`, "post");
}
