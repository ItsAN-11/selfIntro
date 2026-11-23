"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const HOT = "a, button, input, textarea, label, select, [data-hot]";

/** Pulls the letters of a [data-split] heading toward a point (mouse or finger). */
function pull(s: HTMLElement, x: number, y: number) {
  s.querySelectorAll<HTMLElement>("[data-l]").forEach((l) => {
    const r = l.getBoundingClientRect();
    const h = r.height || 40;
    const dx = x - (r.left + r.width / 2);
    const dy = y - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy);
    const reach = Math.max(70, h * 1.4);
    if (d > reach) {
      l.style.translate = "";
      return;
    }
    const f = 1 - d / reach;
    const lift = Math.min(14, h * 0.18);
    l.style.translate = `${dx * 0.18 * f}px ${dy * 0.18 * f - lift * f}px`;
  });
}

const release = (s: HTMLElement | null) => s?.querySelectorAll<HTMLElement>("[data-l]").forEach((l) => (l.style.translate = ""));

/** Inverting custom cursor; also drives the magnetic letters effect. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = dot.current!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.18, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.18, ease: "power3.out" });
    let split: HTMLElement | null = null;
    let raf = 0;
    let last: PointerEvent | null = null;

    const resetSplit = () => {
      release(split);
      split = null;
    };

    const frame = () => {
      raf = 0;
      const e = last;
      if (!e) return;
      const t = e.target as Element | null;
      const hot = !!t?.closest?.(HOT);
      gsap.to(el, { width: hot ? 84 : 26, height: hot ? 84 : 26, duration: 0.26, ease: "back.out(2)" });

      const s = t?.closest?.("[data-split]") as HTMLElement | null;
      if (split && split !== s) resetSplit();
      if (!s) return;
      split = s;
      pull(s, e.clientX, e.clientY);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      gsap.set(el, { opacity: 1 });
      xTo(e.clientX);
      yTo(e.clientY);
      last = e;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const leave = () => {
      gsap.to(el, { opacity: 0, duration: 0.2 });
      resetSplit();
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Phones: the same magnetic pull, driven by the finger instead of a mouse.
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let split: HTMLElement | null = null;
    let raf = 0;
    let pt: { x: number; y: number } | null = null;

    const frame = () => {
      raf = 0;
      if (!pt) return;
      const t = document.elementFromPoint(pt.x, pt.y);
      const s = t?.closest?.("[data-split]") as HTMLElement | null;
      if (split && split !== s) release(split);
      split = s;
      if (s) pull(s, pt.x, pt.y);
    };
    const touch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      pt = { x: t.clientX, y: t.clientY };
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const end = () => {
      pt = null;
      release(split);
      split = null;
    };

    window.addEventListener("touchstart", touch, { passive: true });
    window.addEventListener("touchmove", touch, { passive: true });
    window.addEventListener("touchend", end, { passive: true });
    window.addEventListener("touchcancel", end, { passive: true });
    return () => {
      window.removeEventListener("touchstart", touch);
      window.removeEventListener("touchmove", touch);
      window.removeEventListener("touchend", end);
      window.removeEventListener("touchcancel", end);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden rounded-full bg-white opacity-0 mix-blend-difference [@media(pointer:fine)]:block"
      style={{ width: 26, height: 26, translate: "-50% -50%" }}
    />
  );
}
