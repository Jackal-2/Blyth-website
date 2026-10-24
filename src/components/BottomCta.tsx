"use client";

import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import TiltedCard from "./TiltedCard";
import { STORE_URLS } from "@/lib/appLinks";

type StoreButtonProps = { href: string; icon: string; label: string };

// Links to the store page once it exists; until then it says "Soon" instead of
// sending people to the store's home page.
function StoreButton({ href, icon, label }: StoreButtonProps) {
  const content = (
    <>
      <Image src={icon} alt="" width={20} height={20} className="store-pill-icon" aria-hidden="true" />
      <span className="store-pill-text">{label}</span>
      {href ? null : <span className="store-soon">Soon</span>}
    </>
  );
  return href ? (
    <a className="btn btn-light cursor-target" href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <span className="btn btn-light store-pill-soon" aria-label={`${label}, coming soon`}>
      {content}
    </span>
  );
}

export default function BottomCta({ qrSvg }: { qrSvg?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 450;
  const phonesDuration = reducedMotion ? 1 : 550;
  const damping = reducedMotion ? 0 : 150 / phonesDuration;

  return (
    <section className="bottom-cta" id="get-app">
      <div className="container bottom-cta-inner">
        <Fade triggerOnce fraction={0.25} duration={duration}>
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
              <StoreButton href={STORE_URLS.ios} icon="/images/app-store.png" label="Download for iOS" />
              <StoreButton href={STORE_URLS.android} icon="/images/playstore.png" label="Download for Android" />
            </div>

            {qrSvg ? (
              <div className="bottom-cta-qr">
                <div className="bottom-cta-qr-code" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                <p>On a computer? Scan to get Blyth on your phone.</p>
              </div>
            ) : null}
          </div>
        </Fade>

        <div className="bottom-cta-phones">
          <Fade
            cascade
            damping={damping}
            triggerOnce
            fraction={0.2}
            duration={phonesDuration}
          >
            <div className="bottom-cta-phone bottom-cta-phone-back">
              {reducedMotion ? (
                <Image
                  src="/images/screen-discover-v2.jpg"
                  alt="Discover screen in the Blyth app"
                  width={220}
                  height={440}
                />
              ) : (
                <div className="phone-tilted-card">
                  <TiltedCard
                    imageSrc="/images/screen-discover-v2.jpg"
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
                  src="/images/screen-listing-v2.jpg"
                  alt="Listing screen in the Blyth app"
                  width={220}
                  height={440}
                />
              ) : (
                <div className="phone-tilted-card">
                  <TiltedCard
                    imageSrc="/images/screen-listing-v2.jpg"
                    altText="Listing screen in the Blyth app"
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
