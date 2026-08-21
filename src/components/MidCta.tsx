"use client";

import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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
          <div className="mid-cta-badge">
            <Image src="/images/logo-mark.png" alt="" width={64} height={82} aria-hidden="true" />
            <div className="mid-cta-badge-divider" />
            <span className="mid-cta-badge-word">BLYTH</span>
          </div>
        </Fade>
      </div>
    </section>
  );
}
