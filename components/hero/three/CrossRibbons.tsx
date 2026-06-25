"use client";

/**
 * Two infinite energy ribbons crossing in an X behind the suit, with light
 * streaks that run along them forever. Implemented as two long, gently
 * undulating planes (~400 tris each) wearing a procedurally-drawn streak
 * texture whose UV offset we scroll every frame — so "infinite + running"
 * costs almost nothing.
 *
 * Edges are feathered in the texture's alpha and blending is additive, so each
 * ribbon reads as a band of light and the Bloom pass makes it bloom.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroState } from "./heroState";

/** Draw a horizontal streak strip with vertical feather into a canvas texture. */
function makeStreakTexture(rgb: [number, number, number]): THREE.Texture {
  const w = 1024;
  const h = 128;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;

  // transparent base
  ctx.clearRect(0, 0, w, h);

  const [r, g, b] = rgb;
  // a run of bright streaks of varying width/intensity across U
  const streaks = 26;
  for (let i = 0; i < streaks; i++) {
    const x = (i / streaks) * w + ((i * 53) % 17);
    const sw = 6 + ((i * 37) % 26); // streak width
    const alpha = 0.25 + ((i * 29) % 60) / 100; // 0.25..0.85
    const grad = ctx.createLinearGradient(x - sw, 0, x + sw, 0);
    grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${alpha})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - sw, 0, sw * 2, h);
  }

  // a soft continuous base glow so the band never fully disappears
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, `rgba(${r},${g},${b},0)`);
  base.addColorStop(0.5, `rgba(${r},${g},${b},0.16)`);
  base.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // vertical feather: multiply alpha so top/bottom edges fade out
  const img = ctx.getImageData(0, 0, w, h);
  for (let y = 0; y < h; y++) {
    const v = y / (h - 1);
    const feather = Math.sin(v * Math.PI); // 0 at edges, 1 in middle
    const fa = Math.pow(feather, 1.4);
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4 + 3;
      img.data[idx] = img.data[idx] * fa;
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(3, 1);
  tex.anisotropy = 4;
  return tex;
}

/** Build a long band that undulates along its length for a sense of depth. */
function makeRibbonGeometry(length: number, width: number) {
  const segs = 220;
  const geo = new THREE.PlaneGeometry(length, width, segs, 1);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const t = x / length; // -0.5..0.5
    // two-frequency wave pushes the band in/out of the screen
    const z = Math.sin(t * Math.PI * 6) * 0.55 + Math.sin(t * Math.PI * 13) * 0.18;
    pos.setZ(i, z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function Ribbon({
  color,
  rotationZ,
  width,
  speed,
  z,
}: {
  color: [number, number, number];
  rotationZ: number;
  width: number;
  speed: number;
  z: number;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const tex = useMemo(() => makeStreakTexture(color), [color]);
  const geo = useMemo(() => makeRibbonGeometry(34, width), [width]);

  useFrame((_, dt) => {
    if (!heroState.active) return;
    // run the streaks; freeze them under reduced motion
    const s = heroState.reduced ? 0 : speed;
    tex.offset.x -= s * dt;
    // the ribbons belong to the HERO beat — fade them out as you scroll on, so
    // they don't cross over the Hall-of-Armor resting photo at the end.
    if (matRef.current) {
      const fade = 1 - Math.min(1, Math.max(0, (heroState.progress - 0.15) / 0.4));
      matRef.current.opacity = 0.9 * fade;
    }
  });

  return (
    <mesh geometry={geo} rotation={[0, 0, rotationZ]} position={[0, 0, z]}>
      <meshBasicMaterial
        ref={matRef}
        map={tex}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
        opacity={0.9}
      />
    </mesh>
  );
}

export function CrossRibbons() {
  // Behind the suit (negative Z), crossing in an X. Gold × arc-reactor cyan.
  return (
    <group position={[0, 0, -2.4]}>
      <Ribbon color={[255, 205, 70]} rotationZ={0.62} width={1.5} speed={0.09} z={-0.15} />
      <Ribbon color={[120, 225, 255]} rotationZ={-0.62} width={1.4} speed={0.12} z={0.15} />
    </group>
  );
}
