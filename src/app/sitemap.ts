import type { MetadataRoute } from "next";

const SITE_URL = "https://blythapp.com";

// Static, always-available routes. Listings and helper profiles are dynamic
// and user-generated (/listings/[id], /helpers/[id]) — they aren't included
// here because there's no public "list all active ids" endpoint yet to
// enumerate them safely. Adding one on the backend would let this sitemap
// include them too, which matters more for long-tail search than this
// static list does.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/support", priority: 0.6, changeFrequency: "monthly" },
  { path: "/community-guidelines", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/dmca", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
