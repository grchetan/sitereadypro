import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Inbox,
  LayoutTemplate,
  FolderKanban,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { Container } from "@/components/site-chrome";
import { AdminButton, Field, Panel, TextInput, FOCUS_RING } from "@/components/admin-ui";
import { useAdmin } from "@/lib/admin-store";
import {
  adminResetPassword,
  adminSignIn,
  adminSignInWithGoogle,
  adminSignOut,
  authErrorMessage,
  useAdminAuthReady,
} from "@/lib/admin-auth";
import { firebaseReady } from "@/lib/firebase";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — SiteReadyPro" },
      {
        name: "description",
        content:
          "SiteReadyPro admin panel — client project requests, template library management, portfolio case studies and site settings in one place.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Panel — SiteReadyPro" },
      {
        property: "og:description",
        content: "Manage client requests, templates, portfolio and pricing settings.",
      },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/requests", label: "Client requests", icon: Inbox, exact: false },
  { to: "/admin/services", label: "Services & plans", icon: Briefcase, exact: false },
  { to: "/admin/templates", label: "Templates", icon: LayoutTemplate, exact: false },
  { to: "/admin/portfolio", label: "Portfolio", icon: FolderKanban, exact: false },
  { to: "/admin/settings", label: "Settings", icon: Settings, exact: false },
] as const;

function AdminLayout() {
  const { session, requests } = useAdmin();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const authReady = useAdminAuthReady();

  if (!authReady) return <AuthSplash />;
  if (!session) return <LoginScreen />;

  const newCount = requests.filter((r) => r.status === "new").length;

  return (
    <div className="min-h-screen band-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-foreground/8 bg-background/85 backdrop-blur-xl">
        <Container className="flex h-[68px] items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close admin menu" : "Open admin menu"}
              aria-expanded={open}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full border border-foreground/12 lg:hidden",
                FOCUS_RING,
              )}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link to="/" className="flex items-baseline gap-1 font-editorial text-[22px] leading-none">
              <span>SiteReady</span>
              <span className="italic-serif text-[var(--clay)]">Pro</span>
            </Link>
            <span className="hidden rounded-full bg-[var(--ink)] px-2.5 py-1 text-[10px] font-medium tracking-[0.14em] text-[var(--cream)] uppercase sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/"
              className={cn(
                "hidden rounded-full border border-foreground/15 px-4 py-2 text-sm hover:bg-foreground/5 sm:inline-flex",
                FOCUS_RING,
              )}
            >
              View site
            </Link>
            <AdminButton variant="ghost" onClick={() => void adminSignOut()}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </AdminButton>
          </div>
        </Container>
      </header>

      <Container className="flex gap-8 py-6 lg:py-10">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-x-0 top-[68px] z-30 border-b border-foreground/8 bg-background p-4 lg:static lg:z-auto lg:block lg:w-[248px] lg:shrink-0 lg:border-0 lg:bg-transparent lg:p-0",
            open ? "block" : "hidden",
          )}
        >
          <div className="lg:sticky lg:top-[96px]">
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-foreground/8 bg-card/70 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--clay)] text-sm font-semibold text-[var(--primary-foreground)]">
                {session.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium capitalize">{session.name}</div>
                <div className="truncate text-xs text-muted-foreground">{session.email}</div>
              </div>
            </div>
            <nav className="space-y-1">
              {nav.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                      active
                        ? "bg-[var(--ink)] text-[var(--cream)]"
                        : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
                      FOCUS_RING,
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.to === "/admin/requests" && newCount > 0 && (
                      <span className="rounded-full bg-[var(--clay)] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary-foreground)]">
                        {newCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <p className="mt-5 rounded-2xl border border-dashed border-foreground/15 p-4 text-xs leading-relaxed text-muted-foreground">
              Sign-in is live via Firebase Authentication. Panel content (requests, templates,
              services) is still stored in this browser.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </Container>
    </div>
  );
}

function AuthSplash() {
  return (
    <div className="grid min-h-screen place-items-center band-cream px-5">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-[var(--clay)]" />
        Checking your session…
      </div>
    </div>
  );
}

function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<"password" | "google" | "reset" | null>(null);

  const run = async (kind: "password" | "google" | "reset", fn: () => Promise<unknown>) => {
    setError("");
    setNotice("");
    setBusy(kind);
    try {
      await fn();
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return setError("Enter your admin email or registered phone number.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    void run("password", () => adminSignIn(identifier, password));
  };

  const reset = () =>
    void run("reset", async () => {
      const to = await adminResetPassword(identifier);
      setNotice(`Password reset link sent to ${to}. Check your inbox.`);
    });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden band-cream px-5 py-16">
      <div className="w-full max-w-md">
        <Panel className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--ink)] text-[var(--cream)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="eyebrow">SiteReadyPro</div>
              <h1 className="font-editorial text-2xl leading-tight">Admin sign in</h1>
            </div>
          </div>

          {!firebaseReady && (
            <p className="mb-4 rounded-2xl bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
              Firebase config missing — add the VITE_FIREBASE_* values to your .env file.
            </p>
          )}

          <form onSubmit={submit} noValidate className="space-y-4">
            <Field label="Email or phone number">
              <TextInput
                type="text"
                value={identifier}
                autoComplete="username"
                placeholder="you@example.com or +91 90000 00000"
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </Field>
            <Field label="Password">
              <TextInput
                type="password"
                value={password}
                autoComplete="current-password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            {error && (
              <p role="alert" className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
                {notice}
              </p>
            )}
            <AdminButton type="submit" variant="clay" className="w-full" disabled={busy !== null}>
              {busy === "password" ? "Signing in…" : "Sign in"}
            </AdminButton>
            <button
              type="button"
              onClick={reset}
              disabled={busy !== null}
              className={cn(
                "w-full rounded-full py-1 text-center text-xs text-muted-foreground hover:text-foreground disabled:opacity-50",
                FOCUS_RING,
              )}
            >
              {busy === "reset" ? "Sending reset link…" : "Forgot password?"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-foreground/10" />
            or
            <span className="h-px flex-1 bg-foreground/10" />
          </div>

          <AdminButton
            variant="ghost"
            className="w-full"
            disabled={busy !== null}
            onClick={() => void run("google", adminSignInWithGoogle)}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.1h6.6c-.1 1.1-.8 2.8-2.4 3.9l3.6 2.8c2.2-2 3.7-5 3.7-8.6z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 5.9-1.1 7.8-2.9l-3.6-2.8c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.9-5l-3.7 2.9C3.3 21.3 7.3 24 12 24z"
              />
              <path fill="#FBBC05" d="M5.1 14.5c-.3-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.4 6.6C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l3.7-2.9z" />
              <path
                fill="#EA4335"
                d="M12 4.7c2.3 0 3.8.9 4.7 1.8l3.2-3.1C17.9 1.5 15.2 0 12 0 7.3 0 3.3 2.7 1.4 6.6l3.7 2.9C6.1 6.8 8.8 4.7 12 4.7z"
              />
            </svg>
            {busy === "google" ? "Opening Google…" : "Continue with Google"}
          </AdminButton>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            Secured by Firebase Authentication. Only allowlisted admin accounts can open this panel.
          </p>
        </Panel>
        <div className="mt-5 text-center">
          <Link to="/" className={cn("text-sm text-muted-foreground hover:text-foreground", FOCUS_RING)}>
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
