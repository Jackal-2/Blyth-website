import type { Metadata } from "next";
import Link from "next/link";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata: Metadata = {
  title: "Delete Your Account — Blyth",
  description:
    "How to delete your Blyth account and associated data, whether or not you still have the app installed.",
  alternates: { canonical: "/delete-account" },
};

export default function DeleteAccountPage() {
  return (
    <PolicyLayout title="Delete your Blyth account" updated="Oct 22, 2026">
      <section className="policy-section">
        <p>
          You can permanently delete your Blyth account and its associated
          data at any time. There are two ways to do this, depending on
          whether you still have the app installed.
        </p>
      </section>

      <section className="policy-section">
        <h2>If you have the Blyth app installed</h2>
        <ul>
          <li>Open the Blyth app and sign in.</li>
          <li>Go to Account Settings.</li>
          <li>Tap &ldquo;Delete Account&rdquo;.</li>
          <li>
            Enter your password to confirm. Your account and associated data
            are permanently deleted immediately &mdash; this cannot be
            undone.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>If you no longer have the app installed</h2>
        <p>
          Email <strong>support[at]blythapp.com</strong> from the email
          address on your Blyth account, with the subject line{" "}
          <strong>&ldquo;Delete my account&rdquo;</strong>. We&rsquo;ll
          verify the request, delete your account and associated data, and
          confirm by email once it&rsquo;s done &mdash; you don&rsquo;t need
          to reinstall the app to do this.
        </p>
      </section>

      <section className="policy-section">
        <h2>What gets deleted</h2>
        <p>
          Deleting your account removes your profile, listings, messages,
          and other account data from Blyth. Some information may be
          retained for a limited time where required for security, fraud
          prevention, or legal and regulatory compliance (for example,
          records tied to a completed order or a verified identity
          document). See our{" "}
          <Link href="/privacy">Privacy Policy</Link> for details on data
          retention.
        </p>
      </section>

      <section className="policy-section">
        <h2>Need help?</h2>
        <p>
          If you run into any trouble requesting deletion, contact us at{" "}
          support[at]blythapp.com or visit our{" "}
          <Link href="/support">Support</Link> page.
        </p>
      </section>
    </PolicyLayout>
  );
}
