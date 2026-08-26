"use client";

import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import TiltedCard from "./TiltedCard";

export default function BottomCta() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 450;
  const phonesDuration = reducedMotion ? 1 : 550;
  const damping = reducedMotion ? 0 : 150 / phonesDuration;

  return (
    <section className="bottom-cta" id="get-app">
      <div className="container bottom-cta-inner">
        <Fade triggerOnce={false} fraction={0.25} duration={duration}>
          <div>
            <h2 className="bottom-cta-heading">
              Get help, or give it — right from your phone
            </h2>
            <p className="bottom-cta-sub">
              Download Blyth to book trusted local Helpers or start earning by
              offering your own skills. Simple, secure, and just a tap away.
            </p>

            <p className="bottom-cta-download-label">Get the App</p>
            <div className="bottom-cta-badges">
              <a
                className="store-pill store-pill-white cursor-target"
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/app-store.png"
                  alt=""
                  width={50}
                  height={50}
                  className="store-pill-icon"
                  aria-hidden="true"
                />
                <span className="store-pill-text">Download for iOS</span>
              </a>
              <a
                className="store-pill store-pill-white cursor-target"
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/playstore.png"
                  alt=""
                  width={50}
                  height={50}
                  className="store-pill-icon"
                  aria-hidden="true"
                />
                <span className="store-pill-text">Download for Android</span>
              </a>
            </div>
          </div>
        </Fade>

        <div className="bottom-cta-phones">
          <Fade
            cascade
            damping={damping}
            triggerOnce={false}
            fraction={0.2}
            duration={phonesDuration}
          >
            <div className="bottom-cta-phone bottom-cta-phone-back">
              {reducedMotion ? (
                <Image
                  src="/images/screen-discover.png"
                  alt="Discover screen in the Blyth app"
                  width={220}
                  height={440}
                />
              ) : (
                <div className="phone-tilted-card">
                  <TiltedCard
                    imageSrc="/images/screen-discover.png"
                    altText="Discover screen in the Blyth app"
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    rotateAmplitude={10}
                    scaleOnHover={1.04}
                    showMobileWarning={false}
                    showTooltip={false}
                  />
                </div>
              )}
            </div>
            <div className="bottom-cta-phone bottom-cta-phone-front">
              {reducedMotion ? (
                <Image
                  src="/images/screen-provider.png"
                  alt="Provider profile screen in the Blyth app"
                  width={220}
                  height={440}
                />
              ) : (
                <div className="phone-tilted-card">
                  <TiltedCard
                    imageSrc="/images/screen-provider.png"
                    altText="Provider profile screen in the Blyth app"
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    rotateAmplitude={10}
                    scaleOnHover={1.04}
                    showMobileWarning={false}
                    showTooltip={false}
                  />
                </div>
              )}
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}
