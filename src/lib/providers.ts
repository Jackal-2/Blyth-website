import { fetchInternalById } from "./internalFetch";

export interface PublicProviderListing {
  id: string;
  title: string;
  type: "item" | "service";
  price: number;
  imageUrl: string | null;
}

export interface PublicProvider {
  id: string;
  fullName: string;
  businessVerified: boolean;
  memberSince: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  rating: number;
  reviewCount: number;
  listings: PublicProviderListing[];
}

// Server-only; hits Blyth-Backend's narrow GET /public/share/helpers/:id —
// not the app's own GET /providers/:id. Same reasoning as lib/listings.ts:
// this endpoint returns only the fields this share card renders, rather
// than whatever the app's own provider-profile endpoint happens to return.
// Id validation, encoding, and the shared-secret header all live in
// internalFetch.ts.
export function fetchPublicProvider(id: string): Promise<PublicProvider | null> {
  return fetchInternalById<PublicProvider>(id, (eid) => `/public/share/helpers/${eid}`, "provider");
}
