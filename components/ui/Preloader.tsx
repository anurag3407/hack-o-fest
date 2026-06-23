"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { LOADING_IMAGES, LOADING_TIPS } from "@/lib/loadingImages";

/* ─── constants ──────────────────────────────────────────────── */
const LOAD_DURATION = 3800; // ms – total load time
const TIP_INTERVAL  = 1800; // ms – tip rotation cadence
const EXIT_DELAY    = 400;  // ms – pause at 100% before exit

/* ─── helpers ────────────────────────────────────────────────── */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ─── component ──────────────────────────────────────────────── */
export function Preloader() {
  const image = useMemo(() => pickRandom(LOADING_IMAGES), []);

  /* progress 0 → 100 */
  const progress    = useMotionValue(0);
  const progressPct = useTransform(progress, (v) => `${Math.round(v)}%`);
  const barWidth    = useTransform(progress, [0, 100], ["0%", "100%"]);

  const [tipIndex, setTipIndex] = useState(0);
  const [done,     setDone]     = useState(false);

  /* lock scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* progress animation */
  useEffect(() => {
    const ctrl = animate(progress, 100, {
      duration: LOAD_DURATION / 1000,
      ease: [0.2, 0.05, 0.4, 1],
      onComplete: () => setTimeout(() => setDone(true), EXIT_DELAY),
    });
    return () => ctrl.stop();
  }, [progress]);

  /* tip rotation */
  useEffect(() => {
    const id = setInterval(
      () => setTipIndex((i) => (i + 1) % LOADING_TIPS.length),
      TIP_INTERVAL
    );
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: "-4%",
            transition: { duration: 0.9, ease: [0.7, 0, 0.2, 1] },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[200] overflow-hidden"
          aria-label="Loading"
          role="status"
        >
          {/* ── Background image – slow Ken-Burns zoom ── */}
          <motion.div
            className="absolute inset-0 will-change-transform"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1.0 }}
            transition={{
              duration: LOAD_DURATION / 1000 + EXIT_DELAY / 1000 + 1,
              ease: "easeOut",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.hero}
              className="absolute inset-0 h-full w-full object-cover object-center select-none"
              draggable={false}
              fetchPriority="high"
            />
          </motion.div>

          {/* ── Gradient overlays ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,18,0.55) 0%, rgba(10,10,18,0.10) 40%, rgba(10,10,18,0.75) 70%, rgba(10,10,18,0.97) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(10,10,18,0.65) 100%)",
            }}
          />
          <div
            className="absolute inset-y-0 left-0 w-[30vw] pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,10,18,0.80) 0%, transparent 100%)",
            }}
          />

          {/* ── Scanlines ── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
            }}
          />



          {/* ── Top-left: Branding ── */}
          <motion.div
            className="absolute top-8 left-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            <p className="font-accent text-[clamp(1rem,2vw,1.4rem)] tracking-[0.3em] text-crimson uppercase">
              Hack-O-Fest
            </p>
            <p className="font-body text-[clamp(0.6rem,1vw,0.75rem)] tracking-[0.2em] text-cream/50 uppercase mt-0.5">
              Enter the Multiverse
            </p>
          </motion.div>

          {/* ── Top-right: PS5-style corner mark ── */}
          <motion.div
            className="absolute top-8 right-8 flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            <span className="font-body text-[0.65rem] tracking-[0.25em] text-cream/40 uppercase">
              Loading Experience
            </span>
            <span className="h-[1px] w-8 bg-cream/20" />
          </motion.div>

          {/* ── Centre: Hero name reveal ── */}
          <motion.div
            className="absolute inset-0 flex items-center justify-start pl-[8vw]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="font-body text-[clamp(0.65rem,1.2vw,0.85rem)] tracking-[0.4em] text-gold uppercase mb-3">
                Featured
              </p>
              <h1 className="font-display text-[clamp(3.5rem,9vw,8rem)] leading-[0.85] tracking-tight text-cream drop-shadow-2xl">
                {image.hero.split(" ").map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>
            </div>
          </motion.div>

          {/* ── Bottom HUD ── */}
          <div className="absolute inset-x-0 bottom-0 px-8 pb-8">
            {/* Tip + quote */}
            <motion.div
              className="mb-6 flex items-start gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <span className="mt-1 h-4 w-[3px] shrink-0 rounded-full bg-crimson" />
              <div>
                <div className="relative overflow-hidden h-5">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={tipIndex}
                      className="font-body text-[clamp(0.65rem,1.1vw,0.8rem)] tracking-[0.12em] text-cream/60 uppercase"
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0,  opacity: 1 }}
                      exit={{   y: -16, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      {LOADING_TIPS[tipIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <p className="mt-1 font-body italic text-[clamp(0.7rem,1.1vw,0.85rem)] text-cream/30">
                  &ldquo;{image.quote}&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-body text-[0.65rem] tracking-[0.2em] text-cream/40 uppercase">
                  Initializing
                </span>
                <motion.span className="font-display text-[clamp(1rem,2.5vw,1.5rem)] tabular-nums text-cream">
                  {progressPct}
                </motion.span>
              </div>

              {/* Bar */}
              <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-cream/10">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: barWidth,
                    background:
                      "linear-gradient(90deg, #ff2d55 0%, #ffd23f 50%, #ff2d55 100%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                  transition={{
                    backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" },
                  }}
                />
                {/* Glint */}
                <motion.div
                  className="absolute inset-y-0 rounded-full"
                  style={{ width: barWidth }}
                >
                  <div
                    className="absolute right-0 h-full w-8"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                    }}
                  />
                </motion.div>
              </div>

              {/* Footer labels */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                  {[...Array(3)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="block h-1.5 w-1.5 rounded-full bg-cream/30"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                  <span className="font-body text-[0.6rem] tracking-[0.2em] text-cream/25 uppercase">
                    Marvel · Hack-O-Fest 2026
                  </span>
                </div>
                <span className="font-body text-[0.6rem] tracking-[0.15em] text-cream/25 uppercase">
                  Assemble. Build. Conquer.
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── Corner brackets ── */}
          <div className="absolute bottom-8 left-8 pointer-events-none select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative w-6 h-6"
            >
              <span className="absolute top-0 left-0 h-3 w-[2px] bg-cream" />
              <span className="absolute top-0 left-0 h-[2px] w-3 bg-cream" />
            </motion.div>
          </div>
          <div className="absolute top-8 right-8 pointer-events-none select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative w-6 h-6"
            >
              <span className="absolute bottom-0 right-0 h-3 w-[2px] bg-cream" />
              <span className="absolute bottom-0 right-0 h-[2px] w-3 bg-cream" />
            </motion.div>
          </div>

          {/* ── Right-side vertical label ── */}
          <motion.div
            className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
          >
            <span
              className="font-body text-[0.6rem] tracking-[0.35em] text-cream/25 uppercase"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              Hackathon 2026
            </span>
            <span className="h-12 w-[1px] bg-gradient-to-b from-cream/20 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
