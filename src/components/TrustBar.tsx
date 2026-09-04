"use client";

import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import CountUp from "./CountUp";

type Stat = {
  label: string;
  // Numeric stats animate with CountUp; `suffix` is static text appended after.
  to?: number;
  suffix?: string;
  // Non-numeric stats (nothing to count) just render `value` as-is.
  value?: string;
};

const STATS: Stat[] = [
  { to: 100, suffix: "%", label: "Helper Verifications" },
  { to: 24, suffix: "/7", label: "Support & Safety" },
  { value: "Secure", label: "Escrow Payments" },
  { to: 5, suffix: ".0★", label: "Rated Experience" },
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
                <p className="trust-stat-value">
                  {stat.to !== undefined ? (
                    reducedMotion ? (
                      `${stat.to}${stat.suffix ?? ""}`
                    ) : (
                      <>
                        <CountUp to={stat.to} duration={1.4} />
                        {stat.suffix}
                      </>
                    )
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="trust-stat-label">{stat.label}</p>
              </div>
            ))}
          </Fade>
        </div>
      </div>
    </section>
  );
}
