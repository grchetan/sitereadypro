import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Eye,
  Layers,
  Lock,
  Monitor,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  X,
} from "lucide-react";
import { getTemplate, templates, type Template } from "@/data/templates";
import { cn } from "@/lib/utils";

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
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: TemplateDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <h1 className="text-4xl font-bold">Template not found</h1>
        <p className="mt-3 text-muted-foreground">This template doesn't exist or has moved.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </div>
  ),
});

/* ---------- Screenshot mockups (pure CSS browser frames) ---------- */

function BrowserFrame({
  tone,
  variant,
  className,
}: {
  tone: string;
  variant: "home" | "features" | "pricing";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-card relative overflow-hidden rounded-2xl border border-foreground/10",
        className,
      )}
    >
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b border-foreground/10 bg-foreground/40 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <div className="ml-3 flex-1 truncate rounded-md bg-foreground/5 px-3 py-1 text-[10px] text-muted-foreground">
          sitereadypro.com/preview
        </div>
      </div>
      {/* Content */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <div className={cn("absolute inset-0 bg-gradient-to-br", tone)} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="relative flex h-full flex-col p-5">
          {/* Fake nav */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-foreground/40" />
            <div className="flex gap-3">
              <div className="h-2 w-10 rounded bg-foreground/25" />
              <div className="h-2 w-10 rounded bg-foreground/25" />
              <div className="h-2 w-10 rounded bg-foreground/25" />
            </div>
          </div>

          {variant === "home" && (
            <div className="mt-6 flex flex-1 items-center gap-6">
              <div className="flex-1 space-y-3">
                <div className="h-4 w-3/4 rounded bg-foreground/60" />
                <div className="h-4 w-2/3 rounded bg-foreground/50" />
                <div className="h-2 w-4/5 rounded bg-foreground/30" />
                <div className="h-2 w-3/5 rounded bg-foreground/30" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-20 rounded-full bg-white/80" />
                  <div className="h-6 w-20 rounded-full border border-foreground/40" />
                </div>
              </div>
              <div className="hidden h-32 w-40 rounded-xl border border-foreground/30 bg-foreground/10 backdrop-blur md:block" />
            </div>
          )}

          {variant === "features" && (
            <div className="mt-6 grid flex-1 grid-cols-3 gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-lg bg-foreground/10 p-3 backdrop-blur"
                >
                  <div className="h-4 w-4 rounded bg-white/70" />
                  <div className="h-2 w-3/4 rounded bg-foreground/50" />
                  <div className="h-1.5 w-full rounded bg-foreground/25" />
                  <div className="h-1.5 w-4/5 rounded bg-foreground/25" />
                </div>
              ))}
            </div>
          )}

          {variant === "pricing" && (
            <div className="mt-6 grid flex-1 grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col gap-2 rounded-lg border p-3 backdrop-blur",
                    i === 1
                      ? "border-foreground/60 bg-foreground/20"
                      : "border-foreground/20 bg-foreground/10",
                  )}
                >
                  <div className="h-2 w-1/2 rounded bg-foreground/40" />
                  <div className="h-5 w-3/4 rounded bg-white/70" />
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full rounded bg-foreground/30" />
                    <div className="h-1.5 w-4/5 rounded bg-foreground/30" />
                    <div className="h-1.5 w-3/5 rounded bg-foreground/30" />
                  </div>
                  <div className="mt-auto h-5 w-full rounded-full bg-white/70" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Checkout modal ---------- */

type Step = "details" | "payment" | "success";

function CheckoutModal({
  open,
  onClose,
  template,
}: {
  open: boolean;
  onClose: () => void;
  template: ReturnType<typeof getTemplate>;
}) {
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState({ name: "", email: "" });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(template && template.price === 0 ? "success" : "details");
      setProcessing(false);
    }
  }, [open, template]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !template) return null;

  const isFree = template.price === 0;

  const goPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const finalize = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("success");
    }, 1400);
  };

  const steps: { key: Step; label: string }[] = isFree
    ? [{ key: "success", label: "Download" }]
    : [
        { key: "details", label: "Details" },
        { key: "payment", label: "Payment" },
        { key: "success", label: "Download" },
      ];

  const currentIdx = steps.findIndex((s) => s.key === step);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/70 backdrop-blur-sm"
      />
      <div className="surface-card relative z-10 w-full max-w-lg rounded-3xl p-6 shadow-2xl md:p-8 animate-fade-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-foreground/10 bg-foreground/5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close checkout"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Progress */}
        {!isFree && (
          <div className="mb-6 flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s.key} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-all",
                    i <= currentIdx
                      ? "border-transparent bg-gradient-to-br from-primary to-secondary text-primary-foreground"
                      : "border-foreground/10 bg-foreground/5 text-muted-foreground",
                  )}
                >
                  {i < currentIdx ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className="text-xs text-muted-foreground">{s.label}</span>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-px flex-1 transition-colors",
                      i < currentIdx ? "bg-gradient-to-r from-primary to-secondary" : "bg-foreground/10",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {step === "details" && (
          <>
            <h3 className="text-2xl font-bold">Checkout</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You're getting <span className="text-foreground">{template.title}</span>.
            </p>
            <form onSubmit={goPayment} className="mt-6 space-y-3">
              <input
                required
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-2xl border border-foreground/10 bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
              />
              <input
                required
                type="email"
                placeholder="Email (we'll send the download link here)"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-2xl border border-foreground/10 bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/60"
              />
              <div className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="text-lg font-bold text-gradient">
                  ₹{template.price.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground btn-glow transition-all hover:scale-[1.01]"
              >
                Continue to payment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </>
        )}

        {step === "payment" && (
          <>
            <h3 className="text-2xl font-bold">Payment</h3>
            <p className="mt-1 text-sm text-muted-foreground">Secure checkout · encrypted</p>
            <form onSubmit={finalize} className="mt-6 space-y-3">
              <input
                required
                placeholder="Card number"
                inputMode="numeric"
                className="w-full rounded-2xl border border-foreground/10 bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary/60"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="MM / YY"
                  className="w-full rounded-2xl border border-foreground/10 bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary/60"
                />
                <input
                  required
                  placeholder="CVC"
                  className="w-full rounded-2xl border border-foreground/10 bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary/60"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                Your card details never touch our servers.
              </div>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground btn-glow transition-all hover:scale-[1.01] disabled:opacity-70"
              >
                {processing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                    Processing…
                  </>
                ) : (
                  <>Pay ₹{template.price.toLocaleString("en-IN")}</>
                )}
              </button>
              <button
                type="button"
                onClick={() => setStep("details")}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                ← Back to details
              </button>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground animate-float">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="mt-5 text-2xl font-bold">
              {isFree ? "Ready to download" : "Payment successful"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {isFree
                ? `${template.title} is free — grab your copy below.`
                : `We've sent a receipt to your email. Your download is ready.`}
            </p>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-primary-foreground btn-glow"
            >
              <Download className="h-4 w-4" />
              Download {template.title}.zip
            </a>
            <div className="mt-4 text-xs text-muted-foreground">
              Includes source files, docs, and 1 year of updates.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Detail page ---------- */

function TemplateDetail() {
  const { template } = Route.useLoaderData() as { template: Template };
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeShot, setActiveShot] = useState(0);

  const shots: { variant: "home" | "features" | "pricing"; label: string }[] = [
    { variant: "home", label: "Home" },
    { variant: "features", label: "Features" },
    { variant: "pricing", label: "Pricing" },
  ];

  const related = templates.filter((t) => t.slug !== template.slug).slice(0, 3);

  const isFree = template.price === 0;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-foreground/5 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            SiteReady<span className="text-gradient">Pro</span>
          </Link>
          <button
            onClick={() => navigate({ to: "/", hash: "templates" })}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All templates
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link to="/" hash="templates" className="hover:text-foreground">
            Templates
          </Link>
          <span>/</span>
          <span className="text-foreground">{template.title}</span>
        </nav>

        {/* Hero split */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="animate-fade-up">
            {/* Preview area */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1 rounded-full border border-foreground/10 bg-foreground/5 p-1">
                {[
                  { key: "desktop", Icon: Monitor },
                  { key: "tablet", Icon: Tablet },
                  { key: "mobile", Icon: Smartphone },
                ].map(({ key, Icon }) => (
                  <button
                    key={key}
                    onClick={() => setDevice(key as typeof device)}
                    className={cn(
                      "grid h-8 w-9 place-items-center rounded-full transition-all",
                      device === key
                        ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    aria-label={key}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <Eye className="h-4 w-4" /> Open live preview
              </a>
            </div>

            <div className="mt-4 flex justify-center">
              <div
                className={cn(
                  "w-full transition-all duration-500",
                  device === "desktop" && "max-w-full",
                  device === "tablet" && "max-w-xl",
                  device === "mobile" && "max-w-xs",
                )}
              >
                <BrowserFrame
                  key={activeShot + device}
                  tone={template.tone}
                  variant={shots[activeShot].variant}
                  className="animate-fade-up"
                />
              </div>
            </div>

            {/* Screenshot thumbs */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {shots.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setActiveShot(i)}
                  className={cn(
                    "group overflow-hidden rounded-xl border transition-all",
                    activeShot === i
                      ? "border-primary/60 ring-1 ring-primary/40"
                      : "border-foreground/10 hover:border-foreground/25",
                  )}
                >
                  <BrowserFrame tone={template.tone} variant={s.variant} className="rounded-none border-0" />
                  <div className="bg-foreground/40 px-3 py-1.5 text-left text-[11px] text-muted-foreground">
                    {s.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="surface-card rounded-3xl p-6 md:p-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs text-muted-foreground">
                <Layers className="h-3 w-3" /> {template.category}
              </span>
              <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{template.title}</h1>
              <p className="mt-2 text-muted-foreground">{template.tagline}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-gradient">
                  {isFree ? "Free" : `₹${template.price.toLocaleString("en-IN")}`}
                </span>
                {!isFree && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{Math.round(template.price * 1.6).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                ))}
                <span className="ml-1">4.9 · 120+ downloads</span>
              </div>

              <button
                onClick={() => setCheckoutOpen(true)}
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3.5 text-sm font-semibold text-primary-foreground btn-glow transition-all hover:scale-[1.01]"
              >
                <Download className="h-4 w-4" />
                {isFree ? "Download for free" : "Buy & Download"}
              </button>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground/15 bg-foreground/5 px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-foreground/10"
              >
                <Eye className="h-4 w-4" /> Live preview
              </a>

              <div className="mt-6 border-t border-foreground/5 pt-6 text-sm">
                <div className="flex justify-between py-1.5 text-muted-foreground">
                  <span>License</span>
                  <span className="text-foreground">Commercial</span>
                </div>
                <div className="flex justify-between py-1.5 text-muted-foreground">
                  <span>Pages</span>
                  <span className="text-foreground">{template.pages.length}</span>
                </div>
                <div className="flex justify-between py-1.5 text-muted-foreground">
                  <span>Tech</span>
                  <span className="text-foreground">{template.tech.join(", ")}</span>
                </div>
                <div className="flex justify-between py-1.5 text-muted-foreground">
                  <span>Updates</span>
                  <span className="text-foreground">1 year free</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Description + Features */}
        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">About this template</h2>
            <p className="mt-4 text-muted-foreground">{template.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
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
            <h2 className="text-2xl font-bold">What's included</h2>
            <ul className="mt-4 grid gap-3">
              {template.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary/20 text-secondary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Related */}
        <div className="mt-24">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">You might also like</h2>
            <Link to="/" hash="templates" className="text-sm text-muted-foreground hover:text-foreground">
              Browse all →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/templates/$slug"
                params={{ slug: r.slug }}
                className="group surface-card overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className={cn("absolute inset-0 bg-gradient-to-br", r.tone)} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="font-semibold">{r.title}</h3>
                    <p className="text-xs text-muted-foreground">{r.category}</p>
                  </div>
                  <span className="text-xs font-semibold text-gradient">
                    {r.price === 0 ? "Free" : `₹${r.price.toLocaleString("en-IN")}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} template={template} />
    </div>
  );
}
