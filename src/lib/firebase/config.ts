/** Firebase web configuration read from NEXT_PUBLIC_* env vars (safe to expose; rules enforce security). */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

export const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

const PLACEHOLDER = /^(your-|000|1:000)/;

/** True when the minimum config for Firestore reads/writes is present (not placeholders). */
export const isFirebaseConfigured =
  Boolean(firebaseConfig.projectId && firebaseConfig.apiKey) &&
  !PLACEHOLDER.test(firebaseConfig.projectId) &&
  !PLACEHOLDER.test(firebaseConfig.apiKey);

export const isStorageConfigured = isFirebaseConfigured && Boolean(firebaseConfig.storageBucket) && !PLACEHOLDER.test(firebaseConfig.storageBucket);

export const appCheckSiteKey = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY ?? "";

export const EMULATOR_HOSTS = {
  firestore: { host: "127.0.0.1", port: 8080 },
  auth: "http://127.0.0.1:9099",
  storage: { host: "127.0.0.1", port: 9199 },
};
