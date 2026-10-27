import type { Metadata } from "next";
import { PageHero } from "@/components/site/Blocks";
import { PolicyBlocks } from "@/components/site/PolicyBlocks";
import { getContact, getPolicies } from "@/lib/content";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Tour terms, cancellation & payment policy",
  description: "Pack & Go Tourism tour terms and conditions, cancellation deductions, kids policy, payment details and website terms.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const [p, contact] = await Promise.all([getPolicies(), getContact()]);
  return (
    <>
      <PageHero eyebrow="Policies" title="Tour terms & policies" subtitle={p.lastUpdated ? `Last updated ${p.lastUpdated}` : undefined} crumbs={[{ name: "Home", href: "/" }, { name: "Terms", href: "/terms" }]} />
      <div className="container-x max-w-3xl py-16">
        <nav aria-label="On this page" className="card mb-12 p-5 text-sm">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 font-semibold text-glacier-700">
            {[["#tour-terms", "Tour terms"], ["#cancellation", "Cancellation"], ["#kids", "Children"], ["#payment", "Payment"], ["#website", "Website terms"]].map(([h, l]) => <li key={h}><a href={h} className="hover:underline">{l}</a></li>)}
          </ul>
        </nav>
        <div id="tour-terms" className="scroll-mt-28"><PolicyBlocks blocks={p.tourTerms} /></div>
        <div id="cancellation" className="scroll-mt-28"><PolicyBlocks blocks={p.cancellation} /></div>
        <div id="kids" className="scroll-mt-28"><PolicyBlocks blocks={p.kids} /></div>
        <div id="payment" className="scroll-mt-28">
          <PolicyBlocks blocks={p.payment} />
          {contact.showBankDetails && contact.bankAccountNumber && (
            <div className="-mt-4 mb-10 rounded-2xl bg-navy p-6 text-white">
              <p className="text-xs uppercase tracking-[0.16em] text-amber-300">Bank account</p>
              <dl className="mt-3 grid gap-2 sm:grid-cols-3">
                <div><dt className="text-xs text-white/60">Bank</dt><dd className="font-semibold">{contact.bankName}</dd></div>
                <div><dt className="text-xs text-white/60">Account title</dt><dd className="font-semibold">{contact.bankAccountTitle}</dd></div>
                <div><dt className="text-xs text-white/60">Account number</dt><dd className="font-semibold tracking-wide">{contact.bankAccountNumber}</dd></div>
                {contact.bankIban && <div className="sm:col-span-3"><dt className="text-xs text-white/60">IBAN</dt><dd className="font-semibold">{contact.bankIban}</dd></div>}
              </dl>
              {contact.paymentNote && <p className="mt-4 text-sm text-white/80">{contact.paymentNote}</p>}
            </div>
          )}
        </div>
        <div id="website" className="scroll-mt-28"><PolicyBlocks blocks={p.websiteTerms} /></div>
      </div>
    </>
  );
}
