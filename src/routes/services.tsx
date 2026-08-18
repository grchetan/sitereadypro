import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Container, Eyebrow, GradientButton, Blobs } from "@/components/site-chrome";
import { LiquidImage } from "@/components/liquid-image";
import { ServiceIcon } from "@/components/service-icon";
import {
  Check,
  PenTool,
  Rocket,
  MessageSquare,
  Search,
  Smartphone,
  Wrench,
  Globe,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useServices, useAdmin } from "@/lib/admin-store";
import craftWorkspace from "@/assets/craft-workspace.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Plans — SiteReadyPro Freelance Web Design" },
      {
        name: "description",
        content:
          "Static sites, CMS-powered business websites, e-commerce stores, template customisation and redesigns — freelance pricing from ₹2,499 with a free .com domain and free maintenance.",
      },
      { property: "og:title", content: "Services & Plans — SiteReadyPro" },
      {
        property: "og:description",
        content:
          "See exactly what I build, what each plan includes and how long it takes. Free .com domain and free maintenance on every build.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

const whatIDo = [
  { icon: PenTool, title: "Design", body: "Layout, type and colour built around your brand — not a recycled theme." },
  { icon: Globe, title: "Development", body: "Hand-coded, responsive and fast. Clean code you actually own." },
  { icon: Search, title: "SEO basics", body: "Titles, descriptions, sitemap, speed — so Google can find you." },
  { icon: Smartphone, title: "Mobile-first", body: "Tested on real phone sizes, because that's where your clients are." },
  { icon: ShieldCheck, title: "Domain & hosting", body: "Free .com for the first year, deployed and connected for you." },
  { icon: Wrench, title: "Maintenance", body: "Small edits, fixes and uptime checks — free, not a paid add-on." },
];

const process = [
  { icon: MessageSquare, title: "Brief", body: "A 15-minute call or a WhatsApp chat. I ask the right questions and listen more than I talk." },
  { icon: PenTool, title: "Design", body: "A quiet, considered mock of your homepage. We refine it until every detail lands." },
  { icon: Rocket, title: "Launch", body: "Build, test, connect your domain, hand over. Then free maintenance kicks in." },
];

function ServicesPage() {
  const services = useServices();
  const { settings } = useAdmin();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (active > services.length - 1) setActive(0);
  }, [services.length, active]);

  const s = services[active];
  const cheapest = services.length ? Math.min(...services.map((v) => v.price)) : 0;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-14 lg:pt-16">
        <Blobs variant="butter" />
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <Eyebrow>Services</Eyebrow>
            <Eyebrow>{services.length} live plans</Eyebrow>
          </div>
          <h1 className="max-w-5xl font-editorial text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em]">
            Exactly what I{" "}
            <span className="italic-serif text-[var(--clay)]">do</span>{" "}
            — and what it costs.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            I'm a freelance web designer &amp; developer. No agency, no sales team — you talk to the person who
            builds your site. Every plan ships with a{" "}
            <strong className="font-medium text-foreground">free .com domain</strong> and{" "}
            <strong className="font-medium text-foreground">free maintenance</strong>.
          </p>
          {cheapest > 0 && (
            <div className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-full border border-foreground/12 bg-card/70 px-5 py-3 text-sm backdrop-blur">
              <Clock className="h-4 w-4 text-[var(--clay)]" />
              Plans start at{" "}
              <span className="font-editorial text-xl italic-serif text-[var(--clay)]">
                ₹{cheapest.toLocaleString("en-IN")}
              </span>
              <span className="text-muted-foreground">
                · {settings.acceptingProjects ? "taking new projects now" : "waitlist open"}
              </span>
            </div>
          )}
        </Container>
      </section>

      {/* What I do */}
      <section className="relative overflow-hidden py-14 sm:py-20 band-cream">
        <Container>
          <Eyebrow>What's included in every build</Eyebrow>
          <h2 className="mt-6 max-w-2xl font-editorial text-[clamp(2rem,6.5vw,3.5rem)] leading-[0.95] tracking-tight">
            One person, the{" "}
            <span className="italic-serif text-[var(--clay)]">whole</span> job.
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whatIDo.map((w) => (
              <div key={w.title} className="rounded-[1.5rem] border border-foreground/8 bg-card/70 p-6 hover-lift">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)]">
                  <w.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-5 font-editorial text-xl leading-tight">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Plans (admin-managed) */}
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="mb-10 max-w-2xl">
            <Eyebrow>The plans</Eyebrow>
            <h2 className="mt-6 font-editorial text-[clamp(2rem,6.5vw,3.5rem)] leading-[0.95] tracking-tight">
              Pick the lane that{" "}
              <span className="italic-serif text-[var(--clay)]">fits</span> you.
            </h2>
          </div>

          {services.length === 0 || !s ? (
            <div className="rounded-[1.5rem] border border-dashed border-foreground/15 p-12 text-center text-muted-foreground">
              Plans are being updated — ping me on the contact page for a quote.
            </div>
          ) : (
            <>
              <div className="flex w-full gap-1 overflow-x-auto rounded-full border border-foreground/10 bg-card p-1.5 sm:w-fit">
                {services.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setActive(i)}
                    aria-pressed={active === i}
                    className={cn(
                      "shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all sm:px-6",
                      active === i
                        ? "bg-[var(--ink)] text-[var(--cream)]"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {v.name}
                  </button>
                ))}
              </div>

              <div
                key={s.id}
                className={cn(
                  "mt-10 animate-fade-up rounded-[2rem] border border-foreground/8 p-8 sm:p-10 md:p-14",
                  s.band,
                )}
              >
                <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="eyebrow">{s.bestFor || s.tagline}</span>
                      {s.popular && (
                        <span className="rounded-full bg-[var(--ink)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--cream)]">
                          Most popular
                        </span>
                      )}
                    </div>
                    <div className="mt-6 flex items-baseline gap-4">
                      <ServiceIcon name={s.icon} className="h-8 w-8 text-[var(--clay)]" />
                      <h3 className="font-editorial text-[clamp(2.25rem,7vw,3.5rem)] leading-none tracking-tight">
                        {s.name}
                      </h3>
                    </div>
                    <p className="mt-5 max-w-md text-[15px] text-foreground/70">{s.tagline}</p>
                    <div className="mt-8 flex flex-wrap items-baseline gap-3">
                      <div className="eyebrow">Starting at</div>
                      <div className="font-editorial text-[clamp(2rem,6vw,3rem)] italic-serif text-[var(--clay)]">
                        ₹{s.price.toLocaleString("en-IN")}
                      </div>
                      {s.comparePrice > 0 && (
                        <div className="text-sm text-muted-foreground line-through">
                          ₹{s.comparePrice.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">Delivered in ~{s.timeline}</div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <GradientButton to="/contact">Get a quote</GradientButton>
                      <GradientButton to="/freelance" variant="ghost">
                        How I work
                      </GradientButton>
                    </div>
                  </div>
                  <ul className="space-y-3 border-foreground/15 md:border-l md:pl-8">
                    {s.deliverables.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[15px]">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)]">
                          <Check className="h-3 w-3" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </Container>
      </section>

      {/* Process */}
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 band-cream">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <LiquidImage
              src={craftWorkspace}
              alt="Designer workspace showing sketches, colour swatches and wireframes"
              width={1600}
              height={1200}
              className="rounded-[2rem] border border-foreground/8"
            />
            <div>
              <Eyebrow>The process</Eyebrow>
              <h2 className="mt-6 font-editorial text-[clamp(2rem,6.5vw,3.75rem)] leading-[0.95] tracking-tight">
                Simple, honest,{" "}
                <span className="italic-serif text-[var(--clay)]">unhurried.</span>
              </h2>
              <div className="mt-12 space-y-8">
                {process.map((p, i) => (
                  <div key={p.title} className="grid grid-cols-[auto_1fr] gap-6 border-t border-foreground/15 pt-6">
                    <div className="font-editorial text-3xl italic-serif text-[var(--clay)]">0{i + 1}</div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p.icon className="h-4 w-4 text-[var(--clay)]" />
                        <h3 className="font-editorial text-2xl">{p.title}</h3>
                      </div>
                      <p className="mt-2 text-muted-foreground">{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden band-ink py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow !text-[var(--butter)]">Ready when you are</span>
            <h2 className="mt-6 font-editorial text-[clamp(2.25rem,8vw,4.5rem)] leading-[0.95] tracking-tight !text-[var(--cream)]">
              Let's start with a{" "}
              <span className="italic-serif text-[var(--butter)]">hello</span>.
            </h2>
            <p className="mx-auto mt-6 max-w-md text-[var(--cream)]/70">
              Send a quick brief and I'll reply with a plan and a quote within 24 hours.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <GradientButton to="/contact">Start a project</GradientButton>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
