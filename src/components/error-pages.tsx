import { Link, useRouter } from "@tanstack/react-router";
import { Home, RefreshCw, LayoutTemplate, Briefcase, Mail, AlertTriangle, Compass, ArrowUpRight } from "lucide-react";
import { Container, Blobs } from "@/components/site-chrome";

export function Professional404() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden band-cream py-12 sm:py-20 lg:py-24">
      <Blobs variant="blush" />

      <Container className="relative z-10 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--clay)]/25 bg-[var(--clay)]/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-[var(--clay)]">
            <Compass className="h-3.5 w-3.5" />
            <span>Error 404 · Page Not Found</span>
          </div>

          {/* Headline */}
          <h1 className="mt-5 font-editorial text-[clamp(2.5rem,7.5vw,5rem)] leading-[0.94] tracking-tight text-foreground">
            Lost in the{" "}
            <span className="italic-serif text-[var(--clay)]">craft</span>?
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-5 max-w-lg text-sm sm:text-base text-muted-foreground leading-relaxed">
            The page you are looking for might have been moved, renamed, or does not exist. Let&apos;s guide you back to the right place.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {/* Primary Return Home Button */}
            <Link
              to="/"
              className="group w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--clay)] px-7 py-3 text-sm font-medium text-[var(--primary-foreground)] shadow-[0_10px_30px_-8px_oklch(0.66_0.170_32/0.45)] transition-all duration-300 hover:shadow-[0_18px_40px_-10px_oklch(0.66_0.170_32/0.6)] hover:-translate-y-0.5 active:scale-95"
            >
              <Home className="h-4 w-4 shrink-0" />
              <span>Return Home</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Secondary Browse Templates Button */}
            <Link
              to="/templates"
              className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-foreground/15 bg-card/80 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-foreground hover:text-background hover:-translate-y-0.5 active:scale-95"
            >
              <LayoutTemplate className="h-4 w-4 shrink-0" />
              <span>Browse Templates</span>
            </Link>
          </div>

          {/* Quick Destination Cards */}
          <div className="mt-12 sm:mt-14 grid gap-3.5 sm:gap-4 sm:grid-cols-3 text-left">
            <Link
              to="/templates"
              className="group rounded-2xl border border-foreground/10 bg-card/75 p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--clay)]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--clay)]/15 text-[var(--clay)]">
                <LayoutTemplate className="h-5 w-5" />
              </span>
              <h4 className="mt-3 font-editorial text-lg text-foreground group-hover:text-[var(--clay)] transition-colors">
                Templates
              </h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Explore ready-made websites ready to download and deploy.
              </p>
            </Link>

            <Link
              to="/services"
              className="group rounded-2xl border border-foreground/10 bg-card/75 p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--clay)]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--sage)]/25 text-emerald-700 dark:text-emerald-300">
                <Briefcase className="h-5 w-5" />
              </span>
              <h4 className="mt-3 font-editorial text-lg text-foreground group-hover:text-[var(--clay)] transition-colors">
                Custom Services
              </h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Bespoke design and build with free .com domain & maintenance.
              </p>
            </Link>

            <Link
              to="/contact"
              className="group rounded-2xl border border-foreground/10 bg-card/75 p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--clay)]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--butter)]/35 text-amber-700 dark:text-amber-300">
                <Mail className="h-5 w-5" />
              </span>
              <h4 className="mt-3 font-editorial text-lg text-foreground group-hover:text-[var(--clay)] transition-colors">
                Get In Touch
              </h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Send a 3-minute brief and get a fixed quote in 24 hours.
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
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden band-cream py-12 sm:py-20 lg:py-24">
      <Blobs variant="clay" />

      <Container className="relative z-10 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Error 500 · Server Hiccup</span>
          </div>

          {/* Headline */}
          <h1 className="mt-5 font-editorial text-[clamp(2.5rem,7.5vw,5rem)] leading-[0.94] tracking-tight text-foreground">
            Something went{" "}
            <span className="italic-serif text-[var(--clay)]">off script</span>.
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-5 max-w-lg text-sm sm:text-base text-muted-foreground leading-relaxed">
            We ran into an unexpected issue while loading this page. Our error monitoring has logged the event so we can investigate and fix it.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="group w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--clay)] px-7 py-3 text-sm font-medium text-[var(--primary-foreground)] shadow-[0_10px_30px_-8px_oklch(0.66_0.170_32/0.45)] transition-all duration-300 hover:shadow-[0_18px_40px_-10px_oklch(0.66_0.170_32/0.6)] hover:-translate-y-0.5 active:scale-95"
            >
              <RefreshCw className="h-4 w-4 shrink-0 transition-transform group-hover:rotate-180 duration-500" />
              <span>Try Reloading</span>
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-foreground/15 bg-card/80 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-foreground hover:text-background hover:-translate-y-0.5 active:scale-95"
            >
              <Home className="h-4 w-4 shrink-0" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Need assistance footer */}
          <div className="mt-10 sm:mt-12 rounded-2xl border border-foreground/8 bg-card/60 p-4 sm:p-5 text-xs text-muted-foreground backdrop-blur-sm">
            <span>Need immediate support? Feel free to reach us directly at </span>
            <a
              href="mailto:sitereadypro@gmail.com?subject=Website%20Error%20Report"
              className="font-medium text-[var(--clay)] underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              sitereadypro@gmail.com
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
