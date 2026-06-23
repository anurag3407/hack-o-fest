/**
 * Tiny module-level store shared between the DOM scroll wiring (HeroExperience)
 * and the imperative R3F render loop (Stage / IronMan / CrossRibbons).
 *
 * We deliberately avoid React state for the per-frame scroll value: ScrollTrigger
 * writes `progress` ~60x/sec and useFrame reads it. Pushing that through React
 * would trigger a re-render storm. A mutable singleton is the right tool here.
 */
export type HeroState = {
  /** 0 → 1 across the whole 4-section hero. */
  progress: number;
  /** true while the hero wrapper is in view; gates the render loop. */
  active: boolean;
  /** OS "reduce motion" — kills travel + bloom, renders a single static frame. */
  reduced: boolean;
  /** desktop-class device → allow bloom + higher dpr. */
  highQuality: boolean;
  /** viewport width in px, used to damp the left/right model travel on mobile. */
  vw: number;
  /** 0→1 model fade, tweened by enter/leave triggers so the suit eases in at
   *  the hero's edges instead of hard-popping (skill STEP 6). */
  vis: number;
};

export const heroState: HeroState = {
  progress: 0,
  active: true,
  reduced: false,
  highQuality: true,
  vw: typeof window !== "undefined" ? window.innerWidth : 1440,
  vis: 0,
};

/** Number of real <section> beats in the hero. */
export const HERO_BEATS = 4;

/** Map global progress (0..1) onto a continuous beat index (0..3). */
export function beatFloat(progress: number): number {
  return Math.min(HERO_BEATS - 1, Math.max(0, progress)) * (HERO_BEATS - 1);
}

/** Framerate-independent damping (a la three's MathUtils.damp). */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

/** Linear interpolate between two equal-length number tuples. */
export function lerpArr(a: number[], b: number[], t: number): number[] {
  return a.map((v, i) => v + (b[i] - v) * t);
}
