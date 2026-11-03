export type LegalDocumentType = "terms" | "privacy" | "guidelines" | "dmca";

export interface LegalDocument {
  type: LegalDocumentType;
  title: string;
  body: string;
  updatedAt: string;
}

export interface PublishedLegalDocument {
  title: string;
  body: string;
  updatedLabel: string;
}

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:4000/api";

// How often the website checks the console for a newer version.
const REFRESH_SECONDS = 60;

export async function fetchLegalDocument(type: LegalDocumentType): Promise<LegalDocument | null> {
  try {
    const res = await fetch(`${API_BASE}/legal/${type}`, {
      next: { revalidate: REFRESH_SECONDS },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { document?: Partial<LegalDocument> } | null;
    const doc = data?.document;
    if (
      !doc ||
      typeof doc.title !== "string" ||
      typeof doc.body !== "string" ||
      typeof doc.updatedAt !== "string" ||
      !doc.title.trim() ||
      !doc.body.trim() ||
      doc.body.length > 200_000 ||
      Number.isNaN(Date.parse(doc.updatedAt))
    ) {
      return null;
    }
    return { type, title: doc.title.trim().slice(0, 200), body: doc.body, updatedAt: doc.updatedAt };
  } catch {
    return null;
  }
}

// The version published from the admin console, but only if it is newer than
// the copy built into the website (dated `builtInDate`, e.g. "Oct 28, 2026").
// Otherwise null, and the page shows its built-in copy. This way an older
// console draft can never replace a newer page.
export async function fetchPublishedLegalDocument(
  type: LegalDocumentType,
  builtInDate: string,
): Promise<PublishedLegalDocument | null> {
  const doc = await fetchLegalDocument(type);
  if (!doc) return null;
  const builtIn = Date.parse(`${builtInDate} 23:59:59 GMT-0500`);
  const updated = Date.parse(doc.updatedAt);
  if (!Number.isNaN(builtIn) && updated <= builtIn) return null;
  return {
    title: doc.title,
    body: doc.body,
    updatedLabel: new Date(updated).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "America/New_York",
    }),
  };
}
