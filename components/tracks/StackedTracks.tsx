"use client";

import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "@/lib/gsap";
import { trackColors } from "@/lib/palette";

const tracks = [
  {
    id: "reality",
    name: "REALITY",
    subtitle: "AI · ML · Generative",
    blurb: "Bend the perceptible. Build systems that hallucinate truth.",
    number: "01",
    sponsor: "STARK INDUSTRIES",
  },
  {
    id: "power",
    name: "POWER",
    subtitle: "Web3 · Blockchain · DeFi",
    blurb: "Energy made trustless. Protocols that move planets.",
    number: "02",
    sponsor: "ASGARDIAN LABS",
  },
  {
    id: "mind",
    name: "MIND",
    subtitle: "Dev Tools · DX",
    blurb: "Tools that think with you. Editors that read intent.",
    number: "03",
    sponsor: "WAKANDA OS",
  },
  {
    id: "time",
    name: "TIME",
    subtitle: "Realtime · Streaming",
    blurb: "Latency is a lie. Build for the present tense.",
    number: "04",
    sponsor: "CHRONO CORP",
  },
  {
    id: "space",
    name: "SPACE",
    subtitle: "Open Innovation",
    blurb: "No rules. Build the thing that shouldn't exist yet.",
    number: "05",
    sponsor: "NOVA CORPS",
  },
  {
    id: "soul",
    name: "SOUL",
    subtitle: "Social · Impact · Climate",
    blurb: "Code that costs you something. Build for the world.",
    number: "06",
    sponsor: "FOUNDATION",
  },
] as const;

import { TrackCard1 } from "./cards/TrackCard1";
import { TrackCard2 } from "./cards/TrackCard2";
import { TrackCard3 } from "./cards/TrackCard3";
import { TrackCard4 } from "./cards/TrackCard4";
import { TrackCard5 } from "./cards/TrackCard5";
import { TrackCard6 } from "./cards/TrackCard6";

export function StackedTracks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const { gsap, ScrollTrigger } = registerGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // You can add entrance animations for the cards here if you want
      // For now, we rely on native sticky positioning for a flawlessly smooth 
      // sliding overlap effect without any weird scaling or darkening gaps.
    }, root);

    return () => ctx.revert();
  }, []);

  // Card wrapper styles to ensure consistent stacking size
  const cardStyle = (index: number, isLast: boolean) => ({
    width: "85vw",
    height: "85vh",
    top: "12vh", // The pin point centered vertically
    marginBottom: "100vh" ,// Space for the card to stay pinned while scrolling
    borderRadius: "2.5rem",
    zIndex: index + 1,
  });

  return (
    <section ref={containerRef} className="relative w-full bg-void pb-32">
      {/* Title */}
      <div className="pt-24 pb-12 flex justify-center">
        <h2 className="text-4xl md:text-6xl font-display text-cream uppercase tracking-widest">
          The 6 Tracks
        </h2>
      </div>

      <div className="relative w-full flex flex-col items-center">
        {/* Reality */}
        <div className="stacked-card sticky overflow-hidden shadow-2xl" style={cardStyle(0, false)}>
           <TrackCard1 />
        </div>
        
        {/* Power */}
        <div className="stacked-card sticky overflow-hidden shadow-2xl" style={cardStyle(1, false)}>
           <TrackCard2 />
        </div>
        
        {/* Mind */}
        <div className="stacked-card sticky overflow-hidden shadow-2xl" style={cardStyle(2, false)}>
           <TrackCard3 />
        </div>
        
        {/* Time */}
        <div className="stacked-card sticky overflow-hidden shadow-2xl" style={cardStyle(3, false)}>
           <TrackCard4 />
        </div>
        
        {/* Space */}
        <div className="stacked-card sticky overflow-hidden shadow-2xl" style={cardStyle(4, false)}>
           <TrackCard5 />
        </div>
        
        {/* Soul */}
        <div className="stacked-card sticky overflow-hidden shadow-2xl" style={cardStyle(5, true)}>
           <TrackCard6 />
        </div>
      </div>
    </section>
  );
}
