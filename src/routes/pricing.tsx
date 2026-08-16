import { createFileRoute } from "@tanstack/react-router";
import { Container, Eyebrow, GradientButton, Blobs } from "@/components/site-chrome";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — SiteReadyPro" },
      { name: "description", content: "Honest, editorial pricing for templates. Free, Pro and Enterprise plans built for students, indie devs, and agencies." },
      { property: "og:title", content: "Pricing — SiteReadyPro" },
      { property: "og:description", content: "Free, Pro and Enterprise plans for pastel website templates. Transparent pricing, no surprises." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Starter",
    price: "₹0",
    cadence: "forever",
    body: "Try a starter template. No card, no strings attached.",
    features: ["1 free template", "Personal use license", "Community support", "Basic docs"],
    highlight: false,
    tint: "band-cream",
  },
  {
    name: "Pro",
    price: "₹1,499",
    cadence: "one-time",
    body: "Everything a solo builder or student needs to ship fast.",
    features: [
      "Unlimited template downloads",
      "Commercial license",
      "Priority email support",
      "New templates every month",
      "Free updates for 1 year",
    ],
    highlight: true,
    tint: "band-blush",
  },
  {
    name: "Studio",
    price: "Custom",
    cadence: "quote",
    body: "For teams and agencies who need scale + custom work.",
    features: [
      "Team license (5+ seats)",
      "Custom template requests",
      "Dedicated Slack channel",
      "White-label option",
      "Priority queue",
    ],
    highlight: false,
    tint: "band-sage",
  },
];

const comparison: { label: string; values: (string | boolean)[] }[] = [
  { label: "Template downloads", values: ["1 starter", "Unlimited", "Unlimited"] },
  { label: "License", values: ["Personal", "Commercial", "Team (5+ seats)"] },
  { label: "Free updates", values: ["—", "1 year", "Lifetime"] },
  { label: "New templates each month", values: [false, true, true] },
  { label: "Figma source files", values: [false, true, true] },
  { label: "Support", values: ["Community", "Priority email", "Dedicated Slack"] },
  { label: "Custom template requests", values: [false, false, true] },
  { label: "White-label / rebrand", values: [false, false, true] },
  { label: "Deployment help", values: [false, "Guide + docs", "Done for you"] },
  { label: "Response time", values: ["Best effort", "Within 24h", "Within 4h"] },
  { label: "Free .com domain (custom builds)", values: [false, true, true] },
  { label: "Maintenance cost", values: ["—", "Free", "Free"] },
];

function PricingPage() {
  return (
    <div>
      <section className="relative overflow-hidden pt-10 pb-14 lg:pt-16">
        <Blobs variant="mix" />
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <Eyebrow>Pricing</Eyebrow>
            <Eyebrow>Simple &amp; honest</Eyebrow>
          </div>
          <h1 className="max-w-5xl font-editorial text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em]">
            Fair pricing.{" "}
            <span className="italic-serif text-[var(--clay)]">No</span>{" "}
            fine print.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            Budget-friendly freelance rates — templates unlocked on your terms, and custom builds that include a free .com
            domain plus free maintenance. No subscriptions, no surprises, no lock-in.
          </p>
        </Container>
      </section>

      <section className="relative overflow-hidden pb-28">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={cn(
                  "relative flex flex-col rounded-[2rem] border p-10 hover-lift",
                  p.tint,
                  p.highlight ? "border-[var(--clay)]/40 lg:-translate-y-4" : "border-foreground/8",
                )}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--ink)] px-4 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--cream)]">
                    Most Popular
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-3xl">{p.name}</h3>
                  <span className="eyebrow">{p.cadence}</span>
                </div>
                <div className="mt-6 font-editorial text-[clamp(2.75rem,7vw,4.5rem)] leading-none italic-serif text-[var(--clay)]">{p.price}</div>
                <p className="mt-5 text-muted-foreground">{p.body}</p>
                <ul className="mt-8 space-y-3 border-t border-foreground/15 pt-6 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)]">
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <GradientButton to="/contact" variant={p.highlight ? "primary" : "ghost"} className="w-full">
                    {p.name === "Starter" ? "Get started" : p.name === "Studio" ? "Get in touch" : "Get Pro"}
                  </GradientButton>
                </div>
              </div>
            ))}
          </div>


          {/* Feature comparison */}
          <div className="mt-20 sm:mt-28">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Side by side</Eyebrow>
                <h2 className="mt-4 max-w-xl font-editorial text-[clamp(2rem,5vw,3.25rem)] leading-[1.02]">
                  What's <span className="italic-serif text-[var(--clay)]">included</span> in each plan.
                </h2>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">
                Every plan ships the same hand-built quality. The difference is licensing, support and how much custom work is on the table.
              </p>
            </div>

            <div className="overflow-x-auto rounded-[2rem] border border-foreground/10 bg-card/60">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <caption className="sr-only">Feature comparison across Starter, Pro and Studio plans</caption>
                <thead>
                  <tr className="border-b border-foreground/10">
                    <th scope="col" className="eyebrow px-6 py-5 font-medium">
                      Feature
                    </th>
                    {plans.map((p) => (
                      <th
                        key={p.name}
                        scope="col"
                        className={cn(
                          "px-6 py-5 font-editorial text-xl font-normal",
                          p.highlight && "text-[var(--clay)]",
                        )}
                      >
                        {p.name}
                        <span className="mt-1 block text-[11px] font-normal tracking-wide text-muted-foreground font-sans">
                          {p.price} · {p.cadence}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.label} className="border-b border-foreground/8 last:border-0">
                      <th scope="row" className="px-6 py-4 font-medium">
                        {row.label}
                      </th>
                      {row.values.map((v, i) => (
                        <td key={i} className="px-6 py-4 align-middle text-muted-foreground">
                          <Cell value={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA → contact brief wizard */}
          <div className="mt-20 sm:mt-28 overflow-hidden rounded-[2rem] border border-foreground/10 band-ink">
            <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:p-16">
              <div>
                <Eyebrow>Next step</Eyebrow>
                <h2 className="mt-5 max-w-xl font-editorial text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.02] !text-[var(--cream)]">
                  Not sure which plan fits?{" "}
                  <span className="italic-serif text-[var(--butter)]">Tell me about the project.</span>
                </h2>
                <p className="mt-6 max-w-lg text-[var(--cream)]/70">
                  The project brief takes about 3 minutes — five short steps covering scope, budget and timeline. You'll get a
                  clear recommendation and a fixed quote back, no sales call required.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <GradientButton to="/contact" className="w-full justify-center">
                  Start the project brief
                </GradientButton>
                <GradientButton to="/templates" variant="ghost" className="w-full justify-center !border-white/25 !text-[var(--cream)] hover:!bg-[var(--cream)] hover:!text-[var(--ink)]">
                  Browse templates instead
                </GradientButton>
                <p className="text-center text-xs text-[var(--cream)]/50">Free · No obligation · Reply within 24 hours</p>
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-8 rounded-[2rem] border border-foreground/8 p-10 md:grid-cols-3 band-butter">
            {[
              { q: "Do I own what I download?", a: "Yes. Pro license gives you full commercial use — modify, resell in your own products (not resold as templates)." },
              { q: "Can I upgrade later?", a: "Absolutely. Anything you paid for Starter/Pro is credited if you move to Studio." },
              { q: "Are the domain and maintenance really free?", a: "Yes. Every custom build includes a .com domain for the first year plus ongoing maintenance — small edits, updates and fixes are never billed extra." },
              { q: "Refunds?", a: "If something's genuinely wrong with a template, email me — I'll fix it or refund it. Simple as that." },
            ].map((f) => (
              <div key={f.q}>
                <h4 className="font-editorial text-xl">{f.q}</h4>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)]">
          <Check className="h-3.5 w-3.5" />
        </span>
        <span className="sr-only">Included</span>
      </>
    );
  if (value === false)
    return (
      <>
        <Minus className="h-4 w-4 opacity-40" aria-hidden />
        <span className="sr-only">Not included</span>
      </>
    );
  return <span>{value}</span>;
}

