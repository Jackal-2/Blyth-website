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

  // Skipped for prefers-reduced-motion, same as the cursor effect it
  // replaces — it's a much lighter one-off burst than a continuous
  // animated cursor, but it's still decorative motion.
  if (reducedMotion) {
    return content;
  }

  return (
    <ClickSpark sparkColor="#D98A3D" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      {content}
    </ClickSpark>
  );
}
