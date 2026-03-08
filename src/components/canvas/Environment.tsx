import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { ScrollState } from '../../types/index';

interface EnvironmentProps {
  scrollState: React.MutableRefObject<ScrollState>;
  totalZ: number;
}

/* ═══════════════════════════════════════════════════════════════
   CAMERA CONTROLLER
   Moves camera along Z based on scroll, adds subtle sway.
   ═══════════════════════════════════════════════════════════════ */
function CameraController({
  scrollState,
}: {
  scrollState: React.MutableRefObject<ScrollState>;
}) {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const { cameraZ } = scrollState.current;

    camera.position.copy({
      x: Math.sin(t * 0.25) * 0.12,
      y: Math.cos(t * 0.18) * 0.08 + 0.1,
      z: cameraZ,
    } as THREE.Vector3);

    // Look slightly ahead
    camera.lookAt(camera.position.x * 0.5, 0.1, cameraZ - 10);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   AMBIENT PARTICLES — dust floating through the corridor
   ═══════════════════════════════════════════════════════════════ */
function AmbientParticles({ totalZ }: { totalZ: number }) {
  const ref = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const initializeGeometry = () => {
      const count = 800;
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
        positions[i * 3 + 2] = -Math.random() * totalZ;
        sizes[i] = 0.01 + Math.random() * 0.03;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      return geo;
    };
    return initializeGeometry();
  }, [totalZ]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const pos = ref.current.geometry.attributes.position;
    const arr = pos.array as Float32Array;

    // Gentle drift
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] += Math.sin(t * 0.3 + i * 0.01) * 0.001;
      arr[i + 1] += Math.cos(t * 0.2 + i * 0.02) * 0.0008;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color='#6633aa'
        size={0.025}
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VOLUMETRIC LIGHT RAYS — subtle god-rays along the corridor
   ═══════════════════════════════════════════════════════════════ */
function LightRays({ totalZ, scrollState }: EnvironmentProps) {
  const ref = useRef<THREE.Group>(null!);

  const rays = useMemo(() => {
    const generateRays = () => {
      const result: { x: number; z: number; height: number; opacity: number }[] =
        [];
      const count = 8;
      for (let i = 0; i < count; i++) {
        result.push({
          x: (Math.random() - 0.5) * 6,
          z: -Math.random() * totalZ,
          height: 3 + Math.random() * 3,
          opacity: 0.02 + Math.random() * 0.03,
        });
      }
      return result;
    };
    return generateRays();
  }, [totalZ]);

  useFrame(() => {
    if (!ref.current) return;
    const camZ = scrollState.current.cameraZ;

    ref.current.children.forEach((child, i) => {
      const dist = Math.abs(rays[i].z - camZ);
      (child as THREE.Mesh).material.opacity =
        dist < 30 ? rays[i].opacity * (1 - dist / 30) : 0;
    });
  });

  return (
    <group ref={ref}>
      {rays.map((ray, i) => (
        <mesh key={i} position={[ray.x, ray.height / 2 - 1, ray.z]}>
          <planeGeometry args={[0.15, ray.height]} />
          <meshBasicMaterial
            color='#8855dd'
            transparent
            opacity={ray.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ENVIRONMENT — Assembles atmosphere + camera
   ═══════════════════════════════════════════════════════════════ */
export default function Environment({ scrollState, totalZ }: EnvironmentProps) {
  return (
    <>
      {/* Camera driver */}
      <CameraController scrollState={scrollState} />

      {/* Exponential fog — depth cue */}
      <fogExp2 attach='fog' args={[0x06000f, 0.02]} />

      {/* Ambient fill */}
      <ambientLight intensity={0.3} color='#1a0030' />

      {/* Directional key — gives subtle shading to 3D elements */}
      <directionalLight position={[2, 5, 5]} intensity={0.15} color='#6633cc' />

      {/* Floating dust */}
      <AmbientParticles totalZ={totalZ} />

      {/* Volumetric rays */}
      <LightRays scrollState={scrollState} totalZ={totalZ} />
    </>
  );
}
