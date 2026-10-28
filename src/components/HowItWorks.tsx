"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Audience = "neighbors" | "helpers";

const STEPS: Record<Audience, { title: string; body: string }[]> = {
  neighbors: [
    { title: "Find it nearby", body: "Browse items and services from Helpers around you, and message them with any questions." },
    { title: "Send a request", body: "Choose a time, or add items to your cart, and send it to the Helper to accept." },
    { title: "Meet up", body: "Pick up your item or welcome your Helper, then confirm it’s done in the app." },
  ],
  helpers: [
    { title: "Set up once", body: "Create your Helper account and add where you’d like your earnings paid." },
    { title: "List what you offer", body: "Set your price, your hours and how long each booking takes." },
    { title: "Accept and earn", body: "Accept the requests you want, do the job, and cash out from your balance." },
  ],
};

const TABS: { key: Audience; label: string }[] = [
  { key: "neighbors", label: "For Neighbors" },
  { key: "helpers", label: "For Helpers" },
];

export default function HowItWorks() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 600;
  const [audience, setAudience] = useState<Audience>("neighbors");
  const tabRefs = useRef<Record<Audience, HTMLButtonElement | null>>({ neighbors: null, helpers: null });
  const [pill, setPill] = useState({ left: 0, width: 0 });
  const stepsRef = useRef<HTMLDivElement>(null);
  const [stepsSeen, setStepsSeen] = useState(false);

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStepsSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    const place = () => {
      const el = tabRefs.current[audience];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [audience]);

  return (
    <section className="how" id="how">
      <div className="container">
        <Fade direction="up" triggerOnce fraction={0.2} duration={duration}>
          <p className="section-label">How it works</p>
          <h2 className="section-heading">From request to done in three steps</h2>
        </Fade>

        <div className="how-tabs" role="tablist" aria-label="Who it’s for">
          <span className="how-pill" style={{ left: pill.left, width: pill.width }} aria-hidden="true" />
          {TABS.map((tab) => (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              type="button"
              role="tab"
              id={`how-tab-${tab.key}`}
              aria-selected={audience === tab.key}
              aria-controls="how-steps"
              className="how-tab cursor-target"
              onClick={() => setAudience(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          ref={stepsRef}
          className="how-steps"
          id="how-steps"
          role="tabpanel"
          aria-labelledby={`how-tab-${audience}`}
        >
          <div className="how-track" aria-hidden="true">
            {stepsSeen ? <i key={audience} /> : null}
          </div>
          <Fade key={audience} direction="up" cascade damping={0.18} triggerOnce fraction={0.2} duration={duration}>
            {STEPS[audience].map((step, i) => (
              <div className="how-step" key={step.title}>
                <span className="how-step-number">{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </Fade>
        </div>
      </div>
    </section>
  );
}
