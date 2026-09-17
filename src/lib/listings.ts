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

// Server-only; hits Blyth-Backend's public GET /listings/:id (same endpoint the
// app itself uses — no auth required, mirrors lib/providers.ts).
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000/api";

export async function fetchPublicListing(id: string): Promise<PublicListing | null> {
  try {
    const res = await fetch(`${API_BASE}/listings/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.listing as PublicListing;
  } catch {
    return null;
  }
}
