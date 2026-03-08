import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { createShapePoints, getBiomeTheme } from '../../data/themes';
import type { PortalProps, ScrollState } from '../../types/index';

interface PortalInternalProps extends PortalProps {
  scrollState: React.MutableRefObject<ScrollState>;
}

/* ═══════════════════════════════════════════════════════════════
   CINEMATIC PORTAL — Geometric gate between corridor biomes
   
   Structure:
   - Concentric rings that spin/align as camera approaches
   - Inner energy field (additive blended plane)
   - Particle burst halo
   - Warp-speed line streaks on traversal (dist < 2)
   - Shape matches the NEXT section's biome ring shape
   ═══════════════════════════════════════════════════════════════ */
export default function Portal({
  section,
  positionZ,
  scrollState,
}: PortalInternalProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const ringsRef = useRef<THREE.Group>(null!);
  const fieldRef = useRef<THREE.MeshBasicMaterial>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  const warpRef = useRef<THREE.Group>(null!);

  const theme = useMemo(() => getBiomeTheme(section.type), [section.type]);
  const color = useMemo(
    () => new THREE.Color(section.portalColor),
    [section.portalColor],
  );
  const darkColor = useMemo(
    () => new THREE.Color(section.color),
    [section.color],
  );

  /* Concentric gate rings — use NEXT section's ring shape */
  const ringGeometries = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    const layerCount = theme.portalLayers;
    for (let i = 0; i < layerCount; i++) {
      const scale = 2.5 + i * 0.8;
      const pts = createShapePoints(theme.ringShape, scale);
      geos.push(new THREE.BufferGeometry().setFromPoints(pts));
    }
    return geos;
  }, [theme]);

  /* Energy particle halo */
  const particleGeo = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2 + Math.random() * 2.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.7 + 0.3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  /* Warp-speed streaks (line segments that appear on traversal) */
  const warpGeo = useMemo(() => {
    const count = 24;
    const positions = new Float32Array(count * 6); // 2 vertices per line
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 1 + Math.random() * 3;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r * 0.6 + 0.3;
      // Start point
      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = 0;
      // End point (stretched along Z)
      positions[i * 6 + 3] = x * 0.95;
      positions[i * 6 + 4] = y * 0.95;
      positions[i * 6 + 5] = -3 - Math.random() * 4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const camZ = scrollState.current.cameraZ;
    const dist = Math.abs(positionZ - camZ);
    const proximity = Math.max(0, 1 - dist / 18);
    const veryClose = dist < 4;
    const traversing = dist < 2;

    /* ── Concentric rings animation ── */
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        const mat = (ring as THREE.LineLoop)
          .material as THREE.LineBasicMaterial;

        // Base opacity
        mat.opacity = proximity * (0.6 - i * 0.08);

        // Spin: each layer at different speed, accelerate on approach
        const speedBoost = veryClose ? 3 : 1;
        const direction = i % 2 === 0 ? 1 : -1;
        ring.rotation.z += direction * 0.003 * (i + 1) * 0.5 * speedBoost;

        // Scale pulse when very close
        if (veryClose) {
          const pulse = 1 + Math.sin(t * 4 + i * 1.2) * 0.04;
          ring.scale.setScalar(pulse);
        } else {
          ring.scale.setScalar(1);
        }

        // Alignment: rings converge rotation toward 0 as camera is very close
        if (traversing) {
          ring.rotation.z *= 0.95; // snap toward alignment
          mat.opacity = 0.9 - i * 0.1; // bright flash
        }
      });
    }

    /* ── Energy field ── */
    if (fieldRef.current) {
      if (traversing) {
        // Bright flash
        fieldRef.current.opacity = 0.3 + Math.sin(t * 8) * 0.15;
      } else if (veryClose) {
        fieldRef.current.opacity = proximity * 0.15 + Math.sin(t * 3) * 0.04;
      } else {
        fieldRef.current.opacity = proximity * 0.06;
      }
    }

    /* ── Particle halo orbit ── */
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position;
      const arr = pos.array as Float32Array;
      const orbitSpeed = traversing ? 2 : 0.5;
      for (let i = 0; i < arr.length; i += 3) {
        const angle = t * orbitSpeed + i * 0.3;
        arr[i] += Math.sin(angle) * 0.005;
        arr[i + 1] += Math.cos(angle * 0.7) * 0.004;
      }
      pos.needsUpdate = true;
      (particlesRef.current.material as THREE.PointsMaterial).opacity =
        proximity * 0.6;
    }

    /* ── Warp streaks (visible only on traversal) ── */
    if (warpRef.current) {
      const warpOpacity = traversing ? 0.5 + Math.sin(t * 10) * 0.3 : 0;
      warpRef.current.children.forEach((child) => {
        (child as THREE.LineSegments).material.opacity = warpOpacity;
      });
      // Streaks rush toward camera
      if (traversing) {
        warpRef.current.position.z += 0.3;
        if (warpRef.current.position.z > 3) warpRef.current.position.z = -2;
      } else {
        warpRef.current.position.z = 0;
      }
    }

    // Gentle group sway
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.04;
  });

  return (
    <group ref={groupRef} position={[0, 0.4, positionZ]}>
      {/* ── Energy field (translucent center) ── */}
      <mesh>
        <planeGeometry args={[8, 6]} />
        <meshBasicMaterial
          ref={fieldRef}
          color={color}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Concentric gate rings ── */}
      <group ref={ringsRef}>
        {ringGeometries.map((geo, i) => (
          <lineLoop key={i} geometry={geo}>
            <lineBasicMaterial
              color={i % 2 === 0 ? color : darkColor}
              transparent
              opacity={0.5}
              depthWrite={false}
            />
          </lineLoop>
        ))}
      </group>

      {/* ── Particle halo ── */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          color={color}
          size={0.05}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ── Warp-speed streaks ── */}
      <group ref={warpRef}>
        <lineSegments geometry={warpGeo}>
          <lineBasicMaterial
            color={color}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      </group>
    </group>
  );
}
