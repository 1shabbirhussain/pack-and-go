import { Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import type { ContactSettings } from "@/lib/schema";
import { buildWhatsAppMessage, telLink, whatsappLink } from "@/lib/whatsapp";
import { MapFacade } from "./MapFacade";

export function ContactPanel({ contact, showMaps = true }: { contact: ContactSettings; showMaps?: boolean }) {
  const phones = contact.phones.filter((p) => p.public);
  const emails = contact.emails.filter((e) => e.public);
  const offices = contact.offices.filter((o) => o.public);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="card p-6 sm:p-8">
        <h3 className="text-2xl font-semibold text-navy">Talk to our team</h3>
        <p className="mt-2 text-stone">The quickest way to reach us is WhatsApp. Opening WhatsApp starts a chat — nothing is sent until you press send.</p>
        <a href={whatsappLink(contact.whatsappNumber, buildWhatsAppMessage({ greeting: contact.whatsappGreeting }))} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6 w-full sm:w-auto">
          <WhatsAppIcon className="size-5" /> Chat on WhatsApp
        </a>
        <ul className="mt-8 space-y-4">
          {phones.map((p) => (
            <li key={p.e164} className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-sand"><Phone className="size-4 text-navy" aria-hidden /></span>
              <div>
                <a href={telLink(p.e164)} className="font-semibold text-navy hover:underline">{p.display}</a>
                {p.label && <p className="text-xs text-stone">{p.label}</p>}
              </div>
            </li>
          ))}
          {emails.map((e) => (
            <li key={e.address} className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-sand"><Mail className="size-4 text-navy" aria-hidden /></span>
              <a href={`mailto:${e.address}`} className="break-all font-semibold text-navy hover:underline">{e.address}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {offices.map((o) => (
          <div key={o.id} className="card flex flex-col gap-4 p-5">
            <div className="flex gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-amber/90"><MapPin className="size-4 text-night" aria-hidden /></span>
              <div>
                <h3 className="font-sans text-base font-semibold text-navy">{o.name}</h3>
                <address className="mt-1 text-sm not-italic leading-relaxed text-stone">
                  {o.addressLines.map((l) => <span key={l} className="block">{l}</span>)}
                </address>
                {o.hours && <p className="mt-1 text-xs text-stone">{o.hours}</p>}
              </div>
            </div>
            {showMaps && o.mapsQuery && <MapFacade query={o.mapsQuery} title={o.name} />}
          </div>
        ))}
      </div>
    </div>
  );
}
