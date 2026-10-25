"use client";

import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// An example $100 item: Helper price plus Blyth's 6% markup, plus the
// Service fee (2.9% + $0.30 card processing) — the same maths as the app.
export default function ClearPrices() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 600;

  return (
    <section className="prices">
      <div className="container">
        <Fade direction="up" triggerOnce fraction={0.2} duration={duration}>
          <p className="section-label">Clear prices</p>
          <h2 className="section-heading">The price you see is the price you pay</h2>
          <p className="section-heading-sub">
            No fees sprung on you at checkout. The listing price already includes Blyth&rsquo;s fees, and checkout
            shows exactly what&rsquo;s inside it.
          </p>
        </Fade>

        <div className="prices-grid">
          <Fade direction="up" triggerOnce fraction={0.2} duration={duration}>
            <div className="prices-panel">
              <span className="prices-kicker">On the listing</span>
              <p className="prices-big">
                $109.47
              </p>
              <p className="prices-what">Wireless headphones</p>
            </div>
          </Fade>

          <Fade triggerOnce fraction={0.2} duration={duration} delay={reducedMotion ? 0 : 900}>
            <div className="prices-equals" aria-hidden="true">
              =
            </div>
          </Fade>

          <div className="prices-panel">
            <span className="prices-kicker">At checkout</span>
            <div className="prices-rows">
              <Fade cascade damping={0.4} direction="left" triggerOnce fraction={0.2} duration={duration}>
                <div>
                  <span>Item price</span>
                  <span>$106.00</span>
                </div>
                <div>
                  <span>Service fee</span>
                  <span>$3.47</span>
                </div>
                <div className="prices-total prices-total-inline">
                  <span>Total =</span>
                  <span>$109.47</span>
                </div>
              </Fade>
            </div>
          </div>
        </div>

        <p className="prices-fine">Sales tax is added at checkout where it applies.</p>
      </div>
    </section>
  );
}
