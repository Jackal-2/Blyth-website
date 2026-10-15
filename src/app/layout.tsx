import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

const SITE_URL = "https://blythapp.com";
const SITE_NAME = "Blyth";
const SITE_TITLE = "Blyth Marketplace — Trusted Local Help Near You";
const SITE_DESCRIPTION =
  "Blyth is the local services marketplace connecting neighbors across the US with trusted, verified help. Book services, hire vetted providers, and get things done — all from one app.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Blyth Marketplace",
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Blyth",
    "Blyth app",
    "Blyth marketplace",
    "local services marketplace",
    "find local help",
    "hire local providers",
    "neighborhood services app",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // Once you create a Google Search Console property for blythapp.com, paste
  // the verification code it gives you here (just the content value, not the
  // whole <meta> tag) — e.g. verification: { google: "abc123..." }.
};

// Organization + WebSite + SoftwareApplication structured data (JSON-LD).
// This is what lets Google show a knowledge-panel-style entity for "Blyth"
// searches and understand the app itself, separate from the page titles.
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: "Blyth Marketplace",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo-full.png`,
      description: SITE_DESCRIPTION,
      areaServed: "US",
      // Official social profiles, so Google can tie them to this same brand
      // entity. Add more handles here as you lock them in on other platforms
      // (TikTok, X, Facebook, etc.) — same array, one URL per profile.
      sameAs: ["https://www.instagram.com/blythapp/"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      operatingSystem: "iOS, Android",
      applicationCategory: "LifestyleApplication",
      description: SITE_DESCRIPTION,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en">
      <head>
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              if (!window.location.hash) {
                window.scrollTo(0, 0);
              }
            `,
          }}
        />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
