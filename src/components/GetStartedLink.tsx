"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { STORE_URLS } from "@/lib/appLinks";

export function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  if (window.location.hash !== `#${id}`) window.history.replaceState(null, "", `/#${id}`);
  return true;
}

function storeForThisPhone(): string {
  const ua = navigator.userAgent;
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/Android/i.test(ua)) return STORE_URLS.android;
  if (/iPhone|iPad|iPod/i.test(ua) || iPadOS) return STORE_URLS.ios;
  return "";
}

export function GetStartedLink({
  className,
  children,
  onNavigate,
}: {
  className: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    const store = storeForThisPhone();
    if (store) {
      e.preventDefault();
      window.open(store, "_blank", "noopener,noreferrer");
      return;
    }
    if (pathname === "/" && scrollToSection("get-app")) e.preventDefault();
  }

  return (
    <Link href="/#get-app" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
