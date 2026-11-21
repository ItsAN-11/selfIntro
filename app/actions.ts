"use server";

import { Resend } from "resend";

export type SendResult =
  | { ok: true }
  | { ok: false; error: string; /** email not configured: use mailto */ fallback?: boolean };

const TO = process.env.CONTACT_TO_EMAIL || "2021anjaligupta26@gmail.com";
// Resend's test sender until a domain is verified.
const FROM = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

const clean = (v: FormDataEntryValue | null, max = 2000) => String(v ?? "").trim().slice(0, max);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

type Email = {
  subject: string;
  replyTo: string;
  accent: string;
  kicker: string;
  heading: string;
  subheading?: string;
  fields: [string, string][];
  buttons: { label: string; href: string }[];
};

const FONT = "Georgia,'Times New Roman',serif";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/** Email-safe HTML (tables + inline styles). */
function renderEmail({ accent, kicker, heading, subheading, fields, buttons }: Email) {
  const rows = fields
    .map(
      ([k, v]) => `
      <tr><td style="padding:0 0 18px">
        <div style="font:600 11px/1.4 ${SANS};letter-spacing:2px;text-transform:uppercase;color:#8a7a66;margin:0 0 6px">${esc(k)}</div>
        <div style="font:16px/1.6 ${SANS};color:#2a221b">${esc(v).replace(/\n/g, "<br>")}</div>
      </td></tr>`,
    )
    .join("");
  const btns = buttons
    .map(
      (b, i) =>
        `<a href="${esc(b.href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:999px;font:600 14px/1 ${SANS};text-decoration:none;${
          i === 0 ? `background:${accent};color:#ffffff` : `border:1.5px solid ${accent};color:${accent}`
        }">${esc(b.label)}</a>`,
    )
    .join("");
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f6efe4">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6efe4;padding:32px 12px">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffaf2;border:1px solid #e2d6c3;border-radius:18px;overflow:hidden">
      <tr><td style="height:6px;background:${accent};font-size:0;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:32px 32px 8px">
        <div style="font:600 12px/1.4 ${SANS};letter-spacing:3px;text-transform:uppercase;color:${accent};margin:0 0 10px">${esc(kicker)}</div>
        <div style="font:400 28px/1.25 ${FONT};color:#1c1612;margin:0 0 6px">${esc(heading)}</div>
        ${subheading ? `<div style="font:17px/1.4 ${FONT};font-style:italic;color:#6b5e4f">${esc(subheading)}</div>` : ""}
      </td></tr>
      <tr><td style="padding:16px 32px 0"><div style="border-top:1px solid #e2d6c3"></div></td></tr>
      <tr><td style="padding:22px 32px 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
      ${btns ? `<tr><td style="padding:0 32px 26px">${btns}</td></tr>` : ""}
    </table>
    <div style="font:12px/1.5 ${SANS};color:#8a7a66;padding:18px 0 0">Sent from your portfolio · hit Reply to answer them directly</div>
  </td></tr>
</table></body></html>`;
}

async function send(email: Email): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "Email isn't set up yet.", fallback: true };
  const { subject, replyTo } = email;
  const text = [email.heading, email.subheading, "", ...email.fields.map(([k, v]) => `${k}: ${v}`)]
    .filter((l) => l !== undefined)
    .join("\n");
  const html = renderEmail(email);
  try {
    const { error } = await new Resend(key).emails.send({ from: FROM, to: TO, replyTo, subject, text, html });
    if (error) return { ok: false, error: "Couldn't send right now. Please try again, or email me directly." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't send right now. Please try again, or email me directly." };
  }
}

const SUBJECTS: Record<string, string> = {
  work: "Work / project enquiry",
  reco: "A recommendation for you",
  suggest: "A suggestion",
  hi: "Hello from your portfolio",
};

/** Contact form on the homepage. */
export async function sendMessage(_: SendResult | null, form: FormData): Promise<SendResult> {
  if (clean(form.get("company"))) return { ok: true }; // honeypot: bots fill hidden fields
  const topic = clean(form.get("topic"), 20);
  const name = clean(form.get("name"), 100);
  const email = clean(form.get("email"), 200);
  const message = clean(form.get("message"), 4000);
  if (!isEmail(email)) return { ok: false, error: "Please add an email I can reply to." };
  if (message.length < 2) return { ok: false, error: "Please write a message." };
  const label = SUBJECTS[topic] ?? SUBJECTS.hi;
  return send({
    subject: `${label}${name ? ` — ${name}` : ""}`,
    replyTo: email,
    accent: "#a8620f",
    kicker: label,
    heading: `${name || "Someone"} wrote to you`,
    subheading: email,
    fields: [["Message", message]],
    buttons: [{ label: `Reply to ${name || "them"}`, href: `mailto:${email}?subject=${encodeURIComponent(`Re: ${label}`)}` }],
  });
}

/** "Recommend me a song" on the Musical Mehfil page. */
export async function sendSongRecommendation(_: SendResult | null, form: FormData): Promise<SendResult> {
  if (clean(form.get("company"))) return { ok: true };
  const song = clean(form.get("song"), 200);
  const artist = clean(form.get("artist"), 200);
  const why = clean(form.get("why"), 1000);
  const name = clean(form.get("name"), 100);
  const email = clean(form.get("email"), 200);
  if (!song || !artist) return { ok: false, error: "Please add the song and the artist." };
  if (email && !isEmail(email)) return { ok: false, error: "That email doesn't look right." };
  const q = encodeURIComponent(`${song} ${artist}`);
  const buttons = [
    { label: "Search on Spotify", href: `https://open.spotify.com/search/${q}` },
    { label: "Search on YouTube", href: `https://www.youtube.com/results?search_query=${q}` },
  ];
  if (email) buttons.push({ label: "Thank them", href: `mailto:${email}?subject=${encodeURIComponent(`Re: ${song}`)}` });
  return send({
    subject: `Song recommendation: ${song} — ${artist}`,
    replyTo: email || TO,
    accent: "#1a9e4b",
    kicker: "A song for you",
    heading: song,
    subheading: `by ${artist}`,
    fields: [
      ["Why you'll love it", why || "They didn't say. Just press play."],
      ["Recommended by", `${name || "Someone anonymous"}${email ? ` · ${email}` : ""}`],
    ],
    buttons,
  });
}
