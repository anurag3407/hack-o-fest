"use client";

/**
 * The R3F scene inside the fixed hero <Canvas>. It turns scroll progress into
 * MODEL motion only — the camera is locked to a fixed, straight-on FRONT VIEW.
 *
 * Data flow:
 *   HeroExperience (DOM) → ScrollTrigger → heroState.progress  (mutable singleton)
 *                                          ↓ read every frame
 *   here: sampleBeats(progress) → damp the model group toward the sampled beat
 *
 * The camera never moves: the suit spins (full 360° each way), grows, and slides
 * left/right in front of a static lens. Nothing here calls React setState in the
 * loop, so it animates at full framerate without re-rendering the tree.
 */
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { IronManModel } from "./IronManModel";
import { Lighting } from "./Lighting";
import { CrossRibbons } from "./CrossRibbons";
import { sampleBeats } from "./heroBeats";
import { heroState, damp } from "./heroState";

/* ── FIXED FRONT-VIEW CAMERA ──────────────────────────────────────────────
   Straight-on, eye-level lens aimed at the model's center (which is the world
   origin — see IronManModel). The suit sits dead-center in frame like a movie
   shot. Pull CAM_Z out to leave more letterbox margin around the suit. */
const CAM_POS: [number, number, number] = [0, 0, 7.4];
const CAM_LOOK: [number, number, number] = [0, 0, 0];

export function IronManStage({ highQuality }: { highQuality: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const cameraPinned = useRef(false);

  useFrame((_, rawDt) => {
    if (!heroState.active) return;
    const dt = Math.min(rawDt, 1 / 30); // clamp huge tab-switch deltas

    // Pin the camera once (and keep it pinned across HMR / resizes). Front view
    // is fixed — all the drama comes from the model, per the brief.
    if (!cameraPinned.current) {
      camera.position.set(CAM_POS[0], CAM_POS[1], CAM_POS[2]);
      camera.lookAt(CAM_LOOK[0], CAM_LOOK[1], CAM_LOOK[2]);
      camera.updateProjectionMatrix();
      cameraPinned.current = true;
    }

    // Narrow screens: damp the horizontal travel so the suit stays on stage.
    const travelDamp = heroState.vw < 760 ? 0.5 : heroState.vw < 1100 ? 0.74 : 1;
    const beat = sampleBeats(heroState.progress, travelDamp);

    const g = groupRef.current;
    if (!g) return;

    if (heroState.reduced) {
      // reduced motion: snap, no easing, no idle.
      g.position.set(beat.model[0], beat.model[1], beat.model[2]);
      g.rotation.y = beat.rotY;
      g.scale.setScalar(beat.scale);
      return;
    }

    // position — lambda 6 keeps the left/right slide tight to the scroll.
    g.position.x = damp(g.position.x, beat.model[0], 6, dt);
    g.position.z = damp(g.position.z, beat.model[2], 6, dt);

    // yaw — the full ±360° turntable. Higher lambda so a fast scroll still
    // completes the whole revolution instead of short-cutting it.
    g.rotation.y = damp(g.rotation.y, beat.rotY, 7, dt);

    // scale — the grow-as-you-scroll.
    g.scale.setScalar(damp(g.scale.x, beat.scale, 5, dt));

    // idle: a faint vertical hover (NOT a yaw wobble) so the suit stays exactly
    // front-on at every rest point while still feeling alive / powered-up.
    const bob = Math.sin(performance.now() * 0.0011) * 0.04;
    g.position.y = damp(g.position.y, beat.model[1], 6, dt) + bob;
  });

  return (
    <>
      <Lighting highQuality={highQuality} />
      <CrossRibbons />
      <IronManModel groupRef={groupRef} />

      {highQuality && (
        <EffectComposer enableNormalPass={false} multisampling={0}>
          <Bloom
            intensity={0.85}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.22}
            mipmapBlur
            radius={0.7}
          />
        </EffectComposer>
      )}
    </>
  );
}
