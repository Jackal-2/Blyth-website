import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata: Metadata = {
  title: "DMCA / Copyright Policy — Blyth",
  description: "How to report copyright infringement on Blyth, and how we respond.",
};

// Static on purpose — see the comment on src/app/terms/page.tsx. Kept in
// sync by hand with the `dmca` LegalDocument in Blyth-admin's Legal
// Documents page and Blyth-Backend/scripts/seedLegalDocuments.ts.
export default function DmcaPolicyPage() {
  return (
    <PolicyLayout title="DMCA / Copyright policy" updated="Aug 27, 2026">
      <section className="policy-section">
        <p>
          Blyth respects the intellectual property rights of others and
          expects everyone who uses the platform to do the same. This policy
          explains how to report content on Blyth that you believe infringes
          your copyright, and how we respond to those reports.
        </p>
      </section>

      <section className="policy-section">
        <h2>1. Reporting Infringing Content</h2>
        <p>
          If you believe content on Blyth &mdash; a listing, photo, message,
          or other material &mdash; infringes your copyright, you (or your
          authorized agent) may send a written notice to our Designated Agent
          that includes all of the following:
        </p>
        <ul>
          <li>
            A physical or electronic signature of the copyright owner or a
            person authorized to act on their behalf.
          </li>
          <li>Identification of the copyrighted work you claim has been infringed.</li>
          <li>
            Identification of the material you claim is infringing, and
            information reasonably sufficient for us to locate it on Blyth
            (for example, a link or a description of the listing).
          </li>
          <li>Your contact information, including your address, telephone number, and email address.</li>
          <li>
            A statement that you have a good faith belief the use of the
            material is not authorized by the copyright owner, its agent, or
            the law.
          </li>
          <li>
            A statement, made under penalty of perjury, that the above
            information is accurate and that you are the copyright owner or
            authorized to act on their behalf.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>2. Designated Agent</h2>
        <p>Send copyright notices to our Designated Agent:</p>
        <ul>
          <li>Email: copyright@blythapp.com</li>
        </ul>
        <p>We can only act on a complete, valid notice &mdash; an incomplete one may delay our response.</p>
      </section>

      <section className="policy-section">
        <h2>3. What Happens Next</h2>
        <p>
          Upon receiving a valid notice, we will remove or disable access to
          the reported content and notify the user who posted it, including a
          copy of the notice where appropriate. Removing content in response
          to a notice is not an admission by Blyth or the user that
          infringement occurred.
        </p>
      </section>

      <section className="policy-section">
        <h2>4. Counter-Notification</h2>
        <p>
          If you believe content you posted was removed or disabled by
          mistake or misidentification, you may submit a counter-notification
          to our Designated Agent that includes:
        </p>
        <ul>
          <li>Your physical or electronic signature.</li>
          <li>
            Identification of the material that was removed and where it
            appeared on Blyth before removal.
          </li>
          <li>
            A statement, made under penalty of perjury, that you have a good
            faith belief the material was removed as a result of mistake or
            misidentification.
          </li>
          <li>
            Your name, address, and telephone number, and a statement that you
            consent to the jurisdiction of the federal court in your district
            (or, if you&rsquo;re outside the United States, an appropriate
            judicial district) and will accept service of process from the
            person who filed the original notice.
          </li>
        </ul>
        <p>
          If we receive a valid counter-notification, we may restore the
          content within 10 to 14 business days unless the original
          complainant notifies us that they&rsquo;ve filed a court action
          seeking to restrain the user from the infringing activity.
        </p>
      </section>

      <section className="policy-section">
        <h2>5. Repeat Infringers</h2>
        <p>
          Blyth will terminate, in appropriate circumstances, the accounts of
          users determined to be repeat infringers.
        </p>
      </section>

      <section className="policy-section">
        <h2>6. Misrepresentation</h2>
        <p>
          Anyone who knowingly makes a material misrepresentation in a notice
          or counter-notification may be liable for damages, including costs
          and attorneys&rsquo; fees incurred by us or the accused user as a
          result.
        </p>
      </section>

      <section className="policy-section">
        <h2>7. Other Intellectual Property Concerns</h2>
        <p>
          For an intellectual property concern that isn&rsquo;t about
          copyright &mdash; a trademark issue, for example &mdash; contact
          support@blythapp.com and we&rsquo;ll route it appropriately.
        </p>
      </section>
    </PolicyLayout>
  );
}
