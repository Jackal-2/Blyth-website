"use client";

import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Only questions the rest of the page doesn't already answer.
const FAQS = [
  {
    q: "Can I cancel?",
    a: "Yes. Before the Helper accepts, cancelling is free. After they accept, you can still cancel, but the service fee isn’t refunded.",
  },
  {
    q: "Can I change the time of a booking?",
    a: "Yes, once. Ask for a new time from the booking in the app, up to 5 hours before it starts. The Helper accepts or declines, with no extra charge.",
  },
  { q: "Do Helpers see my card details?", a: "No. Payments go through Stripe, and Helpers never see your card." },
  {
    q: "What if something goes wrong?",
    a: "Open a dispute from the order in the app. The payment stays on hold while our team looks at it.",
  },
  {
    q: "How do I become a Helper?",
    a: "Download the app, verify your ID and add your bank account, then post your first listing.",
  },
  { q: "Is Blyth in my area?", a: "Blyth is for neighborhoods across the US. Open the app to see the Helpers near you." },
];

export default function Faq() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 500;

  return (
    <section className="faq" id="faq">
      <div className="container">
        <Fade direction="up" triggerOnce fraction={0.2} duration={duration}>
          <p className="section-label">Questions</p>
          <h2 className="section-heading">FAQs</h2>
        </Fade>
        <div className="faq-list">
          <Fade cascade damping={0.08} direction="up" triggerOnce fraction={0.1} duration={duration}>
            {FAQS.map((item, i) => (
              <details key={item.q} className="faq-item" open={i === 0}>
                <summary className="cursor-target">{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </Fade>
        </div>
      </div>
    </section>
  );
}
