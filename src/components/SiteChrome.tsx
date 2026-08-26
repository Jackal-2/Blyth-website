"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TargetCursor from "./TargetCursor";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const reducedMotion = usePrefersReducedMotion();

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {!reducedMotion && (
        <TargetCursor
          targetSelector=".cursor-target"
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
          cursorColor="#ffffff"
          cursorColorOnTarget="#D98A3D"
        />
      )}
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
