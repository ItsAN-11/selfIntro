"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import ProjectRow from "./ProjectRow";
import MagneticText from "./MagneticText";

const CHIPS = ["All", "Work", "Freelance"] as const;

export default function ProjectList() {
  const [filter, setFilter] = useState<(typeof CHIPS)[number]>("All");
  const [open, setOpen] = useState<string | null>("ondc");
  const items = projects.filter((p) => filter === "All" || p.kind === filter);

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-8 pb-10">
        <div className="flex flex-wrap gap-2.5">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={`min-h-11 rounded-full border px-5 text-sm font-semibold ${
                filter === c ? "border-accent bg-accent text-on-accent" : "border-line2 text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-8 pb-6">
        <MagneticText as="h2" text="Selected work" className="font-display text-[40px] font-bold" />
      </section>

      <section className="mx-auto max-w-[1200px] px-8">
        <div className="border-t border-line">
          {items.map((p) => (
            <ProjectRow
              key={p.id}
              p={p}
              no={projects.indexOf(p) + 1}
              open={open === p.id}
              onToggle={() => setOpen(open === p.id ? null : p.id)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
