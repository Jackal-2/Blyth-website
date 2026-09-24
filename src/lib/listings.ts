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

// Server-only; hits Blyth-Backend's narrow GET /public/share/listings/:id —
// not the app's own GET /listings/:id. That endpoint backs the app's detail
// screen and returns whatever fields that screen needs (full reviews,
// booked slots, and so on); this one exists just for this share card and
// returns only the fields above, so a field added to the app's endpoint
// later doesn't also silently become reachable from the website. Mirrors
// lib/providers.ts. Id validation, encoding, and the shared-secret header
// all live in internalFetch.ts.
export function fetchPublicListing(id: string): Promise<PublicListing | null> {
  return fetchInternalById<PublicListing>(id, (eid) => `/public/share/listings/${eid}`, "listing");
}
