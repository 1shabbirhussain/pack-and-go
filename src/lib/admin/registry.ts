/**
 * Declarative admin configuration. Each collection is described once (schema, fields, list
 * columns, defaults) and rendered by the shared list + form components.
 */
import type { ZodTypeAny } from "zod";
import {
  contactSettingsSchema, destinationSchema, faqSchema, galleryItemSchema, packageSchema, pdfSchema,
  policiesSchema, reviewSchema, sectionSchema, siteSettingsSchema,
} from "@/lib/schema";
import type { CollectionKey, SingletonKey } from "./data";

export type Option = { value: string; label: string };

export type FieldDef =
  | { type: "text" | "textarea" | "url" | "email"; name: string; label: string; help?: string; placeholder?: string; rows?: number; tab?: string; width?: "full" | "half" }
  | { type: "slug"; name: string; label: string; help?: string; from?: string; tab?: string }
  | { type: "number"; name: string; label: string; help?: string; nullable?: boolean; min?: number; max?: number; tab?: string; width?: "full" | "half" }
  | { type: "boolean"; name: string; label: string; help?: string; tab?: string; width?: "full" | "half" }
  | { type: "select"; name: string; label: string; options: Option[]; help?: string; tab?: string; width?: "full" | "half" }
  | { type: "stringList"; name: string; label: string; help?: string; itemLabel?: string; multiline?: boolean; tab?: string }
  | { type: "refList"; name: string; label: string; collection: CollectionKey; labelField: string; help?: string; tab?: string }
  | { type: "image"; name: string; label: string; help?: string; tab?: string }
  | { type: "imageList"; name: string; label: string; help?: string; tab?: string }
  | { type: "pdfSource"; name: string; label: string; help?: string; tab?: string }
  | { type: "objectList"; name: string; label: string; fields: FieldDef[]; itemTitle: (item: Record<string, unknown>, i: number) => string; newItem: () => Record<string, unknown>; help?: string; tab?: string };

export interface CollectionConfig {
  key: CollectionKey;
  label: string;
  singular: string;
  description: string;
  schema: ZodTypeAny;
  titleField: string;
  idMode: "slug" | "auto";
  statusOptions: Option[];
  columns: { name: string; label: string; format?: "status" | "bool" | "date" | "count" }[];
  fields: FieldDef[];
  defaults: () => Record<string, unknown>;
  publicHref?: (id: string) => string;
}

const PUBLISH: Option[] = [
  { value: "draft", label: "Draft (hidden)" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived (hidden)" },
];

const RIGHTS: Option[] = [
  { value: "owned", label: "Owned by Pack & Go" },
  { value: "licensed", label: "Licensed" },
  { value: "unverified", label: "Unverified — confirm rights" },
];
export { RIGHTS };

const common = (titleLabel = "Title"): FieldDef[] => [
  { type: "select", name: "status", label: "Visibility", options: PUBLISH, tab: "Basics", width: "half" },
  { type: "number", name: "order", label: "Sort order", help: "Lower numbers appear first.", tab: "Basics", width: "half" },
  { type: "text", name: "title", label: titleLabel, tab: "Basics" },
];

const ORIGINS: Option[] = [
  { value: "karachi", label: "Karachi" },
  { value: "islamabad", label: "Islamabad" },
  { value: "hyderabad", label: "Hyderabad" },
  { value: "lahore", label: "Lahore" },
  { value: "other", label: "Other" },
];

export const COLLECTIONS: Record<CollectionKey, CollectionConfig> = {
  packages: {
    key: "packages",
    label: "Tour packages",
    singular: "package",
    description: "Group tours with itineraries, prices by departure city and transport, inclusions and policies.",
    schema: packageSchema,
    titleField: "title",
    idMode: "slug",
    statusOptions: PUBLISH,
    columns: [{ name: "title", label: "Title" }, { name: "status", label: "Status", format: "status" }, { name: "featured", label: "Featured", format: "bool" }, { name: "reviewFlags", label: "Owner checks", format: "count" }],
    publicHref: (id) => `/tours/${id}`,
    defaults: () => ({
      id: "", status: "draft", order: 99, featured: false, title: "", sourceTitle: "", tagline: "", summary: "", labels: [], destinationIds: [],
      images: [], durations: { karachi: { days: 7, nights: 4 }, islamabad: { days: 4, nights: 3 } }, highlights: [], itinerary: [], currency: "PKR",
      priceValidity: "", priceOptions: [], priceNotes: [], inclusions: [], exclusions: [], mealsBreakfast: [], mealsDinner: [], mealsNote: "",
      kidsPolicy: [], packingList: [], importantNotes: [], advisories: [], brochureIds: [], reviewFlags: [], seoTitle: "", seoDescription: "",
    }),
    fields: [
      ...common(),
      { type: "slug", name: "id", label: "URL slug (ID)", from: "title", help: "Used in the page address: /tours/your-slug. Cannot be changed later.", tab: "Basics" },
      { type: "boolean", name: "featured", label: "Feature on the homepage", tab: "Basics" },
      { type: "text", name: "tagline", label: "Tagline", tab: "Basics" },
      { type: "textarea", name: "summary", label: "Summary", rows: 4, tab: "Basics" },
      { type: "stringList", name: "labels", label: "Labels / badges", tab: "Basics" },
      { type: "refList", name: "destinationIds", label: "Destinations", collection: "destinations", labelField: "name", tab: "Basics" },
      { type: "stringList", name: "highlights", label: "Highlights / attraction points", tab: "Basics" },
      { type: "image", name: "heroImage", label: "Hero image", tab: "Media" },
      { type: "imageList", name: "images", label: "Additional images", tab: "Media" },
      { type: "refList", name: "brochureIds", label: "Brochures (PDF)", collection: "pdfs", labelField: "title", tab: "Media" },
      { type: "number", name: "durations.karachi.days", label: "Days from Karachi", nullable: false, tab: "Itinerary", width: "half" },
      { type: "number", name: "durations.karachi.nights", label: "Hotel nights from Karachi", nullable: true, tab: "Itinerary", width: "half" },
      { type: "number", name: "durations.islamabad.days", label: "Days from Islamabad", nullable: false, tab: "Itinerary", width: "half" },
      { type: "number", name: "durations.islamabad.nights", label: "Hotel nights from Islamabad", nullable: true, tab: "Itinerary", width: "half" },
      {
        type: "objectList", name: "itinerary", label: "Day-by-day itinerary", tab: "Itinerary",
        help: "Days marked 'Karachi only' are hidden when a visitor selects 'From Islamabad'.",
        itemTitle: (d, i) => `Day ${(d.day as number) ?? i + 1}: ${(d.title as string) || "Untitled"}`,
        newItem: () => ({ day: 1, title: "", audience: "all", items: [], overnight: "", meals: "" }),
        fields: [
          { type: "number", name: "day", label: "Day number", width: "half" },
          { type: "select", name: "audience", label: "Who is this day for?", options: [{ value: "all", label: "Everyone" }, { value: "karachi", label: "Karachi travellers only" }, { value: "islamabad", label: "Islamabad travellers only" }], width: "half" },
          { type: "text", name: "title", label: "Day title" },
          {
            type: "objectList", name: "items", label: "Activities", itemTitle: (it) => (it.text as string) || "Activity",
            newItem: () => ({ text: "", optional: false, note: "" }),
            fields: [
              { type: "text", name: "text", label: "Activity" },
              { type: "boolean", name: "optional", label: "Optional / paid locally", width: "half" },
              { type: "text", name: "note", label: "Note", width: "half" },
            ],
          },
          { type: "text", name: "overnight", label: "Overnight", width: "half" },
          { type: "text", name: "meals", label: "Meals", width: "half" },
          { type: "number", name: "sourcePage", label: "Brochure page (reference)", nullable: true, width: "half" },
        ],
      },
      { type: "text", name: "priceValidity", label: "Price validity note", tab: "Prices" },
      {
        type: "objectList", name: "priceOptions", label: "Price options", tab: "Prices",
        help: "Only 'Published' rows are shown on the website. 'Needs review' rows stay hidden until confirmed.",
        itemTitle: (o) => `${(o.origin as string) ?? ""} · ${(o.label as string) || "Option"}${o.status !== "published" ? ` (${o.status})` : ""}`,
        newItem: () => ({ id: `opt-${Date.now().toString(36)}`, origin: "karachi", label: "", perPerson: null, perCouple: null, status: "published", note: "" }),
        fields: [
          { type: "select", name: "origin", label: "Departure city", options: ORIGINS, width: "half" },
          { type: "select", name: "status", label: "Status", options: [{ value: "published", label: "Published" }, { value: "needs_review", label: "Needs review (hidden)" }, { value: "hidden", label: "Hidden" }], width: "half" },
          { type: "text", name: "label", label: "Transport / option label" },
          { type: "number", name: "perPerson", label: "Per person (PKR)", nullable: true, width: "half" },
          { type: "number", name: "perCouple", label: "Per couple (PKR)", nullable: true, width: "half" },
          { type: "text", name: "note", label: "Internal note" },
          { type: "text", name: "id", label: "Option ID", help: "Internal identifier", width: "half" },
          { type: "number", name: "sourcePage", label: "Brochure page", nullable: true, width: "half" },
        ],
      },
      { type: "stringList", name: "priceNotes", label: "Price notes (shown publicly)", multiline: true, tab: "Prices" },
      { type: "stringList", name: "inclusions", label: "Inclusions", tab: "Inclusions & policies" },
      { type: "stringList", name: "exclusions", label: "Exclusions", tab: "Inclusions & policies" },
      { type: "stringList", name: "mealsBreakfast", label: "Breakfast menu", tab: "Inclusions & policies" },
      { type: "stringList", name: "mealsDinner", label: "Dinner menu", tab: "Inclusions & policies" },
      { type: "text", name: "mealsNote", label: "Meals note", tab: "Inclusions & policies" },
      { type: "stringList", name: "kidsPolicy", label: "Kids policy", tab: "Inclusions & policies" },
      { type: "stringList", name: "packingList", label: "What to bring", tab: "Inclusions & policies" },
      { type: "stringList", name: "importantNotes", label: "Good-to-know notes", multiline: true, tab: "Inclusions & policies" },
      { type: "stringList", name: "advisories", label: "Travel advisories", multiline: true, tab: "Inclusions & policies" },
      { type: "stringList", name: "reviewFlags", label: "Owner checks (admin only — never shown publicly)", multiline: true, tab: "Owner checks" },
      { type: "text", name: "sourceTitle", label: "Title as printed in brochure", tab: "Owner checks" },
      { type: "text", name: "seoTitle", label: "SEO title", help: "≈60 characters", tab: "SEO" },
      { type: "textarea", name: "seoDescription", label: "SEO description", help: "≈155 characters", rows: 3, tab: "SEO" },
    ],
  },

  destinations: {
    key: "destinations",
    label: "Destinations",
    singular: "destination",
    description: "Destination guides. Mark 'custom trips only' when no verified package exists.",
    schema: destinationSchema,
    titleField: "name",
    idMode: "slug",
    statusOptions: PUBLISH,
    columns: [{ name: "name", label: "Name" }, { name: "region", label: "Region" }, { name: "status", label: "Status", format: "status" }, { name: "customOnly", label: "Custom only", format: "bool" }],
    publicHref: (id) => `/destinations/${id}`,
    defaults: () => ({ id: "", status: "draft", order: 99, name: "", region: "", tagline: "", summary: "", body: [], highlights: [], bestTime: "", travelNotes: [], customOnly: true, packageIds: [], seoTitle: "", seoDescription: "" }),
    fields: [
      { type: "select", name: "status", label: "Visibility", options: PUBLISH, tab: "Basics", width: "half" },
      { type: "number", name: "order", label: "Sort order", tab: "Basics", width: "half" },
      { type: "text", name: "name", label: "Name", tab: "Basics" },
      { type: "slug", name: "id", label: "URL slug (ID)", from: "name", tab: "Basics" },
      { type: "text", name: "region", label: "Region", tab: "Basics", width: "half" },
      { type: "boolean", name: "customOnly", label: "Custom trips only (no fixed package)", tab: "Basics", width: "half" },
      { type: "text", name: "tagline", label: "Tagline", tab: "Basics" },
      { type: "textarea", name: "summary", label: "Summary", rows: 3, tab: "Basics" },
      { type: "stringList", name: "body", label: "Body paragraphs", multiline: true, tab: "Content" },
      { type: "stringList", name: "highlights", label: "Highlights", tab: "Content" },
      { type: "text", name: "bestTime", label: "Best time to visit", tab: "Content" },
      { type: "stringList", name: "travelNotes", label: "Travel notes / advisories", multiline: true, tab: "Content" },
      { type: "refList", name: "packageIds", label: "Related packages", collection: "packages", labelField: "title", tab: "Content" },
      { type: "image", name: "heroImage", label: "Hero image", tab: "Media" },
      { type: "text", name: "seoTitle", label: "SEO title", tab: "SEO" },
      { type: "textarea", name: "seoDescription", label: "SEO description", rows: 3, tab: "SEO" },
    ],
  },

  pdfs: {
    key: "pdfs",
    label: "Brochures (PDF)",
    singular: "brochure",
    description: "PDF brochures from bundled files, Firebase Storage uploads or external links (e.g. Google Drive).",
    schema: pdfSchema,
    titleField: "title",
    idMode: "slug",
    statusOptions: PUBLISH,
    columns: [{ name: "title", label: "Title" }, { name: "status", label: "Status", format: "status" }, { name: "source.kind", label: "Source" }, { name: "packageIds", label: "Packages", format: "count" }],
    publicHref: (id) => `/brochures/${id}`,
    defaults: () => ({ id: "", status: "draft", order: 99, title: "", description: "", packageIds: [], source: { kind: "storage", path: "", url: "" }, version: "", allowDownload: true }),
    fields: [
      ...common(),
      { type: "slug", name: "id", label: "URL slug (ID)", from: "title", tab: "Basics" },
      { type: "textarea", name: "description", label: "Description", rows: 3, tab: "Basics" },
      { type: "refList", name: "packageIds", label: "Linked packages", collection: "packages", labelField: "title", tab: "Basics" },
      { type: "pdfSource", name: "source", label: "PDF file", tab: "File" },
      { type: "boolean", name: "allowDownload", label: "Allow visitors to download", tab: "File", width: "half" },
      { type: "text", name: "version", label: "Version / edition", tab: "File", width: "half" },
      { type: "number", name: "pageCount", label: "Page count", nullable: true, tab: "File", width: "half" },
      { type: "number", name: "fileSizeBytes", label: "File size (bytes)", nullable: true, tab: "File", width: "half" },
      { type: "image", name: "coverImage", label: "Cover image", tab: "File" },
    ],
  },

  gallery: {
    key: "gallery",
    label: "Gallery",
    singular: "photo",
    description: "Photos shown in the gallery. Record image rights for every photo.",
    schema: galleryItemSchema,
    titleField: "title",
    idMode: "slug",
    statusOptions: PUBLISH,
    columns: [{ name: "title", label: "Title" }, { name: "category", label: "Category" }, { name: "status", label: "Status", format: "status" }, { name: "image.rights", label: "Rights" }],
    defaults: () => ({ id: "", status: "draft", order: 99, featured: false, title: "", category: "Our trips", caption: "", image: { src: { kind: "storage", path: "", url: "" }, alt: "", credit: "", rights: "owned" }, packageIds: [] }),
    fields: [
      ...common(),
      { type: "slug", name: "id", label: "ID", from: "title", tab: "Basics" },
      { type: "text", name: "category", label: "Category", help: "Manage the category list under Settings → Site.", tab: "Basics", width: "half" },
      { type: "boolean", name: "featured", label: "Show on homepage", tab: "Basics", width: "half" },
      { type: "text", name: "caption", label: "Caption", tab: "Basics" },
      { type: "image", name: "image", label: "Photo", tab: "Basics" },
      { type: "refList", name: "packageIds", label: "Related packages", collection: "packages", labelField: "title", tab: "Basics" },
    ],
  },

  reviews: {
    key: "reviews",
    label: "Reviews",
    singular: "review",
    description: "Only publish genuine reviews with the traveller's consent. Website submissions arrive as 'pending'.",
    schema: reviewSchema,
    titleField: "name",
    idMode: "auto",
    statusOptions: [{ value: "pending", label: "Pending" }, { value: "published", label: "Published" }, { value: "rejected", label: "Rejected" }],
    columns: [{ name: "name", label: "Name" }, { name: "tripName", label: "Trip" }, { name: "status", label: "Status", format: "status" }, { name: "consent", label: "Consent", format: "bool" }, { name: "source", label: "Source" }],
    defaults: () => ({ id: "", status: "pending", order: 0, name: "", location: "", packageId: "", tripName: "", travelMonth: "", rating: null, text: "", source: "whatsapp", consent: false, verifiedBooking: false, reply: "", adminNotes: "" }),
    fields: [
      { type: "select", name: "status", label: "Status", options: [{ value: "pending", label: "Pending" }, { value: "published", label: "Published" }, { value: "rejected", label: "Rejected" }], width: "half" },
      { type: "select", name: "source", label: "Where the review came from", options: ["website", "whatsapp", "facebook", "instagram", "google", "in-person", "other"].map((v) => ({ value: v, label: v })), width: "half" },
      { type: "text", name: "name", label: "Traveller name (as they agreed to be shown)", width: "half" },
      { type: "text", name: "location", label: "City", width: "half" },
      { type: "text", name: "tripName", label: "Trip name", width: "half" },
      { type: "text", name: "travelMonth", label: "Travel month", width: "half" },
      { type: "text", name: "packageId", label: "Package ID (optional, shows review on that tour page)", width: "half" },
      { type: "number", name: "rating", label: "Rating (1–5, optional)", nullable: true, min: 1, max: 5, width: "half" },
      { type: "textarea", name: "text", label: "Review text", rows: 6 },
      { type: "boolean", name: "consent", label: "Traveller consented to publication", width: "half" },
      { type: "boolean", name: "verifiedBooking", label: "Booking verified by our team", width: "half" },
      { type: "textarea", name: "reply", label: "Public reply from Pack & Go (optional)", rows: 3 },
      { type: "textarea", name: "adminNotes", label: "Internal notes", rows: 3 },
      { type: "number", name: "order", label: "Sort order", width: "half" },
    ],
  },

  faqs: {
    key: "faqs",
    label: "FAQs",
    singular: "FAQ",
    description: "Questions and answers shown on the FAQ page and homepage.",
    schema: faqSchema,
    titleField: "question",
    idMode: "slug",
    statusOptions: PUBLISH,
    columns: [{ name: "question", label: "Question" }, { name: "category", label: "Category" }, { name: "status", label: "Status", format: "status" }, { name: "showOnHome", label: "Home", format: "bool" }],
    defaults: () => ({ id: "", status: "draft", order: 99, category: "General", question: "", answer: "", showOnHome: false }),
    fields: [
      { type: "select", name: "status", label: "Visibility", options: PUBLISH, width: "half" },
      { type: "number", name: "order", label: "Sort order", width: "half" },
      { type: "text", name: "question", label: "Question" },
      { type: "slug", name: "id", label: "ID", from: "question" },
      { type: "textarea", name: "answer", label: "Answer", rows: 6 },
      { type: "text", name: "category", label: "Category", width: "half" },
      { type: "boolean", name: "showOnHome", label: "Show on homepage", width: "half" },
    ],
  },

  sections: {
    key: "sections",
    label: "Homepage sections",
    singular: "section",
    description: "Control the homepage: order, visibility, headings, buttons, items, images and featured tours.",
    schema: sectionSchema,
    titleField: "title",
    idMode: "slug",
    statusOptions: PUBLISH,
    columns: [{ name: "key", label: "Type" }, { name: "title", label: "Heading" }, { name: "status", label: "Status", format: "status" }],
    publicHref: () => "/",
    defaults: () => ({ id: "", key: "whyUs", status: "draft", order: 99, eyebrow: "", title: "", subtitle: "", ctaLabel: "", ctaHref: "", secondaryCtaLabel: "", secondaryCtaHref: "", items: [], images: [], featuredIds: [] }),
    fields: [
      { type: "select", name: "key", label: "Section type", options: ["hero", "featuredTours", "destinations", "customTour", "whyUs", "howItWorks", "reviews", "gallery", "brochures", "faq", "contact"].map((v) => ({ value: v, label: v })), width: "half" },
      { type: "select", name: "status", label: "Visibility", options: PUBLISH, width: "half" },
      { type: "number", name: "order", label: "Position on page", width: "half" },
      { type: "slug", name: "id", label: "ID", from: "title" },
      { type: "text", name: "eyebrow", label: "Eyebrow (small label)" },
      { type: "text", name: "title", label: "Heading" },
      { type: "textarea", name: "subtitle", label: "Sub-heading", rows: 3 },
      { type: "text", name: "ctaLabel", label: "Button label", width: "half" },
      { type: "text", name: "ctaHref", label: "Button link", width: "half" },
      { type: "text", name: "secondaryCtaLabel", label: "Second button label", width: "half" },
      { type: "text", name: "secondaryCtaHref", label: "Second button link", width: "half" },
      {
        type: "objectList", name: "items", label: "Items (feature cards / steps / hero chips)", itemTitle: (it) => (it.title as string) || "Item",
        newItem: () => ({ title: "", text: "", icon: "" }),
        fields: [
          { type: "text", name: "title", label: "Title" },
          { type: "textarea", name: "text", label: "Text", rows: 2 },
          { type: "select", name: "icon", label: "Icon", options: ["", "map-pin", "utensils", "compass", "route", "bed", "receipt", "map", "message-circle", "shield-check", "backpack"].map((v) => ({ value: v, label: v || "Default" })) },
        ],
      },
      { type: "imageList", name: "images", label: "Images (hero slideshow)" },
      { type: "refList", name: "featuredIds", label: "Featured tours (for 'featuredTours')", collection: "packages", labelField: "title" },
    ],
  },
};

export interface SingletonConfig {
  key: SingletonKey;
  label: string;
  description: string;
  schema: ZodTypeAny;
  fields: FieldDef[];
  ownerOnly: boolean;
}

const VERIF: Option[] = [{ value: "confirmed", label: "Confirmed" }, { value: "unconfirmed", label: "Unconfirmed" }, { value: "conflicting", label: "Conflicting" }];

const policyBlocks = (name: string, label: string): FieldDef => ({
  type: "objectList", name, label, tab: label, itemTitle: (b) => (b.heading as string) || "Block",
  newItem: () => ({ heading: "", paragraphs: [], list: [] }),
  fields: [
    { type: "text", name: "heading", label: "Heading" },
    { type: "stringList", name: "paragraphs", label: "Paragraphs", multiline: true },
    { type: "stringList", name: "list", label: "List items", multiline: true },
  ],
});

export const SINGLETONS: Record<SingletonKey, SingletonConfig> = {
  contact: {
    key: "contact",
    label: "Contact & business details",
    description: "Phones, WhatsApp, emails, offices, social links and bank details. Record the verification status of each item.",
    schema: contactSettingsSchema,
    ownerOnly: true,
    fields: [
      { type: "text", name: "whatsappNumber", label: "WhatsApp number used by all buttons (E.164, e.g. +923107869147)", tab: "Phones & WhatsApp", width: "half" },
      { type: "select", name: "whatsappVerification", label: "WhatsApp number status", options: VERIF, tab: "Phones & WhatsApp", width: "half" },
      { type: "text", name: "whatsappGreeting", label: "WhatsApp greeting line", tab: "Phones & WhatsApp" },
      {
        type: "objectList", name: "phones", label: "Phone numbers", tab: "Phones & WhatsApp", itemTitle: (p) => `${(p.display as string) || "Phone"}${p.public ? "" : " (hidden)"}`,
        newItem: () => ({ e164: "+92", display: "", label: "", office: "", call: true, whatsapp: false, public: true, verification: "unconfirmed", note: "" }),
        fields: [
          { type: "text", name: "e164", label: "International format (+92…)", width: "half" },
          { type: "text", name: "display", label: "Display as", width: "half" },
          { type: "text", name: "label", label: "Label", width: "half" },
          { type: "text", name: "office", label: "Office", width: "half" },
          { type: "boolean", name: "public", label: "Show on website", width: "half" },
          { type: "boolean", name: "whatsapp", label: "Has WhatsApp", width: "half" },
          { type: "select", name: "verification", label: "Verification", options: VERIF, width: "half" },
          { type: "text", name: "note", label: "Internal note" },
        ],
      },
      {
        type: "objectList", name: "emails", label: "Email addresses", tab: "Email", itemTitle: (e) => `${(e.address as string) || "Email"}${e.public ? "" : " (hidden)"}`,
        newItem: () => ({ address: "", label: "", public: false, receivesInquiries: false, verification: "unconfirmed", note: "" }),
        fields: [
          { type: "email", name: "address", label: "Email" },
          { type: "text", name: "label", label: "Label", width: "half" },
          { type: "select", name: "verification", label: "Verification", options: VERIF, width: "half" },
          { type: "boolean", name: "public", label: "Show on website", width: "half" },
          { type: "boolean", name: "receivesInquiries", label: "Receives inquiries", width: "half" },
          { type: "text", name: "note", label: "Internal note" },
        ],
      },
      {
        type: "objectList", name: "offices", label: "Offices", tab: "Offices", itemTitle: (o) => (o.name as string) || "Office",
        newItem: () => ({ id: `office-${Date.now().toString(36)}`, city: "", name: "", addressLines: [""], mapsQuery: "", hours: "", primary: false, public: true, verification: "unconfirmed" }),
        fields: [
          { type: "text", name: "id", label: "ID", width: "half" },
          { type: "text", name: "city", label: "City", width: "half" },
          { type: "text", name: "name", label: "Display name" },
          { type: "stringList", name: "addressLines", label: "Address lines" },
          { type: "text", name: "mapsQuery", label: "Google Maps search text (or Plus Code)" },
          { type: "text", name: "hours", label: "Opening hours" },
          { type: "boolean", name: "primary", label: "Primary office", width: "half" },
          { type: "boolean", name: "public", label: "Show on website", width: "half" },
          { type: "select", name: "verification", label: "Verification", options: VERIF, width: "half" },
        ],
      },
      { type: "url", name: "instagramUrl", label: "Instagram URL", tab: "Social" },
      { type: "url", name: "facebookUrl", label: "Facebook URL", tab: "Social" },
      { type: "boolean", name: "showBankDetails", label: "Show bank details on the website", tab: "Payment" },
      { type: "text", name: "bankName", label: "Bank", tab: "Payment", width: "half" },
      { type: "text", name: "bankAccountTitle", label: "Account title", tab: "Payment", width: "half" },
      { type: "text", name: "bankAccountNumber", label: "Account number", tab: "Payment", width: "half" },
      { type: "text", name: "bankIban", label: "IBAN", tab: "Payment", width: "half" },
      { type: "textarea", name: "paymentNote", label: "Payment safety note", rows: 3, tab: "Payment" },
      { type: "stringList", name: "verificationNotes", label: "Open verification items (admin only)", multiline: true, tab: "Verification" },
    ],
  },
  site: {
    key: "site",
    label: "Site settings",
    description: "Site name, tagline, description, announcement bar and gallery categories.",
    schema: siteSettingsSchema,
    ownerOnly: true,
    fields: [
      { type: "text", name: "siteName", label: "Site name" },
      { type: "text", name: "tagline", label: "Tagline" },
      { type: "textarea", name: "description", label: "Description (used in footer and search results)", rows: 3 },
      { type: "text", name: "announcement", label: "Announcement bar text (leave empty to hide)" },
      { type: "text", name: "announcementHref", label: "Announcement link" },
      { type: "stringList", name: "galleryCategories", label: "Gallery categories (display order)" },
      { type: "boolean", name: "initialized", label: "Use Firestore as the content source (set automatically by the starter import)" },
    ],
  },
  policies: {
    key: "policies",
    label: "Policies & terms",
    description: "Tour terms, cancellation, kids, payment, privacy and website terms.",
    schema: policiesSchema,
    ownerOnly: true,
    fields: [
      { type: "text", name: "lastUpdated", label: "Last updated (YYYY-MM-DD)", tab: "Tour terms" },
      policyBlocks("tourTerms", "Tour terms"),
      policyBlocks("cancellation", "Cancellation"),
      policyBlocks("kids", "Kids"),
      policyBlocks("payment", "Payment"),
      policyBlocks("privacy", "Privacy"),
      policyBlocks("websiteTerms", "Website terms"),
    ],
  },
};
