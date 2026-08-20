"use client";

import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function BottomCta() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 650;
  const damping = reducedMotion ? 0 : 150 / duration;

  return (
    <section className="bottom-cta" id="get-app">
      <div className="container bottom-cta-inner">
        <Fade direction="up" triggerOnce={false} fraction={0.2} duration={duration}>
          <div>
            <h2 className="bottom-cta-heading">Get help, or give it — right from your phone</h2>
            <p className="bottom-cta-sub">
              Download Blyth to book trusted local Helpers or start earning by offering your own skills. Simple,
              secure, and just a tap away.
            </p>

            <p className="bottom-cta-download-label">Get the App</p>
            <div className="bottom-cta-badges">
              <a className="store-pill store-pill-white" href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                <Image src="/images/app-store.png" alt="" width={34} height={34} className="store-pill-icon" aria-hidden="true" />
                <span className="store-pill-text">Download for iOS</span>
              </a>
              <a className="store-pill store-pill-white" href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                <Image src="/images/playstore.png" alt="" width={34} height={34} className="store-pill-icon" aria-hidden="true" />
                <span className="store-pill-text">Download for Android</span>
              </a>
            </div>
          </div>
        </Fade>

        <div className="bottom-cta-phones">
          <Fade cascade damping={damping} triggerOnce={false} fraction={0.2} duration={duration}>
            <div className="bottom-cta-phone bottom-cta-phone-back">
              <Image src="/images/screen-discover.png" alt="Discover screen in the Blyth app" width={220} height={440} />
            </div>
            <div className="bottom-cta-phone bottom-cta-phone-front">
              <Image src="/images/screen-provider.png" alt="Provider profile screen in the Blyth app" width={220} height={440} />
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}
