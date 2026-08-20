"use client";

import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const STATS = [
  { value: "100%", label: "Helper Verifications" },
  { value: "24/7", label: "Support & Safety" },
  { value: "Secure", label: "Escrow Payments" },
  { value: "5.0★", label: "Rated Experience" },
];

export default function TrustBar() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 600;
  const damping = reducedMotion ? 0 : 80 / duration;

  return (
    <section className="trust-bar">
      <div className="container trust-bar-inner">
        <Fade direction="up" triggerOnce={false} fraction={0.2} duration={duration}>
          <div>
            <h2 className="trust-bar-heading">Built on Trust, From Day One</h2>
            <p className="trust-bar-sub">Every Helper is verified, every payment protected</p>
          </div>
        </Fade>

        <div className="trust-stats">
          <Fade cascade damping={damping} direction="up" triggerOnce={false} fraction={0.2} duration={duration}>
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="trust-stat-value">{stat.value}</p>
                <p className="trust-stat-label">{stat.label}</p>
              </div>
            ))}
          </Fade>
        </div>
      </div>
    </section>
  );
}
