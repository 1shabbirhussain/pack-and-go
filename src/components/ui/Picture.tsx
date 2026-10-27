import Image from "next/image";
import type { ImageRef } from "@/lib/schema";
import { imageUrl } from "@/lib/media";
import { cx } from "@/lib/format";

/**
 * Renders an ImageRef with next/image. When no image exists (e.g. destinations without
 * photos yet), renders an illustrated mountain placeholder instead of a fake photo.
 */
export function Picture({ image, className, sizes = "100vw", priority = false, fill = true, alt }: { image?: ImageRef | null; className?: string; sizes?: string; priority?: boolean; fill?: boolean; alt?: string }) {
  const url = imageUrl(image);
  if (!url) return <ArtPlaceholder className={className} label={alt ?? image?.alt} />;
  const remote = /^https?:/.test(url);
  if (fill) {
    return (
      <Image src={url} alt={alt ?? image?.alt ?? ""} fill sizes={sizes} priority={priority} className={cx("object-cover", className)} unoptimized={remote && url.includes("127.0.0.1")} />
    );
  }
  return <Image src={url} alt={alt ?? image?.alt ?? ""} width={image?.width ?? 1200} height={image?.height ?? 800} sizes={sizes} priority={priority} className={className} />;
}

export function ArtPlaceholder({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cx("absolute inset-0 overflow-hidden bg-gradient-to-b from-glacier-700 via-glacier to-pine", className)} role={label ? "img" : undefined} aria-label={label}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden="true">
        <circle cx="300" cy="80" r="26" fill="#fbc979" opacity="0.9" />
        <path d="M0 230 L70 150 L110 190 L180 100 L240 180 L290 130 L400 220 V300 H0Z" fill="#232a3a" opacity="0.55" />
        <path d="M180 100 L200 128 L190 126 L176 112 Z M290 130 L304 148 L292 146Z" fill="#fff8ee" opacity="0.8" />
        <path d="M0 260 L90 200 L160 240 L250 190 L330 240 L400 210 V300 H0Z" fill="#141b29" opacity="0.75" />
      </svg>
    </div>
  );
}
