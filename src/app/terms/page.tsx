import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata: Metadata = {
  title: "Terms of Service — Blyth",
  description: "The terms that govern your access to and use of the Blyth platform.",
};

export default function TermsOfServicePage() {
  return (
    <PolicyLayout title="Terms of service" updated="Jan 8, 2025">
      <section className="policy-section">
        <h2>Welcome to BLYTH</h2>
        <p>
          Welcome to Blyth. These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
          Blyth platform. By creating an account or using Blyth, you agree to these Terms. If you do not agree,
          please do not use the platform.
        </p>
      </section>

      <section className="policy-section">
        <h2>1. General overview</h2>

        <div className="policy-subsection">
          <h3>1.1 Acceptance of Terms</h3>
          <ul>
            <li>
              By creating a Blyth account or using the platform, you agree to these Terms of Service and any
              applicable policies referenced in them. If you do not agree with these Terms, you may not use
              Blyth.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>1.2 Blyth&rsquo;s Role</h3>
          <ul>
            <li>Blyth is a marketplace that connects neighbors with independent helpers who offer services and items.</li>
            <li>
              Blyth does not directly provide, sell, or fulfill the services or items listed by helpers and is
              not a party to transactions between neighbors and helpers. Helpers are responsible for the
              accuracy of their listings, the quality and legality of their services or items, and fulfilling
              their obligations to neighbors.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>1.3 Account &amp; Verification</h3>
          <ul>
            <li>
              You must be at least 18 years old to create and maintain a Blyth account. We may use the date of
              birth you provide during registration to confirm that you meet this requirement.
            </li>
            <li>
              Helpers must complete identity verification before publishing listings. This may include
              providing a government-issued identification document, a selfie, and a linked bank account for
              verification and payment purposes.
            </li>
            <li>
              If you register as a business, you may also be required to provide business registration
              information and an Employer Identification Number (EIN).
            </li>
            <li>
              You are responsible for providing accurate, current information and for keeping your account
              credentials secure. You may not impersonate another person or create an account using false or
              misleading information.
            </li>
          </ul>
        </div>
      </section>

      <section className="policy-section">
        <h2>2. Order and security</h2>

        <div className="policy-subsection">
          <h3>2.1 Orders &amp; Confirmation Codes</h3>
          <ul>
            <li>Each Blyth order may include a confirmation code that the neighbor provides after receiving the purchased item or completed service.</li>
            <li>When the correct confirmation code is entered, the order is considered completed and the helper&rsquo;s eligible earnings may be released for payout.</li>
            <li>You should not share a confirmation code until you have received the item or service associated with the order.</li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>2.2 Disputes</h3>
          <ul>
            <li>
              If a neighbor does not provide the confirmation code within a reasonable period after an item has
              been delivered or a service has been completed, the helper may submit a dispute through Blyth.
            </li>
            <li>Blyth may review information and evidence provided by either party, including delivery records, messages, photos, or other relevant information.</li>
            <li>
              After reviewing a dispute, Blyth may release eligible funds, issue a refund, deny the dispute, or
              request additional information from either party. Blyth&rsquo;s review does not guarantee a
              particular outcome.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>2.3 Prohibited Listings</h3>
          <ul>
            <li>You may not list, sell, request, or provide illegal goods or services through Blyth.</li>
            <li>Prohibited listings may include illegal goods or services, counterfeit items, stolen property, or anything that violates applicable laws, regulations, or Blyth&rsquo;s Community Guidelines.</li>
            <li>Blyth may remove listings or restrict accounts that violate these requirements.</li>
            <li>See our Community Guidelines for additional rules regarding prohibited content, goods, and services.</li>
          </ul>
        </div>
      </section>

      <section className="policy-section">
        <h2>3. Termination</h2>

        <div className="policy-subsection">
          <h3>3.1 Termination &amp; Account Deletion</h3>
          <ul>
            <li>Blyth may suspend, restrict, or terminate an account if we reasonably believe the account or its activity violates these Terms, our Community Guidelines, applicable law, or creates a risk to other users or the platform.</li>
            <li>You may delete your account at any time through Account Settings.</li>
            <li>Account deletion may not immediately eliminate information that Blyth is required or permitted to retain for legal, security, fraud-prevention, financial, dispute-resolution, or other legitimate purposes, as described in our Privacy Policy.</li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>3.2 Changes to These Terms</h3>
          <ul>
            <li>We may update these Terms from time to time. When we make material changes, we may provide notice through the app or other appropriate means.</li>
            <li>Your continued use of Blyth after updated Terms become effective means that you accept the revised Terms.</li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>3.3 Contact Us</h3>
          <p>
            If you have questions about these Terms or need assistance with your account, contact us at{" "}
            <a href="mailto:support@blythapp.com">support@blythapp.com</a>.
          </p>
        </div>
      </section>
    </PolicyLayout>
  );
}
