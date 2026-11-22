"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useMounted } from "@/lib/useMounted";

// These pages are always dark, so the toggle would do nothing there.
const ALWAYS_DARK = ["/music", "/cinema"];

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const pathname = usePathname();
  const dark = !mounted || resolvedTheme !== "light";
  if (ALWAYS_DARK.some((p) => pathname?.startsWith(p))) return null;

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-4 left-4 z-[60] inline-flex h-10 w-10 items-center md:bottom-5 md:left-5 md:h-12 md:w-12 justify-center rounded-full border border-line2 bg-surface text-ink shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
    >
      {dark ? (
        <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  );
}
