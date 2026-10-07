import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Blyth",
  description: "How Blyth collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy policy" updated="Oct 1, 2026">
      <section className="policy-section">
        <h2>Welcome to Blyth</h2>
        <p>
          We&rsquo;re building a trusted marketplace that makes it easy for
          neighbors to connect with reliable local helpers.
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
        <h2>Information We Collect</h2>
        <p>
          We collect the following categories of information, each used for the
          purpose described:
        </p>
        <ul>
          <li>
            <strong>Account information you provide directly</strong> &mdash;
            name, date of birth, email, phone number, and password. Used to
            create and secure your account and confirm you meet our minimum age
            requirement.
          </li>
          <li>
            <strong>Listings, messages, and reviews</strong> &mdash; the content
            you post, the messages you send other users, and the reviews you
            leave or receive. Used to operate the marketplace and, where needed,
            to investigate a report or dispute.
          </li>
          <li>
            <strong>Identity verification information</strong> &mdash; a
            government ID photo and a live selfie. Helpers submit this to
            publish listings, along with a bank account linked through our
            payment processor (Stripe) for payout, and a business registration
            number and EIN if verifying as a business. A neighbor submits the
            same ID photo and selfie only when booking a specific option a
            helper has chosen to require it for. Used to verify identity,
            confirm you&rsquo;re eligible to publish or book, and pay out
            helper earnings.
          </li>
          <li>
            <strong>Photos</strong> &mdash; when you upload a photo to a
            listing or your profile, we automatically remove location and
            other embedded metadata (EXIF data) from it before it&rsquo;s
            stored or shown to other users.
          </li>
          <li>
            <strong>Location information</strong> &mdash; your approximate
            location, and any address you enter for a listing, or booking. Used
            to show you nearby listings and connect neighbors and helpers who
            are actually near each other.
          </li>
          <li>
            <strong>Device and push-notification tokens</strong> &mdash; an
            identifier your device provides so we can deliver push
            notifications to you. You can turn push notifications off at any
            time in your device&rsquo;s notification settings.
          </li>
          <li>
            <strong>Usage, device, and network information</strong> &mdash;
            basic technical data such as app version, device type, IP address,
            and how you interact with the app. Used to keep the app running,
            diagnose problems, detect fraud and abuse, and improve the product.
          </li>
          <li>
            <strong>Security and sign-in history</strong> &mdash; records of
            sign-ins, devices, and sessions associated with your account,
            including approximate location and IP address at the time. Used to
            help secure your account and detect suspicious activity.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>How We Use Your Information</h2>
        <p>
          Beyond the purposes above, we use your information to operate and
          improve the marketplace, process orders, verify helper and business
          identity, pay out helper earnings, show you relevant nearby listings,
          provide customer support, detect and prevent fraud and abuse, enforce
          our Terms of Service and Community Guidelines, and comply with our
          legal obligations.
        </p>
      </section>

      <section className="policy-section">
        <h2>Order Messages and Review</h2>
        <p>
          Messages you send through an order&rsquo;s chat are private between
          you, the other party, and Blyth. Our staff do not routinely read
          order messages, but may review them when needed to investigate a
          report, a dispute, suspected fraud, or a violation of our Terms of
          Service or Community Guidelines, or when required by law.
        </p>
      </section>

      <section className="policy-section">
        <h2>What&rsquo;s Public vs. Private</h2>
        <p>
          Listings, reviews you leave or receive, and certain profile
          information (such as your name and profile photo) are visible to
          other users, and in some cases to the public. Order-related
          messages, your government ID and selfie, your exact address, your
          payment details, and your bank account information are never shown
          to other users or made public.
        </p>
      </section>

      <section className="policy-section">
        <h2>How We Share Your Information</h2>

        <div className="policy-subsection">
          <h3>With other users</h3>
          <p>
            We share the minimum information necessary between a neighbor and a
            helper to complete an order &mdash; for example, your name and order
            details.
          </p>
        </div>

        <div className="policy-subsection">
          <h3>With third-party service providers</h3>
          <p>
            We share information with service providers who perform functions on
            our behalf: our payment processor (Stripe), which handles card
            charges, payouts, and helper bank account verification through
            Stripe Connect; an identity-verification provider, which
            processes the ID photo and selfie helpers and some neighbors
            submit; cloud hosting and database providers, who store platform
            data securely; a mapping and address-autocomplete provider, which
            powers location search; and push-notification services, delivered
            through Apple and Google, which send notifications to your
            device. These providers may only use your information to perform
            the service we&rsquo;ve asked for.
          </p>
        </div>

        <div className="policy-subsection">
          <h3>For legal and safety reasons</h3>
          <p>
            We may share information if required by law, in response to a valid
            legal request, or where we believe it&rsquo;s necessary to protect
            the safety of a user, Blyth, or the public, or to investigate fraud
            or a violation of our Terms of Service or Community Guidelines.
          </p>
        </div>

        <div className="policy-subsection">
          <h3>We don&rsquo;t sell your data</h3>
          <p>
            We don&rsquo;t sell your personal information to third parties, and
            we don&rsquo;t share it for third-party advertising.
          </p>
        </div>
      </section>

      <section className="policy-section">
        <h2>Where Your Information Is Processed</h2>
        <p>
          We and the service providers described above may process and store
          your information in the United States or other countries where we
          or they operate. Where your information is transferred
          internationally, we take steps intended to provide an appropriate
          level of protection for it, consistent with applicable law.
        </p>
      </section>

      <section className="policy-section">
        <h2>How Long We Keep Your Information</h2>
        <p>
          We keep your information for as long as your account is active, and
          for a period afterward as needed to resolve disputes, enforce our
          agreements, and comply with our legal, tax, and accounting
          obligations. Order and review history tied to other users may be
          retained in de-identified form after account deletion, since it may
          still matter to the other party or be needed for legal or dispute
          purposes.
        </p>
      </section>

      <section className="policy-section">
        <h2>How We Protect It</h2>
        <p>
          Messages, bank details, and verification records are encrypted both in
          transit and in our database. Access to that information is limited to
          what you need to see yourself, or to what our team needs to
          investigate a report or dispute you or someone else raised. No
          method of transmission or storage is completely secure, and we
          can&rsquo;t guarantee absolute security of your information.
        </p>
      </section>

      <section className="policy-section">
        <h2>Your Rights and Choices</h2>
        <p>
          You can review and update most of your information at any time from
          Account Settings, and you can delete your account directly in the
          app from Account Settings. You can also ask us to access, correct,
          or delete your personal information, or to limit how we use it, by
          contacting us at support[at]blythapp.com &mdash; we aim to respond
          to these requests within 30 days. Deleting your account removes your
          personal details and verification records; order and review history
          tied to other users is retained in de-identified form, since it may
          still matter to the other party or be needed for legal or dispute
          purposes.
        </p>
        <p>
          You can turn off push notifications at any time in your
          device&rsquo;s settings.
        </p>
        <p>
          If you&rsquo;re in a region that gives you additional statutory
          privacy rights &mdash; for example under the GDPR or a U.S. state
          privacy law &mdash; those rights apply to you in addition to
          what&rsquo;s described here, and you can exercise them the same way,
          by contacting us.
        </p>
      </section>

      <section className="policy-section">
        <h2>Children&rsquo;s Privacy</h2>
        <p>
          Blyth is not directed to, and is not intended for use by, anyone under
          18 (see Section 1.3 of our Terms of Service). We don&rsquo;t knowingly
          collect personal information from anyone under 18. If we learn that
          we&rsquo;ve collected information from a user under 18, we&rsquo;ll
          delete the account and the associated information. If you believe a
          child has provided us with personal information, please contact us at
          support[at]blythapp.com.
        </p>
      </section>

      <section className="policy-section">
        <h2>Security Incidents</h2>
        <p>
          If a security incident compromises your personal information,
          we&rsquo;ll investigate, take steps to contain and remediate it, and
          notify affected users and any regulators or authorities as required by
          applicable law, without undue delay.
        </p>
      </section>

      <section className="policy-section">
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we make
          material changes, we&rsquo;ll provide notice through the app or other
          appropriate means. Your continued use of Blyth after an updated Policy
          becomes effective means you accept the revised Policy.
        </p>
      </section>

      <section className="policy-section">
        <h2>Contact Us</h2>
        <p>
          Questions about this Privacy Policy or how we handle your information?
          Reach us at support[at]blythapp.com.
        </p>
      </section>
    </PolicyLayout>
  );
}
