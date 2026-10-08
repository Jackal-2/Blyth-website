import type { NextRequest } from "next/server";
import { fetchImageSafely } from "@/lib/urlSafety";
import { IMAGE_CONTENT_TYPE } from "@/lib/imageDimensions";

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
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
