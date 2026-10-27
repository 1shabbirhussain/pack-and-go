import type { Metadata } from "next";
import { PageHero } from "@/components/site/Blocks";
import { ContactPanel } from "@/components/site/ContactPanel";
import { getContact } from "@/lib/content";
import { PHOTOS } from "@/content/seed/shared";
import Link from "next/link";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Contact Pack & Go Tourism",
  description: "Call or WhatsApp Pack & Go Tourism, or visit our offices in Hyderabad (Hiqa Tower, Autobahn Road) and Karachi (Hussain Mansion, Paper Market).",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const contact = await getContact();
  return (
    <>
      <PageHero eyebrow="Contact" title="We'd love to hear your travel dreams" subtitle="Message us on WhatsApp, call, email, or visit one of our offices." image={PHOTOS.resortPagoda} crumbs={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} />
      <section className="container-x py-16">
        <ContactPanel contact={contact} />
        <div className="mt-10 card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <p className="text-navy"><strong>Planning a custom trip?</strong> Our trip planner collects everything we need to quote you quickly.</p>
          <Link href="/custom-tour" className="btn btn-primary">Open the trip planner</Link>
        </div>
      </section>
    </>
  );
}
