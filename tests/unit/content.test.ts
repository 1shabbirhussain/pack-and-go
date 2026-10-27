import { describe, expect, it } from "vitest";
import { SEED } from "@/content/seed";
import { contactSettingsSchema, destinationSchema, faqSchema, galleryItemSchema, inquiryInput, packageSchema, pdfSchema, policiesSchema, sectionSchema, siteSettingsSchema } from "@/lib/schema";
import { existsSync } from "node:fs";

describe("starter content", () => {
  it("validates against the schemas", () => {
    for (const p of SEED.packages) expect(packageSchema.safeParse(p).success, p.id).toBe(true);
    for (const d of SEED.destinations) expect(destinationSchema.safeParse(d).success, d.id).toBe(true);
    for (const d of SEED.pdfs) expect(pdfSchema.safeParse(d).success, d.id).toBe(true);
    for (const g of SEED.gallery) expect(galleryItemSchema.safeParse(g).success, g.id).toBe(true);
    for (const f of SEED.faqs) expect(faqSchema.safeParse(f).success, f.id).toBe(true);
    for (const s of SEED.sections) expect(sectionSchema.safeParse(s).success, s.id).toBe(true);
    expect(contactSettingsSchema.safeParse(SEED.settings.contact).success).toBe(true);
    expect(siteSettingsSchema.safeParse(SEED.settings.site).success).toBe(true);
    expect(policiesSchema.safeParse(SEED.settings.policies).success).toBe(true);
  });

  it("matches the brochure prices exactly (PDF p3 of each brochure)", () => {
    const price = (pkg: string, id: string) => SEED.packages.find((p) => p.id === pkg)!.priceOptions.find((o) => o.id === id)!;
    expect(price("naran-shogran-babusar-saiful-malook", "isb")).toMatchObject({ perPerson: 25000, perCouple: 60000 });
    expect(price("naran-shogran-babusar-saiful-malook", "khi-economy-train")).toMatchObject({ perPerson: 36000, perCouple: 85000 });
    expect(price("kashmir-naran-valley-10-days", "khi-greenline-economy")).toMatchObject({ perPerson: 51000, perCouple: 120000 });
    expect(price("kashmir-naran-valley-10-days", "khi-sleeper-business")).toMatchObject({ perPerson: 64000, perCouple: 148000 });
    expect(price("naran-hunza-skardu-12-days", "isb")).toMatchObject({ perPerson: 40000, perCouple: 95000 });
    expect(price("naran-hunza-skardu-12-days", "khi-sleeper-bus")).toMatchObject({ perPerson: 70000, perCouple: 162000 });
  });

  it("keeps duplicate brochure price rows hidden for owner review", () => {
    for (const id of ["naran-shogran-babusar-saiful-malook", "kashmir-neelum-arang-kel-ratti-gali"]) {
      const row = SEED.packages.find((p) => p.id === id)!.priceOptions.find((o) => o.id === "khi-sleeper-bus")!;
      expect(row.status).toBe("needs_review");
    }
  });

  it("itinerary day counts match the brochure durations", () => {
    for (const p of SEED.packages) {
      const khi = p.itinerary.filter((d) => d.audience !== "islamabad").length;
      const isb = p.itinerary.filter((d) => d.audience === "all" || d.audience === "islamabad").length;
      expect(khi, p.id).toBe(p.durations.karachi!.days);
      expect(isb, p.id).toBe(p.durations.islamabad!.days);
    }
  });

  it("references bundled files that exist", () => {
    for (const d of SEED.pdfs) expect(existsSync(`public${d.source.path}`), d.source.path).toBe(true);
    for (const g of SEED.gallery) expect(existsSync(`public${g.image.src.path}`), g.image.src.path).toBe(true);
  });

  it("ships no invented reviews", () => {
    expect(SEED.reviews).toHaveLength(0);
  });

  it("only links packages and brochures that exist", () => {
    const pkgIds = new Set(SEED.packages.map((p) => p.id));
    const pdfIds = new Set(SEED.pdfs.map((d) => d.id));
    for (const p of SEED.packages) for (const b of p.brochureIds) expect(pdfIds.has(b), b).toBe(true);
    for (const d of SEED.destinations) for (const id of d.packageIds) expect(pkgIds.has(id), id).toBe(true);
  });
});

describe("inquiry validation", () => {
  const base = { type: "custom", name: "Ali Khan", phone: "0300 1234567", adults: 2, consent: true };
  it("accepts a minimal valid inquiry", () => expect(inquiryInput.safeParse(base).success).toBe(true));
  it("rejects missing consent", () => expect(inquiryInput.safeParse({ ...base, consent: false }).success).toBe(false));
  it("rejects letters in phone", () => expect(inquiryInput.safeParse({ ...base, phone: "call me" }).success).toBe(false));
  it("rejects zero adults", () => expect(inquiryInput.safeParse({ ...base, adults: 0 }).success).toBe(false));
  it("rejects overlong messages", () => expect(inquiryInput.safeParse({ ...base, message: "x".repeat(2001) }).success).toBe(false));
});
