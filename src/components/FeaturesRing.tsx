"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
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
const RIGHT_OFFSETS = ["translate(110px, -40px)", "translate(190px, 10px)", "translate(90px, 80px)"];

const STEP_MS = 200;
const LEFT_DELAYS = [0, STEP_MS, STEP_MS * 2];
const RIGHT_DELAYS = [STEP_MS * 3, STEP_MS * 4, STEP_MS * 5];

export default function FeaturesRing() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 500;
  const cascadeDamping = reducedMotion ? 0 : STEP_MS / duration;
  const withDelay = (ms: number) => (reducedMotion ? 0 : ms);

  const ringRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ringRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
      rootMargin: "0px 0px -60px 0px",
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
          <div className="features-rings" aria-hidden="true">
            <span style={{ width: 640, height: 640 }} />
            <span style={{ width: 460, height: 460 }} />
          </div>

          <div className="features-col">
            <Fade
              cascade
              damping={cascadeDamping}
              direction="left"
              triggerOnce={false}
              fraction={0.2}
              duration={duration}
              delay={withDelay(LEFT_DELAYS[0])}
            >
              {LEFT_ITEMS.map((item, i) => (
                <div className="feature-item" key={item.title} style={{ transform: LEFT_OFFSETS[i] }}>
                  <span className="feature-icon">{item.icon}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </div>
              ))}
            </Fade>
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
              <Image src="/images/screen-home.png" alt="Home screen in the Blyth app" width={260} height={540} />
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
            <Fade
              cascade
              damping={cascadeDamping}
              direction="right"
              triggerOnce={false}
              fraction={0.2}
              duration={duration}
              delay={withDelay(RIGHT_DELAYS[0])}
            >
              {RIGHT_ITEMS.map((item, i) => (
                <div className="feature-item" key={item.title} style={{ transform: RIGHT_OFFSETS[i] }}>
                  <span className="feature-icon">{item.icon}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </div>
              ))}
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}
