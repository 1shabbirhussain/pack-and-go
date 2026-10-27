/** Structured data built only from supported business facts (no ratings, awards or licences). */
import type { ContactSettings, Faq, SiteSettings, TourPackage } from "./schema";
import { siteUrl } from "./format";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped to prevent </script> injection
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationJsonLd(site: SiteSettings, contact: ContactSettings) {
  const phones = contact.phones.filter((p) => p.public).map((p) => p.e164);
  const emails = contact.emails.filter((e) => e.public).map((e) => e.address);
  const offices = contact.offices.filter((o) => o.public);
  const sameAs = [contact.instagramUrl, contact.facebookUrl].filter(Boolean);
  const address = (lines: string[], city: string) => ({
    "@type": "PostalAddress",
    streetAddress: lines.slice(0, -1).join(", "),
    addressLocality: city,
    addressRegion: "Sindh",
    addressCountry: "PK",
  });
  const primary = offices.find((o) => o.primary) ?? offices[0];
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": siteUrl("/#organization"),
    name: site.siteName,
    url: siteUrl("/"),
    logo: siteUrl("/images/brand/logo-dark.png"),
    image: siteUrl("/images/photos/meadow-horse-lake.webp"),
    description: site.description,
    ...(phones[0] ? { telephone: phones[0] } : {}),
    ...(emails[0] ? { email: emails[0] } : {}),
    ...(primary ? { address: address(primary.addressLines, primary.city) } : {}),
    areaServed: { "@type": "Country", name: "Pakistan" },
    ...(sameAs.length ? { sameAs } : {}),
    ...(offices.length > 1
      ? {
          department: offices
            .filter((o) => o !== primary)
            .map((o) => ({ "@type": "TravelAgency", name: `${site.siteName} — ${o.city}`, address: address(o.addressLines, o.city), ...(phones[0] ? { telephone: phones[0] } : {}) })),
        }
      : {}),
  };
}

export function tourJsonLd(p: TourPackage) {
  const offers = p.priceOptions
    .filter((o) => o.status === "published" && o.perPerson != null)
    .map((o) => ({
      "@type": "Offer",
      name: `${o.origin === "islamabad" ? "From Islamabad" : `From Karachi — ${o.label}`} (per person)`,
      price: o.perPerson,
      priceCurrency: "PKR",
      url: siteUrl(`/tours/${p.id}`),
    }));
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: p.title,
    description: p.summary,
    url: siteUrl(`/tours/${p.id}`),
    touristType: p.labels,
    provider: { "@id": siteUrl("/#organization") },
    itinerary: {
      "@type": "ItemList",
      itemListElement: p.itinerary.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: `Day ${d.day}: ${d.title}` })),
    },
    ...(offers.length ? { offers } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: siteUrl(it.href) })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}
