import { describe, expect, it } from "vitest";
import { parseGoogleDriveId, resolvePdf } from "@/lib/pdf";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { decodeFields } from "@/lib/firebase/rest";
import { normalisePhone } from "@/components/admin/Inquiries";

describe("PDF source resolver", () => {
  it("resolves bundled files", () => {
    expect(resolvePdf({ kind: "bundled", path: "/brochures/a.pdf", url: "" })).toMatchObject({ pdfUrl: "/brochures/a.pdf", provider: "local" });
  });
  it("rejects bundled paths that are not absolute", () => expect(resolvePdf({ kind: "bundled", path: "a.pdf", url: "" })).toBeNull());
  it("resolves Firebase Storage URLs", () => {
    expect(resolvePdf({ kind: "storage", path: "public/brochures/x.pdf", url: "https://firebasestorage.googleapis.com/x" })?.provider).toBe("firebase");
  });
  it("turns Google Drive share links into preview + download URLs", () => {
    const r = resolvePdf({ kind: "external", path: "", url: "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/view?usp=sharing" })!;
    expect(r.provider).toBe("google-drive");
    expect(r.pdfUrl).toBeNull();
    expect(r.embedUrl).toBe("https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/preview");
    expect(r.downloadUrl).toContain("export=download&id=1AbCdEfGhIjKlMnOp");
  });
  it("parses other Drive URL shapes", () => {
    expect(parseGoogleDriveId("https://drive.google.com/open?id=1AbCdEfGhIjKlMnOp")).toBe("1AbCdEfGhIjKlMnOp");
    expect(parseGoogleDriveId("https://example.com/file.pdf")).toBeNull();
  });
  it("rejects non-http external URLs", () => expect(resolvePdf({ kind: "external", path: "", url: "javascript:alert(1)" })).toBeNull());
});

describe("WhatsApp links", () => {
  it("includes tour, city, transport and travellers", () => {
    const m = buildWhatsAppMessage({ tour: "Naran", departureCity: "Karachi", transport: "Economy train", adults: 2, children: 1 });
    expect(m).toContain("• Tour: Naran");
    expect(m).toContain("• From: Karachi – Economy train");
    expect(m).toContain("2 adults, 1 child");
  });
  it("builds wa.me links with digits only", () => {
    expect(whatsappLink("+92 310 7869147", "hi")).toBe("https://wa.me/923107869147?text=hi");
  });
});

describe("Firestore REST decoding", () => {
  it("decodes nested values", () => {
    expect(decodeFields({ a: { integerValue: "5" }, b: { arrayValue: { values: [{ stringValue: "x" }] } }, c: { mapValue: { fields: { d: { booleanValue: true } } } }, e: { nullValue: null } }))
      .toEqual({ a: 5, b: ["x"], c: { d: true }, e: null });
  });
});

describe("phone normalisation", () => {
  it("converts Pakistani local numbers", () => expect(normalisePhone("0300 123 4567")).toBe("+923001234567"));
  it("keeps international numbers", () => expect(normalisePhone("+44 7700 900123")).toBe("+447700900123"));
});
