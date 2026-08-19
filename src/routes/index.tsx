import { createFileRoute, Link } from "@tanstack/react-router";
import { templates } from "@/data/templates";
import { Container, Eyebrow, GradientButton, Blobs, MarqueeBanner } from "@/components/site-chrome";
import { LiquidImage } from "@/components/liquid-image";
import { ServiceIcon } from "@/components/service-icon";
import { useServices } from "@/lib/admin-store";
import heroEditorial from "@/assets/hero-editorial.jpg";
import craftWorkspace from "@/assets/craft-workspace.jpg";
import textureSilk from "@/assets/texture-silk.jpg";
import whyChoose from "@/assets/why-choose.jpg";
import {
  Star,
  ArrowUpRight,
  Sparkles,
  Wallet,
  Globe,
  Wrench,
  Users,
  Check,
  Quote,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SiteReadyPro — A quiet studio for beautiful websites" },
      {
        name: "description",
        content:
          "A one-person studio crafting editorial pastel templates and bespoke websites for students, creators and small businesses. Considered, affordable, warm.",
      },
      { property: "og:title", content: "SiteReadyPro — Templates & Bespoke Web Design" },
      {
        property: "og:description",
        content: "Editorial pastel templates and custom-built websites. One studio. Two ways to launch.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = templates.slice(0, 4);
  const services = useServices();
  const cheapest = services.length ? Math.min(...services.map((s) => s.price)) : 2499;

  return (
    <div>
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden pt-8 pb-24 lg:pt-14 lg:pb-32">
        <Blobs variant="clay" />
        <Container>
          <div className="mb-10 flex items-center justify-between text-xs">
            <Eyebrow>Est. 2025 — India</Eyebrow>
            <Eyebrow>Vol. 01 · Issue 04</Eyebrow>
          </div>

          <div className="grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div className="animate-fade-up">
              <h1 className="font-editorial text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em]">
                Beautiful websites,{" "}
                <span className="italic-serif text-[var(--clay)]">without</span>{" "}
                the agency price tag.
              </h1>
              <p className="mt-8 max-w-lg text-lg text-muted-foreground">
                A tiny freelance studio built for the people big agencies overlook — students, indie creators, café
                owners, boutique founders. Two ways to launch: instant templates, or a custom build made just for you.
              </p>

              {/* cheapest-price call to action */}
              <Link
                to="/services"
                className="group mt-9 inline-flex flex-wrap items-center gap-4 rounded-full border border-foreground/12 bg-card/80 p-2 pl-6 text-sm shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[var(--clay)]" />
                  Complete website from
                  <span className="font-editorial text-2xl italic-serif leading-none text-[var(--clay)]">
                    ₹{cheapest.toLocaleString("en-IN")}
                  </span>
                </span>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  domain + maintenance free
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-4 py-2.5 text-xs font-medium text-[var(--cream)]">
                  See lowest prices
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>

              <div className="mt-8 flex flex-wrap gap-4">
                <GradientButton to="/contact">Get a free quote</GradientButton>
                <GradientButton to="/templates" variant="ghost">
                  Browse templates
                </GradientButton>
              </div>
              <div className="mt-14 flex flex-wrap items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["from-[var(--clay)] to-[var(--blush)]", "from-[var(--sage)] to-[var(--butter)]", "from-[var(--butter)] to-[var(--clay)]", "from-[var(--blush)] to-[var(--sage)]"].map((g, i) => (
                      <div key={i} className={cn("h-9 w-9 rounded-full border-2 border-background bg-gradient-to-br", g)} />
                    ))}
                  </div>
                  <span>50+ launches</span>
                </div>
                <div className="h-6 w-px bg-foreground/15" />
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[var(--clay)] text-[var(--clay)]" />
                  ))}
                  <span>4.9 avg — from real clients</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-[var(--clay)]/20 via-[var(--butter)]/20 to-[var(--sage)]/20 blur-xl sm:blur-3xl" />
              <LiquidImage
                src={heroEditorial}
                alt="A designer's cream marble desk with laptop displaying pastel website designs"
                width={1600}
                height={1408}
                loading="eager"
                className="animate-float aspect-[1600/1408] rounded-[2rem] border border-foreground/8 shadow-[var(--shadow-lift)]"
              />

              <div className="absolute -bottom-6 -left-6 hidden max-w-[220px] rounded-2xl bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] md:block">
                <Sparkles className="h-4 w-4 text-[var(--clay)]" />
                <p className="mt-2 font-editorial text-lg leading-tight">
                  "Felt like an agency, priced like a template."
                </p>
                <p className="mt-2 text-xs text-muted-foreground">— Meera S., Café owner</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================== MARQUEE ==================== */}
      <MarqueeBanner
        items={["Editorial design", "Made with care", "Custom-tailored", "Ready in days", "For real humans"]}
      />

      {/* ==================== TWO LANES ==================== */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
        <Container>
          <div className="grid gap-16 md:grid-cols-[1fr_1.4fr] md:items-end">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-6 font-editorial text-[clamp(2rem,6.5vw,3.75rem)] leading-[0.95] tracking-tight">
                Two lanes.{" "}
                <span className="italic-serif text-[var(--clay)]">One roof.</span>
              </h2>
            </div>
            <p className="text-lg text-muted-foreground">
              Whether you need something by Friday or something one-of-a-kind — the same care, the same eye, the same care for detail goes into both.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              {
                num: "01",
                tag: "Instant",
                title: "Ready-made Templates",
                body: "Editorial HTML/CSS templates you can download and customise the same day. Made for students, indie devs and small businesses on a tight timeline.",
                cta: "Browse the library",
                to: "/templates",
                bg: "band-blush",
                image: textureSilk,
              },
              {
                num: "02",
                tag: "Bespoke",
                title: "Custom Development",
                body: "A brand-tailored website designed and built end to end. Restaurants, cafés, boutiques, portfolios, small stores — anything that needs to look like it's really yours.",
                cta: "Start a project",
                to: "/contact",
                bg: "band-sage",
                image: craftWorkspace,
              },
            ].map((c) => (
              <Link
                key={c.num}
                to={c.to}
                className={cn(
                  "group relative overflow-hidden rounded-[2rem] p-10 hover-lift",
                  c.bg,
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="eyebrow">{c.num} — {c.tag}</div>
                    <h3 className="mt-8 font-editorial text-4xl leading-tight">{c.title}</h3>
                  </div>
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-foreground/15 transition-colors group-hover:border-foreground/40 group-hover:bg-foreground group-hover:text-background">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-foreground/70">
                  {c.body}
                </p>
                <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-foreground/8">
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium">
                  {c.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================== SERVICES (managed from admin panel) ==================== */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 band-sage">
        <Blobs variant="sage" />
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Eyebrow>My services</Eyebrow>
              <h2 className="mt-6 max-w-2xl font-editorial text-[clamp(2rem,6.5vw,3.75rem)] leading-[0.95] tracking-tight">
                Every line of it is built{" "}
                <span className="italic-serif text-[var(--clay)]">by me</span>.
              </h2>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Freelance web design &amp; development — from the first sketch to the live deploy. Every plan includes a{" "}
                <strong className="font-medium text-foreground">free .com domain</strong> and{" "}
                <strong className="font-medium text-foreground">free maintenance</strong>, and the price is fixed before
                the work starts.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-[var(--clay)]"
            >
              All services &amp; plans <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.id}
                to="/services"
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-[2rem] border border-foreground/8 p-8 hover-lift",
                  s.band,
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)]">
                    <ServiceIcon name={s.icon} className="h-5 w-5" />
                  </span>
                  {s.popular && (
                    <span className="rounded-full bg-[var(--ink)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--cream)]">
                      Most popular
                    </span>
                  )}
                </div>
                <h3 className="mt-7 font-editorial text-3xl leading-tight">{s.name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-foreground/70">{s.tagline}</p>

                <ul className="mt-6 space-y-2 text-sm text-foreground/75">
                  {s.deliverables.slice(0, 4).map((d) => (
                    <li key={d} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--clay)]" />
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-foreground/12 pt-6">
                  <div>
                    <div className="eyebrow">Starting at</div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-editorial text-3xl italic-serif text-[var(--clay)]">
                        ₹{s.price.toLocaleString("en-IN")}
                      </span>
                      {s.comparePrice > 0 && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{s.comparePrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">~{s.timeline} delivery</div>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-foreground/15 transition-colors group-hover:bg-foreground group-hover:text-background">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <GradientButton to="/contact">Get a free quote</GradientButton>
            <GradientButton to="/freelance" variant="ghost">
              Why freelance is cheaper
            </GradientButton>
          </div>
        </Container>
      </section>

      {/* ==================== WHY CHOOSE SITEREADYPRO ==================== */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 band-blush">
        <Blobs variant="butter" />
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
            <div className="relative">
              <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-[var(--butter)]/40 via-[var(--blush)]/30 to-[var(--sage)]/40 blur-3xl" />
              <div className="overflow-hidden rounded-[2rem] border border-foreground/8 bg-[var(--cream)] shadow-[var(--shadow-lift)]">
                <img
                  src={whyChoose}
                  alt="Illustration of a freelance web designer building websites, with a free .com domain badge, maintenance shield and savings piggy bank"
                  loading="lazy"
                  width={1200}
                  height={1104}
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-4 hidden rounded-2xl bg-[var(--ink)] px-5 py-4 text-[var(--cream)] shadow-[var(--shadow-soft)] sm:block">
                <div className="font-editorial text-2xl leading-none">₹0</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--cream)]/70">Maintenance cost</div>
              </div>
            </div>

            <div>
              <Eyebrow>Why choose SiteReadyPro</Eyebrow>
              <h2 className="mt-6 font-editorial text-[clamp(2rem,6.5vw,3.75rem)] leading-[0.95] tracking-tight">
                Freelance pricing,{" "}
                <span className="italic-serif text-[var(--clay)]">everything</span>{" "}
                included.
              </h2>
              <p className="mt-7 max-w-lg text-lg text-muted-foreground">
                I work as an independent freelancer, so you skip the agency overheads. Anyone can get a proper website
                made here — a student portfolio, a café menu, a small shop — and it comes with a <strong className="font-medium text-foreground">free .com domain</strong> plus{" "}
                <strong className="font-medium text-foreground">free maintenance</strong>. No hidden renewals, no surprise invoices.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: Wallet,
                    title: "Budget-friendly freelance",
                    body: "Honest, student-friendly rates. You pay a fair one-time price — not an agency retainer.",
                  },
                  {
                    icon: Globe,
                    title: "Free .com domain",
                    body: "Your own yourname.com comes bundled with every website build, set up and connected for you.",
                  },
                  {
                    icon: Wrench,
                    title: "Free maintenance",
                    body: "Small edits, updates, fixes and uptime checks — included, so your site keeps running fine.",
                  },
                  {
                    icon: Users,
                    title: "Websites for anyone",
                    body: "Students, freelancers, shops, restaurants, startups — no project is too small to matter.",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="rounded-[1.5rem] border border-foreground/8 bg-card/70 p-6 hover-lift"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)]">
                      <f.icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-5 font-editorial text-xl leading-tight">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <GradientButton to="/contact">Get your website made</GradientButton>
                <GradientButton to="/pricing" variant="ghost">
                  See pricing
                </GradientButton>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================== FEATURED WORK — ASYMMETRIC ==================== */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 band-cream">
        <Container>
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>Selected Templates</Eyebrow>
              <h2 className="mt-6 font-editorial text-[clamp(2rem,6.5vw,3.75rem)] leading-[0.95] tracking-tight">
                A library, quietly{" "}
                <span className="italic-serif text-[var(--clay)]">obsessed</span>{" "}
                with detail.
              </h2>
            </div>
            <Link to="/templates" className="inline-flex items-center gap-2 text-sm font-medium hover:text-[var(--clay)]">
              View all templates <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-12 md:grid-rows-2">
            {featured.map((t, i) => {
              // magazine-style asymmetric grid
              const spans = [
                "md:col-span-7 md:row-span-2",
                "md:col-span-5",
                "md:col-span-3",
                "md:col-span-2",
              ];
              return (
                <Link
                  key={t.slug}
                  to="/templates/$slug"
                  params={{ slug: t.slug }}
                  className={cn(
                    "group relative overflow-hidden rounded-[1.5rem] border border-foreground/8 bg-card hover-lift",
                    spans[i],
                    i > 1 && "hidden md:block",
                  )}
                >
                  <div className={cn("relative overflow-hidden", i === 0 ? "aspect-[4/5]" : "aspect-[4/3]")}>
                    <img
                      src={t.image}
                      alt={t.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="text-xs uppercase tracking-widest text-[var(--cream)]/70">{t.category}</div>
                      <div className="mt-1 font-editorial text-2xl text-[var(--cream)]">{t.title}</div>
                    </div>
                    <div className="absolute right-5 top-5 rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-medium">
                      {t.price === 0 ? "Free" : `₹${t.price.toLocaleString("en-IN")}`}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-5">
                    <div>
                      <div className="font-editorial text-lg leading-tight">{t.title}</div>
                      <div className="eyebrow mt-1">{t.category}</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 opacity-40 transition-all group-hover:opacity-100 group-hover:text-[var(--clay)]" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* mobile shows remaining */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:hidden">
            {featured.slice(2).map((t) => (
              <Link
                key={t.slug}
                to="/templates/$slug"
                params={{ slug: t.slug }}
                className="group overflow-hidden rounded-[1.5rem] border border-foreground/8 bg-card"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={t.image} alt={t.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="font-editorial text-lg">{t.title}</div>
                  <div className="eyebrow mt-1">{t.category}</div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================== EDITORIAL QUOTE SPLIT ==================== */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-foreground/8">
              <img
                src={craftWorkspace}
                alt="Designer workspace with color swatches, sketchbook and wireframes"
                loading="lazy"
                width={1600}
                height={1200}
                className="w-full object-cover"
              />
            </div>
            <div>
              <Eyebrow>The craft</Eyebrow>
              <h2 className="mt-6 font-editorial text-[clamp(2rem,6.5vw,3.75rem)] leading-[1] tracking-tight">
                Slow, considered work.{" "}
                <span className="italic-serif text-[var(--clay)]">Always.</span>
              </h2>
              <p className="mt-8 text-lg text-muted-foreground">
                Every project — template or custom — starts on paper. Sketches, colour cards, real conversations. Nothing gets shipped that doesn't feel warm, honest and personal.
              </p>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {[
                  { n: "50+", l: "Happy clients" },
                  { n: "24h", l: "Avg reply time" },
                  { n: "4.9", l: "Average rating" },
                  { n: "6", l: "Curated templates" },
                ].map((s) => (
                  <div key={s.l} className="border-t border-foreground/15 pt-4">
                    <div className="font-editorial text-4xl">{s.n}</div>
                    <div className="mt-1 eyebrow">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================== CUSTOMER REVIEWS ==================== */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 band-butter">
        <Blobs variant="blush" />
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Eyebrow>Customer reviews</Eyebrow>
              <h2 className="mt-6 max-w-2xl font-editorial text-[clamp(2rem,6.5vw,3.75rem)] leading-[0.95] tracking-tight">
                Real people, real{" "}
                <span className="italic-serif text-[var(--clay)]">launches</span>, real numbers.
              </h2>
            </div>
            <div className="flex items-center gap-8 rounded-[1.5rem] border border-foreground/10 bg-card/70 px-7 py-5 backdrop-blur">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-editorial text-[2.75rem] leading-none">4.9</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[var(--clay)] text-[var(--clay)]" />
                    ))}
                  </div>
                </div>
                <div className="eyebrow mt-2">Avg rating · 50+ clients</div>
              </div>
              <div className="h-12 w-px bg-foreground/12" />
              <div>
                <div className="font-editorial text-[2.75rem] leading-none">100%</div>
                <div className="eyebrow mt-2">Delivered on time</div>
              </div>
            </div>
          </div>

          {/* Featured review */}
          <div className="mt-14 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
            <figure className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[var(--ink)] p-8 text-[var(--cream)] sm:p-12">
              <Quote className="h-10 w-10 text-[var(--butter)]" />
              <blockquote className="mt-8 font-editorial text-[clamp(1.6rem,3.6vw,2.6rem)] leading-[1.15]">
                “I always assumed a proper website would be out of my budget. Mine was built for{" "}
                <span className="italic-serif text-[var(--butter)]">half of what I expected</span>, the domain came
                free, and new orders now arrive every single week.”
              </blockquote>
              <figcaption className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-white/12 pt-7">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--butter)] font-editorial text-xl text-[var(--ink)]">
                    R
                  </span>
                  <div>
                    <div className="text-sm font-medium">Riya Sharma</div>
                    <div className="text-xs text-[var(--cream)]/60">Bakehouse by Riya · Home bakery, Pune</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--cream)]/70">
                  <span className="rounded-full bg-white/10 px-3 py-1">₹6,499 build</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">3 days</span>
                </div>
              </figcaption>
            </figure>

            <div className="grid gap-6">
              {[
                {
                  name: "Arjun K.",
                  role: "Founder, Threadline Apparel",
                  text: "Clean, fast, exactly on brand. Our conversion rate almost doubled after the redesign — and maintenance still costs me nothing.",
                  tint: "band-sage",
                  stat: "2× conversions",
                },
                {
                  name: "Neha M.",
                  role: "Saffron & Sage, Restaurant",
                  text: "Menu, booking form and Instagram wall — all in one place. Bookings doubled in the very first month.",
                  tint: "band-blush",
                  stat: "2× bookings",
                },
              ].map((r) => (
                <figure key={r.name} className={cn("rounded-[2rem] border border-foreground/8 p-7", r.tint)}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-[var(--clay)] text-[var(--clay)]" />
                      ))}
                    </div>
                    <span className="rounded-full bg-[var(--ink)] px-3 py-1 text-[11px] text-[var(--cream)]">
                      {r.stat}
                    </span>
                  </div>
                  <blockquote className="mt-4 font-editorial text-xl leading-snug">{r.text}</blockquote>
                  <figcaption className="mt-6 border-t border-foreground/10 pt-4">
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.role}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Short review wall */}
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Rohan D.",
                role: "Indie developer",
                text: "Templates saved me two weeks and looked better than anything I'd have built.",
              },
              {
                name: "Sana P.",
                role: "Final-year student",
                text: "My portfolio was ready for ₹4,999 — it was the first thing I showed at my placement interview.",
              },
              {
                name: "Studio Kaya",
                role: "Design agency",
                text: "Editorial case-study spreads, pixel-perfect on mobile. Handover was spotless.",
              },
            ].map((r) => (
              <figure key={r.name} className="rounded-[1.5rem] border border-foreground/8 bg-card/75 p-6 hover-lift">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-[var(--clay)] text-[var(--clay)]" />
                  ))}
                </div>
                <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground/80">{r.text}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--ink)] text-xs text-[var(--cream)]">
                    {r.name.slice(0, 1)}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{r.name}</span>
                    <span className="block text-xs text-muted-foreground">{r.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-center">
            <GradientButton to="/contact">Become the next review</GradientButton>
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm font-medium hover:text-[var(--clay)]">
              See the work <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ==================== BIG CTA — INK ==================== */}
      <section className="relative overflow-hidden band-ink py-16 sm:py-24 lg:py-28">
        <Container>
          <div className="grid gap-14 md:grid-cols-[1fr_1fr] md:items-center">
            <div>
              <span className="eyebrow !text-[var(--butter)]">Let's build</span>
              <h2 className="mt-6 font-editorial text-[clamp(2.25rem,8vw,4.5rem)] leading-[0.95] tracking-tight !text-[var(--cream)]">
                Ready to ship something{" "}
                <span className="italic-serif text-[var(--butter)]">beautiful?</span>
              </h2>
              <p className="mt-6 max-w-md text-lg text-[var(--cream)]/70">
                Grab a template today or send a brief for a custom build. Most inquiries get a reply within 24 hours.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <GradientButton to="/templates">Browse Templates</GradientButton>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full border border-[var(--cream)]/25 px-7 py-3.5 text-sm font-medium text-[var(--cream)] transition-all hover:bg-[var(--cream)] hover:text-[var(--ink)]"
                >
                  Say hello <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {templates.slice(0, 4).map((t, i) => (
                  <div
                    key={t.slug}
                    className={cn(
                      "overflow-hidden rounded-2xl border border-white/10",
                      i === 0 && "translate-y-6",
                      i === 3 && "translate-y-6",
                    )}
                  >
                    <img src={t.image} alt={t.title} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
