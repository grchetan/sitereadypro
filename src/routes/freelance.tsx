import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, Eyebrow, GradientButton, Blobs, MarqueeBanner } from "@/components/site-chrome";
import { LiquidImage } from "@/components/liquid-image";
import { ServiceIcon } from "@/components/service-icon";
import { useServices, useAdmin } from "@/lib/admin-store";
import {
  Wallet,
  Globe,
  Wrench,
  MessageCircle,
  Clock,
  UserCheck,
  ArrowUpRight,
  Check,
  Mail,
  Phone,
} from "lucide-react";
import founderPortrait from "@/assets/founder-portrait.jpg";
import whyChoose from "@/assets/why-choose.jpg";
import aboutMe from "@/assets/about-me.jpg";

export const Route = createFileRoute("/freelance")({
  head: () => ({
    meta: [
      { title: "Freelance Web Developer in India — Budget-Friendly Websites" },
      {
        name: "description",
        content:
          "Freelance website design and development for students, small businesses and creators. Honest one-time pricing, free .com domain, free maintenance and direct WhatsApp support.",
      },
      { property: "og:title", content: "Freelance Web Development — SiteReadyPro" },
      {
        property: "og:description",
        content:
          "Work directly with the developer who builds your site. Budget-friendly freelance pricing with a free .com domain and free maintenance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FreelancePage,
});

const perks = [
  {
    icon: Wallet,
    title: "One-time, honest price",
    body: "No retainers, no per-page games. You get a fixed quote before I write a single line of code.",
  },
  {
    icon: UserCheck,
    title: "You talk to the builder",
    body: "No account manager in between. The person you message is the person designing and coding your site.",
  },
  {
    icon: Globe,
    title: "Free .com domain",
    body: "Your own yourname.com for the first year — bought, configured and connected for you.",
  },
  {
    icon: Wrench,
    title: "Free maintenance",
    body: "Text edits, image swaps, price changes, small fixes — included, not billed hourly.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp-first updates",
    body: "Progress screenshots as I build. Ask anything, any day — replies usually within a few hours.",
  },
  {
    icon: Clock,
    title: "Fast, realistic timelines",
    body: "48 hours for a template customisation, 3 days for a static site, up to 3 weeks for a store.",
  },
];

const projectTypes = [
  "Student & fresher portfolios",
  "Café, restaurant & menu sites",
  "Salon, clinic & gym pages",
  "Boutique & small online stores",
  "Freelancer / creator personal sites",
  "Startup & SaaS landing pages",
  "Wedding & event invites",
  "Old website redesign + speed fix",
];

const faqs = [
  {
    q: "How are freelance rates this low?",
    a: "Because there's no office, no sales team and no middle layer. It's one developer with low overheads — so the price you pay goes into the actual work, not the agency's rent.",
  },
  {
    q: "Is the domain and maintenance genuinely free?",
    a: "Yes. Every custom build includes a .com domain for the first year and free maintenance — small edits, fixes and uptime checks. Renewals after year one are at actual cost, no markup.",
  },
  {
    q: "How does payment work?",
    a: "50% to start, 50% on launch. UPI, bank transfer or card. You get an invoice for both halves.",
  },
  {
    q: "Who owns the finished website?",
    a: "You. Code, content, domain and hosting account — everything is transferred in your name at handover.",
  },
];

function FreelancePage() {
  const services = useServices();
  const { settings } = useAdmin();
  const cheapest = services.length ? Math.min(...services.map((s) => s.price)) : 0;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16">
        <Blobs variant="sage" />
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <Eyebrow>Freelance</Eyebrow>
            <Eyebrow>{settings.acceptingProjects ? "Available for work" : "Waitlist only"}</Eyebrow>
          </div>
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <h1 className="font-editorial text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] tracking-[-0.035em]">
                A freelancer, not an{" "}
                <span className="italic-serif text-[var(--clay)]">agency</span>.
              </h1>
              <p className="mt-8 max-w-xl text-lg text-muted-foreground">
                I started SiteReadyPro after watching too many students, freelancers and small shop owners give up on a
                website — either the quotes were absurd or nobody replied to them. So I do it the other way round:
                budget-friendly freelance pricing, plain language, and a real human on WhatsApp.
              </p>
              {cheapest > 0 && (
                <div className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-full border border-foreground/12 bg-card/70 px-5 py-3 text-sm backdrop-blur">
                  <Wallet className="h-4 w-4 text-[var(--clay)]" />
                  Complete websites from{" "}
                  <span className="font-editorial text-xl italic-serif text-[var(--clay)]">
                    ₹{cheapest.toLocaleString("en-IN")}
                  </span>
                  <span className="text-muted-foreground">· domain + maintenance included</span>
                </div>
              )}
              <div className="mt-10 flex flex-wrap gap-4">
                <GradientButton to="/contact">Get a free quote</GradientButton>
                <GradientButton to="/services" variant="ghost">
                  See all plans
                </GradientButton>
              </div>
            </div>
            <LiquidImage
              src={founderPortrait}
              alt="Portrait of the freelance web designer behind SiteReadyPro at his desk"
              width={1200}
              height={1400}
              loading="eager"
              className="animate-float rounded-[2rem] border border-foreground/8 shadow-[var(--shadow-lift)]"
            />
          </div>
        </Container>
      </section>

      <MarqueeBanner
        items={["Freelance pricing", "Free .com domain", "Free maintenance", "Direct WhatsApp", "You own everything"]}
      />

      {/* Why freelance */}
      <section className="relative overflow-hidden py-16 sm:py-24 band-blush">
        <Blobs variant="butter" />
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Why freelance works better for you</Eyebrow>
            <h2 className="mt-6 font-editorial text-[clamp(2rem,6.5vw,3.75rem)] leading-[0.95] tracking-tight">
              Same quality.{" "}
              <span className="italic-serif text-[var(--clay)]">Half</span> the noise.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p) => (
              <div key={p.title} className="rounded-[1.5rem] border border-foreground/8 bg-card/75 p-6 hover-lift">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)]">
                  <p.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-5 font-editorial text-xl leading-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Projects I take */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div>
              <Eyebrow>Projects I take on</Eyebrow>
              <h2 className="mt-6 font-editorial text-[clamp(2rem,6.5vw,3.5rem)] leading-[0.95] tracking-tight">
                No project is{" "}
                <span className="italic-serif text-[var(--clay)]">too small</span> to matter.
              </h2>
              <p className="mt-6 max-w-lg text-muted-foreground">
                One-page portfolio or a full store with payments — the care is the same. If you're not sure which one
                you need, just describe your idea and I'll suggest the cheapest option that actually works.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {projectTypes.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px]">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)]">
                      <Check className="h-3 w-3" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <LiquidImage
              src={aboutMe}
              alt="Freelance web projects laid out on a desk — a café menu site, a portfolio and a small store"
              width={1400}
              height={1100}
              className="rounded-[2rem] border border-foreground/8 shadow-[var(--shadow-soft)]"
            />
          </div>
        </Container>
      </section>

      {/* Plans strip from admin */}
      {services.length > 0 && (
        <section className="relative overflow-hidden py-16 sm:py-24 band-cream">
          <Container>
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <Eyebrow>Freelance rate card</Eyebrow>
                <h2 className="mt-6 font-editorial text-[clamp(2rem,6.5vw,3.5rem)] leading-[0.95] tracking-tight">
                  Everything, {""}
                  <span className="italic-serif text-[var(--clay)]">priced openly</span>.
                </h2>
              </div>
              <Link to="/services" className="inline-flex items-center gap-2 text-sm font-medium hover:text-[var(--clay)]">
                Full plan details <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div key={s.id} className={`rounded-[1.5rem] border border-foreground/8 p-6 hover-lift ${s.band}`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)]">
                      <ServiceIcon name={s.icon} className="h-4 w-4" />
                    </span>
                    {s.popular && <span className="eyebrow">Most popular</span>}
                  </div>
                  <h3 className="mt-5 font-editorial text-2xl leading-tight">{s.name}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{s.tagline}</p>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="font-editorial text-3xl italic-serif text-[var(--clay)]">
                      ₹{s.price.toLocaleString("en-IN")}
                    </span>
                    {s.comparePrice > 0 && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{s.comparePrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">~{s.timeline} · {s.bestFor}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQ */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Eyebrow>Straight answers</Eyebrow>
              <h2 className="mt-6 font-editorial text-[clamp(2rem,6.5vw,3.5rem)] leading-[0.95] tracking-tight">
                The questions everyone{" "}
                <span className="italic-serif text-[var(--clay)]">asks</span>.
              </h2>
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-foreground/8">
                <LiquidImage
                  src={whyChoose}
                  alt="Illustration of a freelancer handing over a finished website with a free domain badge"
                  width={1200}
                  height={1104}
                  className="aspect-[4/3]"
                />
              </div>
            </div>
            <div className="divide-y divide-foreground/10">
              {faqs.map((f) => (
                <details key={f.q} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-editorial text-xl leading-snug">
                    {f.q}
                    <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-foreground/15 text-sm transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden band-ink py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow !text-[var(--butter)]">Freelance, available now</span>
            <h2 className="mt-6 font-editorial text-[clamp(2.25rem,8vw,4.5rem)] leading-[0.95] tracking-tight">
              Tell me your idea and{" "}
              <span className="italic-serif text-[var(--butter)]">budget</span>.
            </h2>
            <p className="mx-auto mt-6 max-w-md text-[var(--cream)]/70">
              I'll reply with the cheapest honest plan that gets you online — usually within 24 hours.
              Pick whichever way you're most comfortable reaching out.
            </p>

            {/* Three contact options */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {/* Full brief form */}
              <Link
                to="/contact"
                className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--cream)]/15 p-5 text-[var(--cream)] transition-all hover:bg-[var(--cream)]/10"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--butter)]/20">
                  <ArrowUpRight className="h-5 w-5 text-[var(--butter)]" />
                </span>
                <span className="font-editorial text-lg">Full brief form</span>
                <span className="text-xs text-[var(--cream)]/60">Most detailed — fills in all your requirements. Get a tailored quote back.</span>
              </Link>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919000000000?text=Hi%20Chetan%2C%20I%20want%20a%20website%20made%20for%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--cream)]/15 p-5 text-[var(--cream)] transition-all hover:bg-[var(--cream)]/10"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-green-500/20">
                  <Phone className="h-5 w-5 text-green-400" />
                </span>
                <span className="font-editorial text-lg">WhatsApp</span>
                <span className="text-xs text-[var(--cream)]/60">Quick message, fast reply. Easiest way to get started right now.</span>
              </a>

              {/* Email */}
              <a
                href="mailto:chetanprajapat340@gmail.com?subject=Website%20Project%20Enquiry&body=Hi%20Chetan%2C%0A%0AI'm%20interested%20in%20getting%20a%20website%20made.%0A%0AProject%20idea%3A%20%0ABudget%3A%20%0ATimeline%3A"
                className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--cream)]/15 p-5 text-[var(--cream)] transition-all hover:bg-[var(--cream)]/10"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--clay)]/30">
                  <Mail className="h-5 w-5 text-[var(--butter)]" />
                </span>
                <span className="font-editorial text-lg">Email directly</span>
                <span className="text-xs text-[var(--cream)]/60">chetanprajapat340@gmail.com — reply within 24 hours guaranteed.</span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
