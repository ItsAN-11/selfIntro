import type { Metadata } from "next";
import Link from "next/link";
import MagneticText from "@/components/MagneticText";
import ProjectList from "@/components/ProjectList";
import TenureRow from "@/components/TenureRow";
import Reveal from "@/components/Reveal";
import { projects } from "@/data/projects";
import { tenure } from "@/data/tenure";
import { freelanceIntro, gigs, services, steps } from "@/data/freelance";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "All projects — Anjali Gupta" };

const big = "font-display text-[clamp(44px,6vw,80px)] font-bold leading-none";
const topLink = "inline-flex min-h-11 items-center text-sm uppercase tracking-[2px] no-underline";

export default function ProjectsPage() {
  return (
    <Reveal className="min-h-screen leading-relaxed">
      <header className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-8 pt-9">
        <Link href="/home" className={`${topLink} border-b-2 border-accent text-ink`}>
          ← Anjali
        </Link>
        <span className="inline-flex gap-7">
          <a href={site.github} target="_blank" rel="noopener" className={`${topLink} text-accent`}>
            GitHub ↗
          </a>
          <a href={site.resume} target="_blank" rel="noopener" className={`${topLink} text-accent`}>
            Resume.pdf
          </a>
        </span>
      </header>

      <section className="mx-auto max-w-[1200px] px-8 pb-8 pt-[72px]">
        <MagneticText as="p" text="Filmography" className="mb-3 text-[13px] uppercase tracking-[3px] text-accent" />
        <h1 className="font-display text-[clamp(64px,10vw,150px)] font-bold leading-[0.95]">
          All projects{" "}
          <span className="align-super font-sans text-[0.32em] font-medium text-accent">[{projects.length}]</span>
        </h1>
        <p className="mt-6 max-w-[620px] text-lg text-soft">
          The things I&apos;ve built at work and on my own — what each one does, what I owned, and how it&apos;s put together. Open any project for the
          story.
        </p>
      </section>

      <ProjectList />

      {/* PROFESSIONAL TENURE */}
      <section id="journey" className="mx-auto max-w-[1200px] px-8 pb-24 pt-[140px]">
        <h2 className={`${big} mb-9`} data-reveal>
          professional <span className="font-medium italic text-accent">tenure</span>.
        </h2>
        <div className="border-t border-line2">
          {tenure.map((j, i) => (
            <TenureRow key={j.role} j={j} defaultOpen={i === 1} />
          ))}
        </div>
      </section>

      {/* FREELANCE */}
      <section id="freelance" className="mx-auto max-w-[1200px] px-8 pb-[140px] pt-[60px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5" data-reveal>
          <div>
            <h2 className={big}>
              freelance <span className="font-medium italic text-accent">work</span>.
            </h2>
            <p className="mt-3.5 max-w-[620px] text-[17px] text-soft">{freelanceIntro}</p>
          </div>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line2 px-4 py-2 text-[13px] font-semibold text-text2">
            <span aria-hidden className="h-[9px] w-[9px] rounded-full bg-[#5FBF7A] shadow-[0_0_0_4px_rgba(95,191,122,.2)]" />
            Available for freelance
          </span>
        </div>

        <div className="mb-9 flex flex-wrap gap-2.5">
          {services.map((s) => (
            <span key={s} className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-text2">
              {s}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {gigs.map((g) => (
            <article key={g.title} data-reveal className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[26px]">
              <div className="flex items-center justify-between gap-2.5 text-xs text-muted">
                <span className="uppercase tracking-[2px]">{g.kind}</span>
                <span>{g.when}</span>
              </div>
              <h3 className="font-display text-2xl font-bold leading-tight">{g.title}</h3>
              <p className="text-[15px] text-soft">{g.what}</p>
              <p className="text-sm text-text2">
                <span className="font-bold text-accent">Result · </span>
                {g.result}
              </p>
              <span className="mt-auto pt-1.5 text-[13px] text-muted">{g.stack}</span>
            </article>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-dashed border-line2 px-7 py-6">
          <div className="flex flex-wrap gap-x-[26px] gap-y-2.5 text-sm text-soft">
            {steps.map((s, i) => (
              <span key={s}>
                <strong className="text-ink">{i + 1} ·</strong> {s}
              </span>
            ))}
          </div>
          <Link href="/home#credits" className="btn-accent min-h-12 px-6 uppercase tracking-[1.5px]">
            Start a project
          </Link>
        </div>
      </section>

      {/* GITA */}
      <section className="border-y border-line">
        <div className="mx-auto max-w-[900px] px-8 py-24 text-center" data-reveal>
          <p className="mb-6 text-[13px] uppercase tracking-[3px] text-accent">Words I work by</p>
          <p lang="sa" className="font-hindi text-[clamp(26px,3.4vw,42px)] leading-[1.55]">
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
            <br />
            मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
          </p>
          <p className="mt-[18px] leading-relaxed text-soft">
            You have the right to perform your actions, but never to their fruits.
            <br />
            Do not let the results of your actions be your motive, nor become attached to inaction.
          </p>
          <p className="mt-[18px] text-accent">— Bhagavad Gita, 2.47</p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto flex max-w-[1200px] flex-wrap items-end justify-between gap-8 px-8 pb-28 pt-[120px]">
        <h2 className="max-w-[760px] font-display text-[clamp(34px,4.6vw,60px)] font-bold leading-[1.05] tracking-[-0.5px]">
          Building something? Need a <span className="italic text-accent">backend</span> or a <span className="italic text-accent">website</span> that
          holds up? <span className="font-medium text-soft">Let’s talk over chai.</span>
        </h2>
        <Link href="/home#credits" className="btn-accent min-h-14 px-8 text-[15px] uppercase tracking-[2px]">
          Get in touch <span aria-hidden>→</span>
        </Link>
      </section>
    </Reveal>
  );
}
