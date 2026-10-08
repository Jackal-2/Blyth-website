import { shareQrCodeSvg } from "@/lib/qrCode";

type Props = {
  url: string;
};

export async function ShareQrCode({ url }: Props) {
  const svg = await shareQrCodeSvg(url);
  return (
    <div className="share-qr">
      <div className="share-qr-code" dangerouslySetInnerHTML={{ __html: svg }} />
      <p className="share-qr-caption">Scan to open on your phone</p>
    </div>
  );
}
