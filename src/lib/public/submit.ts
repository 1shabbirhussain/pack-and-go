"use client";
/**
 * Public write path (inquiries & reviews). Loads Firestore Lite on demand so the SDK never
 * weighs down page loads. All validation is repeated server-side by Firestore Security Rules.
 */
import { appCheckSiteKey, EMULATOR_HOSTS, firebaseConfig, isFirebaseConfigured, useEmulators } from "@/lib/firebase/config";
import type { InquiryInput } from "@/lib/schema";

export class NotConfiguredError extends Error {
  constructor() { super("Online forms are not connected yet."); }
}

async function liteDb() {
  if (!isFirebaseConfigured) throw new NotConfiguredError();
  const [{ getApps, getApp, initializeApp }, lite] = await Promise.all([import("firebase/app"), import("firebase/firestore/lite")]);
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  if (appCheckSiteKey && !useEmulators) {
    const { initializeAppCheck, ReCaptchaV3Provider } = await import("firebase/app-check");
    try { initializeAppCheck(app, { provider: new ReCaptchaV3Provider(appCheckSiteKey), isTokenAutoRefreshEnabled: false }); } catch { /* already initialised */ }
  }
  const db = lite.getFirestore(app);
  if (useEmulators && !(globalThis as { __pgEmu?: boolean }).__pgEmu) {
    lite.connectFirestoreEmulator(db, EMULATOR_HOSTS.firestore.host, EMULATOR_HOSTS.firestore.port);
    (globalThis as { __pgEmu?: boolean }).__pgEmu = true;
  }
  return { db, lite };
}

const COOLDOWN_KEY = "pg_last_submit";
const COOLDOWN_MS = 60_000;

/** Light client-side throttle; real protection comes from rules + App Check. */
export function checkCooldown() {
  try {
    const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    if (Date.now() - last < COOLDOWN_MS) return Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 1000);
  } catch { /* storage unavailable */ }
  return 0;
}
function markSubmitted() {
  try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch { /* ignore */ }
}

export async function submitInquiry(data: InquiryInput): Promise<{ id: string; reference: string }> {
  const { db, lite } = await liteDb();
  const ref = await lite.addDoc(lite.collection(db, "inquiries"), {
    ...data,
    status: "new",
    source: "website",
    createdAt: lite.serverTimestamp(),
  });
  markSubmitted();
  return { id: ref.id, reference: `PG-${ref.id.slice(0, 6).toUpperCase()}` };
}

export interface ReviewInput {
  name: string;
  location: string;
  tripName: string;
  travelMonth: string;
  rating: number | null;
  text: string;
  consent: true;
}

export async function submitReview(data: ReviewInput) {
  const { db, lite } = await liteDb();
  await lite.addDoc(lite.collection(db, "reviews"), {
    ...data,
    status: "pending",
    source: "website",
    order: 0,
    verifiedBooking: false,
    createdAt: lite.serverTimestamp(),
  });
  markSubmitted();
}
