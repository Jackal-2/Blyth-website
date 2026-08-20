"use client";

import Image from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { RibbonStarIcon } from "./icons";

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 650;
  const damping = reducedMotion ? 0 : 150 / duration;

  return (
    <section className="hero">
      <Fade cascade damping={damping} triggerOnce={false} fraction={0.2} duration={duration}>
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-glow-teal" aria-hidden="true" />
      </Fade>

      <div className="hero-inner">
        <div>
          <Fade cascade damping={damping} direction="up" triggerOnce={false} fraction={0.2} duration={duration}>
            <h1 className="hero-heading">
              It&rsquo;s not just a Marketplace, it&rsquo;s Your <span className="accent">Neighborhood</span>
            </h1>
            <p className="hero-sub">
              Blyth connects neighbors with trusted, verified local Helpers — for everyday tasks, errands, jobs
              big or small, and buying or selling items nearby. Simple to book, safe to trust.
            </p>
            <div className="hero-cta">
              <Link href="/#get-app" className="btn btn-accent">
                Get Started
              </Link>
            </div>

            <div className="hero-trust-badge">
              <span className="hero-trust-badge-icon">
                <RibbonStarIcon />
              </span>
              <span className="hero-trust-badge-text">
                <strong>5.0 Rating</strong>
                <span>From 1,000+ neighbors</span>
              </span>
            </div>
          </Fade>
        </div>

        <Fade direction="up" triggerOnce={false} fraction={0.2} duration={reducedMotion ? 1 : 750}>
          <div className="hero-decor">
            <div className="hero-brandmark">
              <Image
                src="/images/logo-full.png"
                alt="Blyth"
                width={744}
                height={425}
                className="hero-logo-full"
                aria-hidden="true"
              />
            </div>

            <div className="hero-pin-badge">
              <span className="hero-pin-dot" aria-hidden="true" />
              <span>Helpers near you</span>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}
