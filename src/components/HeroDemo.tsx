"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// A small live picture of the app, alternating between booking a service and
// buying an item: an option gets picked, the listing wiggles, the payment hold
// lights up and the completion code fills in.
type DemoListing = {
  image: string;
  title: string;
  by: string;
  price: string;
  unit: string;
  options: string[];
};

const LISTINGS: DemoListing[] = [
  {
    image: "/images/hero-barber-art.jpg",
    title: "Haircut & beard trim",
    by: "Owen’s Barber Shop",
    price: "$40.00",
    unit: "/appt · 1 hr",
    options: ["Sat 9:00", "Sat 11:30", "Sat 2:00"],
  },
  {
    image: "/images/hero-headphones.jpg",
    title: "Wireless headphones",
    by: "Hudson Tech Shop",
    price: "$109.47",
    unit: "· 5 in stock",
    options: ["Qty 1", "Qty 2", "Qty 3"],
  },
];
const CODE = ["4", "8", "2", "7"];
const LOOP_MS = 4200;

export default function HeroDemo() {
  const reducedMotion = usePrefersReducedMotion();
  const [round, setRound] = useState(0);
  const [typed, setTyped] = useState(0);
  const listingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const loop = setInterval(() => setRound((r) => r + 1), LOOP_MS);
    return () => clearInterval(loop);
  }, [reducedMotion]);

  // Each round: clear the code, then fill it in one digit at a time.
  useEffect(() => {
    if (reducedMotion) return;
    const timers = [
      setTimeout(() => setTyped(0), 0),
      ...CODE.map((_, i) => setTimeout(() => setTyped(i + 1), 900 + i * 260)),
    ];
    return () => timers.forEach(clearTimeout);
  }, [round, reducedMotion]);

  const digitsShown = reducedMotion ? CODE.length : typed;
  const listing = LISTINGS[round % LISTINGS.length];
  // A booking cycles through times; an item stays at Qty 1 so the held amount matches.
  const isItem = listing.options[0].startsWith("Qty");
  const activeOption = isItem ? 0 : reducedMotion ? 1 : Math.floor(round / LISTINGS.length) % listing.options.length;

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !listingRef.current) return;
    const r = listingRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    listingRef.current.style.transform = `rotate(-3deg) rotateX(${(-y * 12).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg) scale(1.04)`;
  };
  const handleLeave = () => {
    if (listingRef.current) listingRef.current.style.transform = "rotate(-3deg)";
  };

  return (
    <div className="hero-demo" aria-label="Example of booking a service or buying an item in the Blyth app">
      <div key={`held-${round}`} className={`hero-demo-card hero-demo-held${reducedMotion ? "" : " is-flash"}`}>
        <span className="hero-demo-held-label">Payment held</span>
        <span className="hero-demo-held-value">{listing.price}</span>
      </div>

      <div
        ref={listingRef}
        className="hero-demo-card hero-demo-listing"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        <div key={`shake-${round}`} className={reducedMotion ? undefined : "hero-demo-shake"}>
          <div className="hero-demo-photo">
            {LISTINGS.map((l) => (
              <Image
                key={l.image}
                src={l.image}
                alt=""
                width={524}
                height={312}
                draggable={false}
                className={l === listing ? "is-shown" : undefined}
              />
            ))}
          </div>
          <div className="hero-demo-body">
            <span className="hero-demo-title">{listing.title}</span>
            <span className="hero-demo-by">{listing.by}</span>
            <span className="hero-demo-price">
              {listing.price} <small>{listing.unit}</small>
            </span>
            <div className="hero-demo-times">
              {listing.options.map((t, i) => (
                <span key={t} className={`hero-demo-time${i === activeOption ? " is-on" : ""}`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hero-demo-card hero-demo-code">
        <p>Completion code</p>
        <div className="hero-demo-digits">
          {CODE.map((d, i) => (
            <span key={`${round}-${i}`} className={i < digitsShown && !reducedMotion ? "is-pop" : undefined}>
              {i < digitsShown ? d : "·"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
