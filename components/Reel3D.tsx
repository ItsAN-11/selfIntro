"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type WheelEvent } from "react";
import gsap from "gsap";
import { useMounted } from "@/lib/useMounted";

/** Landing page: a 3D film reel that unrolls scene by scene, then leads to /home. */

const R = 150; // reel radius
const W = 260; // film width
const T = 124; // reel thickness
const NECK = 160; // film narrowing onto the reel
const FL = 440; // one frame (scene) length
const PL = 4 * FL;
const L = PL + NECK;
const N = 48; // segments around the reel

const FLANGE_D =
  "M170 4a166 166 0 1 0 0.01 0z M113.9 43.9A138 138 0 0 1 226.1 43.9L191.2 122.5A52 52 0 0 0 148.8 122.5Z M272.6 77.7A138 138 0 0 1 307.2 184.4L221.7 175.4A52 52 0 0 0 208.6 135.2Z M289.5 239.0A138 138 0 0 1 198.7 305.0L180.8 220.9A52 52 0 0 0 215.0 196.0Z M141.3 305.0A138 138 0 0 1 50.5 239.0L125.0 196.0A52 52 0 0 0 159.2 220.9Z M32.8 184.4A138 138 0 0 1 67.4 77.7L131.4 135.2A52 52 0 0 0 118.3 175.4Z M170 157a13 13 0 1 0 0.01 0z M166 151h8v8h-8z";

const DARK_VARS =
  "--fl-hi:#F2F3FA;--fl-mid:#A9ACC8;--fl-lo:#5F6288;--fl-hi2:#C9CBE0;--fl-mid2:#80839F;--fl-lo2:#3F4166;--coil1:#3A2012;--coil2:#22120A;--coil3:#140A05;--coil-ring:#B8682E;--coil-edge:#D9894A;--film-a:#8C4A1E;--film-b:#3A1C0B;--film-c:#24110A;--hole:var(--deep);--hole-glow:none;--film-glow:0 0 0 1px #A85A24,0 12px 26px rgba(0,0,0,0.5);--frame-line:#120804;--track:#C98A4E;--track-op:0.45";
const LIGHT_VARS =
  "--fl-hi:#4A4C66;--fl-mid:#24253A;--fl-lo:#101120;--fl-hi2:#3A3C55;--fl-mid2:#1E1F32;--fl-lo2:#0C0D18;--coil1:#FFE2B0;--coil2:#F2A65A;--coil3:#C8742F;--coil-ring:#FFF4DC;--coil-edge:#FFF0D0;--film-a:#F7BE78;--film-b:#E79446;--film-c:#D88136;--hole:#FFFDF6;--hole-glow:0 0 7px rgba(255,236,190,0.95);--film-glow:0 0 0 1px #F9C98F,0 0 60px rgba(255,170,90,0.6),0 0 120px rgba(255,200,130,0.35);--frame-line:#1A0E06;--track:#FFF8E6;--track-op:0.95";

const toStyle = (s: string): CSSProperties =>
  Object.fromEntries(s.split(";").filter(Boolean).map((kv) => {
    const i = kv.indexOf(":");
    return [kv.slice(0, i), kv.slice(i + 1)];
  }));

const NEG_DARK = "invert(1) hue-rotate(180deg) sepia(0.55) saturate(1.7) hue-rotate(-12deg) brightness(0.95)";
const NEG_LIGHT = "invert(1) hue-rotate(180deg) sepia(0.45) saturate(1.6) hue-rotate(-12deg) brightness(1.08) contrast(0.95)";
const POS = "sepia(0.15) saturate(1.08) contrast(1.06) brightness(1.02)";

const TAGS = ["SCENE 1 · COVER", "SCENE 2 · WORK", "SCENE 3 · OFF-SCREEN", "SCENE 4"];

// A wobbly optical sound track along each frame.
const TRACK_PATH = (() => {
  let d = "M0 5";
  for (let x = 4; x <= 400; x += 4) {
    const y = 5 + 2.6 * Math.sin(x / 9) * Math.cos(x / 31) + 0.8 * Math.sin(x / 3.7);
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return d;
})();

function shade(a: number, spin: number, rgb: number[], amb: number) {
  const ang = ((a + spin) * Math.PI) / 180;
  const k = amb + (1 - amb) * (0.5 + 0.5 * Math.cos(ang + Math.PI * 0.25));
  return `rgb(${rgb.map((c) => Math.round(Math.min(255, c * (0.55 + 0.75 * k)))).join(",")})`;
}

type Cine = "idle" | "zoom" | "count" | "flash";

export default function Reel3D() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const LT = mounted && resolvedTheme === "light";

  const [lying, setLying] = useState(true);
  const [p, setP] = useState(0);
  const [scene, setScene] = useState(0);
  const [yaw, setYaw] = useState(-30);
  const [pitch, setPitch] = useState(64);
  const [dragging, setDragging] = useState(false);
  const [hov, setHov] = useState(-1);
  const [edgeDir, setEdgeDir] = useState(0);
  const [cine, setCine] = useState<Cine>("idle");
  const [count, setCount] = useState(3);
  const [chairHot, setChairHot] = useState(false);
  // On narrow screens the whole stage is scaled so one scene fits the width.
  const [fit, setFit] = useState({ s: 1, mobile: false });
  useEffect(() => {
    const on = () => {
      const vw = window.innerWidth;
      setFit({ s: Math.min(1, (vw - 24) / FL), mobile: vw < 768 });
    };
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number; p: number; moved: boolean } | null>(null);
  const edgeTimers = useRef<{ t?: ReturnType<typeof setTimeout>; i?: ReturnType<typeof setInterval>; dir: number }>({ dir: 0 });
  const lastWheel = useRef(0);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const state = useRef({ lying, scene, cine });
  useEffect(() => {
    state.current = { lying, scene, cine };
  }, [lying, scene, cine]);

  useEffect(() => {
    router.prefetch("/home");
  }, [router]);

  // Idle spin while the reel is lying on the floor.
  useEffect(() => {
    if (!lying || dragging) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tick = () => setYaw((y) => (y + 0.7) % 360);
    const id = setInterval(tick, 40);
    return () => clearInterval(id);
  }, [lying, dragging]);

  const goScene = useCallback((k: number) => {
    const n = Math.max(1, Math.min(4, k));
    setScene(n);
    setP(n * FL + NECK);
  }, []);

  /** Countdown leader → projector flash → homepage. */
  const playCountdown = useCallback(() => {
    if (state.current.cine !== "idle") return;
    tl.current?.kill();
    const t = gsap.timeline();
    // Phones skip the zoom into the reel and go straight to the countdown.
    const z = window.innerWidth < 768 ? 0 : 0.95;
    if (z) t.call(() => setCine("zoom"));
    t.call(() => { setCine("count"); setCount(3); }, [], z)
      .call(() => setCount(2), [], z + 0.35)
      .call(() => setCount(1), [], z + 0.7)
      .call(() => setCine("flash"), [], z + 1.05)
      .call(() => router.push("/home"), [], z + 1.25);
    tl.current = t;
  }, [router]);

  useEffect(() => () => {
    tl.current?.kill();
    clearTimeout(edgeTimers.current.t);
    clearInterval(edgeTimers.current.i);
  }, []);

  const unroll = useCallback(() => {
    setLying(false);
    setYaw(0);
    setPitch(0);
    setP(0);
    setScene(0);
    setTimeout(() => goScene(1), 900);
  }, [goScene]);

  const rollBy = useCallback(
    (n: number) => {
      const { lying: ly, scene: sc } = state.current;
      if (ly) {
        if (n > 0) unroll();
        return;
      }
      const cur = sc || 1;
      if (cur >= 4 && n > 0) {
        playCountdown();
        return;
      }
      goScene(cur + n);
    },
    [goScene, playCountdown, unroll],
  );

  const setEdge = useCallback(
    (dir: number) => {
      const e = edgeTimers.current;
      if (dir === e.dir) return;
      e.dir = dir;
      clearTimeout(e.t);
      clearInterval(e.i);
      setEdgeDir(dir);
      if (!dir) return;
      e.t = setTimeout(() => {
        // At the last scene only going back is allowed.
        const at4 = state.current.scene >= 4;
        if (dir > 0 && at4) return;
        rollBy(dir);
        e.i = setInterval(() => {
          if (dir > 0 && state.current.scene >= 4) return;
          rollBy(dir);
        }, 1500);
      }, 550);
    },
    [rollBy],
  );

  // ── pointer handling ──
  const onDown = (e: PointerEvent) => {
    const t = e.target as Element;
    if (t.closest("[data-chair]")) return;
    const btn = t.closest("a, button");
    if (btn && !/reel/i.test(btn.getAttribute("aria-label") || "")) return;
    drag.current = { x: e.clientX, y: e.clientY, yaw, pitch, p, moved: false };
    setDragging(true);
  };
  const onMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) {
      if (lying || cine !== "idle") return setEdge(0);
      const vw = window.innerWidth;
      setEdge(e.clientX > vw * 0.86 ? 1 : e.clientX < vw * 0.14 ? -1 : 0);
      return;
    }
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) d.moved = true;
    if (lying) {
      setYaw(d.yaw + dx * 0.6);
      setPitch(d.pitch - dy * 0.6);
    } else setP(Math.max(0, Math.min(L, d.p + dx * 1.2)));
  };
  const onUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    setDragging(false);
    if (!d.moved) {
      if (lying) unroll();
      else rollBy(1);
    } else if (!lying) goScene(Math.round((p - NECK) / FL));
  };
  const onCancel = () => {
    if (drag.current) {
      drag.current = null;
      setDragging(false);
    }
    setEdge(0);
  };
  const onWheel = (e: WheelEvent) => {
    if (cine !== "idle") return;
    const now = Date.now();
    if (now - lastWheel.current < 650 || Math.abs(e.deltaY) < 8) return;
    lastWheel.current = now;
    rollBy(e.deltaY > 0 ? 1 : -1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") rollBy(1);
      if (e.key === "ArrowLeft") rollBy(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rollBy]);

  // ── geometry ──
  const hub = 34;
  const maxR = R - 16;
  const woundR = Math.sqrt(hub * hub + (maxR * maxR - hub * hub) * Math.max(0, 1 - p / L));
  const spinDeg = lying ? 0 : ((p / R) * 180) / Math.PI;

  const edges = useMemo(() => {
    const out = [];
    for (let i = 0; i < N; i++) {
      const w = (2 * Math.PI * woundR) / N + 2;
      out.push({ w, a: (i * 360) / N, c: shade((i * 360) / N, spinDeg, LT ? [236, 152, 78] : [62, 32, 14], LT ? 0.7 : 0.3) });
    }
    return out;
  }, [woundR, spinDeg, LT]);

  const rims = useMemo(() => {
    const out = [];
    const rw = (2 * Math.PI * R) / N + 2;
    for (const [side, z] of [[0, T / 2], [1, -T / 2]] as const)
      for (let i = 0; i < N; i++)
        out.push({ rw, z, a: (i * 360) / N, c: shade((i * 360) / N, spinDeg, LT ? [58, 60, 82] : side ? [150, 153, 185] : [205, 208, 232], 0.45) });
    return out;
  }, [spinDeg, LT]);

  const sc = 170 / R;
  const wv = woundR * sc;
  const rings = useMemo(() => {
    let d = "";
    for (let r = hub * sc; r < wv - 2; r += 5) d += `M${170 + r} 170 a${r} ${r} 0 1 0 ${-2 * r} 0 a${r} ${r} 0 1 0 ${2 * r} 0 `;
    return d.trim();
  }, [wv, sc]);

  const zooming = !fit.mobile && (cine === "zoom" || cine === "count"); // no zoom on phones
  const revealed = dragging && !lying ? Math.max(0, Math.min(4, Math.floor((p - NECK + FL * 0.35) / FL))) : scene;
  const focusIdx = Math.max(0, revealed - 1);
  const camX = lying ? 0 : zooming ? -(3.5 * FL) : dragging || !scene ? -Math.max(0, p - 300) : -((scene - 0.5) * FL + (fit.mobile ? 0 : 60));
  const ease = "cubic-bezier(.2,.7,.2,1)";
  const reelTr = dragging ? "none" : lying ? "transform 120ms linear" : `transform 1000ms ${ease}`;
  const reelX = lying ? 0 : p;
  const neckN = Math.min(NECK, p) || 1;
  const neckPts = `0,${((W - T) / 2) * (1 - neckN / NECK)} 160,${(W - T) / 2} 160,${(W + T) / 2} 0,${W - ((W - T) / 2) * (1 - neckN / NECK)}`;

  const hint = lying
    ? fit.mobile
      ? "Tap the reel to set it rolling"
      : "Drag in any direction to turn the reel · click to set it rolling"
    : revealed >= 4
      ? fit.mobile
        ? "Scene 4 of 4 · pull up a chair"
        : "Scene 4 of 4 · pull up a chair in the reel, or go back ◀"
      : fit.mobile
        ? `Scene ${Math.max(1, revealed)} of 4 · tap or swipe for the next`
        : `Scene ${Math.max(1, revealed)} of 4 · take your time — next scene: click the reel, scroll, or rest your mouse on the right edge`;

  const edgeL = !lying && cine === "idle" && revealed > 1 ? (edgeDir === -1 ? 1 : 0.45) : 0;
  const edgeR = !lying && cine === "idle" && revealed > 0 && revealed < 4 ? (edgeDir === 1 ? 1 : 0.45) : 0;
  const wedge = ((4 - count) / 3) * 360;

  const coil = (id: string, z: number) => (
    <svg aria-hidden width={2 * R} height={2 * R} viewBox="0 0 340 340" className="absolute" style={{ left: -R, top: -R, transform: `translateZ(${z}px)` }}>
      <defs>
        <radialGradient id={id} cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" style={{ stopColor: "var(--coil1)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--coil2)" }} />
          <stop offset="1" style={{ stopColor: "var(--coil3)" }} />
        </radialGradient>
      </defs>
      <circle cx="170" cy="170" r={wv} fill={`url(#${id})`} />
      <path d={rings} fill="none" style={{ stroke: "var(--coil-ring)" }} strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="170" cy="170" r={wv} fill="none" style={{ stroke: "var(--coil-edge)" }} strokeWidth="2" />
      <circle cx="170" cy="170" r="40" fill="#8E91B0" />
      <circle cx="170" cy="170" r="40" fill="none" stroke="#5F6288" strokeWidth="3" />
    </svg>
  );

  const flange = (id: string, z: number, back: boolean) => (
    <svg
      aria-hidden
      width={2 * R}
      height={2 * R}
      viewBox="0 0 340 340"
      className="absolute"
      style={{ left: -R, top: -R, transform: `translateZ(${z}px)${back ? " rotateY(180deg)" : ""}`, filter: "drop-shadow(0 0 1.5px rgba(0,0,0,0.7))" }}
    >
      <defs>
        <linearGradient id={`${id}a`} x1="0.1" y1="0" x2="0.9" y2="1">
          {(back ? ["--fl-hi2", "--fl-mid2", "--fl-hi2", "--fl-mid2", "--fl-lo2"] : ["--fl-hi", "--fl-mid", "--fl-hi", "--fl-mid", "--fl-lo"]).map((v, i) => (
            <stop key={i} offset={[0, 0.35, 0.55, 0.8, 1][i]} style={{ stopColor: `var(${v})` }} />
          ))}
        </linearGradient>
        <radialGradient id={`${id}b`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.35" />
        </radialGradient>
        <clipPath id={`${id}c`}>
          <path fillRule="evenodd" clipRule="evenodd" d={FLANGE_D} />
        </clipPath>
      </defs>
      <path fillRule="evenodd" fill={`url(#${id}a)`} d={FLANGE_D} />
      <g clipPath={`url(#${id}c)`}>
        {Array.from({ length: 49 }, (_, i) => (
          <circle key={i} cx="170" cy="170" r={20 + i * 3} fill="none" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1" />
        ))}
        <rect width="340" height="340" fill={`url(#${id}b)`} />
      </g>
      <path fillRule="evenodd" fill="none" stroke="#2A2C48" strokeOpacity="0.55" strokeWidth="2" d={FLANGE_D} />
      <circle cx="170" cy="170" r="165" fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2" />
      <circle cx="170" cy="170" r="30" fill="none" stroke="#2A2C48" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx="170" cy="170" r="160" fill="none" stroke="#2A2C48" strokeOpacity="0.35" strokeWidth="1.5" />
    </svg>
  );

  const frames = (hit: boolean) => (
    <div className="flex" style={{ width: PL, height: W }}>
      {TAGS.map((tag, i) => {
        const on = hov === i;
        const live = hit && !lying && i < revealed;
        const filter = on !== LT ? (LT ? NEG_LIGHT : NEG_DARK) : POS;
        const glow = on
          ? "0 0 0 2px #E8893A, 0 0 30px rgba(232,137,58,0.45)"
          : LT
            ? "0 0 22px rgba(255,214,150,0.75), inset 0 0 18px rgba(255,255,255,0.35)"
            : "inset 0 0 16px rgba(0,0,0,0.35)";
        return (
          <div
            key={tag}
            className="relative box-border flex flex-none flex-col justify-between py-2"
            style={{ width: FL, height: W, borderRight: hit ? "2px solid transparent" : "2px solid var(--frame-line)" }}
          >
            {!hit && (
              <svg aria-hidden viewBox="0 0 400 10" preserveAspectRatio="none" className="absolute" style={{ left: 14, top: 23, width: "calc(100% - 28px)", height: 9, opacity: "var(--track-op)" }}>
                <path d={TRACK_PATH} fill="none" style={{ stroke: "var(--track)" }} strokeWidth="1.2" />
              </svg>
            )}
            <Holes hidden={hit} />
            <div
              data-hot={live ? "" : undefined}
              onMouseEnter={live ? () => setHov(i) : undefined}
              onMouseLeave={live ? () => setHov((h) => (h === i ? -1 : h)) : undefined}
              className={`relative mx-3 overflow-hidden rounded-[3px] antialiased ${hit ? "" : "bg-[#241D17] text-[#F1E8D8]"}`}
              style={
                hit
                  ? { height: W - 70, pointerEvents: live ? "auto" : "none" }
                  : { height: W - 70, filter, boxShadow: glow, transition: "filter 450ms ease, box-shadow 450ms ease" }
              }
            >
              {/* In light mode the hovered scene's content zooms in */}
              <div
                className={`absolute inset-0 ${hit ? "invisible" : ""}`}
                style={{ transform: `scale(${on && LT ? 1.12 : 1})`, transition: "transform 500ms cubic-bezier(.2,.8,.2,1)" }}
              >
                <span className="absolute right-2.5 top-2 font-typewriter text-[11px] tracking-[1px] text-[#A89C8A]">{tag}</span>
                {i === 0 && <SceneCover />}
                {i === 1 && <SceneWork />}
                {i === 2 && <SceneOffscreen />}
                {i === 3 && (
                  <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 p-[22px]">
                    <span className="font-typewriter text-[13px] tracking-[2px] text-[#A89C8A]">THE END?</span>
                    <span className="font-display text-[30px] font-bold leading-[1.05]">No — this is where it starts.</span>
                    {hit ? (
                      <Link
                        href="/home"
                        data-chair
                        tabIndex={live ? 0 : -1}
                        className="visible relative z-[5] inline-flex min-h-11 items-center rounded-full px-[22px] text-[13px] font-bold uppercase tracking-[1.5px] text-transparent no-underline outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#E0A54A]"
                        style={{ pointerEvents: live ? "auto" : "none" }}
                        onClick={(e) => {
                          // Play the countdown + flash first; it navigates to /home at the end.
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                          e.preventDefault();
                          playCountdown();
                        }}
                        onMouseEnter={() => setChairHot(true)}
                        onMouseLeave={() => setChairHot(false)}
                      >
                        Pull up a chair →
                      </Link>
                    ) : (
                      <span
                        className="relative z-[5] inline-flex min-h-11 items-center rounded-full bg-[#E0A54A] px-[22px] text-[13px] font-bold uppercase tracking-[1.5px] text-[#14110F] transition-transform duration-200"
                        style={{ transform: chairHot ? "translateY(-2px) scale(1.04)" : "none" }}
                      >
                        Pull up a chair →
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Holes hidden={hit} />
            {!hit && (
              <>
                <span aria-hidden className="absolute bottom-[21px] left-4 font-typewriter text-[9px] tracking-[2px] text-[#F0A35E] opacity-75">
                  ▸ {String(i + 1).padStart(2, "0")}A
                </span>
                <span aria-hidden className="absolute bottom-[21px] right-4 font-typewriter text-[9px] tracking-[2px] text-[#F0A35E] opacity-75">
                  AG · 2026 · SAFETY FILM
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onCancel}
      className="relative flex min-h-[100dvh] select-none flex-col justify-center overflow-hidden pb-20 pt-16 text-ink md:pb-12 md:pt-[72px]"
      style={{ background: "radial-gradient(ellipse at 50% 70%, var(--surface2) 0%, var(--deep) 60%)", touchAction: "none" }}
    >
      <span className="absolute left-5 top-7 z-[6] text-[10px] uppercase tracking-[2.5px] text-muted md:left-8 md:top-8 md:text-xs md:tracking-[3px]">A Howrah production</span>
      <Link href="/home" className="absolute right-5 top-[18px] z-[6] inline-flex md:right-8 md:top-[22px] min-h-11 items-center text-xs uppercase tracking-[2px] text-soft">
        Skip →
      </Link>

      {/* 3D STAGE (scaled down to fit on phones) */}
      <div className="relative" style={{ height: 600 * fit.s - (fit.mobile ? 70 : 0) }}>
      <div
        onPointerDown={onDown}
        onWheel={onWheel}
        className="relative h-[600px] cursor-grab"
        style={{
          ...toStyle(LT ? LIGHT_VARS : DARK_VARS),
          perspective: 1600,
          perspectiveOrigin: lying ? "50% 28%" : "50% 50%",
          transform: fit.s < 1 ? `scale(${fit.s})` : undefined,
          transformOrigin: "50% 0",
        }}
      >
        <div
          className="absolute left-1/2 h-0 w-0"
          style={{
            top: lying ? "66%" : "50%",
            transformStyle: "preserve-3d",
            transform: `translateZ(${zooming ? 820 : 0}px) rotateX(${lying ? -22 : zooming ? -90 : -88}deg) translateX(${camX}px)`,
            transition: `${dragging ? "transform 0ms" : `transform 1200ms ${ease}`}, top 1000ms ${ease}`,
          }}
        >
          {/* floor light */}
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              left: -1400,
              top: -900,
              width: 4400,
              height: 1800,
              transformOrigin: "1400px 900px",
              transform: "rotateX(90deg)",
              background: "radial-gradient(ellipse at 1400px 900px, rgba(224,165,74,0.10) 0%, rgba(224,165,74,0) 22%)",
            }}
          />

          {/* film laid on the floor (visual only) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 overflow-hidden"
            style={{
              height: W,
              width: lying ? 0 : Math.max(0, p - NECK),
              transformOrigin: "0 0",
              transform: `rotateX(90deg) translateY(${-W / 2}px)`,
              transition: dragging ? "box-shadow 500ms ease" : `width 1000ms ${ease}, box-shadow 500ms ease`,
              background: "linear-gradient(180deg, var(--film-a) 0px, var(--film-b) 22px, var(--film-c) 50%, var(--film-b) calc(100% - 22px), var(--film-a) 100%)",
              boxShadow: "var(--film-glow)",
              opacity: lying ? 0 : 1,
            }}
          >
            {frames(false)}
          </div>

          {/* Invisible hit layer: Chrome can't hit-test clipped 3D elements */}
          <div
            className="absolute left-0 top-0"
            style={{ height: W, width: PL, transformOrigin: "0 0", transform: `rotateX(90deg) translateY(${-W / 2}px)`, pointerEvents: "none" }}
          >
            {frames(true)}
          </div>

          {/* neck: the film narrowing as it winds onto the reel */}
          <svg
            aria-hidden
            viewBox="0 0 160 260"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-0 top-0"
            style={{
              width: 160,
              height: W,
              transformOrigin: "0 0",
              transform: `translateX(${lying ? 0 : Math.max(0, p - NECK)}px) rotateX(90deg) translateY(${-W / 2}px)`,
              opacity: !lying && p > 4 ? 1 : 0,
              transition: dragging ? "none" : `transform 1000ms ${ease}, opacity 400ms ease`,
            }}
          >
            <polygon points={neckPts} style={{ fill: "var(--film-c)", stroke: "var(--film-a)" }} strokeWidth="1" />
          </svg>

          {/* shadow under the reel */}
          <div
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              left: reelX - R,
              top: -R,
              width: 2 * R,
              height: 2 * R,
              background: "radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)",
              transform: `rotateX(90deg) scale(${lying ? 0.8 : 0.45}, 1)`,
              transition: dragging ? "none" : `left 1000ms ${ease}, transform 1000ms ${ease}`,
            }}
          />

          {/* THE REEL */}
          <button
            type="button"
            aria-label={lying ? "Open the reel" : "Film reel — roll forward one scene"}
            onClick={(e) => {
              if (e.detail !== 0) return;
              if (lying) unroll();
              else rollBy(1);
            }}
            className="absolute left-0 top-0 h-0 w-0 border-0 bg-transparent p-0"
            style={{
              transformStyle: "preserve-3d",
              transform: `translateX(${reelX}px) translateY(${lying ? -R - 40 : -R}px) rotateY(${lying ? yaw : 0}deg) rotateX(${lying ? pitch : 0}deg) rotateZ(${spinDeg}deg)`,
              transition: reelTr,
            }}
          >
            {edges.map((e, i) => (
              <span
                key={i}
                aria-hidden
                className="absolute"
                style={{
                  left: -e.w / 2,
                  top: -(T - 16) / 2,
                  width: e.w,
                  height: T - 16,
                  background: `repeating-linear-gradient(90deg, rgba(235,190,140,0.85) 0 5px, transparent 5px 12px) 0 6px / 100% 6px no-repeat, repeating-linear-gradient(90deg, rgba(235,190,140,0.85) 0 5px, transparent 5px 12px) 0 calc(100% - 12px) / 100% 6px no-repeat, linear-gradient(180deg, #A5561F 0 4px, transparent 4px calc(100% - 4px), #A5561F calc(100% - 4px)), linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0) 60%), ${e.c}`,
                  transform: `rotateZ(${e.a}deg) translateY(${-woundR}px) rotateX(90deg)`,
                  backfaceVisibility: "visible",
                }}
              />
            ))}
            {coil("cfA", (T - 16) / 2 - 1)}
            {coil("cfB", -(T - 16) / 2 + 1)}
            {flange("fla", T / 2, false)}
            {flange("flb", -T / 2, true)}
            {rims.map((m, i) => (
              <span
                key={i}
                aria-hidden
                className="absolute"
                style={{ left: -m.rw / 2, top: -3, width: m.rw, height: 6, background: m.c, transform: `translateZ(${m.z}px) rotateZ(${m.a}deg) translateY(${-R}px) rotateX(90deg)` }}
              />
            ))}
          </button>
        </div>
      </div>
      </div>

      {/* edge cues (mouse only) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[5] hidden w-[14%] md:flex items-center pl-[22px] transition-opacity duration-300"
        style={{ opacity: edgeL, background: "linear-gradient(90deg, rgba(var(--deep-rgb),0.7), rgba(var(--deep-rgb),0))" }}
      >
        <span className="font-typewriter text-[13px] tracking-[1px] text-soft">◀ previous scene</span>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[5] hidden w-[14%] md:flex items-center justify-end pr-[22px] transition-opacity duration-300"
        style={{ opacity: edgeR, background: "linear-gradient(270deg, rgba(var(--deep-rgb),0.7), rgba(var(--deep-rgb),0))" }}
      >
        <span className="font-typewriter text-[13px] tracking-[1px] text-soft">next scene ▶</span>
      </div>

      {/* caption + controls (the only "Pull up a chair" lives inside the reel) */}
      <div className="relative z-[4] mt-2 flex flex-col items-center gap-3 text-center">
        <span className="px-6 font-typewriter text-[13px] tracking-[1.5px] text-soft md:text-[15px] md:tracking-[2px]">{hint}</span>
        <div className="flex items-center gap-3.5">
          <button type="button" onClick={() => rollBy(-1)} aria-label="Roll the film back one scene" className="h-11 w-11 rounded-full border border-line2 bg-transparent text-sm text-soft">
            ◀
          </button>
          <div aria-hidden className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: !lying && i === focusIdx && revealed > 0 ? 22 : 8, background: i < revealed ? "var(--accent)" : "var(--line)" }}
              />
            ))}
          </div>
          <button type="button" onClick={() => rollBy(1)} aria-label="Roll the film forward one scene" className="h-11 w-11 rounded-full border border-line2 bg-transparent text-sm text-soft">
            ▶
          </button>
        </div>
      </div>

      {/* film-leader countdown */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-deep transition-opacity duration-[350ms]"
        style={{ opacity: cine === "count" ? 1 : 0 }}
      >
        <div
          className="relative flex h-80 w-80 items-center justify-center rounded-full border-[3px] border-soft"
          style={{ background: `conic-gradient(rgba(224,165,74,0.35) 0deg ${wedge}deg, var(--bg) ${wedge}deg 360deg)` }}
        >
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-faint" />
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-faint" />
          <span className="relative font-typewriter text-[170px] leading-none text-ink">{count}</span>
        </div>
        <div className="absolute inset-0 opacity-80" style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 3px)" }} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[31] bg-[#FFF6E4] transition-opacity duration-[420ms]"
        style={{ opacity: cine === "flash" ? 0.9 : 0 }}
      />
    </div>
  );
}

function Holes({ hidden = false }: { hidden?: boolean }) {
  return (
    <div aria-hidden className={`flex justify-around px-1.5 ${hidden ? "invisible" : ""}`}>
      {Array.from({ length: 13 }, (_, i) => (
        <span key={i} className="h-[9px] w-[13px] rounded-[2px]" style={{ background: "var(--hole)", boxShadow: "var(--hole-glow)" }} />
      ))}
    </div>
  );
}

function SceneCover() {
  return (
    <>
      <figure className="absolute left-3 top-2 m-0 w-[124px] -rotate-[5deg] bg-[#F1E8D8] px-1.5 pt-1.5 shadow-[0_8px_16px_rgba(0,0,0,0.55)]">
        <div className="aspect-[3/4] w-full overflow-hidden bg-[#241D17]">
          <img src="/images/dusk-cafe.jpg" alt="Anjali at a waterside cafe at dusk" draggable={false} className="block h-full w-full object-cover object-[50%_30%]" />
        </div>
        <figcaption className="flex h-6 items-center justify-center font-hand text-base text-[#3A322B]">hi, that&apos;s me</figcaption>
      </figure>
      <span className="absolute left-[150px] top-[26px] rotate-2 font-display text-[42px] font-bold leading-[0.9] text-[#F1E8D8]">
        Anjali
        <br />
        Gupta
      </span>
      <span className="absolute left-[158px] top-[122px] -rotate-3 bg-[#E8DDC8] px-[9px] py-1 font-typewriter text-[13px] text-[#241D17] shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
        from Howrah, India
      </span>
      <span className="absolute left-[146px] top-[160px] rotate-[4deg] rounded-full bg-[#E0A54A] px-[11px] py-1 text-xs font-bold text-[#14110F]">at Senrysa Technologies</span>
    </>
  );
}

function SceneWork() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-3 p-[22px]">
      <span className="font-display text-[30px] font-bold leading-[1.05]">I build the backend behind e-commerce.</span>
      <div className="flex flex-wrap gap-2">
        {["ONDC", "Unizap", "Rydex"].map((t) => (
          <span key={t} className="rounded-full border border-[#E0A54A] px-[11px] py-1 text-xs text-[#E0A54A]">
            {t}
          </span>
        ))}
      </div>
      <span className="text-[13px] text-[#CFC3B0]">Spring Boot · NestJS · Kafka · Postgres · Redis</span>
    </div>
  );
}

function SceneOffscreen() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2.5 p-[22px]">
      <span className="font-display text-[28px] font-bold leading-[1.1]">Off-screen, I teach computer science to school students.</span>
      <span className="font-display text-[22px] italic text-[#E0A54A]">chai, ghazal aur code</span>
    </div>
  );
}
