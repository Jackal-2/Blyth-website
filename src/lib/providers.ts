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

export function fetchPublicProvider(id: string): Promise<PublicProvider | null> {
  return fetchInternalById<PublicProvider>(id, (eid) => `/public/share/helpers/${eid}`, "provider");
}
