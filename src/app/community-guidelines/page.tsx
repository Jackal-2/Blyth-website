import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";
import { fetchLegalDocument } from "@/lib/legalDocuments";
import { renderLegalDocument } from "@/lib/renderLegalMarkdown";

export const metadata: Metadata = {
  title: "Community Guidelines — Blyth",
  description:
    "The rules that keep Blyth a safe, trustworthy marketplace for neighbors and helpers.",
};

export default async function CommunityGuidelinesPage() {
  const doc = await fetchLegalDocument("guidelines");

  if (!doc) {
    return (
      <PolicyLayout title="Community guidelines" updated="—">
        <section className="policy-section">
          <p>This page is temporarily unavailable. Please check back shortly.</p>
        </section>
      </PolicyLayout>
    );
  }

  const updated = new Date(doc.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <PolicyLayout title={doc.title} updated={updated}>
      {renderLegalDocument(doc.body)}
    </PolicyLayout>
  );
}
