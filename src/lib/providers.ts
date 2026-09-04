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
  rating: number;
  reviewCount: number;
  listings: PublicProviderListing[];
}

// Server-only; hits Blyth-Backend's public GET /providers/:id.
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000/api";

export async function fetchPublicProvider(id: string): Promise<PublicProvider | null> {
  try {
    const res = await fetch(`${API_BASE}/providers/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.provider as PublicProvider;
  } catch {
    return null;
  }
}
