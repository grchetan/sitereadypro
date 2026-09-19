/**
 * Firestore helpers — templates, requests, purchases.
 *
 * All heavy lifting is here so components stay clean.
 */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getFirebaseDB, getFirebaseStorage } from "@/lib/firebase";

/* ─────────────── Types ─────────────── */

export type SiteType = "static" | "dynamic";
export type BackendUsed = "None" | "Firebase" | "Supabase" | "MongoDB" | "Node.js" | "Custom";

export type FirestoreTemplate = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  price: number;
  isPaid: boolean;
  techStack: string[];
  siteType: SiteType;
  backendUsed: BackendUsed;
  previewUrl: string;         // live demo URL (hosted externally)
  imageUrl: string;           // Firebase Storage URL for preview image
  zipStoragePath: string;     // Firebase Storage path for the ZIP file
  zipUrl: string;             // Public URL (for free) or empty (for paid)
  status: "published" | "draft";
  featured: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export type FirestoreRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  replied: boolean;
  starred: boolean;
  note: string;
  createdAt: Timestamp | null;
};

export type FirestorePurchase = {
  id: string;
  templateId: string;
  templateTitle: string;
  buyerEmail: string;
  amount: number;
  orderId: string;
  status: "pending" | "paid" | "failed";
  downloadUrl: string;
  createdAt: Timestamp | null;
};

/* ─────────────── Templates ─────────────── */

export async function fetchTemplates(): Promise<FirestoreTemplate[]> {
  const db = getFirebaseDB();
  if (!db) return [];
  const snap = await getDocs(
    query(collection(db, "templates"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreTemplate));
}

export async function fetchTemplate(id: string): Promise<FirestoreTemplate | null> {
  const db = getFirebaseDB();
  if (!db) return null;
  const snap = await getDoc(doc(db, "templates", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as FirestoreTemplate;
}

export async function fetchTemplateBySlug(slug: string): Promise<FirestoreTemplate | null> {
  const all = await fetchTemplates();
  return all.find((t) => t.slug === slug) ?? null;
}

export async function saveTemplate(
  data: Omit<FirestoreTemplate, "id" | "createdAt" | "updatedAt">,
  id?: string
): Promise<string> {
  const db = getFirebaseDB();
  if (!db) throw new Error("Firestore not available");

  if (id) {
    await updateDoc(doc(db, "templates", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return id;
  }

  const ref_ = await addDoc(collection(db, "templates"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref_.id;
}

export async function deleteTemplate(id: string, zipStoragePath?: string): Promise<void> {
  const db = getFirebaseDB();
  if (!db) return;
  await deleteDoc(doc(db, "templates", id));
  // Also delete ZIP from storage if path provided
  if (zipStoragePath) {
    try {
      const storage = getFirebaseStorage();
      if (storage) await deleteObject(ref(storage, zipStoragePath));
    } catch {
      // ignore — file may not exist
    }
  }
}

/* ─────────────── Storage Uploads ─────────────── */

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;  // 5 MB
const MAX_ZIP_BYTES   = 50 * 1024 * 1024; // 50 MB

export async function uploadTemplateImage(
  file: File,
  slug: string
): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Storage not available");

  // SECURITY: validate MIME type and size before upload
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be under 5 MB.");
  }

  // SECURITY: generate a safe storage path — never use the original filename
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const storageRef = ref(storage, `templates/${safeSlug}/preview-${Date.now()}.${ext}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadTemplateZip(
  file: File,
  slug: string
): Promise<{ path: string; url: string }> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Storage not available");

  // SECURITY: validate MIME type and size before upload
  if (file.type !== "application/zip" && file.type !== "application/x-zip-compressed" && !file.name.toLowerCase().endsWith(".zip")) {
    throw new Error("Only ZIP files are allowed.");
  }
  if (file.size > MAX_ZIP_BYTES) {
    throw new Error("ZIP file must be under 50 MB.");
  }

  // SECURITY: generate a safe storage path — never use the original filename
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const path = `templates/${safeSlug}/source-${Date.now()}.zip`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { path, url };
}

/* ─────────────── Client Requests ─────────────── */

export async function saveContactRequest(
  data: Omit<FirestoreRequest, "id" | "replied" | "starred" | "note" | "createdAt">
): Promise<string> {
  const db = getFirebaseDB();
  if (!db) throw new Error("Firestore not available");
  const ref_ = await addDoc(collection(db, "requests"), {
    ...data,
    replied: false,
    starred: false,
    note: "",
    createdAt: serverTimestamp(),
  });
  return ref_.id;
}

export async function fetchRequests(): Promise<FirestoreRequest[]> {
  const db = getFirebaseDB();
  if (!db) return [];
  const snap = await getDocs(
    query(collection(db, "requests"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreRequest));
}

export async function updateRequest(
  id: string,
  data: Partial<Pick<FirestoreRequest, "replied" | "starred" | "note">>
): Promise<void> {
  const db = getFirebaseDB();
  if (!db) return;
  await updateDoc(doc(db, "requests", id), data);
}
