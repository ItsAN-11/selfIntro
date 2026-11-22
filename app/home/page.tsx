import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MagneticText from "@/components/MagneticText";
import FilmStrip from "@/components/FilmStrip";
import SideTabs from "@/components/SideTabs";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import MobileMenu from "@/components/MobileMenu";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { projects } from "@/data/projects";
import { stack } from "@/data/stack";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Anjali Gupta — About" };

const h2 = "m-0 font-display text-[clamp(40px,5vw,56px)] font-bold leading-none";
const navLink = "text-soft no-underline hover:text-accent";

export default function HomePage() {
  const info = [
    ["currently in", site.city],
    ["working at", "Senrysa Technologies"],
    ["focussed on", "backend systems"],
    ["currently into", site.currentlyInto],
  ].filter(([, v]) => v);

  return (
    <Reveal className="min-h-screen text-base leading-relaxed">
      {/* NAV */}
      <header className="border-b border-line">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4 md:px-8 md:py-5">
          <Link href="/" className="font-display text-[22px] font-bold tracking-[0.5px] text-ink no-underline md:text-[26px]">
            anjali.gupta
          </Link>
          <MobileMenu
            items={[
              { href: "#about", label: "About" },
              { href: "#work", label: "Work" },
              { href: "/projects", label: "Projects" },
              { href: "/projects#journey", label: "Journey" },
              { href: "/music", label: "Spotify resume" },
              { href: "#credits", label: "Contact" },
              { href: site.resume, label: "Resume.pdf", external: true, accent: true },
            ]}
          />
          <div className="hidden flex-wrap gap-7 text-[13px] uppercase tracking-[1.5px] md:flex">
            <a href="#about" className={navLink}>
              <MagneticText text="About" />
            </a>
            <a href="#work" className={navLink}>
              <MagneticText text="Work" />
            </a>
            <Link href="/projects" className={navLink}>
              <MagneticText text="Projects" />
            </Link>
            <Link href="/projects#journey" className={navLink}>
              <MagneticText text="Journey" />
            </Link>
            <a href="#credits" className={navLink}>
              <MagneticText text="Contact" />
            </a>
            <a href={site.resume} target="_blank" rel="noopener" className="text-accent underline">
              <MagneticText text="Resume.pdf" />
            </a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section
        id="top"
        className="mx-auto grid max-w-[1200px] items-stretch gap-[clamp(28px,5vw,72px)] px-8 py-12 md:py-[72px] md:grid-cols-[minmax(0,1.25fr)_minmax(200px,1fr)]"
      >
        <div className="flex min-w-0 flex-col justify-center">
          <MagneticText as="p" text="Now showing · A Howrah production" className="mb-5 text-[13px] uppercase tracking-[3px] text-accent" />
          <MagneticText
            as="h1"
            text={site.name}
            className="m-0 whitespace-nowrap font-display text-[clamp(32px,5.4vw,92px)] font-bold leading-none tracking-[-2px]"
          />
          <MagneticText
            as="p"
            text="Developer · Teacher · Cinephile · Listener of ghazals"
            className="mt-6 font-display text-[clamp(22px,2.6vw,32px)] italic text-soft"
          />
          <div className="mt-12 flex max-w-[520px] flex-col">
            {info.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line py-3.5 text-sm">
                <span className="text-muted">{k}</span>
                <span className="italic">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <figure className="relative m-0 flex min-h-[420px]">
          <div aria-hidden className="absolute inset-[16px_-12px_-16px_16px] rounded-md border border-accent" />
          <div className="relative flex-1 overflow-hidden rounded-md bg-surface shadow-[0_24px_50px_rgba(0,0,0,0.55)]">
            <Image
              src="/images/hero-temple.jpg"
              alt="Anjali in a brown shirt and cap, sitting in front of old terracotta temples"
              fill
              preload
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover object-[45%_35%]"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,rgba(var(--bg-rgb),0)_0%,rgba(var(--bg-rgb),0.85)_100%)]" />
            <figcaption className="absolute inset-x-5 bottom-[18px] flex items-baseline justify-between gap-3 text-xs uppercase tracking-[2px] text-text2">
              <span>Still · among old temples</span>
              <span className="text-accent">Off-duty</span>
            </figcaption>
          </div>
        </figure>
      </section>

      <FilmStrip />

      {/* ABOUT */}
      <section id="about" className="mx-auto flex max-w-[1200px] flex-wrap gap-12 px-8 py-24">
        <div className="flex-[1_1_280px]" data-reveal>
          <p className="mb-2 text-[13px] uppercase tracking-[3px] text-accent">Act I</p>
          <MagneticText as="h2" text="The story so far" className={h2} />
        </div>
        <div className="flex flex-[2_1_480px] flex-col gap-[18px] text-lg text-text2" data-reveal>
          <p>
            I&apos;m a software developer from Howrah. My journey started with a BCA (2021 – 2024); in 2025 I joined Senrysa Technologies as an
            intern and stayed on full time, working on Unizap&apos;s microservices and its ONDC seller network.
          </p>
          <p>Alongside my day job, I freelance: building apps like Rydex, looking after websites and making landing pages for agencies and companies.</p>
          <p>
            Outside work I teach computer science to school students, lose evenings to good cinema, and keep a ghazal or a qawwali playing in the
            background while I code.
          </p>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="mx-auto max-w-[1200px] px-8 pb-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[13px] uppercase tracking-[3px] text-accent">Act II</p>
            <MagneticText as="h2" text="The work" className={h2} />
          </div>
          <Link href="/projects" className="inline-flex min-h-11 items-center text-sm uppercase tracking-[1px] text-accent hover:text-accent2">
            All projects [{projects.length}] →
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
          {projects.map((p) => (
            <article key={p.id} data-reveal className="flex flex-col gap-3 rounded-[14px] border border-line bg-surface p-7">
              <p className="text-xs uppercase tracking-[2px] text-muted">{p.org}</p>
              <h3 className="font-display text-[30px] font-bold leading-[1.1]">{p.title}</h3>
              <p className="text-[15px] leading-relaxed text-soft">{p.summary}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {p.homeTags.map((t) => (
                  <span key={t} className="rounded-full border border-line2 px-2.5 py-1 text-xs text-text2">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 border-t border-line pt-10" data-reveal>
          <p className="mb-[22px] text-[13px] uppercase tracking-[2px] text-accent">What I build with</p>
          <div className="flex flex-wrap gap-x-[30px] gap-y-[26px]">
            {stack.map((k) => (
              <div key={k.name} className="flex w-[78px] flex-col items-center gap-2.5">
                <span aria-hidden className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_6px_16px_-8px_rgba(0,0,0,.45)]">
                  <Image src={k.logo} alt="" width={56} height={56} loading="eager" className="h-full w-full object-contain" />
                </span>
                <span className="text-center text-[13px] leading-tight text-soft">{k.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHER */}
      <section className="border-y border-line">
        <div className="mx-auto max-w-[900px] px-8 py-24 text-center" data-reveal>
          <MagneticText as="p" text="A sher I live by" className="mb-6 text-[13px] uppercase tracking-[3px] text-accent" />
          <p lang="hi" className="font-hindi text-[clamp(26px,3.4vw,42px)] leading-[1.6]">
            हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले,
            <br />
            बहुत निकले मेरे अरमान लेकिन फिर भी कम निकले।
          </p>
          <p className="mt-4 text-base leading-relaxed text-soft">
            A thousand desires, each one worth giving everything for.
            <br />
            Many of my wishes came true, and still they felt too few.
          </p>
          <p className="mt-[18px] text-accent">— Mirza Ghalib</p>
        </div>
      </section>

      {/* END CREDITS */}
      <footer id="credits" className="mx-auto max-w-[1200px] px-8 pb-28 pt-24 md:pb-12">
        <div className="flex flex-wrap gap-14">
          <div className="flex-[1_1_320px]">
            <p className="mb-2 text-[13px] uppercase tracking-[3px] text-accent">End credits</p>
            <MagneticText as="h2" text="Say hello" className={`${h2} mb-5`} />
            <p className="mb-7 text-soft">For work, a film recommendation, or a ghazal I should hear.</p>
            <div className="flex flex-wrap gap-3">
              <a href={site.github} target="_blank" rel="noopener" aria-label="GitHub" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line2 text-ink">
                <GitHubIcon />
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line2 text-ink">
                <LinkedInIcon />
              </a>
              <a href={site.resume} download className="btn-ghost min-h-12 border-accent text-accent">
                Download resume
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
        <div className="mt-20 flex flex-wrap justify-between gap-3 border-t border-line pt-6 text-[13px] text-muted">
          <span>Written, directed and built by {site.name}</span>
          <span>Howrah · 2026</span>
        </div>
      </footer>

      <SideTabs />
    </Reveal>
  );
}
