import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProxiedPhoto } from "../ProxiedPhoto";

describe("ProxiedPhoto", () => {
  it("renders an <img> whose src is the proxied URL, never the raw one", () => {
    const html = renderToStaticMarkup(<ProxiedPhoto url="https://cdn.example.com/photo.jpg" />);
    expect(html).toContain(`src="/api/photo?u=${encodeURIComponent("https://cdn.example.com/photo.jpg")}"`);
    // The encoded proxy URL still spells out the original host in its query
    // string (only the URL-structural characters get percent-encoded, not
    // the letters) — what actually matters is that nothing points a
    // browser AT that host directly, i.e. no bare src/href to it.
    expect(html).not.toContain('="https://cdn.example.com');
  });

  it("defaults alt to an empty string when not given", () => {
    const html = renderToStaticMarkup(<ProxiedPhoto url="https://cdn.example.com/photo.jpg" />);
    expect(html).toContain('alt=""');
  });

  it("passes through className and other <img> attributes", () => {
    const html = renderToStaticMarkup(
      <ProxiedPhoto url="https://cdn.example.com/avatar.jpg" className="feed-post-avatar" alt="A helper's avatar" />,
    );
    expect(html).toContain('class="feed-post-avatar"');
    expect(html).toContain('alt="A helper&#x27;s avatar"');
  });

  it("leaves a data: URI as-is in the rendered src", () => {
    const dataUri = "data:image/png;base64,abc";
    const html = renderToStaticMarkup(<ProxiedPhoto url={dataUri} />);
    expect(html).toContain(`src="${dataUri}"`);
  });
});
