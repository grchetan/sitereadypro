import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Home, RefreshCw, LayoutTemplate, Briefcase, Mail, AlertTriangle, Compass } from "lucide-react";
import { Container, Eyebrow, GradientButton, Blobs } from "@/components/site-chrome";

export function Professional404() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden band-cream py-16 sm:py-24">
      <Blobs variant="blush" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--clay)]/20 bg-[var(--clay)]/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-[var(--clay)]">
            <Compass className="h-3.5 w-3.5" />
            <span>Error 404 · Page Not Found</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 font-editorial text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] tracking-tight text-foreground">
            Lost in the{" "}
            <span className="italic-serif text-[var(--clay)]">craft</span>?
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed">
            The page you are looking for might have been moved, renamed, or does not exist in our catalog. Let&apos;s guide you back to the right place.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <GradientButton to="/">
              <Home className="h-4 w-4 mr-1.5" />
              Return Home
            </GradientButton>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card/60 px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-foreground hover:text-background"
            >
              <LayoutTemplate className="h-4 w-4" />
              Browse Templates
            </Link>
          </div>

          {/* Quick Destination Cards */}
          <div className="mt-14 grid gap-4 sm:grid-cols-3 text-left">
            <Link
              to="/templates"
              className="group rounded-2xl border border-foreground/10 bg-card/70 p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--clay)]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--clay)]/15 text-[var(--clay)]">
                <LayoutTemplate className="h-4 w-4" />
              </span>
              <h4 className="mt-3 font-editorial text-lg text-foreground group-hover:text-[var(--clay)]">
                Templates
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Explore ready-made websites ready to launch today.
              </p>
            </Link>

            <Link
              to="/services"
              className="group rounded-2xl border border-foreground/10 bg-card/70 p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--clay)]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--sage)]/25 text-emerald-700 dark:text-emerald-300">
                <Briefcase className="h-4 w-4" />
              </span>
              <h4 className="mt-3 font-editorial text-lg text-foreground group-hover:text-[var(--clay)]">
                Custom Services
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Tailored bespoke web design with free maintenance.
              </p>
            </Link>

            <Link
              to="/contact"
              className="group rounded-2xl border border-foreground/10 bg-card/70 p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--clay)]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--butter)]/35 text-amber-700 dark:text-amber-300">
                <Mail className="h-4 w-4" />
              </span>
              <h4 className="mt-3 font-editorial text-lg text-foreground group-hover:text-[var(--clay)]">
                Get In Touch
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Send a project brief and receive a quote within 24h.
              </p>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export function Professional500({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden band-cream py-16 sm:py-24">
      <Blobs variant="clay" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Error 500 · Server Hiccup</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 font-editorial text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] tracking-tight text-foreground">
            Something went{" "}
            <span className="italic-serif text-[var(--clay)]">off script</span>.
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed">
            We ran into an unexpected issue while loading this page. Our error monitoring has captured the incident so we can review and resolve it.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--clay)] px-7 py-3.5 text-sm font-semibold text-[var(--primary-foreground)] shadow-[0_8px_25px_-5px_oklch(0.66_0.170_32/0.5)] transition-all hover:opacity-95 active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Try Reloading
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card/60 px-6 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-foreground hover:text-background"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {/* Need assistance footer */}
          <div className="mt-12 rounded-2xl border border-foreground/8 bg-card/50 p-5 text-xs text-muted-foreground">
            <span>Need immediate support? Feel free to reach us directly at </span>
            <a
              href="mailto:sitereadypro@gmail.com?subject=Website%20Error%20Report"
              className="font-medium text-[var(--clay)] underline underline-offset-2 hover:opacity-80"
            >
              sitereadypro@gmail.com
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
