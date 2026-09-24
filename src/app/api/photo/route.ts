import type { NextRequest } from "next/server";
import { fetchImageSafely } from "@/lib/urlSafety";
import { IMAGE_CONTENT_TYPE } from "@/lib/imageDimensions";

// Proxies a user-supplied photo URL (a listing photo, or a helper's
// avatar/cover) through this site's own server, instead of a share page
// putting that URL directly into <img src>. Without this, every visitor's
// browser made a direct request to whichever server a helper chose as their
// photo host — handing that server the visitor's IP, device details, and
// the time they opened the link (their Referer header carries the share
// URL itself, which names the listing/helper). The OG card image was
// already safe (it's fetched server-side through fetchSafely, never in the
// visitor's browser); this closes the same gap for the page itself.
//
// Reuses the exact SSRF-safe, size/timeout-capped, pinned-connection fetch
// the OG image route uses (see lib/urlSafety.ts) — an internal address
// can't be reached through this any more than it can be baked into a share
// card. Known, low-severity residual: this will proxy any public http(s)
// image URL passed to it, not just ones that actually belong to a listing
// or helper — fine for cost/abuse today (still SSRF-safe, size/timeout
// capped, images only), but if this site is ever linked to from elsewhere
// as a general-purpose image relay, scope this to known photo URLs instead.
//
// Uses fetchImageSafely (not fetchSafely directly) so this also gets the
// decoded-dimension guard (see urlSafety.ts) — a small, highly-compressed
// image can still be huge once decoded, and this route's response is what
// the visitor's own browser will decode. That same guard is also what
// verifies the response is actually one of the three accepted image
// formats: fetchImageSafely rejects anything getImageDimensions can't parse
// out of the real header bytes, upstream Content-Type claim or not.
//
// This route's own Content-Type comes from that verified format
// (result.format / IMAGE_CONTENT_TYPE), never from the upstream server's
// declared Content-Type header — a server that lies about its Content-Type
// (e.g. serving something else as "image/png") does not get that claim
// reflected back out to the visitor's browser. Content-Security-Policy and
// X-Content-Type-Options further pin down how the response can be
// interpreted: this is image bytes and only image bytes, sniffed as
// nothing else and permitted to load nothing of its own.
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("u");
  if (!url) return new Response("Missing url", { status: 400 });

  const result = await fetchImageSafely(url);
  if (!result) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(result.body), {
    status: 200,
    headers: {
      "Content-Type": IMAGE_CONTENT_TYPE[result.format],
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
      // Matches OG_REVALIDATE_SECONDS (og-shared.tsx) — the OG card image
      // waits this long to pick up a new photo, no reason for the page's
      // own <img> to be any fresher than that.
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
