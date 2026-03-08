import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { HoloCardProps, ScrollState } from '../../types/index';

interface HoloCardInternalProps extends HoloCardProps {
  scrollState: React.RefObject<ScrollState>;
}

/* ═══════════════════════════════════════════════════════════════
   HOLO CARD — A single holographic project display
   
   Visual layers:
   1. Translucent backing plane with section-colored tint
   2. Wireframe border that brightens on proximity
   3. Animated scan line sweeping vertically
   4. Floating particles around the card
   5. Small diamond/icon geometry as hologram accent
   6. Clickable hit area → triggers onSelect
   ═══════════════════════════════════════════════════════════════ */
export default function HoloCard({
  project,
  section,
  position,
  rotation = [0, 0, 0],
  index,
  onSelect,
  scrollState,
}: HoloCardInternalProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const fillRef = useRef<THREE.MeshBasicMaterial>(null!);
  const borderRef = useRef<THREE.LineBasicMaterial>(null!);
  const scanRef = useRef<THREE.Mesh>(null!);
  const iconRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null!);

  const [hovered, setHovered] = useState(false);
  const { gl } = useThree();

  const color = useMemo(() => new THREE.Color(section.color), [section.color]);

  /* Card dimensions */
  const CARD_W = 3.2;
  const CARD_H = 2.2;

  /* Border edge geometry */
  const borderGeo = useMemo(() => {
    const hw = CARD_W / 2;
    const hh = CARD_H / 2;
    // Beveled corners
    const b = 0.15;
    const pts = [
      new THREE.Vector3(-hw + b, hh, 0),
      new THREE.Vector3(hw - b, hh, 0),
      new THREE.Vector3(hw, hh - b, 0),
      new THREE.Vector3(hw, -hh + b, 0),
      new THREE.Vector3(hw - b, -hh, 0),
      new THREE.Vector3(-hw + b, -hh, 0),
      new THREE.Vector3(-hw, -hh + b, 0),
      new THREE.Vector3(-hw, hh - b, 0),
      new THREE.Vector3(-hw + b, hh, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  /* Small holographic icon (diamond/octahedron) */
  const iconGeo = useMemo(() => new THREE.OctahedronGeometry(0.18, 0), []);

  /* Particle cloud around the card */
  const particleGeo = useMemo(() => {
    const count = 20;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * CARD_W * 1.4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * CARD_H * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  /* Decorative horizontal lines (data readout feel) */
  const dataLines = useMemo(() => {
    const lines: { y: number; w: number }[] = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      lines.push({
        y: -CARD_H * 0.15 + i * 0.22,
        w: 0.4 + Math.random() * 1.6,
      });
    }
    return lines;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const camZ = scrollState.current.cameraZ;
    const cardZ = position[2];
    const dist = Math.abs(cardZ - camZ);

    /* Visibility fade */
    const visible = dist < 25;
    const opacity = visible ? Math.max(0, 1 - dist / 22) : 0;
    const hoverBoost = hovered ? 1.4 : 1;

    groupRef.current.visible = visible;
    if (!visible) return;

    /* Fill */
    if (fillRef.current) {
      fillRef.current.opacity = opacity * 0.08 * hoverBoost;
    }

    /* Border */
    if (borderRef.current) {
      borderRef.current.opacity = opacity * 0.6 * hoverBoost;
    }

    /* Glow plane behind card (hover feedback) */
    if (glowRef.current) {
      glowRef.current.opacity = hovered ? opacity * 0.06 : 0;
    }

    /* Floating bob */
    groupRef.current.position.y =
      position[1] + Math.sin(t * 1.2 + index * 1.7) * 0.15;

    /* Scan line sweep */
    if (scanRef.current) {
      const scanY = (((t * 0.8 + index) % 2) - 1) * CARD_H * 0.45;
      scanRef.current.position.y = scanY;
      (scanRef.current.material as THREE.MeshBasicMaterial).opacity =
        opacity * 0.45;
    }

    /* Icon spin */
    if (iconRef.current) {
      iconRef.current.rotation.y = t * 1.5;
      iconRef.current.rotation.x = Math.sin(t * 0.8) * 0.3;
      (iconRef.current.material as THREE.MeshBasicMaterial).opacity =
        opacity * 0.7;
    }

    /* Particle drift */
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] += Math.sin(t * 1.5 + i) * 0.002;
        arr[i] += Math.cos(t * 0.8 + i * 0.5) * 0.001;
      }
      pos.needsUpdate = true;
      (particlesRef.current.material as THREE.PointsMaterial).opacity =
        opacity * 0.45;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    gl.domElement.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    gl.domElement.style.cursor = 'default';
  };

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    onSelect(project, section);
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Hit area (invisible, slightly larger for easy clicking) */}
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <planeGeometry args={[CARD_W + 0.4, CARD_H + 0.4]} />
        <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Glow plane (visible on hover) */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[CARD_W + 1, CARD_H + 0.8]} />
        <meshBasicMaterial
          ref={glowRef}
          color={color}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Translucent fill */}
      <mesh>
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshBasicMaterial
          ref={fillRef}
          color={color}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Beveled border */}
      <line geometry={borderGeo}>
        <lineBasicMaterial
          ref={borderRef}
          color={color}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </line>

      {/* Scan line */}
      <mesh ref={scanRef}>
        <planeGeometry args={[CARD_W - 0.1, 0.02]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Data readout lines (static decoration) */}
      {dataLines.map((line, i) => (
        <mesh
          key={i}
          position={[-(CARD_W / 2) + 0.2 + line.w / 2, line.y, 0.01]}
        >
          <planeGeometry args={[line.w, 0.015]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Holographic icon (top-right of card) */}
      <mesh
        ref={iconRef}
        position={[CARD_W / 2 - 0.35, CARD_H / 2 - 0.35, 0.1]}
      >
        <octahedronGeometry args={[0.18, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          wireframe
          depthWrite={false}
        />
      </mesh>

      {/* Corner accents */}
      {[
        [-CARD_W / 2, CARD_H / 2],
        [CARD_W / 2, CARD_H / 2],
        [-CARD_W / 2, -CARD_H / 2],
        [CARD_W / 2, -CARD_H / 2],
      ].map(([x, y], i) => (
        <mesh key={`corner-${i}`} position={[x, y, 0.01]}>
          <circleGeometry args={[0.04, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Floating particles */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          color={color}
          size={0.035}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
