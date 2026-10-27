import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AlertTriangle, Backpack, Baby, Check, FileText, Info, Utensils, X } from "lucide-react";
import { PageHero, TourCard } from "@/components/site/Blocks";
import { TourPlanner } from "@/components/site/TourPlanner";
import { ReviewCards } from "@/components/site/ReviewCards";
import { getContact, getDestinations, getPackage, getPackages, getPdfs, getReviews } from "@/lib/content";
import { imageUrl } from "@/lib/media";
import { formatBytes } from "@/lib/pdf";
import { JsonLd, tourJsonLd } from "@/lib/seo";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPackages()).map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPackage(slug);
  if (!p) return { title: "Tour not found" };
  const img = imageUrl(p.heroImage);
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.summary.slice(0, 160),
    alternates: { canonical: `/tours/${p.id}` },
    openGraph: { title: p.title, description: p.seoDescription || p.summary, images: img ? [{ url: img }] : undefined, type: "article" },
  };
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, contact, pdfs, reviews, destinations, all] = await Promise.all([getPackage(slug), getContact(), getPdfs(), getReviews(), getDestinations(), getPackages()]);
  if (!p) notFound();

  const brochures = pdfs.filter((d) => p.brochureIds.includes(d.id) || d.packageIds.includes(p.id));
  const tourReviews = reviews.filter((r) => r.packageId === p.id);
  const dests = destinations.filter((d) => p.destinationIds.includes(d.id));
  const related = all.filter((x) => x.id !== p.id).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={p.labels.join(" · ")}
        title={p.title}
        subtitle={p.summary}
        image={p.heroImage}
        crumbs={[{ name: "Home", href: "/" }, { name: "Tours", href: "/tours" }, { name: p.title, href: `/tours/${p.id}` }]}
      >
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Highlights">
          {p.highlights.slice(0, 10).map((h) => <li key={h} className="chip bg-white/12 text-white ring-1 ring-white/20 backdrop-blur">{h}</li>)}
        </ul>
      </PageHero>

      <TourPlanner pkg={p} whatsappNumber={contact.whatsappNumber} greeting={contact.whatsappGreeting}>
        {p.advisories.length > 0 && (
          <section className="mt-14 rounded-2xl border border-amber/60 bg-amber/10 p-5 sm:p-6" aria-labelledby="adv-h">
            <h2 id="adv-h" className="flex items-center gap-2 font-sans text-lg font-semibold text-navy"><AlertTriangle className="size-5 text-amber-700" aria-hidden />Travel advisory</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink">{p.advisories.map((a) => <li key={a}>{a}</li>)}</ul>
          </section>
        )}

        <section className="mt-14" aria-labelledby="inc-h">
          <h2 id="inc-h" className="h-section text-navy">What&apos;s included</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-pine-100/70 p-6">
              <h3 className="font-sans text-base font-semibold text-pine">Included</h3>
              <ul className="mt-4 space-y-2.5">{p.inclusions.map((x) => <li key={x} className="flex gap-2.5"><Check className="mt-0.5 size-5 shrink-0 text-pine" aria-hidden />{x}</li>)}</ul>
            </div>
            <div className="rounded-2xl bg-white p-6 ring-1 ring-navy/10">
              <h3 className="font-sans text-base font-semibold text-navy">Not included</h3>
              <ul className="mt-4 space-y-2.5">{p.exclusions.map((x) => <li key={x} className="flex gap-2.5"><X className="mt-0.5 size-5 shrink-0 text-[#b42318]" aria-hidden />{x}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-2" aria-label="Meals, children and packing">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-sans text-lg font-semibold text-navy"><Utensils className="size-5 text-glacier" aria-hidden />Meals</h2>
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone">Breakfast</h3>
            <ul className="mt-1.5 space-y-1">{p.mealsBreakfast.map((x) => <li key={x}>{x}</li>)}</ul>
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone">Dinner</h3>
            <ul className="mt-1.5 space-y-1">{p.mealsDinner.map((x) => <li key={x}>{x}</li>)}</ul>
            {p.mealsNote && <p className="mt-3 text-sm text-stone">{p.mealsNote}</p>}
          </div>
          <div className="grid gap-6">
            <div className="card p-6">
              <h2 className="flex items-center gap-2 font-sans text-lg font-semibold text-navy"><Baby className="size-5 text-glacier" aria-hidden />Kids policy</h2>
              <ul className="mt-3 space-y-1.5">{p.kidsPolicy.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="card p-6">
              <h2 className="flex items-center gap-2 font-sans text-lg font-semibold text-navy"><Backpack className="size-5 text-glacier" aria-hidden />What to bring</h2>
              <ul className="mt-3 flex flex-wrap gap-2">{p.packingList.map((x) => <li key={x} className="chip">{x}</li>)}</ul>
            </div>
          </div>
        </section>

        {(p.importantNotes.length > 0 || p.priceNotes.length > 0) && (
          <section className="mt-14" aria-labelledby="notes-h">
            <h2 id="notes-h" className="flex items-center gap-2 font-sans text-xl font-semibold text-navy"><Info className="size-5 text-glacier" aria-hidden />Good to know</h2>
            <ul className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-ink">
              {[...p.importantNotes, ...p.priceNotes].map((n) => <li key={n} className="rounded-xl bg-white p-4 ring-1 ring-navy/5">{n}</li>)}
            </ul>
            <p className="mt-4 text-sm text-stone">
              Full <Link href="/terms" className="font-semibold text-navy underline underline-offset-2">tour terms, cancellation and payment policy</Link>.
            </p>
          </section>
        )}

        {brochures.length > 0 && (
          <section className="mt-14" aria-labelledby="bro-h">
            <h2 id="bro-h" className="flex items-center gap-2 font-sans text-xl font-semibold text-navy"><FileText className="size-5 text-glacier" aria-hidden />Brochure</h2>
            <div className="mt-4 grid gap-4">
              {brochures.map((b) => (
                <Link key={b.id} href={`/brochures/${b.id}`} className="group flex items-center gap-5 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-navy/5 hover:ring-amber">
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-sand">
                    {imageUrl(b.coverImage) && <Image src={imageUrl(b.coverImage)!} alt="" fill sizes="80px" className="object-cover" />}
                  </div>
                  <div>
                    <p className="font-semibold text-navy group-hover:underline">{b.title}</p>
                    <p className="mt-1 text-sm text-stone">{[b.pageCount && `${b.pageCount} pages`, formatBytes(b.fileSizeBytes), b.version].filter(Boolean).join(" · ")}</p>
                    <p className="mt-2 text-sm font-semibold text-glacier-700">Open the brochure viewer →</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {dests.length > 0 && (
          <p className="mt-10 text-sm text-stone">
            Destination guides:{" "}
            {dests.map((d, i) => <span key={d.id}>{i > 0 && ", "}<Link className="font-semibold text-navy underline underline-offset-2" href={`/destinations/${d.id}`}>{d.name}</Link></span>)}
          </p>
        )}

        {tourReviews.length > 0 && (
          <section className="mt-14" aria-labelledby="trev-h">
            <h2 id="trev-h" className="font-sans text-xl font-semibold text-navy">Traveller reviews</h2>
            <div className="mt-6"><ReviewCards reviews={tourReviews} /></div>
          </section>
        )}
      </TourPlanner>

      {related.length > 0 && (
        <section className="container-x pb-10 pt-6" aria-labelledby="rel-h">
          <h2 id="rel-h" className="h-section text-navy">More tours</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((r) => <TourCard key={r.id} p={r} />)}</div>
        </section>
      )}
      <div className="h-16 lg:hidden" aria-hidden />
      <JsonLd data={tourJsonLd(p)} />
    </>
  );
}
