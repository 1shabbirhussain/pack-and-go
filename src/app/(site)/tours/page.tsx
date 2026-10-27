import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CtaBand, TourCard, startingPrice } from "@/components/site/Blocks";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { getPackages } from "@/lib/content";
import { formatPKR } from "@/lib/format";
import { PHOTOS } from "@/content/seed/shared";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Tour packages from Karachi & Islamabad",
  description: "Compare Pack & Go group tours to Naran, Kashmir, Hunza and Skardu — durations from Karachi and Islamabad, starting prices and highlights.",
  alternates: { canonical: "/tours" },
};

export default async function ToursPage() {
  const packages = await getPackages();
  return (
    <>
      <PageHero
        eyebrow="Group tours"
        title="Tour packages"
        subtitle="Every tour departs from Karachi by train or bus — or join from Islamabad for a shorter trip at a lower price. Breakfast, dinner, hotels, transport and a guide are included."
        image={PHOTOS.snowPeaksReflection}
        crumbs={[{ name: "Home", href: "/" }, { name: "Tours", href: "/tours" }]}
      />
      <section className="container-x py-16" aria-label="All tours">
        {packages.length === 0 ? (
          <p className="card p-8 text-center text-stone">No tours are published right now. Please <Link className="font-semibold text-navy underline" href="/contact">contact us</Link> for upcoming departures.</p>
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {packages.map((p, i) => <StaggerItem key={p.id}><TourCard p={p} priority={i < 2} /></StaggerItem>)}
          </Stagger>
        )}
      </section>

      {packages.length > 0 && (
        <section className="container-x pb-8" aria-labelledby="compare-h">
          <h2 id="compare-h" className="h-section text-navy">Compare at a glance</h2>
          <div className="relative mt-8 overflow-x-auto rounded-2xl bg-white shadow-soft ring-1 ring-navy/5">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">Tour comparison: durations, nights and starting prices</caption>
              <thead className="bg-navy text-white">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold">Tour</th>
                  <th scope="col" className="px-5 py-4 font-semibold">From Karachi</th>
                  <th scope="col" className="px-5 py-4 font-semibold">From Islamabad</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Starting price*</th>
                  <th scope="col" className="px-5 py-4"><span className="sr-only">Details</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {packages.map((p) => {
                  const from = startingPrice(p);
                  const khi = p.priceOptions.filter((o) => o.origin === "karachi" && o.status === "published" && o.perPerson != null).sort((a, b) => a.perPerson! - b.perPerson!)[0];
                  return (
                    <tr key={p.id} className="align-top">
                      <th scope="row" className="px-5 py-4 font-semibold text-navy">{p.title}</th>
                      <td className="px-5 py-4">{p.durations.karachi ? `${p.durations.karachi.days} days` : "—"}{khi && <span className="block text-xs text-stone">from {formatPKR(khi.perPerson)} pp</span>}</td>
                      <td className="px-5 py-4">{p.durations.islamabad ? `${p.durations.islamabad.days} days` : "—"}</td>
                      <td className="px-5 py-4 font-semibold">{from ? formatPKR(from.amount) : "Ask us"}</td>
                      <td className="px-5 py-4"><Link href={`/tours/${p.id}`} className="font-semibold text-glacier-700 underline-offset-2 hover:underline">View tour</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-stone">*Lowest published per-person price (usually the Islamabad option), as listed in our April 2026 brochures. Please confirm current prices with our team.</p>
        </section>
      )}

      <CtaBand title="Don't see the trip you want?" text="We plan customized tours anywhere in Pakistan — Swat, Kalash, Murree and beyond." primary={{ href: "/custom-tour", label: "Plan a custom trip" }} secondary={{ href: "/brochures", label: "Read the brochures" }} />
    </>
  );
}
