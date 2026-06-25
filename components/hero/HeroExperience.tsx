"use client";

/**
 * HERO EXPERIENCE — four real, full-height sections with one continuous Iron
 * Man suit travelling across all of them.
 *
 * Architecture (mirrors drei's ScrollControls — the robust, production pattern):
 *
 *   ┌ FIXED visual layer (z-0, covers viewport) ───────────────┐
 *   │   • BeatBackdrops  (nebula → resting photo cross-fade)    │
 *   │   • <Canvas>       (suit + ribbons + lighting + bloom)    │
 *   │   • vignette + shared HUD                                 │
 *   └──────────────────────────────────────────────────────────┘
 *   ┌ SCROLL spacer (z-10, 400vh) ─────────────────────────────┐
 *   │   section 0  HERO   — title top / scroll cue              │
 *   │   section 1  ABOUT  — copy on the RIGHT  (suit slides L)  │
 *   │   section 2  STATS  — copy on the LEFT   (suit slides R)  │
 *   │   section 3  REST   — center / register  (resting bg)     │
 *   └──────────────────────────────────────────────────────────┘
 *
 * Why fixed-layer + spacer rather than pinning:
 *   • each section is a genuine 100vh DOM block with its own copy → "4 real
 *     sections", not one section swapping contents;
 *   • the canvas never unmounts, so the suit reads as ONE object moving through
 *     all four beats — only the scroll-driven transforms change;
 *   • no ScrollTrigger pin here means zero interaction with the Tracks pin
 *     below. We simply hide the fixed layer once the hero scrolls out of view.
 *
 * Scroll path: ScrollTrigger (synced to Lenis in SmoothScroll) writes
 * heroState.progress; the R3F loop in IronManStage reads it every frame.
 */
import { useEffect, useRef, useState } from "react";
import { Canvas, invalidate } from "@react-three/fiber";
import { Preload, AdaptiveDpr } from "@react-three/drei";
import { registerGsap } from "@/lib/gsap";
import { IronManStage } from "./three/IronManStage";
import { heroState } from "./three/heroState";
import { Particles } from "./Particles";
import { ScrollCue } from "./ScrollCue";

function detectHighQuality(): boolean {
  if (typeof window === "undefined") return true;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 760;
  const lowCores =
    typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4;
  return !(coarse && narrow) && !lowCores;
}

export function HeroExperience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // one backdrop layer per beat (nebula / gold / cyan / resting)
  const bgNebulaRef = useRef<HTMLDivElement>(null);
  const bgGoldRef = useRef<HTMLDivElement>(null);
  const bgCyanRef = useRef<HTMLDivElement>(null);
  const bgRestRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // one-time client capability probe
  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hq = detectHighQuality();
    heroState.reduced = r;
    heroState.highQuality = hq;
    heroState.vw = window.innerWidth;
    setReduced(r);
    setHighQuality(hq);
    setMounted(true);

    const onResize = () => (heroState.vw = window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // scroll → progress, active-gating, backdrop cross-fade, text reveals
  useEffect(() => {
    if (!mounted) return;
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;
    const { gsap, ScrollTrigger } = registerGsap();

    const ctx = gsap.context(() => {
      // SINGLE master driver — one source of truth for progress, the 4 backdrop
      // cross-fades, the exit dissolve, and the active gate.
      //
      // End at "bottom top": the stage stays alive across the ENTIRE 400vh
      // wrapper (scrollY 0 → 400vh), so the suit never vanishes mid-section —
      // including beat 3, whose CTA (SUIT UP / CLAIM YOUR ID) sits low and is
      // only centered around scrollY ≈ 340vh.
      //
      // raw→choreo: with this range, sections fill the viewport at raw =
      // 0,0.25,0.5,0.75. We divide by REST_SETTLE = 0.75 so the four beats land
      // exactly on those stops and the final REST pose is reached when section 4
      // first fills the viewport, then HELD for the last quarter while you read
      // the CTA and the stage dissolves out into the marquee.
      const REST_SETTLE = 0.75;
      ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const raw = self.progress; // 0..1 over the full wrapper travel
          const choreo = Math.min(1, raw / REST_SETTLE); // beats 0→3, then holds
          heroState.progress = choreo;
          // on-demand loop (reduced motion) needs an explicit frame request
          if (heroState.reduced) invalidate();

          // Cross-fade the 4 beat backdrops. Each beat is centered at choreo =
          // i/3; a layer is fully opaque at its own stop and fades to 0 by the
          // neighbouring stops (triangular blend over the 0.333 gap). The nebula
          // also gets a subtle parallax drift on top of its opacity.
          const STOP = [0, 1 / 3, 2 / 3, 1];
          const amt = (i: number) =>
            Math.max(0, 1 - Math.abs(choreo - STOP[i]) / (1 / 3));
          if (bgNebulaRef.current) {
            bgNebulaRef.current.style.opacity = String(amt(0));
            bgNebulaRef.current.style.transform = `scale(${1.05 + choreo * 0.08}) translateY(${choreo * -3}%)`;
          }
          if (bgGoldRef.current) bgGoldRef.current.style.opacity = String(amt(1));
          if (bgCyanRef.current) bgCyanRef.current.style.opacity = String(amt(2));
          if (bgRestRef.current) bgRestRef.current.style.opacity = String(amt(3));

          // Exit dissolve: hold the stage fully opaque through the CTA reading
          // zone, then fade the whole layer (model + backdrops together) to 0
          // over the last sliver of scroll so it hands off smoothly to the
          // marquee instead of hard-cutting or painting over it.
          const exit = Math.max(0, (raw - 0.9) / 0.1); // 0 until raw .9 → 1 at 1
          stage.style.opacity = String(1 - exit);
        },
        onToggle: (self) => {
          // Active across the whole wrapper; hard-hide only once fully past it
          // so the fixed layer can never bleed behind the Tracks section.
          heroState.active = self.isActive;
          stage.style.visibility = self.isActive ? "visible" : "hidden";
        },
      });

      // light text reveals per beat (skipped under reduced motion)
      if (!reduced) {
        wrap.querySelectorAll<HTMLElement>("[data-beat-copy]").forEach((el) => {
          gsap.from(el.querySelectorAll(".reveal"), {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: el,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          });
        });
      }

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [mounted, reduced]);

  return (
    <>
      {/* ══ FIXED VISUAL LAYER (backdrops + 3D suit), z-0 ═════════════
          Sits at z-0 (above the opaque body bg, below the hero's z-10 copy).
          It's only ever visible while the hero owns the viewport; the onToggle
          gate hard-hides it at the boundary so it never covers the marquee /
          Tracks that follow. */}
      <div
        ref={stageRef}
        className="fixed inset-0 z-0 overflow-hidden"
        style={{ background: "#08060f" }}
      >
        {/* ── Per-beat backdrops, one real background image per section.
             Stacked and cross-faded on scroll so each of the 4 beats has its
             own backdrop: nebula(0) → gold workshop(1) → cyan grid(2) →
             resting Hall of Armor(3). Driven from the scroll handler below. */}
        <div
          ref={bgNebulaRef}
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: "url('/img/hero/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          ref={bgGoldRef}
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/img/hero/hero-gold.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0,
          }}
        />
        <div
          ref={bgCyanRef}
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/img/hero/hero-cyan.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0,
          }}
        />
        <div
          ref={bgRestRef}
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/img/hero/resting.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0,
          }}
        />

        {/* drifting atmosphere particles behind the suit */}
        <div className="absolute inset-0">
          <Particles count={42} color="#FFD23F" className="opacity-35" />
          <Particles count={26} color="#7A3CFF" className="opacity-25" />
        </div>

        {/* the suit */}
        {mounted && (
          <Canvas
            className="!absolute inset-0"
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            dpr={highQuality ? [1, 1.75] : [1, 1.25]}
            camera={{ fov: 38, near: 0.1, far: 100, position: [0, 0, 7.4] }}
            frameloop={reduced ? "demand" : "always"}
            onCreated={() => setLoaded(true)}
          >
            <IronManStage highQuality={highQuality && !reduced} />
            <AdaptiveDpr pixelated={false} />
            <Preload all />
          </Canvas>
        )}

        {/* vignette to seat the centered suit + keep copy legible */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 44%, rgba(8,6,16,0.5) 82%, rgba(8,6,16,0.9) 100%)",
          }}
        />

        {/* cinematic letterbox bars — sells the "movie screen" framing. Sized
            so they sit above the title and below the CTA and never clip them. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[7vh] bg-gradient-to-b from-black/90 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[7vh] bg-gradient-to-t from-black/90 to-transparent" />

        {/* booting shimmer until GL is up */}
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="font-display text-cream/30 text-sm uppercase tracking-[0.5em] animate-pulse">
              Booting suit…
            </div>
          </div>
        )}

        {/* shared top HUD */}
        <div className="absolute top-24 left-0 right-0 flex justify-between px-6 md:px-12 text-[10px] md:text-xs uppercase tracking-[0.3em] text-cream/55 pointer-events-none">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
            STARK INDUSTRIES // 2026
          </span>
          <span className="hidden md:block">ARC REACTOR · ONLINE</span>
        </div>
      </div>

      {/* ══ SCROLL SPACER — 4 real sections (text only), z-10 ══════════ */}
      <div ref={wrapRef} className="relative z-10" style={{ height: "400vh" }}>
        {/* BEAT 0 — HERO */}
        <section className="relative h-screen w-full">
          <div className="absolute inset-x-0 top-[16vh] grid place-items-center px-6 text-center pointer-events-none">
            <div data-beat-copy>
              <p className="reveal mb-4 text-xs md:text-sm uppercase tracking-[0.5em] text-gold/90">
                The suit is ready · are you?
              </p>
              <h1 className="reveal font-display leading-[0.82] tracking-tight text-cream text-[18vw] md:text-[14vw] drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
                HACK<span className="text-crimson">·</span>O<span className="text-crimson">·</span>FEST
              </h1>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <ScrollCue />
          </div>
        </section>

        {/* BEAT 1 — ABOUT (suit RIGHT, copy LEFT) */}
        <section className="relative h-screen w-full">
          <div className="absolute inset-0 grid grid-cols-12 items-center px-6 md:px-16">
            <div data-beat-copy className="col-span-12 md:col-span-5 md:col-start-1 pointer-events-none">
              <p className="reveal text-xs uppercase tracking-[0.4em] text-gold/80 mb-4">
                01 — The Initiative
              </p>
              <h2 className="reveal font-display text-cream leading-[0.9] text-[11vw] md:text-[4.4vw] mb-5">
                BUILT FOR
                <br />
                BUILDERS.
              </h2>
              <p className="reveal text-cream/75 font-body text-base md:text-lg max-w-md">
                72 hours. One suit-up. A multiverse of code waiting to be forged.
              </p>
            </div>
          </div>
        </section>

        {/* BEAT 2 — STATS (suit LEFT, copy RIGHT) */}
        <section className="relative h-screen w-full">
          <div className="absolute inset-0 grid grid-cols-12 items-center px-6 md:px-16">
            <div data-beat-copy className="col-span-12 md:col-span-5 md:col-start-8 pointer-events-none">
              <p className="reveal text-xs uppercase tracking-[0.4em] text-cyan/80 mb-4">
                02 — The Numbers
              </p>
              <h2 className="reveal font-display text-cream leading-[0.9] text-[11vw] md:text-[4.4vw] mb-6">
                SIX TRACKS.
                <br />
                ONE GOAL.
              </h2>
              <div className="reveal flex gap-8 font-body">
                <Stat k="$50K" v="prize pool" />
                <Stat k="72h" v="to build" />
                <Stat k="∞" v="possibility" />
              </div>
            </div>
          </div>
        </section>

        {/* BEAT 3 — REST (suit CENTER, resting bg, register) */}
        <section className="relative h-screen w-full">
          <div className="absolute inset-x-0 bottom-[12vh] grid place-items-center px-6 text-center">
            <div data-beat-copy className="pointer-events-auto">
              <p className="reveal text-xs uppercase tracking-[0.5em] text-gold/90 mb-4">
                The Hall of Armor awaits
              </p>
              <h2 className="reveal font-display text-cream leading-[0.85] text-[12vw] md:text-[7vw] mb-8 drop-shadow-[0_8px_40px_rgba(0,0,0,0.7)]">
                SUIT UP.
              </h2>
              <a
                href="/id-card"
                data-magnetic
                className="reveal group inline-flex items-center gap-3 px-9 py-5 rounded-full bg-gold text-ink font-display tracking-widest text-xl md:text-2xl shadow-[0_0_60px_-10px_rgba(255,210,63,0.7)]"
              >
                <span>CLAIM YOUR ID</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="font-display text-cream text-3xl md:text-4xl leading-none">{k}</div>
      <div className="text-cream/55 text-[10px] md:text-xs uppercase tracking-[0.25em] mt-1">{v}</div>
    </div>
  );
}
