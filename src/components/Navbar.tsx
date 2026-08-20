import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Support", href: "/support" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand">
          <Image src="/images/logo-full-trim.png" alt="Blyth" width={666} height={240} priority className="brand-logo-full" />
        </Link>

        <nav className="nav-links">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions">
          <Link href="/#get-app" className="btn btn-accent">
            Get Started
          </Link>
          <button className="nav-menu-btn" aria-label="Open menu" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
