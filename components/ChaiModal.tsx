"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { site, upiLink } from "@/data/site";

/** "Buy me a chai" dialog with a UPI QR. */
export default function ChaiModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [note, setNote] = useState("");
  const [qr, setQr] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const link = upiLink(note);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    QRCode.toDataURL(link, { margin: 1, width: 440, color: { dark: "#14110F", light: "#FFFFFF" } }).then((u) => {
      if (alive) setQr(u);
    });
    return () => {
      alive = false;
    };
  }, [open, link]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chai-title"
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 p-5 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] rounded-[20px] border border-[#3A322B] bg-[#1C1814] p-7 text-center text-[#F1E8D8] shadow-2xl"
      >
        <p id="chai-title" className="font-display text-[26px] font-bold">
          Buy me a chai
        </p>
        <p className="mt-1 text-[15px] text-[#CFC3B0]">
          {site.upi.item} ☕ <span className="ml-1 font-bold text-[#E0A54A]">₹{site.upi.amount}</span>
        </p>

        <div className="mx-auto mt-5 aspect-square w-[220px] overflow-hidden rounded-xl bg-white p-2">
          {qr && <img src={qr} alt={`UPI QR code to pay ₹${site.upi.amount}`} className="h-full w-full" />}
        </div>
        <p className="mt-3 text-[13px] text-[#A89C8A]">Scan with GPay, PhonePe, Paytm or any UPI app</p>

        <label className="mt-5 block text-left text-[13px] font-semibold text-[#DCD1BE]">
          Add a note <span className="font-normal text-[#6A5E50]">(optional)</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={50}
            placeholder="Thodi kadak banana ☕"
            className="mt-2 w-full rounded-[10px] border border-[#4A4038] bg-[#14110F] px-3.5 py-3 text-[15px] font-normal text-[#F1E8D8] outline-none placeholder:text-[#6A5E50] focus:border-[#E0A54A]"
          />
        </label>

        <a href={link} className="btn-accent mt-5 w-full justify-center !bg-[#E0A54A] !text-[#14110F]">
          On your phone? Pay ₹{site.upi.amount} in your UPI app
        </a>
        <p className="mt-3 text-[12px] text-[#A89C8A]">
          UPI ID: <span className="select-all text-[#DCD1BE]">{site.upi.id}</span>
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className="mt-4 text-[14px] text-[#CFC3B0] underline underline-offset-4">
          Maybe later
        </button>
      </div>
    </div>
  );
}
