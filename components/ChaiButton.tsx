"use client";

import { useState } from "react";
import ChaiModal from "./ChaiModal";

/** Floating kulhad with rising steam, bottom-right on every page. */
export default function ChaiButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buy me a chai"
        className="group fixed bottom-3 right-3 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full md:bottom-6 md:right-6 md:h-[72px] md:w-[72px]"
      >
        <span
          aria-hidden
          className="relative block h-[76px] w-[42px] origin-bottom md:h-[104px] md:w-[58px] transition-transform duration-[380ms] ease-[cubic-bezier(.3,1.6,.5,1)] group-hover:-rotate-6 group-hover:scale-[1.4] group-focus-visible:-rotate-6 group-focus-visible:scale-[1.4]"
        >
          <img src="/images/steam.png" alt="" className="steam absolute inset-0 h-full w-full" />
          <img src="/images/kulhad.png" alt="" className="absolute inset-0 h-full w-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)]" />
        </span>
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-[calc(100%+40px)] right-0 whitespace-nowrap rounded-full bg-surface px-3 py-1.5 text-[12px] font-semibold text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          Buy me a chai
        </span>
      </button>
      <ChaiModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
