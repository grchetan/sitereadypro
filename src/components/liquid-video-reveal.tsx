/**
 * LiquidVideoReveal — cursor-tracked organic "liquid" video reveal for the
 * Selected Work list.
 *
 * How it works (no WebGL, no heavy deps):
 *  - The section renders an accessible list of project links (works with JS off).
 *  - A pointer-events-none overlay holds ONE <video> plus a duplicated,
 *    aria-hidden copy of the same list, both sized to the section and
 *    counter-translated inside an organic blob-shaped, overflow-hidden mask.
 *  - A requestAnimationFrame loop lerps the mask towards the cursor and writes
 *    transforms directly to the DOM, so React never re-renders on mousemove.
 *  - Velocity drives a subtle squash/stretch deformation; a CSS keyframe morphs
 *    the border-radius so the shape never feels like a plain circle.
 *  - Disabled for touch devices and prefers-reduced-motion; on small screens a
 *    plain thumbnail grid is shown instead.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type RevealProject = {
  title: string;
  kicker: string;
  meta: string;
  year: string;
  to: string;
  video: string;
  poster: string;
};

const BLOB = 420;
const LERP = 0.14;

export function LiquidVideoReveal({
  projects,
  className,
}: {
  projects: RevealProject[];
  className?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rowRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  activeRef.current = active;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.innerWidth >= 1024;
    setEnabled(ok);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const section = sectionRef.current;
    const blob = blobRef.current;
    const shape = shapeRef.current;
    const inner = innerRef.current;
    if (!section || !blob || !shape || !inner) return;

    let raf = 0;
    let running = false;
    let inside = false;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let amount = 0; // 0..1 reveal
    let targetAmount = 0;
    let vx = 0;
    let vy = 0;
    let rect = section.getBoundingClientRect();

    const measure = () => {
      rect = section.getBoundingClientRect();
      inner.style.width = `${rect.width}px`;
      inner.style.height = `${rect.height}px`;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);

    const pickRow = (y: number) => {
      const rows = rowRefs.current;
      for (let i = 0; i < rows.length; i++) {
        const el = rows[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const top = r.top - rect.top;
        if (y >= top && y <= top + r.height) return i;
      }
      return null;
    };

    const frame = () => {
      const px = pos.x;
      const py = pos.y;
      pos.x += (target.x - pos.x) * LERP;
      pos.y += (target.y - pos.y) * LERP;
      vx = vx * 0.85 + (pos.x - px) * 0.15;
      vy = vy * 0.85 + (pos.y - py) * 0.15;
      amount += (targetAmount - amount) * 0.1;

      const speed = Math.min(Math.hypot(vx, vy) / 26, 1);
      const angle = Math.atan2(vy, vx);
      const sx = 1 + speed * 0.16;
      const sy = 1 - speed * 0.12;
      const scale = 0.55 + amount * 0.45;

      blob.style.transform = `translate3d(${pos.x - BLOB / 2}px, ${pos.y - BLOB / 2}px, 0)`;
      blob.style.opacity = `${Math.max(0, amount)}`;
      shape.style.transform = `rotate(${angle}rad) scale(${scale * sx}, ${scale * sy}) rotate(${-angle}rad)`;
      inner.style.transform = `translate3d(${BLOB / 2 - pos.x}px, ${BLOB / 2 - pos.y}px, 0)`;

      if (!inside && amount < 0.004) {
        blob.style.opacity = "0";
        running = false;
        videoRef.current?.pause();
        setActive(null);
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.x = x;
      target.y = y;
      const row = pickRow(y);
      if (row === null) {
        targetAmount = 0;
        return;
      }
      if (!inside) {
        inside = true;
        pos.x = x;
        pos.y = y;
      }
      targetAmount = 1;
      if (row !== activeRef.current) setActive(row);
      kick();
    };

    const onEnter = () => measure();
    const onLeave = () => {
      inside = false;
      targetAmount = 0;
    };

    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", measure, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", measure);
    };
  }, [enabled]);

  // play only the active preview
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active === null) {
      v.pause();
      return;
    }
    const next = projects[active];
    if (!next) return;
    if (!v.src.endsWith(next.video)) v.src = next.video;
    v.play().catch(() => {});
  }, [active, projects]);

  return (
    <div ref={sectionRef} className={cn("relative", className)}>
      {/* real, accessible list */}
      <ul className="relative z-10 border-t border-foreground/12">
        {projects.map((p, i) => (
          <li key={p.title} className="border-b border-foreground/12">
            <Link
              to={p.to}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="group flex flex-col gap-2 py-7 outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay)] focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:flex-row sm:items-end sm:justify-between sm:gap-8 lg:py-10"
            >
              <div className="min-w-0">
                <span className="eyebrow">
                  {String(i + 1).padStart(2, "0")} — {p.kicker}
                </span>
                <h3 className="mt-3 font-editorial text-[clamp(2.1rem,7vw,5rem)] uppercase leading-[0.92] tracking-[-0.04em]">
                  {p.title}
                </h3>
              </div>
              <div className="flex shrink-0 items-center gap-5 text-sm text-muted-foreground">
                <span>{p.meta}</span>
                <span className="hidden sm:inline">{p.year}</span>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* mobile / reduced-motion: plain preview cards */}
      {!enabled && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((p) => (
            <Link
              key={p.title}
              to={p.to}
              className="overflow-hidden rounded-[1.5rem] border border-foreground/10"
            >
              <video
                src={p.video}
                poster={p.poster}
                muted
                loop
                playsInline
                autoPlay
                preload="none"
                className="aspect-[16/10] h-full w-full object-cover"
              />
              <div className="flex items-center justify-between px-5 py-4">
                <span className="font-editorial text-xl">{p.title}</span>
                <span className="eyebrow">{p.kicker}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* liquid reveal overlay */}
      {enabled && (
        <div
          ref={blobRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 opacity-0 will-change-transform"
          style={{ width: BLOB, height: BLOB }}
        >
          <div
            ref={shapeRef}
            className="liquid-blob h-full w-full overflow-hidden will-change-transform"
          >
            <div ref={innerRef} className="absolute left-0 top-0 will-change-transform">
              <div className="absolute inset-0 bg-[var(--ink)]">
                <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={projects[active ?? 0]?.poster}
                  className="h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "color-mix(in oklab, var(--ink) 55%, transparent)" }}
                />

              </div>
              {/* duplicated typography, purely decorative */}
              <ul className="absolute inset-0 border-t border-transparent">
                {projects.map((p, i) => (
                  <li key={p.title} className="border-b border-transparent">
                    <div className="flex flex-col gap-2 py-7 sm:flex-row sm:items-end sm:justify-between sm:gap-8 lg:py-10">
                      <div className="min-w-0">
                        <span className="eyebrow text-[var(--cream)]/70">
                          {String(i + 1).padStart(2, "0")} — {p.kicker}
                        </span>
                        <h3 className="mt-3 font-editorial text-[clamp(2.1rem,7vw,5rem)] uppercase leading-[0.92] tracking-[-0.04em] text-[var(--cream)]">
                          {p.title}
                        </h3>
                        <span className="mt-2 block font-mono text-[0.7rem] uppercase tracking-[0.28em] text-[var(--butter)]">
                          {p.meta}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
