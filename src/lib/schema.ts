/**
 * Single source of truth for content models.
 * Zod schemas validate admin forms and seed data; TypeScript types are inferred from them.
 * Firestore collections: packages, destinations, sections, pdfs, gallery, reviews, faqs,
 * settings (singleton docs: site, contact, policies), inquiries, admins.
 */
import { z } from "zod";

export const publishStatus = z.enum(["draft", "published", "archived"]);
export type PublishStatus = z.infer<typeof publishStatus>;

const slug = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");

const optionalText = (max = 2000) => z.string().max(max).optional().default("");

/** Where an image physically lives. Bundled = shipped in /public; storage = Firebase Storage. */
export const mediaSource = z.object({
  kind: z.enum(["bundled", "storage", "external"]),
  /** Bundled public path (/images/...) or Storage object path (public/gallery/...) */
  path: optionalText(500),
  /** Resolved https URL for storage/external images */
  url: optionalText(1000),
});
export type MediaSource = z.infer<typeof mediaSource>;

export const imageRef = z.object({
  src: mediaSource,
  alt: z.string().max(300).default(""),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  credit: optionalText(200),
  /** Licensing state: owned | licensed | unverified (e.g. taken from brochure, rights unknown) */
  rights: z.enum(["owned", "licensed", "unverified"]).default("unverified"),
});
export type ImageRef = z.infer<typeof imageRef>;

export const sourceRef = z.object({
  document: optionalText(200),
  page: z.number().int().positive().optional(),
  note: optionalText(500),
});

/* ─────────────────────────── Packages ─────────────────────────── */

export const originKey = z.enum(["karachi", "islamabad", "hyderabad", "lahore", "other"]);
export type OriginKey = z.infer<typeof originKey>;

export const itineraryItem = z.object({
  text: z.string().min(1).max(300),
  optional: z.boolean().default(false),
  note: optionalText(300),
});

export const itineraryDay = z.object({
  day: z.number().int().min(1).max(60),
  title: z.string().min(1).max(160),
  /** "all" = every traveller; an origin key = only travellers departing from that city */
  audience: z.enum(["all", "karachi", "islamabad"]).default("all"),
  items: z.array(itineraryItem).default([]),
  overnight: optionalText(120),
  meals: optionalText(120),
  sourcePage: z.number().int().positive().optional(),
});
export type ItineraryDay = z.infer<typeof itineraryDay>;

export const priceOption = z.object({
  id: z.string().min(1).max(60),
  origin: originKey,
  label: z.string().min(1).max(120),
  perPerson: z.number().int().nonnegative().nullable().default(null),
  perCouple: z.number().int().nonnegative().nullable().default(null),
  /** needs_review rows are kept for the owner but hidden from the public site */
  status: z.enum(["published", "needs_review", "hidden"]).default("published"),
  note: optionalText(300),
  sourcePage: z.number().int().positive().optional(),
});
export type PriceOption = z.infer<typeof priceOption>;

export const durationInfo = z.object({
  days: z.number().int().min(1).max(60),
  nights: z.number().int().min(0).max(60).nullable().default(null),
});

export const packageSchema = z.object({
  id: slug,
  status: publishStatus.default("draft"),
  order: z.number().int().default(0),
  featured: z.boolean().default(false),
  title: z.string().min(3).max(160),
  sourceTitle: optionalText(200),
  tagline: optionalText(240),
  summary: z.string().max(1200).default(""),
  labels: z.array(z.string().max(60)).default([]),
  destinationIds: z.array(z.string()).default([]),
  heroImage: imageRef.optional(),
  images: z.array(imageRef).default([]),
  durations: z.object({
    karachi: durationInfo.optional(),
    islamabad: durationInfo.optional(),
  }),
  highlights: z.array(z.string().max(120)).default([]),
  itinerary: z.array(itineraryDay).default([]),
  currency: z.literal("PKR").default("PKR"),
  priceValidity: optionalText(200),
  priceOptions: z.array(priceOption).default([]),
  priceNotes: z.array(z.string().max(500)).default([]),
  inclusions: z.array(z.string().max(200)).default([]),
  exclusions: z.array(z.string().max(200)).default([]),
  mealsBreakfast: z.array(z.string().max(200)).default([]),
  mealsDinner: z.array(z.string().max(200)).default([]),
  mealsNote: optionalText(300),
  kidsPolicy: z.array(z.string().max(200)).default([]),
  packingList: z.array(z.string().max(200)).default([]),
  importantNotes: z.array(z.string().max(500)).default([]),
  advisories: z.array(z.string().max(800)).default([]),
  brochureIds: z.array(z.string()).default([]),
  /** Unresolved items for the owner. Never rendered publicly. */
  reviewFlags: z.array(z.string().max(500)).default([]),
  source: sourceRef.optional(),
  seoTitle: optionalText(80),
  seoDescription: optionalText(200),
});
export type TourPackage = z.infer<typeof packageSchema>;

/* ─────────────────────────── Destinations ─────────────────────────── */

export const destinationSchema = z.object({
  id: slug,
  status: publishStatus.default("draft"),
  order: z.number().int().default(0),
  name: z.string().min(2).max(120),
  region: optionalText(120),
  tagline: optionalText(200),
  summary: z.string().max(800).default(""),
  body: z.array(z.string().max(1500)).default([]),
  highlights: z.array(z.string().max(120)).default([]),
  bestTime: optionalText(300),
  travelNotes: z.array(z.string().max(800)).default([]),
  heroImage: imageRef.optional(),
  /** true when no verified fixed package exists: page routes to custom inquiry */
  customOnly: z.boolean().default(true),
  packageIds: z.array(z.string()).default([]),
  seoTitle: optionalText(80),
  seoDescription: optionalText(200),
});
export type Destination = z.infer<typeof destinationSchema>;

/* ─────────────────────────── PDFs ─────────────────────────── */

export const pdfSource = z.object({
  kind: z.enum(["bundled", "storage", "external"]),
  /** bundled: /brochures/file.pdf · storage: object path */
  path: optionalText(500),
  /** storage download URL, external URL, or Google Drive share link */
  url: optionalText(1000),
});
export type PdfSource = z.infer<typeof pdfSource>;

export const pdfSchema = z.object({
  id: slug,
  status: publishStatus.default("draft"),
  order: z.number().int().default(0),
  title: z.string().min(2).max(160),
  description: z.string().max(600).default(""),
  packageIds: z.array(z.string()).default([]),
  source: pdfSource,
  coverImage: imageRef.optional(),
  pageCount: z.number().int().positive().optional(),
  fileSizeBytes: z.number().int().positive().optional(),
  version: optionalText(60),
  allowDownload: z.boolean().default(true),
});
export type PdfDoc = z.infer<typeof pdfSchema>;

/* ─────────────────────────── Gallery ─────────────────────────── */

export const galleryItemSchema = z.object({
  id: slug,
  status: publishStatus.default("draft"),
  order: z.number().int().default(0),
  featured: z.boolean().default(false),
  title: z.string().min(1).max(160),
  category: z.string().min(1).max(60),
  caption: optionalText(400),
  image: imageRef,
  packageIds: z.array(z.string()).default([]),
});
export type GalleryItem = z.infer<typeof galleryItemSchema>;

/* ─────────────────────────── Reviews ─────────────────────────── */

export const reviewSchema = z.object({
  id: z.string().min(1).max(80),
  status: z.enum(["pending", "published", "rejected"]).default("pending"),
  order: z.number().int().default(0),
  name: z.string().min(2).max(80),
  location: optionalText(80),
  packageId: optionalText(80),
  tripName: optionalText(160),
  travelMonth: optionalText(40),
  rating: z.number().int().min(1).max(5).nullable().default(null),
  text: z.string().min(20).max(2000),
  source: z.enum(["website", "whatsapp", "facebook", "instagram", "google", "in-person", "other"]).default("website"),
  consent: z.boolean().default(false),
  verifiedBooking: z.boolean().default(false),
  reply: optionalText(1000),
  adminNotes: optionalText(1000),
});
export type Review = z.infer<typeof reviewSchema>;

/* ─────────────────────────── FAQs ─────────────────────────── */

export const faqSchema = z.object({
  id: slug,
  status: publishStatus.default("draft"),
  order: z.number().int().default(0),
  category: z.string().max(60).default("General"),
  question: z.string().min(5).max(300),
  answer: z.string().min(5).max(3000),
  showOnHome: z.boolean().default(false),
});
export type Faq = z.infer<typeof faqSchema>;

/* ─────────────────────────── Homepage sections ─────────────────────────── */

export const sectionKey = z.enum([
  "hero",
  "featuredTours",
  "destinations",
  "customTour",
  "whyUs",
  "howItWorks",
  "reviews",
  "gallery",
  "brochures",
  "faq",
  "contact",
]);
export type SectionKey = z.infer<typeof sectionKey>;

export const sectionItem = z.object({
  title: z.string().max(120),
  text: optionalText(500),
  icon: optionalText(40),
});

export const sectionSchema = z.object({
  id: slug,
  key: sectionKey,
  status: publishStatus.default("published"),
  order: z.number().int().default(0),
  eyebrow: optionalText(80),
  title: optionalText(160),
  subtitle: optionalText(600),
  ctaLabel: optionalText(60),
  ctaHref: optionalText(300),
  secondaryCtaLabel: optionalText(60),
  secondaryCtaHref: optionalText(300),
  items: z.array(sectionItem).default([]),
  images: z.array(imageRef).default([]),
  featuredIds: z.array(z.string()).default([]),
});
export type Section = z.infer<typeof sectionSchema>;

/* ─────────────────────────── Settings ─────────────────────────── */

export const verification = z.enum(["confirmed", "unconfirmed", "conflicting"]);

export const phoneEntry = z.object({
  e164: z.string().regex(/^\+[1-9]\d{7,14}$/, "Use international format, e.g. +923001234567"),
  display: z.string().min(5).max(30),
  label: optionalText(80),
  office: optionalText(60),
  call: z.boolean().default(true),
  whatsapp: z.boolean().default(false),
  public: z.boolean().default(true),
  verification: verification.default("unconfirmed"),
  note: optionalText(300),
});

export const emailEntry = z.object({
  address: z.string().email(),
  label: optionalText(80),
  public: z.boolean().default(false),
  receivesInquiries: z.boolean().default(false),
  verification: verification.default("unconfirmed"),
  note: optionalText(300),
});

export const officeEntry = z.object({
  id: z.string().min(1).max(40),
  city: z.string().min(2).max(60),
  name: z.string().min(2).max(120),
  addressLines: z.array(z.string().max(160)).min(1),
  mapsQuery: optionalText(300),
  hours: optionalText(200),
  primary: z.boolean().default(false),
  public: z.boolean().default(true),
  verification: verification.default("unconfirmed"),
});

export const contactSettingsSchema = z.object({
  phones: z.array(phoneEntry).default([]),
  /** The number used by every WhatsApp button (E.164) */
  whatsappNumber: z.string().regex(/^\+[1-9]\d{7,14}$/),
  whatsappVerification: verification.default("unconfirmed"),
  whatsappGreeting: z.string().max(200).default("Assalam-o-Alaikum Pack & Go!"),
  emails: z.array(emailEntry).default([]),
  offices: z.array(officeEntry).default([]),
  instagramUrl: optionalText(300),
  facebookUrl: optionalText(300),
  bankName: optionalText(80),
  bankAccountTitle: optionalText(80),
  bankAccountNumber: optionalText(60),
  bankIban: optionalText(60),
  showBankDetails: z.boolean().default(true),
  paymentNote: optionalText(600),
  verificationNotes: z.array(z.string().max(500)).default([]),
});
export type ContactSettings = z.infer<typeof contactSettingsSchema>;

export const siteSettingsSchema = z.object({
  siteName: z.string().min(2).max(80),
  tagline: optionalText(160),
  description: z.string().max(300).default(""),
  announcement: optionalText(200),
  announcementHref: optionalText(300),
  galleryCategories: z.array(z.string().max(60)).default([]),
  /** Set when an admin imports starter content; from then on Firestore is authoritative. */
  initialized: z.boolean().default(false),
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const policyBlock = z.object({
  heading: z.string().max(160),
  paragraphs: z.array(z.string().max(2000)).default([]),
  list: z.array(z.string().max(1000)).default([]),
});

export const policiesSchema = z.object({
  tourTerms: z.array(policyBlock).default([]),
  cancellation: z.array(policyBlock).default([]),
  kids: z.array(policyBlock).default([]),
  payment: z.array(policyBlock).default([]),
  privacy: z.array(policyBlock).default([]),
  websiteTerms: z.array(policyBlock).default([]),
  lastUpdated: optionalText(40),
});
export type Policies = z.infer<typeof policiesSchema>;

/* ─────────────────────────── Inquiries ─────────────────────────── */

export const inquiryStatus = z.enum(["new", "contacted", "quoted", "booked", "handled", "closed", "spam"]);
export type InquiryStatus = z.infer<typeof inquiryStatus>;

/** What the public form may submit. Mirrors the checks in firestore.rules. */
export const inquiryInput = z.object({
  type: z.enum(["custom", "package", "contact"]),
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a phone or WhatsApp number")
    .max(25)
    .regex(/^[+0-9 ()-]+$/, "Digits, spaces, + and - only"),
  email: z.union([z.literal(""), z.string().trim().email("Please enter a valid email").max(120)]).default(""),
  preferredContact: z.enum(["whatsapp", "call", "email"]).default("whatsapp"),
  destinations: z.array(z.string().max(60)).max(12).default([]),
  packageId: z.string().max(80).default(""),
  departureCity: z.string().max(60).default(""),
  startDate: z.string().max(20).default(""),
  flexibleDates: z.boolean().default(false),
  durationDays: z.number().int().min(0).max(60).default(0),
  adults: z.number().int().min(1, "At least one adult").max(200),
  children: z.number().int().min(0).max(100).default(0),
  budget: z.string().max(60).default(""),
  transport: z.string().max(80).default(""),
  message: z.string().max(2000).default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please allow us to contact you" }) }),
});
export type InquiryInput = z.infer<typeof inquiryInput>;

export const inquiryNote = z.object({
  text: z.string().min(1).max(2000),
  by: z.string().max(120),
  at: z.string().max(40),
});

export type Inquiry = InquiryInput & {
  id: string;
  status: InquiryStatus;
  createdAt?: string;
  updatedAt?: string;
  notes?: z.infer<typeof inquiryNote>[];
  source?: string;
};

export const adminSchema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "editor"]),
  active: z.boolean(),
});
export type AdminRecord = z.infer<typeof adminSchema>;
