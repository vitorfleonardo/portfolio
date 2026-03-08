import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CORRIDOR, SECTIONS } from '../../data/projects';
import type { ScrollState } from '../../types/index';

interface CorridorProps {
  scrollState: React.RefObject<ScrollState>;
}

/* ═══════════════════════════════════════════════════════════════
   Triangle ring geometry — built once, instanced per ring
   ═══════════════════════════════════════════════════════════════ */
function createTrianglePoints(size: number): THREE.Vector3[] {
  const h = size * Math.sin(Math.PI / 3);
  return [
    new THREE.Vector3(0, h * 0.66, 0),
    new THREE.Vector3(-size / 2, -h * 0.33, 0),
    new THREE.Vector3(size / 2, -h * 0.33, 0),
    new THREE.Vector3(0, h * 0.66, 0), // close the loop
  ];
}

/* ═══════════════════════════════════════════════════════════════
   Ring data — precomputed positions, colors, rotations
   ═══════════════════════════════════════════════════════════════ */
interface RingData {
  z: number;
  size: number;
  color: THREE.Color;
  inverted: boolean;
  sectionIdx: number;
}

function buildRingData(totalZ: number): RingData[] {
  const rings: RingData[] = [];
  const spacing = totalZ / CORRIDOR.RING_COUNT;

  for (let i = 0; i < CORRIDOR.RING_COUNT; i++) {
    const z = -i * spacing;
    // Determine which section this ring belongs to
    let accZ = -CORRIDOR.ENTRY_BUFFER;
    let sIdx = 0;
    for (let s = 0; s < SECTIONS.length; s++) {
      const sectionSpan =
        SECTIONS[s].projects.length * CORRIDOR.CARD_Z_SPACING + 12;
      if (z < accZ - sectionSpan) {
        sIdx = Math.min(s + 1, SECTIONS.length - 1);
      }
      accZ -= sectionSpan;
    }

    rings.push({
      z,
      size: CORRIDOR.RING_SIZE + Math.sin(i * 0.15) * 0.6,
      color: new THREE.Color(SECTIONS[sIdx].color),
      inverted: i % 2 === 1,
      sectionIdx: sIdx,
    });
  }
  return rings;
}

/* ═══════════════════════════════════════════════════════════════
   Single Ring sub-component (memoised geometry)
   ═══════════════════════════════════════════════════════════════ */
function Ring({
  data,
  scrollState,
  index,
}: {
  data: RingData;
  scrollState: React.RefObject<ScrollState>;
  index: number;
}) {
  const ref = useRef<THREE.LineLoop>(null!);
  const matRef = useRef<THREE.LineBasicMaterial>(null!);

  const geometry = useMemo(() => {
    const pts = createTrianglePoints(data.size);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [data.size]);

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const camZ = scrollState.current.cameraZ;
    const dist = Math.abs(data.z - camZ);

    // Fade by distance
    matRef.current.opacity = Math.max(0, 0.5 - dist * 0.006);

    // Gentle rotation
    ref.current.rotation.z += data.inverted ? -0.0015 : 0.0015;

    // Pulse when close
    if (dist < 10) {
      const pulse = 1 + Math.sin(t * 3 + index * 0.5) * 0.025;
      ref.current.scale.setScalar(pulse);
    }
  });

  return (
    <lineLoop
      ref={ref}
      geometry={geometry}
      position={[0, 0.4, data.z]}
      rotation={[0, 0, data.inverted ? Math.PI : 0]}
    >
      <lineBasicMaterial
        ref={matRef}
        color={data.color}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </lineLoop>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Floor / Ceiling grids
   ═══════════════════════════════════════════════════════════════ */
function Grid({ y, totalZ }: { y: number; totalZ: number }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame(() => {
    if (!matRef.current) return;
    // Subtle opacity pulse
    matRef.current.opacity = 0.12 + Math.sin(Date.now() * 0.001) * 0.02;
  });

  return (
    <mesh position={[0, y, -totalZ / 2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[14, totalZ + 20, 14, Math.floor(totalZ / 2.5)]} />
      <meshBasicMaterial
        ref={matRef}
        color='#1a0040'
        wireframe
        transparent
        opacity={0.12}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CORRIDOR — Main export
   ═══════════════════════════════════════════════════════════════ */
export default function Corridor({ scrollState }: CorridorProps) {
  const totalZ =
    SECTIONS.reduce(
      (sum, s) => sum + s.projects.length * CORRIDOR.CARD_Z_SPACING + 12,
      0,
    ) +
    CORRIDOR.ENTRY_BUFFER * 2;

  const rings = useMemo(() => buildRingData(totalZ), [totalZ]);

  return (
    <group>
      {/* Structural rings */}
      {rings.map((r, i) => (
        <Ring key={i} data={r} scrollState={scrollState} index={i} />
      ))}

      {/* Floor & Ceiling */}
      <Grid y={-2.8} totalZ={totalZ} />
      <Grid y={4.0} totalZ={totalZ} />

      {/* Center guide line — subtle depth cue */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach='attributes-position'
            args={[new Float32Array([0, -2.8, 5, 0, -2.8, -totalZ]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color='#2a0060' transparent opacity={0.15} />
      </line>
    </group>
  );
}
