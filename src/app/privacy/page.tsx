import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";
import { fetchLegalDocument } from "@/lib/legalDocuments";
import { renderLegalDocument } from "@/lib/renderLegalMarkdown";

export const metadata: Metadata = {
  title: "Privacy Policy — Blyth",
  description: "How Blyth collects, uses, and protects your information.",
};

export default async function PrivacyPolicyPage() {
  const doc = await fetchLegalDocument("privacy");

  if (!doc) {
    return (
      <PolicyLayout title="Privacy policy" updated="—">
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
