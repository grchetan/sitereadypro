import { Link } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { ArrowUpRight, Menu, X, Instagram, Github, Twitter, Linkedin } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1400px] px-5 sm:px-6 lg:px-12", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

/** @deprecated use Eyebrow */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <Eyebrow>{children}</Eyebrow>;
}

type BtnProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: "primary" | "ghost" | "ink";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

export function GradientButton({
  children,
  to,
  href,
  variant = "primary",
  onClick,
  type = "button",
  disabled,
  className,
}: BtnProps) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 whitespace-nowrap";
  const styles =
    variant === "primary"
      ? "bg-[var(--clay)] text-[var(--primary-foreground)] shadow-[0_10px_30px_-8px_oklch(0.66_0.170_32/0.45)] hover:shadow-[0_18px_40px_-10px_oklch(0.66_0.170_32/0.6)] hover:-translate-y-0.5"
      : variant === "ink"
        ? "bg-[var(--ink)] text-[var(--cream)] hover:bg-[oklch(0.28_0.03_30)] hover:-translate-y-0.5"
        : "border border-foreground/20 bg-transparent text-foreground hover:bg-foreground hover:text-background";

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cn(base, styles, className)}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cn(base, styles, className)}>
        {content}
      </a>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, styles, "disabled:opacity-70", className)}
    >
      {content}
    </button>
  );
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/freelance", label: "Freelance" },
  { to: "/templates", label: "Templates" },
  { to: "/portfolio", label: "Work" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 16);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <Container className={cn("relative z-50 transition-all duration-300", scrolled ? "pt-2" : "pt-3 sm:pt-6")}>
        <div
          className={cn(
            "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full border transition-all duration-300 md:grid-cols-[auto_minmax(0,1fr)_auto]",
            scrolled
              ? "border-foreground/10 bg-background/90 px-3 py-2 shadow-[var(--shadow-soft)] backdrop-blur-md"
              : "border-transparent bg-transparent px-1 py-2",
          )}
        >
          {/* Wordmark */}
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="group flex min-w-0 items-baseline gap-1 pl-2 font-editorial text-[22px] leading-none sm:text-[26px]"
          >
            <span className="truncate">SiteReady</span>
            <span className="italic-serif text-[var(--clay)]">Pro</span>
            <span className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--clay)] transition-transform duration-500 group-hover:scale-150" />
          </Link>

          {/* Desktop capsule nav */}
          <nav className="hidden min-w-0 items-center justify-center md:flex">
            <ul className="flex items-center gap-0.5 rounded-full border border-foreground/10 bg-card/60 p-1 backdrop-blur lg:gap-1">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-foreground/75 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    activeProps={{ className: "!bg-foreground !text-background font-semibold" }}
                    activeOptions={{ exact: l.to === "/" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-2 pr-1">
            <ThemeToggle />
            <GradientButton to="/contact" className="hidden sm:inline-flex">
              Start brief
            </GradientButton>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="grid h-11 w-11 place-items-center rounded-full border border-foreground/15 bg-card/70 backdrop-blur transition-colors hover:bg-foreground hover:text-background md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile full-screen editorial menu */}
      {open && (
        <div className="fixed inset-0 top-0 z-40 flex flex-col bg-background pt-24 md:hidden">
          <Container className="flex-1 overflow-y-auto pb-10">
            <span className="eyebrow">Menu</span>
            <ul className="mt-5 divide-y divide-foreground/10 border-y border-foreground/10">
              {navLinks.map((l, i) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between gap-4 py-4 font-editorial text-[clamp(1.75rem,9vw,2.5rem)] leading-none text-foreground/85 transition-colors hover:text-[var(--clay)]"
                    activeProps={{ className: "!text-[var(--clay)]" }}
                    activeOptions={{ exact: l.to === "/" }}
                  >
                    <span className="truncate">{l.label}</span>
                    <span className="shrink-0 text-xs tracking-[0.2em] text-muted-foreground">
                      0{i + 1}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <GradientButton to="/contact" className="w-full justify-center">
                Start a project
              </GradientButton>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Free .com domain, free maintenance and a fixed price agreed before the work begins.
            </p>
          </Container>
        </div>
      )}
    </header>
  );
}


export function Footer() {
  return (
    <footer className="mt-12 border-t border-foreground/8 bg-[var(--ink)] text-[var(--cream)]">
      <Container className="py-20">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="font-editorial text-4xl leading-none">
              SiteReady<span className="italic-serif text-[var(--butter)]">Pro</span>
            </div>
            <p className="mt-5 max-w-sm text-sm text-[var(--cream)]/60">
              A one-person studio building quiet, considered websites for students, creators and small businesses.
            </p>
            <div className="mt-8 flex gap-3">
              {[Instagram, Twitter, Github, Linkedin].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-[var(--cream)]/70 transition-all hover:border-[var(--clay)] hover:bg-[var(--clay)] hover:text-[var(--primary-foreground)]"
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <FooterCol
            title="Studio"
            links={[
              { to: "/portfolio", label: "Work" },
              { to: "/about", label: "About" },
              { to: "/services", label: "Services" },
              { to: "/freelance", label: "Freelance" },
              { to: "/templates", label: "Templates" },
              { to: "/pricing", label: "Pricing" },
            ]}
          />
          <FooterCol
            title="Templates"
            links={[
              { to: "/templates/aurora-portfolio", label: "Aurora — Portfolio" },
              { to: "/templates/atelier-cafe", label: "Atelier — Café" },
              { to: "/templates/solis-boutique", label: "Solis — Store" },
              { to: "/templates/haven-dining", label: "Haven — Dining" },
            ]}
          />
          <FooterCol
            title="Start"
            links={[
              { to: "/contact", label: "Project brief" },
              { to: "/pricing", label: "Compare plans" },
              { to: "/contact", label: "Get a quote" },
            ]}
          />
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-[var(--cream)]/50">
          <div>© {new Date().getFullYear()} SiteReadyPro — made with care in India.</div>
          <div className="eyebrow !text-[var(--cream)]/50">Est. 2025 · Available for work</div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="eyebrow !text-[var(--butter)]">{title}</h4>
      <ul className="mt-5 space-y-3 text-sm text-[var(--cream)]/70">
        {links.map((l, i) => (
          <li key={i}>
            <Link to={l.to} className="transition-colors hover:text-[var(--cream)]">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Floating pastel blob decorations for section backgrounds */
export function Blobs({ variant = "clay" }: { variant?: "clay" | "sage" | "butter" | "blush" | "mix" }) {
  const map = {
    clay: ["oklch(0.66 0.170 32 / 0.35)", "oklch(0.88 0.055 20 / 0.30)"],
    sage: ["oklch(0.78 0.075 145 / 0.35)", "oklch(0.90 0.110 92 / 0.25)"],
    butter: ["oklch(0.90 0.110 92 / 0.35)", "oklch(0.66 0.170 32 / 0.20)"],
    blush: ["oklch(0.88 0.055 20 / 0.35)", "oklch(0.78 0.075 145 / 0.25)"],
    mix: ["oklch(0.66 0.170 32 / 0.28)", "oklch(0.78 0.075 145 / 0.25)"],
  } as const;
  const [a, b] = map[variant];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="blob animate-blob" style={{ background: a, width: 520, height: 520, top: -160, left: -140 }} />
      <div className="blob animate-blob" style={{ background: b, width: 460, height: 460, bottom: -180, right: -120, animationDelay: "-8s" }} />
    </div>
  );
}

export function MarqueeBanner({ items }: { items: string[] }) {
  return (
    <div className="marquee-container group/marquee relative overflow-hidden border-y border-foreground/10 bg-[var(--ink)] py-4 sm:py-5 text-[var(--cream)] select-none">
      {/* Left/Right subtle gradient fade masks (desktop only) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-[var(--ink)] to-transparent sm:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-[var(--ink)] to-transparent sm:block" />

      <div className="flex w-max">
        {/* Track 1 */}
        <div className="marquee-track flex shrink-0 items-center justify-around gap-8 whitespace-nowrap pr-8 sm:gap-14 sm:pr-14">
          {items.map((t, i) => (
            <span
              key={`t1-${i}`}
              className="group/item inline-flex cursor-pointer items-center gap-8 font-editorial text-2xl italic-serif transition-colors duration-200 hover:text-[var(--butter)] sm:gap-14 sm:text-3xl"
            >
              <span>{t}</span>
              <span className="h-2 w-2 rounded-full bg-[var(--butter)] transition-colors duration-200 group-hover/item:bg-[var(--clay)]" />
            </span>
          ))}
        </div>

        {/* Track 2 (Duplicate for 100% seamless loop) */}
        <div className="marquee-track flex shrink-0 items-center justify-around gap-8 whitespace-nowrap pr-8 sm:gap-14 sm:pr-14" aria-hidden="true">
          {items.map((t, i) => (
            <span
              key={`t2-${i}`}
              className="group/item inline-flex cursor-pointer items-center gap-8 font-editorial text-2xl italic-serif transition-colors duration-200 hover:text-[var(--butter)] sm:gap-14 sm:text-3xl"
            >
              <span>{t}</span>
              <span className="h-2 w-2 rounded-full bg-[var(--butter)] transition-colors duration-200 group-hover/item:bg-[var(--clay)]" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
