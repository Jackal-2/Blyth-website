import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { OpenInAppButtons } from "../OpenInAppButtons";

// This component decides which platform's links to show client-side, after
// hydration, via a useEffect — that's the whole point (see the "never
// redirect on the user agent on the server" rule in
// docs/share-links-and-deep-linking.md). renderToStaticMarkup only ever
// renders the pre-hydration, "platform: unknown" branch, since effects
// never run during static rendering; that's also the only branch that's
// actually meaningful to assert on here without a browser-like test
// environment (this project's vitest config runs in 'node', not jsdom).
describe("OpenInAppButtons (server-rendered / pre-hydration output)", () => {
  it("shows 'coming soon' rather than broken links when neither store URL is set yet", () => {
    const html = renderToStaticMarkup(
      <OpenInAppButtons iosApp="blyth://listing/abc" androidApp="intent://listing/abc#Intent;end" iosStore="" androidStore="" />,
    );
    expect(html).toContain("coming soon");
    expect(html).not.toContain("href=");
  });

  it("offers both store links when both are set, never an app-scheme link (that needs the client to know the platform)", () => {
    const html = renderToStaticMarkup(
      <OpenInAppButtons
        iosApp="blyth://listing/abc"
        androidApp="intent://listing/abc#Intent;end"
        iosStore="https://apps.apple.com/app/id123"
        androidStore="https://play.google.com/store/apps/details?id=com.caxapok.blyth"
      />,
    );
    expect(html).toContain('href="https://apps.apple.com/app/id123"');
    expect(html).toContain('href="https://play.google.com/store/apps/details?id=com.caxapok.blyth"');
    expect(html).not.toContain("blyth://");
    expect(html).not.toContain("intent://");
  });

  it("offers only the store that's actually set", () => {
    const html = renderToStaticMarkup(
      <OpenInAppButtons
        iosApp="blyth://listing/abc"
        androidApp="intent://listing/abc#Intent;end"
        iosStore="https://apps.apple.com/app/id123"
        androidStore=""
      />,
    );
    expect(html).toContain("App Store");
    expect(html).not.toContain("Google Play");
  });
});
