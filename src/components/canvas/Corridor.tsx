import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CORRIDOR, SECTIONS } from '../../data/projects';
import { createShapePoints, getBiomeTheme } from '../../data/themes';
import type { ScrollState } from '../../types/index';

interface CorridorProps {
  scrollState: React.RefObject<ScrollState>;
}

/* ═══════════════════════════════════════════════════════════════
   Ring data — each ring gets its biome's shape + color
   ═══════════════════════════════════════════════════════════════ */
interface RingData {
  z: number;
  size: number;
  color: THREE.Color;
  inverted: boolean;
  sectionIdx: number;
}

function computeSectionForZ(z: number): number {
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
  return sIdx;
}

function buildRingData(totalZ: number): RingData[] {
  const rings: RingData[] = [];
  const spacing = totalZ / CORRIDOR.RING_COUNT;

  for (let i = 0; i < CORRIDOR.RING_COUNT; i++) {
    const z = -i * spacing;
    const sIdx = computeSectionForZ(z);

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
   Single Ring — uses biome-specific shape geometry
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

  const section = SECTIONS[data.sectionIdx];
  const theme = useMemo(() => getBiomeTheme(section.type), [section.type]);

  const geometry = useMemo(() => {
    const pts = createShapePoints(theme.ringShape, data.size);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [data.size, theme.ringShape]);

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const camZ = scrollState.current.cameraZ;
    const dist = Math.abs(data.z - camZ);

    // Fade by distance
    matRef.current.opacity = Math.max(0, 0.5 - dist * 0.006);

    // Rotation: speed varies by biome
    const speed = 0.0015 * theme.rotationSpeed;
    ref.current.rotation.z += data.inverted ? -speed : speed;

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
   Floor / Ceiling grids — color tinted per biome
   ═══════════════════════════════════════════════════════════════ */
function Grid({
  y,
  totalZ,
  scrollState,
}: {
  y: number;
  totalZ: number;
  scrollState: React.RefObject<ScrollState>;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const targetColor = useRef(new THREE.Color('#1a0040'));

  useFrame(() => {
    if (!matRef.current) return;
    const sIdx = scrollState.current.currentSection;
    const theme = getBiomeTheme(SECTIONS[sIdx].type);
    // Lerp grid color toward current biome
    targetColor.current.set(theme.gridColor);
    matRef.current.color.lerp(targetColor.current, 0.03);
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
   ACCENT DECORATIONS — small orbiting shapes between cards
   These add visual richness unique to each biome
   ═══════════════════════════════════════════════════════════════ */
function BiomeAccents({
  scrollState,
}: {
  scrollState: React.RefObject<ScrollState>;
  totalZ: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  // Pre-compute accent positions
  const accents = useMemo(() => {
    const result: { z: number; x: number; sIdx: number }[] = [];
    let z = -CORRIDOR.ENTRY_BUFFER - 4;

    SECTIONS.forEach((section, sIdx) => {
      const theme = getBiomeTheme(section.type);
      for (let a = 0; a < theme.accentRingCount; a++) {
        z -= 15 + Math.random() * 10;
        result.push({
          z,
          x: (Math.random() - 0.5) * 6,
          sIdx,
        });
      }
      z -= section.projects.length * CORRIDOR.CARD_Z_SPACING;
    });

    return result;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const camZ = scrollState.current.cameraZ;

    groupRef.current.children.forEach((child, i) => {
      const accent = accents[i];
      if (!accent) return;
      const dist = Math.abs(accent.z - camZ);

      // Visibility
      const opacity = dist < 20 ? Math.max(0, 0.4 - dist * 0.02) : 0;
      const mat = (child as THREE.LineLoop).material as THREE.LineBasicMaterial;
      mat.opacity = opacity;

      // Slow orbit
      child.rotation.z = t * 0.3 + i;
      child.rotation.x = Math.sin(t * 0.2 + i) * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {accents.map((accent, i) => {
        const section = SECTIONS[accent.sIdx];
        const theme = getBiomeTheme(section.type);
        const pts = createShapePoints(
          theme.ringShape,
          1.2 + Math.random() * 0.8,
        );
        const geo = new THREE.BufferGeometry().setFromPoints(pts);

        return (
          <lineLoop
            key={i}
            geometry={geo}
            position={[accent.x, 0.4 + Math.random() * 2, accent.z]}
          >
            <lineBasicMaterial
              color={section.color}
              transparent
              opacity={0.3}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </lineLoop>
        );
      })}
    </group>
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
      {/* Structural rings (biome-shaped) */}
      {rings.map((r, i) => (
        <Ring key={i} data={r} scrollState={scrollState} index={i} />
      ))}

      {/* Floor & Ceiling (color-reactive) */}
      <Grid y={-2.8} totalZ={totalZ} scrollState={scrollState} />
      <Grid y={4.0} totalZ={totalZ} scrollState={scrollState} />

      {/* Biome accent decorations */}
      <BiomeAccents scrollState={scrollState} totalZ={totalZ} />

      {/* Center guide line */}
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
