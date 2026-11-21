"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MagneticText from "./MagneticText";
import { cineProfile, directors, filmLists, filmQuote, films, topFilms, type FilmTag } from "@/data/cinema";
import { site } from "@/data/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BEBAS = { fontFamily: "var(--font-bebas)" } as const;
const CHIPS: ("All" | FilmTag)[] = ["All", "Favourite", "Watched", "Up next"];
const h2 = "mb-9 text-[clamp(44px,6vw,80px)] uppercase leading-none tracking-[2px] text-[#CFC3B0]";
const box = "relative z-[1] flex flex-col gap-[22px] self-start border border-[#CFC3B0] bg-[rgba(10,8,7,0.9)] px-5 py-10 text-center";
const still = "flex items-center justify-center border border-[#3A322B] bg-[#1A1613] text-xs uppercase tracking-[2px] text-[#A89C8A]";

export default function CinemaView() {
  const [filter, setFilter] = useState<(typeof CHIPS)[number]>("All");
  const root = useRef<HTMLDivElement>(null);
  const shown = films.filter((f) => filter === "All" || f.tag === filter);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-tile]", { opacity: 0, y: 30, stagger: 0.05, duration: 0.7, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
        gsap.from(el, { opacity: 0, y: 50, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} className="page-cinema min-h-screen pb-[120px]">
      <header className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-8 pt-9">
        <Link href="/home" className="inline-flex min-h-11 items-center border-b-2 border-[#E50914] text-sm uppercase tracking-[2px] text-[#F1E8D8] no-underline">
          ← Anjali
        </Link>
        <Link href="/music" className="inline-flex min-h-11 items-center text-sm uppercase tracking-[2px] text-[#FF4A52] no-underline hover:text-[#FF7A80]">
          Musical mehfil →
        </Link>
      </header>

      <section className="mx-auto max-w-[1240px] px-8 pb-[72px] pt-14 text-center">
        <h1 className="m-0 text-[clamp(84px,15vw,220px)] font-normal uppercase leading-[0.85] tracking-[3px]" style={BEBAS}>
          <MagneticText text="Cinematic" className="block text-transparent [-webkit-text-stroke:2px_#F1E8D8]" />
          <MagneticText text="Diary" className="block text-[#E50914]" />
        </h1>
        <p className="mx-auto mt-6 max-w-[560px] text-[17px] text-[#CFC3B0]">
          Every film I&apos;ve loved, the ones I just watched, and the ones waiting on my list — rated and reviewed in a line.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={`min-h-11 rounded-full border px-5 text-sm font-semibold ${filter === c ? "border-[#C4101A] bg-[#C4101A] text-white" : "border-[#4A4038] text-[#F1E8D8]"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-8">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] items-start gap-x-5 gap-y-7">
          {shown.map((t, i) => (
            <a key={i} data-tile href={t.url ?? "#"} className="flex flex-col text-[#F1E8D8] no-underline">
              <div
                className="relative flex aspect-[2/3] flex-col justify-between overflow-hidden rounded-md border border-[#2E2722] p-4"
                style={{ background: t.bg }}
              >
                {t.poster && <img src={t.poster} alt={`${t.title} poster`} className="absolute inset-0 h-full w-full object-cover" />}
                <div className="relative flex items-start justify-between gap-2">
                  <span className="rounded-full bg-[#0A0807] px-2.5 py-1 text-[11px] uppercase tracking-[2px] text-[#FF4A52]">{t.tag}</span>
                  <span className="text-[13px] font-bold text-[#FF4A52]">{t.rating}</span>
                </div>
                {!t.poster && <span className="text-xs uppercase tracking-[2px] text-[#A89C8A]">[Film poster]</span>}
              </div>
              <div className="flex min-h-16 flex-col gap-1 px-0.5 pt-3">
                <span className="font-display text-[22px] font-bold leading-[1.1]">
                  {t.title} · {t.year}
                </span>
                <span className="text-[13px] italic text-[#A89C8A]">{t.review}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* PROFILE */}
      <section className="mx-auto max-w-[1240px] px-8 pt-24" data-reveal>
        <div className="flex flex-wrap items-center justify-between gap-10 border-b border-[#4A4038] pb-10">
          <div className="flex flex-wrap items-center gap-6">
            <div className={`h-[220px] w-[220px] overflow-hidden ${still}`}>
              {cineProfile.photo ? <img src={cineProfile.photo} alt="Anjali" className="h-full w-full object-cover" /> : "[Your photo]"}
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-[#CFC3B0]">cinephile since {cineProfile.since}</span>
              <span className="text-[clamp(64px,9vw,110px)] leading-[0.9] tracking-[2px]" style={BEBAS}>
                {cineProfile.name}
              </span>
              <span className="text-[15px] text-[#CFC3B0]">{cineProfile.watched} films watched</span>
              <a href="#" className="inline-flex min-h-11 self-start items-center border border-[#F1E8D8] px-5 text-sm uppercase tracking-[2px] text-[#F1E8D8] no-underline">
                Follow
              </a>
            </div>
          </div>
          <div className="flex max-w-[440px] flex-[1_1_360px] flex-col gap-2">
            {filmLists.map((l) => (
              <div key={l.name} className="flex items-center gap-3.5 rounded-md bg-[#1A1613] p-2.5">
                <span className="h-14 w-10 flex-none rounded-[3px] bg-[#2A231D]" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span>{l.name}</span>
                  <span className="text-[13px] text-[#A89C8A]">{l.count} films</span>
                </span>
                <a href="#" className="inline-flex min-h-11 items-center rounded bg-[#C4101A] px-5 text-[13px] font-bold tracking-[1.5px] text-white no-underline">
                  VIEW
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP FILMS */}
      <section className="mx-auto max-w-[1240px] px-8 pt-[180px]">
        <MagneticText as="h2" text="#TopFilms" className={h2} style={BEBAS} />
        <div className="grid grid-cols-12">
          <div className={`col-[1/13] row-[1] min-h-[420px] md:col-[1/8] md:min-h-[540px] ${still}`}>[Film still]</div>
          <div className={`${box} col-[2/12] row-[2] -mt-16 md:col-[6/13] md:row-[1] md:mt-[60px]`}>
            <span className="text-[13px] uppercase tracking-[1.5px] text-[#CFC3B0]">Top 5 watched this month</span>
            {topFilms.map((f, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="text-[clamp(28px,3.6vw,44px)] uppercase leading-none tracking-[1px] text-transparent [-webkit-text-stroke:1.2px_#FF4A52]" style={BEBAS}>
                  {f.title}
                </span>
                <span className="text-base font-bold text-[#A89C8A]">{f.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP DIRECTORS */}
      <section className="mx-auto max-w-[1240px] px-8 pt-[180px]">
        <MagneticText as="h2" text="#TopDirectors" className={h2} style={BEBAS} />
        <div className="grid grid-cols-12">
          <div className={`col-[1/13] row-[1] min-h-[420px] md:col-[6/13] md:min-h-[520px] ${still}`}>[Behind-the-scenes still]</div>
          <div className={`${box} col-[2/12] row-[2] -mt-16 md:col-[1/8] md:row-[1] md:mt-[50px]`}>
            <span className="text-[13px] uppercase tracking-[1.5px] text-[#CFC3B0]">Filmmakers I follow everywhere</span>
            {directors.map((d, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="text-[clamp(28px,3.6vw,44px)] uppercase leading-none tracking-[1px] text-transparent [-webkit-text-stroke:1.2px_#F1E8D8]" style={BEBAS}>
                  {d.name}
                </span>
                <span className="text-base font-bold text-[#A89C8A]">{d.fav}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHARE FILMS */}
      <section className="mx-auto max-w-[1240px] px-8 pt-[180px]">
        <MagneticText as="h2" text="#ShareFilms" className={h2} style={BEBAS} />
        <div className="flex flex-wrap gap-3.5">
          <a href="#" className="inline-flex min-h-[52px] items-center rounded-full bg-[#C4101A] px-7 text-sm font-bold uppercase tracking-[1.5px] text-white no-underline">
            Get a recommendation
          </a>
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent("A film you should watch")}`}
            className="inline-flex min-h-[52px] items-center rounded-full border border-[#F1E8D8] px-7 text-sm font-bold uppercase tracking-[1.5px] text-[#F1E8D8] no-underline"
          >
            Recommend a film?
          </a>
        </div>
      </section>

      {/* QUOTE */}
      <section className="mx-auto max-w-[900px] px-8 pt-[200px] text-center" data-reveal>
        <p className="text-[clamp(28px,4vw,48px)] leading-tight tracking-[1px] text-[#E8DCC6]" style={BEBAS}>
          “{filmQuote.text}”
        </p>
        <p className="mt-2 text-[#FF4A52]">— {filmQuote.by}</p>
      </section>
    </div>
  );
}
