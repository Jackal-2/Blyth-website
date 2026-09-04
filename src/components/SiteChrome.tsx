"use client";

import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ClickSpark from "./ClickSpark";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  const content = (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );

  // Decorative motion — skipped for prefers-reduced-motion.
  if (reducedMotion) {
    return content;
  }

  return (
    <ClickSpark sparkColor="#D98A3D" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      {content}
    </ClickSpark>
  );
}
