import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageReveal from "@/components/PageReveal";
import { ProxiedPhoto } from "@/components/ProxiedPhoto";
import { OpenInAppButtons } from "@/components/OpenInAppButtons";
import { ShareQrCode } from "@/components/ShareQrCode";
import { appLinksFor, STORE_URLS, webUrlFor } from "@/lib/appLinks";
import { fetchPublicPost } from "@/lib/posts";

type Params = Promise<{ id: string }>;

// Public share-card page for the app's "Share Post" action on a Feed post;
// drives link-preview unfurls. Mirrors helpers/[id]/page.tsx and
// listings/[id]/page.tsx.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPublicPost(id);
  if (!post) return { title: "Post not found — Blyth" };

  const description = post.caption
    ? post.caption.length > 160
      ? `${post.caption.slice(0, 157)}...`
      : post.caption
    : `See ${post.author.fullName}'s post on Blyth.`;

  return {
    title: `${post.author.fullName} on Blyth`,
    description,
    openGraph: {
      title: `${post.author.fullName} on Blyth`,
      description,
      type: "website",
    },
  };
}

export default async function FeedPostPage({ params }: { params: Params }) {
  const { id } = await params;
  const post = await fetchPublicPost(id);
  if (!post) notFound();

  const initial = post.author.fullName.trim().charAt(0).toUpperCase() || "?";
  // No app/feed/[id] screen yet (see docs/share-links-and-deep-linking.md,
  // Part 5) — opens the post's author profile instead, same as before.
  const app = appLinksFor("helper", post.author.id);
  // The QR code encodes this page's OWN web URL (not the app-open link
  // above, which points at the author's profile as a workaround) — scanning
  // it should land back on this exact share page, same as any other visit.
  const shareUrl = webUrlFor("feed", post.id);

  return (
    <main className="helper-page">
      <div className="container">
        <PageReveal>
          <div className="listing-card">
            <div className="listing-card-image">
              <ProxiedPhoto url={post.imageUrl} />
            </div>
            <div className="listing-card-body">
              <div className="feed-post-author">
                {post.author.avatarUrl ? (
                  <ProxiedPhoto className="feed-post-avatar" url={post.author.avatarUrl} />
                ) : (
                  <div className="feed-post-avatar feed-post-avatar-fallback" aria-hidden="true">
                    {initial}
                  </div>
                )}
                <span className="helper-name feed-post-author-name">{post.author.fullName}</span>
              </div>
              {post.caption && <p className="listing-card-description">{post.caption}</p>}
              <OpenInAppButtons
                iosApp={app.ios}
                androidApp={app.android}
                iosStore={STORE_URLS.ios}
                androidStore={STORE_URLS.android}
              />
              <ShareQrCode url={shareUrl} />
            </div>
          </div>
        </PageReveal>
      </div>
    </main>
  );
}
