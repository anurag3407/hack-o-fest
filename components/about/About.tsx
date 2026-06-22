"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */

const STATS = [
  { value: 72, label: "HOURS", suffix: "H" },
  { value: 6, label: "TRACKS", suffix: "" },
  { value: 50, label: "PRIZE POOL", prefix: "$", suffix: "K" },
  { value: 500, label: "HACKERS", suffix: "+" },
];

const PILLARS = [
  {
    number: "01",
    title: "INNOVATE",
    description:
      "Push boundaries. Break defaults. Build things the world hasn't seen yet — from AI agents to climate tech.",
    color: "#FF2D55",
    symbol: "⚡",
  },
  {
    number: "02",
    title: "COLLABORATE",
    description:
      "Form your team. Combine design, engineering, and product thinking. The best work is never built alone.",
    color: "#7A3CFF",
    symbol: "◈",
  },
  {
    number: "03",
    title: "IMPACT",
    description:
      "Ship projects that solve real problems and leave things better than you found them.",
    color: "#B4FF39",
    symbol: "∞",
  },
];

/* ─────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────── */

export default function About() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Hero entrance ── */
      gsap.from(".about-hero-text", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.15,
      });

      /* ── Scroll-triggered reveals ── */
      gsap.utils.toArray<HTMLElement>(".about-reveal").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      /* ── Stats counter animation ── */
      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const end = parseInt(el.getAttribute("data-value") || "0", 10);
        const obj = { val: 0 };

        gsap.to(obj, {
          val: end,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
          onUpdate: () => {
            el.textContent = Math.ceil(obj.val).toString();
          },
        });
      });

      /* ── Pillar cards stagger ── */
      gsap.from(".pillar-card", {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pillars-grid", start: "top 80%" },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  /* ════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════ */
  return (
    <div ref={wrapperRef}>
      {/* ═══════════════════════════════════════
          SECTION 1 — PAGE HERO
          ═══════════════════════════════════════ */}
      <section className="relative pt-44 pb-24 px-6 md:px-16 max-w-[1600px] mx-auto">
        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 25% 0%, rgba(255,45,85,0.22), transparent 50%), radial-gradient(ellipse at 75% 100%, rgba(122,60,255,0.18), transparent 50%)",
          }}
        />

        <div className="relative">
          <div className="about-hero-text flex items-center gap-4 mb-8 text-cream/60 uppercase tracking-[0.4em] text-xs md:text-sm">
            <span className="w-2 h-2 rounded-full bg-crimson" />
            ABOUT // HACK·O·FEST
          </div>

          <h1 className="about-hero-text font-display text-[16vw] md:text-[12vw] leading-[0.82] tracking-tight text-cream">
            BUILT TO
            <br />
            <span className="text-crimson">BUILD.</span>
          </h1>

          <p className="about-hero-text mt-8 max-w-2xl text-cream/70 text-lg md:text-xl font-body leading-relaxed">
            HACK·O·FEST is a 72-hour hackathon for students who would rather
            build than talk about building. We bring together engineers,
            designers, and problem-solvers to turn ideas into working products.
          </p>
        </div>

        {/* decorative starburst */}
        <div className="hidden md:block absolute top-32 right-10 opacity-90">
          <div className="relative" style={{ width: 180, height: 180 }}>
            <svg
              viewBox="0 0 200 200"
              width={180}
              height={180}
              className="absolute inset-0"
            >
              <polygon
                points="200,100 169,112 194,134 161,135 177,164 145,154 150,187 124,166 117,199 100,170 83,199 76,166 50,187 55,154 23,164 39,135 6,134 31,112 0,100 31,88 6,66 39,65 23,36 55,46 50,13 76,34 83,2 100,30 117,2 124,34 150,13 145,46 177,36 161,65 194,66 169,88"
                fill="#FFD23F"
                stroke="#14141C"
                strokeWidth={4}
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-accent text-ink text-2xl md:text-3xl tracking-wider -rotate-6 select-none">
              2026
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MARQUEE TICKER
          ═══════════════════════════════════════ */}
      <div className="overflow-hidden bg-gold text-ink py-5 border-y border-ink/20">
        <div
          className="marquee whitespace-nowrap"
          style={{ animationDuration: "28s" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-3xl md:text-5xl tracking-wider mx-8 inline-flex items-center gap-8"
            >
              <span>ABOUT HACK·O·FEST</span>
              <span className="text-crimson">✦</span>
              <span>BUILT BY STUDENTS</span>
              <span className="text-crimson">✦</span>
              <span>SHIP REAL PRODUCTS</span>
              <span className="text-crimson">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          SECTION 2 — WHAT IS HACK-O-FEST
          (cream bg, manifesto-style)
          ═══════════════════════════════════════ */}
      <section className="relative bg-cream text-ink py-32 md:py-48 overflow-hidden">
        <div className="halftone absolute inset-0 opacity-30 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative">
          <div className="about-reveal mb-20 flex items-center gap-4 uppercase tracking-[0.4em] text-xs md:text-sm text-ink/60">
            <span className="w-2 h-2 rounded-full bg-crimson" />
            WHAT IS HACK·O·FEST
          </div>

          <div className="space-y-16 md:space-y-28">
            <div className="about-reveal grid grid-cols-12 gap-6">
              <div className="col-span-2 md:col-span-2 pt-3 text-ink/50 font-accent text-lg md:text-2xl tracking-widest">
                01
              </div>
              <div className="col-span-10 md:col-span-10 font-display text-[8vw] md:text-[5vw] leading-[0.95] tracking-tight">
                A 72-hour hackathon built for people who would rather build
                than talk about building.
              </div>
            </div>

            <div className="about-reveal grid grid-cols-12 gap-6">
              <div className="col-span-2 md:col-span-2 pt-3 text-ink/50 font-accent text-lg md:text-2xl tracking-widest">
                02
              </div>
              <div className="col-span-10 md:col-span-10 font-display text-[8vw] md:text-[5vw] leading-[0.95] tracking-tight">
                Six tracks spanning AI, web, and emerging tech — each a focused
                arena to build something that matters.
              </div>
            </div>

            <div className="about-reveal grid grid-cols-12 gap-6">
              <div className="col-span-2 md:col-span-2 pt-3 text-ink/50 font-accent text-lg md:text-2xl tracking-widest">
                03
              </div>
              <div className="col-span-10 md:col-span-10 font-display text-[8vw] md:text-[5vw] leading-[0.95] tracking-tight">
                Organised by the Web &amp; Coding Club of NIT Patna — a community
                of student engineers, designers, and builders.
              </div>
            </div>

            <div className="about-reveal grid grid-cols-12 gap-6">
              <div className="col-span-2 md:col-span-2 pt-3 text-ink/50 font-accent text-lg md:text-2xl tracking-widest">
                04
              </div>
              <div className="col-span-10 md:col-span-10 font-display text-[8vw] md:text-[5vw] leading-[0.95] tracking-tight">
                Not a lecture. Not a workshop. A space to design, build, and
                ship something real.
              </div>
            </div>
          </div>
        </div>

        {/* decorative starburst bottom-right */}
        <div className="absolute bottom-16 right-10 hidden md:block opacity-90">
          <div className="relative" style={{ width: 200, height: 200 }}>
            <svg
              viewBox="0 0 200 200"
              width={200}
              height={200}
              className="absolute inset-0"
            >
              <polygon
                points="200,100 169,112 194,134 161,135 177,164 145,154 150,187 124,166 117,199 100,170 83,199 76,166 50,187 55,154 23,164 39,135 6,134 31,112 0,100 31,88 6,66 39,65 23,36 55,46 50,13 76,34 83,2 100,30 117,2 124,34 150,13 145,46 177,36 161,65 194,66 169,88"
                fill="#FF2D55"
                stroke="#14141C"
                strokeWidth={4}
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-accent text-ink text-2xl md:text-3xl tracking-wider -rotate-6 select-none">
              72H
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — BY THE NUMBERS
          ═══════════════════════════════════════ */}
      <section className="relative bg-void py-32 md:py-40 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255,210,63,0.12), transparent 55%)",
          }}
        />

        <div className="max-w-[1600px] mx-auto px-6 md:px-16 relative">
          <div className="about-reveal flex items-center gap-4 mb-16 uppercase tracking-[0.4em] text-xs md:text-sm text-cream/60">
            <span className="w-2 h-2 rounded-full bg-gold" />
            BY THE NUMBERS
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="about-reveal text-center md:text-left"
              >
                <div className="font-display text-[18vw] md:text-[8vw] leading-none tracking-tight text-gold">
                  {stat.prefix && (
                    <span className="text-cream/50">{stat.prefix}</span>
                  )}
                  <span className="stat-value" data-value={stat.value}>
                    0
                  </span>
                  <span className="text-cream/50">{stat.suffix}</span>
                </div>
                <div className="mt-3 font-accent text-lg md:text-2xl tracking-widest text-cream/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 4 — CORE VALUES / PILLARS
          ═══════════════════════════════════════ */}
      <section className="relative bg-cream text-ink py-32 md:py-48 overflow-hidden">
        <div className="halftone absolute inset-0 opacity-40 pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-6 md:px-16 relative">
          <div className="about-reveal flex items-baseline gap-6 mb-10 md:mb-16">
            <span className="font-display text-ink/60 text-sm md:text-base uppercase tracking-[0.4em]">
              SECTION // 02
            </span>
            <span className="h-px flex-1 bg-ink/20" />
            <span className="font-accent text-3xl md:text-5xl text-crimson tracking-wider">
              CORE VALUES
            </span>
          </div>

          <h2 className="about-reveal font-display text-[14vw] md:text-[10vw] leading-[0.82] tracking-tight mb-8">
            WHAT WE <span className="text-crimson">STAND FOR.</span>
          </h2>

          <p className="about-reveal max-w-2xl text-ink/70 text-lg md:text-xl font-body mb-16 md:mb-24">
            Three principles guide everything we do — every track, every theme,
            and every late-night build session ties back to these.
          </p>

          <div className="pillars-grid grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="pillar-card relative rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[380px] group cursor-default"
                style={{
                  background: `linear-gradient(160deg, ${pillar.color}15 0%, ${pillar.color}40 100%)`,
                  border: `1px solid ${pillar.color}55`,
                }}
              >
                <div className="flex items-start justify-between">
                  <span
                    className="font-accent text-3xl md:text-4xl tracking-widest"
                    style={{ color: pillar.color }}
                  >
                    {pillar.number}
                  </span>
                  <span
                    className="text-5xl md:text-7xl leading-none opacity-80 group-hover:scale-125 transition-transform duration-500"
                    style={{ color: pillar.color }}
                  >
                    {pillar.symbol}
                  </span>
                </div>

                <div>
                  <h3
                    className="font-display text-[10vw] md:text-[3.4vw] leading-[0.85] tracking-tight"
                    style={{ color: pillar.color }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-ink/80 text-base md:text-lg font-body leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5 — CTA
          ═══════════════════════════════════════ */}
      <section className="relative bg-ink py-32 md:py-40 overflow-hidden">
        <div className="halftone absolute inset-0 opacity-20 pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-6 md:px-16 relative text-center">
          <h2 className="about-reveal font-display text-[14vw] md:text-[10vw] leading-[0.82] tracking-tight text-cream mb-8">
            READY TO
            <br />
            <span className="text-crimson">BUILD?</span>
          </h2>

          <p className="about-reveal max-w-xl mx-auto text-cream/70 text-lg md:text-xl font-body mb-12">
            72 hours to design, build, and ship. Explore the tracks and find
            where your idea fits.
          </p>

                 <div className="about-reveal flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/#tracks" 
              className="group relative inline-flex items-center gap-3 px-10 py-6 rounded-full bg-gold text-ink font-display tracking-widest text-2xl overflow-hidden"
              data-magnetic="true"
            >
              <span className="relative z-10">EXPLORE TRACKS</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">
                →
              </span>
              <span className="absolute inset-0 bg-crimson translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="absolute inset-0 -z-0 bg-gold" />
            </Link>

            <Link
              href="/#themes" 
              className="text-cream/80 hover:text-cream font-body uppercase tracking-[0.3em] text-sm transition-colors"
              data-magnetic="true"
            >
              View themes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
