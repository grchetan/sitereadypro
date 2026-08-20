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
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={cn(
        "group relative flex h-10 w-[70px] cursor-pointer items-center justify-between rounded-full border border-foreground/12 bg-card/60 px-1.5 backdrop-blur-md transition-all duration-300 hover:border-[var(--clay)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay)] select-none",
        className,
      )}
    >
      {/* Background track icons */}
      <span className={cn("grid h-5 w-5 place-items-center transition-opacity duration-300", !isDark ? "opacity-0" : "opacity-40 text-foreground")}>
        <Sun className="h-3.5 w-3.5" />
      </span>
      <span className={cn("grid h-5 w-5 place-items-center transition-opacity duration-300", isDark ? "opacity-0" : "opacity-40 text-foreground")}>
        <Moon className="h-3.5 w-3.5" />
      </span>

      {/* Sliding Tactile Thumb */}
      <span
        className={cn(
          "absolute top-[3px] grid h-[32px] w-[32px] place-items-center rounded-full border transition-all duration-300 ease-out shadow-sm",
          isDark
            ? "left-[34px] border-white/15 bg-[#252422] text-[var(--butter)] shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            : "left-[4px] border-neutral-200 bg-white text-[var(--clay)] shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
        )}
      >
        {isDark ? (
          <Moon className="h-4 w-4 fill-current transition-transform duration-300 group-hover:-rotate-12" />
        ) : (
          <Sun className="h-4 w-4 fill-current transition-transform duration-300 group-hover:rotate-45" />
        )}
      </span>
    </button>
  );
}

/** Inline script string: applies the stored theme before paint to avoid a flash. */
export const themeInitScript = `(function(){try{var k=localStorage.getItem('${STORAGE_KEY}');var d=k==='dark'||(!k&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;
