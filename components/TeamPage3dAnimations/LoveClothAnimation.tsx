'use client';
import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const COLUMNS_DATA = [
  ['WNCC', 'TEAM', 'BUILD', 'CREATE', 'CODE', 'DESIGN'],
  ['TEAM', 'BUILD', 'CREATE', 'CODE', 'DESIGN', 'AI', 'BLOCKCHAIN', 'NITP', 'INNOVATE', 'WNCC', 'TEAM'],
  ['BUILD', 'CREATE', 'CODE', 'DESIGN', 'AI', 'BLOCKCHAIN', 'NITP', 'INNOVATE', 'WNCC', 'TEAM', 'BUILD'],
  ['CREATE', 'CODE', 'DESIGN', 'AI', 'BLOCKCHAIN', 'NITP', 'INNOVATE', 'WNCC', 'TEAM', 'BUILD', 'CREATE'],
  ['CODE', 'DESIGN', 'AI', 'BLOCKCHAIN', 'NITP', 'INNOVATE', 'WNCC', 'TEAM', 'BUILD', 'CREATE', 'CODE'],
  ['DESIGN', 'AI', 'BLOCKCHAIN', 'NITP', 'INNOVATE', 'WNCC', 'TEAM', 'BUILD', 'CREATE', 'CODE', 'DESIGN']
];

interface ClothNode {
  pos: THREE.Vector3;
  oldPos: THREE.Vector3;
  pinned: boolean;
  quat: THREE.Quaternion;   // 4D Rotation State
  angVel: THREE.Vector3;    // Spin Velocity on X, Y, Z
}

interface Constraint {
  p1: ClothNode;
  p2: ClothNode;
  restLength: number;
  stiffness: number;
}

const FONT_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json";

function PhysicalTextCurtain() {
  const lineRefs = useRef<(THREE.Line | null)[]>([]);
  const textGroupRefs = useRef<{ [key: string]: THREE.Group | null }>({});
  const glowBeadRefs = useRef<{ [key: string]: THREE.Mesh | null }>({});
  
  // Track previous cursor position to calculate real-time swipe direction/velocity
  const prevMouse3D = useRef(new THREE.Vector3(0, 0, 0));

  const startY = 3.3; 
  const spacingX = 1.45;
  const spacingY = 0.65;
  const totalCols = COLUMNS_DATA.length;
  const halfWidth = ((totalCols - 1) * spacingX) / 2;

  // --- Custom GPU Shader: Extreme Albedo/Emissive Contrast ---
  const customMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#BF00FF"),
      roughness: 0.2,
      metalness: 0.8,
      emissive: new THREE.Color("#000000"), // Managed directly inside shader compilation below
      side: THREE.DoubleSide
    });

    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = `
        varying vec3 vLocalNormal;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `#include <beginnormal_vertex>
         vLocalNormal = normal; 
        `
      );

      shader.fragmentShader = `
        varying vec3 vLocalNormal;
      ` + shader.fragmentShader;

      // 1. Force Albedo Contrast (Magenta Front vs Bone-White Back)
      shader.fragmentShader = shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `
        vec3 finalAlbedo = diffuse;
        if (vLocalNormal.z < -0.15) {
          // BACKSIDE: Stark Matte Bone White
          finalAlbedo = vec3(0.95, 0.95, 0.95);
        } else if (vLocalNormal.z > 0.15) {
          // FRONTSIDE: Vibrant Electric Magenta
          finalAlbedo = vec3(1.0, 0.0, 0.55);
        } else {
          // BEVELS/EDGES: Deep Carbon Indigo
          finalAlbedo = vec3(0.12, 0.0, 0.22);
        }
        vec4 diffuseColor = vec4(finalAlbedo, opacity);
        `
      );

      // 2. Force Emissive Contrast (Bright Glow Front vs Absolute Black Back)
      shader.fragmentShader = shader.fragmentShader.replace(
        'vec3 totalEmissiveRadiance = emissive;',
        `
        vec3 totalEmissiveRadiance = emissive;
        if (vLocalNormal.z < -0.15) {
          // Backside gets zero emissive light (completely matte)
          totalEmissiveRadiance = vec3(0.0);
        } else if (vLocalNormal.z > 0.15) {
          // Frontside gets a hyper-powered violet glow
          totalEmissiveRadiance = vec3(0.85, 0.0, 1.0) * 3.5;
        } else {
          // Sides get a very dim secondary glow
          totalEmissiveRadiance = vec3(0.2, 0.0, 0.35);
        }
        `
      );
    };

    return mat;
  }, []);

  // --- Initialize Fabric Grid ---
  const physics = useMemo(() => {
    const grid: ClothNode[][] = COLUMNS_DATA.map((colWords, colIdx) => {
      const x = -halfWidth + colIdx * spacingX;
      return colWords.map((_, rowIdx) => {
        const y = startY - rowIdx * spacingY;
        const initialPos = new THREE.Vector3(x, y, 0);
        return {
          pos: initialPos.clone(),
          oldPos: initialPos.clone(),
          pinned: rowIdx === 0,
          quat: new THREE.Quaternion(),
          angVel: new THREE.Vector3(0, 0, 0)
        };
      });
    });

    const particles: ClothNode[] = grid.flat();
    const constraints: Constraint[] = [];

    for (let c = 0; c < grid.length; c++) {
      for (let r = 0; r < grid[c].length; r++) {
        const pCurrent = grid[c][r];

        if (r + 1 < grid[c].length) {
          constraints.push({ p1: pCurrent, p2: grid[c][r + 1], restLength: spacingY, stiffness: 0.75 });
        }
        if (c + 1 < grid.length && r < grid[c + 1].length) {
          constraints.push({ p1: pCurrent, p2: grid[c + 1][r], restLength: spacingX, stiffness: 0.35 });
        }
        if (c + 1 < grid.length && r + 1 < grid[c + 1].length) {
          constraints.push({ p1: pCurrent, p2: grid[c + 1][r + 1], restLength: Math.hypot(spacingX, spacingY), stiffness: 0.25 });
        }
        if (r + 2 < grid[c].length) {
          constraints.push({ p1: pCurrent, p2: grid[c][r + 2], restLength: spacingY * 2, stiffness: 0.25 });
        }
      }
    }

    return { particles, grid, constraints };
  }, [halfWidth]);

  // --- Core Frame Physics ---
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const dt = 0.016;
    const damping = 0.955; 
    const gravity = -9.81;  

    const { pointer, viewport, camera } = state;
    const mouse3D = new THREE.Vector3(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );

    // Calculate swipe velocity vector of the user's cursor
    const mouseVelocity = mouse3D.clone().sub(prevMouse3D.current).multiplyScalar(60);
    prevMouse3D.current.copy(mouse3D);

    // Dynamic Camera Responsiveness Matrix
    const aspect = viewport.aspect;
    const targetZ = aspect < 1.3 ? Math.min(14, 7.5 / aspect) : 8.2;
    const targetY = aspect < 1.3 ? -0.4 - (1.3 - aspect) * 0.4 : -0.3;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);
    camera.lookAt(0, -0.4, 0);

    // Update translational positions & angular mechanics
    physics.particles.forEach((p) => {
      // 1. Dampen spin speed over time
      p.angVel.multiplyScalar(0.92); 

      // 2. Apply spin velocity to the object's quaternion
      const spinSpeed = p.angVel.length();
      if (spinSpeed > 0.0001) {
        const axis = p.angVel.clone().normalize();
        const deltaQuat = new THREE.Quaternion().setFromAxisAngle(axis, spinSpeed);
        p.quat.multiplyQuaternions(deltaQuat, p.quat);
      }

      // 3. SLEEP ENGINE: Restorative Slerp pulls rotations back to straight
      const restQuat = new THREE.Quaternion(); // [0,0,0,1] (perfectly straight facing camera)
      const devAngle = p.quat.angleTo(restQuat);

      if (devAngle > 0.005) {
        p.quat.slerp(restQuat, 0.07); // Pulls back smoothly
      } else {
        // Force complete static sleep once it is highly aligned
        p.quat.copy(restQuat);
        p.angVel.set(0, 0, 0);
      }

      if (p.pinned) return;

      const tempPos = p.pos.clone();
      const velocity = p.pos.clone().sub(p.oldPos).multiplyScalar(damping);

      p.pos.add(velocity);
      p.pos.y += gravity * dt * dt;

      // Wind dynamics
      p.pos.x += Math.sin(time * 3.0 + p.pos.y) * 0.12 * dt;

      p.oldPos.copy(tempPos);
    });

    // Cursor interaction, dynamic directional torque, and 3D popping
    physics.particles.forEach((p) => {
      const distToMouse = p.pos.distanceTo(mouse3D);
      const interactRadius = 2.4; 

      if (distToMouse < interactRadius) {
        if (!p.pinned) {
          const direction = p.pos.clone().sub(mouse3D);
          if (direction.length() === 0) direction.set(0.01, 0.01, 0);
          direction.normalize();

          const forceFactor = (interactRadius - distToMouse) * 0.38; 

          p.pos.add(direction.multiplyScalar(forceFactor));
          p.pos.z += forceFactor * 2.2; 
        }

        // --- DIRECONAL SWIPE TORQUE INJECTION ---
        // Converts horizontal mouse swipe to vertical (Y-axis) spins, and vertical swipe to X-axis spins
        const proximity = (interactRadius - distToMouse) / interactRadius;
        const swipeInfluence = proximity * 0.15;

        // Apply torque on all axes based on actual cursor direction
        p.angVel.x += mouseVelocity.y * swipeInfluence * 0.8; 
        p.angVel.y += mouseVelocity.x * swipeInfluence * 1.2; // Extra Y boost for flipping
        
        // Add random cartwheel (Z-axis) spin for chaotic 3D tumbling
        p.angVel.z += (Math.random() - 0.5) * proximity * 0.5;
      }
    });

    // Resolve structural springs
    const solverIterations = 6;
    for (let step = 0; step < solverIterations; step++) {
      physics.constraints.forEach((c) => {
        const delta = c.p1.pos.clone().sub(c.p2.pos);
        const currentLength = delta.length();
        if (currentLength === 0) return;

        const difference = (c.restLength - currentLength) / currentLength;
        const correction = delta.multiplyScalar(difference * 0.5 * c.stiffness);

        if (!c.p1.pinned) c.p1.pos.add(correction);
        if (!c.p2.pinned) c.p2.pos.sub(correction);
      });

      physics.grid.forEach((column, colIdx) => {
        const targetX = -halfWidth + colIdx * spacingX;
        column[0].pos.set(targetX, startY, 0);
        column[0].oldPos.copy(column[0].pos);
      });
    }

    // Sync mesh renders
    physics.grid.forEach((col, colIdx) => {
      const lineMesh = lineRefs.current[colIdx];
      if (lineMesh) {
        const linePoints = col.map((node) => node.pos.clone());
        linePoints.unshift(new THREE.Vector3(-halfWidth + colIdx * spacingX, startY + 0.25, 0));
        lineMesh.geometry.setFromPoints(linePoints);
        if (lineMesh.geometry.attributes.position) {
          lineMesh.geometry.attributes.position.needsUpdate = true;
        }
      }

      col.forEach((node, rowIdx) => {
        const textGroup = textGroupRefs.current[`${colIdx}-${rowIdx}`];
        if (textGroup) {
          textGroup.position.copy(node.pos);

          // Render physical quaternion directly to coordinate systems
          textGroup.quaternion.copy(node.quat);
        }

        if (rowIdx === col.length - 1) {
          const bead = glowBeadRefs.current[`${colIdx}`];
          if (bead) {
            bead.position.copy(node.pos).add(new THREE.Vector3(0, -0.45, 0));
          }
        }
      });
    });
  });

  return (
    <group>
      {COLUMNS_DATA.map((columnWords, colIdx) => {
        const anchorX = -halfWidth + colIdx * spacingX;

        return (
          <group key={colIdx}>
            {/* Magnetic anchor nodes */}
            <mesh position={[anchorX, startY + 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.08, 0.016, 8, 16]} />
              <meshStandardMaterial color="#BF00FF" emissive="#BF00FF" emissiveIntensity={1.2} />
            </mesh>

            {/* Threads */}
            <line ref={(el) => { lineRefs.current[colIdx] = el; }}>
              <bufferGeometry />
              <lineBasicMaterial color="#BF00FF" transparent opacity={0.45} />
            </line>

            {/* Bottom Glow Beads */}
            <mesh ref={(el) => { glowBeadRefs.current[`${colIdx}`] = el; }}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#FF00FF" emissive="#FF00FF" emissiveIntensity={5.0} toneMapped={false} />
            </mesh>

            {/* 3D Extruded text with Custom Double-Sided shader material applied */}
            {columnWords.map((word, rowIdx) => (
              <group key={rowIdx} ref={(el) => { textGroupRefs.current[`${colIdx}-${rowIdx}`] = el; }}>
                <Center>
                  <Text3D
                    font={FONT_URL}
                    size={0.15}
                    height={0.06} 
                    curveSegments={4} 
                    bevelEnabled
                    bevelThickness={0.012}
                    bevelSize={0.004}
                    bevelSegments={2}
                  >
                    {word}
                    <primitive object={customMaterial} attach="material" />
                  </Text3D>
                </Center>
              </group>
            ))}
          </group>
        );
      })}
    </group>
  );
}

export default function TextCurtain3D() {
  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-[#020104] px-4 py-6">
      {/* Responsive Aspect-Ratio Shell Box */}
      <div className="relative w-full max-w-[920px] aspect-[4/3] md:aspect-[16/10] max-h-[85vh] rounded-2xl border border-purple-500/30 bg-gradient-to-b from-[#0e071a] to-[#040208] shadow-[0_0_60px_rgba(191,0,255,0.25)] overflow-hidden flex flex-col">
        
        {/* Sci-fi Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-purple-500/60 pointer-events-none z-20"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-purple-500/60 pointer-events-none z-20"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-purple-500/60 pointer-events-none z-20"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-purple-500/60 pointer-events-none z-20"></div>

        {/* Decorative Top UI Panel */}
        <div className="w-full h-8 flex items-center justify-between px-4 border-b border-purple-900/40 bg-black/50 backdrop-blur-md z-10 select-none">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-500/70"></span>
            <span className="w-2 h-2 rounded-full bg-yellow-500/70"></span>
            <span className="w-2 h-2 rounded-full bg-green-500/70"></span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400 font-bold">
            3D Kinetic Body Mesh
          </span>
          <div className="w-4"></div>
        </div>

        {/* 3D Canvas Space */}
        <div className="w-full flex-grow relative">
          <Canvas camera={{ position: [0, -0.4, 8.2], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <pointLight position={[5, 5, 5]} intensity={2.2} color="#BF00FF" />
            <Environment preset="night" />

            <Suspense fallback={null}>
              <Sparkles count={55} scale={8} size={2.5} speed={0.6} color="#FF00FF" opacity={0.45} />
              <Sparkles count={35} scale={7} size={1.8} speed={0.4} color="#00BFFF" opacity={0.35} />

              <PhysicalTextCurtain />
            </Suspense>
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-purple-400/20 shadow-[inset_0_0_40px_rgba(191,0,255,0.12)]"></div>
      </div>
    </div>
  );
}