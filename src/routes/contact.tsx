import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { z } from "zod";
import { Container, Eyebrow, GradientButton, Blobs } from "@/components/site-chrome";
import {
  Mail,
  Globe,
  Clock,
  ArrowUpRight,
  ArrowLeft,
  Check,
  Sparkles,
  Rocket,
  ShoppingCart,
  Layout,
  Wrench,
  MessageCircle,
  Calendar,
  IndianRupee,
  AlertCircle,
  User as UserIcon,
  Building2,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Start a Project — SiteReadyPro" },
      {
        name: "description",
        content:
          "Share your project brief in a guided 4-step form — goals, scope, budget and timeline. Get a tailored proposal within 24 hours.",
      },
      { property: "og:title", content: "Start a Project — SiteReadyPro" },
      {
        property: "og:description",
        content: "Guided project brief form. Tell us your goals, we send back a plan and a quote.",
      },
    ],
  }),
  component: ContactPage,
});

/* ---------------- Shared a11y helpers ---------------- */

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay)] focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const FIELD_BASE =
  "w-full border border-foreground/12 bg-background/60 text-sm outline-none transition-all focus:border-[var(--clay)] focus:ring-2 focus:ring-[var(--clay)]/40 aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus:ring-red-600/30";

/* ---------------- Types & schema ---------------- */

type Mode = "brief" | "general" | "support";

type ProjectType = "static" | "dynamic" | "ecommerce" | "template" | "custom";
type Budget = "under-10k" | "10-25k" | "25-60k" | "60k+" | "unsure";
type Timeline = "asap" | "2-4w" | "1-2m" | "flex";

interface BriefState {
  // step 1
  projectType: ProjectType | "";
  goals: string[];
  otherGoal: string;
  // step 2
  scope: string;
  features: string[];
  pages: string;
  references: string;
  // step 3
  budget: Budget | "";
  timeline: Timeline | "";
  hasBrand: "yes" | "no" | "partial" | "";
  hasContent: "yes" | "no" | "partial" | "";
  // step 4
  name: string;
  email: string;
  company: string;
  phone: string;
  preferred: "email" | "whatsapp" | "call";
}

const emptyBrief: BriefState = {
  projectType: "",
  goals: [],
  otherGoal: "",
  scope: "",
  features: [],
  pages: "",
  references: "",
  budget: "",
  timeline: "",
  hasBrand: "",
  hasContent: "",
  name: "",
  email: "",
  company: "",
  phone: "",
  preferred: "email",
};

const stepSchemas = [
  z.object({
    projectType: z.enum(["static", "dynamic", "ecommerce", "template", "custom"], {
      message: "Pick a project type",
    }),
    goals: z.array(z.string()).min(1, "Pick at least one goal"),
  }),
  z.object({
    scope: z.string().trim().min(20, "Tell me a bit more (min 20 chars)").max(1500, "Keep it under 1500 chars"),
    pages: z.string().trim().max(300).optional().or(z.literal("")),
    references: z.string().trim().max(500).optional().or(z.literal("")),
  }),
  z.object({
    budget: z.enum(["under-10k", "10-25k", "25-60k", "60k+", "unsure"], { message: "Choose a budget range" }),
    timeline: z.enum(["asap", "2-4w", "1-2m", "flex"], { message: "Choose a timeline" }),
    hasBrand: z.enum(["yes", "no", "partial"], { message: "Select an option" }),
    hasContent: z.enum(["yes", "no", "partial"], { message: "Select an option" }),
  }),
  z.object({
    name: z.string().trim().min(2, "Your name please").max(80),
    email: z.string().trim().email("Enter a valid email").max(160),
    company: z.string().trim().max(120).optional().or(z.literal("")),
    phone: z.string().trim().max(30).optional().or(z.literal("")),
    preferred: z.enum(["email", "whatsapp", "call"]),
  }),
];

const projectTypeOptions: { id: ProjectType; icon: any; title: string; desc: string }[] = [
  { id: "static", icon: Layout, title: "Static Website", desc: "Landing / portfolio / brochure" },
  { id: "dynamic", icon: Rocket, title: "Dynamic Web App", desc: "Dashboards, auth, database" },
  { id: "ecommerce", icon: ShoppingCart, title: "E-commerce", desc: "Store, cart, payments" },
  { id: "template", icon: Sparkles, title: "Ready Template", desc: "Buy & customise a template" },
  { id: "custom", icon: Wrench, title: "Something Custom", desc: "Tell me your idea" },
];

const goalOptions = [
  "Get more clients / leads",
  "Sell products online",
  "Showcase portfolio / work",
  "Book appointments",
  "Improve existing website",
  "Build brand credibility",
  "SEO / rank on Google",
];

const featureOptions = [
  "Contact form",
  "Blog / CMS",
  "Payments",
  "User accounts",
  "Admin dashboard",
  "Newsletter",
  "Multi-language",
  "Analytics",
  "Live chat",
  "Custom animations",
];

const budgetLabels: Record<Budget, string> = {
  "under-10k": "Under ₹10,000",
  "10-25k": "₹10K – ₹25K",
  "25-60k": "₹25K – ₹60K",
  "60k+": "₹60K+",
  unsure: "Not sure yet",
};

const timelineLabels: Record<Timeline, string> = {
  asap: "ASAP (this week)",
  "2-4w": "2 – 4 weeks",
  "1-2m": "1 – 2 months",
  flex: "Flexible",
};

const stepTitles = [
  "About your project",
  "Scope & features",
  "Budget & timeline",
  "Your details",
  "Review & send",
];

const DRAFT_KEY = "srp_brief_draft_v1";

/* ---------------- Page ---------------- */

function ContactPage() {
  const [mode, setMode] = useState<Mode>("brief");

  const modes: { id: Mode; icon: any; label: string }[] = [
    { id: "general", icon: MessageCircle, label: "Quick question" },
    { id: "support", icon: Wrench, label: "Template support" },
    { id: "brief", icon: Rocket, label: "Full brief" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden pt-8 pb-16 sm:pb-24 lg:pt-16 lg:pb-32">
        <Blobs variant="clay" />
        <Container>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
            <Eyebrow>Start a project</Eyebrow>
            <Eyebrow>Reply · under 24h</Eyebrow>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.3fr] lg:gap-14">
            {/* Left column */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h1 className="font-editorial text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.035em]">
                Tell me about your{" "}
                <span className="italic-serif text-[var(--clay)]">project.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg text-muted-foreground">
                A short guided brief — 4 quick steps. I read every word myself and reply with a plan, timeline, and a fair quote.
              </p>

              <ul className="mt-10 space-y-4">
                {[
                  { icon: Mail, label: "hello@sitereadypro.com", sub: "Prefer email? Write directly." },
                  { icon: Globe, label: "Based in India · Working worldwide", sub: "Comfortable across time zones" },
                  { icon: Clock, label: "Avg reply: under 24h", sub: "Weekends off, mostly" },
                ].map((i) => (
                  <li key={i.label} className="flex items-start gap-4 border-t border-foreground/15 pt-4">
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--clay)]/15 text-[var(--clay)]"
                    >
                      <i.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-editorial text-base leading-tight">{i.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{i.sub}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl border border-foreground/10 bg-[var(--clay)]/8 p-5 text-sm">
                <div className="eyebrow mb-2 text-[var(--clay)]" id="mode-switch-label">
                  Not ready for a full brief?
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="mode-switch-label">
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      aria-pressed={mode === m.id}
                      className={cn(
                        "inline-flex min-h-9 items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                        FOCUS_RING,
                        mode === m.id
                          ? "border-transparent bg-[var(--ink)] text-[var(--cream)]"
                          : "border-foreground/15 hover:border-foreground/40",
                      )}
                    >
                      <m.icon className="h-3 w-3" aria-hidden="true" /> {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column — form card */}
            <div className="rounded-[1.5rem] border border-foreground/10 bg-card p-4 shadow-[var(--shadow-soft)] sm:rounded-[2rem] sm:p-6 md:p-10">
              {mode === "brief" && <BriefWizard />}
              {mode === "general" && <SimpleForm variant="general" />}
              {mode === "support" && <SimpleForm variant="support" />}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

/* ---------------- Brief Wizard ---------------- */

function BriefWizard() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<BriefState>(() => {
    if (typeof window === "undefined") return emptyBrief;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) return { ...emptyBrief, ...JSON.parse(raw) };
    } catch {}
    return emptyBrief;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const uid = useId();
  const headingId = `${uid}-step-heading`;
  const summaryRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // Move focus to the new step when navigating, so keyboard/screen-reader
  // users land inside the freshly rendered fields instead of the page top.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepRef.current?.focus();
  }, [step]);

  const totalSteps = 5; // 4 input + 1 review
  const progress = ((step + 1) / totalSteps) * 100;
  const patch = (p: Partial<BriefState>) => setState((s) => ({ ...s, ...p }));

  function validateStep(i: number): boolean {
    if (i >= stepSchemas.length) return true;
    const r = stepSchemas[i].safeParse(state as any);
    if (r.success) {
      setErrors({});
      return true;
    }
    const map: Record<string, string> = {};
    for (const issue of r.error.issues) {
      map[issue.path.join(".")] = issue.message;
    }
    setErrors(map);
    // Announce + focus the error summary so it is never missed.
    requestAnimationFrame(() => summaryRef.current?.focus());
    return false;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }
  function back() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    // final validate every step
    for (let i = 0; i < stepSchemas.length; i++) {
      if (!validateStep(i)) {
        setStep(i);
        return;
      }
    }
    setStatus("sending");
    // Simulated send — replace with server function later
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < totalSteps - 1) next();
    else submit();
  }

  if (status === "sent") {
    return <SuccessCard onReset={() => { setState(emptyBrief); setStep(0); setStatus("idle"); }} name={state.name} />;
  }

  const errorList = Object.entries(errors);
  const stepLabel = `Step ${step + 1} of ${totalSteps}: ${stepTitles[step]}`;

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        Project brief — {stepLabel}
      </h2>

      {/* Progress */}
      <div className="mb-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 text-xs">
        <div className="eyebrow shrink-0 text-[var(--clay)]" aria-hidden="true">
          {step + 1}/{totalSteps}
        </div>
        <div className="truncate text-right text-muted-foreground" aria-hidden="true">
          {stepTitles[step]}
        </div>
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={step + 1}
        aria-valuetext={stepLabel}
        className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-foreground/8"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--clay)] to-[var(--sage,var(--clay))] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Polite announcement of step changes */}
      <p aria-live="polite" className="sr-only">
        {stepLabel}
      </p>

      {/* Error summary */}
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className={cn(
            "mb-6 rounded-2xl border border-red-600/40 bg-red-600/6 p-4 text-sm",
            FOCUS_RING,
          )}
        >
          <div className="flex items-center gap-2 font-medium text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {errorList.length === 1
              ? "1 field needs your attention"
              : `${errorList.length} fields need your attention`}
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-8 text-red-700/90">
            {errorList.map(([k, v]) => (
              <li key={k}>{v}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step content */}
      <div
        ref={stepRef}
        tabIndex={-1}
        role="group"
        aria-labelledby={headingId}
        className={cn("rounded-2xl sm:min-h-[420px]", FOCUS_RING)}
      >
        {step === 0 && <Step1 state={state} patch={patch} errors={errors} />}
        {step === 1 && <Step2 state={state} patch={patch} errors={errors} />}
        {step === 2 && <Step3 state={state} patch={patch} errors={errors} />}
        {step === 3 && <Step4 state={state} patch={patch} errors={errors} />}
        {step === 4 && <Review state={state} onEdit={setStep} />}
      </div>

      {/* Nav */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className={cn(
            "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-foreground/15 px-5 py-3 text-sm font-medium transition-all sm:w-auto",
            FOCUS_RING,
            step === 0 ? "opacity-40" : "hover:border-foreground/40",
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </button>
        {step < totalSteps - 1 ? (
          <GradientButton type="submit" className={cn("min-h-11 w-full sm:w-auto", FOCUS_RING)}>
            Continue
          </GradientButton>
        ) : (
          <GradientButton
            type="submit"
            disabled={status === "sending"}
            className={cn("min-h-11 w-full sm:w-auto", FOCUS_RING)}
          >
            {status === "sending" ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
                />
                Sending…
              </>
            ) : (
              "Send project brief"
            )}
          </GradientButton>
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {status === "sending" ? "Sending your brief…" : ""}
      </p>
    </form>
  );
}

/* ---------------- Field primitives ---------------- */

function FieldError({ msg, id }: { msg?: string; id?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-xs text-red-700">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{msg}</span>
    </p>
  );
}

/* ---------------- Steps ---------------- */

function Step1({
  state,
  patch,
  errors,
}: {
  state: BriefState;
  patch: (p: Partial<BriefState>) => void;
  errors: Record<string, string>;
}) {
  const uid = useId();
  const goalsErrId = `${uid}-goals-error`;
  const typeLabelId = `${uid}-type`;
  const typeErrId = `${uid}-type-error`;
  const listRef = useRef<HTMLDivElement>(null);

  const toggleGoal = (g: string) => {
    const has = state.goals.includes(g);
    patch({ goals: has ? state.goals.filter((x) => x !== g) : [...state.goals, g] });
  };

  const selectedIdx = projectTypeOptions.findIndex((o) => o.id === state.projectType);

  const onTypeKeyDown = (e: React.KeyboardEvent) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const len = projectTypeOptions.length;
    const idx = selectedIdx;
    let n: number;
    if (e.key === "Home") n = 0;
    else if (e.key === "End") n = len - 1;
    else if (e.key === "ArrowRight" || e.key === "ArrowDown") n = idx < 0 ? 0 : (idx + 1) % len;
    else n = idx < 0 ? len - 1 : (idx - 1 + len) % len;
    patch({ projectType: projectTypeOptions[n].id });
    listRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[n]?.focus();
  };

  return (
    <div className="space-y-8">
      <div>
        <span id={typeLabelId} className="eyebrow mb-3 block">
          What are you building?
        </span>
        <div
          ref={listRef}
          role="radiogroup"
          aria-labelledby={typeLabelId}
          aria-invalid={errors.projectType ? true : undefined}
          aria-describedby={errors.projectType ? typeErrId : undefined}
          onKeyDown={onTypeKeyDown}
          className="grid gap-3 sm:grid-cols-2"
        >
          {projectTypeOptions.map((o, i) => {
            const active = state.projectType === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active || (selectedIdx === -1 && i === 0) ? 0 : -1}
                onClick={() => patch({ projectType: o.id })}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                  FOCUS_RING,
                  active
                    ? "border-[var(--clay)] bg-[var(--clay)]/8 shadow-[0_0_0_3px_var(--clay)_inset]"
                    : "border-foreground/12 hover:border-foreground/30",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                    active ? "bg-[var(--clay)] text-white" : "bg-foreground/6 text-foreground/70",
                  )}
                >
                  <o.icon className="h-4 w-4" />
                </span>
                <span className="block">
                  <span className="block font-editorial text-base">{o.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{o.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
        <FieldError msg={errors.projectType} id={typeErrId} />
      </div>

      <div>
        <span id={`${uid}-goals`} className="eyebrow mb-3 block">
          Main goals · pick any
        </span>
        <div
          role="group"
          aria-labelledby={`${uid}-goals`}
          aria-describedby={errors.goals ? goalsErrId : undefined}
          className="flex flex-wrap gap-2"
        >
          {goalOptions.map((g) => {
            const active = state.goals.includes(g);
            return (
              <button
                key={g}
                type="button"
                onClick={() => toggleGoal(g)}
                aria-pressed={active}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                  FOCUS_RING,
                  active
                    ? "border-transparent bg-[var(--ink)] text-[var(--cream)]"
                    : "border-foreground/15 hover:border-foreground/40",
                )}
              >
                {active && <Check className="mr-1 inline h-3 w-3" aria-hidden="true" />}
                {g}
              </button>
            );
          })}
        </div>
        <FieldError msg={errors.goals} id={goalsErrId} />
      </div>
    </div>
  );
}

function Step2({
  state,
  patch,
  errors,
}: {
  state: BriefState;
  patch: (p: Partial<BriefState>) => void;
  errors: Record<string, string>;
}) {
  const uid = useId();
  const scopeId = `${uid}-scope`;
  const scopeHintId = `${uid}-scope-hint`;
  const scopeErrId = `${uid}-scope-error`;

  const toggleFeat = (f: string) => {
    const has = state.features.includes(f);
    patch({ features: has ? state.features.filter((x) => x !== f) : [...state.features, f] });
  };

  return (
    <div className="space-y-7">
      <div>
        <label htmlFor={scopeId} className="eyebrow mb-2 block">
          Describe the project <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <textarea
          id={scopeId}
          value={state.scope}
          onChange={(e) => patch({ scope: e.target.value })}
          rows={5}
          maxLength={1500}
          required
          aria-required="true"
          aria-invalid={errors.scope ? true : undefined}
          aria-describedby={cn(scopeHintId, errors.scope ? scopeErrId : undefined)}
          placeholder="What does it do? Who is it for? Any key pages or flows on your mind?"
          className={cn(FIELD_BASE, "rounded-2xl px-4 py-3")}
        />
        <div id={scopeHintId} className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>Aim for 2–4 short paragraphs</span>
          <span>{state.scope.length} of 1500 characters used</span>
        </div>
        <FieldError msg={errors.scope} id={scopeErrId} />
      </div>

      <div>
        <span id={`${uid}-feat`} className="eyebrow mb-2 block">
          Features you'll need
        </span>
        <div role="group" aria-labelledby={`${uid}-feat`} className="flex flex-wrap gap-2">
          {featureOptions.map((f) => {
            const active = state.features.includes(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() => toggleFeat(f)}
                aria-pressed={active}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  FOCUS_RING,
                  active
                    ? "border-transparent bg-[var(--clay)] text-white"
                    : "border-foreground/15 hover:border-foreground/40",
                )}
              >
                {active && <Check className="mr-1 inline h-3 w-3" aria-hidden="true" />}
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Rough page list"
          value={state.pages}
          onChange={(v) => patch({ pages: v })}
          placeholder="Home, About, Services, Contact…"
        />
        <TextField
          label="Reference links / inspiration"
          value={state.references}
          onChange={(v) => patch({ references: v })}
          placeholder="URLs of sites you love"
        />
      </div>
    </div>
  );
}

function ChoiceGrid<T extends string>({
  label,
  value,
  options,
  onChange,
  cols = 2,
  error,
}: {
  label: React.ReactNode;
  value: T | "";
  options: { id: T; title: string; sub?: string }[];
  onChange: (v: T) => void;
  cols?: 2 | 3 | 4;
  error?: string;
}) {
  const colClass =
    cols === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : cols === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2";
  const uid = useId();
  const labelId = `${uid}-label`;
  const errId = `${uid}-error`;
  const listRef = useRef<HTMLDivElement>(null);
  const selectedIdx = options.findIndex((o) => o.id === value);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const len = options.length;
    const idx = selectedIdx;
    let n: number;
    if (e.key === "Home") n = 0;
    else if (e.key === "End") n = len - 1;
    else if (e.key === "ArrowRight" || e.key === "ArrowDown") n = idx < 0 ? 0 : (idx + 1) % len;
    else n = idx < 0 ? len - 1 : (idx - 1 + len) % len;
    onChange(options[n].id);
    listRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[n]?.focus();
  };

  return (
    <div>
      <span id={labelId} className="eyebrow mb-3 block">
        {label}
      </span>
      <div
        ref={listRef}
        role="radiogroup"
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        onKeyDown={onKeyDown}
        className={cn("grid gap-2.5", colClass)}
      >
        {options.map((o, i) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active || (selectedIdx === -1 && i === 0) ? 0 : -1}
              onClick={() => onChange(o.id)}
              className={cn(
                "min-h-11 rounded-2xl border p-3.5 text-left transition-all",
                FOCUS_RING,
                active
                  ? "border-[var(--clay)] bg-[var(--clay)]/10"
                  : "border-foreground/12 hover:border-foreground/30",
              )}
            >
              <span className="block font-editorial text-sm break-words">{o.title}</span>
              {o.sub && <span className="mt-0.5 block text-[11px] text-muted-foreground">{o.sub}</span>}
            </button>
          );
        })}
      </div>
      <FieldError msg={error} id={errId} />
    </div>
  );
}

function Step3({
  state,
  patch,
  errors,
}: {
  state: BriefState;
  patch: (p: Partial<BriefState>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-7">
      <ChoiceGrid
        label={
          <span className="inline-flex items-center gap-1">
            <IndianRupee className="h-3 w-3" aria-hidden="true" /> Budget range
          </span>
        }
        value={state.budget}
        onChange={(v) => patch({ budget: v })}
        options={(Object.keys(budgetLabels) as Budget[]).map((k) => ({ id: k, title: budgetLabels[k] }))}
        cols={3}
        error={errors.budget}
      />
      <ChoiceGrid
        label={
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" /> Timeline
          </span>
        }
        value={state.timeline}
        onChange={(v) => patch({ timeline: v })}
        options={(Object.keys(timelineLabels) as Timeline[]).map((k) => ({ id: k, title: timelineLabels[k] }))}
        cols={4}
        error={errors.timeline}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <ChoiceGrid
          label="Do you have branding ready?"
          value={state.hasBrand}
          onChange={(v) => patch({ hasBrand: v })}
          options={[
            { id: "yes", title: "Yes", sub: "Logo, colors, fonts" },
            { id: "partial", title: "Partial", sub: "Some pieces" },
            { id: "no", title: "No", sub: "Need help" },
          ]}
          cols={3}
          error={errors.hasBrand}
        />
        <ChoiceGrid
          label="Do you have content ready?"
          value={state.hasContent}
          onChange={(v) => patch({ hasContent: v })}
          options={[
            { id: "yes", title: "Yes", sub: "Text & images" },
            { id: "partial", title: "Partial", sub: "Some ready" },
            { id: "no", title: "No", sub: "Need help" },
          ]}
          cols={3}
          error={errors.hasContent}
        />
      </div>
    </div>
  );
}

function Step4({
  state,
  patch,
  errors,
}: {
  state: BriefState;
  patch: (p: Partial<BriefState>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          icon={<UserIcon className="h-3.5 w-3.5" aria-hidden="true" />}
          label="Your name"
          required
          autoComplete="name"
          value={state.name}
          onChange={(v) => patch({ name: v })}
          error={errors.name}
        />
        <TextField
          icon={<Mail className="h-3.5 w-3.5" aria-hidden="true" />}
          label="Email"
          required
          type="email"
          autoComplete="email"
          value={state.email}
          onChange={(v) => patch({ email: v })}
          error={errors.email}
        />
        <TextField
          icon={<Building2 className="h-3.5 w-3.5" aria-hidden="true" />}
          label="Company / brand"
          autoComplete="organization"
          value={state.company}
          onChange={(v) => patch({ company: v })}
          error={errors.company}
        />
        <TextField
          icon={<LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />}
          label="Phone / WhatsApp"
          type="tel"
          autoComplete="tel"
          value={state.phone}
          onChange={(v) => patch({ phone: v })}
          error={errors.phone}
        />
      </div>
      <ChoiceGrid
        label="Preferred way to reply"
        value={state.preferred}
        onChange={(v) => patch({ preferred: v })}
        options={[
          { id: "email", title: "Email" },
          { id: "whatsapp", title: "WhatsApp" },
          { id: "call", title: "Quick call" },
        ]}
        cols={3}
      />
    </div>
  );
}

function TextField({
  icon,
  label,
  value,
  onChange,
  type = "text",
  error,
  required,
  placeholder,
  autoComplete,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  const uid = useId();
  const inputId = `${uid}-input`;
  const errId = `${uid}-error`;
  return (
    <div>
      <label htmlFor={inputId} className="eyebrow mb-2 flex items-center gap-1.5">
        {icon} {label}
        {required && (
          <>
            <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </>
        )}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(FIELD_BASE, "min-h-11 rounded-full px-5 py-3")}
      />
      <FieldError msg={error} id={errId} />
    </div>
  );
}

function Review({ state, onEdit }: { state: BriefState; onEdit: (s: number) => void }) {
  const rows: { step: number; label: string; value: string }[] = [
    {
      step: 0,
      label: "Project type",
      value: projectTypeOptions.find((p) => p.id === state.projectType)?.title || "—",
    },
    { step: 0, label: "Goals", value: state.goals.join(", ") || "—" },
    { step: 1, label: "Scope", value: state.scope || "—" },
    { step: 1, label: "Features", value: state.features.join(", ") || "—" },
    { step: 1, label: "Pages", value: state.pages || "—" },
    { step: 1, label: "References", value: state.references || "—" },
    { step: 2, label: "Budget", value: state.budget ? budgetLabels[state.budget as Budget] : "—" },
    { step: 2, label: "Timeline", value: state.timeline ? timelineLabels[state.timeline as Timeline] : "—" },
    { step: 2, label: "Brand ready", value: state.hasBrand || "—" },
    { step: 2, label: "Content ready", value: state.hasContent || "—" },
    { step: 3, label: "Name", value: state.name || "—" },
    { step: 3, label: "Email", value: state.email || "—" },
    { step: 3, label: "Company", value: state.company || "—" },
    { step: 3, label: "Phone", value: state.phone || "—" },
    { step: 3, label: "Prefers", value: state.preferred },
  ];
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-editorial text-xl sm:text-2xl">Review your brief</h3>
        <Eyebrow>Almost there</Eyebrow>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Double-check the details. Select any row to edit that step.
      </p>
      <ul className="divide-y divide-foreground/10 rounded-2xl border border-foreground/10">
        {rows.map((r, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => onEdit(r.step)}
              aria-label={`Edit ${r.label}. Current value: ${r.value === "—" ? "empty" : r.value}`}
              className={cn(
                "grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 rounded-2xl p-4 text-left transition-colors hover:bg-foreground/4 sm:grid-cols-[130px_minmax(0,1fr)_auto]",
                FOCUS_RING,
              )}
            >
              <span className="eyebrow min-w-0 text-[10px] text-muted-foreground">{r.label}</span>
              <span aria-hidden="true" className="text-[10px] text-[var(--clay)] underline underline-offset-2 sm:order-3">
                Edit
              </span>
              <span className="col-span-2 min-w-0 break-words whitespace-pre-wrap text-sm sm:order-2 sm:col-span-1">
                {r.value}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SuccessCard({ name, onReset }: { name: string; onReset: () => void }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div className="py-8 text-center" role="status" aria-live="polite">
      <div
        aria-hidden="true"
        className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--clay)]/15 text-[var(--clay)]"
      >
        <Check className="h-8 w-8" />
      </div>
      <h3 ref={ref} tabIndex={-1} className={cn("mt-6 rounded-lg font-editorial text-3xl", FOCUS_RING)}>
        Brief received{name ? `, ${name.split(" ")[0]}` : ""}!
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        Thank you — I've got everything. Expect a reply with a plan, timeline, and a fair quote within 24 hours.
      </p>
      <button
        type="button"
        onClick={onReset}
        className={cn(
          "mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-xs font-medium hover:border-foreground/40",
          FOCUS_RING,
        )}
      >
        Send another brief
      </button>
    </div>
  );
}

/* ---------------- Simple side forms ---------------- */

const simpleSchema = z.object({
  name: z.string().trim().min(2, "Your name please").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  message: z.string().trim().min(10, "A little more detail please").max(1200),
});

function SimpleForm({ variant }: { variant: "general" | "support" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [extra, setExtra] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const uid = useId();
  const msgId = `${uid}-message`;
  const msgErrId = `${uid}-message-error`;
  const msgCountId = `${uid}-message-count`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = simpleSchema.safeParse({ name, email, message });
    if (!r.success) {
      const map: Record<string, string> = {};
      for (const i of r.error.issues) map[i.path.join(".")] = i.message;
      setErrors(map);
      return;
    }
    setErrors({});
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <SuccessCard
        name={name}
        onReset={() => {
          setName("");
          setEmail("");
          setExtra("");
          setMessage("");
          setStatus("idle");
        }}
      />
    );
  }

  const heading = variant === "general" ? "Quick question" : "Template support";

  return (
    <form onSubmit={submit} noValidate aria-labelledby={`${uid}-heading`} className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 id={`${uid}-heading`} className="font-editorial text-2xl">
          {heading}
        </h3>
        <Eyebrow>Fast reply</Eyebrow>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Your name" required autoComplete="name" value={name} onChange={setName} error={errors.name} />
        <TextField
          label="Email"
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />
      </div>
      {variant === "support" && (
        <TextField label="Template name" value={extra} onChange={setExtra} error={errors.extra} />
      )}
      <div>
        <label htmlFor={msgId} className="eyebrow mb-2 block">
          {variant === "general" ? "Your message" : "Describe the issue"} <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <textarea
          id={msgId}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          maxLength={1200}
          required
          aria-required="true"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={cn(msgCountId, errors.message ? msgErrId : undefined)}
          className={cn(FIELD_BASE, "rounded-2xl px-4 py-3")}
        />
        <div id={msgCountId} className="mt-1 text-right text-[10px] text-muted-foreground">
          {message.length} of 1200 characters used
        </div>
        <FieldError msg={errors.message} id={msgErrId} />
      </div>
      <GradientButton type="submit" disabled={status === "sending"} className={cn("min-h-11 w-full", FOCUS_RING)}>
        {status === "sending" ? (
          <>
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
            />
            Sending…
          </>
        ) : (
          <>
            Send <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </GradientButton>
      <p aria-live="polite" className="sr-only">
        {status === "sending" ? "Sending your message…" : ""}
      </p>
    </form>
  );
}
