import type { MetadataRoute } from "next";
import { getDestinations, getPackages, getPdfs } from "@/lib/content";
import { siteUrl } from "@/lib/format";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [packages, destinations, pdfs] = await Promise.all([getPackages(), getDestinations(), getPdfs()]);
  const now = new Date();
  const staticPaths = ["", "/tours", "/destinations", "/custom-tour", "/brochures", "/gallery", "/reviews", "/about", "/contact", "/faq", "/terms", "/privacy"];
  return [
    ...staticPaths.map((p) => ({ url: siteUrl(p || "/"), lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...packages.map((p) => ({ url: siteUrl(`/tours/${p.id}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...destinations.map((d) => ({ url: siteUrl(`/destinations/${d.id}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...pdfs.map((d) => ({ url: siteUrl(`/brochures/${d.id}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
