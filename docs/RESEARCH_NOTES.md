# Pack & Go Tourism — Research Notes

**Phase:** Discovery (no website code written)
**Prepared:** 16 October 2026
**Prepared for:** Pack & Go Tourism website project
**Companion files:** `PDF_CONTENT_INVENTORY.md` · `CONTENT_SOURCE_MAP.md` · `WEBSITE_BLUEPRINT.md`

---

## 0. How to read this document

Every finding is tagged with one of three evidence levels:

| Tag | Meaning |
|---|---|
| **[V] Verified** | Seen directly in a primary brand source supplied to the project: the four brochure PDFs (all produced in the same Pack & Go template), the logo file, or the business-profile screenshot. "Verified" means *the brand itself publishes this*, not that the claim is independently true (e.g. a price is verified as *published*, not as *currently valid*). |
| **[U] User-provided** | Stated in the project brief, not independently confirmed because the source could not be reached. |
| **[M] Missing / needs confirmation** | Not found in any source, or sources conflict. Must be confirmed by the business owner before launch. |

Source codes used throughout (full list in `CONTENT_SOURCE_MAP.md`):

| Code | Source |
|---|---|
| **PDF-N7** | `Naran Shogran Babusar Top 7days.pdf` (10 pages) |
| **PDF-K7** | `Kashmir 7 days.pdf` (10 pages) |
| **PDF-K10** | `new Kashmir 10days.pdf` (11 pages) |
| **PDF-S12** | `12 days skardu hunza and Naran.pdf` (11 pages) |
| **IMG-LOGO** | Logo image supplied in chat (225×225 JPG) |
| **IMG-PROFILE** | Business-profile screenshot supplied in chat (630×1365 JPG, "Pack And Go", Travel & Transportation) |
| **BRIEF** | The project brief written by the client |

---

## 1. Access log — what could and could not be reached

| Source | Method tried | Result |
|---|---|---|
| Instagram `instagram.com/pack_nd_go_tourism/` | Server fetch; in-app browser (site access granted); Chrome extension | **Blocked.** Server fetch refused by Instagram's robots policy; in-app browser navigation failed; Chrome extension not connected. |
| Facebook `facebook.com/people/Pack-Go/100063973536283/` | Server fetch; in-app browser (site access granted); Chrome extension | **Blocked.** Same outcome as Instagram. |
| Web search for brand name, both phone numbers, address, and the `packg97` email | Standard + extended search | **No indexed third-party pages about Pack & Go Tourism found.** Results were unrelated businesses ("On The Go Tours", Indian "Hyderabad" operators). The brand has effectively **no web footprint outside social media** — which is itself a strong argument for the website. |
| Punjab DTS licensed travel-agency list (`dts.punjab.gov.pk/system/files/RENEWED.pdf`) | Fetched | Accessible. **No entry** for Pack & Go, either phone number, or Hyderabad. (Expected — Pack & Go is Sindh-based; this is not evidence of anything negative.) |
| Sindh Directorate of Tourist Services (`sindhculture.gov.pk/tourist-services/`) | Fetched | Accessible. Regulates travel agencies under the *Travel Agencies Act 2011* and guides under the *Sindh Tourist Guide Act 2011*. No public licensee list found on that page. |
| UK FCDO Pakistan regional-risk advice | Fetched (page updated 14 Oct 2026) | Accessible — used for the international-visitor section. |
| Firebase Storage pricing FAQ | Fetched | Accessible — used for the architecture decision. |

No VPN or alternate network route is configured in this environment. Blocked sites were **not** accessed through mirrors, caches, or scraping services; they are listed here instead.

**Recommendation:** Ask the owner for (a) screenshots of the Instagram grid, highlights and bio, (b) the Facebook *About* and *Reviews* tabs, and (c) an export of real customer photos/videos they own. That fills most social-media gaps in a single step.

---

## 2. Business identity

| Item | Finding | Level | Source |
|---|---|---|---|
| Brand name (as written on brochures) | **"PACK & GO"** with "Tourism" in script above it | V | IMG-LOGO; all PDFs p1 |
| Name variants seen | "Pack & Go Tourism" (brief), "Pack And Go" (profile), "PACK AND GO" (bank account title), "Pack-Go" (Facebook URL slug) | V/U | IMG-PROFILE; PDFs payment page; BRIEF |
| Instagram handle | `@pack_nd_go_tourism` | U | BRIEF (page not reachable) |
| Category | "Travel & Transportation" | V | IMG-PROFILE |
| Category (social) | Travel company / Tour Guide | U | BRIEF |
| Tagline | "Make your journey Memorable" | U | BRIEF — **does not appear in any PDF** |
| Brochure taglines actually used | "READY FOR YOUR NEXT ADVENTURE?" and "WE'D LOVE TO HEAR YOUR TRAVEL DREAMS!" | V | All PDFs p1 |
| Profile intro | "Explore Pakistan with [Pack & Go] … Discover Pakistan's breathtaking beauty, rich culture, and warm hospitality." | V | IMG-PROFILE |
| Followers | ~1,009 Instagram / ~14,000 Facebook | U | BRIEF — **do not publish counts on the site** unless pulled live or re-confirmed; they date quickly |
| Owner / contact person | An email in the brief (`imrankhanniazi2211@…`) suggests a personal name, but no source names an owner or founder | M | — |
| Years in business, founding date, team size | Not found | M | — |
| Government registration | Brochure covers carry an **"Approved by FBR"** badge (FBR = Federal Board of Revenue, Pakistan's tax authority) | V | All PDFs p1, bottom-right |

> **Important on "Approved by FBR":** FBR registration (NTN/STRN) is a *tax* registration. It is **not** a tourism licence. A travel/tour-agency licence in Sindh falls under the Directorate of Tourist Services (Travel Agencies Act 2011); a DTS licence or a membership (e.g. a national tour-operator association) would be a much stronger trust signal for international visitors. **[M]** Ask whether Pack & Go holds a DTS licence number; if so, display it in the footer. Do not display "Approved by FBR" as if it were a tourism approval — recommended wording if kept: "FBR-registered business (NTN ______)".

---

## 3. Contact details — the two-phone-number question

### 3.1 What the evidence says

| Number in brief | Normalised (E.164) | Where it appears | Level |
|---|---|---|---|
| `03013499147` (Instagram) | **+92 301 3499147** | **All four PDFs** print it as `+92-301-349-9147` on the cover (p1) and the payment page (last page) | **V** |
| `+92 310 7869147` (Facebook, "phone/WhatsApp") | **+92 310 7869147** | **All four PDFs** print it as `+92-310-786-9147`, *listed first*, on the same pages | **V** |

**Finding:** This is **not** a conflict between an old and a new number. The brand's own brochures (all created 14 April 2026, per PDF metadata) list **both numbers side-by-side** as business contacts:

```
+92-310-786-9147   I   +92-301-349-9147
```

The apparent discrepancy comes from each social platform showing only one of them, plus different formatting (`0301…` vs `+92-301-…`, which are the same number).

**Still unconfirmed [M]:**

1. Which number is on **WhatsApp / WhatsApp Business** (the profile screenshot looks like a WhatsApp Business profile but does not show the number).
2. Which number should be the **primary** call/WhatsApp button.
3. Whether one number belongs to the Hyderabad office and the other to the Karachi office.

**Recommendation:** Display both, keep them in admin-editable settings (`settings/contact`), and let the admin choose which one powers the floating WhatsApp button. Default proposal until confirmed: **+92 310 7869147** as WhatsApp (it is listed first in the brochures and labelled "WhatsApp" on Facebook per the brief).

### 3.2 Email — three different addresses

| Email | Source | Level |
|---|---|---|
| `imrankhanniazi2211@gmail.com` | BRIEF (stated as from Facebook/Instagram) | U |
| `packg97@gmail.com` | IMG-PROFILE (business profile) | V |
| *(none)* | No email appears in any of the four PDFs | — |

**[M] Conflict.** Two different addresses; neither is on a company domain. Recommendation: register a domain and use `info@<domain>` (forwarding to whichever Gmail the owner prefers). Until then, ask the owner which address receives inquiries, and keep it in admin settings.

### 3.3 Offices — a second office was discovered

| Office | Address as printed | Source | Level |
|---|---|---|---|
| **Hyderabad** | "PLOT NO 220 HIQA TOWER NEAR MAHMOOD GARDEN MAIN AUTOBHAN ROAD HYDERABAD" | All PDFs p1 + last page; IMG-PROFILE | V |
| **Karachi** (not in brief) | "KARACHI OFFICE #301 HUSSAIN MENSION TAYYABJEE ROAD PAPER MARKET KARACHI" | All PDFs p1 + last page | **V — new finding** |

Notes:
- Postal code **70050** and "Sindh, Pakistan" come only from the brief **[U]**.
- Spellings in the source: "Autobhan" (commonly written *Auto Bhan* Road), "Mension" (likely *Mansion*). On the website, use the owner-confirmed spelling; keep the original in the source map.
- **[M]** Google Maps pin / Plus Code for both offices, opening hours, and whether walk-ins are welcome.
- The Karachi office matters: every package's day-by-day plan starts with "Departure from Karachi", so the **core customer base appears to be Karachi**, not only Hyderabad.

### 3.4 Payment details

All four PDFs (last page, "Payment Procedure") publish: **Faysal Bank — account 3650 4990 0000 2454 — title "PACK AND GO"** **[V]**.

Recommendations:
- **Do not hard-code** bank details. Store in admin settings and show them only on the payment-instructions section of a package page / booking confirmation.
- Add an anti-fraud line: *"Only pay into the account titled PACK AND GO. Confirm by phone before transferring."* (Travel scams that impersonate small operators on social media are common.)
- **[M]** IBAN, branch, JazzCash/Easypaisa options, advance-payment amount/percentage, and payment deadline are not stated anywhere.

---

## 4. Offerings

### 4.1 Destinations claimed

From IMG-PROFILE **[V]**: Hunza Valley · Skardu · Naran, Kaghan Valley · Kashmir · "Kelash valley" (Kalash) · "Sawat, Kalam, Malam jabba" (Swat) · "Muree" (Murree) · Islamabad.
From BRIEF **[U]**: Northern areas focus, plus customised trips anywhere in Pakistan.

### 4.2 Services claimed

From IMG-PROFILE **[V]**: Customized tours · Expert guides · Quality accommodations · Trekking & adventure · Personalized service · Competitive pricing.

Note for copywriting: "expert guides" and "quality accommodations" are the brand's own claims. The PDFs are more specific and more modest: "Services of a Guide" and "Hotel Accommodation (3/4 Pax Sharing)". The website should use the specific PDF wording in package details and keep the marketing wording for headlines only.

### 4.3 Packages with documentary evidence

| # | Package (as titled on cover) | From Karachi | From Islamabad | Brochure |
|---|---|---|---|---|
| 1 | **Naran Shogran Babusar Top & Saifulmalook Lake** | 7 days | 4 days | PDF-N7 |
| 2 | **Kashmir, Neelum Valley, Arang Kel & Rattigalli Lake** | 7 days | 4 days | PDF-K7 |
| 3 | **Kashmir & Naran Valley** | 10 days ("10 days trip 7 nights") | 7 days | PDF-K10 |
| 4 | **Naran, Hunza & Skardu** | 12 days | 8 days | PDF-S12 |

The profile's "Pakistan Explorer" tour lengths (4, 6, 7, 10, 12 days) map to these brochures as follows: **4** = Islamabad variant of #1 or #2; **7** = #1, #2 (Karachi) or #3 (Islamabad); **10** = #3; **12** = #4. **The 6-day tour has no brochure [M].**

**Destinations with no package evidence:** Swat/Kalam/Malam Jabba, Kalash, Murree (as its own trip), Islamabad (as its own trip). These should be presented as **"Custom trip" destinations**, not as fixed packages, until itineraries and prices are supplied.

Full package detail with page numbers: `PDF_CONTENT_INVENTORY.md`.

### 4.4 Commercial model — what the brochures reveal

- **Group departures from Karachi** by train or bus, with the tour proper starting in Islamabad. Islamabad-based guests join on Day 3 and pay a lower price. **[V]**
- **Pricing is per person and per couple, by transport class** (economy train, executive bus, sleeper bus, business-class train, Green Line). **[V]**
- The **per-couple price is more than double the per-person price** (e.g. Rs 25,000 pp vs Rs 60,000 per couple, PDF-N7 p3). Most likely reason: couples get a private room while individuals share 3–4 per room. **[M] Confirm before publishing** — the website must explain this or customers will read it as an error.
- **Optional extras are not priced:** jeeps (Shogran, Siri Paye, Saif-ul-Malook, Kel, Rattigalli), boating, entry tickets, heaters. Several highlight attractions depend on jeeps that are explicitly "not included". **[V]** The site should flag these as "Optional — pay locally" on the itinerary.
- **Fuel surcharge clause:** "The client agrees to bear any additional charges arising from fuel price increases occurring before or during the trip. Such charges are compulsory and non-negotiable." **[V]** (cost page + T&C page of every PDF).
- **Family positioning:** Itineraries are labelled "Snowy Family Oriented Trip" (N7, K7, K10) and "Family Oriented Trip" (S12); a kids policy is included. **[V]**
- **Halal, Pakistani group-tour menu** (paratha/omelette breakfast; karahi/BBQ/biryani dinner on rotation). **[V]**
- **No departure dates, no season, no price validity date, no group size** in any PDF. **[M]** — the single biggest content gap for package pages.

---

## 5. Brand and visual identity

| Element | Finding | Level |
|---|---|---|
| Logo | Charcoal background (#424244), white mountain silhouette, gold/sand "Tourism" script, "PACK & GO" in bold serif between two gold rules | V (IMG-LOGO) |
| Logo quality | Only a **225×225 JPG** is available — too small and lossy for a website header or favicon at high DPI | **[M] Need vector (AI/SVG/PDF) or ≥1000px PNG with transparency** |
| Brochure logo | Re-coloured version: navy shield, **amber** mountain and wordmark | V (all PDFs) |
| Brochure palette (sampled) | Navy **#232A3A**, amber **#F8A838**, cream **#FFF5E9**, light peach **#FFE7C9**, white | V |
| Brochure typeface | **Poppins** (Bold, SemiBold, Medium) — embedded in every PDF | V (PDF font table) |
| Design language | Map-pin dashed-route motif, pentagon/"mountain peak" photo frames, amber highlighted row bars | V |

The brochure system (navy + amber + cream, Poppins) is a better web foundation than the charcoal logo alone: it is warmer, higher-contrast, and already familiar to customers. The blueprint adopts it.

---

## 6. Imagery and rights

- The PDFs embed **~50 unique images** (destinations, travellers, food, Faysal Bank logo, icons). Extracted copies: `discovery/extracted-images/`.
- Many look like **stock or internet-sourced photos** (polished model shots, generic food photography). Ownership is unknown. **[M] Do not reuse on the website** until the owner confirms they hold rights. Use the business's own trip photos from Instagram/Facebook instead — authentic group photos convert better for this market anyway.
- **Possible location mismatch:** The cost page of both Kashmir brochures (PDF-K7 p3, PDF-K10 p3) uses a photo of a turquoise lake in barren, rocky mountains that resembles Hunza/Attabad terrain more than the forested Neelum Valley. Treat as *unconfirmed*; avoid captioning it "Kashmir".
- The Faysal Bank logo is a third-party trademark; fine to show next to the bank details only.

---

## 7. Market and audience observations

**Domestic (primary):** Karachi and Hyderabad families and friend groups on budget–mid-range group tours, who book through WhatsApp after seeing a brochure on Instagram/Facebook. The brochure format (cost table by train/bus class, meals menu, kids policy) is exactly what this audience compares across operators. The website must keep that comparability, be fast on mobile data, and make WhatsApp the main action.

**International (secondary):** Mostly diaspora Pakistanis plus some foreign travellers. They expect English, USD/GBP context, clear inclusions, safety information and permit guidance. Facts that bear directly on the current packages:

- **AJK / Neelum Valley (PDF-K7, PDF-K10):** The UK FCDO (updated 14 Oct 2026) advises against all but essential travel to AJK, and against **all** travel within 10 miles of the Line of Control. Both Kashmir itineraries include "Short Stay At LOC Indian Border". Pakistan's 2019 rule change opened AJK to foreigners, *except* within 5 miles of the LoC. Dawn reported (2 May 2025) that tourists were turned back from Neelum Valley at the Marbal checkpost during an India–Pakistan security escalation.
  → Kashmir package pages need an **"Access subject to official advisories"** notice. For foreign nationals they should say *"contact us before booking — some stops may not be permitted"*. Neutral wording ("LoC viewpoint") is advisable for an international audience; the brochure's wording stays in the source map.
- **Gilgit-Baltistan (PDF-S12):** Foreign nationals must register with local authorities. Babusar Pass can close because of snow (FCDO). This affects PDF-N7, PDF-K10 and PDF-S12, which all cross or visit Babusar Top.
- **Karakoram Highway / Babusar route:** The FCDO advises against travel on the KKH between Mansehra and Chilas via Besham/Dasu. The PDF-S12 route goes via **Babusar** (Naran → Chilas), which is a different road. Worth noting correctly in FAQs.
- **Swat:** The FCDO advises against all travel to Swat district. That matters if Swat becomes a published package for international visitors.

These are third-party government advisories. They describe conditions; they are not claims about Pack & Go. They change often, so the website should **link** to official advisories rather than copy them.

---

## 8. Data-quality issues found in the brochures

(Full detail with page numbers in `PDF_CONTENT_INVENTORY.md` §6.)

1. **Duplicate cost row:** "Sleeper bus / Business class train" and "Sleeper bus" are both listed at Rs 51,000 / 115,000 (PDF-N7 p3, PDF-K7 p3).
2. **Identical price tables** for two different packages (PDF-N7 p3 and PDF-K7 p3). This may be correct; confirm it is not a copy-paste leftover.
3. **Cancellation policy is ambiguous** (all PDFs, services page): a flat "50% deduction" line, then 75% at 7 days and 100% at 3 days. The base window is unclear and the "less than 3 days" sentence is truncated. Needs owner-approved rewording; the website must not reinterpret it.
4. **"Snowy" label on summer itineraries:** Rattigalli "usually opens in mid-June" (PDF-K7 p5, PDF-K10 p5), yet the trip is titled "Snowy Family Oriented Trip".
5. **PDF-S12 Day 6:** "Departure for Skardu via Deosai Plains" while the group is already in Skardu (most likely a Deosai round trip). Day 10 lists "Shugran Or Saifulamook" (alternatives, not both).
6. **PDF-S12 Day 2 / Day 11** mention a "By Air" option, but no air price is given.
7. **Truncated text** "conditions other circumstan" on the itinerary-end pages of every PDF, and "On rotation daily bas" on every meals page.
8. **Spelling:** Diparture, form (from), Tool Taxes (Toll), Jogers (joggers), Equipements, Khunrab/Khunjrab (Khunjerab), Atabad (Attabad), Saifulamook, Shoty, Sleepr, Mension, Autobhan.
   → The website should fix typography and spelling, **not meaning**. Keep a "source wording" field for audit.
9. **Text extraction:** PDF-K7 p7 (inclusions "Basic first aid kit") and p9 (T&C item 10) extract as garbled glyphs, but the **rendered pages read correctly**. Content was taken from the rendered pages.

---

## 9. Can proper individual package pages be built?

**Yes — for four packages**, each of which has a full day-by-day plan, a price table, inclusions/exclusions, meals, kids policy, T&Cs and payment info.

**Not yet** for Swat/Kalam, Kalash, Murree, Islamabad, or the 6-day tour. These become destination pages that route to a custom-trip inquiry.

To make the four package pages *bookable* rather than just *informational*, these items are still needed:

| Needed | Why |
|---|---|
| Departure dates (or "every Friday", "on demand") | Customers' first question |
| Season / price validity | Prices are 2026 brochures with no date |
| Advance-payment amount and deadline | The payment page says nothing about amounts |
| Meeting points (Karachi station? Hyderabad pickup?) | Hyderabad-based customers aren't served by the plan as written |
| Hotel names / category | "Quality accommodations" is a claim; names or star levels support it |
| Vehicle type ("Luxury Transport") | e.g. Coaster/Grand Cabin/Saloon |
| Group size min/max | Expectation setting |
| Couple-pricing explanation | Avoid looking like an error |
| Jeep / optional activity indicative costs | Large out-of-pocket items |
| Real photos with permission | Trust + rights |
| Genuine reviews (with consent) | Social proof — **none were provided; none will be invented** |

---

## 10. Things deliberately NOT done

- No prices, ratings, reviews, customer names, awards, licences or guarantees were invented.
- Follower counts, the tagline and the `imrankhanniazi2211` email are carried as **user-provided**, not verified.
- The website was not started (per the discovery-phase instruction). The only project setup was creating an asset folder and copying the brochures into it with clean filenames (see `PDF_CONTENT_INVENTORY.md` §1).

---

## Sources (external)

- Sindh Directorate of Tourist Services — https://sindhculture.gov.pk/tourist-services/
- Punjab DTS licensed agencies list — https://dts.punjab.gov.pk/system/files/RENEWED.pdf
- UK FCDO, Pakistan regional risks (updated 14 Oct 2026) — https://gov.uk/foreign-travel-advice/pakistan/regional-risks
- ProPakistani, "Govt removes NOC requirement for foreign tourists" (26 Mar 2019) — https://propakistani.pk/2019/03/26/govt-removes-noc-requirement-for-foreign-tourists/
- Dawn, "Tourists stopped from entering Neelum Valley, other areas near LoC" (2 May 2025) — https://www.dawn.com/news/amp/1907876
- Firebase, Storage pricing changes FAQ (Sept 2024) — https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024
