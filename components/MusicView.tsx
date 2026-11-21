"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MagneticText from "./MagneticText";
import Slideshow from "./Slideshow";
import RecommendSong from "./RecommendSong";
import { cards, playlists, profile, quotes, type MusicCard } from "@/data/music";
import type { MusicData } from "@/lib/spotify";
import { site } from "@/data/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ARCHIVO = { fontFamily: "var(--font-archivo)", fontStretch: "125%", fontWeight: 900 } as const;
const sectionTitle = "mb-9 text-[clamp(34px,5vw,56px)] text-[#CFC3B0] underline underline-offset-8";
const box = "relative z-[1] flex flex-col gap-[22px] self-start border border-[#CFC3B0] bg-[rgba(14,12,10,0.9)] px-5 py-10 text-center";

function Cover({ t }: { t: MusicCard }) {
  return (
    <a href={t.url} target="_blank" rel="noopener" aria-label={`${t.title} by ${t.artist} on Spotify`} className="mb-[18px] block break-inside-avoid text-[#F1E8D8] no-underline">
      <div
        className="cover flex flex-col justify-between p-[18px]"
        style={{ aspectRatio: t.ar, background: t.bg ?? "#1A140F", color: t.ink ?? "#F1E8D8" }}
      >
        {t.img ? (
          <img src={t.img} alt={`${t.title} cover`} className="absolute inset-0 z-0 h-full w-full object-cover" />
        ) : (
          <>
            <span className="sun" style={{ width: t.sz, aspectRatio: 1, left: t.sx, top: t.sy, background: t.sun }} />
            <span className="disc" style={{ ["--lab" as string]: t.lab }} />
            <span className="side">{t.tag} · Side A</span>
            <span className="ttl" style={{ fontSize: t.fs }}>
              {t.title}
            </span>
          </>
        )}
      </div>
    </a>
  );
}

export default function MusicView({ initial }: { initial: MusicData }) {
  const [data, setData] = useState(initial);
  const [scrolled, setScrolled] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [suggest, setSuggest] = useState(false);
  const [logoSpin, setLogoSpin] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const closeSuggest = useCallback(() => setSuggest(false), []);

  // Live Spotify data (cached on the server for about an hour).
  useEffect(() => {
    fetch("/api/spotify")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: MusicData | null) => d?.live && setData(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Pinned title fades as the cards slide over it.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to("[data-mehfil-title]", {
        opacity: 0.15,
        scale: 0.94,
        ease: "none",
        scrollTrigger: { trigger: "[data-cards]", start: "top 70%", end: "top 10%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
        gsap.from(el, { opacity: 0, y: 50, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} className="page-music min-h-screen pb-[120px]">
      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4 bg-[#0E0C0A] px-[max(32px,calc((100%-1240px)/2+32px))] pb-4 pt-6 shadow-[0_1px_0_rgba(241,232,216,.06)]">
        <Link href="/home" className="inline-flex min-h-11 items-center border-b-2 border-[#1ED760] text-sm uppercase tracking-[2px] text-[#F1E8D8] no-underline">
          ← Anjali
        </Link>
        {site.showCinema && (
          <Link
            href="/cinema"
            className={`inline-flex min-h-11 items-center text-sm uppercase tracking-[2px] text-[#1ED760] no-underline transition-all duration-300 ${
              scrolled ? "pointer-events-none invisible opacity-0" : "opacity-100"
            }`}
          >
            Cinema diary →
          </Link>
        )}
      </header>

      <div className="relative">
        <section className="sticky top-10 z-0 mx-auto max-w-[1240px] px-8 pb-[72px] pt-14 text-center">
          <h1 data-mehfil-title className="m-0 text-[clamp(56px,11vw,150px)] uppercase leading-[0.95] tracking-[1px]" style={ARCHIVO}>
            <span className="block text-[#1ED760] tracking-[-0.04em]">
              <MagneticText text="Musical" />
              <a
                href={site.spotify}
                target="_blank"
                rel="noopener"
                aria-label="My Spotify"
                onMouseEnter={() => setLogoSpin(true)}
                onMouseLeave={() => setLogoSpin(false)}
                className="ml-[0.1em] inline-flex h-[0.42em] w-[0.42em] -translate-y-[0.55em] align-middle"
              >
                <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden style={{ transform: `rotate(${logoSpin ? 360 : 0}deg)`, transition: "transform 500ms cubic-bezier(.3,1.5,.5,1)" }}>
                  <circle cx="12" cy="12" r="12" fill="#F1E8D8" />
                  <path d="M6.2 9.3c3.9-1.2 8.3-.8 11.7 1.2" stroke="#0E0C0A" strokeWidth="1.9" strokeLinecap="round" fill="none" />
                  <path d="M7 12.6c3.2-.9 6.6-.5 9.4 1" stroke="#0E0C0A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  <path d="M7.7 15.6c2.5-.6 5-.3 7.1.8" stroke="#0E0C0A" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                </svg>
              </a>
            </span>
            <MagneticText text="Mehfil" className="block text-transparent [-webkit-text-stroke:2px_#F1E8D8]" />
          </h1>
        </section>

        <section data-cards className="relative z-[1] bg-[#0E0C0A] pt-6">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="[column-gap:18px] [columns:4_240px]">
              {cards.map((t) => (
                <Cover key={t.url} t={t} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* QUOTE */}
      <section className="mx-auto max-w-[900px] px-8 py-[200px] text-center" data-reveal>
        <p className="text-[clamp(17px,1.9vw,21px)] font-medium uppercase leading-normal tracking-[0.5px] text-[#E8DCC6]">“{quotes.middle.text}” —</p>
        <p className="mt-1 text-[clamp(17px,1.9vw,21px)] lowercase text-[#1ED760]">{quotes.middle.by}</p>
      </section>

      {/* PROFILE */}
      <section className="mx-auto max-w-[1240px] px-8" data-reveal>
        <div className="flex flex-wrap items-center justify-between gap-10">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative h-[220px] w-[220px] overflow-hidden border border-[#3A322B] bg-[#241E19]">
              <Image src={profile.photo} alt="Anjali striking a Nataraja pose beside a bronze Nataraja" fill sizes="220px" className="object-cover" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-[#CFC3B0]">{profile.label}</span>
              <span className="text-[clamp(48px,7vw,84px)] leading-none" style={ARCHIVO}>
                {profile.name}
              </span>
              <span className="text-[15px] text-[#CFC3B0]">{profile.playlistsCount} playlists</span>
              <a href={site.spotify} target="_blank" rel="noopener" className="inline-flex min-h-11 self-start items-center border border-[#F1E8D8] px-5 text-sm uppercase tracking-[2px] text-[#F1E8D8] no-underline">
                Follow
              </a>
            </div>
          </div>
          <div className="flex max-w-[440px] flex-[1_1_360px] flex-col gap-2">
            {playlists.map((l) => (
              <div key={l.url} className="flex items-center gap-3.5 rounded-md bg-[#1A1613] p-2.5">
                <span className="relative h-[76px] w-[76px] flex-none overflow-hidden rounded">
                  <Image src={l.img} alt="" fill sizes="76px" className="object-cover" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span>{l.name}</span>
                  <span className="text-[13px] text-[#A89C8A]">{l.note}</span>
                </span>
                <a href={l.url} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-full bg-[#1ED760] px-5 text-[13px] font-bold tracking-[1.5px] text-[#0E0C0A] no-underline">
                  VIEW
                </a>
              </div>
            ))}
            <span aria-hidden className="mt-4 block h-px bg-[#CFC3B0] opacity-60" />
          </div>
        </div>
      </section>

      {/* TOP TRACKS */}
      <section className="mx-auto max-w-[1240px] px-8 pt-[180px]">
        <MagneticText as="h2" text="#TopTracks" className={sectionTitle} style={ARCHIVO} />
        <div className="grid grid-cols-12">
          <Slideshow
            kind="tt"
            className="col-[1/13] row-[1] min-h-[420px] md:col-[1/8] md:min-h-[540px]"
            images={data.tracks.slice(0, 5).map((t) => ({ src: t.img, alt: `${t.title} cover` }))}
          />
          <div className={`${box} col-[2/12] row-[2] -mt-16 md:col-[6/13] md:row-[1] md:mt-[60px]`}>
            <span className="text-[13px] uppercase tracking-[1.5px] text-[#CFC3B0]">Top 5 this month</span>
            {data.tracks.slice(0, 5).map((t) => (
              <a key={t.url} href={t.url} target="_blank" rel="noopener" className="flex flex-col gap-0.5 no-underline">
                <span className="text-[clamp(22px,3vw,36px)] uppercase leading-[1.1] text-transparent [-webkit-text-stroke:1.5px_#1ED760]" style={ARCHIVO}>
                  {t.title}
                </span>
                <span className="text-base text-[#A89C8A]">{t.artist}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TOP ARTISTS */}
      <section className="mx-auto max-w-[1240px] px-8 pt-[180px]">
        <MagneticText as="h2" text="#TopArtists" className={sectionTitle} style={ARCHIVO} />
        <div className="grid grid-cols-12">
          <Slideshow
            kind="ta"
            className="col-[1/13] row-[1] min-h-[420px] md:col-[6/13] md:min-h-[520px]"
            images={data.artists.slice(0, 4).map((a) => ({ src: a.img, alt: a.name }))}
          />
          <div className={`${box} col-[2/12] row-[2] -mt-16 md:col-[1/8] md:row-[1] md:mt-[50px]`}>
            <span className="text-[13px] uppercase tracking-[1.5px] text-[#CFC3B0]">On repeat this month</span>
            {data.artists.slice(0, 4).map((a) => (
              <a key={a.url} href={a.url} target="_blank" rel="noopener" className="flex flex-col gap-0.5 no-underline">
                <span className="text-[clamp(22px,3vw,36px)] uppercase leading-[1.1] text-transparent [-webkit-text-stroke:1.5px_#F1E8D8]" style={ARCHIVO}>
                  {a.name}
                </span>
                <span className="text-base font-bold text-[#A89C8A]">{a.genre}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SHARE MUSIC */}
      <section className="mx-auto max-w-[1240px] px-8 pt-[180px]">
        <MagneticText as="h2" text="#ShareMusic" className={sectionTitle} style={ARCHIVO} />
        <div className="flex flex-wrap gap-3.5">
          <button
            type="button"
            aria-expanded={showRecent}
            onClick={() => setShowRecent(!showRecent)}
            className="inline-flex min-h-[52px] items-center rounded-full bg-[#1ED760] px-7 text-sm font-bold uppercase tracking-[1.5px] text-[#0E0C0A]"
          >
            Get a recommendation
          </button>
          <button
            type="button"
            onClick={() => setSuggest(true)}
            className="inline-flex min-h-[52px] items-center rounded-full border border-[#F1E8D8] px-7 text-sm font-bold uppercase tracking-[1.5px] text-[#F1E8D8]"
          >
            Recommend me a song
          </button>
        </div>
        {showRecent && (
          <a
            href={data.recent.url}
            target="_blank"
            rel="noopener"
            className="mt-6 flex max-w-[560px] items-center gap-[18px] rounded-xl border border-[#3A322B] bg-[#1A1613] p-[18px] no-underline"
          >
            <span
              aria-hidden
              className="h-14 w-14 flex-none rounded-full [animation:spin_4s_linear_infinite]"
              style={{ background: "radial-gradient(circle, #1ED760 0 18%, #0b0908 19% 22%, transparent 23%), repeating-radial-gradient(circle, #141110 0 1.5px, #221d19 1.5px 3px)" }}
            />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[11px] uppercase tracking-[2.5px] text-[#1ED760]">Most recently played</span>
              <span className="font-display text-[22px] font-bold text-[#F1E8D8]">{data.recent.title}</span>
              <span className="text-sm text-[#A89C8A]">
                {data.recent.artist} · from “{data.recent.album}”
              </span>
            </span>
            <span className="text-sm font-bold text-[#1ED760]">▶ Listen</span>
          </a>
        )}
      </section>

      {/* CLOSING QUOTE */}
      <section className="mx-auto max-w-[900px] px-8 pt-[200px] text-center" data-reveal>
        <p className="text-[clamp(17px,1.9vw,21px)] font-medium uppercase leading-normal tracking-[0.5px] text-[#E8DCC6]">“{quotes.end.text}” —</p>
        <p className="mt-1 text-[clamp(17px,1.9vw,21px)] lowercase text-[#1ED760]">{quotes.end.by}</p>
      </section>

      <RecommendSong open={suggest} onClose={closeSuggest} />
    </div>
  );
}
