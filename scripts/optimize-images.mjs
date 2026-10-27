// Converts source photos extracted from the brochures into web-optimised WebP files.
// Usage: npm run images   (source: discovery/extracted-images, output: public/images/photos)
import sharp from "sharp";
import { mkdirSync } from "node:fs";
const SRC = "discovery/extracted-images";
const OUT = "public/images/photos";
mkdirSync(OUT, { recursive: true });
const map = {
  "meadow-horse-lake": "skardu-hunza-naran-12-days-001-005.jpg",
  "lakeside-resort-pagoda": "skardu-hunza-naran-12-days-001-004.jpg",
  "lakeside-resort-red-roofs": "skardu-hunza-naran-12-days-003-017.jpg",
  "autumn-poplar-road": "skardu-hunza-naran-12-days-001-001.jpg",
  "snow-peaks-reflection": "naran-shogran-babusar-7-days-003-019.jpg",
  "glacier-lake-waterfall": "naran-shogran-babusar-7-days-001-001.jpg",
  "pine-river-footbridge": "naran-shogran-babusar-7-days-001-003.jpg",
  "meadow-horse-riders": "kashmir-10-days-001-001.jpg",
  "river-valley-village": "kashmir-10-days-001-000.jpg",
  "turquoise-gorge-lake": "kashmir-10-days-003-019.jpg",
  "faisal-mosque-islamabad": "kashmir-10-days-001-009.jpg",
  "traveller-cliff-view": "kashmir-10-days-001-002.jpg",
};
for (const [name, file] of Object.entries(map)) {
  const img = sharp(`${SRC}/${file}`).rotate();
  const meta = await img.metadata();
  await img.resize({ width: Math.min(meta.width ?? 1920, 1920), withoutEnlargement: true })
    .webp({ quality: 78 }).toFile(`${OUT}/${name}.webp`);
  const m2 = await sharp(`${OUT}/${name}.webp`).metadata();
  console.log(name, m2.width + "x" + m2.height);
}
await sharp("assets/brand/logo-original.jpg").resize(450).png().toFile("public/images/brand/logo-original@2x.png");
