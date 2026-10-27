import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, CalendarRange, Sparkles } from "lucide-react";
import { CtaBand, PageHero, TourCard } from "@/components/site/Blocks";
import { Reveal } from "@/components/ui/Motion";
import { getDestination, getDestinations, getPackages } from "@/lib/content";
import { imageUrl } from "@/lib/media";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getDestinations()).map((d) => ({ slug: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) return { title: "Destination not found" };
  const img = imageUrl(d.heroImage);
  return {
    title: d.seoTitle || d.name,
    description: d.seoDescription || d.summary,
    alternates: { canonical: `/destinations/${d.id}` },
    openGraph: { title: d.name, description: d.summary, images: img ? [{ url: img }] : undefined },
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [d, packages] = await Promise.all([getDestination(slug), getPackages()]);
  if (!d) notFound();
  const tours = packages.filter((p) => d.packageIds.includes(p.id) || p.destinationIds.includes(d.id));
  return (
    <>
      <PageHero eyebrow={d.region} title={d.name} subtitle={d.tagline} image={d.heroImage} crumbs={[{ name: "Home", href: "/" }, { name: "Destinations", href: "/destinations" }, { name: d.name, href: `/destinations/${d.id}` }]} />
      <section className="container-x grid gap-12 py-16 lg:grid-cols-[1.5fr_1fr]">
        <Reveal className="prose-pg max-w-none text-[1.05rem] text-ink">
          <p className="lede text-navy">{d.summary}</p>
          {d.body.map((p) => <p key={p}>{p}</p>)}
        </Reveal>
        <div className="space-y-6">
          {d.highlights.length > 0 && (
            <div className="card p-6">
              <h2 className="flex items-center gap-2 font-sans text-lg font-semibold text-navy"><Sparkles className="size-5 text-amber-700" aria-hidden />Highlights</h2>
              <ul className="mt-4 flex flex-wrap gap-2">{d.highlights.map((h) => <li key={h} className="chip">{h}</li>)}</ul>
            </div>
          )}
          {d.bestTime && (
            <div className="card p-6">
              <h2 className="flex items-center gap-2 font-sans text-lg font-semibold text-navy"><CalendarRange className="size-5 text-glacier" aria-hidden />Best time to visit</h2>
              <p className="mt-3 text-stone">{d.bestTime}</p>
            </div>
          )}
          {d.travelNotes.length > 0 && (
            <div className="rounded-2xl border border-amber/60 bg-amber/10 p-6">
              <h2 className="flex items-center gap-2 font-sans text-lg font-semibold text-navy"><AlertTriangle className="size-5 text-amber-700" aria-hidden />Travel notes</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">{d.travelNotes.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
          )}
        </div>
      </section>

      {tours.length > 0 ? (
        <section className="container-x pb-6" aria-labelledby="dtour-h">
          <h2 id="dtour-h" className="h-section text-navy">{d.id === "islamabad" ? "Tours you can join from Islamabad" : `Tours that visit ${d.name}`}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{tours.map((p) => <TourCard key={p.id} p={p} />)}</div>
        </section>
      ) : (
        <section className="container-x pb-6">
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-navy">No fixed package — yet</h2>
            <p className="mt-2 max-w-2xl text-stone">We plan customized trips to {d.name}. Share your dates, group size and budget and our team will design an itinerary and quote it for you.</p>
            <Link href={`/custom-tour?destination=${encodeURIComponent(d.id)}`} className="btn btn-primary mt-6">Plan a trip to {d.name}</Link>
          </div>
        </section>
      )}
      <CtaBand title={`Thinking about ${d.name}?`} text="Tell us what you have in mind — we'll reply on WhatsApp, by phone or email." primary={{ href: `/custom-tour?destination=${encodeURIComponent(d.id)}`, label: "Plan a custom trip" }} secondary={{ href: "/contact", label: "Contact us" }} />
    </>
  );
}
