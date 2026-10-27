"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cx } from "@/lib/format";

export interface NavTour { id: string; title: string; days: string }

const LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/custom-tour", label: "Custom tour" },
  { href: "/brochures", label: "Brochures" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ tours, whatsappHref, phoneHref, phoneDisplay, announcement, announcementHref }: { tours: NavTour[]; whatsappHref: string; phoneHref?: string; phoneDisplay?: string; announcement?: string; announcementHref?: string }) {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [toursOpen, setToursOpen] = useState(false);
  const toursRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setToursOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!toursOpen) return;
    const onDoc = (e: MouseEvent) => { if (!toursRef.current?.contains(e.target as Node)) setToursOpen(false); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setToursOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [toursOpen]);

  const solid = !overlay || scrolled || open;
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        solid ? "bg-navy/95 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.45)] backdrop-blur-md" : "bg-gradient-to-b from-night/70 to-transparent",
      )}
    >
      {announcement && (
        <div className="bg-amber px-4 py-1.5 text-center text-sm font-medium text-night">
          {announcementHref ? <Link className="underline underline-offset-2" href={announcementHref}>{announcement}</Link> : announcement}
        </div>
      )}
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
        <Logo variant="light" priority />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <div className="relative" ref={toursRef}>
            <button
              type="button"
              className={cx("flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.92rem] font-medium text-white/90 hover:bg-white/10 hover:text-white", isActive("/tours") && "text-amber-300")}
              aria-expanded={toursOpen}
              aria-controls="tours-menu"
              onClick={() => setToursOpen((v) => !v)}
            >
              Tours <ChevronDown className={cx("size-4 transition-transform", toursOpen && "rotate-180")} aria-hidden />
            </button>
            <div
              id="tours-menu"
              hidden={!toursOpen}
              className="absolute left-0 top-full mt-2 w-[22rem] rounded-2xl bg-white p-2 text-ink shadow-lift ring-1 ring-black/5"
            >
              <ul>
                {tours.map((t) => (
                  <li key={t.id}>
                    <Link href={`/tours/${t.id}`} className="flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-sand/70">
                      <span className="font-medium leading-snug">{t.title}</span>
                      <span className="shrink-0 text-xs text-stone">{t.days}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/tours" className="mt-1 block rounded-xl bg-navy px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-navy-800">
                Compare all tours
              </Link>
            </div>
          </div>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cx("rounded-full px-3.5 py-2 text-[0.92rem] font-medium text-white/90 hover:bg-white/10 hover:text-white", isActive(l.href) && "text-amber-300")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {phoneHref && (
            <a href={phoneHref} className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 xl:flex">
              <Phone className="size-4" aria-hidden /> {phoneDisplay}
            </a>
          )}
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm hidden sm:inline-flex">
            <WhatsAppIcon className="size-4" /> WhatsApp us
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-white hover:bg-white/10 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="h-[calc(100dvh-4.5rem)] overflow-y-auto bg-navy lg:hidden">
        <nav aria-label="Mobile" className="container-x flex flex-col gap-1 py-6">
          <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Tours</p>
          {tours.map((t) => (
            <Link key={t.id} href={`/tours/${t.id}`} className="flex items-center justify-between rounded-xl px-3 py-3 text-white hover:bg-white/10">
              <span>{t.title}</span>
              <span className="text-xs text-white/60">{t.days}</span>
            </Link>
          ))}
          <Link href="/tours" className="rounded-xl px-3 py-3 font-semibold text-amber-300 hover:bg-white/10">All tours →</Link>
          <div className="my-3 h-px bg-white/10" />
          {[...LINKS, { href: "/reviews", label: "Reviews" }, { href: "/faq", label: "FAQs" }].map((l) => (
            <Link key={l.href} href={l.href} className="rounded-xl px-3 py-3 text-lg text-white hover:bg-white/10">
              {l.label}
            </Link>
          ))}
          <div className="mt-4 grid gap-3">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><WhatsAppIcon className="size-5" /> Chat on WhatsApp</a>
            {phoneHref && <a href={phoneHref} className="btn btn-ghost-light"><Phone className="size-5" aria-hidden /> Call {phoneDisplay}</a>}
          </div>
        </nav>
      </div>
    </header>
  );
}
