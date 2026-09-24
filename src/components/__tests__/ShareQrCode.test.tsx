import { describe, expect, it } from "vitest";
import { ShareQrCode } from "../ShareQrCode";

// ShareQrCode is an async Server Component (no "use client") — Next.js
// calls it directly as a plain async function and awaits the JSX it
// returns; react-dom/server's renderToStaticMarkup doesn't support async
// function components, so this exercises it the same way Next.js actually
// does: call it directly and inspect the returned element tree, rather than
// routing it through a renderer that doesn't support this component shape.
describe("ShareQrCode", () => {
  it("renders the QR SVG and caption for the given URL", async () => {
    const element = await ShareQrCode({ url: "https://blythapp.com/listings/abcdefghij0123456789" });

    expect(element.props.className).toBe("share-qr");
    const [qrWrapper, caption] = element.props.children as [
      { props: { className: string; dangerouslySetInnerHTML: { __html: string } } },
      { props: { children: string } },
    ];

    expect(qrWrapper.props.className).toBe("share-qr-code");
    expect(qrWrapper.props.dangerouslySetInnerHTML.__html.trim().startsWith("<svg")).toBe(true);
    expect(caption.props.children).toBe("Scan to open on your phone");
  });

  it("encodes different URLs to different SVG output", async () => {
    const a = await ShareQrCode({ url: "https://blythapp.com/listings/aaaaaaaaaaaaaaaaaaaa" });
    const b = await ShareQrCode({ url: "https://blythapp.com/listings/bbbbbbbbbbbbbbbbbbbb" });
    const svgA = (a.props.children[0] as { props: { dangerouslySetInnerHTML: { __html: string } } }).props
      .dangerouslySetInnerHTML.__html;
    const svgB = (b.props.children[0] as { props: { dangerouslySetInnerHTML: { __html: string } } }).props
      .dangerouslySetInnerHTML.__html;
    expect(svgA).not.toBe(svgB);
  });
});
