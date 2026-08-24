/**
 * Page navigation UX:
 * 1. TopProgressBar  — thin terracotta progress line at the top of the screen,
 *    visible while TanStack Router is loading the next route.
 * 2. PageTransition  — wraps <Outlet> in a subtle fade+slide-up so each page
 *    feels like it "arrives" instead of just appearing.
 */
import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/* ─── Top Progress Bar ─────────────────────────────────────────── */

export function TopProgressBar() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setWidth(15);
      intervalRef.current = setInterval(() => {
        setWidth((w) => {
          if (w >= 85) return 85;
          return w + (85 - w) * 0.08;
        });
      }, 150);
    } else {
      clearInterval(intervalRef.current!);
      setWidth(100);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 400);
    }
    return () => {
      clearInterval(intervalRef.current!);
      clearTimeout(timerRef.current!);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={width}
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[2.5px]"
    >
      <div className="absolute inset-0 bg-[var(--clay)]/15" />
      <div
        className={cn(
          "absolute inset-y-0 left-0 bg-[var(--clay)] transition-all",
          width === 100 ? "duration-300 ease-out opacity-0" : "duration-150 ease-linear opacity-100",
        )}
        style={{ width: `${width}%` }}
      />
      <div
        className="absolute top-0 h-[2.5px] w-16 rounded-full bg-[var(--clay)] opacity-60 blur-sm transition-all duration-150 ease-linear"
        style={{ left: `calc(${width}% - 4rem)` }}
      />
    </div>
  );
}

/* ─── Page Transition wrapper ──────────────────────────────────── */

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [animKey, setAnimKey] = useState(pathname);
  const [phase, setPhase] = useState<"enter" | "visible">("visible");

  useEffect(() => {
    setAnimKey(pathname);
    setPhase("enter");
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("visible"));
    });
    return () => cancelAnimationFrame(t);
  }, [pathname]);

  return (
    <div
      key={animKey}
      className={cn(
        "transition-all duration-300 ease-out",
        phase === "enter" ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
      )}
    >
      {children}
    </div>
  );
}
