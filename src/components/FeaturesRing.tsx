"use client";

import Image from "next/image";
import { type CSSProperties, type ReactNode } from "react";
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
    body: "A confirmation code verifies the order before it's marked complete and the Helper is paid.",
  },
  {
    icon: <ReceiptIcon />,
    title: "Secure Payments & Earnings",
    body: "Pay for items and services through a structured order system, with clear tracking of earnings and withdrawals.",
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

const LEFT_OFFSETS = ["translate(-20px, 10px)", "translate(-40px, 35px)", "translate(-20px, 50px)"];
const RIGHT_OFFSETS = ["translate(20px, 10px)", "translate(40px, 35px)", "translate(20px, 50px)"];

type FeatureListProps = {
  items: { icon: ReactNode; title: string; body: string }[];
  offsets: string[];
};

function FeatureList({ items, offsets }: FeatureListProps) {
  return (
    <>
      {items.map((item, i) => (
        <div className="feature-item" key={item.title} style={{ "--ring-offset": offsets[i] } as CSSProperties}>
          <span className="feature-icon">{item.icon}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default function FeaturesRing() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="features" id="features">
      <div className="container">
        <p className="section-label">Built for your neighborhood</p>
        <h2 className="section-heading">
          One app to find trusted help, offer your skills,
          <br />
          and get things done nearby
        </h2>

        <div className="features-ring">
          <div className="features-rings" aria-hidden="true">
            <span style={{ width: 640, height: 640 }} />
            <span style={{ width: 460, height: 460 }} />
          </div>

          <div className="features-col">
            <FeatureList items={LEFT_ITEMS} offsets={LEFT_OFFSETS} />
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
            <FeatureList items={RIGHT_ITEMS} offsets={RIGHT_OFFSETS} />
          </div>
        </div>
      </div>
    </section>
  );
}
