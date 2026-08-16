import { type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay)] focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-foreground/8 bg-card/80 p-5 shadow-[0_18px_50px_-30px_oklch(0.22_0.03_30/0.35)] backdrop-blur-sm sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  sub,
  action,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="mt-2 font-editorial text-[clamp(1.9rem,4.5vw,2.75rem)] leading-[1.05] tracking-[-0.02em]">
          {title}
        </h1>
        {sub && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "clay" | "butter" | "ink" | "muted";
}) {
  const tones = {
    neutral: "bg-foreground/6 text-foreground/70",
    clay: "bg-[var(--clay)]/15 text-[var(--clay)]",
    butter: "bg-[var(--butter)]/40 text-foreground/75",
    ink: "bg-[var(--ink)] text-[var(--cream)]",
    muted: "bg-foreground/4 text-muted-foreground",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function AdminButton({
  children,
  variant = "ink",
  onClick,
  type = "button",
  className,
  disabled,
  ariaLabel,
}: {
  children: ReactNode;
  variant?: "ink" | "clay" | "ghost" | "danger";
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const styles = {
    ink: "bg-[var(--ink)] text-[var(--cream)] hover:opacity-90",
    clay: "bg-[var(--clay)] text-[var(--primary-foreground)] hover:opacity-90",
    ghost: "border border-foreground/15 text-foreground hover:bg-foreground/5",
    danger: "border border-red-500/30 text-red-600 hover:bg-red-500/10 dark:text-red-400",
  } as const;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all disabled:opacity-50",
        styles[variant],
        FOCUS_RING,
        className,
      )}
    >
      {children}
    </button>
  );
}

const fieldBase =
  "w-full rounded-2xl border border-foreground/12 bg-background/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors hover:border-foreground/25";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldBase, FOCUS_RING, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} className={cn(fieldBase, "min-h-[96px] resize-y", FOCUS_RING, props.className)} />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldBase, "appearance-none", FOCUS_RING, props.className)} />;
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-background/60 px-4 py-3 text-left text-sm transition-colors hover:border-foreground/25",
        FOCUS_RING,
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-[var(--clay)]" : "bg-foreground/20",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-[var(--ink)]/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.75rem] border border-foreground/10 bg-card p-5 shadow-2xl sm:rounded-[1.75rem] sm:p-7"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-editorial text-2xl leading-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-foreground/12 hover:bg-foreground/5",
              FOCUS_RING,
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-foreground/15 p-10 text-center">
      <div className="font-editorial text-xl">{title}</div>
      {sub && <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}
