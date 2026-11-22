"use client";

import Image from "next/image";
import { useState } from "react";
import type { Tenure } from "@/data/tenure";

export default function TenureRow({ j, defaultOpen = false }: { j: Tenure; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <article className="grid gap-x-8 gap-y-4 border-b border-line py-[30px] md:grid-cols-[minmax(70px,120px)_minmax(0,1fr)_minmax(0,220px)]">
      <span className="font-display text-xl font-extrabold">{j.year}</span>
      <div className="flex min-w-0 flex-col gap-2.5">
        <span className="text-[13px] text-muted">
          {j.kind} / {j.org}
        </span>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex items-start gap-3 bg-transparent p-0 text-left font-display text-[clamp(20px,2.4vw,30px)] font-semibold leading-tight text-ink"
        >
          <span aria-hidden className={`mt-2 flex-none text-[13px] text-muted transition-transform duration-[250ms] ${open ? "rotate-90" : ""}`}>
            ▶
          </span>
          <span>
            {j.when}: <span className="italic text-accent">{j.role}</span> / <span className="text-muted">{j.tags}</span>
          </span>
        </button>
        {open && (
          <div className="flex flex-col gap-2.5 pl-[26px]">
            <p className="text-[15px] text-soft">{j.stackLine}</p>
            <p className="max-w-[640px] text-text2">{j.note}</p>
          </div>
        )}
        <span className="text-sm text-muted">{j.place}</span>
      </div>
      <div className={`relative aspect-[3/2] overflow-hidden rounded-[10px] border border-line ${j.logo ? "bg-white" : "bg-surface"}`}>
        <Image
          src={j.photo}
          alt={j.logo ? `${j.org} logo` : `${j.org}`}
          fill
          loading="eager"
          sizes="(min-width: 768px) 220px, 100vw"
          className={j.logo ? "object-contain p-4" : "object-cover"}
        />
        {j.photo2 && <Image src={j.photo2} alt="" fill loading="eager" sizes="(min-width: 768px) 220px, 100vw" className="pair-fade object-cover" />}
      </div>
    </article>
  );
}
