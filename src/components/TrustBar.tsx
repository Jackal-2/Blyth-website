"use client";

import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import CountUp from "./CountUp";

type Stat = {
  label: string;
  prefix?: string;
  suffix?: string;
  to: number;
  from?: number;
  direction?: "up" | "down";
};

const STATS: Stat[] = [
  { to: 100, suffix: "%", label: "of Helpers ID-verified" },
  { prefix: "$", from: 0, to: 109, direction: "down", label: "charged until your Helper confirms" },
  { to: 4, suffix: "-digit", label: "code to mark every order done" },
  { to: 100, suffix: "%", label: "of their price goes to the Helper" },
];

export default function TrustBar() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 600;
  const damping = reducedMotion ? 0 : 80 / duration;

  return (
    <section className="trust-bar">
      <div className="container trust-bar-inner">
        <Fade direction="up" triggerOnce fraction={0.2} duration={duration}>
          <div>
            <h2 className="trust-bar-heading">Built on Trust, From Day One</h2>
            <p className="trust-bar-sub">Every Helper is verified, every payment protected</p>
          </div>
        </Fade>

        <div className="trust-stats">
          <Fade cascade damping={damping} direction="up" triggerOnce fraction={0.2} duration={duration}>
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="trust-stat-value">
                  {stat.prefix}
                  {reducedMotion ? (
                    stat.direction === "down" ? (stat.from ?? 0) : stat.to
                  ) : (
                    <CountUp to={stat.to} from={stat.from ?? 0} direction={stat.direction ?? "up"} duration={1.4} />
                  )}
                  {stat.suffix}
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
