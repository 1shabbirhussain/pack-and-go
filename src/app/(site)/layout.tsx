import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { MotionProvider } from "@/components/ui/Motion";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { getContact, getPackages, getSiteSettings } from "@/lib/content";
import { buildWhatsAppMessage, telLink, whatsappLink } from "@/lib/whatsapp";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [contact, site, packages] = await Promise.all([getContact(), getSiteSettings(), getPackages()]);
  const tours = packages.map((p) => ({
    id: p.id,
    title: p.title,
    days: [p.durations.karachi && `${p.durations.karachi.days}d Karachi`, p.durations.islamabad && `${p.durations.islamabad.days}d Islamabad`].filter(Boolean).join(" · "),
  }));
  const wa = whatsappLink(contact.whatsappNumber, buildWhatsAppMessage({ greeting: contact.whatsappGreeting }));
  const firstPhone = contact.phones.find((p) => p.public && p.call);
  return (
    <MotionProvider>
      <noscript>
        <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteHeader announcement={site.announcement} announcementHref={site.announcementHref} tours={tours} whatsappHref={wa} phoneHref={firstPhone ? telLink(firstPhone.e164) : undefined} phoneDisplay={firstPhone?.display} />
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <SiteFooter contact={contact} site={site} tours={tours} />
      <WhatsAppFab href={wa} />
      <JsonLd data={organizationJsonLd(site, contact)} />
    </MotionProvider>
  );
}
