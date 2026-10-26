import type { ImgHTMLAttributes } from "react";
import { toProxiedImageUrl } from "@/lib/photoProxy";

interface ProxiedPhotoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  url: string;
  alt?: string;
}

// A plain <img> on purpose: the photo is served through our own /api/photo
// proxy (which already sizes it), and next/image would add a second resize
// step and need every storage host listed in next.config.
export function ProxiedPhoto({ url, alt = "", ...rest }: ProxiedPhotoProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={toProxiedImageUrl(url)} alt={alt} {...rest} />;
}
