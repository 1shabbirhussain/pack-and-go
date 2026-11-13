import Link from "next/link";
import { ArrowRight, Flame, MapPin, Moon, Music, PartyPopper, Ship, Sparkles, Tent, Waves } from "lucide-react";
import type { Section } from "@/lib/schema";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Picture } from "@/components/ui/Picture";
import { SectionHeading } from "./Blocks";

const ICONS: Record<string, typeof Waves> = {
  waves: Waves, flame: Flame, ship: Ship, music: Music, moon: Moon, tent: Tent, sparkles: Sparkles, party: PartyPopper,
};

/* Deterministic star field so server and client render the same markup. */
const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 37.7) % 100,
  y: (i * 23.3) % 62,
  r: i % 5 === 0 ? 1.6 : i % 3 === 0 ? 1.1 : 0.7,
  d: (i % 7) * 0.6,
}));

/** "Night & beach parties" — Karachi and Hyderabad evening events. */
export function NightlifeSection({ s, whatsappHref }: { s: Section; whatsappHref: string }) {
  const primaryHref = s.ctaHref || whatsappHref;
  const external = /^https?:/.test(primaryHref);
  return (
    <section id={s.id} className="relative isolate scroll-mt-24 overflow-hidden bg-night py-20 text-white sm:py-28" aria-labelledby="night-h">
      {/* Night sky: gradient, stars, moon glow and the sea at the bottom */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgb(248_168_56/0.22),transparent_45%),radial-gradient(ellipse_at_10%_90%,rgb(43_113_143/0.45),transparent_55%),linear-gradient(180deg,#0b1020_0%,#141b29_55%,#10304a_100%)]" />
        {STARS.map((st, i) => (
          <span
            key={i}
            className="night-star absolute rounded-full bg-white"
            style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.r * 2, height: st.r * 2, animationDelay: `${st.d}s` }}
          />
        ))}
        <div className="absolute -right-6 -top-6 size-20 rounded-full bg-amber-300/80 shadow-[0_0_80px_30px_rgb(251_201_121/0.3)] sm:right-[8%] sm:top-12 sm:size-28 lg:size-32" />
        <svg className="absolute inset-x-0 bottom-0 h-28 w-full sm:h-40" preserveAspectRatio="none" viewBox="0 0 1440 160">
          <path d="M0 70 C 240 40 480 100 720 70 S 1200 40 1440 70 V160 H0Z" fill="rgb(43 113 143 / 0.35)" />
          <path d="M0 105 C 260 80 520 130 760 105 S 1220 80 1440 105 V160 H0Z" fill="rgb(31 88 112 / 0.55)" />
        </svg>
      </div>

      <div className="container-x">
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Reveal><SectionHeading id="night-h" eyebrow={s.eyebrow} title={s.title || "Night & beach parties"} subtitle={s.subtitle} light /></Reveal>
          <Reveal delay={0.1} className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href={primaryHref}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="btn btn-primary"
            >
              {external && <WhatsAppIcon className="size-4" />}
              {s.ctaLabel || "Book a party night"}
            </Link>
            {s.secondaryCtaLabel && (
              <Link href={s.secondaryCtaHref || "/custom-tour"} className="btn btn-ghost-light">
                {s.secondaryCtaLabel} <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((it, i) => {
            const Icon = ICONS[it.icon ?? ""] ?? Sparkles;
            return (
              <StaggerItem
                key={it.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white/[0.06] ring-1 ring-white/10 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.1]"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Picture
                    image={s.images[i]}
                    alt={s.images[i]?.alt || it.title}
                    sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent" />
                  {it.tag && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-night/70 px-3 py-1 text-xs font-medium text-amber-300 ring-1 ring-white/15 backdrop-blur">
                      <MapPin className="size-3.5" aria-hidden /> {it.tag}
                    </span>
                  )}
                </div>
                <div className="relative flex flex-1 flex-col px-6 pb-6">
                  <span className="relative -mt-6 inline-flex size-12 items-center justify-center rounded-2xl bg-amber text-night shadow-[0_8px_24px_-8px_rgb(248_168_56/0.8)] ring-4 ring-night">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-sans text-lg font-semibold leading-snug text-white">{it.title}</h3>
                  {it.text && <p className="mt-2 text-sm leading-relaxed text-white/70">{it.text}</p>}
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mt-10 text-sm text-white/60">
            Family-friendly events only. Venue, timings and prices depend on the date and group size — message us for a quote.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
