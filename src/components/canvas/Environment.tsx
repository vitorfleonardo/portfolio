import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SECTIONS } from '../../data/projects';
import { getBiomeTheme } from '../../data/themes';
import type { ScrollState } from '../../types/index';

interface EnvironmentProps {
  scrollState: React.MutableRefObject<ScrollState>;
  totalZ: number;
}

/* ═══════════════════════════════════════════════════════════════
   CAMERA CONTROLLER — Z from scroll + organic sway
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

    camera.lookAt(camera.position.x * 0.5, 0.1, cameraZ - 10);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   DYNAMIC FOG — Lerps color + density between biomes
   ═══════════════════════════════════════════════════════════════ */
function DynamicFog({
  scrollState,
}: {
  scrollState: React.MutableRefObject<ScrollState>;
}) {
  const { scene } = useThree();
  const currentFogColor = useRef(new THREE.Color(0x06000f));
  const currentDensity = useRef(0.02);

  useFrame(() => {
    const sIdx = scrollState.current.currentSection;
    const section = SECTIONS[sIdx];
    if (!section) return;

    const theme = getBiomeTheme(section.type);

    // Smooth lerp fog color
    currentFogColor.current.lerp(theme.fogColor, 0.02);
    currentDensity.current +=
      (theme.fogDensity - currentDensity.current) * 0.02;

    // Apply to scene fog
    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(currentFogColor.current);
      scene.fog.density = currentDensity.current;
    }
  });

  return <fogExp2 attach='fog' args={[0x06000f, 0.02]} />;
}

/* ═══════════════════════════════════════════════════════════════
   AMBIENT PARTICLES — Color shifts per biome
   ═══════════════════════════════════════════════════════════════ */
function AmbientParticles({
  totalZ,
  scrollState,
}: {
  totalZ: number;
  scrollState: React.MutableRefObject<ScrollState>;
}) {
  const ref = useRef<THREE.Points>(null!);
  const targetColor = useRef(new THREE.Color('#6633aa'));

  const geometry = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = -Math.random() * totalZ;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [totalZ]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();

    // Color shift toward current biome
    const sIdx = scrollState.current.currentSection;
    const theme = getBiomeTheme(SECTIONS[sIdx].type);
    targetColor.current.set(theme.particleColor);
    (ref.current.material as THREE.PointsMaterial).color.lerp(
      targetColor.current,
      0.02,
    );

    // Gentle drift
    const pos = ref.current.geometry.attributes.position;
    const arr = pos.array as Float32Array;
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
   VOLUMETRIC LIGHT RAYS — tinted per biome
   ═══════════════════════════════════════════════════════════════ */
function LightRays({ totalZ, scrollState }: EnvironmentProps) {
  const ref = useRef<THREE.Group>(null!);
  const targetColor = useRef(new THREE.Color('#8855dd'));

  const rays = useMemo(() => {
    const result: { x: number; z: number; height: number; opacity: number }[] =
      [];
    for (let i = 0; i < 8; i++) {
      result.push({
        x: (Math.random() - 0.5) * 6,
        z: -Math.random() * totalZ,
        height: 3 + Math.random() * 3,
        opacity: 0.02 + Math.random() * 0.03,
      });
    }
    return result;
  }, [totalZ]);

  useFrame(() => {
    if (!ref.current) return;
    const camZ = scrollState.current.cameraZ;
    const sIdx = scrollState.current.currentSection;
    const sectionColor = new THREE.Color(SECTIONS[sIdx].color);
    targetColor.current.lerp(sectionColor, 0.02);

    ref.current.children.forEach((child, i) => {
      const dist = Math.abs(rays[i].z - camZ);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = dist < 30 ? rays[i].opacity * (1 - dist / 30) : 0;
      mat.color.lerp(targetColor.current, 0.01);
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
   REACTIVE LIGHTING — Directional light tints per biome
   ═══════════════════════════════════════════════════════════════ */
function ReactiveLight({
  scrollState,
}: {
  scrollState: React.MutableRefObject<ScrollState>;
}) {
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  const targetColor = useRef(new THREE.Color('#6633cc'));

  useFrame(() => {
    if (!lightRef.current) return;
    const sIdx = scrollState.current.currentSection;
    targetColor.current.set(SECTIONS[sIdx].color);
    lightRef.current.color.lerp(targetColor.current, 0.02);
  });

  return (
    <directionalLight
      ref={lightRef}
      position={[2, 5, 5]}
      intensity={0.15}
      color='#6633cc'
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   ENVIRONMENT — Assembles atmosphere + camera
   ═══════════════════════════════════════════════════════════════ */
export default function Environment({ scrollState, totalZ }: EnvironmentProps) {
  return (
    <>
      <CameraController scrollState={scrollState} />
      <DynamicFog scrollState={scrollState} />
      <ambientLight intensity={0.3} color='#1a0030' />
      <ReactiveLight scrollState={scrollState} />
      <AmbientParticles totalZ={totalZ} scrollState={scrollState} />
      <LightRays scrollState={scrollState} totalZ={totalZ} />
    </>
  );
}
