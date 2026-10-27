import type { Metadata } from "next";
import { CtaBand, DestinationCard, PageHero } from "@/components/site/Blocks";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { getDestinations } from "@/lib/content";
import { PHOTOS } from "@/content/seed/shared";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Destinations across Pakistan",
  description: "Hunza, Skardu, Naran & Kaghan, Kashmir's Neelum Valley, Swat, Kalash, Murree and Islamabad — group tours and customized trips with Pack & Go.",
  alternates: { canonical: "/destinations" },
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  const withTours = destinations.filter((d) => !d.customOnly);
  const custom = destinations.filter((d) => d.customOnly);
  return (
    <>
      <PageHero eyebrow="Destinations" title="Where we travel" subtitle="Our group tours cover Naran & Kaghan, Kashmir's Neelum Valley, Skardu and Hunza. For everywhere else in Pakistan, we plan customized trips." image={PHOTOS.meadowRiders} crumbs={[{ name: "Home", href: "/" }, { name: "Destinations", href: "/destinations" }]} />
      <section className="container-x py-16" aria-labelledby="dt-h">
        <h2 id="dt-h" className="h-section text-navy">With scheduled group tours</h2>
        <Stagger className="mt-8 grid auto-rows-[20rem] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {withTours.map((d) => <StaggerItem key={d.id}><DestinationCard d={d} className="h-full" /></StaggerItem>)}
        </Stagger>
      </section>
      {custom.length > 0 && (
        <section className="container-x pb-6" aria-labelledby="dc-h">
          <h2 id="dc-h" className="h-section text-navy">Customized trips</h2>
          <p className="lede mt-3 max-w-2xl text-stone">We don&apos;t run fixed packages here — tell us your dates and group and we&apos;ll plan the trip and quote it for you.</p>
          <Stagger className="mt-8 grid auto-rows-[18rem] gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {custom.map((d) => <StaggerItem key={d.id}><DestinationCard d={d} className="h-full" /></StaggerItem>)}
          </Stagger>
        </section>
      )}
      <CtaBand title="Combine destinations your way" text="Hunza with Skardu, Murree with Kashmir, or a family week in Swat — we'll build the route." primary={{ href: "/custom-tour", label: "Plan a custom trip" }} />
    </>
  );
}
