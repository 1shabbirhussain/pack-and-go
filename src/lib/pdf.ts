/**
 * Brochure source abstraction. Package pages and the viewer only ever call `resolvePdf()`,
 * so switching a brochure between a bundled file, Firebase Storage and Google Drive is a data
 * change in the admin panel — never a redesign.
 */
import type { PdfSource } from "./schema";

export interface ResolvedPdf {
  kind: PdfSource["kind"];
  /** URL loaded by the in-page pdf.js viewer (null when it must be embedded via iframe instead) */
  pdfUrl: string | null;
  /** URL for an <iframe> embed fallback (e.g. Google Drive preview) */
  embedUrl: string | null;
  /** "Open in new tab" target */
  openUrl: string;
  /** Direct download URL (may equal openUrl) */
  downloadUrl: string;
  provider: "local" | "firebase" | "google-drive" | "web";
}

const DRIVE_PATTERNS = [
  /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{10,})/,
  /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]{10,})/,
  /drive\.google\.com\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]{10,})/,
  /docs\.google\.com\/(?:.*\/)?d\/([a-zA-Z0-9_-]{10,})/,
];

export function parseGoogleDriveId(url: string): string | null {
  for (const re of DRIVE_PATTERNS) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export function resolvePdf(source: PdfSource): ResolvedPdf | null {
  if (source.kind === "bundled") {
    const path = source.path?.trim();
    if (!path || !path.startsWith("/")) return null;
    return { kind: "bundled", pdfUrl: path, embedUrl: path, openUrl: path, downloadUrl: path, provider: "local" };
  }
  const url = source.url?.trim();
  if (!url || !/^https?:\/\//i.test(url)) return null;
  if (source.kind === "storage") {
    return { kind: "storage", pdfUrl: url, embedUrl: url, openUrl: url, downloadUrl: url, provider: "firebase" };
  }
  const driveId = parseGoogleDriveId(url);
  if (driveId) {
    return {
      kind: "external",
      pdfUrl: null, // Drive does not allow cross-origin PDF fetches → embed its own viewer
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      openUrl: `https://drive.google.com/file/d/${driveId}/view`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${driveId}`,
      provider: "google-drive",
    };
  }
  return { kind: "external", pdfUrl: url, embedUrl: url, openUrl: url, downloadUrl: url, provider: "web" };
}

export function formatBytes(n?: number) {
  if (!n) return "";
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
