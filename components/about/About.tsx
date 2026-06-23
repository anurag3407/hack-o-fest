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
  { value: 72, label: "HOURS", suffix: "H", accent: "#FF2D55", span: "md:col-span-2" },
  { value: 6, label: "TRACKS · STONES", suffix: "", accent: "#7A3CFF", span: "md:col-span-1" },
  { value: 50, label: "PRIZE POOL", prefix: "$", suffix: "K", accent: "#FFD23F", span: "md:col-span-1" },
  { value: 500, label: "DEVELOPERS", suffix: "+", accent: "#00E5FF", span: "md:col-span-2" },
];

/* The four answers to "What is HACK·O·FEST" — headline + supporting line */
const ABOUT_POINTS = [
  {
    n: "01",
    head: "Build, don't pitch.",
    body: "Three days of hands-on making for people who would rather ship than sit through slides.",
    accent: "#FF2D55",
  },
  {
    n: "02",
    head: "Six focused tracks.",
    body: "From AI and web to emerging tech — each track is an arena to build something that matters.",
    accent: "#7A3CFF",
  },
  {
    n: "03",
    head: "Run by students.",
    body: "Organised by the Web & Coding Club of NIT Patna — a community of engineers, designers, and builders.",
    accent: "#B4FF39",
  },
  {
    n: "04",
    head: "Real things, shipped.",
    body: "Not a lecture. Not a workshop. A space to design, build, and ship something that works.",
    accent: "#FFD23F",
  },
  {
    n: "05",
    head: "Mentors on the floor.",
    body: "Industry guides and club seniors on hand around the clock to unblock you and sharpen your build.",
    accent: "#00E5FF",
  },
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
          {/* section bar with number */}
          <div className="about-reveal flex items-baseline gap-6 mb-10 md:mb-14">
            <span className="font-display text-ink/60 text-sm md:text-base uppercase tracking-[0.4em]">
              SECTION // 01
            </span>
            <span className="h-px flex-1 bg-ink/20" />
            <span className="font-accent text-3xl md:text-5xl text-crimson tracking-wider">
              THE BRIEF
            </span>
          </div>

          {/* eyebrow + lead statement */}
          <div className="about-reveal flex items-center gap-4 mb-6 uppercase tracking-[0.4em] text-xs md:text-sm text-ink/60">
            <span className="w-2 h-2 rounded-full bg-crimson" />
            WHAT IS HACK·O·FEST
          </div>
          <h2 className="about-reveal font-display text-[10vw] md:text-[5vw] leading-[0.95] tracking-tight text-ink max-w-[1150px] mb-20 md:mb-28">
            A hackathon for the people who{" "}
            <span className="text-crimson">make the thing</span> — not the ones
            who only talk about it.
          </h2>

          {/* refined numbered rows */}
          <div className="border-t border-ink/15">
            {ABOUT_POINTS.map((point) => (
              <div
                key={point.n}
                className="about-reveal group relative grid grid-cols-12 gap-4 md:gap-10 items-baseline py-10 md:py-14 border-b border-ink/15 overflow-hidden"
              >
                {/* per-row hover tint */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, ${point.accent}14, transparent 55%)`,
                  }}
                />
                <h3 className="relative col-span-12 md:col-span-6 font-display text-[8vw] md:text-[2.8vw] leading-[0.95] tracking-tight text-ink flex items-baseline gap-5 transition-transform duration-500 md:group-hover:translate-x-3">
                  <span
                    className="hidden md:block h-[4px] w-7 shrink-0 translate-y-[-0.3em] rounded-full transition-all duration-500 group-hover:w-16"
                    style={{ background: point.accent }}
                  />
                  {point.head}
                </h3>
                <p className="relative col-span-12 md:col-span-6 text-ink/70 text-base md:text-lg font-body leading-relaxed md:pt-2">
                  {point.body}
                </p>
              </div>
            ))}
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
              NITP
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — BY THE NUMBERS
          ═══════════════════════════════════════ */}
      <section className="relative bg-void py-28 md:py-36 overflow-hidden border-y border-cream/10">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255,210,63,0.10), transparent 60%)",
          }}
        />

        <div className="max-w-[1600px] mx-auto px-6 md:px-16 relative">
          <div className="about-reveal flex items-center gap-4 mb-14 uppercase tracking-[0.4em] text-xs md:text-sm text-cream/60">
            <span className="w-2 h-2 rounded-full bg-gold" />
            BY THE NUMBERS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className={`about-reveal group relative ${stat.span} rounded-3xl border backdrop-blur-xl overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[200px] md:min-h-[240px] transition-all duration-500 hover:-translate-y-1 hover:scale-[1.03]`}
                style={{
                  background: `linear-gradient(150deg, ${stat.accent}24 0%, ${stat.accent}0A 60%)`,
                  borderColor: `${stat.accent}40`,
                }}
              >
                {/* vibrant glow blob */}
                <div
                  className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-30 pointer-events-none transition-opacity duration-500 group-hover:opacity-60"
                  style={{ background: stat.accent }}
                />

                {/* label (top) */}
                <div
                  className="relative font-accent text-sm md:text-base tracking-[0.3em]"
                  style={{ color: stat.accent }}
                >
                  {stat.label}
                </div>

                {/* number (bottom) */}
                <div className="relative mt-8 font-display text-[16vw] md:text-[6.5vw] leading-none tracking-tight text-cream">
                  {stat.prefix && (
                    <span style={{ color: stat.accent }}>{stat.prefix}</span>
                  )}
                  <span className="stat-value" data-value={stat.value}>
                    0
                  </span>
                  <span style={{ color: stat.accent }}>{stat.suffix}</span>
                </div>

                {/* hover accent line */}
                <span
                  className="absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: stat.accent }}
                />
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
                className="pillar-card relative rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[380px] group cursor-default transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.03]"
                style={{
                  background: `linear-gradient(160deg, ${pillar.color}15 0%, ${pillar.color}40 100%)`,
                  border: `1px solid ${pillar.color}55`,
                }}
              >
                {/* oversized symbol watermark */}
                <span
                  className="absolute -bottom-10 -right-4 text-[13rem] leading-none select-none pointer-events-none opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500"
                  style={{ color: pillar.color }}
                  aria-hidden="true"
                >
                  {pillar.symbol}
                </span>

                <div className="relative flex items-start justify-between">
                  <div>
                    <span
                      className="font-accent text-3xl md:text-4xl tracking-widest"
                      style={{ color: pillar.color }}
                    >
                      {pillar.number}
                    </span>
                    <span
                      className="block mt-3 h-[3px] w-10 rounded-full transition-all duration-500 group-hover:w-16"
                      style={{ background: pillar.color }}
                    />
                  </div>
                  <span
                    className="text-5xl md:text-7xl leading-none opacity-80 group-hover:scale-125 transition-transform duration-500"
                    style={{ color: pillar.color }}
                  >
                    {pillar.symbol}
                  </span>
                </div>

                <div className="relative">
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
      <section className="relative bg-ink py-32 md:py-44 overflow-hidden">
        <div className="halftone absolute inset-0 opacity-20 pointer-events-none" />
        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            background:
              "radial-gradient(ellipse at 50% 25%, rgba(255,45,85,0.20), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(122,60,255,0.18), transparent 55%)",
          }}
        />

        <div className="max-w-[1600px] mx-auto px-6 md:px-16 relative text-center">
          <div className="about-reveal flex items-center justify-center gap-4 mb-8 uppercase tracking-[0.4em] text-xs md:text-sm text-cream/60">
            <span className="w-2 h-2 rounded-full bg-crimson" />
            FINAL CALL
            <span className="w-2 h-2 rounded-full bg-crimson" />
          </div>

          <h2 className="about-reveal font-display text-[14vw] md:text-[10vw] leading-[0.82] tracking-tight text-cream mb-8">
            READY TO
            <br />
            <span className="text-crimson">BUILD?</span>
          </h2>

          <p className="about-reveal max-w-xl mx-auto text-cream/70 text-lg md:text-xl font-body mb-10">
            Three days to design, build, and ship. Explore the tracks and find
            where your idea fits.
          </p>

          <div className="about-reveal flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/#tracks"
              className="group relative inline-flex items-center gap-3 px-10 py-6 rounded-full bg-gold text-ink font-display tracking-widest text-2xl overflow-hidden transition-transform duration-300 hover:scale-110"
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
