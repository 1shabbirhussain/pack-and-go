/**
 * Content shared by all four brochures (identical wording across PDFs).
 * Source: PDF-N7 p7–p10 · PDF-K7 p7–p10 · PDF-K10 p8–p11 · PDF-S12 p8–p11
 * Typos in the brochures are corrected (e.g. "Tool Taxes" → "Toll taxes"); meaning is unchanged.
 */
import type { ImageRef } from "@/lib/schema";

export const STANDARD_INCLUSIONS = [
  "2 meals daily: breakfast and dinner",
  "Luxury transport",
  "Toll taxes",
  "Services of a guide",
  "Basic first aid kit",
  "Hotel accommodation (3/4 persons sharing)",
];

export const STANDARD_EXCLUSIONS = [
  "Tea, mineral water and cold drinks",
  "Heater charges",
  "Tickets for forts, boating and other entry tickets",
  "Jeep charges",
  "Vehicle use in case of road blockage, or any extra expense",
  "Anything not mentioned in the inclusions",
];

export const STANDARD_BREAKFAST = ["Egg (omelette), paratha, chanay and tea"];

export const STANDARD_DINNER = [
  "Chicken karahi + roti/naan + raita + salad + cold drink",
  "BBQ + roti/naan + raita + salad + cold drink",
  "Chicken biryani + raita + salad + cold drink",
];

export const STANDARD_MEALS_NOTE = "Dinner menu served on daily rotation.";

export const STANDARD_KIDS_POLICY = [
  "Under 3 years: free, without a seat",
  "3 to 8 years: 50% charge, with a jumper seat",
  "Above 8 years: charged as an adult",
];

export const STANDARD_PACKING = [
  "Day bag",
  "Raincoat",
  "Sunblock",
  "Sunglasses",
  "Warm clothes and jackets",
  "Power bank",
  "Joggers and slippers",
  "Your CNIC / ID card (mandatory for all participants)",
];

export const FUEL_CLAUSE =
  "The client agrees to bear any additional charges arising from fuel price increases occurring before or during the trip. Such charges are compulsory and non-negotiable.";

export const WEATHER_NOTE = "The plan or stays may be adjusted according to weather conditions or other circumstances.";

export const COUPLE_PRICE_NOTE =
  "Per-couple prices are shown exactly as published in our brochure. Please ask our team what the couple rate includes (for example, room arrangement) before booking.";

export const AJK_ADVISORY =
  "Access to Neelum Valley and areas near the Line of Control (LoC) can be restricted by the authorities at short notice, and LoC viewpoint stops depend on official permission on the day. Foreign nationals: please contact us before booking and check your government's travel advice, as some stops may not be permitted for non-Pakistani passport holders.";

export const BABUSAR_NOTE =
  "Babusar Top and the Babusar Pass road are seasonal and can close because of snow; the route may change on the day if the pass is closed.";

export const GB_NOTE =
  "Foreign nationals travelling in Gilgit-Baltistan are required to register with the local authorities; please carry your passport and visa. Pakistani travellers should carry their CNIC.";

export const img = (file: string, alt: string, width: number, height: number, credit = "Image from a Pack & Go brochure — usage rights to be confirmed"): ImageRef => ({
  src: { kind: "bundled", path: `/images/photos/${file}.webp`, url: "" },
  alt,
  width,
  height,
  credit,
  rights: "unverified",
});

/** Photos extracted from the brochures. Rights unconfirmed — replace with owned photos when available. */
export const PHOTOS = {
  meadowHorseLake: img("meadow-horse-lake", "A horse grazing in a green alpine meadow beside a stream, with snow-streaked mountains behind", 1920, 1280),
  resortPagoda: img("lakeside-resort-pagoda", "A pagoda-roofed building reflected in a still lake below snowy peaks", 1080, 720),
  resortRedRoofs: img("lakeside-resort-red-roofs", "Red-roofed lakeside chalets surrounded by pine forest and mountains", 1160, 873),
  autumnRoad: img("autumn-poplar-road", "A traveller walking along a mountain road lined with golden and red autumn trees", 1280, 800),
  snowPeaksReflection: img("snow-peaks-reflection", "A range of snow-covered peaks reflected in a calm meadow pool under blue sky", 1738, 1000),
  glacierLake: img("glacier-lake-waterfall", "A turquoise mountain lake with a waterfall and visitors on the rocky shore", 720, 900),
  pineFootbridge: img("pine-river-footbridge", "A wooden footbridge over a rushing river in a pine-forested valley", 500, 499),
  meadowRiders: img("meadow-horse-riders", "Horse riders crossing a wide green meadow framed by pine trees and snowy mountains", 1200, 800),
  riverValley: img("river-valley-village", "A clear turquoise river winding through a green valley with a small village", 540, 960),
  turquoiseGorge: img("turquoise-gorge-lake", "A traveller above a long turquoise lake in a steep, rocky mountain gorge", 1030, 687),
  faisalMosque: img("faisal-mosque-islamabad", "Aerial view of Faisal Mosque in Islamabad with the Margalla Hills behind", 668, 446),
  cliffView: img("traveller-cliff-view", "A traveller standing on a rocky ledge overlooking rugged mountains", 1664, 1916),
} as const;
