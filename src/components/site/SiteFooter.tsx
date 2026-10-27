import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { FacebookIcon, InstagramIcon, RidgeLines, WhatsAppIcon } from "@/components/ui/icons";
import type { ContactSettings, SiteSettings } from "@/lib/schema";
import { telLink, whatsappLink } from "@/lib/whatsapp";

export function SiteFooter({ contact, site, tours }: { contact: ContactSettings; site: SiteSettings; tours: { id: string; title: string }[] }) {
  const phones = contact.phones.filter((p) => p.public);
  const emails = contact.emails.filter((e) => e.public);
  const offices = contact.offices.filter((o) => o.public);
  return (
    <footer className="relative mt-24 bg-night text-white/80">
      <RidgeLines className="absolute -top-[79px] h-20 w-full" tone="#141b29" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Logo variant="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">{site.description}</p>
          {site.tagline && <p className="mt-4 font-display text-lg italic text-amber-300">“{site.tagline}”</p>}
          <div className="mt-6 flex gap-3">
            {contact.instagramUrl && (
              <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Pack & Go on Instagram" className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><InstagramIcon className="size-5" /></a>
            )}
            {contact.facebookUrl && (
              <a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Pack & Go on Facebook" className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><FacebookIcon className="size-5" /></a>
            )}
            <a href={whatsappLink(contact.whatsappNumber)} target="_blank" rel="noopener noreferrer" aria-label="Pack & Go on WhatsApp" className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><WhatsAppIcon className="size-5" /></a>
          </div>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">Tours</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {tours.map((t) => (
              <li key={t.id}><Link className="hover:text-white" href={`/tours/${t.id}`}>{t.title}</Link></li>
            ))}
            <li><Link className="hover:text-white" href="/custom-tour">Customized tours</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[["/destinations", "Destinations"], ["/brochures", "Brochures"], ["/gallery", "Gallery"], ["/reviews", "Reviews"], ["/faq", "FAQs"], ["/about", "About us"], ["/contact", "Contact"], ["/terms", "Tour terms & policies"], ["/privacy", "Privacy"]].map(([href, label]) => (
              <li key={href}><Link className="hover:text-white" href={href}>{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {phones.map((p) => (
              <li key={p.e164}><a href={telLink(p.e164)} className="inline-flex items-center gap-2 hover:text-white"><Phone className="size-4 text-amber-300" aria-hidden />{p.display}</a></li>
            ))}
            {emails.map((e) => (
              <li key={e.address}><a href={`mailto:${e.address}`} className="inline-flex items-center gap-2 break-all hover:text-white"><Mail className="size-4 shrink-0 text-amber-300" aria-hidden />{e.address}</a></li>
            ))}
            {offices.map((o) => (
              <li key={o.id} className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden /><span><span className="font-medium text-white">{o.city}:</span> {o.addressLines.join(", ")}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.siteName}. All rights reserved.</p>
          {contact.showBankDetails && contact.bankAccountTitle && (
            <p>For your safety: only pay into the account titled <strong className="text-white/80">{contact.bankAccountTitle}</strong>, after confirming with our team.</p>
          )}
        </div>
      </div>
    </footer>
  );
}
