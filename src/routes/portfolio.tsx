import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, Eyebrow, GradientButton, Blobs } from "@/components/site-chrome";
import { Star, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidVideoReveal, type RevealProject } from "@/components/liquid-video-reveal";
import tplRestaurant from "@/assets/tpl-restaurant.jpg";
import tplEcommerce from "@/assets/tpl-ecommerce.jpg";
import tplCafe from "@/assets/tpl-cafe.jpg";
import tplPortfolio from "@/assets/tpl-portfolio.jpg";
import tplSaas from "@/assets/tpl-saas.jpg";
import virarVideo from "@/assets/video/virar-special-preview.mp4.asset.json";
import timevaultVideo from "@/assets/video/timevault-preview.mp4.asset.json";
import fitbridgeVideo from "@/assets/video/fitbridge-preview.mp4.asset.json";
import sitereadyVideo from "@/assets/video/sitereadypro-preview.mp4.asset.json";

const reveals: RevealProject[] = [
  {
    title: "Virar Special",
    kicker: "Restaurant / Ordering",
    meta: "Full stack experience",
    year: "2025",
    to: "/contact",
    video: virarVideo.url,
    poster: tplRestaurant,
  },
  {
    title: "TimeVault",
    kicker: "Watch store / Commerce",
    meta: "Storefront & checkout",
    year: "2025",
    to: "/contact",
    video: timevaultVideo.url,
    poster: tplEcommerce,
  },
  {
    title: "Fit Bridge",
    kicker: "Fitness / Web app",
    meta: "Dashboard & booking",
    year: "2024",
    to: "/contact",
    video: fitbridgeVideo.url,
    poster: tplSaas,
  },
  {
    title: "SiteReadyPro",
    kicker: "Studio / Template library",
    meta: "Design system & build",
    year: "2026",
    to: "/templates",
    video: sitereadyVideo.url,
    poster: tplPortfolio,
  },
];


export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Selected Work — SiteReadyPro" },
      { name: "description", content: "Real client work: restaurants, fashion boutiques, cafés and creators. Editorial case studies with real numbers." },
      { property: "og:title", content: "Selected Work — SiteReadyPro" },
      { property: "og:description", content: "Editorial case studies from restaurants, fashion, cafés and creators." },
    ],
  }),
  component: PortfolioPage,
});

const cases = [
  {
    n: "01",
    client: "Saffron & Sage",
    type: "Restaurant",
    year: "2025",
    metric: "+38% reservations",
    quote: "The site brought a completely new audience to our doors. Bookings jumped in the first month.",
    author: "Neha M., Co-owner",
    image: tplRestaurant,
    tint: "band-blush",
  },
  {
    n: "02",
    client: "Threadline Apparel",
    type: "Fashion / E-commerce",
    year: "2024",
    metric: "1.9× conversion rate",
    quote: "Clean, fast, and exactly on brand. Our conversion rate almost doubled after the redesign.",
    author: "Arjun K., Founder",
    image: tplEcommerce,
    tint: "band-sage",
  },
  {
    n: "03",
    client: "Brew Lane Café",
    type: "Café",
    year: "2024",
    metric: "24k monthly visitors",
    quote: "He got our vibe instantly. The whole process was smooth and the site feels like our shop.",
    author: "Meera S., Owner",
    image: tplCafe,
    tint: "band-butter",
  },
  {
    n: "04",
    client: "Aurora Studio",
    type: "Portfolio",
    year: "2025",
    metric: "3 new retainer clients",
    quote: "My portfolio finally feels premium — I landed my biggest client the week we launched.",
    author: "Ishaan T., Designer",
    image: tplPortfolio,
    tint: "band-cream",
  },
];

function PortfolioPage() {
  return (
    <div>
      <section className="relative overflow-hidden pt-10 pb-14 lg:pt-16">
        <Blobs variant="sage" />
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <Eyebrow>Selected Work</Eyebrow>
            <Eyebrow>2024 — 2025</Eyebrow>
          </div>
          <h1 className="max-w-5xl font-editorial text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em]">
            Real brands.{" "}
            <span className="italic-serif text-[var(--clay)]">Real</span>{" "}
            results.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            A quiet snapshot of recent projects — small businesses, indie creators and boutique brands who wanted a site that punches above its weight.
          </p>
        </Container>
      </section>

      <section className="relative py-10 lg:py-16">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <Eyebrow>Projects — move your cursor</Eyebrow>
            <span className="max-w-xs text-sm text-muted-foreground">
              Hover a project to reveal its live preview through the liquid lens.
            </span>
          </div>
          <LiquidVideoReveal projects={reveals} />
        </Container>
      </section>



      <section className="relative overflow-hidden py-16">
        <Container>
          <div className="space-y-12">
            {cases.map((c, i) => (
              <article
                key={c.client}
                className={cn(
                  "grid gap-10 overflow-hidden rounded-[2rem] border border-foreground/8 p-8 hover-lift lg:grid-cols-2 lg:p-14",
                  c.tint,
                  i % 2 === 1 && "lg:[&>*:first-child]:order-2",
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-foreground/8">
                  <img
                    src={c.image}
                    alt={`${c.client} website preview`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">{c.n} — {c.type}</span>
                    <span className="eyebrow">{c.year}</span>
                  </div>
                  <h2 className="mt-6 font-editorial text-[clamp(2rem,6.5vw,3.75rem)] leading-[0.95] tracking-tight">{c.client}</h2>
                  <div className="mt-4 font-editorial italic-serif text-2xl text-[var(--clay)]">{c.metric}</div>
                  <p className="mt-6 text-lg leading-relaxed text-foreground/75">
                    "{c.quote}"
                  </p>
                  <div className="mt-8 flex items-center justify-between border-t border-foreground/15 pt-6">
                    <div>
                      <div className="text-sm font-medium">{c.author}</div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-[var(--clay)] text-[var(--clay)]" />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-20 flex flex-col items-center gap-6 text-center">
            <Eyebrow>Next project?</Eyebrow>
            <h3 className="max-w-2xl font-editorial text-[clamp(2rem,6vw,3.75rem)] leading-tight">
              Your brand could be{" "}
              <span className="italic-serif text-[var(--clay)]">next</span> in this list.
            </h3>
            <GradientButton to="/contact">Start your project</GradientButton>
          </div>
        </Container>
      </section>
    </div>
  );
}
