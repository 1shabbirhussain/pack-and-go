"use client";
/**
 * Shared admin data-access layer (Firestore + Storage). Every screen uses these functions,
 * and every write is authorised by Security Rules on the server — the UI is not the gate.
 */
import {
  collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, serverTimestamp,
  setDoc, updateDoc, where, writeBatch, arrayUnion, type DocumentData, type QueryConstraint,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getClientAuth, getClientDb, getClientStorage } from "@/lib/firebase/client";
import { SEED } from "@/content/seed";

export type CollectionKey = "packages" | "destinations" | "pdfs" | "gallery" | "reviews" | "faqs" | "sections";
export type SingletonKey = "site" | "contact" | "policies";

/** Convert Firestore Timestamps to ISO strings so forms and zod see plain data. */
function plain(data: DocumentData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v && typeof v === "object" && "toDate" in v && typeof (v as { toDate: unknown }).toDate === "function") out[k] = (v as { toDate: () => Date }).toDate().toISOString();
    else if (Array.isArray(v)) out[k] = v.map((x) => (x && typeof x === "object" && !Array.isArray(x) ? plain(x) : x));
    else if (v && typeof v === "object") out[k] = plain(v as DocumentData);
    else out[k] = v;
  }
  return out;
}

function stamp() {
  const u = getClientAuth().currentUser;
  return { updatedAt: serverTimestamp(), updatedBy: u?.email ?? u?.uid ?? "unknown" };
}

export async function listDocs<T = Record<string, unknown>>(col: string, constraints: QueryConstraint[] = []): Promise<(T & { id: string })[]> {
  const snap = await getDocs(query(collection(getClientDb(), col), ...constraints));
  return snap.docs.map((d) => ({ ...(plain(d.data()) as T), id: d.id }));
}

export async function getOne<T = Record<string, unknown>>(col: string, id: string): Promise<(T & { id: string }) | null> {
  const snap = await getDoc(doc(getClientDb(), col, id));
  return snap.exists() ? ({ ...(plain(snap.data()) as T), id: snap.id }) : null;
}

export async function exists(col: string, id: string) {
  return (await getDoc(doc(getClientDb(), col, id))).exists();
}

/** Create or replace a document. `id` is part of the document body for slug-keyed collections. */
export async function saveDoc(col: string, id: string, data: Record<string, unknown>, opts: { create?: boolean } = {}) {
  const ref_ = doc(getClientDb(), col, id);
  if (opts.create && (await getDoc(ref_)).exists()) throw new Error(`An item with the ID “${id}” already exists. Choose a different ID.`);
  const { id: _omit, ...rest } = data;
  void _omit;
  await setDoc(ref_, { ...rest, ...stamp(), ...(opts.create ? { createdAt: serverTimestamp() } : {}) });
}

export async function patchDoc(col: string, id: string, data: Record<string, unknown>) {
  await updateDoc(doc(getClientDb(), col, id), { ...data, ...stamp() });
}

export async function removeDoc(col: string, id: string) {
  await deleteDoc(doc(getClientDb(), col, id));
}

export async function reorder(col: string, idsInOrder: string[]) {
  const db = getClientDb();
  const batch = writeBatch(db);
  idsInOrder.forEach((id, i) => batch.update(doc(db, col, id), { order: i + 1, ...stamp() }));
  await batch.commit();
}

export async function getSingleton<T = Record<string, unknown>>(key: SingletonKey) {
  return getOne<T>("settings", key);
}

export async function saveSingleton(key: SingletonKey, data: Record<string, unknown>) {
  const { id: _omit, ...rest } = data;
  void _omit;
  await setDoc(doc(getClientDb(), "settings", key), { ...rest, ...stamp() }, { merge: false });
}

export async function countWhere(col: string, field: string, value: string) {
  const snap = await getCountFromServer(query(collection(getClientDb(), col), where(field, "==", value)));
  return snap.data().count;
}

/* ───── Inquiries ───── */

export async function listInquiries(status?: string, max = 200) {
  const c: QueryConstraint[] = [];
  if (status && status !== "all") c.push(where("status", "==", status));
  c.push(orderBy("createdAt", "desc"), limit(max));
  return listDocs("inquiries", c);
}

export async function addInquiryNote(id: string, text: string) {
  const u = getClientAuth().currentUser;
  await updateDoc(doc(getClientDb(), "inquiries", id), {
    notes: arrayUnion({ text, by: u?.email ?? "admin", at: new Date().toISOString() }),
    ...stamp(),
  });
}

/* ───── Starter content import ───── */

/**
 * Writes the bundled starter content (from the brochures) into Firestore and marks the site as
 * initialised. Existing documents with the same IDs are overwritten only if `overwrite` is true.
 */
export async function importStarterContent(overwrite = false) {
  const db = getClientDb();
  const results: Record<string, number> = {};
  const cols: Array<[CollectionKey, Array<{ id: string }>]> = [
    ["packages", SEED.packages], ["destinations", SEED.destinations], ["pdfs", SEED.pdfs],
    ["gallery", SEED.gallery], ["faqs", SEED.faqs], ["sections", SEED.sections],
  ];
  for (const [col, items] of cols) {
    let n = 0;
    let batch = writeBatch(db);
    let pending = 0;
    for (const item of items) {
      const r = doc(db, col, item.id);
      if (!overwrite && (await getDoc(r)).exists()) continue;
      const { id: _id, ...rest } = item as Record<string, unknown>;
      void _id;
      batch.set(r, { ...(JSON.parse(JSON.stringify(rest)) as DocumentData), ...stamp(), createdAt: serverTimestamp() });
      n++; pending++;
      if (pending >= 200) { await batch.commit(); batch = writeBatch(db); pending = 0; }
    }
    if (pending) await batch.commit();
    results[col] = n;
  }
  for (const key of ["contact", "policies"] as const) {
    const r = doc(db, "settings", key);
    if (overwrite || !(await getDoc(r)).exists()) {
      await setDoc(r, { ...JSON.parse(JSON.stringify(SEED.settings[key])), ...stamp() });
      results[`settings/${key}`] = 1;
    }
  }
  const siteRef = doc(db, "settings", "site");
  const site = await getDoc(siteRef);
  await setDoc(siteRef, { ...JSON.parse(JSON.stringify(SEED.settings.site)), ...(site.exists() && !overwrite ? plain(site.data()) : {}), initialized: true, ...stamp() });
  results["settings/site"] = 1;
  return results;
}

/* ───── Storage uploads ───── */

export const UPLOAD_LIMITS = {
  pdf: { types: ["application/pdf"], maxBytes: 20 * 1024 * 1024, folder: "public/brochures" },
  image: { types: ["image/jpeg", "image/png", "image/webp", "image/avif"], maxBytes: 8 * 1024 * 1024, folder: "public/images" },
} as const;

export function validateUpload(file: File, kind: keyof typeof UPLOAD_LIMITS) {
  const l = UPLOAD_LIMITS[kind];
  if (!(l.types as readonly string[]).includes(file.type)) return `Unsupported file type (${file.type || "unknown"}).`;
  if (file.size > l.maxBytes) return `File is too large (max ${Math.round(l.maxBytes / 1024 / 1024)} MB).`;
  return null;
}

export function uploadFile(file: File, kind: keyof typeof UPLOAD_LIMITS, onProgress?: (pct: number) => void) {
  const err = validateUpload(file, kind);
  if (err) return Promise.reject(new Error(err));
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/-+/g, "-").slice(-80);
  const path = `${UPLOAD_LIMITS[kind].folder}/${Date.now()}-${safe}`;
  const task = uploadBytesResumable(ref(getClientStorage(), path), file, {
    contentType: file.type,
    cacheControl: "public, max-age=31536000, immutable",
  });
  return new Promise<{ path: string; url: string; size: number }>((resolve, reject) => {
    task.on(
      "state_changed",
      (s) => onProgress?.(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
      reject,
      async () => resolve({ path, url: await getDownloadURL(task.snapshot.ref), size: file.size }),
    );
  });
}

export async function deleteStorageObject(path: string) {
  if (!path.startsWith("public/")) return;
  try { await deleteObject(ref(getClientStorage(), path)); } catch { /* already gone */ }
}

/** Ask the server to refresh cached public pages. Returns false if it could not (content still saved). */
export async function refreshPublicSite(): Promise<boolean> {
  try {
    const token = await getClientAuth().currentUser?.getIdToken();
    if (!token) return false;
    const res = await fetch("/api/revalidate", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    return res.ok;
  } catch {
    return false;
  }
}

export { orderBy, where, limit };
