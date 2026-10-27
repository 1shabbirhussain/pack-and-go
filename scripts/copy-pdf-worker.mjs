// Copies the pdf.js worker into /public so the PDF viewer can load it from the same origin.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
try {
  const src = require.resolve("pdfjs-dist/build/pdf.worker.min.mjs");
  const dest = resolve("public/pdfjs/pdf.worker.min.mjs");
  if (!existsSync(dirname(dest))) mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  console.log("[pdf-worker] copied to public/pdfjs/");
} catch (e) {
  console.warn("[pdf-worker] skipped:", e.message);
}
