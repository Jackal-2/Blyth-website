"use client";

import { type PointerEvent } from "react";
import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ICONS: Record<string, string> = {
  hair: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
  cleaning: '<path d="M9 3h6l-1 6h-4zM7 9h10l1 12H6z"/>',
  handyman: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  moving: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  tutoring: '<path d="M2 8l10-5 10 5-10 5z"/><path d="M6 10v5c3 2 9 2 12 0v-5"/>',
  pets: '<circle cx="5" cy="10" r="2"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="19" cy="10" r="2"/><path d="M8 17c0-3 2-5 4-5s4 2 4 5c0 2-2 3-4 3s-4-1-4-3z"/>',
  home: '<path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M2 12h20v5H2zM5 17v3M19 17v3"/>',
  electronics: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
};

const CATEGORIES = [
  { icon: "hair", title: "Hair & beauty", body: "Cuts, braids, nails, at their place or yours." },
  { icon: "cleaning", title: "Cleaning", body: "Deep cleans, move-outs, regular visits." },
  { icon: "handyman", title: "Handyman", body: "Mounting, assembly, small repairs." },
  { icon: "moving", title: "Moving help", body: "Lifting, loading, hauling." },
  { icon: "tutoring", title: "Tutoring", body: "Homework help, music, languages." },
  { icon: "pets", title: "Pet care", body: "Walks, sitting, grooming." },
  { icon: "home", title: "Home & furniture", body: "Pre-loved pieces from Helpers nearby." },
  { icon: "electronics", title: "Electronics", body: "Phones, consoles, accessories." },
];

function trackPointer(e: PointerEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
  el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
}

export default function HelperCategories() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 600;
  const damping = reducedMotion ? 0 : 0.08;

  return (
    <section className="helper-cats">
      <div className="container">
        <Fade direction="up" triggerOnce fraction={0.2} duration={duration}>
          <p className="section-label">On Blyth</p>
          <h2 className="section-heading">Connect With Trusted Helpers Near You</h2>
          <p className="section-heading-sub">
            From home repairs to errands, find the right person for the job — right in your neighborhood.
          </p>
        </Fade>

        <div className="helper-cats-grid">
          <Fade cascade damping={damping} direction="up" triggerOnce fraction={0.1} duration={duration}>
            {CATEGORIES.map((c) => (
              <div key={c.title} className="helper-cat" onPointerMove={trackPointer}>
                <span className="helper-cat-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: ICONS[c.icon] }}
                  />
                </span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </Fade>
        </div>
      </div>
    </section>
  );
}
