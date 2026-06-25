"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { registerGsap } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const { gsap, ScrollTrigger } = registerGsap();
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    // Drive Lenis from GSAP's ticker and forward Lenis scroll into
    // ScrollTrigger.update. This lockstep is what keeps scrubbed 3D/scroll
    // animations from "shaking" against Lenis's smoothing (vs. a separate rAF
    // loop, which runs out of phase with ScrollTrigger).
    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => lenis.raf(time * 1000); // gsap secs → lenis ms
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
