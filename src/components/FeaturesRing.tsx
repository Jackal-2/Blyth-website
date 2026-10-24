"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import TiltedCard from "./TiltedCard";
import {
  BellIcon,
  BriefcaseIcon,
  ChatHandsIcon,
  RibbonStarIcon,
  IdBadgeIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from "./icons";

type Feature = { icon: ReactNode; title: string; body: string };

// Four on each side of the phone, top to bottom.
const LEFT: Feature[] = [
  { icon: <IdBadgeIcon />, title: "Helper Dashboard", body: "Manage listings, requests, orders, balances and withdrawals." },
  { icon: <CheckCircleIcon />, title: "Several Services, One Visit", body: "Add more of a Helper’s services to the same booking, done back to back." },
  { icon: <ReceiptIcon />, title: "Earnings & Withdrawals", body: "Helpers see what they’ve earned and cash out to their bank." },
  { icon: <RibbonStarIcon />, title: "Ratings & Reviews", body: "See what other Neighbors said before choosing a Helper." },
];
const RIGHT: Feature[] = [
  { icon: <BellIcon />, title: "Discover Nearby", body: "Find services and items from trusted Helpers in your area." },
  { icon: <BriefcaseIcon />, title: "Buy & Book Locally", body: "Browse items or book services from Helpers nearby." },
  { icon: <ChatHandsIcon />, title: "Connect Directly", body: "Message Helpers to sort out details and arrange the handoff." },
  { icon: <ShieldCheckIcon />, title: "Business Badges", body: "Registered businesses get a badge, so you know who you’re booking." },
];

// Points on the ring (degrees, 0 = right, clockwise), evenly spaced, so each
// icon sits on it at the same distance from the phone.
const LEFT_ANGLES = [228, 196, 164, 132];
const RIGHT_ANGLES = [-48, -16, 16, 48];
const ICON_HALF = 22;
// Width of a feature's text block plus its icon, so the ring is never so wide
// that a feature runs off the side of the screen.
const ITEM_REACH = 252;

type Pos = { top: number; left?: number; right?: number };
type Layout = { width: number; height: number; rx: number; ry: number; positions: Pos[] };

export default function FeaturesRing() {
  const reducedMotion = usePrefersReducedMotion();
  const arcRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [inView, setInView] = useState(false);

  useLayoutEffect(() => {
    const arc = arcRef.current;
    if (!arc) return;
    const place = () => {
      if (window.innerWidth <= 980) {
        setLayout(null);
        return;
      }
      const { width, height } = arc.getBoundingClientRect();
      const ry = height * 0.42;
      const rx = Math.max(180, Math.min(width * 0.36, (width / 2 - ITEM_REACH - 8) / 0.96));
      const at = (deg: number) => {
        const a = (deg * Math.PI) / 180;
        return { x: width / 2 + Math.cos(a) * rx, y: height / 2 + Math.sin(a) * ry };
      };
      setLayout({
        width,
        height,
        rx,
        ry,
        positions: [
          ...LEFT_ANGLES.map((deg) => {
            const p = at(deg);
            return { top: p.y - ICON_HALF, right: width - p.x - ICON_HALF };
          }),
          ...RIGHT_ANGLES.map((deg) => {
            const p = at(deg);
            return { top: p.y - ICON_HALF, left: p.x - ICON_HALF };
          }),
        ],
      });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(arc);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const arc = arcRef.current;
    if (!arc) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(arc);
    return () => io.disconnect();
  }, []);

  const items = [...LEFT, ...RIGHT];

  return (
    <section className="features" id="features">
      <div className="container">
        <p className="section-label">Built for your neighborhood</p>
        <h2 className="section-heading">
          One app to find trusted help, offer your skills,
          <br />
          and get things done nearby
        </h2>

        <div
          ref={arcRef}
          className={`features-arc${inView || reducedMotion ? " is-in" : ""}${layout ? " is-placed" : ""}`}
        >
          {layout ? (
            <svg
              className="features-arc-ring"
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              aria-hidden="true"
            >
              <ellipse
                cx={layout.width / 2}
                cy={layout.height / 2}
                rx={layout.rx}
                ry={layout.ry}
                fill="none"
                stroke="rgba(255,255,255,0.09)"
                strokeWidth="1.5"
              />
              <ellipse
                className="features-arc-flow"
                cx={layout.width / 2}
                cy={layout.height / 2}
                rx={layout.rx}
                ry={layout.ry}
                fill="none"
                stroke="rgba(217,138,61,0.6)"
                strokeWidth="1.5"
                pathLength={1000}
                strokeDasharray="50 950"
              />
              <ellipse
                cx={layout.width / 2}
                cy={layout.height / 2}
                rx={layout.rx * 0.66}
                ry={layout.ry * 0.66}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            </svg>
          ) : null}

          <div className="phone-frame features-arc-phone">
            {reducedMotion ? (
              <Image src="/images/screen-home-v2.jpg" alt="Home screen in the Blyth app" width={260} height={540} />
            ) : (
              <div className="phone-tilted-card">
                <TiltedCard
                  imageSrc="/images/screen-home-v2.jpg"
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

          {items.map((item, i) => {
            const pos = layout?.positions[i];
            const style: CSSProperties = {
              ...(pos ? { top: pos.top, left: pos.left, right: pos.right } : {}),
              ["--d" as string]: `${((i % 4) * 0.12 + (i < 4 ? 0 : 0.06)).toFixed(2)}s`,
            };
            return (
              <div key={item.title} className={`arc-feature${i < 4 ? " arc-feature-left" : ""}`} style={style}>
                <span className="feature-icon">{item.icon}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
