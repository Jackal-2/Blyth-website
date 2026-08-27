"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Fade } from "react-awesome-reveal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import TiltedCard from "./TiltedCard";
import {
  BellIcon,
  BriefcaseIcon,
  ChatHandsIcon,
  ShieldCheckIcon,
  RibbonStarIcon,
  IdBadgeIcon,
  CheckCircleIcon,
  ReceiptIcon,
} from "./icons";

const LEFT_ITEMS = [
  {
    icon: <IdBadgeIcon />,
    title: "Helper Dashboard",
    body: "Helpers can manage listings, requests, orders, balances, withdrawals, and order activity.",
  },
  {
    icon: <CheckCircleIcon />,
    title: "Confirmation-Based Completion",
    body: "A confirmation code verifies that the service or item was received before the order is marked complete and the Helper's earnings are released.",
  },
  {
    icon: <ReceiptIcon />,
    title: "Secure Payments & Earnings",
    body: "Neighbors can request and pay for items and services through a structured order system. Helpers can track their earnings and withdrawals.",
  },
];

const RIGHT_ITEMS = [
  {
    icon: <BriefcaseIcon />,
    title: "Buy & Book Locally",
    body: "Browse products or book services directly from people nearby.",
  },
  {
    icon: <ChatHandsIcon />,
    title: "Connect Directly",
    body: "Message Helpers directly to coordinate details, ask questions, and arrange the handoff.",
  },
  {
    icon: <ShieldCheckIcon />,
    title: "Trusted & Verified",
    body: "Trust starts with verification. All helpers undergo identity verification to join our community, while registered businesses receive a badge.",
  },
];

const LEFT_OFFSETS = ["translate(10px, 10px)", "translate(-80px, 35px)", "translate(10px, 50px)"];
const RIGHT_OFFSETS = ["translate(110px, -40px)", "translate(115px, 10px)", "translate(90px, 80px)"];

const STEP_MS = 200;
const LEFT_DELAYS = [0, STEP_MS, STEP_MS * 2];
const RIGHT_DELAYS = [STEP_MS * 3, STEP_MS * 4, STEP_MS * 5];

// Matches the `max-width: 1080px` breakpoint in globals.css where the ring
// collapses into a single-column list.
const MOBILE_QUERY = "(max-width: 1080px)";

type FeatureListProps = {
  items: { icon: ReactNode; title: string; body: string }[];
  offsets: string[];
  direction: "left" | "right";
  delay: number;
  isMobile: boolean;
  cascadeDamping: number;
  duration: number;
};

function FeatureList({ items, offsets, direction, delay, isMobile, cascadeDamping, duration }: FeatureListProps) {
  const children = items.map((item, i) => (
    <div className="feature-item" key={item.title} style={{ "--ring-offset": offsets[i] } as CSSProperties}>
      <span className="feature-icon">{item.icon}</span>
      <div>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
      </div>
    </div>
  ));

  // On mobile the list order is flattened (see the `order` rules in
  // globals.css) and every item reveals together with the phone image
  // instead of on its own scroll position, so the individually-cascading
  // Fade is skipped in favor of the shared `.features-ring.in-view` CSS
  // transition (also in globals.css).
  if (isMobile) return <>{children}</>;

  return (
    <Fade cascade damping={cascadeDamping} direction={direction} triggerOnce={false} fraction={0.2} duration={duration} delay={delay}>
      {children}
    </Fade>
  );
}

export default function FeaturesRing() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const duration = reducedMotion ? 1 : 500;
  const cascadeDamping = reducedMotion ? 0 : STEP_MS / duration;
  const withDelay = (ms: number) => (reducedMotion ? 0 : ms);

  const ringRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // Deliberately observe a small fixed-size sentinel pinned to the top
    // of the ring, NOT the ring itself. A percentage threshold on the
    // ring is a fraction of ITS OWN height, and that height varies a lot
    // — ~850px in the desktop ring layout vs. ~2000px+ once everything
    // stacks into one column below the 1080px breakpoint (see
    // globals.css) — so the same threshold means a very different amount
    // of actual on-screen pixels depending on layout, orientation, and
    // window/device size. That's fragile in a way that's hard to fully
    // cover: it broke on a short windowed browser, and separately on an
    // iPad in landscape (shorter viewport, same tall collapsed layout,
    // less scroll room to ever get a big enough slice of a 2000px section
    // on screen at once) — two different-looking symptoms, same root
    // cause. A tiny sentinel has a fixed, tiny height regardless of any
    // of that, so any nonzero threshold on it means "basically zero
    // pixels," making the trigger consistent across every window size,
    // orientation, and device without needing another per-case tweak.
    const node = sentinelRef.current;
    if (!node) return;

    // Trigger once and stay revealed — don't mirror isIntersecting back to
    // false. Anything below the fold shifting after the sentinel first
    // crosses into view (a font swap, an image finishing loading, any
    // reflow) can un-intersect a 1px sentinel for a moment; mirroring that
    // meant the section could revert to hidden and, if the final scroll
    // position never happens to re-cross the sentinel again, stay hidden
    // for good. Reveal is a one-way door here — once shown, it can't be
    // knocked back into the hidden state by something unrelated shifting
    // the page around it.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, {
      threshold: 0,
      rootMargin: "0px 0px -40px 0px",
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="features" id="features">
      <div className="container">
        <p className="section-label">Built for your neighborhood</p>
        <h2 className="section-heading">
          One app to find trusted help, offer your skills,
          <br />
          and get things done nearby
        </h2>

        <div className={`features-ring${inView ? " in-view" : ""}`} ref={ringRef}>
          {/* Trigger point for the IntersectionObserver above — see the
              comment there for why this observes a 1px sentinel instead of
              the (height-variable) ring itself. */}
          <div ref={sentinelRef} aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 1 }} />
          <div className="features-rings" aria-hidden="true">
            <span style={{ width: 640, height: 640 }} />
            <span style={{ width: 460, height: 460 }} />
          </div>

          <div className="features-col">
            <FeatureList
              items={LEFT_ITEMS}
              offsets={LEFT_OFFSETS}
              direction="left"
              delay={withDelay(LEFT_DELAYS[0])}
              isMobile={isMobile}
              cascadeDamping={cascadeDamping}
              duration={duration}
            />
          </div>

          <div className="features-phone-col">
            <div className="features-phone-top">
              <div className="feature-item">
                <span className="feature-icon">
                  <BellIcon />
                </span>
                <div>
                  <h3>Discover Nearby</h3>
                  <p>Find service and items available from trusted Helpers in your local area.</p>
                </div>
              </div>
            </div>

            <div className="phone-frame">
              {reducedMotion ? (
                <Image src="/images/screen-home.png" alt="Home screen in the Blyth app" width={260} height={540} />
              ) : (
                <div className="phone-tilted-card">
                  <TiltedCard
                    imageSrc="/images/screen-home.png"
                    altText="Home screen in the Blyth app"
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

            <div className="features-phone-bottom">
              <div className="feature-item">
                <span className="feature-icon">
                  <RibbonStarIcon />
                </span>
                <div>
                  <h3>Ratings &amp; Reviews</h3>
                  <p>See ratings and reviews from previous customers before choosing a Helper.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="features-col features-col-right">
            <FeatureList
              items={RIGHT_ITEMS}
              offsets={RIGHT_OFFSETS}
              direction="right"
              delay={withDelay(RIGHT_DELAYS[0])}
              isMobile={isMobile}
              cascadeDamping={cascadeDamping}
              duration={duration}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
