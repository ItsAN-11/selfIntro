"use client";

import { useActionState, useEffect } from "react";
import { sendSongRecommendation, type SendResult } from "@/app/actions";
import { site } from "@/data/site";

const label = "flex flex-col gap-1.5 text-left text-[13px] font-semibold text-[#DCD1BE]";
const input =
  "w-full rounded-[10px] border border-[#4A4038] bg-[#14110F] px-3.5 py-3 text-[15px] font-normal text-[#F1E8D8] outline-none placeholder:text-[#6A5E50] focus:border-[#1ED760]";

export default function RecommendSong({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, action, pending] = useActionState<SendResult | null, FormData>(async (prev, form) => {
    const res = await sendSongRecommendation(prev, form);
    if (!res.ok && res.fallback) {
      const body = `Song: ${form.get("song")}\nArtist: ${form.get("artist")}\nWhy: ${form.get("why") || "—"}\n\n— ${form.get("name") || ""} ${form.get("email") || ""}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Song recommendation: ${form.get("song")}`)}&body=${encodeURIComponent(body)}`;
    }
    return res;
  }, null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Recommend me a song" onClick={onClose} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[420px] rounded-[20px] border border-[#3A322B] bg-[#1C1814] p-7 text-[#F1E8D8] shadow-2xl">
        <p className="text-xs uppercase tracking-[2.5px] text-[#1ED760]">#ShareMusic</p>
        <p className="mt-1 font-display text-[26px] font-bold">Recommend me a song</p>

        {state?.ok ? (
          <div className="mt-5 flex flex-col gap-4">
            <p className="text-[#CFC3B0]">Thank you! It&apos;s in my inbox, and I&apos;ll give it a proper listen.</p>
            <button type="button" onClick={onClose} className="btn-accent justify-center !bg-[#1ED760] !text-[#0E0C0A]">
              Close
            </button>
          </div>
        ) : (
          <form action={action} className="mt-5 flex flex-col gap-3.5">
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            <label className={label}>
              Song
              <input name="song" required className={input} placeholder="e.g. Ranjish Hi Sahi" />
            </label>
            <label className={label}>
              Artist
              <input name="artist" required className={input} placeholder="e.g. Mehdi Hassan" />
            </label>
            <label className={label}>
              <span>
                Why I&apos;ll love it <span className="font-normal text-[#6A5E50]">(optional)</span>
              </span>
              <textarea name="why" rows={2} className={input} />
            </label>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <label className={label}>
                <span>
                  Your name <span className="font-normal text-[#6A5E50]">(optional)</span>
                </span>
                <input name="name" className={input} />
              </label>
              <label className={label}>
                <span>
                  Your email <span className="font-normal text-[#6A5E50]">(optional)</span>
                </span>
                <input name="email" type="email" className={input} placeholder="if you'd like a reply" />
              </label>
            </div>
            <button type="submit" disabled={pending} className="btn-accent mt-1 justify-center !bg-[#1ED760] !text-[#0E0C0A] disabled:opacity-60">
              {pending ? "Sending…" : "Send recommendation"}
            </button>
            {state && !state.ok && !state.fallback && <p className="text-sm text-[#E0745A]">{state.error}</p>}
            <button type="button" onClick={onClose} className="text-sm text-[#CFC3B0] underline underline-offset-4">
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
