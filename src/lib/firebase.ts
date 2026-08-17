/**
 * Firebase (browser only).
 *
 * The web config is publishable by design — access is controlled by Firebase
 * Auth rules and the admin allowlist, not by hiding these values. They still
 * live in .env so the project can be pointed at another Firebase app easily.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const config = {
  apiKey: import.meta.env['VITE_FIREBASE_API_KEY'] as string,
  authDomain: import.meta.env['VITE_FIREBASE_AUTH_DOMAIN'] as string,
  projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'] as string,
  storageBucket: import.meta.env['VITE_FIREBASE_STORAGE_BUCKET'] as string,
  messagingSenderId: import.meta.env['VITE_FIREBASE_MESSAGING_SENDER_ID'] as string,
  appId: import.meta.env['VITE_FIREBASE_APP_ID'] as string,
  measurementId: import.meta.env['VITE_FIREBASE_MEASUREMENT_ID'] as string,
};

export const firebaseReady = Boolean(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

function getApp_(): FirebaseApp {
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(config);
  }
  return app;
}

/** Returns the Auth instance, or null on the server / when config is missing. */
export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined" || !firebaseReady) return null;
  if (!auth) {
    auth = getAuth(getApp_());
  }
  return auth;
}

/** Returns the Firestore instance, or null when config is missing. */
export function getFirebaseDB(): Firestore | null {
  if (!firebaseReady) return null;
  if (!db) {
    db = getFirestore(getApp_());
  }
  return db;
}

/** Returns the Storage instance, or null when config is missing. */
export function getFirebaseStorage(): FirebaseStorage | null {
  if (!firebaseReady) return null;
  if (!storage) {
    storage = getStorage(getApp_());
  }
  return storage;
}
