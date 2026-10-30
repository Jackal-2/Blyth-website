"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ClickSpark from "./ClickSpark";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function SiteChrome({ children, comingSoon }: { children: ReactNode; comingSoon: boolean }) {
  const reducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();

  if (comingSoon && pathname === "/") {
    return <>{children}</>;
  }

  const content = (
    <>
      <Navbar launched={!comingSoon} />
      {children}
      <Footer launched={!comingSoon} />
    </>
  );

  if (reducedMotion) {
    return content;
  }

  return (
    <ClickSpark sparkColor="#D98A3D" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      {content}
    </ClickSpark>
  );
}
