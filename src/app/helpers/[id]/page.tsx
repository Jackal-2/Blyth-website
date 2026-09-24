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

// Deliberately just identity + reviews + "open the app" — no Listings grid.
// This page's whole job is the share-link fallback (see
// docs/share-links-and-deep-linking.md); anyone who wants to browse this
// helper's listings has the app for that.
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
          <div className="helper-cover">
            {provider.coverImageUrl ? (
              <ProxiedPhoto url={provider.coverImageUrl} />
            ) : null}
          </div>
          <div className="helper-card">
            <div className="helper-avatar" aria-hidden={provider.avatarUrl ? undefined : "true"}>
              {provider.avatarUrl ? <ProxiedPhoto url={provider.avatarUrl} /> : initial}
            </div>
            <div className="helper-identity">
              <h1 className="helper-name">
                {provider.fullName}
                {provider.businessVerified && (
                  <span className="verified-tick" title="Verified business" aria-label="Verified business">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
      </div>
    </main>
  );
}
