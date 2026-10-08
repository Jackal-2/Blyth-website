import QRCode from "qrcode";

export async function shareQrCodeSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    color: {
      dark: "#111111",
      light: "#ffffff",
    },
  });
}
