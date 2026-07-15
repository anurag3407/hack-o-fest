"use client";
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleHologram = ({ count = 4000, lineParticleCount = 250 }) => {
  const pointsRef = useRef();
  const linesRef = useRef();
  const { viewport } = useThree();

  // Smooth mouse tracker
  const mouse = useRef(new THREE.Vector3(0, 0, 0));

  // Generate base positions and network connections
  const { originalPositions, connections } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    // 1. Generate Sphere Particles
    for (let i = 0; i < count; i++) {
      const r = 2.5 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);     // x
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
      positions[i * 3 + 2] = r * Math.cos(phi);                   // z
    }

    // 2. Generate Random Connections (Plexus Effect)
    // We only connect a subset of points to keep performance high and visuals clean
    const indices = [];
    for (let i = 0; i < lineParticleCount; i++) {
      for (let j = i + 1; j < lineParticleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Connect if points are relatively close
        if (distance < 0.8) {
          indices.push(i, j);
        }
      }
    }

    return { 
      originalPositions: positions.slice(), 
      connections: new Uint16Array(indices) 
    };
  }, [count, lineParticleCount]);

  // Current mutable positions array
  const [positions] = useState(() => new Float32Array(originalPositions));

  // Handle frame-by-frame animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Smooth mouse interpolation
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, (state.pointer.x * viewport.width) / 2, 0.1);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, (state.pointer.y * viewport.height) / 2, 0.1);

    // Update individual particle positions
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];

      // -- ANIMATION 1: Breathing / Deformation --
      // Creates a wavy morphing effect based on distance from center
      const distance = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const wave = Math.sin(distance * 2 - time * 2) * 0.1 + 1; // Pulses between 0.9 and 1.1

      let cx = ox * wave;
      let cy = oy * wave;
      let cz = oz * wave;

      // -- ANIMATION 2: Cursor Repulsion --
      // Push particles away when the mouse gets close
      const dx = cx - mouse.current.x;
      const dy = cy - mouse.current.y;
      const dz = cz - 0; // Assume mouse is at z=0 plane
      
      const mouseDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const interactionRadius = 1.5;

      if (mouseDistance < interactionRadius) {
        // Calculate force (stronger closer to the center)
        const force = (interactionRadius - mouseDistance) / interactionRadius;
        const pushFactor = force * 0.8; 

        cx += (dx / mouseDistance) * pushFactor;
        cy += (dy / mouseDistance) * pushFactor;
        cz += (dz / mouseDistance) * pushFactor;
      }

      // Apply final calculated positions
      positions[i3] = cx;
      positions[i3 + 1] = cy;
      positions[i3 + 2] = cz;
    }

    // Flag the geometry to update on the GPU
    if (pointsRef.current) pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (linesRef.current) linesRef.current.geometry.attributes.position.needsUpdate = true;

    // Slowly rotate the entire system
    if (pointsRef.current) {
        pointsRef.current.rotation.y = time * 0.05;
        pointsRef.current.rotation.z = time * 0.02;
    }
    if (linesRef.current) {
        linesRef.current.rotation.y = time * 0.05;
        linesRef.current.rotation.z = time * 0.02;
    }
  });

  return (
    <group>
      {/* Particle Cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          transparent
          color="#00f3ff" // Jarvis Hologram Cyan
          size={0.035}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Network Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            array={connections}
            count={connections.length}
            itemSize={1}
          />
        </bufferGeometry>
        <lineBasicMaterial
          transparent
          color="#00f3ff"
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

export default function JarvisTeamComponent() {
  return (
    // Black background makes the additive blending and bloom pop
    <div style={{ width: '400px', height: '400px', backgroundColor: '#000' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        
        <ParticleHologram count={2500} lineParticleCount={300} />
        
      </Canvas>
    </div>
  );
}