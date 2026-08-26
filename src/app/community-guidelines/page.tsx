import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata: Metadata = {
  title: "Community Guidelines — Blyth",
  description:
    "The rules that keep Blyth a safe, trustworthy marketplace for neighbors and helpers.",
};

export default function CommunityGuidelinesPage() {
  return (
    <PolicyLayout title="Community guidelines" updated="Aug 8, 2026">
      <section className="policy-section">
        <p>
          These guidelines exist to keep Blyth a safe, trustworthy place for
          neighbors and helpers to do business with each other. They work
          alongside our Terms of Service, and Blyth may remove listings,
          content, or accounts that don&rsquo;t follow them.
        </p>
      </section>

      <section className="policy-section">
        <h2>Prohibited Listings</h2>
        <ul>
          <li>Illegal goods or services of any kind.</li>
          <li>Counterfeit items or stolen property.</li>
          <li>
            Weapons, hazardous materials, or other items that are dangerous or
            restricted under applicable law.
          </li>
          <li>
            Anything that infringes another party&rsquo;s intellectual
            property or other legal rights.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>Respectful Conduct</h2>
        <ul>
          <li>
            Treat other neighbors and helpers with respect. Harassment,
            threats, hate speech, and discriminatory behavior are not
            tolerated.
          </li>
          <li>
            Communicate honestly and keep order-related conversations on
            Blyth so we can help if something goes wrong.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>Honest Listings &amp; Orders</h2>
        <ul>
          <li>
            Describe items and services accurately, including condition,
            availability, and price.
          </li>
          <li>
            Fulfill orders you accept, and communicate promptly if something
            changes.
          </li>
          <li>
            Only share a confirmation code once you&rsquo;ve actually received
            the item or service.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>Reporting a Problem</h2>
        <p>
          If you see a listing or message that violates these guidelines, or
          have a problem with an order, please report it through the app or
          contact support so our team can take a look.
        </p>
      </section>
    </PolicyLayout>
  );
}
