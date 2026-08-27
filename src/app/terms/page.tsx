import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";
import { fetchLegalDocument } from "@/lib/legalDocuments";
import { renderLegalDocument } from "@/lib/renderLegalMarkdown";

export const metadata: Metadata = {
  title: "Terms of Service — Blyth",
  description:
    "The terms that govern your access to and use of the Blyth platform.",
};

export default async function TermsOfServicePage() {
  const doc = await fetchLegalDocument("terms");

  if (!doc) {
    return (
      <PolicyLayout title="Terms of service" updated="—">
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
