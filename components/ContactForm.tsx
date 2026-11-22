"use client";

import { useActionState, useState } from "react";
import { sendMessage, type SendResult } from "@/app/actions";
import { site } from "@/data/site";

const TOPICS = [
  ["work", "Work / a project"],
  ["reco", "Recommend me something"],
  ["suggest", "A suggestion"],
  ["hi", "Just saying hi"],
] as const;
type Topic = (typeof TOPICS)[number][0];

const LABEL: Record<Topic, string> = {
  work: "Tell me about the project",
  reco: "A film, song or ghazal I should check out",
  suggest: "Your suggestion",
  hi: "Message",
};
const HINT: Record<Topic, string> = {
  work: "What are you building, and how can I help?",
  reco: "e.g. a film you loved, a qawwali I should hear…",
  suggest: "Something I could improve on this site or in my work",
  hi: "Say hello",
};

export default function ContactForm() {
  const [topic, setTopic] = useState<Topic>("work");
  const [state, action, pending] = useActionState<SendResult | null, FormData>(async (prev, form) => {
    const res = await sendMessage(prev, form);
    if (!res.ok && res.fallback) {
      // No email service configured: open the visitor's mail app instead.
      const body = `${form.get("message")}\n\n— ${form.get("name") || ""} (${form.get("email")})`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(LABEL[topic])}&body=${encodeURIComponent(body)}`;
    }
    return res;
  }, null);

  if (state?.ok) {
    return (
      <div className="flex flex-[1_1_340px] flex-col justify-center gap-3 rounded-2xl border border-line bg-surface p-6 md:p-8">
        <p className="font-display text-3xl font-bold">Got it, thank you.</p>
        <p className="text-soft">Your message is in my inbox. I&apos;ll reply to the email you left.</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex min-w-0 flex-[1_1_340px] flex-col gap-3.5 md:gap-4">
      <input type="hidden" name="topic" value={topic} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className="flex flex-col gap-2">
        <span className="text-sm text-soft">What&apos;s it about?</span>
        <div role="group" aria-label="Topic" className="flex flex-wrap gap-2">
          {TOPICS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={topic === id}
              onClick={() => setTopic(id)}
              className={`min-h-9 rounded-full border px-3 text-xs font-semibold md:min-h-10 md:px-4 md:text-[13px] transition-colors ${
                topic === id ? "border-accent bg-accent text-on-accent" : "border-line2 text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2 md:gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-soft">
          Your name
          <input name="name" className="field" autoComplete="name" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-soft">
          Your email
          <input name="email" type="email" required className="field" autoComplete="email" placeholder="so I can reply" />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm text-soft">
        {LABEL[topic]}
        <textarea name="message" rows={3} required placeholder={HINT[topic]} className="field resize-y" />
      </label>
      <button type="submit" disabled={pending} className="btn-accent min-h-12 justify-center text-sm md:min-h-[52px] md:text-[15px] disabled:opacity-60">
        {pending ? "Sending…" : "Send message"}
      </button>
      {state && !state.ok && !state.fallback && <p className="text-sm text-[#E0745A]">{state.error}</p>}
      <p className="break-words text-xs text-muted md:text-[13px]">
        Or write directly to{" "}
        <a href={`mailto:${site.email}`} className="text-accent">
          {site.email}
        </a>
      </p>
    </form>
  );
}
