"use client";

import type { Project } from "@/data/projects";
import ArchitectureDiagram from "./ArchitectureDiagram";

const PILL: Record<Project["status"], string> = {
  Ongoing: "var(--accent)",
  Live: "#7FC79A",
  "In progress": "#B9A3E3",
};

const h3 = "mb-2 text-xs uppercase tracking-[2px] text-accent";

export default function ProjectRow({ p, no, open, onToggle }: { p: Project; no: number; open: boolean; onToggle: () => void }) {
  return (
    <article className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-8 gap-y-4 bg-transparent py-8 text-left text-ink"
      >
        <span className="flex-[0_0_56px] text-sm tracking-[2px] text-muted">{String(no).padStart(2, "0")}</span>
        <span className="flex min-w-0 flex-[1_1_360px] flex-col gap-1.5">
          <span className="font-display text-[clamp(38px,5vw,64px)] font-bold leading-none">{p.title}</span>
          <span className="text-[15px] text-soft">{p.tagline}</span>
        </span>
        <span className="flex flex-[0_1_220px] flex-col gap-1.5 text-sm text-soft">
          <span>{p.where}</span>
          <span className="text-muted">{p.when}</span>
        </span>
        <span className="flex-none rounded-full border px-3 py-[5px] text-[11px] uppercase tracking-[2px]" style={{ borderColor: PILL[p.status], color: PILL[p.status] }}>
          {p.status}
        </span>
        <span aria-hidden className="inline-flex h-11 flex-[0_0_44px] items-center justify-center rounded-full border border-line2 text-[22px] text-accent">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-8 pb-16 pt-2 md:pl-[88px]">
          <div className="grid items-start gap-x-14 gap-y-8 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
            <div className="flex flex-col gap-7">
              <div>
                <h3 className={h3}>The problem</h3>
                <p className="text-text2">{p.problem}</p>
              </div>
              <div>
                <h3 className={h3}>Impact</h3>
                <p className="text-text2">{p.impact}</p>
              </div>
            </div>
            <div>
              <h3 className={h3}>What I built</h3>
              <ul className="flex list-disc flex-col gap-1.5 pl-5 text-text2">
                {p.built.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>

          <details className="group max-w-[460px] [&_summary::-webkit-details-marker]:hidden">
            <summary className="inline-flex min-h-10 list-none items-center gap-2 rounded-full border border-line2 px-4 text-[13px] tracking-[1px] text-ink">
              View architecture <span aria-hidden className="text-accent transition-transform group-open:rotate-180">↓</span>
            </summary>
            <div className="mt-3.5 rounded-xl border border-line bg-surface px-[18px] py-4">
              {p.id === "ondc" ? (
                <ArchitectureDiagram />
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {p.flow?.map((f, i, all) => (
                    <span key={f} className="inline-flex items-center gap-2">
                      <span className="rounded-lg border border-line2 bg-surface2 px-3 py-2 text-[13px] font-semibold">{f}</span>
                      {i < all.length - 1 && (
                        <span aria-hidden className="text-accent">
                          →
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </details>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="mr-1.5 text-xs uppercase tracking-[2px] text-muted">Stack</span>
            {p.stack.map((s) => (
              <span key={s} className="rounded-full border border-line2 px-3 py-[5px] text-xs text-text2">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
