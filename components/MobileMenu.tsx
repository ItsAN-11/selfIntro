"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = { href: string; label: string; external?: boolean; accent?: boolean };

/** Menu button + dropdown, shown below the md breakpoint. */
export default function MobileMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const cls = (i: Item) =>
    `flex min-h-12 items-center rounded-lg px-4 text-sm uppercase tracking-[1.5px] no-underline hover:bg-surface2 ${i.accent ? "text-accent" : "text-ink"}`;

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="relative z-[72] inline-flex h-11 w-11 items-center justify-center rounded-full border border-line2 bg-bg text-ink"
      >
        <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <>
          <button type="button" aria-label="Close menu" tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-[70] cursor-default bg-black/40" />
          <nav className="absolute right-0 top-[calc(100%+10px)] z-[71] flex w-60 flex-col rounded-2xl border border-line bg-surface p-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
            {items.map((i) =>
              i.external ? (
                <a key={i.href} href={i.href} target="_blank" rel="noopener" onClick={() => setOpen(false)} className={cls(i)}>
                  {i.label}
                </a>
              ) : (
                <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className={cls(i)}>
                  {i.label}
                </Link>
              ),
            )}
          </nav>
        </>
      )}
    </div>
  );
}
