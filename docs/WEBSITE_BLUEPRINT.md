# Pack & Go Tourism — Website Blueprint

**Phase:** Discovery → ready for implementation
**Prepared:** 16 October 2026
**Inputs:** `RESEARCH_NOTES.md`, `PDF_CONTENT_INVENTORY.md`, `CONTENT_SOURCE_MAP.md`
**Hard constraint:** Firebase is the only backend platform.

---

## 1. What the website must achieve

| Goal | Measure |
|---|---|
| Turn social-media interest into qualified WhatsApp/phone conversations | WhatsApp clicks per package view; inquiries submitted |
| Replace "send me the brochure" with a self-serve package page | PDF downloads + time on itinerary; fewer repetitive DMs |
| Look like a credible, established operator to families and diaspora/foreign visitors | Bounce rate; return visits; review submissions |
| Let the owner update prices, dates, contacts, brochures, photos and reviews without a developer | Admin edits per month; zero code deploys needed for content |
| Rank for "<destination> tour from Karachi/Hyderabad" | Search impressions and clicks (Search Console) |

### Audiences (in priority order)

1. **Karachi and Hyderabad families and friend groups.** They browse on mid-range Android phones over mobile data, compare price tables by train/bus class, and book over WhatsApp. They care about: price, departure date, what's included, family safety, food, kids policy.
2. **Young adult groups and couples.** Same channel. They care about: adventure activities (Babusar, rafting, Arang Kel trek), bonfire nights, photos.
3. **Diaspora and international visitors.** Desktop and mobile. They care about: trust (licence, real reviews, real photos), clarity in English, safety and permit information, approximate price in USD/GBP, custom/private trips.

---

## 2. Guiding principles

1. **WhatsApp-first, form-second.** Every page has one primary action: *Chat on WhatsApp*, with a pre-filled message that names the package, departure city and travel option. The structured inquiry form is for custom trips and for visitors who prefer email.
2. **Structured content, PDF as companion.** Itineraries, prices and policies live as structured data on the page (searchable, accessible, translatable). The brochure PDF is a download, never the only place information exists.
3. **Evidence-backed content only.** Every price and claim in the CMS carries a `sourceRef` (brochure + page, or "owner confirmed on date"). Nothing is invented: no reviews, ratings, awards or licences.
4. **Departure-city awareness.** The single biggest UX insight from the PDFs: every package exists in two versions (from Karachi / from Islamabad), with different durations and prices. One toggle switches the whole page.
5. **Fast on 4G, light on data.** Target LCP < 2.5 s on a mid-range Android over 4G, and under 250 KB of JS on public pages.
6. **Configurable business facts.** Phones, WhatsApp, emails, addresses, bank details, social links and licence numbers come from admin settings, never from source code.

---

## 3. Sitemap and navigation

```
/                                   Home
/tours                              All tours (filterable)
/tours/[slug]                       Package detail
    naran-shogran-babusar-saiful-malook     (PDF-N7)
    kashmir-neelum-arang-kel-ratti-gali     (PDF-K7)
    kashmir-naran-valley-10-days            (PDF-K10)
    naran-hunza-skardu-12-days              (PDF-S12)
/destinations                       All destinations
/destinations/[slug]                Hunza · Skardu · Naran-Kaghan · Kashmir-Neelum ·
                                    Swat-Kalam · Kalash · Murree · Islamabad
/custom-tour                        Customized tour planner (multi-step inquiry)
/brochures                          Brochure library (all PDFs)
/gallery                            Albums by trip/destination
/reviews                            Moderated customer reviews + "Leave a review"
/about                              Story, team, offices, registrations
/contact                            Both offices, phones, WhatsApp, map, hours
/travel-info                        Packing list, seasons, ID/CNIC, foreign-visitor guidance, advisories
/faq
/policies                           Terms, cancellation, kids, payment, privacy
/admin/*                            Admin panel (auth-gated, noindex)
```

**Primary nav (desktop):** Tours ▾ (the 4 packages + "All tours") · Destinations ▾ · Custom Tour · Gallery · Reviews · About · Contact. A persistent **WhatsApp** button sits on the right.
**Mobile:** Top bar with logo, a WhatsApp icon and a menu. A **sticky bottom action bar** on tour pages: `WhatsApp · Call · Brochure`.
**Footer:** Both offices, both phones, email, socials, registration line (e.g. "FBR-registered · DTS licence #___", once confirmed), policies, and a "Pay only into account titled PACK AND GO" safety note.

**Destination pages with no fixed package** (Swat-Kalam, Kalash, Murree, Islamabad) show inspirational content, best season and highlights, then a "Plan a custom trip here" call to action that pre-selects the destination in the custom-tour form. They never show invented prices.

---

## 4. UX and visual direction

**Concept: "Warm mountain postcard."** Extend the brochure system the customers already recognise, then make it calmer and more premium for the web.

| Token | Value | Use |
|---|---|---|
| `--navy-900` | #232A3A | Headers, footer, primary text on light backgrounds (14.3:1 on white) |
| `--amber-500` | #F8A838 | Buttons, highlight bars, badges, **with navy text on top** (7.3:1). Never amber text on white (only 1.97:1, fails WCAG) |
| `--amber-700` | #9A5B00 | Amber-family text and links on white (5.4:1) |
| `--cream-50` | #FFF5E9 | Section backgrounds |
| `--peach-100` | #FFE7C9 | Cards, itinerary day bars |
| `--whatsapp` | #25D366 → use #128C7E for text | WhatsApp actions only |
| Type | Poppins 600/700 for headings (already the brochure font); Inter or system UI for body | Self-hosted and subset; `font-display: swap` |

**Motifs carried over from the brochures:** the dashed map-pin route line (as the itinerary timeline spine), the peaked photo frame (hero image mask), and amber "day" labels.

**Photography:** Real Pack & Go group photos first (authenticity beats stock for this market). Stock only when licensed. Each destination needs one hero shot (2400 px) and 6–12 gallery shots.

**Tone:** Warm, family-friendly, plain English. Emojis are fine on social media but not in the site copy. Prepare for Urdu later (see §15).

---

## 5. Homepage — content hierarchy

1. **Hero:** A full-bleed destination photo (rotating set, with the first image preloaded), the headline "Ready for your next adventure?" and a sub-line from the profile intro. Two actions: **Explore tours** and **Plan a custom trip**. Underneath sit three trust chips that only render if the data exists (e.g. "Offices in Karachi & Hyderabad", "Family-oriented group tours", "Customized trips across Pakistan").
2. **Quick trip finder:** Departure city (Karachi / Hyderabad / Islamabad / Other) · Duration · Month · Travellers, leading to filtered /tours.
3. **Featured tours** (4 cards): photo, title, "Karachi 7 days · Islamabad 4 days", "From Rs 25,000 (from Islamabad)", highlight chips, and WhatsApp/Details buttons.
4. **Upcoming departures strip:** Only shown when the admin has added dates. Displays the date, tour and seats status ("Few seats left" only if the admin sets it).
5. **Destinations grid:** The 8 destinations, each marked "Package available" or "Custom trip".
6. **Why travel with us:** The four services from the profile, made concrete with PDF facts: "Breakfast & dinner included", "3/4-sharing hotel rooms", "Guide on every trip", "Toll taxes covered".
7. **How it works:** Choose a tour → Chat on WhatsApp → Pay advance to the PACK AND GO account → Travel. Links to the policies.
8. **Reviews:** Only approved, real reviews. If none exist yet, this section is hidden; a "Travelled with us? Leave a review" action stands in for it.
9. **Gallery teaser:** 6 photos plus an Instagram follow link.
10. **Brochures:** "Download our latest brochures" with 4 thumbnails.
11. **Custom tour band:** "Have your own plan? Tell us your dream trip" → /custom-tour.
12. **Contact strip:** Both offices, tap-to-call, WhatsApp, and a lazy-loaded map.

---

## 6. Package page structure

```
[Breadcrumb]  Home › Tours › Naran Shogran Babusar Top & Saif-ul-Malook

[HERO]  Title · peaked photo · badges: "Family oriented" "Bonfire & BBQ night"
        ┌────────────────────────────────────────────────┐
        │ Departing from:  (● Karachi 7 days) (○ Islamabad 4 days) │  ← global toggle
        └────────────────────────────────────────────────┘
        From Rs 36,000 per person · Rs 85,000 per couple*   [WhatsApp] [Brochure]

[QUICK FACTS]  Duration · Nights · Route · Meals (BF+Dinner) · Rooms (3/4 sharing)
               · Season note · Next departure (if set)

[HIGHLIGHTS]   Attraction chips from "Attraction Point" page + small route map

[ITINERARY]    Vertical timeline (dashed route line). Each day: title, bullet stops,
               overnight, meals, and badges:
               "Karachi travellers only" (Day 1–2, last day) when the toggle = Karachi
               "Optional – jeep not included" on jeep legs
               "Weather dependent" (Rattigalli/Taobat, Khunjerab, Arang Kel)

[PRICES]       Table by departure city and transport option, per person / per couple.
               *Couple-price explainer (once the owner confirms its meaning)
               Kids policy · Fuel-surcharge clause · "Prices valid for: ___"

[INCLUDED / NOT INCLUDED]  Two columns, icons

[MEALS]        Breakfast and dinner rotation (no stock food photos unless licensed)

[WHAT TO BRING]  Checklist + "Bring your CNIC / passport"

[GOOD TO KNOW]  Weather changes, AC on mountain roads, trips not insured,
               Foreign visitors: permits/advisory panel (Kashmir & GB tours)

[BROCHURE]     Thumbnail + "View" + "Download (1.2 MB)" + "Share on WhatsApp"

[REVIEWS]      Approved reviews tagged to this package (hidden if none)

[FAQ]          Package-specific FAQs

[STICKY CTA]   WhatsApp · Call · Book inquiry
```

**Pre-filled WhatsApp message** (built from the page state):

```
Assalam-o-Alaikum Pack & Go! I'm interested in:
• Tour: Naran Shogran Babusar Top & Saif-ul-Malook
• From: Karachi – Economy train
• Travellers: 2 adults, 1 child (5 yrs)
• Preferred month: July 2026
(sent from packandgo website)
```

The link is `https://wa.me/<settings.whatsappE164>?text=<urlencoded>`. The number comes from admin settings.

**Itinerary modelling trick:** Mark the Karachi-only days with `audience: "karachi"`, so the Islamabad view hides them automatically. In every PDF this reproduces the "Islamabad N days" figure exactly (e.g. PDF-N7: Days 3–6 = 4 days).

---

## 7. PDF brochure experience — and the storage question

### 7.1 The constraint

A deployed site cannot write new files into its bundled `assets/` (or `public/`) folder from a browser admin panel. Bundled files change only when the site is rebuilt and redeployed.

### 7.2 Recommended solution: one Brochure record, three interchangeable sources

Each brochure is a Firestore document. The site never hard-codes a file path. It calls a resolver.

```ts
type BrochureSource =
  | { kind: "bundled";  path: string }                 // e.g. "/brochures/kashmir-7-days.pdf"
  | { kind: "storage";  storagePath: string; downloadUrl: string }
  | { kind: "external"; provider: "google_drive" | "url"; url: string; driveFileId?: string };

interface Brochure {
  id: string;                 // "kashmir-7-days"
  packageIds: string[];
  title: string;
  version: string;            // "2026-04-14"
  source: BrochureSource;     // the active source
  webSource?: BrochureSource; // optional compressed copy for mobile
  fileSizeBytes?: number;
  pageCount?: number;
  thumbnails?: string[];      // page images for preview strip
  status: "draft" | "published" | "archived";
  updatedAt: Timestamp; updatedBy: string;
}

function resolveBrochure(b: Brochure) {
  switch (b.source.kind) {
    case "bundled":  return { view: b.source.path, download: b.source.path };
    case "storage":  return { view: b.source.downloadUrl, download: b.source.downloadUrl };
    case "external":
      if (b.source.provider === "google_drive" && b.source.driveFileId) {
        const id = b.source.driveFileId;
        return { view: `https://drive.google.com/file/d/${id}/preview`,
                 download: `https://drive.google.com/uc?export=download&id=${id}` };
      }
      return { view: b.source.url, download: b.source.url };
  }
}
```

| Phase | Source | How it works | Admin experience |
|---|---|---|---|
| **Launch** | `bundled` | The four supplied PDFs ship in `public/brochures/` (served from the Firebase CDN) and are seeded as Brochure docs | Admin can retitle, reorder, hide or attach them to packages. Replacing the file itself means switching it to an upload. |
| **When needed** | `storage` | Admin uploads a PDF in the panel → Cloud Storage `public/brochures/{id}/{version}.pdf` → a Cloud Function checks the type and size, counts pages, renders page-1 (or every page) thumbnails and fills the doc | Real self-service uploads. The old version is kept for rollback. |
| **Future** | `external` (Google Drive) | Admin pastes a Drive share link. A Cloud Function extracts the file ID, checks the file is publicly viewable, and stores the ID | Zero storage cost. The owner keeps editing in Drive. |

Switching a brochure from bundled to Drive is a **data change, not a redesign**. Pages, components and SEO stay the same.

**Viewer behaviour:**
- **Mobile:** In-page PDF iframes behave badly on Android, so show a strip of page thumbnails with "Open PDF" (new tab) and "Download". Never auto-load the PDF.
- **Desktop:** A lazy PDF.js viewer in a modal for `bundled`/`storage`, or the Drive `/preview` iframe for Drive.
- **Share on WhatsApp:** `wa.me/?text=<package page URL>` (share the page, not the raw PDF, so the link preview shows a proper OG image).
- Analytics event `brochure_view` / `brochure_download` with the brochure ID.

**Google Drive caveats** (shown in the admin UI): the file must be "Anyone with the link can view"; Drive may show a virus-scan interstitial for larger files; the owner can break the link by moving or deleting the file; Drive branding appears in the viewer. A weekly scheduled Cloud Function re-checks external links and flags broken ones on the admin dashboard.

**Optimisation:** Produce a 150-dpi web copy of each bundled PDF (target ≤ 1.5 MB, versus the current 3.6–4.8 MB). Offer "Download print quality" as a secondary link.

### 7.3 Firebase plan implication

Cloud Storage for Firebase now **requires the Blaze (pay-as-you-go) plan**, including for default buckets (Firebase FAQ, Sept 2024). App Hosting (recommended in §11) is also Blaze-only. **Recommendation: start on Blaze with a budget alert at USD 5 and USD 20.** At this site's expected traffic, actual cost should be close to zero, but the budget alerts are mandatory. If the owner insists on the free Spark plan, use bundled + Drive brochures only, Firestore-only content and static Hosting, and accept weaker SEO and no uploads.

---

## 8. Gallery and reviews

### Gallery
- **Albums** are tied to a destination and/or a departure ("Hunza – July 2026 group"). Each item has a caption, location, photographer credit, a consent flag (people visible?) and a featured flag.
- **Upload flow:** Admin drag-and-drops photos → Storage `public/gallery/{albumId}/` → the **Resize Images** Firebase extension (or a custom Function) produces WebP at 400/800/1600/2400 px → the Firestore doc stores the variants plus a blurhash placeholder.
- **Front end:** A masonry grid with lazy loading, a keyboard-accessible lightbox, and an alt-text field that is required in the admin.
- **Video:** YouTube or Instagram embeds behind a click-to-load facade (no autoplay, no third-party JS until clicked). Short MP4 reels can sit in Storage if they are under 15 MB.
- **Instagram:** Use a "Follow us" link plus a curated grid uploaded through the admin. *Don't* use the Instagram API: it needs Meta app review and adds a non-Firebase dependency.

### Reviews (integrity rules)
- **Launch with zero reviews.** The section stays hidden until real reviews are approved. Nothing is seeded or invented.
- **Collection:**
  1. The public "Leave a review" form (name or initials, trip, month, rating 1–5, text, optional photo, and a required consent checkbox reading "I agree this review may be published") goes through a Cloud Function → `reviews` with `status: "pending"`.
  2. The admin can enter a review the owner received on WhatsApp/Facebook **only with the customer's consent**, recording `source: "whatsapp" | "facebook" | "google"` and `consentRecordedAt`.
- **Moderation:** Approve, reject or edit typos only (never change the meaning). An admin reply field is available.
- **Display:** Show the real average only when there are at least 5 approved reviews. Show the trip and month.
- **Schema:** Use `Review` markup on package pages only for first-party reviews. **Don't add `AggregateRating` stars to the business/Organization markup**: Google treats that as self-serving and won't show it.
- **Google Business Profile:** Create or claim GBP listings for **both offices** and link to them for reviews. This is the strongest local trust signal in Pakistan.

---

## 9. Customized-tour inquiry flow

A 4-step form at `/custom-tour`, also openable as a sheet from any destination or package page with fields pre-selected.

| Step | Fields | Notes |
|---|---|---|
| 1. Where | Destinations (multi-select chips, all 8 + "Other"), "Start from a package" (optional) | Pre-selected from context |
| 2. When & who | Start date or month · Flexible? · Days (slider 3–15) · Adults · Children with ages (drives the kids policy) · Departure city (Karachi/Hyderabad/Islamabad/Lahore/Abroad/Other) | |
| 3. Style | Budget per person (bands in PKR; USD shown for "Abroad") · Hotel level (standard / deluxe / premium) · Transport (with group / private car / by air) · Interests (lakes, snow, trekking, culture, photography, honeymoon, family easy-pace) · Special needs (elderly, accessibility, dietary) | |
| 4. Contact | Name · WhatsApp number (with country code, validated with libphonenumber) · Email (optional) · Preferred contact (WhatsApp/Call/Email) · Message · Consent to be contacted | |

**On submit:**
1. A Cloud Function `submitInquiry` (HTTPS callable, App Check enforced) validates against a zod schema, rate-limits by hashed IP and phone, and writes `inquiries/{id}` with `status: "new"`.
2. It notifies the admin through **Firebase Cloud Messaging web push** to the admin panel (installed as a PWA on the owner's phone), and optionally by email via the **Trigger Email** Firebase extension, using the business Gmail's SMTP with an app password.
3. The thank-you screen offers **"Continue on WhatsApp"** with the full inquiry pre-filled in the message, plus a reference number (e.g. `PG-26-0142`).

**Admin pipeline:** New → Contacted → Quoted → Advance received → Booked → Completed / Lost (with reason). Each inquiry has notes, assignment, a one-tap WhatsApp reply (wa.me link with the customer's number), and CSV export.

---

## 10. Integrations

| Integration | Implementation | Configurable in admin |
|---|---|---|
| WhatsApp | `wa.me/<E164>?text=` deep links. A floating button (bottom-right, above the sticky bar on mobile) that can be hidden on /admin | Primary WhatsApp number, default greeting, show/hide per page |
| Phone | `tel:+923107869147`, `tel:+923013499147`, labelled by office once confirmed | Numbers, labels, order |
| Email | `mailto:` plus a contact form (same Function as inquiries, type "general") | Inquiry recipient address |
| Maps | A static map image with a "Open in Google Maps" link to `https://www.google.com/maps/search/?api=1&query=<lat,lng>`. Load the interactive iframe embed only on click (keeps third-party JS off page load and needs no API key) | Lat/lng, Plus Code, label per office |
| Social | Instagram and Facebook links. OG/Twitter meta so shared links look good on WhatsApp and Facebook | URLs |
| Analytics | Google Analytics 4 via Firebase Analytics, with a consent banner for EU/UK visitors. Events: `whatsapp_click`, `call_click`, `brochure_download`, `inquiry_submit`, `departure_toggle` | Measurement ID |
| Currency | PKR primary. An optional "≈ USD/GBP" line using an **admin-entered** exchange rate (avoids an external FX API), labelled "approximate" | Rates and date |

---

## 11. Technical architecture

### 11.1 Stack recommendation

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router, TypeScript)** | Server rendering and static regeneration for SEO; image optimisation; one codebase for the public site and the admin |
| Hosting | **Firebase App Hosting** (GitHub-connected, builds on push) | Firebase-native hosting for Next.js with server rendering; global CDN |
| Database | **Cloud Firestore** | Content, settings, inquiries, reviews |
| Auth | **Firebase Authentication** (Google sign-in or email-link), with TOTP MFA via the Identity Platform upgrade | Admin only. Public visitors never sign in |
| Files | **Cloud Storage for Firebase** | Brochure uploads, gallery |
| Server logic | **Cloud Functions for Firebase (2nd gen, Node 20+)** | Inquiry/review intake, image and PDF processing, revalidation, link checks, audit log |
| Abuse protection | **Firebase App Check** with reCAPTCHA Enterprise | Enforced on Functions, Firestore and Storage |
| Notifications | **FCM** web push (+ optional Trigger Email extension) | Stays inside Firebase |
| Styling/UI | Tailwind CSS + Radix primitives (accessible) | Small bundle, design tokens |
| Forms/validation | react-hook-form + zod (the same schema runs client-side and in Functions) | |
| Testing | Vitest, Playwright, **Firebase Emulator Suite** + `@firebase/rules-unit-testing` | Security rules are tested in CI |

**Rendering strategy:** Public pages are rendered on the server and cached. When the admin publishes, a Cloud Function calls a secret-protected `/api/revalidate` route that refreshes only the affected pages (`revalidateTag("package:naran-7")`). Visitors therefore get static-fast pages, Firestore reads stay tiny, and content updates go live in seconds without a redeploy.

**Admin panel:** Lives at `/admin` in the same Next.js app, rendered client-side, guarded by Firebase Auth and a custom `role` claim, and set to `noindex`. All writes go straight to Firestore/Storage under security rules. Privileged operations (role changes, deletes, publishing) go through Functions and are written to `auditLog`.

### 11.2 Proposed repository layout

```
packandgo-web/
├─ apps/web/                     Next.js app (public + /admin)
│  ├─ app/(public)/...           routes from §3
│  ├─ app/admin/...              admin routes
│  ├─ components/                design system + feature components
│  ├─ lib/firebase/              client + admin SDK init, typed converters
│  ├─ lib/content/               resolvers (resolveBrochure, pricing, whatsappLink)
│  └─ public/brochures/          4 bundled PDFs (+ web-optimised copies)
├─ functions/                    Cloud Functions (TypeScript)
├─ packages/schema/              zod schemas + TS types shared by web & functions
├─ firestore.rules · storage.rules · firestore.indexes.json
├─ seed/                         JSON seed generated from PDF_CONTENT_INVENTORY (with sourceRefs)
├─ docs/                         the four discovery documents
└─ firebase.json · apphosting.yaml · .github/workflows/ci.yml
```

---

## 12. Firestore data model

```
settings/site          { siteName, tagline, announcement, defaultSeo, ogImage, currencyRates, ... }
settings/contact       { phones:[{e164, label, office, whatsapp:boolean, primary:boolean}],
                         whatsappPrimary, emails:{inquiries, public}, socials:{instagram, facebook},
                         offices:[{id, city, addressLines[], lat, lng, plusCode, mapsUrl, hours}],
                         registrations:{ fbrNtn?, dtsLicence? } }
settings/payment       { bankName, accountTitle, accountNumber, iban?, branch?, wallets[], advancePolicy, antiFraudNote }

packages/{slug}        see 12.1
packages/{slug}/departures/{id}   { date, returnDate, origin, seatsStatus:"open"|"few"|"full", notes }
destinations/{slug}    { name, region, summary, body, bestSeason, highlights[], heroImage, gallery[],
                         packageIds[], customOnly:boolean, seo }
brochures/{id}         see §7.2
policies/{id}          terms | cancellation | kids | payment | privacy
                       { title, body(rich text), version, effectiveFrom, sourceRef }
contentBlocks/{id}     reusable inclusion/exclusion/meal/packing lists (shared across packages)
faqs/{id}              { q, a, scope:"global"|packageId, order }
galleryAlbums/{id}     { title, destinationId?, departureId?, cover, order, status }
galleryAlbums/{id}/items/{itemId}  { variants:{400,800,1600,2400}, blurhash, alt, caption, credit,
                         peopleConsent:boolean, featured }
reviews/{id}           { name, trip, packageId?, month, rating, text, photo?, source, consent:true,
                         consentRecordedAt, status:"pending"|"approved"|"rejected", reply?, createdAt }
inquiries/{id}         { ref, type:"custom"|"package"|"general", payload{...}, contact{...},
                         status, assignedTo?, notes[], utm{...}, createdAt }      ← never public
users/{uid}            { displayName, email, role:"owner"|"editor" }             ← mirrors custom claim
auditLog/{id}          { uid, action, path, before?, after?, at }
rateLimits/{hash}      { count, windowStart }                                      ← Functions only
```

### 12.1 Package document (seeded from PDF-N7)

```json
{
  "slug": "naran-shogran-babusar-saiful-malook",
  "status": "published",
  "title": "Naran, Shogran, Babusar Top & Saif-ul-Malook Lake",
  "sourceTitle": "NARAN SHOGRAN BABUSAR TOP & SAIFULMALOOK LAKE",
  "labels": ["Family oriented"],
  "destinations": ["naran-kaghan"],
  "durations": { "karachi": { "days": 7 }, "islamabad": { "days": 4 } },
  "highlights": ["Hazara Motorway", "Kewai Waterfall", "Shogran", "Siri Paye", "Batakundi",
                 "Lulusar Lake", "Babusar Top", "Kunhar River rafting", "Saif-ul-Malook Lake"],
  "itinerary": [
    { "day": 1, "audience": "karachi", "title": "Depart Karachi",
      "items": ["Departure from Karachi (no food)"], "overnight": "In transit",
      "sourceRef": { "brochureId": "naran-7", "page": 4 } },
    { "day": 3, "audience": "all", "title": "Islamabad → Naran via Kewai & Shogran",
      "items": ["Depart via Hazara Motorway", "Breakfast at Balakot/Kawai", "Kewai Waterfall",
                { "text": "Jeeps to Shogran & Siri Paye", "optional": true, "note": "Jeep charges not included" },
                "Check-in at Naran"],
      "meals": ["dinner"], "overnight": "Naran",
      "sourceRef": { "brochureId": "naran-7", "page": 4 } }
  ],
  "pricing": {
    "currency": "PKR",
    "validFrom": null, "validTo": null,
    "options": [
      { "origin": "islamabad", "label": "Standard",      "perPerson": 25000, "perCouple": 60000 },
      { "origin": "karachi",   "label": "Economy train", "perPerson": 36000, "perCouple": 85000 },
      { "origin": "karachi",   "label": "Executive bus", "perPerson": 44000, "perCouple": 100000 },
      { "origin": "karachi",   "label": "Sleeper bus / Business class train",
        "perPerson": 51000, "perCouple": 115000 }
    ],
    "coupleNote": null,
    "sourceRef": { "brochureId": "naran-7", "page": 3, "flag": "duplicate 'Sleeper bus' row omitted pending owner confirmation" }
  },
  "inclusionsBlock": "standard-inclusions-2026",
  "exclusionsBlock": "standard-exclusions-2026",
  "mealsBlock": "standard-meals-2026",
  "packingBlock": "standard-packing-2026",
  "notes": ["Plan or stays may be adjusted according to weather conditions or other circumstances."],
  "advisories": [],
  "brochureIds": ["naran-7"],
  "seo": { "title": "Naran, Babusar Top & Saif-ul-Malook Tour from Karachi | Pack & Go", "description": "..." },
  "updatedAt": "...", "updatedBy": "..."
}
```

Seasonal and access flags (`advisories: ["ajk-loc"]`, `["gb-registration","babusar-snow"]`) point to reusable advisory blocks maintained in one place.

---

## 13. Security approach

### 13.1 Firestore rules (outline)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function isStaff()  { return request.auth != null && request.auth.token.role in ['owner','editor']; }
    function isOwner()  { return request.auth != null && request.auth.token.role == 'owner'; }
    function published(){ return resource.data.status == 'published'; }

    match /settings/{id}        { allow read: if id in ['site','contact','payment']; allow write: if isOwner(); }
    match /packages/{id}        { allow read: if published() || isStaff(); allow write: if isStaff();
      match /departures/{d}     { allow read: if true; allow write: if isStaff(); } }
    match /destinations/{id}    { allow read: if published() || isStaff(); allow write: if isStaff(); }
    match /brochures/{id}       { allow read: if published() || isStaff(); allow write: if isStaff(); }
    match /policies/{id}        { allow read: if true; allow write: if isOwner(); }
    match /contentBlocks/{id}   { allow read: if true; allow write: if isStaff(); }
    match /faqs/{id}            { allow read: if true; allow write: if isStaff(); }
    match /galleryAlbums/{a}    { allow read: if published() || isStaff(); allow write: if isStaff();
      match /items/{i}          { allow read: if true; allow write: if isStaff(); } }
    match /reviews/{id}         { allow read: if resource.data.status == 'approved' || isStaff();
                                  allow update: if isStaff(); allow create, delete: if false; } // create via Function only
    match /inquiries/{id}       { allow read, update: if isStaff(); allow create, delete: if false; } // create via Function only
    match /users/{uid}          { allow read: if isOwner() || request.auth.uid == uid; allow write: if false; }
    match /auditLog/{id}        { allow read: if isOwner(); allow write: if false; }
    match /rateLimits/{id}      { allow read, write: if false; }
  }
}
```

### 13.2 Storage rules (outline)

```js
match /b/{bucket}/o {
  match /public/{allPaths=**} { allow read: if true; }
  match /public/brochures/{id}/{file} {
    allow write: if request.auth.token.role in ['owner','editor']
                 && request.resource.contentType == 'application/pdf'
                 && request.resource.size < 20 * 1024 * 1024; }
  match /public/gallery/{album}/{file} {
    allow write: if request.auth.token.role in ['owner','editor']
                 && request.resource.contentType.matches('image/.*|video/mp4')
                 && request.resource.size < 15 * 1024 * 1024; }
  match /private/{allPaths=**} { allow read, write: if false; }   // review photos land here until approved
}
```

### 13.3 Other controls
- **Roles via custom claims** (`owner`, `editor`), set only by a Function that the owner calls. The first owner is bootstrapped by a one-time script.
- **MFA** for every admin account. Restrict sign-in to an allow-list of emails.
- **App Check enforced** on Firestore, Storage and Functions; reCAPTCHA Enterprise score checks in `submitInquiry`/`submitReview`.
- **PII minimisation:** Inquiries hold names and phone numbers. Keep them private, export only to the owner, and auto-archive after 24 months (scheduled Function). The privacy policy states this.
- **Bank details shown only from settings**, with an anti-impersonation note, so a bank change takes one edit.
- **Backups:** Firestore point-in-time recovery plus a weekly scheduled export to a private bucket.
- **Headers:** CSP (with allow-listed Google domains), HSTS, `X-Frame-Options` on /admin, and `Referrer-Policy`.
- **CI gate:** Rules unit tests must pass before deploy.

---

## 14. Admin panel capabilities

| Module | Capabilities |
|---|---|
| Dashboard | New inquiries, pending reviews, broken brochure links, upcoming departures, last 30 days of WhatsApp clicks and downloads |
| Packages | Create, edit and duplicate. **Itinerary builder** with reusable day templates (e.g. "Naran → Babusar day" is used by N7, K10 and S12). Audience flag per day. Optional-item flags. Price-table editor with validity dates. Advisories, SEO fields. Draft → Preview → Publish. Version history with restore |
| Departures | Calendar of dates per package and origin, with seat status |
| Destinations | Rich-text content, best season, highlights, hero and gallery, linked packages, "custom only" flag |
| Brochures | Upload (Storage), paste a Drive link, or keep bundled. Version list, set active, attach to packages, link health |
| Gallery | Albums, multi-upload, alt text (required), captions, consent flag, featured, reorder |
| Reviews | Moderation queue, approve/reject, typo-only edit, reply, manual entry with consent record |
| Inquiries | Pipeline board and table, filters, notes, assignment, one-tap WhatsApp/call, CSV export |
| Settings | Phones and WhatsApp primary, emails, offices and map pins, socials, registrations, bank/payment, announcement bar, exchange rates |
| Policies & FAQ | Rich-text editors with version and effective date |
| Users | Invite editor, change role (owner only), audit log viewer |

The admin works well on a phone (the owner will mostly use it there). It installs as a PWA for push notifications.

---

## 15. Performance, SEO, accessibility, localisation

**Performance budget**
- LCP < 2.5 s, INP < 200 ms, CLS < 0.1 at the 75th percentile on mobile (tracked with web-vitals → GA4).
- Hero image ≤ 180 KB AVIF/WebP, preloaded. Everything else lazy-loaded with blurhash placeholders.
- Public-page JS ≤ 250 KB gzip. No map, video or PDF.js code loads before user interaction.
- Fonts: Poppins 600/700 subset (Latin), self-hosted, preloaded. Body font is the system stack or Inter.
- PDFs are never fetched on page load. Web-optimised copies are ≤ 1.5 MB.

**SEO**
- One URL per package and per destination, with descriptive slugs and keyword-led titles ("Hunza & Skardu tour from Karachi – 12 days").
- Structured data: `TravelAgency` (×2 locations, with `address`, `telephone`, `geo`), `TouristTrip` with `itinerary` and `offers` (PKR, `validFrom`/`validThrough` only when known), `BreadcrumbList`, `FAQPage`, `Review` (first-party, package-level only).
- Generate `sitemap.xml` and `robots.txt` from Firestore. Set canonical URLs. Generate OG images per package (title + photo + "from Rs X") — critical for WhatsApp link previews.
- Off-site: **Google Business Profile for both offices**, consistent NAP (name/address/phone) everywhere, and the website link in the Instagram/Facebook bios.
- Content: destination guides (best time to visit, what to pack, road conditions) bring organic traffic and link to packages.

**Accessibility (WCAG 2.2 AA)**
- Use the colour rules in §4: amber is a background colour with navy text, never text on white.
- Semantic headings, landmarks, skip link; visible focus rings; 44 px touch targets.
- Accessible itinerary accordion, departure toggle (radio group) and lightbox. Alt text is required.
- Forms: labels, inline errors announced via `aria-live`, no CAPTCHA puzzles (App Check is invisible).
- Respect `prefers-reduced-motion`. No autoplaying video.
- Re-export the brochures with a proper Unicode text layer (PDF-K7 has garbled glyphs) and give them a document title for screen readers.

**Localisation**
- Launch in English. Structure the content fields as `{ en, ur? }` from day one, and use next-intl routing (`/ur/...`) so Urdu (RTL, Noto Nastaliq Urdu) can be added in phase 2 without restructuring.

---

## 16. Deployment and operations

| Item | Plan |
|---|---|
| Firebase projects | `packandgo-dev`, `packandgo-prod` (optional `-staging`). All on Blaze with budget alerts |
| Region | Firestore/Functions in an Asia region close to Pakistan (e.g. `asia-south1` Mumbai or `me-central2` Dammam; benchmark both). App Hosting served via CDN |
| CI/CD | GitHub → Actions: lint, typecheck, unit tests, rules tests (emulator), Playwright smoke → App Hosting auto-rollout on `main`. Functions and rules are deployed by the Firebase CLI in the same workflow |
| Domain | Register a .pk (PKNIC) or .com (e.g. `packandgotourism.pk`; availability unchecked). Use `info@` email forwarding |
| Monitoring | Cloud Logging alerts on Function errors, uptime check on `/`, weekly brochure-link check, GA4 + Search Console |
| Content seeding | A script loads `seed/*.json` (built from the inventory, with `sourceRef`s) into Firestore and uploads nothing: bundled PDFs are referenced by path |
| Handover | Admin user guide (Urdu + English short videos), owner account with MFA, documented recovery |

---

## 17. Component inventory

**Layout:** `SiteHeader`, `MobileNav`, `StickyActionBar`, `WhatsAppFab`, `SiteFooter`, `AnnouncementBar`, `Breadcrumbs`
**Discovery:** `HeroCarousel`, `TripFinder`, `TourCard`, `DestinationCard`, `DepartureStrip`, `FilterBar`
**Package:** `DepartureToggle` (global context), `QuickFacts`, `HighlightChips`, `RouteMiniMap` (static SVG), `ItineraryTimeline` / `ItineraryDay`, `OptionalBadge`, `PriceTable`, `CouplePriceNote`, `KidsPolicy`, `IncludedExcluded`, `MealsBlock`, `PackingChecklist`, `AdvisoryPanel`, `BrochureCard` / `BrochureViewer`, `PackageFAQ`
**Social proof:** `ReviewList`, `ReviewForm`, `GalleryGrid`, `Lightbox`, `VideoFacade`
**Conversion:** `WhatsAppLink` (message builder), `CallLink`, `CustomTourWizard` (4 steps), `ContactForm`, `ThankYou`
**Info:** `OfficeCard`, `MapFacade`, `PolicyDocument`, `TrustChips`
**Admin:** `AdminShell`, `DataTable`, `RichTextEditor` (Tiptap), `ItineraryBuilder`, `PriceTableEditor`, `MediaUploader`, `BrochureSourcePicker`, `InquiryBoard`, `ReviewQueue`, `SettingsForm`, `PublishBar`, `VersionHistory`

---

## 18. Implementation plan

| Phase | Scope | Exit criteria |
|---|---|---|
| **0. Owner confirmations** (parallel, start now) | Send the checklist in `CONTENT_SOURCE_MAP.md` §8. Get the vector logo, photos and domain | Answers for items 1–10 at least |
| **1. Foundation** (week 1) | Repo, Next.js + Tailwind tokens, Firebase projects (Blaze + budgets), emulators, schema package, security rules + tests, CI | Rules tests green; empty site deploys to dev |
| **2. Content model + seed** (week 1–2) | zod schemas, seed JSON for 4 packages, 8 destinations, policies and settings from the inventory (with sourceRefs), bundled brochures + web copies | Seed loads; every price traces to a PDF page |
| **3. Public site MVP** (week 2–4) | Home, Tours, Package page (toggle, itinerary, prices, brochure), Destinations, Contact, Policies, FAQ, WhatsApp/call integrations, SEO + OG images | Lighthouse mobile ≥ 90 (perf/SEO/a11y); WhatsApp messages pre-fill correctly |
| **4. Inquiry + admin core** (week 4–6) | `submitInquiry`, custom-tour wizard, admin auth + MFA, Settings, Packages/Itinerary/Price editors, Inquiries board, publish → revalidate, FCM push | Owner can change a price and a phone number on a phone, live in < 1 minute |
| **5. Media, brochures, reviews** (week 6–7) | Storage uploads, image resizing, gallery, brochure upload + Drive link source + link checker, review form + moderation | Upload → visible; Drive link switch works without code change |
| **6. Hardening + launch** (week 8) | App Check enforcement, CSP, backups, monitoring, accessibility audit, content QA against source map, GBP listings, domain, analytics | Launch checklist signed off by owner |
| **7. Post-launch** | Urdu, departures calendar polish, blog/guides, more packages (Swat, Kalash, 6-day), optional online advance payment (bank transfer receipt upload first; payment gateway later, which needs a separate decision since it is non-Firebase) | — |

Timelines assume one full-stack developer plus a designer for about 1–2 weeks. Adjust once the team is known.

---

## 19. Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| Prices/dates are out of date (no validity date in the PDFs) | Customer disputes, lost trust | `validFrom/validTo` fields; "Prices confirmed on ___" line; admin dashboard warns when expired |
| Two phones / two emails unresolved | Missed leads | Show both phones; settings-driven; confirm before launch |
| Ambiguous cancellation policy | Legal and trust risk | Owner rewrite before launch; versioned policy doc |
| Kashmir LoC-area access restrictions | Trips altered; foreign-visitor exposure | Advisory blocks; foreign visitors routed to "contact before booking"; links to official advisories |
| Stock images of unknown rights | Takedown or legal claim | Use owned photos; licence register in admin (credit field) |
| "Approved by FBR" read as tourism approval | Misleading claim | Reword; add DTS licence if held |
| Logo only 225 px JPG | Blurry brand on retina screens | Obtain vector, or have it redrawn from the brochure vector |
| Blaze plan billing surprise | Cost anxiety | Budget alerts, caps on Function instances, image size limits |
| Inquiry spam | Noise, Function cost | App Check + rate limiting + honeypot |
| Google Drive links break | Missing brochures | Weekly link checker; keep a Storage or bundled fallback |
| Owner can't maintain the admin | Stale site | Mobile-first admin, short training videos, reusable day templates |
| Reviews pressure (empty section at launch) | Weak social proof | Hide the section until real reviews arrive; push customers to Google reviews after each trip |

---

## 20. Exact next steps

1. **Send the owner checklist** (`CONTENT_SOURCE_MAP.md` §8) and request the vector logo, real photos, and Instagram/Facebook screenshots (both pages were blocked to automated access).
2. **Decide the domain** and create the two Firebase projects on Blaze with budget alerts.
3. **Approve this blueprint**, in particular: Next.js on App Hosting, the brochure-source model in §7, and WhatsApp-first conversion.
4. **Phase 1:** create the repo with the layout in §11.2, add the four bundled PDFs (already renamed in `assets/brochures/`), and write the security rules and tests first.
5. **Phase 2:** generate seed JSON from `PDF_CONTENT_INVENTORY.md`, with owner-pending items held as `draft` or flagged.
6. **Build the package page first.** It is the conversion engine, and every other page reuses its components.
