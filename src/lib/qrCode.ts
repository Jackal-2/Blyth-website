import QRCode from "qrcode";

// Renders a share page's own web URL as an inline SVG QR code — see
// docs/share-links-and-deep-linking.md, Part 7. Server-rendered (called
// from each share page's own async component, not a client component): the
// page's HTML already has to be identical for every visitor including
// link-preview crawlers (see OpenInAppButtons' own reasoning for the same
// rule), and there's nothing viewer-specific about a QR code — it always
// encodes the same URL, so there's no reason to ship it as client JS at all.
//
// Returns raw <svg>...</svg> markup, safe to inject directly (it's this
// library's own output, not user-supplied content) via
// dangerouslySetInnerHTML — see how each share page uses it.
export async function shareQrCodeSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    color: {
      // Matches this app's dark-ink-on-light-card share cards — a QR code's
      // own contrast requirement (dark modules on a light ground) is
      // stricter than "looks nice," so this isn't themed/dark-mode aware on
      // purpose; see the CSS class this renders into for the surrounding
      // card's actual background.
      dark: "#111111",
      light: "#ffffff",
    },
  });
}
