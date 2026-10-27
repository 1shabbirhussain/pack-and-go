# PDF Content Inventory

**Prepared:** 16 October 2026
**Method:** I ran a text extraction on every PDF (`pdftotext -layout`, one page at a time), rendered every page to an image and checked it by eye, and pulled out and de-duplicated the embedded images. Where the text layer was garbled, I took the content from the rendered page instead.
**Rule:** Itinerary and policy text below keeps the brochure's wording. Spelling is left exactly as printed, with `[sic]` added only where needed for clarity. Normalised wording for the website belongs in the CMS, which keeps a link back to this source.

---

## 1. File register

| Code | Original filename | Project path (renamed copy) | Pages | Size | Title metadata | Created (PDF metadata) | MD5 |
|---|---|---|---|---|---|---|---|
| **PDF-N7** | `Naran Shogran Babusar Top 7days.pdf` | `assets/brochures/naran-shogran-babusar-7-days.pdf` | 10 | 3.6 MB | "Naran Shogran Babusar Top 7days" | 14 Apr 2026 08:32 PKT | `8585065237e5b0ba39e47f9248511ca4` |
| **PDF-K7** | `Kashmir 7 days.pdf` | `assets/brochures/kashmir-7-days.pdf` | 10 | 3.7 MB | "Kashmir 7 days" | 14 Apr 2026 08:38 PKT | `cb7a4882cfbea7b10b950347b7d27ee7` |
| **PDF-K10** | `new Kashmir 10days.pdf` | `assets/brochures/kashmir-10-days.pdf` | 11 | 3.7 MB | "new Kashmir 10days" | 14 Apr 2026 09:15 PKT | `ed5f22a375a08d4fa368a3e1a3dfd1c6` |
| **PDF-S12** | `12 days skardu hunza and Naran.pdf` | `assets/brochures/skardu-hunza-naran-12-days.pdf` | 11 | 4.8 MB | "Naran Skardu1" | 14 Apr 2026 11:57 PKT (modified 15:10) | `6c981624fa7a7d525bb16473f48fe84a` |

All four are A4 portrait files exported from Adobe Illustrator CC 23.0, with Poppins fonts embedded.

**Duplicates:** None of the files is a byte-level duplicate (all MD5 hashes differ). All four use the **same template**, and about 40% of each one is shared boilerplate (services, meals, kids policy, T&C, payment). See §5.
**Outdated:** All four were created on the same day (14 Apr 2026), and none states a season or validity date. The "new" in `new Kashmir 10days.pdf` hints that an older version once existed. **[M]** Ask whether any older Kashmir 10-day brochure is still in circulation.
**Web readiness:** At 3.6–4.8 MB each they are heavy for mobile data. Plan to serve a compressed web copy (about 1–1.5 MB at 150 dpi) and keep the originals as the "print quality" download.

---

## 2. Page-structure map (shared template)

| Section | PDF-N7 | PDF-K7 | PDF-K10 | PDF-S12 | Website use |
|---|---|---|---|---|---|
| Cover (title, durations, contacts, "Approved by FBR") | p1 | p1 | p1 | p1 | Package hero; PDF thumbnail |
| Attraction Point | p2 | p2 | p2 | p2 | "Highlights" chips / map points |
| Trip Cost | p3 | p3 | p3 | p3 | Price table (structured data) |
| Trip Plan (day-by-day) | p4–p6 | p4–p6 | p4–p7 | p4–p7 | Itinerary accordion/timeline |
| Our Services (Inclusions / Exclusions / Equipment / Cancellation) | p7 | p7 | p8 | p8 | Inclusions & policies tabs |
| Meals Menu + Kids Policy | p8 | p8 | p9 | p9 | Meals block; kids-pricing note |
| Terms & Conditions | p9 | p9 | p10 | p10 | Global T&C page + package link |
| Payment Procedure | p10 | p10 | p11 | p11 | Payment instructions (admin settings) |

---

## 3. Package-by-package content

### 3.1 PDF-N7 — Naran Shogran Babusar Top & Saifulmalook Lake

**Cover (p1):** "IS PRESENTING" · From Islamabad **04 – DAYS** · From Karachi **07 – DAYS** · title "NARAN SHOGRAN BABUSAR TOP & SAIFULMALOOK LAKE" · phones `+92-310-786-9147 I +92-301-349-9147` · Karachi and Hyderabad office addresses · "Approved by FBR".

**Attraction Point (p2):** Hazara Motorway · Hazara Tunnels · Balakot City · Kewaii Waterfall · Shogran · Siri Paye · Kaghan Valley · Naran City · Naran Bazaar · Saif-ul-malook Lake · Batakundi · Piyala Lake · Lulusar Lake · Babusar Pass · Babusar Top (Peak Point Of Kaghan Valley) · Kunhar River · River Rafting · Zipline & Other Activities.

**Trip Cost (p3):**

| From | Option | Per person | Per couple |
|---|---|---|---|
| Islamabad | Price | Rs 25,000 | Rs 60,000 |
| Karachi | Economy train | Rs 36,000 | Rs 85,000 |
| Karachi | Sleeper bus / Business class train | Rs 51,000 | Rs 115,000 |
| Karachi | Executive bus | Rs 44,000 | Rs 100,000 |
| Karachi | Sleeper bus | Rs 51,000 | Rs 115,000 |

Note (p3): "The client agrees to bear any additional charges arising from fuel price increases occurring before or during the trip. Such charges are compulsory and non-negotiable."

**Trip Plan — "SNOWY FAMILY ORIENTED TRIP" (p4–p6):**

| Day | Page | Plan (source wording) | Overnight |
|---|---|---|---|
| 01 | p4 | FROM KARACHI — Departure form [sic] Karachi (No Food) | In transit |
| 02 | p4 | Arrival At Islamabad Bus Stop · Move To Hotel Check-in Rooms · Dinner At 9.00 Pm · Night Stay At Islamabad | Islamabad |
| 03 | p4 | Departure For Naran Via Hazara motorway · Breakfast At Balakot/kawaii · Short Stay At Kewaii Waterfall · Shift into jeeps for Shogran and Siri Paye (jeep charges not included) · Reached Naran Valley · Check-in Hotel · Dinner And Night Stay At Naran | Naran |
| 04 | p5 | Breakfast Early In The Morning in Naran Bazar · Towards Babu sar top · Explore Bata kundi · Explore Piyala Lake · Continue Travelling To Lulusar Lake · Explore Lulusar Lake · Free Time To Explore Babusar Top (The highest Point Of Kaghan Valley) · Moving Back To Naran Valley · River Rafting At Kunhaar River · Explore Kunhaar River · Dinner And Night Stay At Naran Valley (Bonfire + Bbq Night) | Naran |
| 05 | p5 | Wake up early in the morning Breakfast in Naran Bazar · Get into Jeeps Towards Saif ul Malook (jeep charges not included) · Back to Naran Bazar · Travelling To Balakot · Explore Missing Point On The Way · Sightseeing On The Way Reach Balakot · Dinner At Night Stay At Balakot | Balakot |
| 06 | p6 | Breakfast · Move to Islamabad · Sightseeing on way · Drop to buss [sic] stop | In transit |
| 07 | p6 | Reach Karachi Home Safely... | — |

p6 note: "NOTE : Plan or stays may be adjusted according to weather conditions other circumstan" (truncated in source).

**Derived (not printed):** 4 hotel nights (Islamabad ×1, Naran ×2, Balakot ×1). Islamabad guests take part on Days 03–06, which matches the "04 – DAYS" on the cover.

**Proposed website use:** Full package page `/tours/naran-shogran-babusar-saiful-malook`. Optional jeep legs get a "Not included" badge.

---

### 3.2 PDF-K7 — Kashmir, Neelum Valley, Arang Kel & Rattigalli Lake

**Cover (p1):** From Islamabad **04 – DAYS** · From Karachi **07 – DAYS** · title "KASHMIR, NEELUM VALLEY ARANG KEL & RATTIGALLI LAKE" · same contacts/addresses/FBR badge as PDF-N7.

**Attraction Point (p2):** Islamabad · Murree · Ayubia · Muzaffarabad · Kashmir · Dhani Waterfall · Kutton Waterfall · LOC Indian Border · Keran · Rattigalli Lake · Neelum Valley · Sharda · Kel · Arang Kel · Neelum River · Kashmir Abshar · Kohala Bridge · Ath Mukam.

**Trip Cost (p3):** **Identical to PDF-N7 p3**, including the duplicate "Sleeper bus" row:

| From | Option | Per person | Per couple |
|---|---|---|---|
| Islamabad | Price | Rs 25,000 | Rs 60,000 |
| Karachi | Economy train | Rs 36,000 | Rs 85,000 |
| Karachi | Sleeper bus / Business class train | Rs 51,000 | Rs 115,000 |
| Karachi | Executive bus | Rs 44,000 | Rs 100,000 |
| Karachi | Sleeper bus | Rs 51,000 | Rs 115,000 |

The fuel-surcharge note is the same as PDF-N7.

**Trip Plan — "SNOWY FAMILY ORIENTED TRIP" (p4–p6):**

| Day | Page | Plan (source wording) | Overnight |
|---|---|---|---|
| 01 | p4 | FROM KARACHI — Departure form Karachi (No Food) | In transit |
| 02 | p4 | Arrival At Islamabad Bus Stop - Pick up · Move To Islamabad Hotel · Check-in Rooms - Dinner · Night Stay At Islamabad | Islamabad |
| 03 | p4 | Wake up 8.00 AM - Breakfast · Diparture [sic] For Kashmir · Head on towards Muzaffarabad via Murree Expressway · Short stop at Kohala · Short Stay At Kashmir Abshar · Reach Muzaffarabad · Lunch Break At Muzaffarabad · Move for Neelum Valley · Visit Dhani Waterfall · Short Stay At LOC Indian Border · Continue Journey towards Sharda · Dinner and Night stay at Sharda | Sharda |
| 04 | p5 | Wake up 8.00 AM · Breakfast At 8.30 AM · Start Jeep ride towards Kel · Reach Kel and Cable car & Short Trek Towards Arang Kel (30-40 Mins Trek) · Explore the Beautiful surroundings of Arang Kel · Spend the Day at Arang Kel · Back to Kel and then to Sharda in the evening · Dinner and Night stay at Sharda | Sharda |
| 05 | p5 | Wake Up 8.00 AM · Breakfast At 8.30 AM · Move To Dhuariyan · Reach Dhuariyan · Transfer Into Jeeps and Move To Rattigalli Lake · Reach Rattigalli Base Camp · Start Hiking To Lake · Reach Rattigalli Lake And Spend Some Quality Time At Rattigalli Lake · Return Tu [sic] Dhuariyan · Move To Keran · Dinner And Night Stay At Keran Neelum Valley | Keran |
| 06 | p6 | Wake Up At 8.00 AM · Breakfast At 8.30 AM · Departure for Islamabad · Short Stay At LOC Indian Border · Short Stay At Dhani Waterfall · Short Stay At Kutton Waterfall · Short Stay At Kohala Bridge · Short At Kashmir Abshar · Continue Travelling To Islamabad Via Murree Expressway · Reach Islamabad drop at bus stop and move to karachi | In transit |
| 07 | p6 | Reach Karachi Home Safely... | — |

p5 note: "Rattigali Lake usually opens in mid-June. If it is accessible at the time of our trip, we will prefer visiting Rattigali; otherwise, we will proceed to Taobat."
p6 note: "Plan or stays may be adjusted according to weather conditions other circumstan" (truncated).

**Derived:** 4 hotel nights (Islamabad ×1, Sharda ×2, Keran ×1). Murree, Ayubia and Ath Mukam appear in the attractions list but not in the day plan (Murree only as "via Murree Expressway").

**Proposed website use:** Full package page `/tours/kashmir-neelum-arang-kel-ratti-gali`, with a seasonal note (Rattigalli from mid-June, Taobat as the alternative) and an **access advisory** (see RESEARCH_NOTES §7).

---

### 3.3 PDF-K10 — Kashmir & Naran Valley

**Cover (p1):** From Islamabad **07 – DAYS** · From Karachi **10 – DAYS** · title "KASHMIR & NARAN VALLEY" · same contacts/FBR badge.

**Attraction Point (p2):** Islamabad · Muzaffarabad · Neelum point · Dhani waterfall · LOC · Kutton waterfall · Sharda Old university · Kashmir abshar · Arang kel (if accessible) · Upper neelum · Keran · Ratti gali lake · Naran · Babusartop · Balakot · Kewai Waterfall · Saifulmalook Lake · Naran Bazar · Lulusar Lake · Shogran · Sri Paye.

**Trip Cost (p3)** — header "10 DAYS TRIP 7 NIGHTS":

| From | Option | Per person | Per couple |
|---|---|---|---|
| Islamabad | Price | Rs 34,000 | Rs 80,000 |
| Karachi | Economy train | Rs 47,000 *(printed "RS: 47000")* | Rs 112K |
| Karachi | Executive bus | Rs 54,000 | Rs 126K |
| Karachi | Sleeper bus / Business class train | Rs 64,000 | Rs 148K |
| Karachi | Greenline Economy | Rs 51,000 | Rs 120K |

The fuel-surcharge note is the same as the other PDFs.

**Trip Plan — "SNOWY FAMILY ORIENTED TRIP" (p4–p7):**

| Day | Page | Plan (source wording) | Overnight |
|---|---|---|---|
| 01 | p4 | FROM KARACHI — Departure form Karachi (No Food) | In transit |
| 02 | p4 | Arrival At Islamabad Bus Stop - Pick up · Move To Islamabad Hotel · Check-in Rooms - Dinner · Night Stay At Islamabad | Islamabad |
| 03 | p4 | Same as PDF-K7 Day 03 (Murree Expressway → Kohala → Kashmir Abshar → Muzaffarabad lunch → Neelum Valley → Dhani Waterfall → LOC Indian Border → Sharda) | Sharda |
| 04 | p5 | Same as PDF-K7 Day 04 (Jeep to Kel, cable car, 30–40 min trek to Arang Kel), ending "Dinner and Night stay at Sharda/keran" | Sharda/Keran |
| 05 | p5 | Same as PDF-K7 Day 05 (Dhuariyan → jeeps → Rattigalli base camp → hike → back → Keran) | Keran |
| 06 | p6 | Wake Up At 8.00 AM · Breakfast At 8.30 AM · Departure for BALAKOT · Short Stay At LOC Indian Border · Short stay at muzaffarabad view point · OVERNIGHT STAY AT BALAKOT | Balakot |
| 07 | p6 | Breakfast · Departure for Naran · Short Stay At Kewaii Waterfall · Shift into jeeps for Shogran and Siri Paye (jeep charges not included) · Reached Naran Valley · Check-in Hotel · Dinner And Night Stay At Naran | Naran |
| 08 | p6 | Same as PDF-N7 Day 04 (Batakundi, Piyala Lake, Lulusar Lake, Babusar Top, rafting at Kunhar, Bonfire + BBQ night) | Naran |
| 09 | p7 | Wake up early in the morning Breakfast in Naran Bazar · Get into Jeeps Towards Saif ul Malook (jeep charges not included) · Back to Naran Bazar · Travelling To Islamabad · Drop to buss stop | In transit |
| 10 | p7 | Reach Karachi Home Safely. | — |

p5 note: the Rattigali mid-June / Taobat note again. p6 and p7 notes: "Plan or stays may be adjusted according to weather conditions other circumstan".

**Derived:** 7 hotel nights (Islamabad, Sharda, Sharda/Keran, Keran, Balakot, Naran, Naran), which matches "7 NIGHTS". Islamabad guests take part on Days 03–09, matching "07 – DAYS". This package is effectively **PDF-K7 Days 1–5 + PDF-N7 Days 3–5**. The website can model it from shared "day templates".

**Proposed website use:** Full package page `/tours/kashmir-naran-10-days`, the flagship "combo". It carries the same Kashmir access advisory.

---

### 3.4 PDF-S12 — Naran, Hunza & Skardu

**Cover (p1):** From Islamabad **8 – DAYS** · From Karachi **12 – DAYS** · title "NARAN, HUNZA & SKARDU" · same contacts/FBR badge.

**Attraction Point (p2):** Islamabad · Balakot · Kewai Abshar · Kaghan · Naran · Batakundi · Jhalkad · Besel · Lulusar Lake · Babusar Pass · Chilas · Raikot Bridge · Nanga Parbat View Point · 3 Mountain Junction Point · Rakaposhi View Point · Attabad Lake & Tunnel · Passu · Sost · Gulmit · Karimabad Bazar · Altit Fort · Khunjrab Pass (If possible) · Soq valley · Shangrila Resort · Kachura lake · Mantokha waterfall · Cold Desert · Shigar fort · Jeeps Safari Deosai · Deosai Plain · Sadpara Lake · Bara Pani, Kala Pani · Sheosar Lake.

**Trip Cost (p3):**

| From | Option | Per person | Per couple |
|---|---|---|---|
| Islamabad | Price | Rs 40,000 | Rs 95,000 |
| Karachi | Economy train | Rs 54,000 | Rs 128,000 |
| Karachi | Faisal movers executive bus | Rs 62,000 | Rs 144,000 |
| Karachi | Pak Exp/Rehman baba Lower ac train | Rs 65,000 | Rs 152,000 |
| Karachi | Sleepr [sic] bus | Rs 70,000 | Rs 162,000 |

The fuel-surcharge note is the same as the other PDFs. **No "By Air" price**, although the itinerary mentions air guests.

**Trip Plan — "FAMILY ORIENTED TRIP" (p4–p7):**

| Day | Page | Plan (source wording) | Overnight |
|---|---|---|---|
| 01 | p4 | FROM KARACHI — Departure form Karachi (No Food) | In transit |
| 02 | p4 | Departure of By Air Guest from Karachi · Arrival at Rawalpindi station/ Bus terminal · Short Stay at ISB/RWP for Karachi Package Guest · Dinner at hotel in Islamabad for Karachi members 10:00 PM (Dinner) | Islamabad/Rawalpindi |
| 03 | p4 | Gathering at Meeting Point 4:00 AM · Departure for Chilas 06:30 AM · Breakfast at Balakot · Short stay: Kewai Kaghan, Lulusar lake, Babusar top · Arival and night stay in chillas (BF-Dinner) | Chilas |
| 04 | p4 | Early Morning Breakfast · Departure for Skardu · Short Stay at: Nanga Parbat View Point, Astak Nalla · Visit Shangrila Resort · Soq valley · kachura lake · Night Stay at Skardu or kachura (BF-Dinner) | Skardu/Kachura |
| 05 | p5 | Breakfast · Departure for Shigar Valley · Exploration of Shigar Fort · Safaranga Cold Desert · Mantoka Waterfall · Dinner & Night stay at Skardu (BF-Dinner) | Skardu |
| 06 | p5 | Breakfast · Departure for Skardu Via Deosai Palins [sic] · Get into 4x4 Jeeps · Visit & Explore: Sadpara Dam, Sheosar Lake, Kala Pani & Bara Pani, Shoutang Nala & Sadpara dam · Arrival & Dinner at Skardu · Night Stay Skardu (BF-Dinner) | Skardu |
| 07 | p5 | Breakfast · Departure for hunza · Shoty [sic] stay at astak nala · Visit Rakaposhi view point · Altit fort · Karimabad city · Overnight stay at hunza | Hunza |
| 08 | p6 | breakfast · Departure for atabad lake · Visit Atabad lake · Passu cones · Hussaini bridge · Khunrab pass (if possible) · Back to hotel · Overnight stay at hunza | Hunza |
| 09 | p6 | Breakfast Departure for Kagan Via Babusar pass · River Rafting · Visit Leftover place on the way · Arrival Naran · Dinner & Night Stay Naran (BF-Dinner) | Naran |
| 10 | p6 | Breakfast · Back to Islamabad · Shugran Or Saifulamook · Siri paye · Continue drive to ISB · Arrival & Drop ISB Guest at Islamabad · Karachi Package Check in Hotel · Dinner & Night Stay at Hotel (BF – Dinner) | Islamabad (Karachi guests) |
| 11 | p7 | Get into Train by your own · Departure for Karachi · Note: By Air option also available and will depart for Karachi on this day | In transit |
| 12 | p7 | Arrival Karachi | — |

p7 note: "Plan or stays may be adjusted according to weather conditions other circumstan".

**Derived:** Islamabad guests take part on Days 03–10 (8 days, matching the cover). Karachi guests get 9 hotel nights. Day 6 is most likely a Deosai round trip from Skardu (wording needs confirmation). Day 10's "Shugran Or Saifulamook" is an either/or choice.

**Proposed website use:** Full package page `/tours/naran-hunza-skardu-12-days`, the "premium/longest" tour. It needs a GB registration note for foreign nationals and a Babusar-closure seasonal note.

---

## 4. Embedded imagery (per PDF)

Extracted to `discovery/extracted-images/` (51 unique files after de-duplication by MD5; filenames are `<pdf>-<page>-<index>`).

| PDF | Cover (p1) | Other photos | Shared assets |
|---|---|---|---|
| N7 | Waterfall/river and mountain lake scenes (720×900, 500×499) | p3: snow peaks reflected in a lake (1738×1000) | Food photos (meals page), Faysal Bank logo, handshake icon, dashed-route map pin |
| K7 | Woman with guitar in snow, horses on a meadow, man on a cliff, Faisal Mosque aerial, boat between rock pinnacles | p3: turquoise lake in barren mountains (1030×687) — **location unconfirmed** | as above |
| K10 | Same cover photo set as K7 | Same p3 image as K7 | as above |
| S12 | Pagoda-style resort on a lake (Shangrila-type), autumn tree road, meadow with horse (1280×800, 1080×720, 1920×1280) | p3: lakeside resort with red roofs (1160×873) | as above |

**Rights status: unknown for every photo [M].** The food and lifestyle photos look like stock. Do not reuse them on the website without confirmation. The Faysal Bank logo is a third-party mark.

---

## 5. Shared boilerplate (identical in all four PDFs)

**Pages:** N7 p7–p10 · K7 p7–p10 · K10 p8–p11 · S12 p8–p11.
Only the page numbers differ. The wording was compared and is identical, apart from the text-layer glyph corruption in K7 noted in §6.

**Inclusions:** 2 Meal BF and Dinner · Luxury Transport · Tool [sic] Taxes · Services of a Guide · Basic first aid kit · Hotel Accommodation (3/4 Pax Sharing)

**Exclusions:** Tea, Mineral water and Cold drinks expense · Heater charges · Tickets of Fort, Boating other entry tickets · Jeep charges · vehicle use incase of road blockage/ any extra expense · Anything not mentioned above in services included section

**Equipments to bring:** Day Bag, Rain coat, Sun block, Sunglasses, Warm clothes, Power banks, Jogers, Slipper, Jackets — "All participants must bring their ID cards with them"

**Cancellation Policy (verbatim structure):**
- "Seat cancellation policy is given below …… 50% Deduction"
- "If informed for cancellation 7 days before the trip …… 75% Deduction"
- "If informed for cancellation 3 days before the trip …… 100% Deduction"
- Footer, in red: "If informed for cancellation in less than 3 days before the trip. "No amount will be refund if any person leaves the trip at any stage due to any reason""

→ **Ambiguous; owner must rewrite.** (When does 50% apply? Is 100% at 3 days or at less than 3 days?)

**Meals Menu:** Breakfast: Egg (Omelette), Paratha, Chany, Tea. Dinner (on rotation): Chicken Karahi + Roti/Nan + Raita + Salad + Cold Drink · BBQ + Roti/Nan + Raita + Salad + Cold Drink · Chicken Biryani + Raita + Salad + Cold Drink.
Note: the cold drink appears in the dinner menu but "Cold drinks expense" is an exclusion. Read this as "with dinner only"; confirm.

**Kids Policy:** Under 3 year — Free without Seat · 3 to 8 year — 50% charge with jumper seat · 8 year Above — Consider Adults Fully Charged.
(The boundary case "exactly 8" is ambiguous; confirm.)

**Terms & Conditions (10 items + fuel clause):**
1. No unethical activity (misbehaviour, abusive language, drugs); may be terminated from tour without refund.
2. No illegal or prohibited items; weapons and drugs not allowed.
3. On mountain roads the vehicle AC will be switched on and off to prevent overheating.
4. Trip plan can be altered due to weather, political or other reasons; organisers not responsible.
5. Organiser may cancel the trip without prior notice; participants receive a full refund of the advance amount only.
6. Every possible care is taken, but natural disasters/accidents cannot be ruled out; company, group leader and organisers not responsible.
7. Organisers not responsible for theft, loss or damage to personal belongings.
8. Trips are environment-friendly; no environmental damage tolerated.
9. Trips are **not insured**; not responsible for natural calamities or accidents.
10. No conflict or violence, verbal or physical; respect cultures, religions, beliefs, and political & geographical affiliations.
+ Fuel-price surcharge clause (as on cost page).

(The summaries above are for this inventory only. **The website must publish the owner-approved full text**, kept as one shared `policies/terms` document.)

**Payment Procedure:** Account Details — Faysal Bank — 3650 4990 0000 2454 — PACK AND GO. Footer repeats both phones and both addresses.

---

## 6. Issues register (by page)

| # | File / page | Issue | Severity | Action |
|---|---|---|---|---|
| 1 | N7 p3, K7 p3 | "Sleeper bus" duplicates "Sleeper bus / Business class train" (same prices) | Medium | Owner to confirm the correct row set |
| 2 | N7 p3 vs K7 p3 | Two different packages with identical price tables | Medium | Confirm, or correct the Kashmir prices |
| 3 | All, cost page | Couple price > 2× per-person price, with no explanation | High | Confirm meaning (private room?) and add an explainer |
| 4 | All, cost page | No validity date, season or departure dates | High | Collect per departure |
| 5 | All, services page | Ambiguous cancellation tiers; truncated sentence | High (legal/trust) | Owner-approved rewrite |
| 6 | All, itinerary end | Truncated "conditions other circumstan" | Low | Fix wording in CMS |
| 7 | All, meals page | Truncated "On rotation daily bas"; cold drink vs exclusion | Low | Clarify |
| 8 | N7/K7/K10 p4 | "Snowy" label on summer-season trips | Low | Confirm marketing label |
| 9 | K7 p6, K10 p6, K7/K10 p4 | "LOC Indian Border" stops; access can be restricted (see Research §7) | High for international visitors | Advisory notice; neutral wording |
| 10 | S12 p5 | Day 6 "Departure for Skardu via Deosai" while already in Skardu | Medium | Confirm route |
| 11 | S12 p4/p7 | "By Air" option mentioned, not priced | Medium | Get air price or remove |
| 12 | All, cover | "Approved by FBR" — tax registration shown as approval | Medium (trust/accuracy) | Reword; add DTS licence if held |
| 13 | All | No email address in any PDF | Low | Add on next brochure revision |
| 14 | All | No Hyderabad pickup, although HQ is in Hyderabad | Medium | Confirm pickup points |
| 15 | K7 p7, p9 | Text layer glyph-corrupted ("Basic first aid kit", T&C #10) | Low (search/accessibility) | Re-export PDFs with Unicode text; content checked from render |
| 16 | All | 3.6–4.8 MB files | Medium (mobile) | Provide an optimised web version |
| 17 | K7/K10 p3 | Photo possibly not of Kashmir | Low | Don't caption as Kashmir |
| 18 | All | Images of unknown rights | Medium (legal) | Replace or confirm licences |

---

## 7. Recommended website use — summary

| PDF | Becomes | Status |
|---|---|---|
| N7 | Package page + downloadable brochure | **Ready**, pending items 1, 3–5 |
| K7 | Package page + brochure + advisory | **Ready**, pending items 1–5, 9 |
| K10 | Package page + brochure + advisory | **Ready**, pending items 3–5, 9 |
| S12 | Package page + brochure + GB note | **Ready**, pending items 3–5, 10, 11 |
| Shared pages | Global *Policies* page (T&C, cancellation, kids, payment) + reusable inclusion/exclusion sets | Needs item 5 |
