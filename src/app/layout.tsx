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
  // Set by src/middleware.ts on every request (production only) so this
  // inline script can carry the same nonce the CSP header allows — see the
  // comment in middleware.ts for why an un-nonced inline script gets
  // silently blocked in production. In dev, middleware skips CSP entirely,
  // so this is undefined and the nonce attribute is simply omitted below.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en">
      <head>
        {/* Prevent the browser from jumping to a leftover URL hash (e.g. #get-app
            from a previous "Get Started" click) or restoring a prior scroll
            position on reload — pages should always load at the top. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              if (window.location.hash) {
                history.replaceState(null, '', window.location.pathname + window.location.search);
              }
              window.scrollTo(0, 0);
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
