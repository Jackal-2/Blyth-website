import type { ImgHTMLAttributes } from "react";
import { toProxiedImageUrl } from "@/lib/photoProxy";

interface ProxiedPhotoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  url: string;
  alt?: string;
}

// Every listing/helper/feed photo this app renders goes through this —
// never a raw <img src={someUrl}>. Routes every URL through
// toProxiedImageUrl (see lib/photoProxy.ts and app/api/photo/route.ts)
// first, so a visitor's browser never makes a direct request to whatever
// server a listing/helper/post photo happens to be hosted on. Centralizing
// this also means there's exactly one place, not four, that needs to change
// if the proxying strategy ever does (e.g. once every image field is
// restricted to the app's own storage host, per the backend's
// isUrlHostSafeAtSaveTime — see urlSafety.ts).
//
// Not a next/image: the proxy URL embeds the real source dynamically per
// request (?u=<encoded original URL>), which next/image's static
// remotePatterns allowlist can't express.
export function ProxiedPhoto({ url, alt = "", ...rest }: ProxiedPhotoProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={toProxiedImageUrl(url)} alt={alt} {...rest} />;
}
