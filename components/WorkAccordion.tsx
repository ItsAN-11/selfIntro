"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";

/** Project titles only; tapping one opens its summary and tags. */
export default function WorkAccordion({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="border-t border-line">
      {projects.map((p, i) => {
        const isOpen = open === p.id;
        return (
          <div key={p.id} className="border-b border-line">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`work-${p.id}`}
              onClick={() => setOpen(isOpen ? null : p.id)}
              className="group flex w-full items-center gap-4 bg-transparent py-5 text-left md:gap-6 md:py-7"
            >
              <span className="w-7 flex-none font-display text-sm text-muted md:w-10 md:text-base">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[2px] text-muted md:text-xs">{p.org}</span>
                <span className="font-display text-[22px] font-bold leading-[1.15] text-ink transition-colors group-hover:text-accent md:text-[34px]">
                  {p.title}
                </span>
              </span>
              <span
                aria-hidden
                className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border text-lg transition-all duration-300 md:h-11 md:w-11 ${
                  isOpen ? "rotate-45 border-accent bg-accent text-on-accent" : "border-line2 text-ink group-hover:border-accent"
                }`}
              >
                +
              </span>
            </button>
            <div
              id={`work-${p.id}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-3 pb-6 pl-11 md:max-w-[760px] md:pb-8 md:pl-16">
                  <p className="text-[14px] leading-relaxed text-soft md:text-base">{p.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.homeTags.map((t) => (
                      <span key={t} className="rounded-full border border-line2 px-2 py-0.5 text-[11px] text-text2 md:px-2.5 md:py-1 md:text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
