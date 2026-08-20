"use client";

import { Children, type ReactNode } from "react";
import { Fade } from "react-awesome-reveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function PolicyLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const duration = reducedMotion ? 1 : 600;
  const damping = reducedMotion ? 0 : 90 / duration;

  return (
    <main className="policy-page">
      <div className="container">
        <Fade direction="up" triggerOnce={false} fraction={0.2} duration={duration}>
          <div className="policy-header">
            <h1 className="policy-title">{title}</h1>
            <p className="policy-updated">Last update: {updated}</p>
          </div>
        </Fade>

        <div className="policy-content">
          <Fade cascade damping={damping} direction="up" triggerOnce={false} fraction={0.15} duration={duration}>
            {Children.map(children, (child) => (
              <div>{child}</div>
            ))}
          </Fade>
        </div>
      </div>
    </main>
  );
}
