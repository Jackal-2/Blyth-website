"use client";

import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Illustrative helper avatars (initials on solid color) — not tied to
// specific named people, since no real helper photos are wired in yet.
// Replaces the old black dome-shaped Blyth wordmark badge, which was
// just a brand mark and didn't tie back to the heading next to it.
const AVATARS = [
  { initials: "JM", tone: "accent" },
  { initials: "AK", tone: "teal" },
  { initials: "RS", tone: "accent-light" },
  { initials: "TL", tone: "teal-dark" },
  { initials: "CB", tone: "accent" },
];

export default function MidCta() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 650;

  return (
    <section className="mid-cta">
      <div className="container mid-cta-inner">
        <Fade direction="up" triggerOnce={false} fraction={0.2} duration={duration}>
          <div>
            <h2 className="mid-cta-heading">Connect With Trusted Helpers Near You</h2>
            <p className="mid-cta-sub">
              From home repairs to errands, find the right person for the job — right in your neighborhood.
            </p>
          </div>
        </Fade>

        <Fade triggerOnce={false} fraction={0.2} duration={duration} delay={reducedMotion ? 0 : 150}>
          <div className="mid-cta-avatars">
            <div className="mid-cta-avatar-stack">
              {AVATARS.map((a, i) => (
                <span
                  key={a.initials}
                  className={`mid-cta-avatar mid-cta-avatar--${a.tone}`}
                  style={{ zIndex: AVATARS.length - i }}
                  aria-hidden="true"
                >
                  {a.initials}
                </span>
              ))}
              <span className="mid-cta-avatar mid-cta-avatar--more" aria-hidden="true">
                +
              </span>
            </div>
            <p className="mid-cta-avatars-caption">Real helpers, already nearby</p>
          </div>
        </Fade>
      </div>
    </section>
  );
}
