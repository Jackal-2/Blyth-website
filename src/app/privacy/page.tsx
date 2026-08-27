import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Blyth",
  description: "How Blyth collects, uses, and protects your information.",
};


export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy policy" updated="Aug 8, 2026">
      <section className="policy-section">
        <h2>Welcome to Blyth</h2>
        <p>
          We&rsquo;re building a trusted marketplace that
          makes it easy for neighbors to connect with reliable local helpers.
        </p>
        <p>
          Your privacy matters to us. This Privacy Policy explains what
          information we collect, why we collect it, how we protect it, and the
          choices you have over your information.
        </p>
        <p>
          By using Blyth, you&rsquo;re trusting us with your information, and we
          take that responsibility seriously. We aim to collect only what we
          need to provide the service, keep your information secure, and be
          clear about how it is used.
        </p>
      </section>

      <section className="policy-section">
        <h2>Data We Collect</h2>
        <p>
          We collect the information you give us directly — name, date of birth,
          email, phone number, listings, messages, and reviews. If you become a
          helper, we also collect a government ID photo, a selfie, and your bank
          account and routing number to verify your identity and pay you out;
          helpers verifying as a business additionally submit a business
          registration number and EIN. We collect your approximate location to
          show you listings nearby, along with basic usage data to keep the app
          running smoothly.
        </p>
      </section>

      <section className="policy-section">
        <h2>How We Use It</h2>
        <p>
          Your data is used to operate the marketplace: matching neighbors and
          helpers, processing orders, confirming you meet our minimum age
          requirement, verifying helper and business identity, paying out helper
          earnings, showing nearby listings, and providing support.
        </p>
      </section>

      <section className="policy-section">
        <h2>How We Protect It</h2>
        <p>
          Messages, bank details, and verification records are encrypted both in
          transit and in our database. Access to that information is limited to
          what you need to see yourself, or to what our team needs to
          investigate a report or dispute you or someone else raised.
        </p>
      </section>

      <section className="policy-section">
        <h2>Sharing</h2>
        <p>
          We share the minimum information necessary between a neighbor and
          helper to complete an order — for example, your name and delivery
          details. We don&rsquo;t sell your personal data to third parties.
        </p>
      </section>

      <section className="policy-section">
        <h2>Your Rights</h2>
        <p>
          You can review, update, or delete your personal information at any
          time from Account Settings, or by contacting support. Deleting your
          account removes your personal details and verification records. Order
          and review history tied to other users is retained in de-identified
          form, since it may still matter to the other party or be needed for
          legal or dispute purposes.
        </p>
      </section>
    </PolicyLayout>
  );
}
