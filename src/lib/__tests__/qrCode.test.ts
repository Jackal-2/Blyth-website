import { describe, expect, it } from "vitest";
import { shareQrCodeSvg } from "../qrCode";

describe("shareQrCodeSvg", () => {
  it("returns SVG markup", async () => {
    const svg = await shareQrCodeSvg("https://blythapp.com/listings/abcdefghij0123456789");
    expect(svg.trim().startsWith("<svg")).toBe(true);
    expect(svg).toContain("</svg>");
  });

  it("encodes different URLs to different output", async () => {
    const a = await shareQrCodeSvg("https://blythapp.com/listings/aaaaaaaaaaaaaaaaaaaa");
    const b = await shareQrCodeSvg("https://blythapp.com/listings/bbbbbbbbbbbbbbbbbbbb");
    expect(a).not.toBe(b);
  });

  it("uses the requested dark/light module colors", async () => {
    const svg = await shareQrCodeSvg("https://blythapp.com/listings/abcdefghij0123456789");
    expect(svg).toContain("#111111");
  });
});
