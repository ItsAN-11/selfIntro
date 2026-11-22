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
const sectionTitle = "mb-6 text-[clamp(30px,5vw,56px)] md:mb-9 text-[#CFC3B0] underline underline-offset-8";
const box = "relative z-[1] flex flex-col gap-2.5 self-start border border-[#CFC3B0] bg-[rgba(14,12,10,0.9)] px-3 py-5 text-center md:gap-[22px] md:px-5 md:py-10";

function Cover({ t, first }: { t: MusicCard; first: boolean }) {
  return (
    <a href={t.url} target="_blank" rel="noopener" aria-label={`${t.title} by ${t.artist} on Spotify`} className="mb-3 block md:mb-[18px] break-inside-avoid text-[#F1E8D8] no-underline">
      <div
        className="cover flex flex-col justify-between p-3 md:p-[18px]"
        style={{ aspectRatio: t.ar, background: t.bg ?? "#1A140F", color: t.ink ?? "#F1E8D8" }}
      >
        {t.img ? (
          <Image
            src={t.img}
            alt={`${t.title} cover`}
            fill
            loading="eager"
            fetchPriority={first ? "high" : "auto"}
            sizes="(min-width: 768px) 300px, 50vw"
            className="z-0 object-cover"
          />
        ) : (
          <>
            <span className="sun" style={{ width: t.sz, aspectRatio: 1, left: t.sx, top: t.sy, background: t.sun }} />
            <span className="disc" style={{ ["--lab" as string]: t.lab }} />
            <span className="side">{t.tag} · Side A</span>
            <span className="ttl" style={{ fontSize: `min(${t.fs}, 7.5vw)` }}>
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
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        gsap.from(el, { opacity: 0, y: 24, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 95%", once: true } });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="page-music min-h-screen pb-[120px]">
      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4 bg-[#0E0C0A] px-5 py-2.5 md:px-[max(32px,calc((100%-1240px)/2+32px))] md:pb-4 md:pt-6 shadow-[0_1px_0_rgba(241,232,216,.06)]">
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
          <h1 data-mehfil-title className="m-0 text-[12.5vw] uppercase md:text-[clamp(56px,11vw,150px)] leading-[0.95] tracking-[1px]" style={ARCHIVO}>
            <span className="block text-[#1ED760] tracking-[-0.04em]">
              {/* Logo is pinned to the top-right of the word so it can never wrap onto its own line */}
              <span className="relative inline-block whitespace-nowrap">
              <MagneticText text="Musical" />
              <a
                href={site.spotify}
                target="_blank"
                rel="noopener"
                aria-label="My Spotify"
                onMouseEnter={() => setLogoSpin(true)}
                onMouseLeave={() => setLogoSpin(false)}
                className="absolute left-full top-[-0.16em] ml-[0.06em] inline-flex h-[0.42em] w-[0.42em]"
              >
                <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden style={{ transform: `rotate(${logoSpin ? 360 : 0}deg)`, transition: "transform 500ms cubic-bezier(.3,1.5,.5,1)" }}>
                  <circle cx="12" cy="12" r="12" fill="#F1E8D8" />
                  <path d="M6.2 9.3c3.9-1.2 8.3-.8 11.7 1.2" stroke="#0E0C0A" strokeWidth="1.9" strokeLinecap="round" fill="none" />
                  <path d="M7 12.6c3.2-.9 6.6-.5 9.4 1" stroke="#0E0C0A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                  <path d="M7.7 15.6c2.5-.6 5-.3 7.1.8" stroke="#0E0C0A" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                </svg>
              </a>
            </span>
            </span>
            <MagneticText text="Mehfil" className="block text-transparent [-webkit-text-stroke:2px_#F1E8D8]" />
          </h1>
        </section>

        <section data-cards className="relative z-[1] bg-[#0E0C0A] pt-6">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="[column-gap:12px] [columns:2] md:[column-gap:18px] md:[columns:4_240px]">
              {cards.map((t, i) => (
                <Cover key={t.url} t={t} first={i < 3} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* QUOTE */}
      <section className="mx-auto max-w-[900px] px-8 py-24 text-center md:py-[200px]" data-reveal>
        <p className="text-[clamp(17px,1.9vw,21px)] font-medium uppercase leading-normal tracking-[0.5px] text-[#E8DCC6]">“{quotes.middle.text}” —</p>
        <p className="mt-1 text-[clamp(17px,1.9vw,21px)] lowercase text-[#1ED760]">{quotes.middle.by}</p>
      </section>

      {/* PROFILE */}
      <section className="mx-auto max-w-[1240px] px-5 md:px-8" data-reveal>
        <div className="flex flex-wrap items-center justify-between gap-4 md:gap-10">
          <div data-profile className="flex items-center gap-4 md:flex-wrap md:gap-6">
            <div data-profile-photo className="relative h-[124px] w-[96px] flex-none overflow-hidden rounded-sm md:h-[270px] md:w-[270px] md:rounded-none border border-[#3A322B] bg-[#241E19] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]">
              {/* Blurred copy fills the sides; the sharp photo shows whole on top */}
              <Image src={profile.photo} alt="" aria-hidden fill loading="eager" quality={75} sizes="64px" className="scale-110 object-cover opacity-60 blur-xl" />
              <Image src={profile.photo} alt="Anjali listening to music on earphones" fill loading="eager" quality={90} sizes="(min-width: 768px) 152px, 70px" className="object-contain" />
            </div>
            <div className="flex min-w-0 flex-col gap-1 md:gap-1.5">
              <span className="text-xs text-[#CFC3B0] md:text-sm">{profile.label}</span>
              <span className="text-[38px] leading-none md:text-[clamp(48px,7vw,84px)]" style={ARCHIVO}>
                {profile.name}
              </span>
              <span className="text-[13px] text-[#CFC3B0] md:text-[15px]">{profile.playlistsCount} playlists</span>
              <a href={site.spotify} target="_blank" rel="noopener" className="mt-1 inline-flex min-h-9 self-start items-center border border-[#F1E8D8] px-4 text-xs uppercase tracking-[2px] text-[#F1E8D8] no-underline md:mt-0 md:min-h-11 md:px-5 md:text-sm">
                Follow
              </a>
            </div>
          </div>
          <div className="flex w-full flex-col gap-1.5 pl-[112px] md:w-auto md:max-w-[440px] md:flex-[1_1_360px] md:gap-2 md:pl-0">
            {playlists.map((l) => (
              <div key={l.url} className="flex items-center gap-2 rounded-md bg-[#1A1613] p-1.5 md:gap-3.5 md:p-2.5">
                <span className="relative h-9 w-9 flex-none overflow-hidden rounded md:h-[76px] md:w-[76px]">
                  <Image src={l.img} alt="" fill loading="eager" sizes="(min-width: 768px) 76px, 36px" className="object-cover" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[12px] leading-tight md:text-base md:leading-normal">{l.name}</span>
                  <span className="truncate text-[10px] leading-tight text-[#A89C8A] md:text-[13px] md:leading-normal">{l.note}</span>
                </span>
                <a href={l.url} target="_blank" rel="noopener" className="inline-flex min-h-7 items-center rounded-full bg-[#1ED760] px-2.5 text-[10px] font-bold tracking-[1px] text-[#0E0C0A] no-underline md:min-h-11 md:px-5 md:text-[13px] md:tracking-[1.5px]">
                  VIEW
                </a>
              </div>
            ))}
            <span aria-hidden className="mt-3 block h-px bg-[#CFC3B0] opacity-60 md:mt-4" />
          </div>
        </div>
      </section>

      {/* TOP TRACKS */}
      <section className="mx-auto max-w-[1240px] px-5 pt-20 md:px-8 md:pt-[180px]">
        <MagneticText as="h2" text="#TopTracks" className={sectionTitle} style={ARCHIVO} />
        <div className="grid grid-cols-12">
          <Slideshow
            kind="tt"
            className="col-[1/9] row-[1] min-h-[260px] md:col-[1/8] md:min-h-[540px]"
            images={data.tracks.slice(0, 5).map((t) => ({ src: t.img, alt: `${t.title} cover` }))}
          />
          <div className={`${box} col-[6/13] row-[1] mt-10 md:col-[6/13] md:mt-[60px] md:row-[1] md:mt-[60px]`}>
            <span className="text-[9px] uppercase tracking-[1.5px] text-[#CFC3B0] md:text-[13px]">Top 5 this month</span>
            {data.tracks.slice(0, 5).map((t) => (
              <a key={t.url} href={t.url} target="_blank" rel="noopener" className="flex flex-col gap-0.5 no-underline">
                <span className="text-[14px] uppercase leading-[1.1] text-transparent md:text-[clamp(22px,3vw,36px)] [-webkit-text-stroke:0.9px_#1ED760] md:[-webkit-text-stroke:1.5px_#1ED760]" style={ARCHIVO}>
                  {t.title}
                </span>
                <span className="text-[11px] text-[#A89C8A] md:text-base">{t.artist}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TOP ARTISTS */}
      <section className="mx-auto max-w-[1240px] px-5 pt-20 md:px-8 md:pt-[180px]">
        <MagneticText as="h2" text="#TopArtists" className={sectionTitle} style={ARCHIVO} />
        <div className="grid grid-cols-12">
          <Slideshow
            kind="ta"
            className="col-[1/9] row-[1] min-h-[260px] md:col-[6/13] md:min-h-[520px]"
            images={data.artists.slice(0, 4).map((a) => ({ src: a.img, alt: a.name }))}
          />
          <div className={`${box} col-[6/13] row-[1] mt-10 md:col-[1/8] md:mt-[50px] md:row-[1] md:mt-[50px]`}>
            <span className="text-[9px] uppercase tracking-[1.5px] text-[#CFC3B0] md:text-[13px]">On repeat this month</span>
            {data.artists.slice(0, 4).map((a) => (
              <a key={a.url} href={a.url} target="_blank" rel="noopener" className="flex flex-col gap-0.5 no-underline">
                <span className="text-[14px] uppercase leading-[1.1] text-transparent md:text-[clamp(22px,3vw,36px)] [-webkit-text-stroke:0.9px_#F1E8D8] md:[-webkit-text-stroke:1.5px_#F1E8D8]" style={ARCHIVO}>
                  {a.name}
                </span>
                <span className="text-[11px] font-bold text-[#A89C8A] md:text-base">{a.genre}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SHARE MUSIC */}
      <section className="mx-auto max-w-[1240px] px-5 pt-20 md:px-8 md:pt-[180px]">
        <MagneticText as="h2" text="#ShareMusic" className={sectionTitle} style={ARCHIVO} />
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-3.5">
          <button
            type="button"
            aria-expanded={showRecent}
            onClick={() => setShowRecent(!showRecent)}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1ED760] px-7 md:min-h-[52px] text-sm font-bold uppercase tracking-[1.5px] text-[#0E0C0A]"
          >
            Get a recommendation
          </button>
          <button
            type="button"
            onClick={() => setSuggest(true)}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#F1E8D8] px-7 md:min-h-[52px] text-sm font-bold uppercase tracking-[1.5px] text-[#F1E8D8]"
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
      <section className="mx-auto max-w-[900px] px-8 pt-24 text-center md:pt-[200px]" data-reveal>
        <p className="text-[clamp(17px,1.9vw,21px)] font-medium uppercase leading-normal tracking-[0.5px] text-[#E8DCC6]">“{quotes.end.text}” —</p>
        <p className="mt-1 text-[clamp(17px,1.9vw,21px)] lowercase text-[#1ED760]">{quotes.end.by}</p>
      </section>

      <RecommendSong open={suggest} onClose={closeSuggest} />
    </div>
  );
}
