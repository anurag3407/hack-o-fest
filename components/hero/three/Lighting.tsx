"use client";

/**
 * Studio lighting for the suit. Everything here is procedural — no HDR file is
 * fetched, so there's zero network cost and it works offline. The Environment's
 * Lightformers double as the reflections you see sliding across the armor.
 *
 * Rig:
 *   • warm gold KEY from upper-right (Stark hero light)
 *   • cool cyan RIM from behind-left (separates suit from the dark bg)
 *   • soft crimson FILL from lower-front (lifts the shadow side)
 *   • a faint cyan POINT at chest height standing in for the arc reactor
 */
import { Environment, Lightformer } from "@react-three/drei";

export function Lighting({ highQuality }: { highQuality: boolean }) {
  return (
    <>
      {/* gentle ambient so black armor never crushes to pure void */}
      <ambientLight intensity={0.35} color="#b9c7ff" />

      {/* KEY — warm gold, upper right */}
      <directionalLight
        position={[4.5, 6, 4]}
        intensity={3.1}
        color="#ffd98a"
      />
      {/* RIM — cool cyan, behind + left, gives the chrome its edge */}
      <directionalLight
        position={[-5, 3.5, -4]}
        intensity={2.4}
        color="#5fd0ff"
      />
      {/* FILL — crimson bounce from below-front */}
      <directionalLight
        position={[-1.5, -1, 5]}
        intensity={0.9}
        color="#ff3b63"
      />
      {/* arc-reactor sparkle — small cyan point near chest height. Model is
          centered on the origin, so the chest sits a little above y=0. */}
      <pointLight position={[0, 0.45, 1.2]} intensity={2.2} distance={6} color="#9be9ff" />

      <Environment resolution={highQuality ? 256 : 128} frames={1}>
        {/* big soft top key */}
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#fff0d0"
          position={[2.5, 5, 3]}
          rotation={[-Math.PI / 3, 0, 0]}
          scale={[8, 8, 1]}
        />
        {/* cyan back strip for rim reflections */}
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#48c8ff"
          position={[-4, 2, -4]}
          rotation={[Math.PI / 4, 0, 0]}
          scale={[6, 3, 1]}
        />
        {/* crimson side card */}
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#ff2d55"
          position={[5, 1, -1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[5, 4, 1]}
        />
        {/* warm gold ground bounce */}
        <Lightformer
          form="circle"
          intensity={1.0}
          color="#ffb347"
          position={[0, -3, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[6, 6, 1]}
        />
      </Environment>
    </>
  );
}
