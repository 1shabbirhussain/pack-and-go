import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/site/Blocks";
import { FaqList } from "@/components/site/FaqList";
import { getFaqs } from "@/lib/content";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import { PHOTOS } from "@/content/seed/shared";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "Booking, payment, inclusions, jeep charges, kids policy, meals, packing, cancellations and travel notes for Pack & Go tours.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  const groups = Array.from(new Set(faqs.map((f) => f.category)));
  return (
    <>
      <PageHero eyebrow="FAQs" title="Good to know before you go" image={PHOTOS.pineFootbridge} crumbs={[{ name: "Home", href: "/" }, { name: "FAQs", href: "/faq" }]} />
      <section className="container-x max-w-4xl py-16">
        {groups.map((g) => (
          <div key={g} className="mb-12">
            <h2 className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">{g}</h2>
            <FaqList faqs={faqs.filter((f) => f.category === g)} />
          </div>
        ))}
        {faqs.length === 0 && <p className="text-stone">No FAQs yet.</p>}
      </section>
      <CtaBand title="Still have a question?" text="Ask us on WhatsApp or by phone — we're happy to help." primary={{ href: "/contact", label: "Contact us" }} />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}
    </>
  );
}
