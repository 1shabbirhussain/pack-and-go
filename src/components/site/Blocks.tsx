import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import type { Destination, TourPackage } from "@/lib/schema";
import { formatPKR } from "@/lib/format";
import { Picture } from "@/components/ui/Picture";
import { RidgeLines } from "@/components/ui/icons";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function SectionHeading({ eyebrow, title, subtitle, align = "left", light = false, id }: { eyebrow?: string; title: string; subtitle?: string; align?: "left" | "center"; light?: boolean; id?: string }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className={`eyebrow ${light ? "eyebrow-light" : ""} ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</p>}
      <h2 id={id} className={`h-section mt-3 text-balance ${light ? "text-white" : "text-navy"}`}>{title}</h2>
      {subtitle && <p className={`lede mt-4 text-pretty ${light ? "text-white/75" : "text-stone"}`}>{subtitle}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle, image, crumbs, children }: { eyebrow?: string; title: string; subtitle?: string; image?: Parameters<typeof Picture>[0]["image"]; crumbs?: { name: string; href: string }[]; children?: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy pb-24 pt-36 text-white sm:pb-28 sm:pt-40">
      <div className="absolute inset-0 -z-10">
        <Picture image={image} priority sizes="100vw" className="opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-navy/60 to-navy" />
      </div>
      <div className="container-x">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <p className="eyebrow eyebrow-light mt-6">{eyebrow}</p>}
        <h1 className="mt-3 max-w-4xl text-balance text-[clamp(2.3rem,5.5vw,4.25rem)] font-semibold leading-[1.04]">{title}</h1>
        {subtitle && <p className="lede mt-5 max-w-2xl text-pretty text-white/80">{subtitle}</p>}
        {children}
      </div>
      <RidgeLines className="absolute -bottom-px left-0 h-16 w-full sm:h-20" />
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-white/70">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((it, i) => (
            <li key={it.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              {i === items.length - 1 ? <span aria-current="page" className="text-white">{it.name}</span> : <Link href={it.href} className="hover:text-white">{it.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}

export function startingPrice(p: TourPackage) {
  const prices = p.priceOptions.filter((o) => o.status === "published" && o.perPerson != null);
  if (!prices.length) return null;
  const min = prices.reduce((a, b) => ((a.perPerson ?? Infinity) <= (b.perPerson ?? Infinity) ? a : b));
  return { amount: min.perPerson!, origin: min.origin };
}

export function TourCard({ p, priority = false }: { p: TourPackage; priority?: boolean }) {
  const from = startingPrice(p);
  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Picture image={p.heroImage} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" priority={priority} className="transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {p.durations.karachi && <span className="chip bg-white/90 backdrop-blur"><CalendarDays className="size-3.5" aria-hidden />{p.durations.karachi.days} days from Karachi</span>}
        </div>
        {p.durations.islamabad && <p className="absolute bottom-3 left-4 text-xs font-medium text-white/90">or {p.durations.islamabad.days} days from Islamabad</p>}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl font-semibold leading-snug text-navy">
          <Link href={`/tours/${p.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">{p.title}</Link>
        </h3>
        {p.tagline && <p className="mt-2 text-sm leading-relaxed text-stone">{p.tagline}</p>}
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Highlights">
          {p.highlights.slice(0, 4).map((h) => <li key={h} className="chip text-[0.75rem]">{h}</li>)}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          {from ? (
            <p className="text-sm text-stone">
              From <span className="block font-display text-2xl font-semibold text-navy">{formatPKR(from.amount)}</span>
              <span className="text-xs">per person · {from.origin === "islamabad" ? "from Islamabad" : "from Karachi"}</span>
            </p>
          ) : <p className="text-sm text-stone">Ask for price</p>}
          <span className="inline-flex size-11 items-center justify-center rounded-full bg-amber text-night transition-transform group-hover:translate-x-1" aria-hidden><ArrowRight className="size-5" /></span>
        </div>
      </div>
    </article>
  );
}

export function DestinationCard({ d, className = "" }: { d: Destination; className?: string }) {
  return (
    <article className={`group relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-3xl p-6 text-white shadow-soft ${className}`}>
      <div className="absolute inset-0 -z-10">
        <Picture image={d.heroImage} alt={d.heroImage ? undefined : ""} sizes="(min-width:1024px) 33vw, 100vw" className="transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/30 to-transparent" />
      </div>
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-amber-300"><MapPin className="size-3.5" aria-hidden />{d.region}</p>
      <h3 className="mt-2 text-2xl font-semibold">
        <Link href={`/destinations/${d.id}`} className="after:absolute after:inset-0">{d.name}</Link>
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-white/80">{d.tagline}</p>
      <p className="mt-3 text-xs font-semibold">{d.customOnly ? "Custom trips" : `${d.packageIds.length} tour${d.packageIds.length === 1 ? "" : "s"} available`}</p>
    </article>
  );
}

export function CtaBand({ title, text, primary, secondary }: { title: string; text?: string; primary: { href: string; label: string; external?: boolean }; secondary?: { href: string; label: string; external?: boolean } }) {
  const A = ({ l, cls }: { l: { href: string; label: string; external?: boolean }; cls: string }) =>
    l.external ? <a href={l.href} target="_blank" rel="noopener noreferrer" className={cls}>{l.label}</a> : <Link href={l.href} className={cls}>{l.label}</Link>;
  return (
    <section className="container-x my-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-navy px-6 py-14 text-white sm:px-14">
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-amber/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-10 size-80 rounded-full bg-glacier/40 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="h-section text-balance">{title}</h2>
            {text && <p className="lede mt-3 text-white/75">{text}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <A l={primary} cls="btn btn-primary" />
            {secondary && <A l={secondary} cls="btn btn-ghost-light" />}
          </div>
        </div>
      </div>
    </section>
  );
}
