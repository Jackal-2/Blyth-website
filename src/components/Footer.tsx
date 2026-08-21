import Image from "next/image";
import Link from "next/link";

const SECONDARY_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Support", href: "/support" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <Image src="/images/logo-full-trim.png" alt="Blyth" width={666} height={240} className="brand-logo-full" />
            </Link>
            <div className="footer-links-secondary">
              {SECONDARY_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-download">
            <p className="footer-download-heading">Get the App</p>
            <a
              className="store-pill store-pill-dark"
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/images/app-store.png" alt="" width={50} height={50} className="store-pill-icon" aria-hidden="true" />
              <span className="store-pill-text">Download for iOS</span>
            </a>
            <a
              className="store-pill store-pill-dark"
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/images/playstore.png" alt="" width={50} height={50} className="store-pill-icon" aria-hidden="true" />
              <span className="store-pill-text">Download for Android</span>
            </a>
          </div>
        </div>

        <hr className="footer-rule" />

        <p className="footer-copyright">Copyright &copy;2026 Blyth. All rights reserved.</p>
      </div>
    </footer>
  );
}
