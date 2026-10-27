# Pack & Go Tourism — website, admin panel & brochure system

Production website for **Pack & Go Tourism**, a tour operator in Hyderabad, Sindh, with an office in Karachi. It offers family-oriented group tours to northern Pakistan and customized trips anywhere in the country.

| | |
|---|---|
| **Framework** | Next.js 15 (App Router) · React 19 · TypeScript |
| **Styling / motion** | Tailwind CSS 4 · Framer Motion (LazyMotion; honours reduced motion) · Lucide icons |
| **Backend** | Firebase only: Authentication, Cloud Firestore, Cloud Storage, Security Rules |
| **PDF viewer** | pdf.js (`pdfjs-dist` 4), loaded only on brochure pages |
| **Hosting** | Netlify (Next.js runtime), configured in `netlify.toml` |
| **Tests** | Vitest: 33 unit/form tests · Firestore & Storage rules tests (need the Firebase emulator) |

> Discovery research lives in `docs/`: `RESEARCH_NOTES.md`, `PDF_CONTENT_INVENTORY.md`, `CONTENT_SOURCE_MAP.md` and `WEBSITE_BLUEPRINT.md`. Every price and itinerary on the site traces back to a brochure page listed there.

---

## 1. What's included

**Public site**

| Route | What it does |
|---|---|
| `/` | Cinematic parallax hero, featured tours, destinations, why-us, custom-tour band, how booking works, reviews (only real ones), gallery, brochures, FAQs and contact. Every section is managed in **Admin → Homepage**. |
| `/tours` | All packages, plus a comparison table |
| `/tours/[slug]` | Detail page for one tour (see below) |
| `/destinations`, `/destinations/[slug]` | 8 destination guides. Swat, Kalash, Murree and Islamabad have no invented prices; they link to the custom-trip planner. |
| `/custom-tour` | 4-step inquiry wizard. It saves to Firestore and accepts pre-filled query parameters. |
| `/brochures`, `/brochures/[id]` | Brochure library and in-page PDF viewer: page navigation, zoom, fit-to-width, full screen, new tab, download |
| `/gallery` | Category filters, lazy loading, accessible lightbox (Esc and arrow keys, focus trap) |
| `/reviews` | Shows only published, genuine reviews. Visitors can submit reviews, which arrive as **pending**. |
| `/about`, `/contact`, `/faq`, `/terms`, `/privacy` | Standard pages; the content is editable in the admin |
| 404 / error / loading | Custom pages for each state |
| SEO files | `sitemap.xml`, `robots.txt` and the web manifest |

Each tour detail page includes:

- a Karachi / Islamabad departure toggle that switches the itinerary days, duration and prices;
- the transport options from the brochure;
- traveller counters;
- a WhatsApp link pre-filled with the tour, departure city, transport, travellers and dates;
- inclusions, meals, kids policy, advisories and the linked brochure;
- TouristTrip structured data (JSON-LD).

**Admin panel (`/admin`)**

- **Login:** email and password. There is no public sign-up, and password reset is supported. Authorisation is checked against `admins/{uid}`.
- **Dashboard:**
  - new-inquiry and pending-review counts;
  - owner-confirmation items carried over from the brochure research;
  - a one-click **Import starter content** button.
- **Content editors (create, edit, publish/unpublish, reorder, delete):**
  - tour packages, including the itinerary builder, price options and policy lists;
  - destinations;
  - brochures (bundled, uploaded or Google Drive);
  - gallery;
  - reviews (moderation with a consent record);
  - FAQs;
  - homepage sections.
- **Settings:**
  - contact and business details (phones, WhatsApp, emails, offices, social links, bank details, verification status);
  - policies and terms;
  - site settings.
- **Inquiry inbox:** status pipeline, internal notes, one-tap WhatsApp / call / email reply, mark as handled, delete (owner only).
- **How the panel is built:**
  - Every editor uses one shared form engine (`components/admin/FormBuilder.tsx`), configured declaratively in `lib/admin/registry.ts`.
  - Forms are validated with the same zod schemas the public site uses (`lib/schema.ts`).
  - Saving refreshes the public pages immediately through `/api/revalidate`.

---

## 2. Requirements

- Node.js **20.9+** (22 recommended; see `.nvmrc`) and npm 10+.
- A Firebase project, for the database, admin login and uploads.
- Optional: Java 11+, needed only to run the security-rules tests against the Firebase Emulator Suite.

## 3. Run locally

```bash
npm install            # also copies the pdf.js worker into public/pdfjs/
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

The site runs **without Firebase**. It then shows the bundled starter content built from the four brochures. The inquiry form explains that it isn't connected and offers WhatsApp instead, and `/admin` shows setup instructions.

| Command | Purpose |
|---|---|
| `npm run build` / `npm start` | Production build and serve |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests: content vs brochure prices, schemas, PDF/WhatsApp helpers, admin form round-trips |
| `npm run test:rules` | Firestore + Storage Security Rules tests in the emulator |
| `npm run images` | Re-generate optimised WebP photos from `discovery/extracted-images` |

---

## 4. Firebase setup

These steps are free on the **Spark** plan, with one exception: **Cloud Storage uploads require the Blaze (pay-as-you-go) plan** under Firebase's 2024 pricing change. Without Storage, everything works except uploading new PDFs and images. You can still use bundled files and Google Drive links. Do not upgrade the plan, or create any paid resources, unless the business owner has approved it. If you do upgrade, set a budget alert.

1. **Create the project** in the [Firebase console](https://console.firebase.google.com) → *Add project*.
2. **Register a Web app** (*Project settings → Your apps → Web*). Copy its config values into `.env.local`, and later into Netlify:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY / AUTH_DOMAIN / PROJECT_ID / STORAGE_BUCKET / MESSAGING_SENDER_ID / APP_ID
   ```
   These values identify the project and are not secrets; Security Rules protect the data. **Never** add a service-account key to this project or to any `NEXT_PUBLIC_` variable.
3. **Firestore:** *Build → Firestore Database → Create database* in production mode. Choose a region near Pakistan (e.g. `asia-south1`).
4. **Authentication:** *Build → Authentication → Sign-in method → Email/Password → Enable*. Leave "Email link" off. Under *Settings → User actions*, **disable "Enable create (sign-up)"** so nobody can register themselves.
5. **Deploy rules and indexes** with the Firebase CLI:
   ```bash
   npx firebase login
   cp .firebaserc.example .firebaserc     # put your project id inside
   npx firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
   Leave out `storage` if Storage isn't enabled.
6. **Storage (optional, Blaze):** *Build → Storage → Get started*. To let the in-page PDF viewer read uploaded PDFs, edit the origins in `storage.cors.json` and apply it:
   ```bash
   gsutil cors set storage.cors.json gs://<your-bucket>
   ```
7. **Authorised domains:** *Authentication → Settings → Authorized domains*. Add your Netlify domain and your custom domain.

### Initial administrator

Admins are an allow-list that **only the Firebase console can modify**; the rules deny client writes to `admins`.

1. *Authentication → Users → Add user*: enter the owner's email and a strong password, then copy the **User UID**.
2. *Firestore → Start collection* `admins`, with **Document ID = that UID** and these fields:
   - `email` (string)
   - `role` (string): `owner`
   - `active` (boolean): `true`
3. Sign in at `/admin/login`. On the dashboard, click **Import starter content**. This copies the brochure-based packages, destinations, brochures, gallery, FAQs, homepage sections, contact details and policies into Firestore, and sets `settings/site.initialized = true`. From then on, Firestore is the single source of truth.

| Role | Can |
|---|---|
| `owner` | Everything, including settings, policies, deletes and the starter import |
| `editor` | Create and edit content, moderate reviews, manage inquiries. Cannot change business settings or delete. |

To add an editor, create the user, then add `admins/<uid>` with `role: "editor"`. To revoke access, set `active: false`.

### Optional: App Check (spam protection)

Create a reCAPTCHA v3 key and register it under *App Check*. Put the site key in `NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY`, then enforce App Check for Firestore and Storage once you have seen valid traffic.

---

## 5. Security model

- **Deny by default.** The full rules are in `firestore.rules` and `storage.rules`; the tests are in `tests/rules/`.
- **Public visitors can:**
  - read only `status == "published"` packages, destinations, PDFs, gallery items, FAQs, sections and reviews;
  - read `settings/site`, `settings/contact` and `settings/policies`.
- **The public can create:**
  - **Inquiries**, which must pass a strict schema:
    - exact allowed keys and length limits;
    - a phone-number pattern;
    - consent must be `true` and status must be `new`;
    - the timestamp must be the server time.
  - **Reviews**, only with `status: "pending"` and consent.
- **The public can never** read inquiries, read or modify the admin list, change settings or upload files.
- **Admin rights** come from `admins/{uid}` (`active == true`, role `owner` or `editor`). Every write is checked server-side by the rules, not just hidden in the UI.
- **Admin inquiry edits** are limited to status, notes and assignment, so customer data can't be altered.
- **Storage:** public read under `/public/**`. Uploads are admin-only: PDF under 20 MB to `/public/brochures`, image under 8 MB to `/public/images`.
- **`/api/revalidate`** verifies the Firebase ID token's signature with `jose` against Google's public keys. It then reads `admins/{uid}` *as that user*, so no service account is needed.
- **Spam:** forms add a honeypot, a minimum fill time, a client cooldown and rules validation. App Check is optional.
- **Headers:** HSTS, `nosniff` and a referrer policy everywhere; `X-Frame-Options: DENY` and `noindex` on `/admin`.

---

## 6. Content architecture

| Collection | Model (in `src/lib/schema.ts`) |
|---|---|
| `packages` | `packageSchema`: durations per departure city, itinerary days (with an `audience` flag), `priceOptions` (status `published` / `needs_review` / `hidden`), inclusions, meals, kids policy, advisories, `brochureIds`, admin-only `reviewFlags` |
| `destinations` | `destinationSchema`: `customOnly` routes visitors to the inquiry form instead of inventing packages |
| `pdfs` | `pdfSchema`, with `source: { kind: "bundled" \| "storage" \| "external", path, url }` |
| `gallery` | `galleryItemSchema`; each image records `rights: owned \| licensed \| unverified` |
| `reviews` | `reviewSchema`: status, consent, source, verified booking |
| `faqs`, `sections` | FAQ entries and homepage sections |
| `settings/{site,contact,policies}` | Singletons; contact items carry a `verification` status |
| `inquiries` | Private; status pipeline and notes |
| `admins` | Allow-list, edited in the console only |

**How public pages read data:**

- Server components read published content through the Firestore REST API (`src/lib/firebase/rest.ts`). This uses no SDK and no credentials, so Security Rules apply exactly as for any visitor.
- Responses are cached with ISR (`CONTENT_REVALIDATE_SECONDS`, default 300 s) and refreshed on demand after every admin save.
- If Firebase is unavailable or not yet initialised, pages fall back to the bundled starter content in `src/content/seed/`.
- The Firebase JS SDK is loaded only in `/admin`, and lazily in the public forms.

---

## 7. PDF brochures & images

**Three interchangeable sources.** Pages only ever call `resolvePdf()` (`src/lib/pdf.ts`):

| Source | When to use | How |
|---|---|---|
| **Bundled** | The four original brochures (shipped in `public/brochures/`) | Admin → Brochures → *Bundled* → path `/brochures/file.pdf`. To *replace* a bundled file, change it in the repo and redeploy. A browser cannot write into a deployed site. |
| **Firebase Storage** | New or updated brochures uploaded by staff | Admin → Brochures → *Uploaded file* → **Upload PDF**. The file is saved under `public/brochures/` in Storage. Needs Storage (Blaze) and the CORS setup above. |
| **External / Google Drive** | Future move to Drive | Admin → Brochures → *External link* → paste the Drive share link. The ID is detected automatically and the viewer embeds Drive's previewer. Set sharing to **"Anyone with the link can view"**. |

Moving a brochure to Google Drive later only means editing its source in the admin. Package pages, the library and the viewer don't change.

**Viewer.** Bundled and Storage files render with pdf.js: page navigation, keyboard arrows, zoom, fit-to-width, full screen, new tab and download. If a URL can't be read cross-origin, or comes from Drive, the viewer falls back to an embedded preview plus a new-tab link.

**Images.**

- Photos in `public/images/photos/` were extracted from the brochures and converted to WebP. They are marked `rights: "unverified"` because their usage rights are unknown. Replace them with Pack & Go's own photos: upload in Admin → Gallery or in any image field, then set rights to *Owned*.
- Destinations without a photo show an illustrated placeholder rather than a misleading stock image.
- `next/image` serves AVIF/WebP at responsive sizes; Netlify's image CDN handles the resizing.

**Logos.** The transparent logos (`public/images/brand/logo-light.png` and `logo-dark.png`) were cut from the brochure artwork. A vector original from the designer would be better.

---

## 8. Deploying to Netlify

Nothing has been deployed. Deploying is your decision.

1. Push this folder to a Git repository (GitHub, GitLab or Bitbucket).
2. In Netlify, choose *Add new site → Import an existing project* and pick the repo. The build settings come from `netlify.toml`: `npm run build` with Node 22, and the Next.js runtime is applied automatically.
3. *Site configuration → Environment variables*: add every key from `.env.example`. Set `NEXT_PUBLIC_SITE_URL` to the final URL, e.g. `https://www.packandgotourism.pk`.
4. Deploy. Then add the Netlify domain to *Firebase → Authentication → Authorized domains* and to `storage.cors.json`.

**Custom domain.**

1. In Netlify, go to *Domain management → Add a domain*.
2. At your registrar (for `.pk` domains, PKNIC or a reseller), point the domain at Netlify with either:
   - Netlify DNS nameservers; or
   - an `A`/`ALIAS` record for the apex domain and a `CNAME` for `www`.
3. HTTPS is provisioned automatically.
4. Update `NEXT_PUBLIC_SITE_URL`, the Firebase authorised domains and the Storage CORS origins to match.

**After launch.**

- Submit `https://<domain>/sitemap.xml` in Google Search Console.
- Create or claim Google Business Profiles for both offices, using the same name, address and phone as on the site.

---

## 9. Testing & verification performed

- `npm run lint`, `npm run typecheck` and `npm run build`: all clean. The production build generates 37 routes, with ~103 KB shared JS and a ~150 KB first load on the homepage.
- `npm test`: **33/33 passing**:
  - every starter document validates;
  - prices match the brochures, and duplicate rows stay hidden;
  - itinerary day counts equal the brochure durations, from both Karachi and Islamabad;
  - every referenced file exists, and no reviews are invented;
  - PDF / Drive / WhatsApp / REST-decoder helpers work;
  - **every admin form round-trips its starter document through the shared form engine and zod validation**.
- Browser checks (Playwright, Chromium) against the production build:
  - every public route returns 200 (404 for unknown routes) at desktop and mobile widths;
  - no horizontal overflow and no page errors;
  - departure toggle: 12 days from Karachi, 8 from Islamabad;
  - the WhatsApp message carries tour, city, transport and travellers;
  - the duplicate price row is hidden;
  - PDF viewer paging and zoom work;
  - lightbox opens and closes, and category filtering works;
  - inquiry pre-fill and validation work;
  - with Firebase not configured, the inquiry form honestly reports that it was *not* saved and offers WhatsApp;
  - mobile menu, sitemap/robots/manifest and JSON-LD are present (no ratings);
  - `/api/revalidate` rejects unauthenticated calls;
  - the admin guard redirects to the login page, and login errors are shown.
- **Not run here:** `npm run test:rules` (the Firebase emulator download is blocked by this environment's network policy), and end-to-end admin CRUD against a live Firebase project (no credentials were provided). Run both after creating the project, as described in §4.

## 10. Known limitations & owner confirmations

Before launch, the business should confirm these. The same items appear on the admin dashboard and in `docs/CONTENT_SOURCE_MAP.md` §8.

1. **WhatsApp number.** Both +92 310 7869147 and +92 301 3499147 appear in the brochures. WhatsApp defaults to +92 310 7869147 and is marked *unconfirmed*.
2. **Email.** `packg97@gmail.com` is displayed. `imrankhanniazi2211@gmail.com` is stored but hidden; confirm which address should be public.
3. **Price validity, departure dates, group size, hotel names and vehicle type** are not stated in the brochures (April 2026).
4. **Couple pricing.** The per-couple price is more than twice the per-person price, and the reason isn't stated. The site shows a neutral note.
5. **Duplicate price rows.** The "Sleeper bus" row appears twice in the Naran and Kashmir 7-day brochures; the duplicate is hidden as *needs review*. The Kashmir 7-day price table is also identical to Naran's.
6. **Cancellation policy** wording is ambiguous. The site shows it as published, with a "confirm with our team" note.
7. **Tourism licence.** The brochure's "Approved by FBR" badge is a tax registration, so it is **not** shown. Add a DTS licence number only if the business holds one.
8. **Photo rights** are unverified (see §7). No reviews exist yet, so the reviews section stays hidden until real ones are published.
9. **Notifications.** Inquiries appear in the admin inbox. No automatic email or WhatsApp notification is sent: Firebase's free tier has no mail sender, and the Trigger Email extension needs Blaze plus an SMTP account.
10. **Swat, Kalash, Murree, Islamabad and the 6-day tour** have no verified itineraries or prices, so they are custom-trip only.
11. **No 3D.** Three.js was intentionally left out. Layered SVG parallax gives the depth effect at a fraction of the bundle size and battery cost on mid-range phones.
12. **Brochure file sizes.** The four PDFs are 3.6–4.8 MB. Lighter web copies could be added later as additional sources.
