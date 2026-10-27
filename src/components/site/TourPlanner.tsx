"use client";
/**
 * Interactive part of a tour page: departure-city toggle, transport option, travellers,
 * filtered itinerary and a WhatsApp link pre-filled with those choices.
 * Only departure cities and transport options present in the package data are offered.
 */
import Link from "next/link";
import { useId, useMemo, useState, type ReactNode } from "react";
import { BedDouble, CalendarDays, Info, MapPin, Minus, Plus, Send, Utensils } from "lucide-react";
import type { OriginKey, TourPackage } from "@/lib/schema";
import { ORIGIN_LABELS, cx, formatPKR } from "@/lib/format";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";

type Origin = Extract<OriginKey, "karachi" | "islamabad">;

export function TourPlanner({ pkg, whatsappNumber, greeting, children }: { pkg: TourPackage; whatsappNumber: string; greeting: string; children?: ReactNode }) {
  const origins = (["karachi", "islamabad"] as Origin[]).filter((o) => pkg.durations[o] || pkg.priceOptions.some((p) => p.origin === o));
  const [origin, setOrigin] = useState<Origin>(origins[0] ?? "karachi");
  const options = useMemo(
    () => pkg.priceOptions.filter((o) => o.origin === origin && o.status === "published"),
    [pkg.priceOptions, origin],
  );
  const [optionId, setOptionId] = useState<string>(options[0]?.id ?? "");
  const option = options.find((o) => o.id === optionId) ?? options[0];
  const [adults, setAdults] = useState(2);
  const [children_, setChildren] = useState(0);
  const [month, setMonth] = useState("");
  const groupId = useId();

  const days = pkg.itinerary.filter((d) => d.audience === "all" || d.audience === origin);
  const duration = pkg.durations[origin];

  const message = buildWhatsAppMessage({
    greeting,
    tour: pkg.title,
    departureCity: ORIGIN_LABELS[origin],
    transport: origin === "karachi" && option ? option.label : undefined,
    adults,
    children: children_,
    month: month || undefined,
  });
  const wa = whatsappLink(whatsappNumber, message);
  const inquiryHref = `/custom-tour?package=${encodeURIComponent(pkg.id)}&from=${origin}${option ? `&transport=${encodeURIComponent(option.label)}` : ""}&adults=${adults}&children=${children_}`;

  const switchOrigin = (o: Origin) => {
    setOrigin(o);
    const first = pkg.priceOptions.find((p) => p.origin === o && p.status === "published");
    setOptionId(first?.id ?? "");
  };

  return (
    <div className="container-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
      <div className="min-w-0">
        {/* Departure toggle */}
        {origins.length > 1 && (
          <fieldset className="mb-10">
            <legend className="text-sm font-semibold text-navy">Departing from</legend>
            <div className="mt-3 inline-flex rounded-full bg-white p-1.5 shadow-soft ring-1 ring-navy/10" role="radiogroup">
              {origins.map((o) => {
                const d = pkg.durations[o];
                const checked = origin === o;
                return (
                  <label key={o} className={cx("relative cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors", checked ? "bg-navy text-white" : "text-navy hover:bg-sand")}>
                    <input type="radio" name={`${groupId}-origin`} value={o} checked={checked} onChange={() => switchOrigin(o)} className="sr-only" />
                    {ORIGIN_LABELS[o]}{d ? ` · ${d.days} days` : ""}
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        <a href="#booking" className="btn btn-outline btn-sm mb-6 lg:hidden">See prices &amp; book ↓</a>

        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: CalendarDays, k: "Duration", v: duration ? `${duration.days} days` : "—" },
            { icon: BedDouble, k: "Hotel nights", v: duration?.nights != null ? `${duration.nights}` : "Ask us" },
            { icon: Utensils, k: "Meals", v: "Breakfast & dinner" },
            { icon: MapPin, k: "Starts", v: origin === "karachi" ? "Karachi" : "Islamabad" },
          ].map(({ icon: Icon, k, v }) => (
            <div key={k} className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-navy/5">
              <Icon className="size-5 text-glacier" aria-hidden />
              <dt className="mt-2 text-xs uppercase tracking-wider text-stone">{k}</dt>
              <dd className="font-semibold text-navy">{v}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-14" aria-labelledby="itinerary-h">
          <h2 id="itinerary-h" className="h-section text-navy">Day-by-day itinerary</h2>
          <p className="mt-2 text-stone">
            {origin === "islamabad"
              ? "Showing the plan for travellers joining in Islamabad. Karachi travel days are not included."
              : "Showing the full plan for travellers departing from Karachi."}
          </p>
          <ol className="relative mt-10 space-y-6">
            <span aria-hidden className="absolute bottom-4 left-[1.35rem] top-4 w-px border-l-2 border-dashed border-amber-700/40" />
            {days.map((d, i) => (
              <li key={`${d.day}-${d.title}`} className="relative pl-16">
                <span className="absolute left-0 top-0 inline-flex size-11 flex-col items-center justify-center rounded-full bg-navy text-white ring-8 ring-snow">
                  <span className="text-[0.55rem] uppercase leading-none tracking-widest text-amber-300">Day</span>
                  <span className="text-base font-bold leading-none">{i + 1}</span>
                </span>
                <article className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy/5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-sans text-lg font-semibold text-navy">{d.title}</h3>
                    {d.audience === "karachi" && <span className="chip bg-glacier-100 text-glacier-700">Karachi travellers</span>}
                  </div>
                  <ul className="mt-3 space-y-2">
                    {d.items.map((it, j) => (
                      <li key={j} className="flex gap-2.5 text-[0.95rem] leading-relaxed text-ink">
                        <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-amber" />
                        <span>
                          {it.text}
                          {it.optional && <span className="ml-2 rounded-full bg-amber/20 px-2 py-0.5 text-xs font-semibold text-amber-700">Optional · paid locally</span>}
                          {it.note && <span className="block text-xs text-stone">{it.note}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {(d.overnight || d.meals) && (
                    <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-navy/10 pt-3 text-sm text-stone">
                      {d.overnight && <span><BedDouble className="mr-1.5 inline size-4 text-glacier" aria-hidden />Overnight: <strong className="font-semibold text-navy">{d.overnight}</strong></span>}
                      {d.meals && <span><Utensils className="mr-1.5 inline size-4 text-glacier" aria-hidden />{d.meals}</span>}
                    </p>
                  )}
                </article>
              </li>
            ))}
          </ol>
        </section>

        {children}
      </div>

      {/* Booking panel */}
      <aside id="booking" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start" aria-labelledby="booking-h">
        <div className="card overflow-hidden">
          <div className="bg-navy px-6 py-5 text-white">
            <h2 id="booking-h" className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">Prices & booking</h2>
            <p className="mt-1 text-sm text-white/75">From {ORIGIN_LABELS[origin]}{duration ? ` · ${duration.days} days` : ""}</p>
          </div>
          <div className="p-6">
            {options.length ? (
              <fieldset>
                <legend className="text-sm font-semibold text-navy">{origin === "karachi" ? "Choose your transport" : "Package price"}</legend>
                <div className="mt-3 space-y-2">
                  {options.map((o) => (
                    <label key={o.id} className={cx("flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 px-3.5 py-3 transition-colors", (option?.id === o.id) ? "border-amber bg-amber/10" : "border-navy/10 hover:border-navy/25")}>
                      <span className="flex items-center gap-3">
                        <input type="radio" name={`${groupId}-opt`} value={o.id} checked={option?.id === o.id} onChange={() => setOptionId(o.id)} className="size-4 accent-[#232a3a]" />
                        <span className="text-sm font-medium text-navy">{o.label}</span>
                      </span>
                      <span className="text-right">
                        <span className="block font-semibold text-navy">{formatPKR(o.perPerson)}</span>
                        <span className="block text-xs text-stone">pp · {formatPKR(o.perCouple)} couple</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <p className="text-sm text-stone">Prices for this departure are available on request.</p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Counter label="Adults" value={adults} min={1} max={60} onChange={setAdults} />
              <Counter label="Children" value={children_} min={0} max={30} onChange={setChildren} />
            </div>
            <label className="mt-4 block">
              <span className="field-label">Preferred month or dates <span className="font-normal text-stone">(optional)</span></span>
              <input className="field-input" value={month} onChange={(e) => setMonth(e.target.value.slice(0, 40))} placeholder="e.g. July 2026" />
            </label>

            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6 w-full">
              <WhatsAppIcon className="size-5" /> Ask on WhatsApp
            </a>
            <p className="mt-2 text-center text-xs text-stone">Opens WhatsApp with your choices pre-filled. Nothing is sent until you press send.</p>
            <Link href={inquiryHref} className="btn btn-outline mt-3 w-full"><Send className="size-4" aria-hidden /> Send an inquiry instead</Link>

            <p className="mt-5 flex gap-2 rounded-xl bg-sand/60 p-3 text-xs leading-relaxed text-stone">
              <Info className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden />
              <span>{pkg.priceValidity || "Please confirm prices and dates with our team before booking."} Children: see the kids policy below.</span>
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-stone">{option ? option.label : ORIGIN_LABELS[origin]}</p>
            <p className="font-semibold text-navy">{option ? `${formatPKR(option.perPerson)} pp` : "Ask for price"}</p>
          </div>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm"><WhatsAppIcon className="size-4" /> WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

function Counter({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const id = useId();
  return (
    <div>
      <span id={id} className="field-label">{label}</span>
      <div className="flex items-center justify-between rounded-xl border-2 border-navy/10 px-1.5 py-1" role="group" aria-labelledby={id}>
        <button type="button" className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-sand disabled:opacity-40" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label.toLowerCase()}`}><Minus className="size-4" aria-hidden /></button>
        <output aria-live="polite" className="w-8 text-center font-semibold text-navy">{value}</output>
        <button type="button" className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-sand disabled:opacity-40" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label.toLowerCase()}`}><Plus className="size-4" aria-hidden /></button>
      </div>
    </div>
  );
}
