/**
 * Admin panel store — UI-only (demo) layer.
 *
 * Everything lives in localStorage so the whole admin panel is fully
 * clickable without a backend. When a real backend is connected, swap the
 * read/write helpers here for server calls — the components stay the same.
 */
import { useSyncExternalStore } from "react";
import { templates as seedTemplates } from "@/data/templates";

export type TemplateType = "free" | "premium";

export type AdminTemplate = {
  id: string;
  slug: string;
  title: string;
  category: string;
  type: TemplateType;
  price: number;
  tagline: string;
  description: string;
  image: string;
  /** Tech stack labels e.g. ["HTML5", "CSS3", "Alpine.js"] */
  techStack: string[];
  siteType: "static" | "dynamic";
  backendUsed: "None" | "Firebase" | "Supabase" | "MongoDB" | "Node.js" | "Custom";
  previewUrl: string;
  zipStoragePath: string;
  zipUrl: string;
  status: "published" | "draft";
  featured: boolean;
  updatedAt: string;
};

export type RequestStatus = "new" | "in-review" | "quoted" | "won" | "lost";

export type ClientRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  channel: string;
  summary: string;
  status: RequestStatus;
  starred: boolean;
  note: string;
  createdAt: string;
};

export type PortfolioItem = {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  blurb: string;
  liveUrl: string;
  status: "published" | "draft";
};

/** Service / plan shown on the public site — fully editable from the admin panel. */
export type ServiceIcon = "globe" | "zap" | "cart" | "pen" | "rocket" | "wrench";

export type AdminService = {
  id: string;
  name: string;
  tagline: string;
  /** Starting price in ₹ */
  price: number;
  /** Optional "was" price, shown struck through. 0 = hide. */
  comparePrice: number;
  timeline: string;
  bestFor: string;
  deliverables: string[];
  icon: ServiceIcon;
  band: "band-blush" | "band-sage" | "band-butter" | "band-cream";
  popular: boolean;
  status: "published" | "draft";
  order: number;
};

export type AdminSettings = {
  brandName: string;
  contactEmail: string;
  whatsapp: string;
  starterPrice: number;
  proPrice: number;
  studioPrice: number;
  freeDomain: boolean;
  freeMaintenance: boolean;
  acceptingProjects: boolean;
  announcement: string;
};

export type AdminSession = {
  email: string;
  name: string;
  via: "password" | "google";
  phone?: string;
  uid?: string;
} | null;

export type AdminState = {
  session: AdminSession;
  requests: ClientRequest[];
  templates: AdminTemplate[];
  portfolio: PortfolioItem[];
  services: AdminService[];
  settings: AdminSettings;
};

const KEY = "srp_admin_state_v2";

const uid = () => Math.random().toString(36).slice(2, 10);
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();


function seedServices(): AdminService[] {
  return [
    {
      id: uid(),
      name: "Starter Static Site",
      tagline: "1–5 page brochure site, hand-coded and lightning fast.",
      price: 4999,
      comparePrice: 9999,
      timeline: "3 days",
      bestFor: "Students, freelancers, personal brands",
      deliverables: [
        "Up to 5 responsive pages",
        "SEO meta + Open Graph setup",
        "Contact form that lands in your inbox",
        "Free .com domain (first year)",
        "Free maintenance & small edits",
        "1 revision round",
      ],
      icon: "globe",
      band: "band-blush",
      popular: false,
      status: "published",
      order: 1,
    },
    {
      id: uid(),
      name: "Business Dynamic Site",
      tagline: "CMS-powered site you can update yourself, anytime.",
      price: 14999,
      comparePrice: 24999,
      timeline: "10 days",
      bestFor: "Cafés, clinics, studios, growing brands",
      deliverables: [
        "Custom admin dashboard",
        "Blog / gallery / menu sections",
        "Google Analytics + speed tuning",
        "WhatsApp & enquiry integrations",
        "Free .com domain (first year)",
        "Free maintenance & 2 revision rounds",
      ],
      icon: "zap",
      band: "band-sage",
      popular: true,
      status: "published",
      order: 2,
    },
    {
      id: uid(),
      name: "E-commerce Store",
      tagline: "Full online store with cart, payments and order panel.",
      price: 29999,
      comparePrice: 49999,
      timeline: "3 weeks",
      bestFor: "Shops, D2C brands, boutiques",
      deliverables: [
        "Product catalog + cart + checkout",
        "UPI / card payment gateway",
        "Order & inventory management panel",
        "Coupons, shipping and invoices",
        "Free .com domain (first year)",
        "Free maintenance & support",
      ],
      icon: "cart",
      band: "band-butter",
      popular: false,
      status: "published",
      order: 3,
    },
    {
      id: uid(),
      name: "Template Customisation",
      tagline: "Pick a SiteReady template, I make it fully yours.",
      price: 2499,
      comparePrice: 0,
      timeline: "48 hours",
      bestFor: "Anyone in a hurry with a tiny budget",
      deliverables: [
        "Your content, images and colours",
        "Logo + brand font setup",
        "Domain connect & deploy",
        "Free maintenance for 3 months",
      ],
      icon: "pen",
      band: "band-cream",
      popular: false,
      status: "published",
      order: 4,
    },
    {
      id: uid(),
      name: "Redesign & Speed Fix",
      tagline: "Old site looking tired or loading slow? I rebuild it.",
      price: 7999,
      comparePrice: 0,
      timeline: "1 week",
      bestFor: "Existing sites that need a fresh face",
      deliverables: [
        "Full visual redesign",
        "Core Web Vitals / speed pass",
        "Mobile responsiveness fixes",
        "On-page SEO cleanup",
      ],
      icon: "rocket",
      band: "band-sage",
      popular: false,
      status: "published",
      order: 5,
    },
  ];
}

function seed(): AdminState {
  return {
    session: null,
    services: seedServices(),

    templates: seedTemplates.map((t, i) => ({
      id: uid(),
      slug: t.slug,
      title: t.title,
      category: t.category,
      type: t.price === 0 ? "free" : "premium",
      price: t.price,
      tagline: t.tagline,
      image: t.image,
      status: "published",
      featured: i < 2,
      updatedAt: daysAgo(i * 3),
    })),
    requests: [
      {
        id: uid(),
        name: "Riya Sharma",
        email: "riya@bakehouse.in",
        phone: "+91 98200 11223",
        projectType: "Bakery landing page",
        budget: "₹10k – ₹25k",
        timeline: "2–3 weeks",
        channel: "WhatsApp",
        summary:
          "A one-page website for a small home bakery with a menu, order form and Instagram feed.",
        status: "new",
        starred: true,
        note: "",
        createdAt: daysAgo(1),
      },
      {
        id: uid(),
        name: "Aditya Verma",
        email: "aditya@northloop.dev",
        phone: "+91 90040 88712",
        projectType: "SaaS marketing site",
        budget: "₹50k+",
        timeline: "1 month",
        channel: "Email",
        summary: "Needs a pricing page, docs shell and blog. Brand guidelines are ready.",
        status: "in-review",
        starred: false,
        note: "Call scheduled Friday 6pm.",
        createdAt: daysAgo(4),
      },
      {
        id: uid(),
        name: "Café Mirchi",
        email: "hello@cafemirchi.com",
        phone: "+91 88998 22110",
        projectType: "Café website + menu",
        budget: "₹10k – ₹25k",
        timeline: "ASAP",
        channel: "Call",
        summary: "Wants a template customised, with domain and maintenance included.",
        status: "quoted",
        starred: false,
        note: "Quoted ₹18k with free .com first year.",
        createdAt: daysAgo(9),
      },
      {
        id: uid(),
        name: "Studio Kaya",
        email: "team@studiokaya.co",
        phone: "+91 78650 33409",
        projectType: "Agency portfolio",
        budget: "₹25k – ₹50k",
        timeline: "3–4 weeks",
        channel: "Email",
        summary: "Editorial style portfolio with case studies and CMS-ready structure.",
        status: "won",
        starred: true,
        note: "Advance received.",
        createdAt: daysAgo(16),
      },
    ],
    portfolio: [
      {
        id: uid(),
        title: "Northloop Analytics",
        client: "Northloop",
        category: "SaaS",
        year: "2026",
        blurb: "Marketing site redesign — 38% more trial signups in the first month.",
        liveUrl: "https://example.com",
        status: "published",
      },
      {
        id: uid(),
        title: "Mirchi Café",
        client: "Café Mirchi",
        category: "Hospitality",
        year: "2025",
        blurb: "Menu-first café site with table booking and Instagram wall.",
        liveUrl: "https://example.com",
        status: "published",
      },
      {
        id: uid(),
        title: "Kaya Studio",
        client: "Studio Kaya",
        category: "Agency",
        year: "2025",
        blurb: "Editorial portfolio with case-study spreads and a slow-scroll feel.",
        liveUrl: "",
        status: "draft",
      },
    ],
    settings: {
      brandName: "SiteReadyPro",
      contactEmail: "hello@sitereadypro.com",
      whatsapp: "+91 90000 00000",
      starterPrice: 4999,
      proPrice: 14999,
      studioPrice: 34999,
      freeDomain: true,
      freeMaintenance: true,
      acceptingProjects: true,
      announcement: "Free .com domain (first year) + free maintenance on every custom build.",
    },
  };
}

let state: AdminState = seed();
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    // session is never persisted — Firebase Auth is the single source of truth
    window.localStorage.setItem(KEY, JSON.stringify({ ...state, session: null }));
  } catch {
    /* ignore quota errors */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AdminState>;
      state = {
        ...state,
        ...parsed,
        session: state.session,
        settings: { ...state.settings, ...(parsed.settings ?? {}) },
      };
    }
  } catch {
    /* fall back to seed */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function set(updater: (prev: AdminState) => AdminState) {
  state = updater(state);
  emit();
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    hydrated = false;
    hydrate();
    listeners.forEach((l) => l());
  };
  window.addEventListener("storage", onStorage);
  listener();
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const serverSnapshot = seed();

export function useAdmin(): AdminState {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return state;
    },
    () => serverSnapshot,
  );
}

/* ---------------- auth (Firebase-backed) ---------------- */

/** Called by the Firebase auth listener in @/lib/admin-auth. */
export function setSession(session: AdminSession) {
  if (state.session === session) return;
  if (
    state.session &&
    session &&
    state.session.uid === session.uid &&
    state.session.email === session.email
  ) {
    return;
  }
  set((s) => ({ ...s, session }));
}

/* ---------------- requests ---------------- */

export function setRequestStatus(id: string, status: RequestStatus) {
  set((s) => ({
    ...s,
    requests: s.requests.map((r) => (r.id === id ? { ...r, status } : r)),
  }));
}

export function toggleRequestStar(id: string) {
  set((s) => ({
    ...s,
    requests: s.requests.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r)),
  }));
}

export function setRequestNote(id: string, note: string) {
  set((s) => ({
    ...s,
    requests: s.requests.map((r) => (r.id === id ? { ...r, note } : r)),
  }));
}

export function deleteRequest(id: string) {
  set((s) => ({ ...s, requests: s.requests.filter((r) => r.id !== id) }));
}

/* ---------------- templates ---------------- */

export type TemplateDraft = Omit<AdminTemplate, "id" | "updatedAt">;

export const emptyTemplate = (): TemplateDraft => ({
  slug: "",
  title: "",
  category: "Portfolio",
  type: "free",
  price: 0,
  tagline: "",
  description: "",
  image: "",
  techStack: [],
  siteType: "static",
  backendUsed: "None",
  previewUrl: "",
  zipStoragePath: "",
  zipUrl: "",
  status: "draft",
  featured: false,
});

export function saveTemplate(draft: TemplateDraft, id?: string) {
  set((s) => {
    const updatedAt = new Date().toISOString();
    if (id) {
      return {
        ...s,
        templates: s.templates.map((t) => (t.id === id ? { ...t, ...draft, updatedAt } : t)),
      };
    }
    return { ...s, templates: [{ ...draft, id: uid(), updatedAt }, ...s.templates] };
  });
}

export function deleteTemplate(id: string) {
  set((s) => ({ ...s, templates: s.templates.filter((t) => t.id !== id) }));
}

export function toggleTemplateStatus(id: string) {
  set((s) => ({
    ...s,
    templates: s.templates.map((t) =>
      t.id === id
        ? { ...t, status: t.status === "published" ? "draft" : "published", updatedAt: new Date().toISOString() }
        : t,
    ),
  }));
}

export function toggleTemplateFeatured(id: string) {
  set((s) => ({
    ...s,
    templates: s.templates.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t)),
  }));
}

/* ---------------- services ---------------- */

export type ServiceDraft = Omit<AdminService, "id">;

export const emptyService = (order = 99): ServiceDraft => ({
  name: "",
  tagline: "",
  price: 4999,
  comparePrice: 0,
  timeline: "1 week",
  bestFor: "",
  deliverables: [],
  icon: "globe",
  band: "band-blush",
  popular: false,
  status: "draft",
  order,
});

export function saveService(draft: ServiceDraft, id?: string) {
  set((s) =>
    id
      ? { ...s, services: s.services.map((v) => (v.id === id ? { ...v, ...draft } : v)) }
      : { ...s, services: [...s.services, { ...draft, id: uid() }] },
  );
}

export function deleteService(id: string) {
  set((s) => ({ ...s, services: s.services.filter((v) => v.id !== id) }));
}

export function toggleServiceStatus(id: string) {
  set((s) => ({
    ...s,
    services: s.services.map((v) =>
      v.id === id ? { ...v, status: v.status === "published" ? "draft" : "published" } : v,
    ),
  }));
}

export function toggleServicePopular(id: string) {
  set((s) => ({
    ...s,
    services: s.services.map((v) => ({ ...v, popular: v.id === id ? !v.popular : false })),
  }));
}

export function moveService(id: string, dir: -1 | 1) {
  set((s) => {
    const list = [...s.services].sort((a, b) => a.order - b.order);
    const i = list.findIndex((v) => v.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return s;
    const a = list[i]!;
    const b = list[j]!;
    const swapped = list.map((v) =>
      v.id === a.id ? { ...v, order: b.order } : v.id === b.id ? { ...v, order: a.order } : v,
    );
    return { ...s, services: swapped };
  });
}

/** Public-site helper: published services in display order. */
export function useServices(): AdminService[] {
  const { services } = useAdmin();
  return services.filter((s) => s.status === "published").sort((a, b) => a.order - b.order);
}

export const serviceIconLabels: Record<ServiceIcon, string> = {
  globe: "Globe (static site)",
  zap: "Zap (dynamic site)",
  cart: "Cart (e-commerce)",
  pen: "Pen (design work)",
  rocket: "Rocket (launch/redesign)",
  wrench: "Wrench (maintenance)",
};

/* ---------------- portfolio ---------------- */


export type PortfolioDraft = Omit<PortfolioItem, "id">;

export const emptyPortfolio = (): PortfolioDraft => ({
  title: "",
  client: "",
  category: "Custom",
  year: String(new Date().getFullYear()),
  blurb: "",
  liveUrl: "",
  status: "draft",
});

export function savePortfolio(draft: PortfolioDraft, id?: string) {
  set((s) =>
    id
      ? { ...s, portfolio: s.portfolio.map((p) => (p.id === id ? { ...p, ...draft } : p)) }
      : { ...s, portfolio: [{ ...draft, id: uid() }, ...s.portfolio] },
  );
}

export function deletePortfolio(id: string) {
  set((s) => ({ ...s, portfolio: s.portfolio.filter((p) => p.id !== id) }));
}

/* ---------------- settings ---------------- */

export function saveSettings(next: AdminSettings) {
  set((s) => ({ ...s, settings: next }));
}

export function resetDemoData() {
  const session = state.session;
  state = { ...seed(), session };
  emit();
}

export const statusLabels: Record<RequestStatus, string> = {
  new: "New",
  "in-review": "In review",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};
