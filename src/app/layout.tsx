import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blyth — Find trusted help in your neighborhood",
  description:
    "Blyth connects neighbors with trusted, verified local help — book services, hire providers, and get things done, all from one app.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Nonce set by src/middleware.ts (production only) for CSP.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en">
      <head>
        {/* Reset scroll on fresh loads, but don't fight a real #hash deep link. */}
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
