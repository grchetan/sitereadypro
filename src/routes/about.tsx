import { createFileRoute } from "@tanstack/react-router";
import { Container, Eyebrow, GradientButton, Blobs } from "@/components/site-chrome";
import founderPortrait from "@/assets/founder-portrait.jpg";
import textureSilk from "@/assets/texture-silk.jpg";
import { Link } from "@tanstack/react-router";
import { Sparkles, Rocket, Heart, Coffee, ArrowUpRight, Code2, FolderOpen } from "lucide-react";

/** External / internal destinations shown in the "More about my work" section. */
const WORK_LINKS = [
  {
    icon: FolderOpen,
    eyebrow: "Portfolio",
    title: "See the full case studies",
    body: "Real client builds with the brief, the decisions and the numbers behind each launch — restaurants, boutiques, cafés and student portfolios.",
    cta: "Open the portfolio",
    to: "/portfolio" as const,
  },
  {
    icon: Code2,
    eyebrow: "Side project",
    title: "CodeSpark — ready-made code",
    body: "My second project: a growing library of copy-paste, ready-made components and animated effects for developers who want polish without the build time.",
    cta: "Explore templates",
    to: "/templates" as const,
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SiteReadyPro" },
      { name: "description", content: "The story behind SiteReadyPro — one designer-developer helping students, creators and small businesses launch beautiful websites on tight budgets." },
      { property: "og:title", content: "About — SiteReadyPro" },
      { property: "og:description", content: "A one-person studio building affordable, premium websites for students, creators and small businesses." },
      { property: "og:image", content: founderPortrait },
      { name: "twitter:image", content: founderPortrait },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Sparkles, title: "Quality first", body: "Every pixel, every animation — considered. No sloppy shortcuts, ever." },
  { icon: Heart, title: "Real service", body: "You get a real person on the other end. No agency runaround, no ticketing." },
  { icon: Rocket, title: "Ship fast", body: "Most projects launch in under two weeks. Templates in a day." },
  { icon: Coffee, title: "Fair pricing", body: "Built for students, creators and small businesses on tight budgets." },
];

function AboutPage() {
  return (
    <div>
      {/* Hero — magazine cover feel */}
      <section className="relative overflow-hidden pt-10 pb-14 lg:pt-16">
        <Blobs variant="butter" />
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <Eyebrow>About</Eyebrow>
            <Eyebrow>The person behind it</Eyebrow>
          </div>

          <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <h1 className="font-editorial text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em]">
                A tiny studio for people big agencies{" "}
                <span className="italic-serif text-[var(--clay)]">overlook.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg text-muted-foreground">
                I kept meeting the same people — students, indie devs, café owners, boutique founders — who wanted a beautiful website but couldn't justify agency prices or wait months to launch.
              </p>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                So I made two lanes. Instant, affordable templates for anyone in a hurry. Full custom builds for brands who need something one-of-a-kind. Same care, either way.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <GradientButton to="/templates">Browse templates</GradientButton>
                <GradientButton to="/contact" variant="ghost">Say hello</GradientButton>
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-[var(--clay)]/20 via-[var(--butter)]/25 to-[var(--sage)]/20 blur-xl sm:blur-3xl" />
              <div className="overflow-hidden rounded-[2rem] border border-foreground/8 shadow-[var(--shadow-lift)] sm:animate-float">
                <img
                  src={founderPortrait}
                  alt="Portrait of the founder at their desk"
                  loading="lazy"
                  width={1408}
                  height={1600}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="eyebrow">Est. 2025</span>
                <span className="eyebrow">India · Working worldwide</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 band-cream">
        <Container>
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <div>
              <Eyebrow>What I believe</Eyebrow>
              <h2 className="mt-6 font-editorial text-[clamp(2rem,6.5vw,3.75rem)] leading-[0.95] tracking-tight">
                A studio built around{" "}
                <span className="italic-serif text-[var(--clay)]">care.</span>
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((v) => (
                <div key={v.title} className="border-t border-foreground/15 pt-6">
                  <v.icon className="h-5 w-5 text-[var(--clay)]" />
                  <h3 className="mt-4 font-editorial text-2xl">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Editorial quote */}
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <div className="font-editorial text-6xl italic-serif leading-none text-[var(--clay)]">"</div>
              <h2 className="mt-6 font-editorial text-[clamp(1.75rem,5vw,3rem)] leading-tight">
                I don't want to be the biggest studio. I want to be the one your friend recommends when you say, "I need a website but I don't know where to start."
              </h2>
              <p className="mt-8 eyebrow">— The founder's note</p>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] border border-foreground/8">
              <img
                src={textureSilk}
                alt="Soft flowing pastel silk fabrics"
                loading="lazy"
                width={1600}
                height={1008}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* More about my work */}
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 band-blush">
        <Blobs variant="sage" />
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Eyebrow>More about my work</Eyebrow>
              <h2 className="mt-6 max-w-2xl font-editorial text-[clamp(2rem,6.5vw,3.75rem)] leading-[0.95] tracking-tight">
                Two places to see what I{" "}
                <span className="italic-serif text-[var(--clay)]">actually build.</span>
              </h2>
              <p className="mt-6 max-w-xl text-muted-foreground">
                If you want proof before you talk pricing, start with the case studies. If you write code yourself,
                CodeSpark is where I share the effects and components I use on client work.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {WORK_LINKS.map((l) => {
              const inner = (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)]">
                      <l.icon className="h-4 w-4" />
                    </span>
                    <span className="eyebrow">{l.eyebrow}</span>
                  </div>
                  <h3 className="mt-6 font-editorial text-[clamp(1.5rem,4.5vw,2rem)] leading-tight">{l.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-foreground/70">{l.body}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                    {l.cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </>
              );
              const cls =
                "group flex flex-col rounded-[2rem] border border-foreground/8 bg-card/75 p-7 hover-lift sm:p-9";
              return l.to ? (
                <Link key={l.title} to={l.to} className={cls}>
                  {inner}
                </Link>
              ) : (
                <a
                  key={l.title}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cls}
                >
                  {inner}
                </a>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden band-ink py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 sm:grid-cols-4">
            {[
              { n: "50+", l: "Happy clients" },
              { n: "6", l: "Ready templates" },
              { n: "4.9", l: "Average rating" },
              { n: "24h", l: "Avg reply time" },
            ].map((s) => (
              <div key={s.l} className="border-t border-white/20 pt-6">
                <div className="font-editorial text-6xl italic-serif text-[var(--butter)]">{s.n}</div>
                <div className="mt-3 eyebrow !text-[var(--cream)]/60">{s.l}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
