"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { registerGsap } from "@/lib/gsap";
import { ComicBurst } from "@/components/ui/ComicBurst";

const bgOpacity = 0.6;    // Image visibility
const greyOpacity = 0.0;
// ------------------------------------

const themes = [
  { title: "TIME COLLAPSE", body: "Build interfaces that exist outside time. Realtime collaboration, infinite undo, presence.", accent: "#7A3CFF", glyph: "∞", bgImage: "/img/themes/agents-unchained.jpg" },
  { title: "AGENTS UNCHAINED", body: "Multi-agent systems doing useful, scary, hilarious things in the real world.", accent: "#B4FF39", glyph: "◈", bgImage: "/img/themes/off-world-ux.jpg" },
  { title: "OFF-WORLD UX", body: "Spatial interfaces, voice-first products, ambient computing for the next platform.", accent: "#00E5FF", glyph: "◉", bgImage: "/img/themes/time-collapse.jpg" },
  { title: "LAW AND JUSTICE", body: "Local-first, edge-rendered, sub-100ms — software that respects the user's machine.", accent: "#FF2D55", glyph: "▲", bgImage: "/img/themes/wild-card.jpg" },
  { title: "OPEN INNOVATION", body: "Music, video, fashion, food. Builders making tools for taste-makers.", accent: "#FFD23F", glyph: "✦", bgImage: "/img/themes/card-5.png" },
  { title: "HEALTHCARE", body: "Anything. Make us laugh. Make us cry. Make us nervous.", accent: "#F5EFE0", glyph: "✺", bgImage: "/img/themes/card-6.png" },
  { title: "AI & AUTOMATION", body: "Neural interfaces, hyper-personalized models, and agents that live in your terminal.", accent: "#FF9F1C", glyph: "⚙", bgImage: "/img/themes/card-7.png" },
  { title: "ROBOTICS", body: "Connecting bits to atoms. Kinematics, edge intelligence, and tactile hardware loops.", accent: "#00E5FF", glyph: "⧇", bgImage: "/img/themes/card-8.png" },
  { title: "SPACE TECH", body: "Decentralized orbital networks, sub-orbital compute, and open telemetry data.", accent: "#E0AAFF", glyph: "✦", bgImage: "/img/themes/card-9.png" },
];

export function Themes() {
  const rootRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1200;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const getSpreadCoordinates = (index: number) => {
      if (isMobile) {
        const spreadX = 0;
        const spreadY = (index - 4) * 330;
        const spreadRotate = (index - 4) * 2;
        return { spreadX, spreadY, spreadRotate };
      }

      const row = Math.floor(index / 3);
      const colIndex = index % 3;
      const colOffset = colIndex - 1;

      if (isTablet) {
        const spreadX = colOffset * 300;
        const spreadY = (row - 1) * 460;
        const spreadRotate = colOffset * 4;
        return { spreadX, spreadY, spreadRotate };
      }

      const spreadX = colOffset * 480;
      const spreadY = (row - 1) * 520;
      const spreadRotate = colOffset * 5;

      return { spreadX, spreadY, spreadRotate };
    };

    const ctx = gsap.context(() => {
      const tiles = root.querySelectorAll<HTMLElement>(".theme-tile");
      if (reduced) {
        gsap.set(tiles, { opacity: 1, y: 0 });
        return;
      }

      // Set initial state: cards start at their fully spread positions
      tiles.forEach((tile, i) => {
        const { spreadX, spreadY, spreadRotate } = getSpreadCoordinates(i);
        gsap.set(tile, {
          x: spreadX,
          y: spreadY,
          rotation: spreadRotate,
          zIndex: i,
        });
      });

      // Title reveal animation
      gsap.from(".big-title .split-word", {
        yPercent: 110,
        duration: 1,
        stagger: 0.06,
        ease: "power4.out",
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
        },
      });

      // Initial fade-in for tiles
      gsap.from(tiles, {
        y: "+=150",
        opacity: 0,
        duration: 1,
        stagger: 0.04,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });

      // ── Pinned scroll-driven stacking timeline ──
      // Cards start spread (3×3 grid). On scroll they collapse into
      // three vertical column-stacks in two sequenced phases.
      //
      // Phase 1 (0 → 0.45): Row 2 (cards 3,4,5) move onto Row 1 (cards 0,1,2)
      // Phase 2 (0.45 → 0.9): Row 3 (cards 6,7,8) move onto the growing stacks
      //
      // The stacking target for every card is the column-1 (row-0) spread
      // position of its column-mate, with a slight vertical offset per layer.

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 30%",
          end: "+=2000",
          pin: ".card-pin-area",
          scrub: true,
          anticipatePin: 1,
        }
      });

      // For each card that needs to move, compute where it must land.
      // Target = row-0 card in the same column + small y-offset per layer.
      const stackOffsetY = isMobile ? -8 : -6; // slight upward shift per layer

      tiles.forEach((tile, i) => {
        const row = Math.floor(i / 3);
        if (row === 0) return; // Row 0 cards stay put — they are the base

        const colIndex = i % 3;
        // Target position = spread coords of the base card in this column (row 0)
        const baseIndex = colIndex; // index 0, 1, or 2
        const { spreadX: targetX, spreadY: targetY } = getSpreadCoordinates(baseIndex);

        // Layer offset: row 1 is layer 1, row 2 is layer 2
        const layerY = targetY + (row * stackOffsetY);

        // Phase timing: row 1 animates first, row 2 animates second
        const phaseStart = row === 1 ? 0 : 0.45;
        const phaseDuration = 0.45;

        tl.to(tile, {
          x: targetX,
          y: layerY,
          rotation: 0,
          zIndex: i + 10, // higher cards on top
          duration: phaseDuration,
          ease: "power2.inOut",
        }, phaseStart);
      });

      // Small breathing room at the end before unpin
      tl.to({}, { duration: 0.1 });

    }, root);

    return () => ctx.revert();
  }, [isMobile, isTablet]);

  const handleMouseEnter = (_index: number, e: React.MouseEvent<HTMLElement>) => {
    const { gsap } = registerGsap();
    gsap.to(e.currentTarget, {
      scale: 1.05,
      zIndex: 50,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (index: number, e: React.MouseEvent<HTMLElement>) => {
    const { gsap } = registerGsap();
    gsap.to(e.currentTarget, {
      scale: 1,
      zIndex: index,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const getContainerHeight = () => {
    if (isMobile) return "3000px";
    if (isTablet) return "1150px";
    return "1350px";
  };

  return (
    <section id="themes" ref={rootRef} className="relative bg-cream text-ink py-20 md:py-48 overflow-hidden">
      <div className="halftone absolute inset-0 opacity-40 pointer-events-none" />
      <div className="absolute top-20 right-10 hidden md:block opacity-90">
        <ComicBurst size={220} color="#FF2D55" text="WHAM!" spikes={16} />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-16 relative">
        <div className="flex items-baseline gap-4 md:gap-6 mb-10 md:mb-16">
          <span className="font-display text-ink/60 text-xs md:text-base uppercase tracking-[0.4em]">
            SECTION // 02
          </span>
          <span className="h-px flex-1 bg-ink/20" />
          <span className="font-accent text-xl md:text-5xl text-crimson tracking-wider">
            SCROLL TO STACK //
          </span>
        </div>

        <h2 className="big-title font-display text-[16vw] md:text-[12vw] leading-[0.85] md:leading-[0.82] tracking-tight max-w-5xl">
          <span className="split-word inline-block overflow-hidden">THEMES</span>{" "}
          <span className="split-word inline-block overflow-hidden text-crimson">THAT</span>{" "}
          <span className="split-word inline-block overflow-hidden">PUNCH.</span>
        </h2>
        <p className="mt-6 md:mt-8 max-w-2xl text-ink/70 text-base md:text-xl font-body">
          Pick a lens. Keep scrolling to watch the themes stack into columns.
        </p>

        <div
          ref={containerRef}
          style={{ minHeight: getContainerHeight() }}
          className=" card-pin-area mt-16 md:mt-32 relative w-full flex items-center justify-center"
        >
          {themes.map((t, i) => {
            return (
              <article
                key={t.title + i}
                onMouseEnter={(e) => handleMouseEnter(i, e)}
                onMouseLeave={(e) => handleMouseLeave(i, e)}
                className="theme-tile absolute w-[280px] md:w-[360px] aspect-[4/5] rounded-3xl overflow-hidden p-6 md:p-9 flex flex-col justify-between select-none backdrop-blur-lg"
                style={{
                  backgroundColor: "#111115DD",
                  border: `3px solid ${t.accent}88`,
                  boxShadow: `inset 0 0 16px ${t.accent}22, 0 12px 40px 0 rgba(0, 0, 0, 0.4)`,
                  zIndex: i,
                  transformOrigin: "bottom center",
                }}
              >
                <img
                  src={t.bgImage}
                  alt={t.title}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay pointer-events-none"
                  style={{ opacity: bgOpacity }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />

                <div
                  className="absolute inset-0 z-0 bg-gray-900 pointer-events-none"
                  style={{ opacity: greyOpacity }}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <span className="font-accent text-white/40 text-2xl md:text-4xl tracking-widest drop-shadow">0{i + 1}</span>
                  <span className="font-display text-4xl md:text-7xl leading-none" style={{ color: t.accent }}>{t.glyph}</span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-display text-[6.5vw] md:text-[2vw] leading-[0.9] md:leading-[0.85] tracking-tight drop-shadow-md" style={{ color: t.accent }}>{t.title}</h3>
                  <p className="mt-3 md:mt-4 text-white/70 text-[12px] md:text-sm font-body max-w-xs">{t.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}