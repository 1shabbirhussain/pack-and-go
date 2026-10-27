"use client";
/**
 * Cinematic homepage hero: slow cross-fading landscapes with layered ridge silhouettes that
 * drift at different speeds on scroll (parallax). Fully static when reduced motion is requested.
 */
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Compass, MapPin, Utensils } from "lucide-react";
import type { ImageRef } from "@/lib/schema";
import { imageUrl } from "@/lib/media";

const ICONS: Record<string, typeof MapPin> = { "map-pin": MapPin, utensils: Utensils, compass: Compass };

export interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  images: ImageRef[];
  chips: { title: string; icon?: string }[];
}

export function Hero({ eyebrow, title, subtitle, primary, secondary, images, chips }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Only honour the media query after hydration so server and client markup match.
  const reduce = mounted && Boolean(prefersReduced);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const yFar = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);
  const yNear = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-28%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  const slides = images.filter((i) => imageUrl(i));
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (reduce || slides.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [reduce, slides.length]);

  const words = title.split(" ");

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-night text-white" aria-labelledby="hero-title">
      <m.div className="absolute inset-0 -z-20 will-change-transform" style={{ y: yImg }}>
        {slides.map((img, i) => (
          <div key={imageUrl(img)} className="absolute inset-0 transition-opacity duration-[2000ms] ease-out" style={{ opacity: i === idx ? 1 : 0 }} aria-hidden={i !== idx}>
            <Image
              src={imageUrl(img)!}
              alt={i === 0 ? img.alt : ""}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${reduce ? "" : "animate-[kenburns_22s_ease-out_infinite_alternate]"}`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/25 to-night/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgb(20_27_41/0.65),transparent_60%)]" />
      </m.div>

      {/* Layered ridges for depth */}
      <m.svg style={{ y: yFar }} viewBox="0 0 1440 320" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[38vh] w-full" aria-hidden="true">
        <path d="M0 230 L140 150 L250 200 L380 90 L500 180 L620 70 L760 190 L880 120 L1010 200 L1140 80 L1280 170 L1440 120 V320 H0Z" fill="#232a3a" opacity="0.55" />
      </m.svg>
      <m.svg style={{ y: yNear }} viewBox="0 0 1440 320" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 -bottom-6 -z-10 h-[30vh] w-full" aria-hidden="true">
        <path d="M0 270 L170 200 L300 250 L450 170 L600 240 L760 180 L920 260 L1060 190 L1220 250 L1340 210 L1440 240 V320 H0Z" fill="#141b29" opacity="0.85" />
      </m.svg>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 -bottom-px h-14 w-full" aria-hidden="true">
        <path d="M0 60 L200 30 L360 52 L560 18 L760 50 L940 26 L1120 54 L1300 30 L1440 48 V80 H0Z" fill="#fff8ee" />
      </svg>

      <m.div style={{ y: yText, opacity: fade }} className="container-x relative pb-28 pt-40 sm:pb-36">
        {eyebrow && (
          <m.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="eyebrow eyebrow-light">
            {eyebrow}
          </m.p>
        )}
        <h1 id="hero-title" className="h-display mt-5 max-w-5xl text-balance">
          {words.map((w, i) => (
            <m.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: "0.4em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              {i === words.length - 1 ? <em className="font-display not-italic text-amber-300 [font-style:italic]">{w}</em> : w}
              {i < words.length - 1 ? " " : ""}
            </m.span>
          ))}
        </h1>
        {subtitle && (
          <m.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.6 }} className="lede mt-6 max-w-2xl text-pretty text-white/85">
            {subtitle}
          </m.p>
        )}
        <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8 }} className="mt-9 flex flex-wrap gap-3">
          {primary && <Link href={primary.href} className="btn btn-primary">{primary.label}</Link>}
          {secondary && <Link href={secondary.href} className="btn btn-ghost-light">{secondary.label}</Link>}
        </m.div>
        {chips.length > 0 && (
          <m.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.1 }} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/85">
            {chips.map((c) => {
              const Icon = ICONS[c.icon ?? ""] ?? Compass;
              return (
                <li key={c.title} className="flex items-center gap-2">
                  <Icon className="size-4 text-amber-300" aria-hidden /> {c.title}
                </li>
              );
            })}
          </m.ul>
        )}
      </m.div>

      <a href="#tours" className="absolute bottom-16 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white sm:flex" aria-label="Scroll to tours">
        Scroll
        <ChevronDown className="size-5 motion-safe:animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
