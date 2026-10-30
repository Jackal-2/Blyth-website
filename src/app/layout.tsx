import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import SiteChrome from "@/components/SiteChrome";
import { isComingSoon } from "@/lib/siteStatus";
import "./globals.css";

const SITE_URL = "https://blythapp.com";
const SITE_NAME = "Blyth";
const SITE_TITLE = "Blyth Marketplace — Trusted Local Help Near You";
const SITE_DESCRIPTION =
  "Blyth is a local services marketplace connecting neighbors across the US with trusted, verified help near you. Find local help, book services, hire vetted providers, and get things done — all from one app.";

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
    "marketplace near me",
    "find local help near me",
    "hire local providers",
    "neighborhood services app",
    "US services marketplace",
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
};

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
      sameAs: [
        "https://www.instagram.com/blythapp/",
        "https://x.com/blythapp_",
        "https://www.linkedin.com/company/blythllc/",
      ],
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
  const comingSoon = await isComingSoon();

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
        <SiteChrome comingSoon={comingSoon}>{children}</SiteChrome>
      </body>
    </html>
  );
}
