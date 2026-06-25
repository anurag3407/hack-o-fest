/**
 * ============================================================================
 *  HERO CHOREOGRAPHY — front-view turntable.
 *
 *  The CAMERA IS FIXED dead-front (see IronManStage.tsx). All motion belongs to
 *  the MODEL, which lives in a normalized world: auto-centered on X/Z, FEET at
 *  y = 0, auto-scaled so scale 1 ≈ MODEL_HEIGHT tall (see IronManModel.tsx).
 *
 *  4 beats, matching the 4 real DOM sections:
 *    0  HERO   — small, centered, BELOW the title, facing front
 *    1  ABOUT  — spins a full +360°, GROWS, slides RIGHT   (text → left)
 *    2  STATS  — spins a full −360° (opposite way), slides LEFT (text → right)
 *    3  REST   — returns to CENTER, facing front, largest
 *
 *  Because each beat's rotY is a whole multiple of 2π, the suit always settles
 *  FRONT-ON at every rest point; the full turn happens *between* beats as you
 *  scroll. Growth (scale) naturally lifts the feet-pinned model from low-frame
 *  (under the title) up into center as it enlarges — no Y move needed.
 *
 *  To retune travel/spin/size, edit the tuples below. To fix global facing or
 *  size, see MODEL_HEIGHT / BASE_ROT_Y in IronManModel.tsx.
 * ============================================================================
 */

export const TAU = Math.PI * 2;

export type Beat = {
  /** model group world position [x, y, z]. y stays 0 (feet on floor). */
  model: [number, number, number];
  /** absolute model yaw in radians. Whole multiples of TAU ⇒ front-facing. */
  rotY: number;
  /** uniform scale (1 ≈ MODEL_HEIGHT). Grows after the hero beat. */
  scale: number;
};

export const BEATS: Beat[] = [
  // 0 — HERO: small, centered, sits below the big HACK·O·FEST title, front-on.
  { model: [0, 0, 0], rotY: 0, scale: 0.72 },
  // 1 — ABOUT: one full +360° turn, grow, travel to the RIGHT.
  { model: [1.55, 0, 0], rotY: TAU, scale: 1.08 },
  // 2 — STATS: one full −360° turn (TAU→0 = opposite spin), travel to the LEFT.
  { model: [-1.55, 0, 0], rotY: 0, scale: 1.08 },
  // 3 — REST: glide back to dead center, front-on, a touch larger.
  { model: [0, 0, 0], rotY: 0, scale: 1.16 },
];

const smoothstep = (t: number) => t * t * (3 - 2 * t);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export type SampledBeat = {
  model: [number, number, number];
  rotY: number;
  scale: number;
};

/**
 * Sample the continuous choreography at global progress (0..1).
 * `travelDamp` (0..1) scales the horizontal model travel — passed < 1 on narrow
 * viewports so the suit doesn't slide off-stage on phones.
 */
export function sampleBeats(progress: number, travelDamp = 1): SampledBeat {
  const p = Math.min(1, Math.max(0, progress));
  const span = BEATS.length - 1; // 3
  const f = p * span; // 0..3
  const i = Math.min(span - 1, Math.floor(f));
  const t = smoothstep(f - i);

  const a = BEATS[i];
  const b = BEATS[i + 1];

  const model = lerp3(a.model, b.model, t);
  model[0] *= travelDamp;

  return {
    model,
    rotY: lerp(a.rotY, b.rotY, t),
    scale: lerp(a.scale, b.scale, t),
  };
}
