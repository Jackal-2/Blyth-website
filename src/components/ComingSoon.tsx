import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/community-guidelines", label: "Community Guidelines" },
  { href: "/dmca", label: "DMCA" },
  { href: "/delete-account", label: "Delete Account" },
];

export default function ComingSoon() {
  return (
    <div className="cs-page">
      <div className="cs-glow" aria-hidden="true" />
      <div className="cs-glow-teal" aria-hidden="true" />
      <div className="cs-dots" aria-hidden="true" />
      <div className="cs-pins" aria-hidden="true">
        <i className="cs-pin" />
        <i className="cs-pin" />
        <i className="cs-pin" />
        <i className="cs-pin" />
        <i className="cs-pin" />
      </div>

      <header className="cs-header">
        <Image src="/images/logo-full-trim.png" alt="Blyth" width={690} height={240} priority draggable={false} />
      </header>

      <main className="cs-main">
        <div className="cs-eyebrow">
          <span className="cs-live" />
          Launching soon
        </div>
        <h1 className="cs-title">
          <span className="cs-line">Coming</span>
          <span className="cs-line cs-soon">Soon.</span>
        </h1>
        <p className="cs-sub">
          It&rsquo;s not just a Marketplace, it&rsquo;s Your <span className="cs-accent">Neighborhood.</span>
          <br />
          Trusted, verified local Helpers and items nearby &mdash; <strong>almost here.</strong>
        </p>
        <div className="cs-stores">
          <div className="cs-store">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.19-1.72-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.63 1.11 8.8.73 1.06 1.6 2.25 2.75 2.2 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.67-2.14.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.32-.89-2.33-3.56zM14.17 6.13c.61-.74 1.02-1.76.91-2.78-.88.04-1.94.59-2.57 1.32-.56.65-1.06 1.7-.93 2.7.98.08 1.98-.5 2.59-1.24z" />
            </svg>
            <div>
              <small>Coming soon to</small>
              <span>App Store</span>
            </div>
          </div>
          <div className="cs-store">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 3.2v17.6c0 .8.9 1.3 1.6.9l15-8.8c.7-.4.7-1.4 0-1.8l-15-8.8C5.9 1.9 5 2.4 5 3.2z" />
            </svg>
            <div>
              <small>Coming soon to</small>
              <span>Google Play</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="cs-footer">
        <nav>
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div>&copy; {new Date().getFullYear()} Blyth. All rights reserved.</div>
      </footer>
    </div>
  );
}
