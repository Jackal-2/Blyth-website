import type { Metadata } from "next";
import PageReveal from "@/components/PageReveal";

export const metadata: Metadata = {
  title: "Support — Blyth",
  description: "Get help with your Blyth account, orders, and the app.",
};

const FAQS = [
  {
    question: "How do I download the app?",
    answer:
      "Blyth is available on iOS and Android. Use the “Get the App” links in the footer or the bottom of the home page to open the App Store or Google Play.",
  },
  {
    question: "How do I report a problem with an order or an account?",
    answer:
      "Open the order or profile in question from the app and use the Report option, or email us directly and we'll look into it.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "You can delete your account at any time from Account Settings in the app. See our Privacy Policy for what happens to your data when you do.",
  },
];

export default function SupportPage() {
  return (
    <main className="policy-page">
      <div className="container">
        <PageReveal>
          <div className="policy-header">
            <h1 className="policy-title">Support</h1>
            <p className="policy-updated">
              We&rsquo;re here to help with anything Blyth-related.
            </p>
          </div>
        </PageReveal>

        <div className="policy-content">
          <PageReveal cascade delay={90}>
            <section className="policy-section">
              <h2>Contact us</h2>
              <p>
                The fastest way to reach us is by email at support[at]blythapp.com.
              </p>
            </section>

            <section className="policy-section">
              <h2>FAQs</h2>
              {FAQS.map((faq) => (
                <div className="policy-subsection" key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </section>
          </PageReveal>
        </div>
      </div>
    </main>
  );
}
