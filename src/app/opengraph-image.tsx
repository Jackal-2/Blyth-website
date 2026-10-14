import { ImageResponse } from "next/og";
import { OG_COLORS, OG_SIZE, loadOgFonts, OgBadge } from "@/lib/og-shared";

export const alt = "Blyth — the local services marketplace";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image() {
  const fonts = loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(200deg, #2c2620 0%, #1c1712 55%, #0e0e0e 100%)",
          fontFamily: '"Plus Jakarta Sans"',
        }}
      >
        <OgBadge />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 800, color: OG_COLORS.text, display: "flex" }}>Blyth</div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: OG_COLORS.textMuted,
              marginTop: 16,
              display: "flex",
              maxWidth: 860,
              lineHeight: 1.3,
            }}
          >
            The local services marketplace — find trusted, verified help near you.
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
