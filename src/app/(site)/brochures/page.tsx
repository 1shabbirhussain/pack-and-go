import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Download, Eye, FileText } from "lucide-react";
import { PageHero } from "@/components/site/Blocks";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { getPackages, getPdfs } from "@/lib/content";
import { imageUrl } from "@/lib/media";
import { formatBytes, resolvePdf } from "@/lib/pdf";
import { PHOTOS } from "@/content/seed/shared";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Brochure library",
  description: "Open Pack & Go Tourism brochures online — Naran, Kashmir, Kashmir & Naran, and Naran, Hunza & Skardu — or download them to share.",
  alternates: { canonical: "/brochures" },
};

export default async function BrochuresPage() {
  const [pdfs, packages] = await Promise.all([getPdfs(), getPackages()]);
  return (
    <>
      <PageHero eyebrow="Brochures" title="Brochure library" subtitle="Read any brochure right here, page by page, or download it to share with family and friends." image={PHOTOS.resortRedRoofs} crumbs={[{ name: "Home", href: "/" }, { name: "Brochures", href: "/brochures" }]} />
      <section className="container-x py-16">
        {pdfs.length === 0 ? (
          <p className="card p-8 text-center text-stone">No brochures are published right now.</p>
        ) : (
          <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pdfs.map((d) => {
              const r = resolvePdf(d.source);
              const pkgs = packages.filter((p) => d.packageIds.includes(p.id));
              return (
                <StaggerItem key={d.id}>
                  <article className="group flex h-full flex-col">
                    <Link href={`/brochures/${d.id}`} className="relative block aspect-[640/905] overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-navy/10 transition duration-500 group-hover:-translate-y-1.5 group-hover:shadow-lift" aria-label={`Open ${d.title}`}>
                      {imageUrl(d.coverImage) ? <Image src={imageUrl(d.coverImage)!} alt={d.coverImage?.alt ?? ""} fill sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 90vw" className="object-cover" /> : <span className="flex size-full items-center justify-center"><FileText className="size-12 text-navy/30" aria-hidden /></span>}
                    </Link>
                    <h2 className="mt-4 font-sans text-base font-semibold leading-snug text-navy">{d.title}</h2>
                    <p className="mt-1 text-xs text-stone">{[d.pageCount && `${d.pageCount} pages`, formatBytes(d.fileSizeBytes), d.version].filter(Boolean).join(" · ")}</p>
                    {d.description && <p className="mt-2 text-sm text-stone">{d.description}</p>}
                    {pkgs.length > 0 && <p className="mt-2 text-sm">Tour: {pkgs.map((p) => <Link key={p.id} href={`/tours/${p.id}`} className="font-semibold text-glacier-700 hover:underline">{p.title}</Link>)}</p>}
                    <div className="mt-auto flex gap-2 pt-4">
                      <Link href={`/brochures/${d.id}`} className="btn btn-dark btn-sm"><Eye className="size-4" aria-hidden /> View</Link>
                      {r && d.allowDownload && <a href={r.downloadUrl} download={r.provider === "local" ? true : undefined} className="btn btn-outline btn-sm"><Download className="size-4" aria-hidden /> Download</a>}
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </section>
    </>
  );
}
