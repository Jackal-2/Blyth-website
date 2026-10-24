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

// Homepage sections the menu links to.
const SECTION_IDS = ["features"] as const;
type SectionId = (typeof SECTION_IDS)[number];

function sectionOf(href: string): SectionId | null {
  const hash = href.startsWith("/#") ? href.slice(2) : null;
  return hash && (SECTION_IDS as readonly string[]).includes(hash) ? (hash as SectionId) : null;
}

function isActive(pathname: string, href: string, activeSection: SectionId | null) {
  const section = sectionOf(href);
  if (section) return pathname === "/" && activeSection === section;
  if (href === "/") return pathname === "/" && activeSection === null;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isShareCardPath(pathname: string): boolean {
  return pathname.startsWith("/listings/") || pathname.startsWith("/helpers/");
}

export default function Navbar() {
  const pathname = usePathname();
  // Which homepage section is in the middle of the screen (null = none, so
  // "Home" is highlighted).
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const minimal = isShareCardPath(pathname);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setActiveSection(null);
  }

  const handleNavClick = (href: string) => {
    if (pathname !== "/") return;
    if (href === "/") {
      setActiveSection(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const section = sectionOf(href);
    const el = section ? document.getElementById(section) : null;
    if (section && el) {
      setActiveSection(section);
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (pathname !== "/") return;
    const visible = new Set<SectionId>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        const current = SECTION_IDS.find((id) => visible.has(id)) ?? null;
        setActiveSection(current);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand cursor-target">
          <Image
            src="/images/logo-full-trim.png"
            alt="Blyth"
            width={690}
            height={240}
            priority
            draggable={false}
            className="brand-logo-full"
          />
        </Link>

        {!minimal && (
          <nav className="nav-links">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href, activeSection);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`cursor-target${active ? " active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {!minimal && (
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
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        )}

        {!minimal && menuOpen ? (
          <nav className="nav-mobile-menu">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href, activeSection);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`cursor-target${active ? " active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    setMenuOpen(false);
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/#get-app"
              className="btn btn-accent nav-mobile-cta cursor-target"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
