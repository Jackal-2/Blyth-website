"use client";

import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const TESTIMONIALS = [
  {
    quote: "Blyth made it so easy to find help nearby. I had someone at my door within the hour.",
    name: "Kristin Watson",
    role: "Neighbor, Blyth",
    slot: 1,
  },
  {
    quote:
      "Blyth made it easy to offer my services and start getting requests the same week. Setup took minutes.",
    name: "Marcus Bell",
    role: "Helper, Blyth",
    slot: 2,
  },
  {
    quote: "The confirmation code gave me real peace of mind — I knew exactly when the job was done before anything was released.",
    name: "Priya Nandan",
    role: "Neighbor, Blyth",
    slot: 3,
  },
  {
    quote: "I found a reliable helper for weekend yard work within a day. Blyth made the whole process simple, safe, and stress-free.",
    name: "Jordan Ellis",
    role: "Neighbor, Blyth",
    slot: 4,
  },
  {
    quote: "As a small cleaning business, Blyth's verified badge helped new customers trust us right away.",
    name: "Diego Ferreira",
    role: "Helper, Blyth",
    slot: 5,
  },
  {
    quote: "Booking, messaging, and paying all happen in one place. I haven't needed anything else since I started using it.",
    name: "Alina Cho",
    role: "Neighbor, Blyth",
    slot: 6,
  },
];

export default function Testimonials() {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 600;
  const damping = reducedMotion ? 0 : 70 / duration;

  return (
    <section className="testimonials">
      <div className="container">
        <Fade direction="up" triggerOnce={false} fraction={0.2} duration={duration}>
          <div className="testimonials-head">
            <div className="testimonials-quote">&ldquo;</div>
            <h2 className="testimonials-heading">Real Stories from Real Neighbors</h2>
            <p className="testimonials-sub">Hear from people already using Blyth</p>
          </div>
        </Fade>

        <div className="testimonials-grid">
          <Fade cascade damping={damping} triggerOnce={false} fraction={0.2} duration={duration}>
            {TESTIMONIALS.map((t) => (
              <div
                className={`testimonial-card testimonial-card--${t.slot}`}
                key={t.name + t.quote.slice(0, 10)}
              >
                <div className="testimonial-quote-mark">&ldquo;</div>
                <p className="testimonial-text">{t.quote}</p>
                <p className="testimonial-name">{t.name}</p>
                <p className="testimonial-role">{t.role}</p>
              </div>
            ))}
          </Fade>
        </div>
      </div>
    </section>
  );
}
