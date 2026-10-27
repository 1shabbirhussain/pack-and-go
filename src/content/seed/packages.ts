/**
 * The four tour packages, transcribed from the official Pack & Go brochures (created 14 Apr 2026).
 * Every day and price carries its source page. Spelling is normalised; meaning is preserved.
 * Unresolved questions live in `reviewFlags` (admin-only) and ambiguous price rows are kept with
 * status "needs_review" so they are hidden from the public site until the owner confirms them.
 */
import type { TourPackage } from "@/lib/schema";
import {
  AJK_ADVISORY, BABUSAR_NOTE, COUPLE_PRICE_NOTE, FUEL_CLAUSE, GB_NOTE, PHOTOS,
  STANDARD_BREAKFAST, STANDARD_DINNER, STANDARD_EXCLUSIONS, STANDARD_INCLUSIONS,
  STANDARD_KIDS_POLICY, STANDARD_MEALS_NOTE, STANDARD_PACKING, WEATHER_NOTE,
} from "./shared";

const common = {
  currency: "PKR" as const,
  priceValidity: "Prices as published in the April 2026 brochure. Please confirm current prices and departure dates with our team.",
  inclusions: STANDARD_INCLUSIONS,
  exclusions: STANDARD_EXCLUSIONS,
  mealsBreakfast: STANDARD_BREAKFAST,
  mealsDinner: STANDARD_DINNER,
  mealsNote: STANDARD_MEALS_NOTE,
  kidsPolicy: STANDARD_KIDS_POLICY,
  packingList: STANDARD_PACKING,
};

const COMMON_FLAGS = [
  "Prices have no validity date or season in the brochure — confirm they are current.",
  "No departure dates, group size, hotel names or vehicle type are stated in the brochure.",
  "Per-couple price is more than twice the per-person price — confirm what the couple rate includes.",
  "Cancellation policy wording in the brochure is ambiguous — owner to approve the website wording.",
];

const it = (text: string, optional = false, note = "") => ({ text, optional, note });

export const SEED_PACKAGES: TourPackage[] = [
  /* ───────────── PDF-N7 ───────────── */
  {
    id: "naran-shogran-babusar-saiful-malook",
    status: "published",
    order: 1,
    featured: true,
    title: "Naran, Shogran, Babusar Top & Saif-ul-Malook Lake",
    sourceTitle: "NARAN SHOGRAN BABUSAR TOP & SAIFULMALOOK LAKE",
    tagline: "Kaghan Valley's classic loop — meadows, alpine lakes and the top of Babusar.",
    summary:
      "A family-oriented group tour through the Kaghan Valley: Kewai Waterfall and the Shogran–Siri Paye meadows, a full day up to Batakundi, Lulusar Lake and Babusar Top with river rafting on the Kunhar, a bonfire and BBQ night, and a jeep trip to Saif-ul-Malook Lake.",
    labels: ["Family oriented", "Bonfire & BBQ night", "River rafting"],
    destinationIds: ["naran-kaghan"],
    heroImage: PHOTOS.glacierLake,
    images: [PHOTOS.glacierLake, PHOTOS.snowPeaksReflection, PHOTOS.pineFootbridge],
    durations: { karachi: { days: 7, nights: 4 }, islamabad: { days: 4, nights: 3 } },
    highlights: [
      "Hazara Motorway & tunnels", "Balakot", "Kewai Waterfall", "Shogran", "Siri Paye", "Kaghan Valley",
      "Naran Bazaar", "Saif-ul-Malook Lake", "Batakundi", "Piyala Lake", "Lulusar Lake", "Babusar Top",
      "Kunhar River rafting", "Zipline & other activities",
    ],
    itinerary: [
      { day: 1, audience: "karachi", title: "Depart Karachi", items: [it("Departure from Karachi (no meals on this day)")], overnight: "In transit", meals: "", sourcePage: 4 },
      { day: 2, audience: "karachi", title: "Arrive Islamabad", items: [it("Arrival at Islamabad bus stop"), it("Move to hotel and check in"), it("Dinner at 9:00 pm")], overnight: "Islamabad", meals: "Dinner", sourcePage: 4 },
      { day: 3, audience: "all", title: "Islamabad → Naran via Kewai & Shogran", items: [
        it("Depart for Naran via the Hazara Motorway"), it("Breakfast at Balakot / Kewai"), it("Short stop at Kewai Waterfall"),
        it("Jeeps to Shogran and Siri Paye", true, "Jeep charges not included"), it("Reach Naran Valley and check in"),
      ], overnight: "Naran", meals: "Breakfast, dinner", sourcePage: 4 },
      { day: 4, audience: "all", title: "Batakundi, Lulusar Lake & Babusar Top", items: [
        it("Early breakfast in Naran Bazaar"), it("Drive towards Babusar Top"), it("Explore Batakundi"), it("Explore Piyala Lake"),
        it("Explore Lulusar Lake"), it("Free time at Babusar Top, the highest point of the Kaghan Valley"), it("Back to Naran Valley"),
        it("River rafting on the Kunhar River"), it("Bonfire and BBQ night in Naran"),
      ], overnight: "Naran", meals: "Breakfast, dinner (BBQ)", sourcePage: 5 },
      { day: 5, audience: "all", title: "Saif-ul-Malook Lake → Balakot", items: [
        it("Early breakfast in Naran Bazaar"), it("Jeeps to Saif-ul-Malook Lake", true, "Jeep charges not included"), it("Back to Naran Bazaar"),
        it("Travel to Balakot, visiting places missed on the way"), it("Sightseeing en route"),
      ], overnight: "Balakot", meals: "Breakfast, dinner", sourcePage: 5 },
      { day: 6, audience: "all", title: "Balakot → Islamabad", items: [it("Breakfast"), it("Drive to Islamabad with sightseeing on the way"), it("Drop at the bus stop")], overnight: "In transit (Karachi travellers)", meals: "Breakfast", sourcePage: 6 },
      { day: 7, audience: "karachi", title: "Arrive Karachi", items: [it("Reach Karachi home safely")], overnight: "", meals: "", sourcePage: 6 },
    ],
    priceOptions: [
      { id: "isb", origin: "islamabad", label: "From Islamabad", perPerson: 25000, perCouple: 60000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-economy-train", origin: "karachi", label: "Economy train", perPerson: 36000, perCouple: 85000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-sleeper-business", origin: "karachi", label: "Sleeper bus / Business class train", perPerson: 51000, perCouple: 115000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-executive-bus", origin: "karachi", label: "Executive bus", perPerson: 44000, perCouple: 100000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-sleeper-bus", origin: "karachi", label: "Sleeper bus", perPerson: 51000, perCouple: 115000, status: "needs_review", note: "Duplicate of the 'Sleeper bus / Business class train' row in the brochure — hidden until confirmed.", sourcePage: 3 },
    ],
    priceNotes: [COUPLE_PRICE_NOTE, FUEL_CLAUSE],
    importantNotes: [WEATHER_NOTE, "Jeep rides to Shogran, Siri Paye and Saif-ul-Malook are not included in the package price."],
    advisories: [BABUSAR_NOTE],
    brochureIds: ["naran-shogran-babusar-7-days"],
    reviewFlags: [
      "Brochure lists 'Sleeper bus' twice (same price as 'Sleeper bus / Business class train'). Duplicate row hidden pending confirmation.",
      "Brochure itinerary is titled 'Snowy family oriented trip' — confirm the season this tour runs.",
      ...COMMON_FLAGS,
    ],
    source: { document: "Naran Shogran Babusar Top 7days.pdf", page: 1, note: "Itinerary p4–6, prices p3, services p7–10" },
    seoTitle: "Naran, Babusar Top & Saif-ul-Malook Tour from Karachi",
    seoDescription: "7-day Naran, Kaghan & Babusar Top group tour from Karachi (4 days from Islamabad) with Shogran, Lulusar Lake, rafting and Saif-ul-Malook. Breakfast & dinner included.",
    ...common,
  },

  /* ───────────── PDF-K7 ───────────── */
  {
    id: "kashmir-neelum-arang-kel-ratti-gali",
    status: "published",
    order: 2,
    featured: true,
    title: "Kashmir, Neelum Valley, Arang Kel & Ratti Gali Lake",
    sourceTitle: "KASHMIR, NEELUM VALLEY ARANG KEL & RATTIGALLI LAKE",
    tagline: "Waterfalls, the Neelum River and two of Kashmir's most loved high places.",
    summary:
      "Into Azad Kashmir via Kohala and Muzaffarabad, then up the Neelum Valley past Dhani and Kutton waterfalls to Sharda. Take the cable car and short trek to Arang Kel, and a jeep and hike to Ratti Gali Lake (seasonal, with Taobat as the alternative) before returning via Keran.",
    labels: ["Family oriented", "Cable car & short trek", "Seasonal lake"],
    destinationIds: ["kashmir-neelum"],
    heroImage: PHOTOS.meadowRiders,
    images: [PHOTOS.meadowRiders, PHOTOS.riverValley],
    durations: { karachi: { days: 7, nights: 4 }, islamabad: { days: 4, nights: 3 } },
    highlights: [
      "Murree Expressway", "Kohala Bridge", "Kashmir Abshar", "Muzaffarabad", "Neelum Valley", "Dhani Waterfall",
      "Kutton Waterfall", "Sharda", "Kel", "Arang Kel", "Ratti Gali Lake", "Keran", "Neelum River", "Ath Muqam",
    ],
    itinerary: [
      { day: 1, audience: "karachi", title: "Depart Karachi", items: [it("Departure from Karachi (no meals on this day)")], overnight: "In transit", meals: "", sourcePage: 4 },
      { day: 2, audience: "karachi", title: "Arrive Islamabad", items: [it("Arrival at Islamabad bus stop and pick-up"), it("Move to Islamabad hotel and check in"), it("Dinner")], overnight: "Islamabad", meals: "Dinner", sourcePage: 4 },
      { day: 3, audience: "all", title: "Islamabad → Muzaffarabad → Neelum Valley → Sharda", items: [
        it("Wake up 8:00 am, breakfast"), it("Depart for Kashmir via the Murree Expressway"), it("Short stop at Kohala"),
        it("Short stop at Kashmir Abshar"), it("Lunch break in Muzaffarabad"), it("Continue into the Neelum Valley"),
        it("Visit Dhani Waterfall"), it("Short stop at the LoC viewpoint", false, "Subject to official access on the day"), it("Continue to Sharda"),
      ], overnight: "Sharda", meals: "Breakfast, dinner", sourcePage: 4 },
      { day: 4, audience: "all", title: "Kel & Arang Kel", items: [
        it("Wake up 8:00 am, breakfast 8:30 am"), it("Jeep ride towards Kel", true, "Jeep charges not included"),
        it("Cable car and short trek to Arang Kel (30–40 minutes)"), it("Explore the surroundings and spend the day at Arang Kel"),
        it("Back to Kel and on to Sharda in the evening"),
      ], overnight: "Sharda", meals: "Breakfast, dinner", sourcePage: 5 },
      { day: 5, audience: "all", title: "Ratti Gali Lake → Keran", items: [
        it("Wake up 8:00 am, breakfast 8:30 am"), it("Move to Dhuariyan"), it("Transfer into jeeps to Ratti Gali base camp", true, "Jeep charges not included"),
        it("Hike to Ratti Gali Lake and spend quality time there"), it("Return to Dhuariyan"), it("Move to Keran, Neelum Valley"),
      ], overnight: "Keran", meals: "Breakfast, dinner", sourcePage: 5 },
      { day: 6, audience: "all", title: "Keran → Islamabad", items: [
        it("Wake up 8:00 am, breakfast 8:30 am"), it("Depart for Islamabad"), it("Short stop at the LoC viewpoint", false, "Subject to official access on the day"),
        it("Short stops at Dhani Waterfall, Kutton Waterfall, Kohala Bridge and Kashmir Abshar"),
        it("Continue to Islamabad via the Murree Expressway"), it("Drop at the bus stop; Karachi travellers continue to Karachi"),
      ], overnight: "In transit (Karachi travellers)", meals: "Breakfast", sourcePage: 6 },
      { day: 7, audience: "karachi", title: "Arrive Karachi", items: [it("Reach Karachi home safely")], overnight: "", meals: "", sourcePage: 6 },
    ],
    priceOptions: [
      { id: "isb", origin: "islamabad", label: "From Islamabad", perPerson: 25000, perCouple: 60000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-economy-train", origin: "karachi", label: "Economy train", perPerson: 36000, perCouple: 85000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-sleeper-business", origin: "karachi", label: "Sleeper bus / Business class train", perPerson: 51000, perCouple: 115000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-executive-bus", origin: "karachi", label: "Executive bus", perPerson: 44000, perCouple: 100000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-sleeper-bus", origin: "karachi", label: "Sleeper bus", perPerson: 51000, perCouple: 115000, status: "needs_review", note: "Duplicate of the 'Sleeper bus / Business class train' row in the brochure — hidden until confirmed.", sourcePage: 3 },
    ],
    priceNotes: [COUPLE_PRICE_NOTE, FUEL_CLAUSE],
    importantNotes: [
      "Ratti Gali Lake usually opens in mid-June. If it is accessible at the time of the trip we will visit Ratti Gali; otherwise we will proceed to Taobat.",
      WEATHER_NOTE,
      "Jeep rides (Kel, Ratti Gali) are not included in the package price.",
    ],
    advisories: [AJK_ADVISORY],
    brochureIds: ["kashmir-7-days"],
    reviewFlags: [
      "The price table is identical to the Naran 7-day package — confirm these are the correct Kashmir prices.",
      "Brochure lists 'Sleeper bus' twice (same price). Duplicate row hidden pending confirmation.",
      "Brochure says 'LOC Indian Border'; the website uses the neutral wording 'LoC viewpoint'.",
      "Murree, Ayubia and Ath Muqam appear in the attraction list but not in the day plan.",
      ...COMMON_FLAGS,
    ],
    source: { document: "Kashmir 7 days.pdf", page: 1, note: "Itinerary p4–6, prices p3, services p7–10" },
    seoTitle: "Kashmir & Neelum Valley Tour from Karachi — Arang Kel, Ratti Gali",
    seoDescription: "7-day Neelum Valley group tour from Karachi (4 days from Islamabad): Kohala, Muzaffarabad, Dhani & Kutton waterfalls, Sharda, Arang Kel and Ratti Gali Lake.",
    ...common,
  },

  /* ───────────── PDF-K10 ───────────── */
  {
    id: "kashmir-naran-valley-10-days",
    status: "published",
    order: 3,
    featured: true,
    title: "Kashmir & Naran Valley",
    sourceTitle: "KASHMIR & NARAN VALLEY",
    tagline: "Neelum Valley and Kaghan Valley in one journey.",
    summary:
      "Our combined tour: the Neelum Valley (Sharda, Arang Kel and Ratti Gali Lake), then across to Balakot and up the Kaghan Valley to Naran, with Babusar Top, Lulusar Lake, a bonfire and BBQ night, and Saif-ul-Malook Lake.",
    labels: ["Family oriented", "Two valleys", "Bonfire & BBQ night"],
    destinationIds: ["kashmir-neelum", "naran-kaghan"],
    heroImage: PHOTOS.snowPeaksReflection,
    images: [PHOTOS.snowPeaksReflection, PHOTOS.meadowRiders, PHOTOS.glacierLake],
    durations: { karachi: { days: 10, nights: 7 }, islamabad: { days: 7, nights: 6 } },
    highlights: [
      "Muzaffarabad", "Neelum Valley", "Dhani Waterfall", "Kutton Waterfall", "Sharda (old university ruins)", "Kashmir Abshar",
      "Arang Kel (if accessible)", "Upper Neelum", "Keran", "Ratti Gali Lake", "Balakot", "Kewai Waterfall", "Shogran",
      "Siri Paye", "Naran Bazaar", "Lulusar Lake", "Babusar Top", "Saif-ul-Malook Lake",
    ],
    itinerary: [
      { day: 1, audience: "karachi", title: "Depart Karachi", items: [it("Departure from Karachi (no meals on this day)")], overnight: "In transit", meals: "", sourcePage: 4 },
      { day: 2, audience: "karachi", title: "Arrive Islamabad", items: [it("Arrival at Islamabad bus stop and pick-up"), it("Move to Islamabad hotel and check in"), it("Dinner")], overnight: "Islamabad", meals: "Dinner", sourcePage: 4 },
      { day: 3, audience: "all", title: "Islamabad → Muzaffarabad → Neelum Valley → Sharda", items: [
        it("Wake up 8:00 am, breakfast"), it("Depart for Kashmir via the Murree Expressway"), it("Short stop at Kohala"), it("Short stop at Kashmir Abshar"),
        it("Lunch break in Muzaffarabad"), it("Continue into the Neelum Valley"), it("Visit Dhani Waterfall"),
        it("Short stop at the LoC viewpoint", false, "Subject to official access on the day"), it("Continue to Sharda"),
      ], overnight: "Sharda", meals: "Breakfast, dinner", sourcePage: 4 },
      { day: 4, audience: "all", title: "Kel & Arang Kel", items: [
        it("Wake up 8:00 am, breakfast 8:30 am"), it("Jeep ride towards Kel", true, "Jeep charges not included"),
        it("Cable car and short trek to Arang Kel (30–40 minutes)"), it("Explore and spend the day at Arang Kel"), it("Back to Kel and on to Sharda in the evening"),
      ], overnight: "Sharda / Keran", meals: "Breakfast, dinner", sourcePage: 5 },
      { day: 5, audience: "all", title: "Ratti Gali Lake → Keran", items: [
        it("Wake up 8:00 am, breakfast 8:30 am"), it("Move to Dhuariyan"), it("Transfer into jeeps to Ratti Gali base camp", true, "Jeep charges not included"),
        it("Hike to Ratti Gali Lake and spend quality time there"), it("Return to Dhuariyan"), it("Move to Keran"),
      ], overnight: "Keran", meals: "Breakfast, dinner", sourcePage: 5 },
      { day: 6, audience: "all", title: "Keran → Balakot", items: [
        it("Wake up 8:00 am, breakfast 8:30 am"), it("Depart for Balakot"), it("Short stop at the LoC viewpoint", false, "Subject to official access on the day"),
        it("Short stop at the Muzaffarabad viewpoint"),
      ], overnight: "Balakot", meals: "Breakfast, dinner", sourcePage: 6 },
      { day: 7, audience: "all", title: "Balakot → Naran via Kewai & Shogran", items: [
        it("Breakfast"), it("Depart for Naran"), it("Short stop at Kewai Waterfall"), it("Jeeps to Shogran and Siri Paye", true, "Jeep charges not included"),
        it("Reach Naran Valley and check in"),
      ], overnight: "Naran", meals: "Breakfast, dinner", sourcePage: 6 },
      { day: 8, audience: "all", title: "Batakundi, Lulusar Lake & Babusar Top", items: [
        it("Early breakfast in Naran Bazaar"), it("Drive towards Babusar Top"), it("Explore Batakundi"), it("Explore Piyala Lake"), it("Explore Lulusar Lake"),
        it("Free time at Babusar Top, the highest point of the Kaghan Valley"), it("Back to Naran Valley"), it("River rafting on the Kunhar River"),
        it("Bonfire and BBQ night in Naran"),
      ], overnight: "Naran", meals: "Breakfast, dinner (BBQ)", sourcePage: 6 },
      { day: 9, audience: "all", title: "Saif-ul-Malook Lake → Islamabad", items: [
        it("Early breakfast in Naran Bazaar"), it("Jeeps to Saif-ul-Malook Lake", true, "Jeep charges not included"), it("Back to Naran Bazaar"),
        it("Travel to Islamabad"), it("Drop at the bus stop"),
      ], overnight: "In transit (Karachi travellers)", meals: "Breakfast", sourcePage: 7 },
      { day: 10, audience: "karachi", title: "Arrive Karachi", items: [it("Reach Karachi home safely")], overnight: "", meals: "", sourcePage: 7 },
    ],
    priceOptions: [
      { id: "isb", origin: "islamabad", label: "From Islamabad", perPerson: 34000, perCouple: 80000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-economy-train", origin: "karachi", label: "Economy train", perPerson: 47000, perCouple: 112000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-executive-bus", origin: "karachi", label: "Executive bus", perPerson: 54000, perCouple: 126000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-sleeper-business", origin: "karachi", label: "Sleeper bus / Business class train", perPerson: 64000, perCouple: 148000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-greenline-economy", origin: "karachi", label: "Green Line economy", perPerson: 51000, perCouple: 120000, status: "published", note: "", sourcePage: 3 },
    ],
    priceNotes: [COUPLE_PRICE_NOTE, FUEL_CLAUSE],
    importantNotes: [
      "Ratti Gali Lake usually opens in mid-June. If it is accessible at the time of the trip we will visit Ratti Gali; otherwise we will proceed to Taobat.",
      WEATHER_NOTE,
      "Jeep rides (Kel, Ratti Gali, Shogran / Siri Paye, Saif-ul-Malook) are not included in the package price.",
    ],
    advisories: [AJK_ADVISORY, BABUSAR_NOTE],
    brochureIds: ["kashmir-10-days"],
    reviewFlags: [
      "Brochure says 'LOC Indian Border'; the website uses the neutral wording 'LoC viewpoint'.",
      "Brochure cost page reads '10 days trip 7 nights' (Karachi itinerary). Islamabad nights (6) are derived from the plan — confirm.",
      ...COMMON_FLAGS,
    ],
    source: { document: "new Kashmir 10days.pdf", page: 1, note: "Itinerary p4–7, prices p3, services p8–11" },
    seoTitle: "Kashmir & Naran Valley 10-Day Tour from Karachi",
    seoDescription: "10-day Kashmir (Neelum Valley) and Naran–Kaghan group tour from Karachi, 7 days from Islamabad: Arang Kel, Ratti Gali, Babusar Top and Saif-ul-Malook.",
    ...common,
  },

  /* ───────────── PDF-S12 ───────────── */
  {
    id: "naran-hunza-skardu-12-days",
    status: "published",
    order: 4,
    featured: true,
    title: "Naran, Hunza & Skardu",
    sourceTitle: "NARAN, HUNZA & SKARDU",
    tagline: "Over Babusar to Baltistan and Hunza — our longest northern journey.",
    summary:
      "Cross Babusar Top to Chilas and on to Skardu: Shangrila, Kachura Lake, Shigar Fort, the cold desert and a 4×4 jeep safari over the Deosai Plains. Then on to Hunza for Altit Fort, Karimabad, Attabad Lake, the Passu Cones and Hussaini Bridge (Khunjerab Pass if possible), and back through Naran.",
    labels: ["Family oriented", "Deosai jeep safari", "Karakoram views"],
    destinationIds: ["skardu", "hunza", "naran-kaghan"],
    heroImage: PHOTOS.resortPagoda,
    images: [PHOTOS.resortPagoda, PHOTOS.autumnRoad, PHOTOS.meadowHorseLake, PHOTOS.resortRedRoofs],
    durations: { karachi: { days: 12, nights: 9 }, islamabad: { days: 8, nights: 7 } },
    highlights: [
      "Babusar Pass", "Chilas", "Nanga Parbat viewpoint", "Shangrila Resort", "Soq Valley", "Kachura Lake", "Shigar Fort",
      "Cold desert", "Mantokha Waterfall", "Deosai Plains jeep safari", "Sheosar Lake", "Sadpara Lake", "Rakaposhi viewpoint",
      "Altit Fort", "Karimabad Bazaar", "Attabad Lake & tunnels", "Passu Cones", "Hussaini Bridge", "Khunjerab Pass (if possible)",
    ],
    itinerary: [
      { day: 1, audience: "karachi", title: "Depart Karachi", items: [it("Departure from Karachi (no meals on this day)")], overnight: "In transit", meals: "", sourcePage: 4 },
      { day: 2, audience: "karachi", title: "Arrive Islamabad / Rawalpindi", items: [
        it("Departure of guests travelling by air from Karachi"), it("Arrival at Rawalpindi station / bus terminal"),
        it("Short stay in Islamabad / Rawalpindi for Karachi package guests"), it("Dinner at the hotel in Islamabad at 10:00 pm"),
      ], overnight: "Islamabad", meals: "Dinner", sourcePage: 4 },
      { day: 3, audience: "all", title: "Islamabad → Babusar Top → Chilas", items: [
        it("Gather at the meeting point at 4:00 am"), it("Depart for Chilas at 6:30 am"), it("Breakfast at Balakot"),
        it("Short stops at Kewai, Kaghan, Lulusar Lake and Babusar Top"), it("Arrive in Chilas"),
      ], overnight: "Chilas", meals: "Breakfast, dinner", sourcePage: 4 },
      { day: 4, audience: "all", title: "Chilas → Skardu", items: [
        it("Early breakfast"), it("Depart for Skardu"), it("Short stops at the Nanga Parbat viewpoint and Astak Nala"),
        it("Visit Shangrila Resort, Soq Valley and Kachura Lake"),
      ], overnight: "Skardu or Kachura", meals: "Breakfast, dinner", sourcePage: 4 },
      { day: 5, audience: "all", title: "Shigar Valley", items: [
        it("Breakfast"), it("Depart for Shigar Valley"), it("Explore Shigar Fort"), it("Sarfaranga cold desert"), it("Mantokha Waterfall"),
      ], overnight: "Skardu", meals: "Breakfast, dinner", sourcePage: 5 },
      { day: 6, audience: "all", title: "Deosai Plains jeep safari", items: [
        it("Breakfast"), it("Into 4×4 jeeps for the Deosai Plains", false, "Brochure wording: 'Departure for Skardu via Deosai Plains'"),
        it("Visit Sadpara Dam, Sheosar Lake, Kala Pani & Bara Pani and Shoutang Nala"), it("Return to Skardu for dinner"),
      ], overnight: "Skardu", meals: "Breakfast, dinner", sourcePage: 5 },
      { day: 7, audience: "all", title: "Skardu → Hunza", items: [
        it("Breakfast"), it("Depart for Hunza"), it("Short stop at Astak Nala"), it("Visit the Rakaposhi viewpoint"), it("Altit Fort"), it("Karimabad"),
      ], overnight: "Hunza", meals: "Breakfast, dinner", sourcePage: 5 },
      { day: 8, audience: "all", title: "Attabad Lake, Passu & Hussaini Bridge", items: [
        it("Breakfast"), it("Visit Attabad Lake"), it("Passu Cones"), it("Hussaini Bridge"), it("Khunjerab Pass (if possible)"), it("Back to the hotel"),
      ], overnight: "Hunza", meals: "Breakfast, dinner", sourcePage: 6 },
      { day: 9, audience: "all", title: "Hunza → Naran via Babusar Pass", items: [
        it("Breakfast and depart for Kaghan via the Babusar Pass"), it("River rafting"), it("Visit places missed on the way"), it("Arrive in Naran"),
      ], overnight: "Naran", meals: "Breakfast, dinner", sourcePage: 6 },
      { day: 10, audience: "all", title: "Naran → Islamabad", items: [
        it("Breakfast"), it("Shogran or Saif-ul-Malook, and Siri Paye", true, "Brochure lists 'Shugran or Saifulmalook' — one of the two"),
        it("Continue the drive to Islamabad"), it("Drop Islamabad guests in Islamabad"), it("Karachi package guests check in to the hotel"),
      ], overnight: "Islamabad (Karachi travellers)", meals: "Breakfast, dinner", sourcePage: 6 },
      { day: 11, audience: "karachi", title: "Depart for Karachi", items: [
        it("Board the train on your own and depart for Karachi"), it("Guests on the by-air option also depart for Karachi on this day"),
      ], overnight: "In transit", meals: "", sourcePage: 7 },
      { day: 12, audience: "karachi", title: "Arrive Karachi", items: [it("Arrival in Karachi")], overnight: "", meals: "", sourcePage: 7 },
    ],
    priceOptions: [
      { id: "isb", origin: "islamabad", label: "From Islamabad", perPerson: 40000, perCouple: 95000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-economy-train", origin: "karachi", label: "Economy train", perPerson: 54000, perCouple: 128000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-faisal-movers-executive", origin: "karachi", label: "Faisal Movers executive bus", perPerson: 62000, perCouple: 144000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-lower-ac-train", origin: "karachi", label: "Pak Express / Rehman Baba lower AC train", perPerson: 65000, perCouple: 152000, status: "published", note: "", sourcePage: 3 },
      { id: "khi-sleeper-bus", origin: "karachi", label: "Sleeper bus", perPerson: 70000, perCouple: 162000, status: "published", note: "", sourcePage: 3 },
    ],
    priceNotes: [
      COUPLE_PRICE_NOTE,
      FUEL_CLAUSE,
      "A by-air option from Karachi is mentioned in the itinerary. Its price is not listed — please ask us.",
    ],
    importantNotes: [WEATHER_NOTE, "Khunjerab Pass is visited only if possible on the day.", "Jeep charges are not included unless stated."],
    advisories: [GB_NOTE, BABUSAR_NOTE],
    brochureIds: ["skardu-hunza-naran-12-days"],
    reviewFlags: [
      "Day 6 reads 'Departure for Skardu via Deosai Plains' while the group is already in Skardu — confirm it is a Deosai round trip.",
      "Is the Deosai 4×4 jeep included? The standard exclusions say 'Jeep charges' are excluded.",
      "By-air option is mentioned on Day 2 and Day 11 but not priced.",
      "Nights are derived from the plan (Karachi 9, Islamabad 7) — confirm.",
      ...COMMON_FLAGS,
    ],
    source: { document: "12 days skardu hunza and Naran.pdf", page: 1, note: "Itinerary p4–7, prices p3, services p8–11" },
    seoTitle: "Naran, Hunza & Skardu 12-Day Tour from Karachi",
    seoDescription: "12-day Naran, Skardu & Hunza group tour from Karachi (8 days from Islamabad): Babusar, Shangrila, Shigar Fort, Deosai, Attabad Lake, Passu and Khunjerab (if possible).",
    ...common,
  },
];
