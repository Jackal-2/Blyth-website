export type LegalDocumentType = "terms" | "privacy" | "guidelines";

export interface LegalDocument {
  type: LegalDocumentType;
  title: string;
  body: string;
  updatedAt: string;
}

// Server-only — there's no NEXT_PUBLIC_ prefix because this is never read in
// the browser. No .env file exists in this repo yet (the site made zero API
// calls before this), so set API_BASE_URL in your deploy environment; this
// default only covers local dev against Blyth-Backend running on its usual
// port.
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000/api";

// Called from a Server Component, so this runs on the server and is never
// subject to the CSP's connect-src (that only governs requests the browser
// itself makes) — no next.config.ts change needed to allow it.
// cache: 'no-store' means an edit published from the admin console's Legal
// Documents page shows up on the very next page load, no rebuild or
// redeploy required.
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
