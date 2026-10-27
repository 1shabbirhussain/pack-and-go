import Link from "next/link";
import { Compass } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy px-6 text-center text-white">
      <div className="absolute left-6 top-6"><Logo /></div>
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-1/3 w-full" aria-hidden="true">
        <path d="M0 230 L140 150 L250 200 L380 90 L500 180 L620 70 L760 190 L880 120 L1010 200 L1140 80 L1280 170 L1440 120 V320 H0Z" fill="#141b29" />
      </svg>
      <Compass className="relative size-14 text-amber" aria-hidden />
      <p className="relative mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Error 404</p>
      <h1 className="relative mt-3 text-[clamp(2.2rem,6vw,4rem)] font-semibold leading-tight">Looks like this trail ends here</h1>
      <p className="relative mt-4 max-w-md text-white/75">The page you&apos;re looking for has moved or doesn&apos;t exist. Let&apos;s get you back on route.</p>
      <div className="relative mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">Back to home</Link>
        <Link href="/tours" className="btn btn-ghost-light">Browse tours</Link>
      </div>
    </main>
  );
}
