import "server-only";
/**
 * Public content repository (server-side).
 * Reads published content from Firestore via REST (cached + tag-revalidated), falling back to the
 * bundled starter content when Firebase isn't configured or hasn't been initialised yet.
 */
import { cache } from "react";
import type { ZodTypeAny, z } from "zod";
import { SEED } from "@/content/seed";
import { isFirebaseConfigured } from "./firebase/config";
import { restGet, restQuery } from "./firebase/rest";
import {
  contactSettingsSchema, destinationSchema, faqSchema, galleryItemSchema, packageSchema, pdfSchema,
  policiesSchema, reviewSchema, sectionSchema, siteSettingsSchema,
  type ContactSettings, type Destination, type Faq, type GalleryItem, type PdfDoc, type Policies,
  type Review, type Section, type SiteSettings, type TourPackage,
} from "./schema";

type Source = "firestore" | "seed";

function parseMany<S extends ZodTypeAny>(schema: S, rows: unknown[], label: string): z.infer<S>[] {
  const out: z.infer<S>[] = [];
  for (const row of rows) {
    const r = schema.safeParse(row);
    if (r.success) out.push(r.data);
    else console.warn(`[content] skipped invalid ${label}:`, (row as { id?: string })?.id, r.error.issues[0]);
  }
  return out;
}

const byOrder = <T extends { order?: number }>(a: T, b: T) => (a.order ?? 0) - (b.order ?? 0);

/** Decide once per request whether Firestore is the source of truth. */
export const getContentSource = cache(async (): Promise<Source> => {
  if (!isFirebaseConfigured) return "seed";
  try {
    const site = await restGet("settings/site");
    return site && (site as { initialized?: boolean }).initialized ? "firestore" : "seed";
  } catch (e) {
    console.error("[content] Firestore unavailable, using bundled content:", (e as Error).message);
    return "seed";
  }
});

async function loadCollection<S extends ZodTypeAny>(
  name: string,
  schema: S,
  seed: unknown[],
  publishedValue = "published",
): Promise<z.infer<S>[]> {
  const src = await getContentSource();
  if (src === "firestore") {
    try {
      const rows = await restQuery(name, "status", publishedValue);
      return parseMany(schema, rows, name).sort(byOrder);
    } catch (e) {
      console.error(`[content] ${name} query failed, using bundled content:`, (e as Error).message);
    }
  }
  return parseMany(schema, seed, name)
    .filter((x: { status?: string }) => x.status === publishedValue)
    .sort(byOrder);
}

async function loadSingleton<S extends ZodTypeAny>(path: string, schema: S, seed: unknown): Promise<z.infer<S>> {
  const src = await getContentSource();
  if (src === "firestore") {
    try {
      const doc = await restGet(path);
      if (doc) {
        const r = schema.safeParse(doc);
        if (r.success) return r.data;
        console.warn(`[content] invalid ${path}, using bundled content`, r.error.issues[0]);
      }
    } catch (e) {
      console.error(`[content] ${path} failed:`, (e as Error).message);
    }
  }
  return schema.parse(seed);
}

export const getPackages = cache((): Promise<TourPackage[]> => loadCollection("packages", packageSchema, SEED.packages));
export const getPackage = cache(async (id: string) => (await getPackages()).find((p) => p.id === id) ?? null);

export const getDestinations = cache((): Promise<Destination[]> => loadCollection("destinations", destinationSchema, SEED.destinations));
export const getDestination = cache(async (id: string) => (await getDestinations()).find((d) => d.id === id) ?? null);

export const getPdfs = cache((): Promise<PdfDoc[]> => loadCollection("pdfs", pdfSchema, SEED.pdfs));
export const getPdf = cache(async (id: string) => (await getPdfs()).find((d) => d.id === id) ?? null);

export const getGallery = cache((): Promise<GalleryItem[]> => loadCollection("gallery", galleryItemSchema, SEED.gallery));
export const getReviews = cache((): Promise<Review[]> => loadCollection("reviews", reviewSchema, SEED.reviews));
export const getFaqs = cache((): Promise<Faq[]> => loadCollection("faqs", faqSchema, SEED.faqs));
export const getSections = cache((): Promise<Section[]> => loadCollection("sections", sectionSchema, SEED.sections));

export const getSiteSettings = cache((): Promise<SiteSettings> => loadSingleton("settings/site", siteSettingsSchema, SEED.settings.site));
export const getContact = cache((): Promise<ContactSettings> => loadSingleton("settings/contact", contactSettingsSchema, SEED.settings.contact));
export const getPolicies = cache((): Promise<Policies> => loadSingleton("settings/policies", policiesSchema, SEED.settings.policies));

export async function getSection(key: Section["key"]) {
  return (await getSections()).find((s) => s.key === key) ?? null;
}
