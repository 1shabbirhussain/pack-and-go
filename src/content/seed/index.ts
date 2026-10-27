/**
 * Starter content bundled with the site.
 * - Used as the fallback data source when Firebase is not configured, or before an admin
 *   imports it into Firestore ("Import starter content" on the admin dashboard).
 * - After import (settings/site.initialized = true) Firestore is the single source of truth.
 */
import type { Review } from "@/lib/schema";
import { SEED_DESTINATIONS } from "./destinations";
import { SEED_GALLERY, SEED_PDFS } from "./library";
import { SEED_PACKAGES } from "./packages";
import { SEED_CONTACT, SEED_FAQS, SEED_POLICIES, SEED_SECTIONS, SEED_SITE } from "./site";

/** No reviews were supplied. None are invented — the reviews section stays hidden until real ones are published. */
export const SEED_REVIEWS: Review[] = [];

export const SEED = {
  packages: SEED_PACKAGES,
  destinations: SEED_DESTINATIONS,
  pdfs: SEED_PDFS,
  gallery: SEED_GALLERY,
  reviews: SEED_REVIEWS,
  faqs: SEED_FAQS,
  sections: SEED_SECTIONS,
  settings: { site: SEED_SITE, contact: SEED_CONTACT, policies: SEED_POLICIES },
};

export type SeedCollections = Omit<typeof SEED, "settings">;
