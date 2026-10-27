/**
 * Security-rules tests. Run with:  npm run test:rules
 * (needs Java 11+ and the Firebase Emulator Suite, which firebase-tools downloads on first run).
 */
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

let env: RulesTestEnvironment;

const inquiry = (o: Record<string, unknown> = {}) => ({
  type: "custom", name: "Sara Ahmed", phone: "0300 1234567", email: "", preferredContact: "whatsapp", destinations: ["hunza"], packageId: "",
  departureCity: "Karachi", startDate: "", flexibleDates: false, durationDays: 7, adults: 2, children: 0, budget: "", transport: "", message: "Hi",
  consent: true, status: "new", source: "website", createdAt: serverTimestamp(), ...o,
});

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-packngo",
    firestore: { rules: readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 8080 },
    storage: { rules: readFileSync("storage.rules", "utf8"), host: "127.0.0.1", port: 9199 },
  });
});
afterAll(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "admins/owner1"), { email: "o@x.com", role: "owner", active: true });
    await setDoc(doc(db, "admins/editor1"), { email: "e@x.com", role: "editor", active: true });
    await setDoc(doc(db, "admins/disabled1"), { email: "d@x.com", role: "owner", active: false });
    await setDoc(doc(db, "packages/pub"), { status: "published", title: "P" });
    await setDoc(doc(db, "packages/draft"), { status: "draft", title: "D" });
    await setDoc(doc(db, "inquiries/i1"), { ...inquiry(), createdAt: new Date() });
    await setDoc(doc(db, "settings/contact"), { whatsappNumber: "+923107869147" });
  });
});

const anon = () => env.unauthenticatedContext().firestore();
const as = (uid: string) => env.authenticatedContext(uid).firestore();

describe("public visitors", () => {
  it("can read published packages", () => assertSucceeds(getDoc(doc(anon(), "packages/pub"))));
  it("cannot read drafts", () => assertFails(getDoc(doc(anon(), "packages/draft"))));
  it("can query published packages", () => assertSucceeds(getDocs(query(collection(anon(), "packages"), where("status", "==", "published")))));
  it("cannot list all packages", () => assertFails(getDocs(collection(anon(), "packages"))));
  it("cannot modify packages", () => assertFails(setDoc(doc(anon(), "packages/pub"), { status: "draft" })));
  it("can read public settings", () => assertSucceeds(getDoc(doc(anon(), "settings/contact"))));
  it("cannot change settings", () => assertFails(setDoc(doc(anon(), "settings/contact"), { whatsappNumber: "+1" })));
  it("can submit a valid inquiry", () => assertSucceeds(addDoc(collection(anon(), "inquiries"), inquiry())));
  it("cannot submit an inquiry without consent", () => assertFails(addDoc(collection(anon(), "inquiries"), inquiry({ consent: false }))));
  it("cannot pre-set inquiry status", () => assertFails(addDoc(collection(anon(), "inquiries"), inquiry({ status: "booked" }))));
  it("cannot add unknown fields", () => assertFails(addDoc(collection(anon(), "inquiries"), inquiry({ isAdmin: true }))));
  it("cannot send oversized messages", () => assertFails(addDoc(collection(anon(), "inquiries"), inquiry({ message: "x".repeat(2001) }))));
  it("cannot forge the timestamp", () => assertFails(addDoc(collection(anon(), "inquiries"), inquiry({ createdAt: new Date("2020-01-01") }))));
  it("cannot read inquiries", () => assertFails(getDoc(doc(anon(), "inquiries/i1"))));
  it("cannot read the admin list", () => assertFails(getDoc(doc(anon(), "admins/owner1"))));
  it("can submit a pending review", () => assertSucceeds(addDoc(collection(anon(), "reviews"), { name: "Ali", text: "A wonderful trip with a great team!", consent: true, status: "pending", source: "website", order: 0, verifiedBooking: false, rating: 5, createdAt: serverTimestamp() })));
  it("cannot self-publish a review", () => assertFails(addDoc(collection(anon(), "reviews"), { name: "Ali", text: "A wonderful trip with a great team!", consent: true, status: "published", source: "website", createdAt: serverTimestamp() })));
});

describe("signed-in non-admins", () => {
  it("cannot write content", () => assertFails(setDoc(doc(as("stranger"), "packages/x"), { status: "published" })));
  it("cannot read inquiries", () => assertFails(getDoc(doc(as("stranger"), "inquiries/i1"))));
  it("cannot make themselves admin", () => assertFails(setDoc(doc(as("stranger"), "admins/stranger"), { role: "owner", active: true })));
  it("disabled admins have no access", () => assertFails(setDoc(doc(as("disabled1"), "packages/x"), { status: "draft" })));
});

describe("editors", () => {
  it("can create and edit content", () => assertSucceeds(setDoc(doc(as("editor1"), "packages/new"), { status: "draft", title: "N" })));
  it("can read drafts", () => assertSucceeds(getDoc(doc(as("editor1"), "packages/draft"))));
  it("cannot delete content", () => assertFails(deleteDoc(doc(as("editor1"), "packages/pub"))));
  it("cannot change business settings", () => assertFails(setDoc(doc(as("editor1"), "settings/contact"), { whatsappNumber: "+1" })));
  it("can update inquiry status", () => assertSucceeds(updateDoc(doc(as("editor1"), "inquiries/i1"), { status: "contacted" })));
  it("cannot rewrite the customer's details", () => assertFails(updateDoc(doc(as("editor1"), "inquiries/i1"), { phone: "123" })));
});

describe("owners", () => {
  it("can change settings", () => assertSucceeds(setDoc(doc(as("owner1"), "settings/contact"), { whatsappNumber: "+923013499147" })));
  it("can delete content", () => assertSucceeds(deleteDoc(doc(as("owner1"), "packages/draft"))));
  it("can delete inquiries", () => assertSucceeds(deleteDoc(doc(as("owner1"), "inquiries/i1"))));
  it("still cannot write the admin list from the client", () => assertFails(setDoc(doc(as("owner1"), "admins/x"), { role: "owner", active: true })));
});

describe("storage", () => {
  const pdf = new Uint8Array([37, 80, 68, 70]);
  it("public cannot upload", () => assertFails(uploadBytes(ref(env.unauthenticatedContext().storage(), "public/brochures/a.pdf"), pdf, { contentType: "application/pdf" })));
  it("admins can upload PDFs", () => assertSucceeds(uploadBytes(ref(env.authenticatedContext("editor1").storage(), "public/brochures/a.pdf"), pdf, { contentType: "application/pdf" })));
  it("admins cannot upload executables", () => assertFails(uploadBytes(ref(env.authenticatedContext("editor1").storage(), "public/brochures/a.exe"), pdf, { contentType: "application/x-msdownload" })));
  it("nobody writes outside /public", () => assertFails(uploadBytes(ref(env.authenticatedContext("owner1").storage(), "private/a.pdf"), pdf, { contentType: "application/pdf" })));
});
