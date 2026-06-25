"use client";

import { useLayoutEffect, useRef, useCallback, useState, useEffect } from "react";
import { registerGsap } from "@/lib/gsap";

/* ─────────────────────────────────────────────
   PHASE DATA
───────────────────────────────────────────── */
const PHASES = [
  {
    id: "01",
    act: "Acto I",
    title: "INICIOS",
    subtitle: "REGISTRATION OPENS",
    date: "AUG 14",
    color: "#7A3CFF",
    glow: "rgba(122,60,255,0.5)",
    description: "Lock in your squad. Pick your track. Sharpen your gauntlet.",
    images: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80",
    ],
  },
  {
    id: "02",
    act: "Acto II",
    title: "RECUERDOS",
    subtitle: "IDEATION ROUND",
    date: "SEP 03",
    color: "#00E5FF",
    glow: "rgba(0,229,255,0.45)",
    description: "Submit your one-pager. 100 teams advance.",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&q=80",
      "https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?w=500&q=80",
    ],
  },
  {
    id: "03",
    act: "Acto III",
    title: "VENGANZA",
    subtitle: "FINAL · ON-STAGE",
    date: "OCT 05",
    color: "#FF2D55",
    glow: "rgba(255,45,85,0.5)",
    description: "Demo day. Crowd. Press. Cash. Tears (good kind).",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80",
      "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=500&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&q=80",
    ],
  },
];

/* ─────────────────────────────────────────────
   3D TILT CARD (mouse-reactive)
───────────────────────────────────────────── */
function TiltCard({
  image,
  alt,
  width,
  height,
  rotation,
  offsetX,
  offsetY,
  zIdx,
  phaseColor,
  glow,
  isMain,
  label,
  actLabel,
}: {
  image: string;
  alt: string;
  width: number;
  height: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  zIdx: number;
  phaseColor: string;
  glow: string;
  isMain: boolean;
  label?: string;
  actLabel?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rX: 0, rY: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rX: -y * 20, rY: x * 20 });
  }, []);

  const handleLeave = useCallback(() => {
    setTilt({ rX: 0, rY: 0 });
    setHovered(false);
  }, []);

  return (
    <div
      className="absolute will-change-transform"
      style={{
        left: `${offsetX}px`,
        top: `${offsetY}px`,
        zIndex: zIdx,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        className="relative cursor-pointer transition-[box-shadow] duration-300"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          perspective: "800px",
        }}
      >
        <div
          className="w-full h-full rounded-xl overflow-hidden transform-gpu transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tilt.rX}deg) rotateY(${tilt.rY}deg) scale(${hovered ? 1.04 : 1})`,
            transformStyle: "preserve-3d",
            boxShadow: hovered
              ? `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${glow}, inset 0 0 0 1.5px ${phaseColor}`
              : `0 15px 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.06)`,
          }}
        >
          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
            loading="lazy"
          />

          {/* Cinematic gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 30%, ${phaseColor}44 70%, ${phaseColor}bb 100%)`,
            }}
          />

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.6) 2px, rgba(255,255,255,0.6) 3px)",
            }}
          />

          {/* Inner shadow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              boxShadow: "inset 0 -40px 60px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.06)",
            }}
          />

          {/* Neon border glow on hover */}
          {hovered && (
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                boxShadow: `0 0 20px ${glow}, 0 0 60px ${glow}`,
                opacity: 0.6,
              }}
            />
          )}

          {/* Label on main card */}
          {isMain && (
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <div
                className="font-mono text-[9px] tracking-[0.3em] uppercase mb-1 opacity-80"
                style={{ color: phaseColor }}
              >
                {actLabel}
              </div>
              <div className="font-display text-cream text-xl md:text-2xl font-black uppercase leading-none tracking-tight">
                {label}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PHASE CLUSTER (3 cards per phase, reference-matched layout)
───────────────────────────────────────────── */
function PhaseCluster({ phase, index }: { phase: (typeof PHASES)[0]; index: number }) {
  // Card arrangements per phase — matching the reference image's angular fan shape
  // Each card: [width, height, rotation, offsetX, offsetY, zIndex]
  const layouts: [number, number, number, number, number, number][][] = [
    // Acto I — left card tilted left, center forward, right card tilted right
    [
      [150, 200, -12, 0, 40, 10],
      [190, 260, 0, 130, 0, 20],
      [140, 190, 10, 290, 50, 15],
    ],
    // Acto II — cascade arrangement
    [
      [140, 190, -8, 0, 30, 12],
      [195, 265, 3, 120, 0, 22],
      [145, 195, 12, 285, 40, 14],
    ],
    // Acto III — ascending right-tilt fan
    [
      [145, 195, -10, 0, 45, 11],
      [190, 260, 2, 125, 0, 21],
      [140, 190, 14, 285, 35, 16],
    ],
  ];

  const layout = layouts[index] ?? layouts[0];

  return (
    <div
      className="tl-cluster relative flex-shrink-0"
      style={{ width: "440px", height: "310px" }}
    >
      {phase.images.map((img, imgIdx) => {
        const [w, h, rot, offX, offY, z] = layout[imgIdx];
        return (
          <TiltCard
            key={imgIdx}
            image={img}
            alt={`${phase.act} — image ${imgIdx + 1}`}
            width={w}
            height={h}
            rotation={rot}
            offsetX={offX}
            offsetY={offY}
            zIdx={z}
            phaseColor={phase.color}
            glow={phase.glow}
            isMain={imgIdx === 1}
            label={imgIdx === 1 ? phase.title : undefined}
            actLabel={imgIdx === 1 ? phase.act : undefined}
          />
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CINEMATIC SVG PATH (curved dotted path + energy pulse)
   
   This is an absolutely positioned SVG behind the rail.
   The path curves organically through the 3 phase positions.
───────────────────────────────────────────── */
function CinematicDottedPath() {
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setLen(pathRef.current.getTotalLength());
    }
  }, []);

  // Organic S-curve weaving through the 3 phase clusters
  const d =
    "M 80 420 C 200 420, 280 160, 480 220 S 680 480, 860 300 C 960 200, 1020 380, 1120 220 S 1300 80, 1480 180 C 1580 240, 1640 380, 1780 300 S 1960 120, 2100 200";

  return (
    <svg
      className="tl-svg-path absolute top-0 left-0 pointer-events-none will-change-transform"
      style={{ width: "2400px", height: "600px" }}
      viewBox="0 0 2200 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft outer glow */}
        <filter id="path-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Intense glow for pulse */}
        <filter id="pulse-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Gradient for pulse traveling beam */}
        <linearGradient id="beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="30%" stopColor="#7A3CFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#00E5FF" stopOpacity="1" />
          <stop offset="70%" stopColor="#FF2D55" stopOpacity="0.9" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Background glow layer — soft purple/pink */}
      <path
        d={d}
        stroke="rgba(122,60,255,0.12)"
        strokeWidth="10"
        fill="none"
        filter="url(#path-glow)"
      />

      {/* Main dotted track */}
      <path
        ref={pathRef}
        d={d}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2.5"
        strokeDasharray="4 12"
        strokeLinecap="round"
        fill="none"
      />

      {/* Animated neon energy pulse */}
      {len > 0 && (
        <path
          d={d}
          stroke="url(#beam-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#pulse-glow)"
          style={{
            strokeDasharray: `${len * 0.15} ${len * 0.85}`,
            animation: "dashPulse 4s linear infinite",
          }}
        />
      )}

      {/* Phase connection nodes — glowing dots at key points */}
      {[
        { cx: 80, cy: 420, color: "#7A3CFF" },
        { cx: 480, cy: 220, color: "#7A3CFF" },
        { cx: 860, cy: 300, color: "#00E5FF" },
        { cx: 1480, cy: 180, color: "#00E5FF" },
        { cx: 1780, cy: 300, color: "#FF2D55" },
        { cx: 2100, cy: 200, color: "#FF2D55" },
      ].map((dot, i) => (
        <g key={i}>
          <circle
            cx={dot.cx}
            cy={dot.cy}
            r="6"
            fill={dot.color}
            opacity="0.3"
            filter="url(#pulse-glow)"
          />
          <circle
            cx={dot.cx}
            cy={dot.cy}
            r="3"
            fill={dot.color}
            opacity="0.9"
          >
            <animate attributeName="r" values="3;5;3" dur="2.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Decorative elements from reference — "x" cross mark */}
      <g transform="translate(160, 500)" opacity="0.4">
        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#FF2D55" strokeWidth="2" />
        <line x1="8" y1="-8" x2="-8" y2="8" stroke="#FF2D55" strokeWidth="2" />
      </g>

      {/* Decorative target circle */}
      <g transform="translate(2050, 130)" opacity="0.3">
        <circle cx="0" cy="0" r="18" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
        <circle cx="0" cy="0" r="3" fill="#FFD23F" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MAIN TIMELINE COMPONENT
───────────────────────────────────────────── */
export function Timeline() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Title + header stagger intro
      gsap.from(".tl-header-el", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%" },
      });

      if (reduced) return;

      const rail = root.querySelector(".tl-rail") as HTMLElement | null;
      if (!rail) return;

      const getScrollAmount = () => rail.scrollWidth - window.innerWidth + window.innerWidth * 0.1;

      // Main horizontal scroll tween
      const horizontalTween = gsap.to([rail, ".tl-svg-path"], {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: ".tl-stage",
          start: "top top",
          end: () => `+=${getScrollAmount() * 1.3}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // 2.5D cylinder flow — each phase cluster gets perspective rotation on scroll
      const clusters = rail.querySelectorAll<HTMLElement>(".tl-cluster");
      clusters.forEach((cluster) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: cluster,
              containerAnimation: horizontalTween,
              start: "left 100%",
              end: "right 0%",
              scrub: true,
            },
          })
          // Entry: slide from right with rotateY
          .fromTo(
            cluster,
            {
              transform: "perspective(1200px) rotateY(-25deg) scale(0.8)",
              opacity: 0.3,
            },
            {
              transform: "perspective(1200px) rotateY(0deg) scale(1.05)",
              opacity: 1,
              ease: "none",
              duration: 0.5,
            }
          )
          // Exit: rotate out to left
          .to(cluster, {
            transform: "perspective(1200px) rotateY(25deg) scale(0.8)",
            opacity: 0.3,
            ease: "none",
            duration: 0.5,
          });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="timeline"
      ref={rootRef}
      className="relative bg-void overflow-hidden min-h-screen select-none [backface-visibility:hidden]"
    >
      {/* ── Cinematic ambient background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep cosmic radial glows */}
        <div
          className="absolute top-[-15%] left-[5%] w-[700px] h-[700px] rounded-full opacity-[0.15] blur-[140px]"
          style={{ background: "radial-gradient(circle, #7A3CFF 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-[0.1] blur-[120px]"
          style={{ background: "radial-gradient(circle, #FF2D55 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] left-[30%] w-[800px] h-[500px] rounded-full opacity-[0.12] blur-[140px]"
          style={{ background: "radial-gradient(circle, #00E5FF 0%, transparent 70%)" }}
        />
        {/* Subtle mesh grid for depth */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(122,60,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(122,60,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Film grain */}
        <div className="grain absolute inset-0" />
      </div>

      {/* ── Section header ── */}
      <div className="px-6 md:px-16 pt-32 max-w-[1600px] mx-auto relative z-10">
        {/* Eyebrow */}
        <div className="tl-header-el flex items-center gap-4 mb-6 text-cream/60 uppercase tracking-[0.4em] text-xs md:text-sm">
          <span className="w-2 h-2 rounded-full bg-infinity animate-pulse" />
          SECTION // 04 · THE GAUNTLET
        </div>

        {/* Header row: LÍNEA TEMPORAL on left, SINOPSIS on right */}
        <div className="flex items-start justify-between flex-wrap gap-8">
          {/* Big stylized title */}
          <h2 className="tl-header-el font-accent text-[14vw] md:text-[7vw] leading-[0.9] tracking-tight uppercase italic">
            <span
              className="block"
              style={{
                color: "#ff2d55",
                textShadow: "0 0 30px rgba(255,45,85,0.4), 0 0 80px rgba(255,45,85,0.15), 3px 3px 0 rgba(122,60,255,0.5)",
                WebkitTextStroke: "0.5px rgba(255,255,255,0.1)",
              }}
            >
              LÍNEA
            </span>
            <span
              className="block"
              style={{
                color: "#7A3CFF",
                textShadow: "0 0 30px rgba(122,60,255,0.5), 0 0 80px rgba(122,60,255,0.2), 3px 3px 0 rgba(255,45,85,0.4)",
                WebkitTextStroke: "0.5px rgba(255,255,255,0.1)",
              }}
            >
              TEMPORAL
            </span>
          </h2>

          {/* SINOPSIS on right */}
          <div className="tl-header-el self-center flex items-center gap-4">
            <div className="hidden md:block w-[120px] h-px bg-gradient-to-r from-transparent via-cream/20 to-cream/40" />
            <span className="font-mono text-sm md:text-base tracking-[0.5em] text-cream/50 uppercase">
              SINOPSIS
            </span>
          </div>
        </div>

        {/* Blurb */}
        <p className="tl-header-el mt-6 max-w-2xl text-cream/60 text-lg font-body leading-relaxed">
          Five gates. Five chances to advance, fail, learn, and come back stronger.
          The infinity gem moves with you.
        </p>
      </div>

      {/* ── Horizontal scrolling stage ── */}
      <div className="tl-stage relative h-[80vh] w-full flex items-center mt-4 overflow-hidden">
        {/* Cinematic dotted SVG path behind everything */}
        <div className="absolute inset-0 pointer-events-none flex items-center overflow-hidden">
          <CinematicDottedPath />
        </div>

        {/* Horizontal rail with phase clusters */}
        <div className="tl-rail absolute top-0 left-0 h-full flex items-center gap-[8vw] pl-[25vw] pr-[35vw] will-change-transform [transform-style:preserve-3d]">
          {PHASES.map((phase, i) => (
            <div key={phase.id} className="relative flex-shrink-0 flex flex-col items-center gap-4">
              {/* Phase cluster (3 tilted cards) */}
              <PhaseCluster phase={phase} index={i} />

              {/* Phase label underneath */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                <div
                  className="font-mono text-[10px] tracking-[0.35em] uppercase mb-1"
                  style={{ color: phase.color }}
                >
                  {phase.act}
                </div>
                <div
                  className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight"
                  style={{
                    color: phase.color,
                    textShadow: `0 0 25px ${phase.glow}`,
                  }}
                >
                  {phase.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}