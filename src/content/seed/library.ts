/** Brochures (PDF library) and gallery seed data. */
import type { GalleryItem, PdfDoc } from "@/lib/schema";
import { PHOTOS } from "./shared";

const cover = (id: string, title: string) => ({
  src: { kind: "bundled" as const, path: `/images/brochures/${id}-cover.webp`, url: "" },
  alt: `Cover of the ${title} brochure`,
  width: 640,
  height: 905,
  credit: "Pack & Go Tourism",
  rights: "owned" as const,
});

export const SEED_PDFS: PdfDoc[] = [
  {
    id: "naran-shogran-babusar-7-days",
    status: "published",
    order: 1,
    title: "Naran, Shogran, Babusar Top & Saif-ul-Malook — 7 days",
    description: "The full brochure: attractions, prices by transport option, day-by-day plan, inclusions, meals, kids policy, terms and payment details.",
    packageIds: ["naran-shogran-babusar-saiful-malook"],
    source: { kind: "bundled", path: "/brochures/naran-shogran-babusar-7-days.pdf", url: "" },
    coverImage: cover("naran-shogran-babusar-7-days", "Naran 7 days"),
    pageCount: 10,
    fileSizeBytes: 3789242,
    version: "April 2026",
    allowDownload: true,
  },
  {
    id: "kashmir-7-days",
    status: "published",
    order: 2,
    title: "Kashmir, Neelum Valley, Arang Kel & Ratti Gali — 7 days",
    description: "The full brochure for our Neelum Valley tour, with prices, the daily plan, services, meals and terms.",
    packageIds: ["kashmir-neelum-arang-kel-ratti-gali"],
    source: { kind: "bundled", path: "/brochures/kashmir-7-days.pdf", url: "" },
    coverImage: cover("kashmir-7-days", "Kashmir 7 days"),
    pageCount: 10,
    fileSizeBytes: 3863134,
    version: "April 2026",
    allowDownload: true,
  },
  {
    id: "kashmir-10-days",
    status: "published",
    order: 3,
    title: "Kashmir & Naran Valley — 10 days",
    description: "The full brochure for our combined Neelum Valley and Kaghan Valley tour.",
    packageIds: ["kashmir-naran-valley-10-days"],
    source: { kind: "bundled", path: "/brochures/kashmir-10-days.pdf", url: "" },
    coverImage: cover("kashmir-10-days", "Kashmir & Naran 10 days"),
    pageCount: 11,
    fileSizeBytes: 3926018,
    version: "April 2026",
    allowDownload: true,
  },
  {
    id: "skardu-hunza-naran-12-days",
    status: "published",
    order: 4,
    title: "Naran, Hunza & Skardu — 12 days",
    description: "The full brochure for our longest northern tour: Babusar, Skardu, Deosai, Hunza and Naran.",
    packageIds: ["naran-hunza-skardu-12-days"],
    source: { kind: "bundled", path: "/brochures/skardu-hunza-naran-12-days.pdf", url: "" },
    coverImage: cover("skardu-hunza-naran-12-days", "Naran, Hunza & Skardu 12 days"),
    pageCount: 11,
    fileSizeBytes: 5021681,
    version: "April 2026",
    allowDownload: true,
  },
];

const g = (id: string, title: string, category: string, image: GalleryItem["image"], order: number, packageIds: string[] = [], featured = false, caption = ""): GalleryItem => ({
  id, status: "published", order, featured, title, category, caption, image, packageIds,
});

/** Gallery items use photos from the brochures; locations are not asserted unless certain. */
export const SEED_GALLERY: GalleryItem[] = [
  g("meadow-horse-lake", "Alpine meadow", "Valleys & meadows", PHOTOS.meadowHorseLake, 1, ["naran-hunza-skardu-12-days"], true, "From our Naran, Hunza & Skardu brochure"),
  g("lakeside-pagoda", "Lakeside resort", "Lakes", PHOTOS.resortPagoda, 2, ["naran-hunza-skardu-12-days"], true, "From our Naran, Hunza & Skardu brochure"),
  g("snow-peaks-reflection", "Snow peaks reflected", "Mountains", PHOTOS.snowPeaksReflection, 3, ["naran-shogran-babusar-saiful-malook"], true, "From our Naran brochure"),
  g("glacier-lake", "Mountain lake and waterfall", "Lakes", PHOTOS.glacierLake, 4, ["naran-shogran-babusar-saiful-malook"], true, "From our Naran brochure"),
  g("autumn-road", "Autumn road", "Seasons", PHOTOS.autumnRoad, 5, ["naran-hunza-skardu-12-days"], true, "From our Naran, Hunza & Skardu brochure"),
  g("meadow-riders", "Riders on the meadow", "Valleys & meadows", PHOTOS.meadowRiders, 6, ["kashmir-neelum-arang-kel-ratti-gali"], true, "From our Kashmir brochure"),
  g("resort-red-roofs", "Chalets by the lake", "Lakes", PHOTOS.resortRedRoofs, 7, ["naran-hunza-skardu-12-days"], false, "From our Naran, Hunza & Skardu brochure"),
  g("turquoise-gorge", "Turquoise gorge lake", "Lakes", PHOTOS.turquoiseGorge, 8, [], false, "Northern Pakistan landscape"),
  g("river-valley", "River valley", "Rivers", PHOTOS.riverValley, 9, ["kashmir-neelum-arang-kel-ratti-gali"], false, "From our Kashmir brochure"),
  g("pine-footbridge", "Footbridge in the pines", "Rivers", PHOTOS.pineFootbridge, 10, ["naran-shogran-babusar-saiful-malook"], false, "From our Naran brochure"),
  g("faisal-mosque", "Faisal Mosque, Islamabad", "Cities", PHOTOS.faisalMosque, 11, [], false, "Islamabad — where our northern tours begin"),
  g("cliff-view", "On the edge", "Mountains", PHOTOS.cliffView, 12, [], false, "From our Kashmir brochure"),
];
