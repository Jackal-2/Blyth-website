import type { Metadata } from "next";
import Link from "next/link";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata: Metadata = {
  title: "Terms of Service — Blyth",
  description:
    "The terms that govern your access to and use of the Blyth platform.",
};

export default function TermsOfServicePage() {
  return (
    <PolicyLayout title="Terms of service" updated="Oct 9, 2026">
      <section className="policy-section">
        <h2>Welcome to BLYTH</h2>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
          use of the Blyth platform. By creating an account or using Blyth, you
          agree to these Terms. If you do not agree, please do not use the
          platform.
        </p>
      </section>

      <section className="policy-section">
        <h2>1. General overview</h2>

        <div className="policy-subsection">
          <h3>1.1 Acceptance of Terms</h3>
          <ul>
            <li>
              By creating a Blyth account or using the platform, you agree to
              these Terms of Service and any applicable policies referenced in
              them. If you do not agree with these Terms, you may not use Blyth.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>1.2 Blyth&rsquo;s Role</h3>
          <ul>
            <li>
              Blyth is a marketplace that connects neighbors with independent
              helpers who offer services and items.
            </li>
            <li>
              Blyth does not directly provide, sell, or fulfill the services or
              items listed by helpers and is not a party to transactions between
              neighbors and helpers. Helpers are responsible for the accuracy of
              their listings, the quality and legality of their services or
              items, and fulfilling their obligations to neighbors.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>1.3 Account &amp; Verification</h3>
          <ul>
            <li>
              You must be at least 18 years old to create and maintain a Blyth
              account. We use the date of birth you provide during registration
              to confirm that you meet this requirement, and we may ask you to
              reverify your age if we have reason to believe it&rsquo;s
              inaccurate.
            </li>
            <li>
              Helpers must complete identity verification before publishing any
              listing. This requires submitting a valid government-issued photo
              ID, a live selfie for identity matching, and a linked and verified
              bank account. Blyth will not allow a helper account to publish
              listings until this verification is complete.
            </li>
            <li>
              Some helpers require a neighbor to complete this same identity
              verification &mdash; a government-issued photo ID and a live
              selfie &mdash; before that neighbor can request a specific
              booking option. This is the helper&rsquo;s own choice per
              listing, shown on the listing and again at checkout, and only
              ever applies to the booking option(s) they&rsquo;ve chosen to
              require it for. It never applies to buying an item.
            </li>
            <li>
              If you register as a business, you must also provide business
              registration information and a valid Employer Identification
              Number (EIN) before your business listings go live.
            </li>
            <li>
              You are responsible for providing accurate, current information,
              and you must keep your account credentials &mdash; including your
              password and any verification codes sent to you &mdash; secure and
              confidential. You must not share your login credentials with
              anyone else, must not impersonate another person or create an
              account using false or misleading information, and must notify us
              immediately at support[at]blythapp.com if you believe your account
              has been compromised or accessed without your permission.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>1.4 Safety for In-Person Meetings</h3>
          <ul>
            <li>
              Many orders involve meeting another user in person to exchange an
              item or provide a service. You&rsquo;re solely responsible for
              your own safety and judgment in these meetings.
            </li>
            <li>
              We recommend meeting in a public place when practical, telling
              someone else when and where you&rsquo;re meeting, and trusting
              your own judgment if something feels wrong.
            </li>
            <li>
              Blyth does not conduct criminal background checks on users and
              cannot guarantee the identity, intentions, or conduct of any
              other user, even one who has completed identity verification.
              Identity verification confirms that a person&rsquo;s government
              ID matches their selfie &mdash; it is not a safety or background
              screening.
            </li>
          </ul>
        </div>
      </section>

      <section className="policy-section">
        <h2>2. Orders, Payments &amp; Security</h2>

        <div className="policy-subsection">
          <h3>2.1 Orders &amp; Confirmation Codes</h3>
          <ul>
            <li>
              Each Blyth order may include a confirmation code that the neighbor
              provides after receiving the purchased item or completed service.
            </li>
            <li>
              When the correct confirmation code is entered, the order is
              considered completed and the helper&rsquo;s eligible earnings may
              be released for payout.
            </li>
            <li>
              You should not share a confirmation code until you have received
              the item or service associated with the order.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>2.2 Payment &amp; Orders</h3>
          <ul>
            <li>
              A default payment method is required before you can request a
              booking or purchase. Requesting places a hold on your card for the
              order total &mdash; you are not charged until the helper confirms
              the order, at which point the hold is captured.
            </li>
            <li>
              If a helper does not confirm an order, the hold is released and
              you are not charged.
            </li>
            <li>
              Once an order is confirmed and the hold is captured, cancelling
              it has a cost: whoever cancels &mdash; neighbor or helper &mdash;
              is responsible for Blyth&rsquo;s service fee on that order,
              which is non-refundable once charged.
            </li>
            <li>
              Blyth&rsquo;s service fee for a helper has two parts: a
              platform commission, and a share of the payment
              processor&rsquo;s own transaction fee. Helpers pay no platform
              commission on their first $250 in lifetime completed sales;
              once completed sales pass that amount, the commission applies
              to sales above it. The payment processor&rsquo;s own
              transaction fee applies to every sale, including those within
              this free tier, and is split between the neighbor and the
              helper.
            </li>
            <li>
              Once a neighbor enters the correct confirmation code, Blyth
              typically releases the helper&rsquo;s eligible earnings for payout
              within 2 business days. If an order becomes subject to a dispute,
              fraud review, or other investigation under Section 2.4, the payout
              is placed on hold until that review is resolved.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>2.3 Fraud &amp; Scam Prevention</h3>
          <ul>
            <li>
              Blyth uses several safeguards to reduce the risk of scams,
              including: identity verification for helpers, and for a
              neighbor where a listing requires it (Section 1.3), a card hold
              that isn&rsquo;t captured until a helper confirms an order,
              confirmation codes that release payout only after a neighbor
              confirms they actually received what they paid for, and staff
              review of disputes and reported accounts.
            </li>
            <li>
              Keep all communication, payment, and booking on Blyth. We cannot
              verify, protect, or refund a payment made outside the app, and a
              request to move a conversation or payment off-platform is itself a
              common warning sign of a scam.
            </li>
            <li>
              Never share your password, one-time verification codes, or full
              bank account details with another user. Blyth staff will never ask
              you for your password or a one-time code over chat, email, or
              phone.
            </li>
            <li>
              Order-related messages may be reviewed by our staff when needed
              to investigate a report, dispute, or suspected fraud, or to keep
              the platform safe &mdash; see our Privacy Policy for more on how
              we handle message content.
            </li>
            <li>
              If you suspect a listing, message, or account is fraudulent,
              report it immediately using the Report option in the app, or by
              contacting support[at]blythapp.com. Blyth may restrict, suspend,
              or remove an account while we investigate a report.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>2.4 Disputes</h3>
          <ul>
            <li>
              If you have a problem with an order, either party may file a
              dispute directly from the order in the app: any time before the
              order is marked completed, or within 3 days after it&rsquo;s
              marked completed. Once that 3-day window has passed, the order
              can no longer be disputed by either party &mdash; this is one
              reason to confirm an item or service is right, and share the
              confirmation code, only once you&rsquo;re satisfied.
            </li>
            <li>
              While a dispute is open, the order&rsquo;s payout is placed on
              hold, and no one else may file a further dispute on that order
              until it&rsquo;s resolved.
            </li>
            <li>
              A Blyth staff member assigned to a dispute reviews the evidence
              submitted by both parties and may also review the order&rsquo;s
              own message thread between the neighbor and helper, and either
              party&rsquo;s history of past disputes, before making a
              decision. The staff member who begins reviewing a dispute is
              the one who resolves it.
            </li>
            <li>
              After reviewing a dispute, Blyth may release eligible funds, issue
              a refund, deny the dispute, or request additional information from
              either party. Blyth&rsquo;s review does not guarantee a particular
              outcome.
            </li>
            <li>
              If a dispute is resolved in the neighbor&rsquo;s favor, the
              neighbor is refunded in full, including Blyth&rsquo;s service
              fee &mdash; since that cost isn&rsquo;t refunded by the payment
              processor once charged, it&rsquo;s deducted from the
              helper&rsquo;s earnings instead. If a dispute is resolved in
              the helper&rsquo;s favor, no refund is issued.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>2.5 Prohibited Listings</h3>
          <ul>
            <li>
              You may not list, sell, request, or provide illegal goods or
              services through Blyth.
            </li>
            <li>
              Prohibited listings may include illegal goods or services,
              counterfeit items, stolen property, or anything that violates
              applicable laws, regulations, or Blyth&rsquo;s Community
              Guidelines.
            </li>
            <li>
              Blyth may remove listings or restrict accounts that violate these
              requirements.
            </li>
            <li>
              See our{" "}
              <Link href="/community-guidelines">Community Guidelines</Link> for
              additional rules regarding prohibited content, goods, and
              services, and our <Link href="/dmca">Copyright Policy</Link> for
              how to report copyright infringement.
            </li>
          </ul>
        </div>
      </section>

      <section className="policy-section">
        <h2>3. Content You Post</h2>

        <div className="policy-subsection">
          <h3>3.1 License You Grant Us</h3>
          <ul>
            <li>
              When you post a listing, photo, review, or other content on
              Blyth, you keep ownership of it. You grant us a worldwide,
              non-exclusive, royalty-free license to host, store, reproduce,
              display, and distribute that content as needed to operate and
              promote the platform &mdash; for example, showing your listing
              to other users or featuring it in the app.
            </li>
            <li>
              This license ends when you delete the content or your account,
              except for copies we&rsquo;re required or permitted to retain
              for legal, security, or dispute-resolution purposes, as
              described in our Privacy Policy.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>3.2 Your Responsibility</h3>
          <ul>
            <li>
              You&rsquo;re solely responsible for the content you post. You
              confirm that you own it or have the right to post it, and that
              it doesn&rsquo;t infringe anyone else&rsquo;s rights or violate
              these Terms, our Community Guidelines, or applicable law.
            </li>
            <li>
              We don&rsquo;t review every piece of content before it&rsquo;s
              posted. We may remove content, without notice, that we believe
              violates these Terms, our Community Guidelines, or the law.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>3.3 Reviews</h3>
          <ul>
            <li>
              Reviews must reflect your own honest experience with an order.
              You may not post a review you were paid or incentivized to
              write, or one for an order you weren&rsquo;t actually part of.
            </li>
            <li>
              We may remove a review that violates this policy or our
              Community Guidelines, but we don&rsquo;t edit the content of
              reviews ourselves.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>3.4 Public Posts &amp; Feed</h3>
          <ul>
            <li>
              Listings, reviews, and certain profile information are visible
              to other users and, in some cases, to the public &mdash; see our
              Privacy Policy for details on what&rsquo;s public versus
              private.
            </li>
            <li>
              Order-related messages between a neighbor and a helper are
              private between the two of you and our staff, and are not shown
              in any public feed or listing.
            </li>
          </ul>
        </div>
      </section>

      <section className="policy-section">
        <h2>4. Termination</h2>

        <div className="policy-subsection">
          <h3>4.1 Termination &amp; Account Deletion</h3>
          <ul>
            <li>
              Blyth may suspend, restrict, or terminate an account if we
              reasonably believe the account or its activity violates these
              Terms, our Community Guidelines, applicable law, or creates a risk
              to other users or the platform.
            </li>
            <li>
              You may delete your account at any time through Account Settings.
            </li>
            <li>
              Account deletion may not immediately eliminate information that
              Blyth is required or permitted to retain for legal, security,
              fraud-prevention, financial, dispute-resolution, or other
              legitimate purposes, as described in our Privacy Policy.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>4.2 Changes to These Terms</h3>
          <ul>
            <li>
              We may update these Terms from time to time. When we make material
              changes, we may provide notice through the app or other
              appropriate means.
            </li>
            <li>
              Your continued use of Blyth after updated Terms become effective
              means that you accept the revised Terms.
            </li>
          </ul>
        </div>

        <div className="policy-subsection">
          <h3>4.3 What Survives</h3>
          <ul>
            <li>
              Sections 2.4 (Disputes), 3 (Content You Post), 5 (Disclaimers
              &amp; Limitation of Liability), 6 (Indemnification), 7
              (Governing Law &amp; Disputes), and any other provision that by
              its nature should survive, remain in effect after your account
              is terminated or deleted.
            </li>
          </ul>
        </div>
      </section>

      <section className="policy-section">
        <h2>5. Disclaimers &amp; Limitation of Liability</h2>
        <ul>
          <li>
            Blyth is provided &ldquo;as is&rdquo; and &ldquo;as
            available,&rdquo; without warranties of any kind, express or
            implied, including any warranty of merchantability, fitness for a
            particular purpose, or non-infringement.
          </li>
          <li>
            We don&rsquo;t guarantee that the platform will be uninterrupted,
            error-free, or secure, or that any listing, review, or user is
            accurate, safe, or legal. Blyth is not a party to transactions
            between neighbors and helpers and is not responsible for the
            conduct, acts, or omissions of any user, on or off the platform.
          </li>
          <li>
            To the fullest extent permitted by law, Blyth and its officers,
            employees, and agents will not be liable for any indirect,
            incidental, special, consequential, or punitive damages, or for
            any loss of profits, data, or goodwill, arising from your use of
            the platform.
          </li>
          <li>
            To the fullest extent permitted by law, our total liability to
            you for any claim arising from these Terms or your use of Blyth
            will not exceed the greater of $100 or the amount of fees you
            paid to Blyth in the 12 months before the claim arose.
          </li>
          <li>
            Some jurisdictions don&rsquo;t allow the exclusion or limitation
            of certain damages or warranties, so some of the above
            limitations may not apply to you.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>6. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless Blyth and its
          officers, employees, and agents from any claim, damage, loss, or
          expense (including reasonable attorneys&rsquo; fees) arising from
          your use of the platform, your content, your violation of these
          Terms, or your violation of any right of another person or entity.
        </p>
      </section>

      <section className="policy-section">
        <h2>7. Governing Law &amp; Disputes</h2>
        <ul>
          <li>
            These Terms are governed by the laws of the State of Maryland,
            without regard to its conflict-of-law principles.
          </li>
          <li>
            Any dispute arising from these Terms or your use of Blyth that
            isn&rsquo;t resolved through our in-app dispute process (Section
            2.4) will be subject to the exclusive jurisdiction of the state
            and federal courts located in Maryland, and you consent to that
            jurisdiction and venue.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>8. App Stores</h2>
        <ul>
          <li>
            If you downloaded Blyth from the Apple App Store or Google Play,
            you&rsquo;re also bound by that store&rsquo;s own terms of
            service, in addition to these Terms. Where there&rsquo;s a
            conflict between these Terms and a store&rsquo;s terms
            specifically about the use of software from that store, the
            store&rsquo;s terms control for that issue.
          </li>
          <li>
            Each app store is a third-party beneficiary of these Terms and
            may enforce them against you, but is not responsible for
            providing support or maintenance for Blyth, and is not
            responsible for addressing any claim relating to the app.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>9. Company Information &amp; Contact</h2>
        <p>
          Blyth is operated by Blyth LLC, a Maryland limited liability
          company.
        </p>
        <p>
          Questions about these Terms, an order, or a dispute? Reach us at
          support[at]blythapp.com, or use the Report option or an order&rsquo;s
          dispute flow in the app.
        </p>
      </section>
    </PolicyLayout>
  );
}
