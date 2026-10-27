import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/Blocks";
import { InquiryForm } from "@/components/site/InquiryForm";
import { getContact, getDestinations, getPackages } from "@/lib/content";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { ORIGIN_LABELS } from "@/lib/format";
import { PHOTOS } from "@/content/seed/shared";

export const metadata: Metadata = {
  title: "Plan a customized tour in Pakistan",
  description: "Tell Pack & Go where you want to go, when, and who's travelling. We plan customized trips anywhere in Pakistan — Hunza, Skardu, Naran, Kashmir, Swat, Kalash and more.",
  alternates: { canonical: "/custom-tour" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function CustomTourPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const [destinations, packages, contact] = await Promise.all([getDestinations(), getPackages()  , getContact()]);
  const pkg = packages.find((p) => p.id === one(sp.package));
  const dest = destinations.find((d) => d.id === one(sp.destination));
  const from = one(sp.from);
  const n = (v: string, d: number, max: number) => { const x = parseInt(v, 10); return Number.isFinite(x) ? Math.max(0, Math.min(max, x)) : d; };
  const initial = {
    packageId: pkg?.id ?? "",
    destinations: dest ? [dest.id] : pkg ? pkg.destinationIds.filter((id) => destinations.some((d) => d.id === id)) : [],
    departureCity: from === "karachi" ? "Karachi" : from === "islamabad" ? "Islamabad / Rawalpindi" : ORIGIN_LABELS[from] ?? "",
    transport: one(sp.transport).slice(0, 80),
    adults: Math.max(1, n(one(sp.adults), 2, 200)),
    children: n(one(sp.children), 0, 100),
  };
  return (
    <>
      <PageHero eyebrow="Customized tours" title="Plan your own journey" subtitle="Share where you'd like to go, when, and who's coming. We'll design the route, arrange stays and transport, and send you a quote." image={PHOTOS.autumnRoad} crumbs={[{ name: "Home", href: "/" }, { name: "Custom tour", href: "/custom-tour" }]} />
      <section className="container-x grid gap-10 py-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <InquiryForm
          destinations={destinations.map((d) => ({ id: d.id, name: d.name }))}
          packages={packages.map((p) => ({ id: p.id, title: p.title }))}
          whatsappNumber={contact.whatsappNumber}
          greeting={contact.whatsappGreeting}
          initial={initial}
          configured={isFirebaseConfigured}
        />
        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="font-sans text-lg font-semibold text-navy">What happens next</h2>
            <ol className="mt-4 space-y-4 text-sm text-stone">
              {[
                "Your inquiry is saved securely and appears in our team’s inquiry inbox.",
                "We contact you on WhatsApp, by phone or email — whichever you prefer.",
                "We share a suggested itinerary and price for your group.",
                "You confirm, and pay only into the account titled PACK AND GO.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3"><span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">{i + 1}</span>{t}</li>
              ))}
            </ol>
          </div>
          <div className="card p-6">
            <h2 className="font-sans text-lg font-semibold text-navy">Popular custom ideas</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {["Hunza & Skardu by air", "Family week in Swat & Kalam", "Kalash valleys & Chitral", "Murree & Galyat weekend", "Honeymoon in the north", "School, university or office groups"].map((t) => (
                <li key={t} className="flex gap-2"><CheckCircle2 className="size-4 shrink-0 text-pine" aria-hidden />{t}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
