import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageReveal from "@/components/PageReveal";
import { ProxiedPhoto } from "@/components/ProxiedPhoto";
import { OpenInAppButtons } from "@/components/OpenInAppButtons";
import { ShareQrCode } from "@/components/ShareQrCode";
import { appLinksFor, STORE_URLS, webUrlFor } from "@/lib/appLinks";
import { fetchPublicListing } from "@/lib/listings";

type Params = Promise<{ id: string }>;

// Public share-card page for the app's "Share" action on a listing; drives
// link-preview unfurls. Mirrors helpers/[id]/page.tsx.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchPublicListing(id);
  if (!listing) return { title: "Listing not found — Blyth" };

  const description = listing.provider
    ? `${formatPrice(listing.price, listing)} · by ${listing.provider.fullName} on Blyth — see the details and book directly in the app.`
    : `${formatPrice(listing.price, listing)} on Blyth — see the details and book directly in the app.`;

  return {
    title: `${listing.title} — Blyth`,
    description,
    openGraph: {
      title: `${listing.title} — Blyth`,
      description,
      type: "website",
    },
  };
}

function formatPrice(price: number, listing: { type: "item" | "service"; isOneTimeService: boolean }): string {
  const amount = `$${price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}`;
  return listing.type === "item" || listing.isOneTimeService ? amount : `${amount}/hr`;
}

export default async function ListingPage({ params }: { params: Params }) {
  const { id } = await params;
  const listing = await fetchPublicListing(id);
  if (!listing) notFound();

  const coverImage = listing.images[0]?.url ?? null;
  const app = appLinksFor("listing", listing.id);

  return (
    <main className="helper-page">
      <div className="container">
        <PageReveal>
          <div className="listing-card">
            <div className="listing-card-image">
              {coverImage ? (
                <ProxiedPhoto url={coverImage} />
              ) : (
                <div className="helper-listing-image-placeholder" aria-hidden="true" />
              )}
            </div>
            <div className="listing-card-body">
              <p className="listing-card-type">{listing.type === "item" ? "Item" : "Service"}</p>
              <h1 className="helper-name">{listing.title}</h1>
              {listing.provider && (
                <p className="helper-meta">
                  <span>by {listing.provider.fullName}</span>
                  {listing.provider.businessVerified && (
                    <span className="helper-verified-badge" title="Verified business">
                      ✓ Verified business
                    </span>
                  )}
                </p>
              )}
              <p className="helper-meta">
                {listing.reviewCount > 0 ? (
                  <>
                    <span className="helper-rating">★ {listing.rating.toFixed(1)}</span>
                    <span>
                      {listing.reviewCount} review{listing.reviewCount === 1 ? "" : "s"}
                    </span>
                  </>
                ) : (
                  <span>No reviews yet</span>
                )}
              </p>
              <p className="listing-card-price">{formatPrice(listing.price, listing)}</p>
              <OpenInAppButtons
                iosApp={app.ios}
                androidApp={app.android}
                iosStore={STORE_URLS.ios}
                androidStore={STORE_URLS.android}
              />
              <ShareQrCode url={webUrlFor("listing", listing.id)} />
            </div>
          </div>
        </PageReveal>
      </div>
    </main>
  );
}
