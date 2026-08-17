import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Download,
  ExternalLink,
  Eye,
  Globe,
  Lock,
  Server,
  X,
  Zap,
  Code2,
} from "lucide-react";
import { getTemplate, templates, type Template } from "@/data/templates";
import { cn } from "@/lib/utils";
import { Container } from "@/components/site-chrome";

export const Route = createFileRoute("/templates/$slug")({
  loader: ({ params }) => {
    const template = getTemplate(params.slug);
    if (!template) throw notFound();
    return { template };
  },
  head: ({ loaderData }: { loaderData?: { template: Template } }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Template not found — SiteReadyPro" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const t = loaderData.template;
    return {
      meta: [
        { title: `${t.title} — SiteReadyPro Template` },
        { name: "description", content: t.tagline },
        { property: "og:title", content: `${t.title} — SiteReadyPro` },
        { property: "og:description", content: t.tagline },
        { property: "og:image", content: t.image },
      ],
    };
  },
  component: TemplateDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-6 text-center band-cream">
      <div>
        <h1 className="font-editorial text-5xl">Template not found</h1>
        <p className="mt-3 text-muted-foreground">This template doesn't exist or has been moved.</p>
        <Link to="/templates" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-medium text-[var(--cream)]">
          <ArrowLeft className="h-4 w-4" /> Back to templates
        </Link>
      </div>
    </div>
  ),
});

/* ─── Tech badge colours ─── */
const TECH_COLORS: Record<string, string> = {
  "HTML5":       "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "CSS3":        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Vanilla JS":  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Alpine.js":   "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "GSAP":        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "AOS":         "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "React":       "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Firebase":    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Supabase":    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "MongoDB":     "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
};

function TechBadge({ label }: { label: string }) {
  const cls = TECH_COLORS[label] ?? "bg-foreground/8 text-foreground/70";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium", cls)}>
      {label}
    </span>
  );
}

/* ─── Live Preview Modal (iframe) ─── */
function PreviewModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-xl">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-foreground/8 px-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-green-400/80" />
          </div>
          <span className="rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs text-muted-foreground">
            {url}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
          </a>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-foreground/10 bg-foreground/5 text-muted-foreground hover:text-foreground"
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* iframe */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={url}
          title={`Live preview — ${title}`}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
          loading="lazy"
        />
      </div>
    </div>
  );
}

/* ─── Download / Checkout modal ─── */
function DownloadModal({
  open,
  onClose,
  template,
}: {
  open: boolean;
  onClose: () => void;
  template: Template;
}) {
  const [email, setEmail] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const isFree = template.price === 0;

  if (!open) return null;

  const handleFreeDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloading(true);
    // In production: call server fn → get signed Firebase Storage URL → trigger download
    // For now: simulate and show message
    setTimeout(() => {
      setDownloading(false);
      setDone(true);
    }, 1200);
  };

  const handlePaidCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: call server fn → create Cashfree order → redirect to payment
    // For now: show "coming soon"
    alert("Cashfree payment integration coming soon! Contact via WhatsApp to purchase: +91 90000 00000");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <div className="relative overflow-hidden rounded-3xl border border-foreground/8 bg-card shadow-2xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-foreground/10 bg-foreground/5 text-muted-foreground hover:text-foreground z-10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-6 sm:p-8">
            {done ? (
              /* Success state */
              <div className="text-center py-4">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--clay)] text-[var(--cream)]">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="mt-5 font-editorial text-2xl">Ready to download!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your download is starting. The ZIP includes all source files with the proper folder structure.
                </p>
                <div className="mt-6 rounded-2xl border border-foreground/8 bg-foreground/5 p-4 text-left text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">📁 What's inside the ZIP:</p>
                  <p>• index.html + all pages</p>
                  <p>• /css — stylesheets</p>
                  <p>• /js — scripts</p>
                  <p>• /images — all assets</p>
                  <p>• README.md — setup guide</p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-foreground/10 px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  Close
                </button>
              </div>
            ) : isFree ? (
              /* Free download form */
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--ink)] text-[var(--cream)]">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="eyebrow">Free Template</div>
                    <h3 className="font-editorial text-xl">{template.title}</h3>
                  </div>
                </div>
                <form onSubmit={handleFreeDownload} className="space-y-3">
                  <input
                    required
                    type="email"
                    placeholder="Your email (optional — for updates)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3 text-sm outline-none focus:border-[var(--clay)]/60"
                  />
                  <button
                    type="submit"
                    disabled={downloading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 text-sm font-medium text-[var(--cream)] transition-all hover:opacity-90 disabled:opacity-60"
                  >
                    {downloading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--cream)]/30 border-t-[var(--cream)]" />
                        Preparing download…
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Download {template.title}.zip
                      </>
                    )}
                  </button>
                </form>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Free forever · Commercial license · No signup required
                </p>
              </>
            ) : (
              /* Paid checkout */
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--ink)] text-[var(--cream)]">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="eyebrow">Premium Template</div>
                    <h3 className="font-editorial text-xl">{template.title}</h3>
                  </div>
                </div>
                <div className="rounded-2xl border border-foreground/8 bg-foreground/5 p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{template.title}</span>
                    <span className="font-editorial text-2xl text-[var(--clay)]">
                      ₹{template.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">Commercial license · All source files · 1 year free updates</div>
                </div>
                <form onSubmit={handlePaidCheckout} className="space-y-3">
                  <input
                    required
                    type="email"
                    placeholder="Your email (download link sent here)"
                    className="w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3 text-sm outline-none focus:border-[var(--clay)]/60"
                  />
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--clay)] px-6 py-3.5 text-sm font-medium text-[var(--primary-foreground)] transition-all hover:opacity-90"
                  >
                    Pay ₹{template.price.toLocaleString("en-IN")} via Cashfree
                  </button>
                </form>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Secured by Cashfree · 100% refund if not satisfied
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Detail Page ─── */

function TemplateDetail() {
  const { template } = Route.useLoaderData() as { template: Template };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const related = templates.filter((t) => t.slug !== template.slug).slice(0, 3);
  const isFree = template.price === 0;

  // Determine site type badge based on tech stack
  const isDynamic = template.tech.some((t) =>
    ["React", "Vue", "Angular", "Firebase", "Supabase", "MongoDB", "Node.js"].includes(t)
  );
  const siteType = isDynamic ? "Dynamic" : "Static";

  // Determine backend
  const backends = ["Firebase", "Supabase", "MongoDB", "Node.js"];
  const backend = template.tech.find((t) => backends.includes(t)) ?? null;

  return (
    <div className="min-h-screen band-cream">
      {/* Back bar */}
      <div className="border-b border-foreground/8 bg-background/85 backdrop-blur-xl">
        <Container className="flex h-14 items-center gap-4">
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> All templates
          </Link>
          <span className="text-foreground/20">/</span>
          <span className="text-sm text-foreground/70">{template.title}</span>
        </Container>
      </div>

      <Container className="py-10 lg:py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start">

          {/* LEFT — preview image + info */}
          <div>
            {/* Preview image */}
            <div className="relative overflow-hidden rounded-2xl border border-foreground/8 shadow-[var(--shadow-lift)]">
              <img
                src={template.image}
                alt={template.title}
                className="w-full object-cover"
              />
              {/* Live preview overlay button */}
              <button
                onClick={() => setPreviewOpen(true)}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--ink)]/0 text-transparent transition-all duration-300 hover:bg-[var(--ink)]/60 hover:text-[var(--cream)]"
              >
                <Eye className="h-8 w-8 drop-shadow-lg" />
                <span className="text-sm font-medium drop-shadow-lg">Open live preview</span>
              </button>
            </div>

            {/* Badges row */}
            <div className="mt-6 flex flex-wrap gap-2">
              {/* Site type badge */}
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                isDynamic
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              )}>
                <Zap className="h-3 w-3" />
                {siteType}
              </span>
              {/* Backend badge */}
              {backend ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-xs font-medium text-[var(--cream)]">
                  <Server className="h-3 w-3" />
                  Backend: {backend}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/8 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  No backend
                </span>
              )}
              {/* Tech stack badges */}
              {template.tech.map((t) => (
                <TechBadge key={t} label={t} />
              ))}
            </div>

            {/* Description + Features */}
            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              <div>
                <h2 className="font-editorial text-2xl">About this template</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{template.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.pages.map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-editorial text-2xl">What's included</h2>
                <ul className="mt-3 space-y-2.5">
                  {template.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 shrink-0 text-[var(--clay)]" />
                      {f}
                    </li>
                  ))}
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-[var(--clay)]" />
                    Proper folder structure (ZIP)
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-[var(--clay)]" />
                    README with setup instructions
                  </li>
                  {!isFree && (
                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 shrink-0 text-[var(--clay)]" />
                      1 year free updates
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Code security note */}
            <div className="mt-8 rounded-2xl border border-foreground/8 bg-foreground/3 p-4">
              <div className="flex items-start gap-3">
                <Code2 className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Source code is protected.</strong> The live preview runs on an external host — you can inspect its HTML but the complete organized source (all files, folder structure, assets, documentation) is only available via the official ZIP download after purchase.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — sticky purchase card */}
          <aside className="lg:sticky lg:top-20">
            <div className="rounded-3xl border border-foreground/8 bg-card p-6 shadow-[var(--shadow-soft)]">
              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-editorial text-4xl text-[var(--clay)]">
                  {isFree ? "Free" : `₹${template.price.toLocaleString("en-IN")}`}
                </span>
                {!isFree && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{Math.round(template.price * 1.6).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <div className="eyebrow mt-1">{template.category} Template</div>

              {/* CTA buttons */}
              <div className="mt-6 space-y-3">
                <button
                  id={`btn-${isFree ? "download" : "buy"}-${template.slug}`}
                  onClick={() => setDownloadOpen(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 text-sm font-medium text-[var(--cream)] transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  {isFree ? (
                    <><Download className="h-4 w-4" /> Download Free</>
                  ) : (
                    <><Lock className="h-4 w-4" /> Buy · ₹{template.price.toLocaleString("en-IN")}</>
                  )}
                </button>
                <button
                  id={`btn-preview-${template.slug}`}
                  onClick={() => setPreviewOpen(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium transition-all hover:bg-foreground/5"
                >
                  <Eye className="h-4 w-4" /> Live Preview
                </button>
              </div>

              {/* Details table */}
              <div className="mt-6 space-y-2 border-t border-foreground/8 pt-5 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">License</span>
                  <span className="font-medium">Commercial</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Pages</span>
                  <span className="font-medium">{template.pages.length}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{siteType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Tech</span>
                  <span className="font-medium text-right max-w-[160px]">{template.tech.join(", ")}</span>
                </div>
                {backend && (
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Backend</span>
                    <span className="font-medium">{backend}</span>
                  </div>
                )}
                {!isFree && (
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Updates</span>
                    <span className="font-medium">1 year free</span>
                  </div>
                )}
              </div>

              {/* Security note */}
              <div className="mt-5 flex items-center gap-2 rounded-2xl bg-foreground/5 px-4 py-3 text-xs text-muted-foreground">
                <Lock className="h-3 w-3 shrink-0" />
                {isFree
                  ? "Download via secure signed link · No account needed"
                  : "Secure Cashfree payment · Instant ZIP download after payment"}
              </div>
            </div>

            {/* Contact for custom build */}
            <div className="mt-4 rounded-2xl border border-foreground/8 bg-card p-5 text-center">
              <p className="text-sm text-muted-foreground">Need this customised for your brand?</p>
              <Link
                to="/contact"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--clay)] hover:underline"
              >
                Get a free quote →
              </Link>
            </div>
          </aside>
        </div>

        {/* Related templates */}
        <div className="mt-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-editorial text-3xl">You might also like</h2>
            <Link to="/templates" className="text-sm text-muted-foreground hover:text-foreground">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/templates/$slug"
                params={{ slug: r.slug }}
                className="group overflow-hidden rounded-2xl border border-foreground/8 bg-card hover-lift"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={r.image}
                    alt={r.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute right-3 top-3 rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-medium text-[var(--ink)]">
                    {r.price === 0 ? "Free" : `₹${r.price.toLocaleString("en-IN")}`}
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-editorial text-lg">{r.title}</div>
                  <div className="eyebrow mt-1">{r.category}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>

      {/* Modals */}
      {previewOpen && (
        <PreviewModal
          url={`https://${template.slug}.netlify.app`}
          title={template.title}
          onClose={() => setPreviewOpen(false)}
        />
      )}
      <DownloadModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        template={template}
      />
    </div>
  );
}
