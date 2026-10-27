/**
 * Minimal Firestore REST reader used by server components for PUBLIC content.
 * - No service account and no Firebase SDK on the server: requests are unauthenticated and
 *   therefore limited by Security Rules to published content only.
 * - Works with Next.js fetch caching (revalidate + tags) for fast, static-like pages.
 */
import { EMULATOR_HOSTS, firebaseConfig, useEmulators } from "./config";

type FsValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { timestampValue: string }
  | { stringValue: string }
  | { arrayValue: { values?: FsValue[] } }
  | { mapValue: { fields?: Record<string, FsValue> } }
  | { referenceValue: string }
  | { geoPointValue: { latitude: number; longitude: number } }
  | { bytesValue: string };

export function decodeValue(v: FsValue): unknown {
  if ("nullValue" in v) return null;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("stringValue" in v) return v.stringValue;
  if ("arrayValue" in v) return (v.arrayValue.values ?? []).map(decodeValue);
  if ("mapValue" in v) return decodeFields(v.mapValue.fields ?? {});
  if ("referenceValue" in v) return v.referenceValue;
  if ("geoPointValue" in v) return v.geoPointValue;
  if ("bytesValue" in v) return v.bytesValue;
  return null;
}

export function decodeFields(fields: Record<string, FsValue>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) out[k] = decodeValue(v);
  return out;
}

function baseUrl() {
  const host = useEmulators
    ? `http://${EMULATOR_HOSTS.firestore.host}:${EMULATOR_HOSTS.firestore.port}`
    : "https://firestore.googleapis.com";
  return `${host}/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;
}

export interface FetchOpts {
  revalidate?: number;
  tags?: string[];
}

const revalidateDefault = Number(process.env.CONTENT_REVALIDATE_SECONDS ?? 300) || 300;

/** Query a collection with an equality filter on `field` (e.g. status == "published"). */
export async function restQuery(collection: string, field: string, value: string, opts: FetchOpts = {}) {
  const url = `${baseUrl()}:runQuery?key=${encodeURIComponent(firebaseConfig.apiKey)}`;
  const body = {
    structuredQuery: {
      from: [{ collectionId: collection }],
      where: { fieldFilter: { field: { fieldPath: field }, op: "EQUAL", value: { stringValue: value } } },
      limit: 500,
    },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    next: { revalidate: opts.revalidate ?? revalidateDefault, tags: ["content", collection, ...(opts.tags ?? [])] },
  });
  if (!res.ok) throw new Error(`Firestore query ${collection} failed: ${res.status} ${await res.text().catch(() => "")}`);
  const rows = (await res.json()) as Array<{ document?: { name: string; fields?: Record<string, FsValue> } }>;
  return rows
    .filter((r) => r.document)
    .map((r) => ({ id: r.document!.name.split("/").pop()!, ...decodeFields(r.document!.fields ?? {}) }));
}

/** Read a single document. Returns null on 404 / permission denied. */
export async function restGet(path: string, opts: FetchOpts = {}) {
  const url = `${baseUrl()}/${path}?key=${encodeURIComponent(firebaseConfig.apiKey)}`;
  const res = await fetch(url, {
    next: { revalidate: opts.revalidate ?? revalidateDefault, tags: ["content", path.split("/")[0], ...(opts.tags ?? [])] },
  });
  if (res.status === 404 || res.status === 403) return null;
  if (!res.ok) throw new Error(`Firestore get ${path} failed: ${res.status}`);
  const doc = (await res.json()) as { name: string; fields?: Record<string, FsValue> };
  return { id: doc.name.split("/").pop()!, ...decodeFields(doc.fields ?? {}) };
}

/** Read a document with a user's ID token (rules evaluate as that user). Used by /api/revalidate. */
export async function restGetAsUser(path: string, idToken: string) {
  const url = `${baseUrl()}/${path}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` }, cache: "no-store" });
  if (!res.ok) return null;
  const doc = (await res.json()) as { name: string; fields?: Record<string, FsValue> };
  return decodeFields(doc.fields ?? {});
}
