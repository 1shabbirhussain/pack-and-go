"use client";
/** Filterable, lazy-loaded gallery with an accessible lightbox (focus-trapped dialog, Esc / arrow keys). */
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/schema";
import { imageUrl } from "@/lib/media";
import { cx } from "@/lib/format";

export function GalleryGrid({ items, categories }: { items: GalleryItem[]; categories: string[] }) {
  const cats = useMemo(() => {
    const used = new Set(items.map((i) => i.category));
    const ordered = categories.filter((c) => used.has(c));
    for (const c of used) if (!ordered.includes(c)) ordered.push(c);
    return ordered;
  }, [items, categories]);
  const [cat, setCat] = useState<string>("All");
  const visible = cat === "All" ? items : items.filter((i) => i.category === cat);
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const show = (i: number) => { lastFocus.current = document.activeElement as HTMLElement; setOpen(i); };
  const close = useCallback(() => { setOpen(null); lastFocus.current?.focus(); }, []);
  const step = useCallback((d: number) => setOpen((o) => (o == null ? o : (o + d + visible.length) % visible.length)), [visible.length]);

  useEffect(() => {
    if (open == null) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, close, step]);

  const current = open != null ? visible[open] : null;

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {["All", ...cats].map((c) => (
          <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className={cx("rounded-full px-4 py-2 text-sm font-medium transition-colors", cat === c ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/15 hover:ring-navy/40")}>
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-stone">No photos in this category yet.</p>
      ) : (
        <ul className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
          {visible.map((g, i) => {
            const url = imageUrl(g.image);
            if (!url) return null;
            return (
              <li key={g.id} className="break-inside-avoid">
                <button type="button" onClick={() => show(i)} className="group relative block w-full overflow-hidden rounded-2xl bg-sand text-left shadow-soft" aria-label={`Open photo: ${g.title}`}>
                  <Image src={url} alt={g.image.alt} width={g.image.width ?? 1200} height={g.image.height ?? 800} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" loading="lazy" className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 to-transparent p-4 pt-10 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{g.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {current && (
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={`${current.title} — photo ${open! + 1} of ${visible.length}`} className="fixed inset-0 z-[80] flex flex-col bg-night/95 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="flex items-center justify-between p-3 text-white sm:p-5">
            <p className="text-sm text-white/70">{open! + 1} / {visible.length}</p>
            <button ref={closeRef} type="button" onClick={close} className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close photo"><X className="size-6" aria-hidden /></button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16" onClick={(e) => e.target === e.currentTarget && close()}>
            <Image src={imageUrl(current.image)!} alt={current.image.alt} width={current.image.width ?? 1600} height={current.image.height ?? 1000} sizes="100vw" className="max-h-full w-auto max-w-full rounded-lg object-contain" />
            <button type="button" onClick={() => step(-1)} className="absolute left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4" aria-label="Previous photo"><ChevronLeft className="size-6" aria-hidden /></button>
            <button type="button" onClick={() => step(1)} className="absolute right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4" aria-label="Next photo"><ChevronRight className="size-6" aria-hidden /></button>
          </div>
          <div className="p-4 text-center text-white sm:p-6">
            <p className="font-semibold">{current.title}</p>
            {current.caption && <p className="mt-1 text-sm text-white/70">{current.caption}</p>}
            {current.image.credit && <p className="mt-1 text-xs text-white/50">{current.image.credit}</p>}
          </div>
        </div>
      )}
    </>
  );
}
