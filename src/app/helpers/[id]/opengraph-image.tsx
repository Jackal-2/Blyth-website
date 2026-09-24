import { ImageResponse } from "next/og";
import { fetchPublicProvider } from "@/lib/providers";
import {
  OG_COLORS,
  OG_SIZE,
  OG_CONTENT_TYPE,
  OG_REVALIDATE_SECONDS,
  loadOgFonts,
  fetchImageAsDataUri,
  OgBadge,
  OgScrim,
  OgFallbackGradient,
  OgWordmarkFallback,
} from "@/lib/og-shared";

export const alt = "Blyth helper profile";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const revalidate = OG_REVALIDATE_SECONDS;

const AVATAR_SIZE = 132;

type Params = Promise<{ id: string }>;

export default async function Image({ params }: { params: Params }) {
  const { id } = await params;
  const provider = await fetchPublicProvider(id);

  if (!provider) {
    return new ImageResponse(<OgWordmarkFallback />, { ...OG_SIZE, fonts: loadOgFonts() });
  }

  const ratingLabel = provider.reviewCount > 0 ? `★ ${provider.rating.toFixed(1)}` : "No reviews yet";
  const reviewsLabel =
    provider.reviewCount > 0 ? `${provider.reviewCount} review${provider.reviewCount === 1 ? "" : "s"}` : null;
  const initial = provider.fullName.trim().charAt(0).toUpperCase() || "?";
  // Cover/avatar URLs are user-supplied and get fetched by our own server to
  // render into this image, so each is resolved through the SSRF-safe fetch
  // in og-shared.tsx — fetched (and cached in this one request) at most once
  // each, since the avatar can also be reused as the background.
  const [avatarDataUri, coverDataUri] = await Promise.all([
    provider.avatarUrl ? fetchImageAsDataUri(provider.avatarUrl) : Promise.resolve(null),
    provider.coverImageUrl ? fetchImageAsDataUri(provider.coverImageUrl) : Promise.resolve(null),
  ]);
  // No (safe) cover photo? Fall back to their avatar full-bleed rather than a
  // blank card; no (safe) avatar either drops to the flat gradient.
  const backgroundImage = coverDataUri ?? avatarDataUri ?? null;

  const fonts = loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: OG_COLORS.bg,
          fontFamily: '"Plus Jakarta Sans"',
        }}
      >
        {backgroundImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backgroundImage}
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            style={{
              position: "absolute",
              inset: 0,
              width: `${OG_SIZE.width}px`,
              height: `${OG_SIZE.height}px`,
              objectFit: "cover",
              display: "flex",
            }}
          />
        ) : (
          <OgFallbackGradient variant="helper" />
        )}
        <OgScrim />
        <OgBadge />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "0 52px 48px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: AVATAR_SIZE / 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: `3px solid ${OG_COLORS.accentLight}`,
                background: "rgba(217,138,61,0.18)",
                marginRight: 32,
                flexShrink: 0,
              }}
            >
              {avatarDataUri ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarDataUri}
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                  style={{ width: `${AVATAR_SIZE}px`, height: `${AVATAR_SIZE}px`, objectFit: "cover", display: "flex" }}
                />
              ) : (
                <div style={{ fontSize: 52, fontWeight: 800, color: OG_COLORS.accentLight, display: "flex" }}>
                  {initial}
                </div>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
              <div style={{ fontSize: 44, fontWeight: 800, color: OG_COLORS.text, lineHeight: 1.15, display: "flex" }}>
                {provider.fullName}
              </div>
              <div style={{ fontSize: 22, color: OG_COLORS.textMuted, marginTop: 12, display: "flex", gap: 10 }}>
                <span style={{ display: "flex", color: OG_COLORS.accentLight }}>{ratingLabel}</span>
                {reviewsLabel && (
                  <>
                    <span style={{ display: "flex" }}>·</span>
                    <span style={{ display: "flex" }}>{reviewsLabel}</span>
                  </>
                )}
                {provider.businessVerified && (
                  <>
                    <span style={{ display: "flex" }}>·</span>
                    <span style={{ display: "flex" }}>Verified business</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              background: OG_COLORS.accent,
              color: "#1a1206",
              fontSize: 24,
              fontWeight: 800,
              padding: "14px 26px",
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            Neighborhood Helper
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
