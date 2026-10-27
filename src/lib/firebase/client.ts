"use client";
/**
 * Lazily initialised Firebase client SDK (Auth, Firestore, Storage).
 * Only imported by the admin panel and by public form submissions (dynamically),
 * so the SDK is never part of the initial public page bundle.
 */
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, initializeFirestore, type Firestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage, type FirebaseStorage } from "firebase/storage";
import { EMULATOR_HOSTS, appCheckSiteKey, firebaseConfig, isFirebaseConfigured, useEmulators } from "./config";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) throw new Error("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.");
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    if (appCheckSiteKey && typeof window !== "undefined" && !useEmulators) {
      void import("firebase/app-check").then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
        try {
          initializeAppCheck(app!, { provider: new ReCaptchaV3Provider(appCheckSiteKey), isTokenAutoRefreshEnabled: true });
        } catch {
          /* already initialised */
        }
      });
    }
  }
  return app;
}

export function getClientAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
    if (useEmulators) connectAuthEmulator(auth, EMULATOR_HOSTS.auth, { disableWarnings: true });
  }
  return auth;
}

export function getClientDb(): Firestore {
  if (!db) {
    db = initializeFirestore(getFirebaseApp(), { ignoreUndefinedProperties: true });
    if (useEmulators) connectFirestoreEmulator(db, EMULATOR_HOSTS.firestore.host, EMULATOR_HOSTS.firestore.port);
  }
  return db;
}

export function getClientStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getFirebaseApp());
    if (useEmulators) connectStorageEmulator(storage, EMULATOR_HOSTS.storage.host, EMULATOR_HOSTS.storage.port);
  }
  return storage;
}
