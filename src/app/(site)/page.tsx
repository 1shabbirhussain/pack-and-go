import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Backpack, BedDouble, Compass, FileText, Map, MessageCircle, Receipt, Route, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { CtaBand, DestinationCard, SectionHeading, TourCard } from "@/components/site/Blocks";
import { ContactPanel } from "@/components/site/ContactPanel";
import { FaqList } from "@/components/site/FaqList";
import { ReviewCards } from "@/components/site/ReviewCards";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { Picture } from "@/components/ui/Picture";
import { getContact, getDestinations, getFaqs, getGallery, getPackages, getPdfs, getReviews, getSections } from "@/lib/content";
import { imageUrl } from "@/lib/media";
import type { Section } from "@/lib/schema";

const ICONS: Record<string, typeof Compass> = {
  route: Route, compass: Compass, bed: BedDouble, receipt: Receipt, map: Map, "message-circle": MessageCircle, "shield-check": ShieldCheck, backpack: Backpack,
};

export const revalidate = 300;

export default async function HomePage() {
  const [sections, packages, destinations, gallery, reviews, faqs, pdfs, contact] = await Promise.all([
    getSections(), getPackages(), getDestinations(), getGallery(), getReviews(), getFaqs(), getPdfs(), getContact(),
  ]);

  const render = (s: Section) => {
    switch (s.key) {
      case "hero":
        return (
          <Hero
            key={s.id}
            eyebrow={s.eyebrow}
            title={s.title || "Ready for your next adventure?"}
            subtitle={s.subtitle}
            primary={s.ctaLabel ? { href: s.ctaHref || "/tours", label: s.ctaLabel } : undefined}
            secondary={s.secondaryCtaLabel ? { href: s.secondaryCtaHref || "/custom-tour", label: s.secondaryCtaLabel } : undefined}
            images={s.images.length ? s.images : packages.map((p) => p.heroImage!).filter(Boolean)}
            chips={s.items}
          />
        );
      case "featuredTours": {
        const featured = s.featuredIds.length
          ? s.featuredIds.map((id) => packages.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p))
          : packages.filter((p) => p.featured);
        if (!featured.length) return null;
        return (
          <section key={s.id} id="tours" className="container-x scroll-mt-24 py-20 sm:py-28" aria-labelledby="tours-h">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <Reveal><SectionHeading id="tours-h" eyebrow={s.eyebrow} title={s.title || "Our tours"} subtitle={s.subtitle} /></Reveal>
              {s.ctaLabel && <Link href={s.ctaHref || "/tours"} className="btn btn-outline self-start md:self-auto">{s.ctaLabel} <ArrowRight className="size-4" aria-hidden /></Link>}
            </div>
            <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {featured.map((p, i) => <StaggerItem key={p.id}><TourCard p={p} priority={i < 2} /></StaggerItem>)}
            </Stagger>
          </section>
        );
      }
      case "destinations":
        if (!destinations.length) return null;
        return (
          <section key={s.id} className="bg-sand/50 py-20 sm:py-28" aria-labelledby="dest-h">
            <div className="container-x">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <Reveal><SectionHeading id="dest-h" eyebrow={s.eyebrow} title={s.title || "Destinations"} subtitle={s.subtitle} /></Reveal>
                {s.ctaLabel && <Link href={s.ctaHref || "/destinations"} className="btn btn-outline self-start md:self-auto">{s.ctaLabel} <ArrowRight className="size-4" aria-hidden /></Link>}
              </div>
              <Stagger className="mt-12 grid auto-rows-[18rem] gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {destinations.slice(0, 8).map((d, i) => (
                  <StaggerItem key={d.id} className={i === 0 ? "sm:col-span-2 sm:row-span-2" : i === 3 ? "lg:col-span-2" : ""}>
                    <DestinationCard d={d} className="h-full" />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>
        );
      case "whyUs":
        return (
          <section key={s.id} className="container-x py-20 sm:py-28" aria-labelledby="why-h">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div className="relative order-last lg:order-first">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift sm:aspect-[5/4] lg:aspect-[4/5]">
                  <Picture image={packages[2]?.heroImage ?? packages[0]?.heroImage} sizes="(min-width:1024px) 45vw, 100vw" />
                </div>
                <div className="absolute -bottom-8 -right-2 hidden w-56 overflow-hidden rounded-3xl border-8 border-snow shadow-lift sm:block">
                  <div className="relative aspect-square"><Picture image={packages[0]?.heroImage} sizes="224px" /></div>
                </div>
              </div>
              <div>
                <Reveal><SectionHeading id="why-h" eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} /></Reveal>
                <Stagger className="mt-10 grid gap-6 sm:grid-cols-2">
                  {s.items.map((it) => {
                    const Icon = ICONS[it.icon ?? ""] ?? Compass;
                    return (
                      <StaggerItem key={it.title} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy/5">
                        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-glacier-100 text-glacier-700"><Icon className="size-5" aria-hidden /></span>
                        <h3 className="mt-4 font-sans text-lg font-semibold text-navy">{it.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-stone">{it.text}</p>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </div>
            </div>
          </section>
        );
      case "customTour":
        return (
          <CtaBand key={s.id} title={s.title || "Plan a custom trip"} text={s.subtitle} primary={{ href: s.ctaHref || "/custom-tour", label: s.ctaLabel || "Plan a custom trip" }} secondary={{ href: "/destinations", label: "Browse destinations" }} />
        );
      case "howItWorks":
        return (
          <section key={s.id} className="container-x py-16" aria-labelledby="how-h">
            <Reveal><SectionHeading id="how-h" eyebrow={s.eyebrow} title={s.title} align="center" /></Reveal>
            <ol className="relative mt-14 grid gap-10 md:grid-cols-4">
              <svg className="pointer-events-none absolute left-0 right-0 top-6 hidden h-4 w-full md:block" preserveAspectRatio="none" viewBox="0 0 100 4" aria-hidden="true">
                <path d="M2 2 H98" stroke="#9a5b00" strokeWidth="0.4" strokeDasharray="1.2 1.2" fill="none" />
              </svg>
              {s.items.map((it, i) => {
                const Icon = ICONS[it.icon ?? ""] ?? Compass;
                return (
                  <Reveal as="li" key={it.title} delay={i * 0.08} className="relative text-center">
                    <span className="relative mx-auto inline-flex size-12 items-center justify-center rounded-full bg-navy text-amber-300 ring-8 ring-snow"><Icon className="size-5" aria-hidden /></span>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Step {i + 1}</p>
                    <h3 className="mt-1 font-sans text-lg font-semibold text-navy">{it.title}</h3>
                    <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-stone">{it.text}</p>
                  </Reveal>
                );
              })}
            </ol>
          </section>
        );
      case "reviews":
        // Only real, published reviews are shown. With none, the section is omitted.
        if (!reviews.length) return null;
        return (
          <section key={s.id} className="container-x py-20" aria-labelledby="rev-h">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <Reveal><SectionHeading id="rev-h" eyebrow={s.eyebrow} title={s.title || "Traveller stories"} /></Reveal>
              <Link href="/reviews" className="btn btn-outline self-start">All reviews <ArrowRight className="size-4" aria-hidden /></Link>
            </div>
            <div className="mt-10"><ReviewCards reviews={reviews.slice(0, 3)} /></div>
          </section>
        );
      case "gallery": {
        const items = gallery.filter((g) => g.featured).slice(0, 6);
        if (!items.length) return null;
        return (
          <section key={s.id} className="bg-navy py-20 text-white sm:py-28" aria-labelledby="gal-h">
            <div className="container-x">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <Reveal><SectionHeading id="gal-h" eyebrow={s.eyebrow} title={s.title || "Gallery"} light /></Reveal>
                <Link href={s.ctaHref || "/gallery"} className="btn btn-ghost-light self-start">{s.ctaLabel || "Open the gallery"} <ArrowRight className="size-4" aria-hidden /></Link>
              </div>
              <Stagger className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:grid-rows-2">
                {items.map((g, i) => (
                  <StaggerItem key={g.id} className={`relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2 aspect-square md:col-span-1 md:aspect-auto" : "aspect-[4/3]"}`}>
                    <Link href="/gallery" className="group block size-full" aria-label={`${g.title} — open gallery`}>
                      <Picture image={g.image} sizes="(min-width:768px) 33vw, 50vw" className="transition-transform duration-700 group-hover:scale-105" />
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>
        );
      }
      case "brochures":
        if (!pdfs.length) return null;
        return (
          <section key={s.id} className="container-x py-20 sm:py-28" aria-labelledby="bro-h">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <Reveal><SectionHeading id="bro-h" eyebrow={s.eyebrow} title={s.title || "Brochures"} subtitle={s.subtitle} /></Reveal>
              <Link href={s.ctaHref || "/brochures"} className="btn btn-outline self-start">{s.ctaLabel || "Brochure library"} <ArrowRight className="size-4" aria-hidden /></Link>
            </div>
            <Stagger className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {pdfs.slice(0, 4).map((d) => (
                <StaggerItem key={d.id}>
                  <Link href={`/brochures/${d.id}`} className="group block">
                    <div className="relative aspect-[640/905] overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-navy/10 transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:shadow-lift">
                      {imageUrl(d.coverImage) ? (
                        <Image src={imageUrl(d.coverImage)!} alt={d.coverImage?.alt ?? ""} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-cover" />
                      ) : (
                        <div className="flex size-full items-center justify-center"><FileText className="size-10 text-navy/30" aria-hidden /></div>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-snug text-navy group-hover:underline">{d.title}</p>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        );
      case "faq": {
        const items = faqs.filter((f) => f.showOnHome).slice(0, 6);
        if (!items.length) return null;
        return (
          <section key={s.id} className="bg-sand/50 py-20 sm:py-28" aria-labelledby="faq-h">
            <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.5fr]">
              <div>
                <Reveal><SectionHeading id="faq-h" eyebrow={s.eyebrow} title={s.title || "FAQs"} /></Reveal>
                <Link href={s.ctaHref || "/faq"} className="btn btn-dark mt-8">{s.ctaLabel || "All FAQs"} <ArrowRight className="size-4" aria-hidden /></Link>
              </div>
              <FaqList faqs={items} />
            </div>
          </section>
        );
      }
      case "contact":
        return (
          <section key={s.id} className="container-x py-20 sm:py-28" aria-labelledby="contact-h">
            <Reveal><SectionHeading id="contact-h" eyebrow={s.eyebrow} title={s.title || "Contact us"} /></Reveal>
            <div className="mt-10"><ContactPanel contact={contact} /></div>
          </section>
        );
      default:
        return null;
    }
  };

  return <>{sections.map(render)}</>;
}
