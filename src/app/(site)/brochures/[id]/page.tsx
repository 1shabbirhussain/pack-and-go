import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PdfViewer } from "@/components/site/PdfViewer";
import { Breadcrumbs } from "@/components/site/Blocks";
import { getPackages, getPdf, getPdfs } from "@/lib/content";
import { resolvePdf } from "@/lib/pdf";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPdfs()).map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const d = await getPdf(id);
  if (!d) return { title: "Brochure not found" };
  return { title: `${d.title} — brochure`, description: d.description, alternates: { canonical: `/brochures/${d.id}` } };
}

export default async function BrochurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [d, packages] = await Promise.all([getPdf(id), getPackages()]);
  if (!d) notFound();
  const resolved = resolvePdf(d.source);
  const pkgs = packages.filter((p) => d.packageIds.includes(p.id));
  return (
    <div className="bg-navy pb-16 pt-28">
      <div className="container-x">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Brochures", href: "/brochures" }, { name: d.title, href: `/brochures/${d.id}` }]} />
        <div className="mt-5 flex flex-col justify-between gap-4 text-white md:flex-row md:items-end">
          <div>
            <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-tight">{d.title}</h1>
            {d.description && <p className="mt-2 max-w-2xl text-white/75">{d.description}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {pkgs.map((p) => <Link key={p.id} href={`/tours/${p.id}`} className="btn btn-primary btn-sm">View tour page</Link>)}
            <Link href="/brochures" className="btn btn-ghost-light btn-sm"><ArrowLeft className="size-4" aria-hidden /> All brochures</Link>
          </div>
        </div>
        <div className="mt-8">
          {resolved ? (
            <PdfViewer pdf={resolved} title={d.title} allowDownload={d.allowDownload} fileName={`${d.id}.pdf`} />
          ) : (
            <p className="rounded-2xl bg-white p-8 text-navy">This brochure&apos;s file is not available right now. Please <Link href="/contact" className="underline">contact us</Link> and we&apos;ll send it to you.</p>
          )}
        </div>
      </div>
    </div>
  );
}
