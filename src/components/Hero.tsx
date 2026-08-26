"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import TextType from "./TextType";

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 650;
  const damping = reducedMotion ? 0 : 150 / duration;
  const [introTyped, setIntroTyped] = useState(reducedMotion);

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
              {reducedMotion ? (
                <>
                  It&rsquo;s not just a Marketplace, it&rsquo;s Your <span className="accent">Neighborhood.</span>
                </>
              ) : (
                <>
                  <TextType
                    as="span"
                    text={["It’s not just a Marketplace, it’s Your "]}
                    typingSpeed={45}
                    initialDelay={400}
                    loop={false}
                    showCursor={false}
                    onSentenceComplete={() => setIntroTyped(true)}
                  />
                  {introTyped && (
                    <TextType
                      as="span"
                      className="accent"
                      text={["Neighborhood."]}
                      typingSpeed={45}
                      loop={false}
                      showCursor={true}
                      cursorCharacter="|"
                    />
                  )}
                </>
              )}
            </h1>
            <p className="hero-sub">
              Blyth connects neighbors with trusted, verified local Helpers — for everyday tasks, errands, jobs
              big or small, and buying or selling items nearby. Simple to book, safe to trust.
            </p>
            <div className="hero-cta">
              <Link href="/#get-app" className="btn btn-accent cursor-target">
                Get Started
              </Link>
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
          </div>
        </Fade>
      </div>
    </section>
  );
}
