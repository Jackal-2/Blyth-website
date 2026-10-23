import Image from "next/image";
import Link from "next/link";
import { getTodaysVerse } from "@/lib/dailyVerses";

const SECONDARY_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Support", href: "/support" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Copyright Policy", href: "/dmca" },
  { label: "Delete Account", href: "/delete-account" },
];

export default function Footer() {
  const verse = getTodaysVerse();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand cursor-target">
              <Image
                src="/images/logo-full-trim.png"
                alt="Blyth"
                width={690}
                height={240}
                draggable={false}
                className="brand-logo-full"
              />
            </Link>
            <div className="footer-links-secondary">
              {SECONDARY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="cursor-target"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div
              className="footer-social"
              style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "14px" }}
            >
              <a
                href="https://x.com/blythapp_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Blyth on X"
                className="cursor-target footer-social-link"
                style={{ display: "inline-flex", color: "inherit", opacity: 0.85 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/blythapp/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Blyth on Instagram"
                className="cursor-target footer-social-link"
                style={{ display: "inline-flex", color: "inherit", opacity: 0.85 }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/blythllc/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Blyth on LinkedIn"
                className="cursor-target footer-social-link"
                style={{ display: "inline-flex", color: "inherit", opacity: 0.85 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM3.558 20.452h3.56V9h-3.56v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-download">
            <p className="footer-download-heading">Get the App</p>
            <a
              className="btn btn-dark cursor-target"
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/app-store.png"
                alt=""
                width={20}
                height={20}
                className="store-pill-icon"
                aria-hidden="true"
              />
              <span className="store-pill-text">Download for iOS</span>
            </a>
            <a
              className="btn btn-dark cursor-target"
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/playstore.png"
                alt=""
                width={20}
                height={20}
                className="store-pill-icon"
                aria-hidden="true"
              />
              <span className="store-pill-text">Download for Android</span>
            </a>
          </div>
        </div>

        <hr className="footer-rule" />

        <div className="footer-bottom">
          <p className="footer-verse-ref">{verse.reference}</p>
          <p className="footer-copyright">
            Copyright &copy;2026 Blyth. All rights reserved.
          </p>
          <span className="footer-signature">Caxapok</span>
        </div>
      </div>
    </footer>
  );
}
