import { ImageResponse } from "next/og";
import { fetchPublicListing } from "@/lib/listings";
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

export const alt = "Blyth listing";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const revalidate = OG_REVALIDATE_SECONDS;

// Same formatter as the page itself (listings/[id]/page.tsx) — kept local
// since it's two lines and the two files don't otherwise share a type import.
function formatPrice(price: number, listing: { type: "item" | "service"; isOneTimeService: boolean }): string {
  const amount = `$${price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}`;
  return listing.type === "item" || listing.isOneTimeService ? amount : `${amount}/hr`;
}

type Params = Promise<{ id: string }>;

export default async function Image({ params }: { params: Params }) {
  const { id } = await params;
  const listing = await fetchPublicListing(id);

  if (!listing) {
    return new ImageResponse(<OgWordmarkFallback />, { ...OG_SIZE, fonts: loadOgFonts() });
  }

  const priceLabel = formatPrice(listing.price, listing);
  const providerName = listing.provider?.fullName ?? null;
  const ratingLabel = listing.reviewCount > 0 ? `★ ${listing.rating.toFixed(1)} (${listing.reviewCount})` : null;
  const rawCoverImage = listing.images[0]?.url ?? null;
  const coverImage = rawCoverImage ? await fetchImageAsDataUri(rawCoverImage) : null;

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
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
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
          <OgFallbackGradient variant="listing" />
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
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: OG_COLORS.text, lineHeight: 1.15, display: "flex" }}>
              {listing.title}
            </div>
            {(providerName || ratingLabel) && (
              <div style={{ fontSize: 22, color: OG_COLORS.textMuted, marginTop: 12, display: "flex", gap: 10 }}>
                {providerName && <span style={{ display: "flex" }}>by {providerName}</span>}
                {providerName && ratingLabel && <span style={{ display: "flex" }}>·</span>}
                {ratingLabel && <span style={{ display: "flex", color: OG_COLORS.accentLight }}>{ratingLabel}</span>}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              background: OG_COLORS.accent,
              color: "#1a1206",
              fontSize: 26,
              fontWeight: 800,
              padding: "14px 26px",
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            {priceLabel}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
