import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { LandingSceneProps } from '../../types';

/* ═══════════════════════════════════════════════════════════════
   LANDING SCENE
   
   A minimal, atmospheric 3D background inspired by the "Track"
   demo. Shows converging perspective lines with a vanishing point,
   plus a portal triangle that opens when transitionProgress > 0.
   
   transitionProgress: 0 = static landing, 1 = fully through portal
   ═══════════════════════════════════════════════════════════════ */

/** Perspective lines converging to vanishing point */
function ConvergingLines() {
  const groupRef = useRef<THREE.Group>(null!);

  const lines = useMemo(() => {
    const result: {
      start: THREE.Vector3;
      end: THREE.Vector3;
      opacity: number;
    }[] = [];

    // Floor lines (converging to center)
    const floorY = -2.5;
    const count = 12;
    for (let i = 0; i < count; i++) {
      const x = (i - count / 2 + 0.5) * 2.5;
      result.push({
        start: new THREE.Vector3(x, floorY, 5),
        end: new THREE.Vector3(x * 0.02, floorY * 0.3, -80),
        opacity: 0.08 + Math.abs(x) * 0.005,
      });
    }

    // Horizontal depth lines on floor
    for (let z = 0; z > -60; z -= 5) {
      const spread = 1 + Math.abs(z) * 0.15;
      result.push({
        start: new THREE.Vector3(-spread * 2, floorY + z * 0.03, z),
        end: new THREE.Vector3(spread * 2, floorY + z * 0.03, z),
        opacity: 0.04 + Math.max(0, 1 - Math.abs(z) / 60) * 0.06,
      });
    }

    // Ceiling lines
    const ceilY = 3.5;
    for (let i = 0; i < count; i++) {
      const x = (i - count / 2 + 0.5) * 2.5;
      result.push({
        start: new THREE.Vector3(x, ceilY, 5),
        end: new THREE.Vector3(x * 0.02, ceilY * 0.3, -80),
        opacity: 0.05 + Math.abs(x) * 0.003,
      });
    }

    // Vertical center line (prominent)
    result.push({
      start: new THREE.Vector3(0, ceilY + 2, 5),
      end: new THREE.Vector3(0, -0.5, -80),
      opacity: 0.2,
    });

    // Wall lines left/right
    for (let i = 0; i < 6; i++) {
      const y = (i - 2.5) * 1.2;
      // Left wall
      result.push({
        start: new THREE.Vector3(-15, y, 5),
        end: new THREE.Vector3(-0.1, y * 0.2, -80),
        opacity: 0.04,
      });
      // Right wall
      result.push({
        start: new THREE.Vector3(15, y, 5),
        end: new THREE.Vector3(0.1, y * 0.2, -80),
        opacity: 0.04,
      });
    }

    return result;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Very subtle breathing
    groupRef.current.children.forEach((child, i) => {
      const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
      const base = lines[i]?.opacity || 0.05;
      mat.opacity = base + Math.sin(t * 0.5 + i * 0.2) * 0.015;
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints([
          line.start,
          line.end,
        ]);
        return (
          <lineSegments key={i} geometry={geo}>
            <lineBasicMaterial
              color='#4488cc'
              transparent
              opacity={line.opacity}
              depthWrite={false}
            />
          </lineSegments>
        );
      })}
    </group>
  );
}

/** The portal triangle that opens on transition */
function PortalGate({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const fillRef = useRef<THREE.MeshBasicMaterial>(null!);
  const edgeRef = useRef<THREE.LineBasicMaterial>(null!);
  const innerRef = useRef<THREE.Group>(null!);

  // Portal triangle shape
  const edgeGeo = useMemo(() => {
    const s = 5;
    const h = s * Math.sin(Math.PI / 3);
    const pts = [
      new THREE.Vector3(0, h * 0.7, 0),
      new THREE.Vector3(-s * 0.85, -h * 0.35, 0),
      new THREE.Vector3(s * 0.85, -h * 0.35, 0),
      new THREE.Vector3(0, h * 0.7, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  // Inner spiral of triangles (the "eye" effect from image 2)
  const spiralTriangles = useMemo(() => {
    const items: { scale: number; rotZ: number; z: number }[] = [];
    for (let i = 0; i < 20; i++) {
      items.push({
        scale: 1 - i * 0.045,
        rotZ: i * 0.15,
        z: -i * 0.5,
      });
    }
    return items;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Gate appears at z = -30 by default
    const gateZ = -30 + progress * 5;
    groupRef.current.position.z = gateZ;

    // Scale grows during transition
    const scale = 0.3 + progress * 1.5;
    groupRef.current.scale.setScalar(scale);

    // Fill opacity
    if (fillRef.current) {
      fillRef.current.opacity =
        progress > 0.1
          ? Math.min(0.15, progress * 0.2)
          : 0.02 + Math.sin(t * 1.5) * 0.01;
    }

    // Edge glow
    if (edgeRef.current) {
      edgeRef.current.opacity = 0.3 + progress * 0.5 + Math.sin(t * 2) * 0.05;
    }

    // Inner spiral rotation
    if (innerRef.current) {
      innerRef.current.rotation.z = t * 0.15 + progress * Math.PI;
      innerRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.LineLoop)
          .material as THREE.LineBasicMaterial;
        mat.opacity =
          progress > 0.05 ? Math.min(0.6, progress * 2) * (1 - i * 0.04) : 0;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, -30]}>
      {/* Outer triangle edge */}
      <lineLoop geometry={edgeGeo}>
        <lineBasicMaterial
          ref={edgeRef}
          color='#4488cc'
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </lineLoop>

      {/* Fill plane */}
      <mesh>
        <planeGeometry args={[8, 7]} />
        <meshBasicMaterial
          ref={fillRef}
          color='#1155aa'
          transparent
          opacity={0.02}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner spiral triangles (the "eye" portal effect) */}
      <group ref={innerRef}>
        {spiralTriangles.map((tri, i) => (
          <lineLoop
            key={i}
            geometry={edgeGeo}
            scale={[tri.scale, tri.scale, 1]}
            rotation={[0, 0, tri.rotZ]}
            position={[0, 0, tri.z]}
          >
            <lineBasicMaterial
              color='#44aaff'
              transparent
              opacity={0}
              depthWrite={false}
            />
          </lineLoop>
        ))}
      </group>
    </group>
  );
}

/** Ambient particles for depth */
function LandingParticles() {
  const ref = useRef<THREE.Points>(null!);

  const geo = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = -Math.random() * 80;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] += Math.sin(t * 0.2 + i * 0.005) * 0.003;
      arr[i + 1] += Math.cos(t * 0.15 + i * 0.01) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color='#3366aa'
        size={0.03}
        transparent
        opacity={0.25}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/** Camera controller for landing — slight drift, zoom on transition */
function LandingCamera({ progress }: { progress: number }) {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Base position with gentle drift
    const baseZ = 8;
    // During transition, camera accelerates forward
    const zoomZ = progress * progress * 60; // quadratic ease for acceleration feel

    camera.position.x = Math.sin(t * 0.15) * 0.3 * (1 - progress);
    camera.position.y = Math.cos(t * 0.1) * 0.15 * (1 - progress) + 0.2;
    camera.position.z = baseZ - zoomZ;

    // Look at vanishing point
    camera.lookAt(0, 0.1, camera.position.z - 20);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   LANDING SCENE — Main export
   ═══════════════════════════════════════════════════════════════ */
export default function LandingScene({
  transitionProgress,
}: LandingSceneProps) {
  return (
    <>
      <LandingCamera progress={transitionProgress} />

      {/* Dark atmosphere */}
      <fogExp2 attach='fog' args={[0x040810, 0.015]} />
      <ambientLight intensity={0.15} color='#0a1520' />

      {/* Perspective grid lines */}
      <ConvergingLines />

      {/* Portal triangle */}
      <PortalGate progress={transitionProgress} />

      {/* Floating dust */}
      <LandingParticles />
    </>
  );
}
