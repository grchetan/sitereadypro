import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { templates } from "@/data/templates";
import { Container, Eyebrow, Blobs } from "@/components/site-chrome";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — SiteReadyPro" },
      { name: "description", content: "A curated library of editorial pastel HTML/CSS website templates. Portfolio, restaurant, e-commerce, café, agency and SaaS — ready to launch." },
      { property: "og:title", content: "Templates — SiteReadyPro" },
      { property: "og:description", content: "Editorial pastel website templates — preview live, download and launch the same day." },
    ],
  }),
  component: TemplatesPage,
});

const filters = ["All", "Portfolio", "Restaurant", "E-commerce", "Agency", "Café", "SaaS"];

function TemplatesPage() {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? templates : templates.filter((t) => t.category === active);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16">
        <Blobs variant="clay" />
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <Eyebrow>The Library</Eyebrow>
            <Eyebrow>{templates.length} templates</Eyebrow>
          </div>
          <h1 className="max-w-5xl font-editorial text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em]">
            Ship-ready designs, made{" "}
            <span className="italic-serif text-[var(--clay)]">by hand.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            Editorial HTML/CSS templates crafted for people who want something warm, personal and quick to launch. Preview live, then download.
          </p>
        </Container>
      </section>

      {/* Filter bar */}
      <section className="relative sticky top-[75px] z-30 border-y border-foreground/8 bg-background/85 py-4 backdrop-blur-xl">
        <Container className="flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm transition-all",
                active === f
                  ? "bg-[var(--ink)] text-[var(--cream)]"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {f}
              <span className="ml-2 text-xs opacity-60">
                {f === "All" ? templates.length : templates.filter((t) => t.category === f).length}
              </span>
            </button>
          ))}
        </Container>
      </section>

      {/* Grid */}
      <section className="relative overflow-hidden py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((t, i) => (
              <Link
                key={t.slug}
                to="/templates/$slug"
                params={{ slug: t.slug }}
                className="group animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-foreground/8 bg-card">
                  <img
                    src={t.image}
                    alt={t.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/85 via-[var(--ink)]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="eyebrow !text-[var(--cream)]/70">{t.category}</div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <div className="font-editorial text-2xl text-[var(--cream)]">{t.title}</div>
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--clay)] text-[var(--primary-foreground)]">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-5 top-5 rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-medium">
                    {t.price === 0 ? "Free" : `₹${t.price.toLocaleString("en-IN")}`}
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-editorial text-xl leading-tight">{t.title}</div>
                    <div className="mt-1 eyebrow">{t.category}</div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {t.tagline}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
