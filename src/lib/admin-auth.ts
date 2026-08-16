/**
 * Admin authentication — Firebase Email/Password.
 *
 * Admins may type either their email or a registered phone number; the phone
 * is mapped to the account email via VITE_ADMIN_PHONE_MAP before the Firebase
 * call (Firebase passwords are always tied to an email address).
 */
import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import { getFirebaseAuth, firebaseReady } from "@/lib/firebase";
import { setSession } from "@/lib/admin-store";

const list = (raw: unknown) =>
  String(raw ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const ADMIN_EMAILS = list(import.meta.env['VITE_ADMIN_EMAILS']).map((e) => e.toLowerCase());

/** phone (digits only) -> email */
const PHONE_MAP: Record<string, string> = Object.fromEntries(
  list(import.meta.env['VITE_ADMIN_PHONE_MAP'])
    .map((pair) => pair.split(":").map((v) => v.trim()))
    .filter((p) => p.length === 2 && p[0] && p[1])
    .map(([phone, email]) => [digits(phone!), email!.toLowerCase()]),
);

function digits(v: string) {
  return v.replace(/\D/g, "").replace(/^0+/, "");
}

export function isAllowedAdmin(email: string | null | undefined) {
  if (!email) return false;
  if (ADMIN_EMAILS.length === 0) return true; // no allowlist configured
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/** Turn "email or phone" input into the email Firebase expects. */
export function resolveIdentifier(identifier: string): string | null {
  const value = identifier.trim();
  if (value.includes("@")) return value.toLowerCase();
  const d = digits(value);
  if (!d) return null;
  // exact, or match on the last 10 digits so +91 / 0 prefixes both work
  return PHONE_MAP[d] ?? PHONE_MAP[d.slice(-10)] ?? null;
}

const MESSAGES: Record<string, string> = {
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/invalid-credential": "Wrong email or password. Please try again.",
  "auth/wrong-password": "Wrong email or password. Please try again.",
  "auth/user-not-found": "No admin account exists with these details.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests": "Too many attempts. Wait a minute and try again.",
  "auth/network-request-failed": "Network problem — check your connection.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  "auth/operation-not-allowed":
    "Email/password sign-in is switched off in Firebase. Enable it under Authentication → Sign-in method.",
  "auth/api-key-not-valid": "Firebase API key is invalid. Check your .env values.",
};

export function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string } | null)?.code ?? "";
  if (MESSAGES[code]) return MESSAGES[code]!;
  const msg = (err as Error | null)?.message ?? "";
  if (msg.includes("api-key-not-valid")) return MESSAGES['auth/api-key-not-valid']!;
  return msg || "Could not sign in. Please try again.";
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

function requireAuth() {
  const auth = getFirebaseAuth();
  if (!auth) throw new AuthError("Firebase is not configured. Add the VITE_FIREBASE_* values to .env.");
  return auth;
}

export async function adminSignIn(identifier: string, password: string) {
  const auth = requireAuth();
  const email = resolveIdentifier(identifier);
  if (!email) {
    throw new AuthError(
      "Enter your admin email, or a phone number that has been linked in VITE_ADMIN_PHONE_MAP.",
    );
  }
  const cred = await signInWithEmailAndPassword(auth, email, password);
  if (!isAllowedAdmin(cred.user.email)) {
    await fbSignOut(auth);
    throw new AuthError("This account does not have admin access.");
  }
}

export async function adminSignInWithGoogle() {
  const auth = requireAuth();
  const cred = await signInWithPopup(auth, new GoogleAuthProvider());
  if (!isAllowedAdmin(cred.user.email)) {
    await fbSignOut(auth);
    throw new AuthError("This Google account does not have admin access.");
  }
}

export async function adminResetPassword(identifier: string) {
  const auth = requireAuth();
  const email = resolveIdentifier(identifier);
  if (!email) throw new AuthError("Enter your admin email first, then tap reset.");
  await sendPasswordResetEmail(auth, email);
  return email;
}

export async function adminSignOut() {
  const auth = getFirebaseAuth();
  if (auth) await fbSignOut(auth);
  setSession(null);
}

/**
 * Keeps the admin store's session in sync with Firebase.
 * Returns false until Firebase has reported the initial auth state.
 */
export function useAdminAuthReady(): boolean {
  const [ready, setReady] = useState(!firebaseReady);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setReady(true);
      return;
    }
    return onAuthStateChanged(auth, (user) => {
      if (user && isAllowedAdmin(user.email)) {
        setSession({
          email: user.email ?? "",
          name: user.displayName || (user.email ?? "Admin").split("@")[0]!.replace(/[._-]/g, " "),
          via: user.providerData[0]?.providerId === "google.com" ? "google" : "password",
          phone: user.phoneNumber ?? "",
          uid: user.uid,
        });
      } else {
        setSession(null);
      }
      setReady(true);
    });
  }, []);

  return ready;
}
