import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageReveal from "@/components/PageReveal";
import { ProxiedPhoto } from "@/components/ProxiedPhoto";
import { OpenInAppButtons } from "@/components/OpenInAppButtons";
import { ShareQrCode } from "@/components/ShareQrCode";
import { appLinksFor, STORE_URLS, webUrlFor } from "@/lib/appLinks";
import { fetchPublicProvider } from "@/lib/providers";

type Params = Promise<{ id: string }>;

// Public share-card page for the app's "Share My Profile" link; drives link-preview unfurls.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const provider = await fetchPublicProvider(id);
  if (!provider) return { title: "Helper not found — Blyth" };

  const description =
    provider.reviewCount > 0
      ? `${provider.rating.toFixed(1)}★ (${provider.reviewCount} review${provider.reviewCount === 1 ? "" : "s"}) on Blyth — see their listings and book directly in the app.`
      : "See their listings and book directly in the app.";

  return {
    title: `${provider.fullName} on Blyth`,
    description,
    openGraph: {
      title: `${provider.fullName} on Blyth`,
      description,
      type: "profile",
    },
  };
}

function formatMemberSince(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatPrice(price: number): string {
  return `$${price.toFixed(price % 1 === 0 ? 0 : 2)}`;
}

export default async function HelperProfilePage({ params }: { params: Params }) {
  const { id } = await params;
  const provider = await fetchPublicProvider(id);
  if (!provider) notFound();

  const initial = provider.fullName.trim().charAt(0).toUpperCase() || "?";
  const app = appLinksFor("helper", provider.id);

  return (
    <main className="helper-page">
      <div className="container">
        <PageReveal>
          <div className="helper-card">
            <div className="helper-avatar" aria-hidden="true">
              {initial}
            </div>
            <div className="helper-identity">
              <h1 className="helper-name">
                {provider.fullName}
                {provider.businessVerified && (
                  <span className="helper-verified-badge" title="Verified business">
                    ✓ Verified business
                  </span>
                )}
              </h1>
              <p className="helper-meta">
                {provider.reviewCount > 0 ? (
                  <>
                    <span className="helper-rating">★ {provider.rating.toFixed(1)}</span>
                    <span>
                      {provider.reviewCount} review{provider.reviewCount === 1 ? "" : "s"}
                    </span>
                  </>
                ) : (
                  <span>No reviews yet</span>
                )}
                <span>On Blyth since {formatMemberSince(provider.memberSince)}</span>
              </p>
            </div>
            <OpenInAppButtons
              iosApp={app.ios}
              androidApp={app.android}
              iosStore={STORE_URLS.ios}
              androidStore={STORE_URLS.android}
            />
            <ShareQrCode url={webUrlFor("helper", provider.id)} />
          </div>
        </PageReveal>

        <PageReveal cascade delay={90}>
          <section className="helper-listings">
            <h2>Listings</h2>
            {provider.listings.length === 0 ? (
              <p className="helper-empty">No active listings right now — check back soon.</p>
            ) : (
              <div className="helper-listing-grid">
                {provider.listings.map((listing) => (
                  <a
                    key={listing.id}
                    className="helper-listing-card"
                    href={appLinksFor("listing", listing.id).ios}
                  >
                    <div className="helper-listing-image">
                      {listing.imageUrl ? (
                        <ProxiedPhoto url={listing.imageUrl} />
                      ) : (
                        <div className="helper-listing-image-placeholder" aria-hidden="true" />
                      )}
                    </div>
                    <div className="helper-listing-body">
                      <p className="helper-listing-title">{listing.title}</p>
                      <p className="helper-listing-price">{formatPrice(listing.price)}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        </PageReveal>
      </div>
    </main>
  );
}
