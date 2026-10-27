import type { ImageRef, MediaSource } from "./schema";

/** Resolve an image source to a URL usable by next/image or <img>. */
export function mediaUrl(src?: MediaSource | null): string | null {
  if (!src) return null;
  if (src.kind === "bundled") return src.path?.startsWith("/") ? src.path : null;
  return src.url && /^https?:\/\//.test(src.url) ? src.url : null;
}

export function imageUrl(img?: ImageRef | null) {
  return img ? mediaUrl(img.src) : null;
}
