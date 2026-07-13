"use client";

import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "@/lib/gsap";
import Link from "next/link";
import Image from "next/image";

/* ── stat bar data ─────────────────────────────────── */
const stats = [
  { label: "INNOVATION", value: 95 },
  { label: "CREATIVITY", value: 90 },
  { label: "CODING", value: 85 },
  { label: "TEAMWORK", value: 88 },
  { label: "SPEED", value: 80 },
  { label: "IMPACT", value: 92 },
];

/* ── hero component ────────────────────────────────── */
export function NewHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const { gsap } = registerGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* header bar */
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.2
      );

      /* repeating title */
      tl.fromTo(
        titleRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.8 },
        0.3
      );

      /* center image */
      tl.fromTo(
        imageRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1 },
        0.4
      );

      /* stats panel */
      tl.fromTo(
        statsRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.8 },
        0.5
      );

      /* right panel */
      tl.fromTo(
        rightRef.current,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.8 },
        0.5
      );

      /* bottom sections */
      tl.fromTo(
        bottomLeftRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.7
      );
      tl.fromTo(
        bottomRightRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.75
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-void"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* ── NOISE / GRAIN OVERLAY ─────────────────── */}
      <div className="grain absolute inset-0 z-50 pointer-events-none" />

      {/* ── SCAN LINES ────────────────────────────── */}
      <div
        className="absolute inset-0 z-40 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245,239,224,0.15) 2px, rgba(245,239,224,0.15) 4px)",
        }}
      />

      {/* ── GRID LINES (decorative) ───────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* vertical lines */}
        <div className="absolute left-[8%] top-0 bottom-0 w-px bg-cream/[0.06]" />
        <div className="absolute left-[30%] top-0 bottom-0 w-px bg-cream/[0.06]" />
        <div className="absolute right-[30%] top-0 bottom-0 w-px bg-cream/[0.06]" />
        <div className="absolute right-[8%] top-0 bottom-0 w-px bg-cream/[0.06]" />
        {/* horizontal lines */}
        <div className="absolute top-[12%] left-0 right-0 h-px bg-cream/[0.06]" />
        <div className="absolute top-[88%] left-0 right-0 h-px bg-cream/[0.06]" />
      </div>

      {/* ── HEADER BAR ────────────────────────────── */}
      <div
        ref={headerRef}
        className="relative z-20 flex items-center justify-between px-6 md:px-12 pt-24 pb-4 opacity-0"
      >
        <span className="text-[10px] md:text-xs font-body text-cream/40 tracking-[0.3em] uppercase">
          Code Arena
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
          <span className="text-[10px] md:text-xs font-body text-cream/60 tracking-[0.3em] uppercase">
            League of Power / 001
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
        </div>
        <span className="text-[10px] md:text-xs font-body text-cream/40 tracking-[0.3em] uppercase">
          Est. 2025
        </span>
      </div>

      {/* ── MAIN CONTENT GRID ─────────────────────── */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 grid grid-cols-12 gap-2 md:gap-4"
           style={{ minHeight: "calc(100vh - 120px)" }}
      >
        {/* ── LEFT COLUMN: Stats ────────────────────── */}
        <div
          ref={statsRef}
          className="col-span-12 md:col-span-3 flex flex-col justify-center gap-8 py-8 md:py-0 opacity-0"
        >
          {/* Personal Stats Panel */}
          <div className="border border-cream/10 bg-ink/60 backdrop-blur-sm p-5 rounded-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 bg-crimson" />
              <span className="text-[11px] font-display text-crimson tracking-[0.3em] uppercase">
                Personal Stats
              </span>
            </div>
            <div className="space-y-3">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-cream/60 tracking-[0.15em] uppercase font-body">
                      {s.label}
                    </span>
                    <span className="text-[10px] text-cream/40 font-body">{s.value}%</span>
                  </div>
                  <div className="h-1.5 bg-cream/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cream/70 rounded-full"
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Heart of Steel block */}
          <div>
            <h3 className="text-2xl md:text-3xl font-display text-cream uppercase leading-tight mb-3">
              Heart of
              <br />
              Steel
            </h3>
            <p className="text-[10px] text-cream/40 leading-relaxed font-body uppercase tracking-wider max-w-[260px]">
              Where code meets conviction. Hack-O-Fest is
              the arena where builders forge the impossible. 72 hours of
              relentless innovation, six infinity tracks, one goal: reshape
              reality through technology.
            </p>
          </div>
        </div>

        {/* ── CENTER COLUMN: Title + Image ──────────── */}
        <div className="col-span-12 md:col-span-6 relative flex flex-col items-center justify-center">
          {/* Repeating title behind image */}
          <div
            ref={titleRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-0 opacity-0 select-none pointer-events-none overflow-hidden"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="font-display text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] leading-[0.85] uppercase text-transparent tracking-tighter"
                style={{
                  WebkitTextStroke: i === 0 ? "2px rgba(245,239,224,0.8)" : "1px rgba(245,239,224,0.12)",
                  opacity: i === 0 ? 1 : Math.max(0.15, 1 - i * 0.2),
                }}
              >
                HACK-O
              </span>
            ))}
          </div>

          {/* Hero character image */}
          <div
            ref={imageRef}
            className="relative z-10 w-[70%] md:w-[80%] aspect-[3/4] opacity-0"
          >
            <Image
              src="/img/hero/hero-character.jpg"
              alt="Hack-O-Fest Hero"
              fill
              className="object-contain object-bottom drop-shadow-2xl"
              style={{
                maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
              }}
              priority
            />
            {/* Glow behind character */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
              <div className="w-[80%] h-[60%] bg-crimson/20 rounded-full blur-[100px]" />
            </div>
          </div>

          {/* Checkered strip at bottom of image */}
          <div className="relative z-10 w-[70%] md:w-[80%] h-6 -mt-6 overflow-hidden opacity-40">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "repeating-conic-gradient(rgba(245,239,224,0.5) 0% 25%, transparent 0% 50%)",
                backgroundSize: "12px 12px",
              }}
            />
          </div>
        </div>

        {/* ── RIGHT COLUMN: Info ────────────────────── */}
        <div
          ref={rightRef}
          className="col-span-12 md:col-span-3 flex flex-col justify-center gap-8 py-8 md:py-0 opacity-0"
        >
          {/* Big words */}
          <div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-display text-cream uppercase leading-[0.95] tracking-tight">
              Amazing
              <br />
              Code
              <br />
              Blazing
              <br />
              Power
            </h3>
            <p className="mt-4 text-[10px] text-cream/40 leading-relaxed font-body uppercase tracking-wider max-w-[260px]">
              Hack-O-Fest can&apos;t be won alone. Assemble your
              squad across six infinity tracks. Build the future.
              Forge alliances. Conquer the multiverse. The arena
              awaits those bold enough to enter.
            </p>
          </div>

          {/* Small blueprint / wireframe icon area */}
          <div className="border border-cream/10 bg-ink/40 p-4 rounded-sm flex flex-col items-center gap-3">
            <svg
              width="48"
              height="80"
              viewBox="0 0 48 80"
              fill="none"
              className="opacity-40"
            >
              {/* Simplified human wireframe */}
              <circle cx="24" cy="10" r="6" stroke="#F5EFE0" strokeWidth="1" />
              <line x1="24" y1="16" x2="24" y2="48" stroke="#F5EFE0" strokeWidth="1" />
              <line x1="24" y1="24" x2="10" y2="38" stroke="#F5EFE0" strokeWidth="1" />
              <line x1="24" y1="24" x2="38" y2="38" stroke="#F5EFE0" strokeWidth="1" />
              <line x1="24" y1="48" x2="14" y2="70" stroke="#F5EFE0" strokeWidth="1" />
              <line x1="24" y1="48" x2="34" y2="70" stroke="#F5EFE0" strokeWidth="1" />
            </svg>
            <span className="text-[9px] text-cream/30 tracking-[0.2em] uppercase font-body">
              Blueprint v2.0
            </span>
          </div>

          {/* Registration tag */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-[10px] font-body text-gold/80 tracking-[0.2em] uppercase">
              Registration Open
            </span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ────────────────────────────── */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pb-8">
        <div className="border-t border-cream/[0.08] pt-6 grid grid-cols-12 gap-4 items-end">
          {/* Bottom Left */}
          <div ref={bottomLeftRef} className="col-span-6 md:col-span-4 opacity-0">
            <h4 className="text-2xl md:text-4xl font-display text-cream uppercase leading-tight">
              Birth of
              <br />
              Legends
            </h4>
            {/* Barcode-style decoration */}
            <div className="flex items-end gap-[2px] mt-3 h-6 opacity-40">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-cream/70"
                  style={{
                    width: Math.random() > 0.3 ? "2px" : "4px",
                    height: `${40 + Math.random() * 60}%`,
                  }}
                />
              ))}
            </div>
            <span className="text-[9px] text-cream/30 tracking-[0.2em] uppercase font-body mt-2 block">
              An Hackathon
            </span>
          </div>

          {/* Bottom Center - CTA */}
          <div className="col-span-12 md:col-span-4 flex flex-col items-center gap-3 order-first md:order-none pb-4 md:pb-0">
            <Link
              href="/id-card"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-crimson text-cream font-display tracking-[0.2em] text-sm uppercase overflow-hidden transition-transform hover:scale-105 shadow-glow-crimson"
            >
              <span className="relative z-10">Join The Initiative</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            </Link>
            <span className="text-[9px] text-cream/30 tracking-[0.15em] uppercase font-body">
              72 Hours · 6 Tracks · $50k Prize Pool
            </span>
          </div>

          {/* Bottom Right - Vertical title */}
          <div ref={bottomRightRef} className="col-span-6 md:col-span-4 flex justify-end items-end opacity-0">
            <div className="flex items-end gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-cream/30 tracking-[0.2em] uppercase font-body mb-1">
                  An Hackathon
                </span>
                {/* Small decorative squares */}
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-crimson/60" />
                  <div className="w-2 h-2 bg-gold/60" />
                  <div className="w-2 h-2 bg-infinity/60" />
                  <div className="w-2 h-2 bg-gamma/60" />
                  <div className="w-2 h-2 bg-cyan/60" />
                  <div className="w-2 h-2 border border-cream/20" />
                </div>
              </div>
              <h4
                className="font-display text-cream uppercase leading-none tracking-tight text-4xl md:text-6xl lg:text-7xl"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  height: "clamp(120px, 20vh, 220px)",
                }}
              >
                Hack-O-Fest
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* ── Corner decorations ────────────────────── */}
      {/* Top-left corner bracket */}
      <div className="absolute top-20 left-4 md:left-8 z-30 pointer-events-none opacity-20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M0 24V0h24" stroke="#F5EFE0" strokeWidth="1" />
        </svg>
      </div>
      {/* Top-right corner bracket */}
      <div className="absolute top-20 right-4 md:right-8 z-30 pointer-events-none opacity-20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M24 24V0H0" stroke="#F5EFE0" strokeWidth="1" />
        </svg>
      </div>
      {/* Bottom-left corner bracket */}
      <div className="absolute bottom-4 left-4 md:left-8 z-30 pointer-events-none opacity-20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M0 0v24h24" stroke="#F5EFE0" strokeWidth="1" />
        </svg>
      </div>
      {/* Bottom-right corner bracket */}
      <div className="absolute bottom-4 right-4 md:right-8 z-30 pointer-events-none opacity-20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M24 0v24H0" stroke="#F5EFE0" strokeWidth="1" />
        </svg>
      </div>
    </section>
  );
}
