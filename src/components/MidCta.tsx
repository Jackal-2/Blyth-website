"use client";

import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// A radar-style "near you" visual — helper markers orbiting a center pin
// at varying distances. Replaces the old avatar stack / dome-shaped
// wordmark badge, which didn't tie back to the "trusted helpers near
// you" copy next to it. Orbit speed/direction differ per pin so the
// motion reads as organic rather than mechanical; actual orbit motion
// is handled in CSS (see .mid-cta-orbit in globals.css) and is skipped
// entirely under prefers-reduced-motion.
const PINS = [
  // Sits right on the innermost ring — a shorter radius means a shorter
  // orbit, so it also gets the fastest duration (real orbital motion:
  // closer in, faster around), which makes the ring itself read as
  // "occupied" instead of just decorative.
  { initials: "SN", tone: "teal", top: "41%", left: "66%", duration: "16s" },
  { initials: "JM", tone: "accent", top: "10%", left: "58%", duration: "22s" },
  { initials: "AK", tone: "teal", top: "35%", left: "88%", duration: "28s", reverse: true },
  { initials: "RS", tone: "accent-light", top: "72%", left: "80%", duration: "25s" },
  { initials: "TL", tone: "teal-dark", top: "78%", left: "30%", duration: "30s", reverse: true },
  { initials: "CB", tone: "accent", top: "28%", left: "8%", duration: "24s" },
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
          <div className="mid-cta-radar" aria-hidden="true">
            <div className="mid-cta-radar-ring mid-cta-radar-ring--1" />
            <div className="mid-cta-radar-ring mid-cta-radar-ring--2" />
            <div className="mid-cta-radar-ring mid-cta-radar-ring--3" />
            <span className="mid-cta-radar-dist mid-cta-radar-dist--1">1.2 mi</span>
            <span className="mid-cta-radar-dist mid-cta-radar-dist--2">0.4 mi</span>
            <div className="mid-cta-radar-center" />
            {PINS.map((p) => (
              <div
                key={p.initials}
                className={`mid-cta-orbit${p.reverse ? " mid-cta-orbit--reverse" : ""}`}
                style={{ animationDuration: p.duration }}
              >
                <span
                  className={`mid-cta-pin mid-cta-pin--${p.tone}`}
                  style={{ top: p.top, left: p.left, animationDuration: p.duration }}
                >
                  {p.initials}
                </span>
              </div>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}
