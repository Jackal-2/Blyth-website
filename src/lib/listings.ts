import { fetchInternalById } from "./internalFetch";

export interface PublicListingImage {
  url: string;
}

export interface PublicListing {
  id: string;
  title: string;
  description: string | null;
  type: "item" | "service";
  price: number;
  isOneTimeService: boolean;
  images: PublicListingImage[];
  rating: number;
  reviewCount: number;
  provider: {
    id: string;
    fullName: string;
    businessVerified: boolean;
  } | null;
}

export function fetchPublicListing(id: string): Promise<PublicListing | null> {
  return fetchInternalById<PublicListing>(id, (eid) => `/public/share/listings/${eid}`, "listing");
}
