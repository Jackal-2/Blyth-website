import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { OpenInAppButtons } from "../OpenInAppButtons";

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
