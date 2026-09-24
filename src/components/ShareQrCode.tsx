import { shareQrCodeSvg } from "@/lib/qrCode";

type Props = {
  url: string;
};

// Server component — the QR code is the same for every visitor (it only
// ever encodes this page's own share URL, from lib/appLinks.ts's
// webUrlFor), so there's no reason to generate it in the browser at all.
// See lib/qrCode.ts and docs/share-links-and-deep-linking.md, Part 7.
export async function ShareQrCode({ url }: Props) {
  const svg = await shareQrCodeSvg(url);
  return (
    <div className="share-qr">
      {/* This is qrCode.ts's own SVG output (the `qrcode` package), not
          user-supplied content — safe to inject directly. */}
      <div className="share-qr-code" dangerouslySetInnerHTML={{ __html: svg }} />
      <p className="share-qr-caption">Scan to open on your phone</p>
    </div>
  );
}
