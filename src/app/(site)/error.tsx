"use client";
import Link from "next/link";
import { useEffect } from "react";
import { CloudFog } from "lucide-react";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-28 text-center">
      <CloudFog className="size-12 text-glacier" aria-hidden />
      <h1 className="mt-4 text-4xl font-semibold text-navy">Something went wrong</h1>
      <p className="mt-3 max-w-md text-stone">A cloud rolled over this page. Please try again — if it keeps happening, contact us on WhatsApp.</p>
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={reset} className="btn btn-dark">Try again</button>
        <Link href="/" className="btn btn-outline">Home</Link>
      </div>
    </section>
  );
}
