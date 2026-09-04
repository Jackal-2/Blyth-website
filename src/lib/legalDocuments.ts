export type LegalDocumentType = "terms" | "privacy" | "guidelines";

export interface LegalDocument {
  type: LegalDocumentType;
  title: string;
  body: string;
  updatedAt: string;
}

// Server-only; set API_BASE_URL in the deploy environment.
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000/api";

export async function fetchLegalDocument(type: LegalDocumentType): Promise<LegalDocument | null> {
  try {
    const res = await fetch(`${API_BASE}/legal/${type}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.document as LegalDocument;
  } catch {
    return null;
  }
}
