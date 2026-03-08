import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { PortalProps, ScrollState } from '../../types/index';

interface PortalInternalProps extends PortalProps {
  scrollState: React.MutableRefObject<ScrollState>;
}

/* ═══════════════════════════════════════════════════════════════
   PORTAL — Triangular gateway between corridor sections
   
   Structure:
   - Translucent fill plane (brightens on approach)
   - Glowing triangle edge frame
   - Orbiting energy particles
   - Section title text (via drei Html or geometry)
   ═══════════════════════════════════════════════════════════════ */
export default function Portal({
  section,
  positionZ,
  scrollState,
}: PortalInternalProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const fillMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  const color = useMemo(
    () => new THREE.Color(section.portalColor),
    [section.portalColor],
  );
  const darkColor = useMemo(
    () => new THREE.Color(section.color),
    [section.color],
  );

  /* Triangle frame geometry */
  const edgeGeometry = useMemo(() => {
    const s = 4;
    const h = s * Math.sin(Math.PI / 3);
    const pts = [
      new THREE.Vector3(0, h * 0.7, 0),
      new THREE.Vector3(-s * 0.8, -h * 0.35, 0),
      new THREE.Vector3(s * 0.8, -h * 0.35, 0),
      new THREE.Vector3(0, h * 0.7, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  /* Energy particles orbiting the portal */
  const particleGeo = useMemo(() => {
    const count = 40;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.7 + 0.3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current || !fillMatRef.current || !edgeMatRef.current) return;
    const t = clock.getElapsedTime();
    const camZ = scrollState.current.cameraZ;
    const dist = Math.abs(positionZ - camZ);

    // Fill opacity ramps up as camera approaches
    const proximity = Math.max(0, 1 - dist / 15);
    fillMatRef.current.opacity = proximity * 0.12 + Math.sin(t * 2) * 0.02;

    // Near-pass flash
    if (dist < 3) {
      fillMatRef.current.opacity = 0.25 + Math.sin(t * 5) * 0.1;
    }

    // Edge glow
    edgeMatRef.current.opacity = Math.max(0, 0.8 - dist * 0.03);

    // Slow frame rotation
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.06;

    // Particle orbit
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const angle = t * 0.4 + i * 0.3;
        arr[i] += Math.sin(angle) * 0.003;
        arr[i + 1] += Math.cos(angle * 0.7) * 0.002;
      }
      pos.needsUpdate = true;
      (particlesRef.current.material as THREE.PointsMaterial).opacity =
        proximity * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.4, positionZ]}>
      {/* Fill plane */}
      <mesh>
        <planeGeometry args={[7, 5.5]} />
        <meshBasicMaterial
          ref={fillMatRef}
          color={color}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Triangle edge frame */}
      <lineLoop geometry={edgeGeometry}>
        <lineBasicMaterial
          ref={edgeMatRef}
          color={color}
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </lineLoop>

      {/* Slightly larger outer frame — depth effect */}
      <lineLoop geometry={edgeGeometry} scale={[1.15, 1.15, 1]}>
        <lineBasicMaterial
          color={darkColor}
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </lineLoop>

      {/* Orbiting particles */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          color={color}
          size={0.04}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
