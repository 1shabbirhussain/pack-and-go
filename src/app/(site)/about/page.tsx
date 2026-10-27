import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Compass, HeartHandshake, MapPinned } from "lucide-react";
import { CtaBand, PageHero } from "@/components/site/Blocks";
import { Reveal } from "@/components/ui/Motion";
import { Picture } from "@/components/ui/Picture";
import { getContact, getDestinations, getPackages, getSiteSettings } from "@/lib/content";
import { PHOTOS } from "@/content/seed/shared";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "About Pack & Go Tourism",
  description: "Pack & Go Tourism is a travel company based in Hyderabad, Sindh, with an office in Karachi, running family-oriented group tours to northern Pakistan and customized trips nationwide.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [site, contact, packages, destinations] = await Promise.all([getSiteSettings(), getContact(), getPackages(), getDestinations()]);
  const offices = contact.offices.filter((o) => o.public);
  return (
    <>
      <PageHero eyebrow="About us" title="Travel that families can enjoy together" subtitle={site.description} image={PHOTOS.meadowRiders} crumbs={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
      <section className="container-x grid items-center gap-14 py-20 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Who we are</p>
          <h2 className="h-section mt-3 text-navy">From Sindh to the mountains of the north</h2>
          <div className="prose-pg mt-6 text-[1.05rem] text-ink">
            <p>Pack &amp; Go Tourism is a travel and tour company based in Hyderabad, Sindh{offices.some((o) => o.city === "Karachi") ? ", with an office in Karachi" : ""}. We organise group tours from Karachi and Islamabad to the northern areas of Pakistan, and customized trips to destinations across the country.</p>
            <p>Our scheduled tours — {packages.map((p, i) => <span key={p.id}>{i > 0 && (i === packages.length - 1 ? " and " : ", ")}<Link className="font-semibold text-navy underline underline-offset-2" href={`/tours/${p.id}`}>{p.title}</Link></span>)} — include breakfast and dinner, hotel stays, transport, toll taxes and the services of a guide, with prices published by departure city and transport option.</p>
            <p>Our aim is simple{site.tagline ? <>: <em>{site.tagline.toLowerCase()}</em></> : ""}.</p>
          </div>
        </Reveal>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift"><Picture image={PHOTOS.resortPagoda} sizes="(min-width:1024px) 45vw, 100vw" /></div>
      </section>

      <section className="bg-sand/50 py-20">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Compass, title: "Customized tours", text: "Trips planned around your group, dates and budget." },
            { icon: HeartHandshake, title: "Personalized service", text: "Talk to our team directly on WhatsApp or by phone." },
            { icon: MapPinned, title: `${destinations.length} destinations`, text: "From the Karakoram to the hills near Islamabad." },
            { icon: Building2, title: `${offices.length} office${offices.length === 1 ? "" : "s"}`, text: offices.map((o) => o.city).join(" & ") || "Hyderabad, Sindh" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <Icon className="size-7 text-glacier" aria-hidden />
              <h3 className="mt-4 font-sans text-lg font-semibold text-navy">{title}</h3>
              <p className="mt-1.5 text-sm text-stone">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <CtaBand title="Let's plan your next trip" text="Choose a tour or tell us about the journey you have in mind." primary={{ href: "/tours", label: "Explore tours" }} secondary={{ href: "/contact", label: "Contact us" }} />
    </>
  );
}
