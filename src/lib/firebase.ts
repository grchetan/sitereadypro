/**
 * Firebase (browser only).
 *
 * The web config is publishable by design — access is controlled by Firebase
 * Auth rules and the admin allowlist, not by hiding these values. They still
 * live in .env so the project can be pointed at another Firebase app easily.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

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

/** Returns the Auth instance, or null on the server / when config is missing. */
export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined" || !firebaseReady) return null;
  if (!auth) {
    app = getApps().length ? getApp() : initializeApp(config);
    auth = getAuth(app);
  }
  return auth;
}
