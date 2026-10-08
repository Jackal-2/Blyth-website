import type { ImgHTMLAttributes } from "react";
import { toProxiedImageUrl } from "@/lib/photoProxy";

interface ProxiedPhotoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  url: string;
  alt?: string;
}

export function ProxiedPhoto({ url, alt = "", ...rest }: ProxiedPhotoProps) {
  return <img src={toProxiedImageUrl(url)} alt={alt} {...rest} />;
}
