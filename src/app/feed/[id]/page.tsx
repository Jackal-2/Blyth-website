import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageReveal from "@/components/PageReveal";
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

  return (
    <main className="helper-page">
      <div className="container">
        <PageReveal>
          <div className="listing-card">
            <div className="listing-card-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.imageUrl} alt="" />
            </div>
            <div className="listing-card-body">
              <div className="feed-post-author">
                {post.author.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="feed-post-avatar" src={post.author.avatarUrl} alt="" />
                ) : (
                  <div className="feed-post-avatar feed-post-avatar-fallback" aria-hidden="true">
                    {initial}
                  </div>
                )}
                <span className="helper-name feed-post-author-name">{post.author.fullName}</span>
              </div>
              {post.caption && <p className="listing-card-description">{post.caption}</p>}
              <a className="btn btn-accent listing-open-app" href={`blyth://provider/${post.author.id}`}>
                Open in the Blyth app
              </a>
            </div>
          </div>
        </PageReveal>

        <PageReveal cascade delay={90}>
          <div className="helper-cta">
            <p>Get the Blyth app to see more from {post.author.fullName} and the rest of the Feed.</p>
            <a className="btn btn-light" href="/#get-app">
              Get the app
            </a>
          </div>
        </PageReveal>
      </div>
    </main>
  );
}
