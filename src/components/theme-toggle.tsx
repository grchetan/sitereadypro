import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "srp_theme";

type Theme = "light" | "dark";

/** Shared store so every toggle instance (desktop + mobile) stays in sync. */
const listeners = new Set<() => void>();
let current: Theme = "light";

function systemTheme(): Theme {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

function apply(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function emit(theme: Theme) {
  if (theme === current) return;
  current = theme;
  apply(theme);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

let initialised = false;

function initOnce() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;

  current = readStored() ?? systemTheme();
  apply(current);

  // Cross-tab sync: another tab wrote (or cleared) the preference.
  window.addEventListener("storage", (e) => {
    if (e.key !== null && e.key !== STORAGE_KEY) return;
    emit(readStored() ?? systemTheme());
  });

  // System preference fallback, only while the user has no explicit choice.
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", () => {
    if (readStored() === null) emit(systemTheme());
  });
}

export function useTheme() {
  useEffect(initOnce, []);

  const theme = useSyncExternalStore(
    subscribe,
    () => current,
    () => "light" as Theme,
  );

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage may be unavailable (private mode) — theme still applies for this session */
    }
    emit(next);
  }, []);

  const toggle = useCallback(
    () => setTheme(current === "dark" ? "light" : "dark"),
    [setTheme],
  );

  return { theme, setTheme, toggle };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "grid h-11 w-11 place-items-center rounded-full border border-foreground/15 bg-card/70 text-foreground/75 backdrop-blur transition-all duration-500 hover:border-[var(--clay)] hover:text-[var(--clay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Sun className={cn("h-[18px] w-[18px] transition-all duration-500", isDark && "hidden")} />
      <Moon className={cn("h-[18px] w-[18px] transition-all duration-500", !isDark && "hidden")} />
    </button>
  );
}

/** Inline script string: applies the stored theme before paint to avoid a flash. */
export const themeInitScript = `(function(){try{var k=localStorage.getItem('${STORAGE_KEY}');var d=k==='dark'||(!k&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;
