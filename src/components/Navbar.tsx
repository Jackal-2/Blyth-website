"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Support", href: "/support" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

// "/#features" is an in-page anchor on the home page rather than a distinct
// route. `scrolledToFeatures` (driven by an IntersectionObserver on the
// #features section, homepage only) tells us to highlight it instead of Home
// while that section is in view.
function isActive(pathname: string, href: string, scrolledToFeatures: boolean) {
  if (href === "/#features") return scrolledToFeatures;
  if (href === "/") return pathname === "/" && !scrolledToFeatures;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolledToFeatures, setScrolledToFeatures] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Reset menu/scrollspy state when the route changes. Adjusting state during
  // render (rather than in an effect) is the pattern React recommends for
  // "state that depends on a prop changing" — it avoids an extra render pass.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setScrolledToFeatures(false);
  }

  useEffect(() => {
    if (pathname !== "/") return;

    const section = document.getElementById("features");
    if (!section) return;

    // A thin horizontal band through the middle of the viewport — the active
    // link flips to Features once the section crosses it, and back to Home
    // once it scrolls past.
    const observer = new IntersectionObserver(([entry]) => setScrolledToFeatures(entry.isIntersecting), {
      rootMargin: "-45% 0px -45% 0px",
    });

    observer.observe(section);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand cursor-target">
          <Image src="/images/logo-full-trim.png" alt="Blyth" width={666} height={240} priority className="brand-logo-full" />
        </Link>

        <nav className="nav-links">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href, scrolledToFeatures);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`cursor-target${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="navbar-actions">
          <Link href="/#get-app" className="btn btn-accent cursor-target">
            Get Started
          </Link>
          <button
            className="nav-menu-btn cursor-target"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen ? (
          <nav className="nav-mobile-menu">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href, scrolledToFeatures);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`cursor-target${active ? " active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/#get-app" className="btn btn-accent nav-mobile-cta cursor-target" onClick={() => setMenuOpen(false)}>
              Get Started
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
