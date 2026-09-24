import { readFileSync } from "node:fs";
import path from "node:path";

export { fetchImageAsDataUri } from "./urlSafety";

// Shared pieces for the site's opengraph-image.tsx routes (listing + helper
// profile share cards).

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
// Photos are dynamic per listing/helper, but don't need re-rendering on every
// single request — each render does a DB read, two font fetches, and a PNG
// encode. Revalidate hourly; a profile/listing edit just waits up to this
// long to show a new share-card photo, which is fine for a link-preview
// image.
export const OG_REVALIDATE_SECONDS = 3600;

export const OG_COLORS = {
  bg: "#0e0e0e",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.78)",
  accent: "#d98a3d",
  accentLight: "#f2ac6b",
};

// Self-hosted so a render never depends on Google Fonts being reachable —
// previously this did two live fetches (a CSS request, then the font file
// itself) on every single render. These .woff files are the same Plus
// Jakarta Sans build @fontsource/plus-jakarta-sans (already a dependency —
// see package.json) ships, copied once into public/fonts so they're read
// from disk instead of over the network. Satori (what next/og renders
// through) supports TTF/OTF/WOFF, not WOFF2 — hence .woff here, not the
// smaller .woff2 files Google would otherwise prefer.
//
// Covers the Latin + Latin Extended-A ranges (ordinary English/Western-
// European text, including accented characters). The old per-request
// approach asked Google to dynamically subset to whatever text was actually
// being rendered, which covered any script the font itself supports; a
// listing title or helper name in a script outside those two ranges
// (Cyrillic, CJK, etc.) will render with Satori's own fallback handling
// instead of this font. Flagging this as a deliberate tradeoff, not an
// oversight — broader coverage is available (the same package ships
// cyrillic/cyrillic-ext/vietnamese/greek subsets) if it turns out to matter.
const FONT_DIR = path.join(process.cwd(), "public/fonts/plus-jakarta-sans");
function loadLocalFont(fileName: string): Buffer {
  return readFileSync(path.join(FONT_DIR, fileName));
}

const FONT_800_LATIN = loadLocalFont("plus-jakarta-sans-latin-800-normal.woff");
const FONT_800_LATIN_EXT = loadLocalFont("plus-jakarta-sans-latin-ext-800-normal.woff");
const FONT_600_LATIN = loadLocalFont("plus-jakarta-sans-latin-600-normal.woff");
const FONT_600_LATIN_EXT = loadLocalFont("plus-jakarta-sans-latin-ext-600-normal.woff");

export function loadOgFonts() {
  return [
    { name: "Plus Jakarta Sans", data: FONT_800_LATIN, weight: 800 as const, style: "normal" as const },
    { name: "Plus Jakarta Sans", data: FONT_800_LATIN_EXT, weight: 800 as const, style: "normal" as const },
    { name: "Plus Jakarta Sans", data: FONT_600_LATIN, weight: 600 as const, style: "normal" as const },
    { name: "Plus Jakarta Sans", data: FONT_600_LATIN_EXT, weight: 600 as const, style: "normal" as const },
  ];
}

export function OgBadge() {
  return (
    <div style={{ position: "absolute", top: 40, left: 48, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 12, height: 12, borderRadius: 6, background: OG_COLORS.accent, display: "flex" }} />
      <div style={{ fontSize: 26, fontWeight: 800, color: OG_COLORS.text, display: "flex" }}>Blyth</div>
    </div>
  );
}

export function OgScrim() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        background:
          "linear-gradient(180deg, rgba(14,14,14,0) 22%, rgba(14,14,14,0.55) 62%, rgba(14,14,14,0.95) 100%)",
      }}
    />
  );
}

// Used when there's no real photo to fill the frame with (none set, or it
// failed the safety check / fetch in urlSafety.ts).
export function OgFallbackGradient({ variant }: { variant: "listing" | "helper" }) {
  const gradient =
    variant === "listing"
      ? "linear-gradient(200deg, #3a2f22 0%, #241c14 55%, #141414 100%)"
      : "linear-gradient(200deg, #2c2620 0%, #1c1712 55%, #0e0e0e 100%)";
  return <div style={{ position: "absolute", inset: 0, display: "flex", background: gradient }} />;
}

export function OgWordmarkFallback() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: OG_COLORS.bg,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Plus Jakarta Sans"',
      }}
    >
      <div style={{ fontSize: 48, fontWeight: 800, color: OG_COLORS.text, display: "flex" }}>Blyth</div>
    </div>
  );
}
