import { Image as DreiImage, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { HoloCardProps, ScrollState } from '../../types/index';

interface HoloCardInternalProps extends HoloCardProps {
  scrollState: React.RefObject<ScrollState>;
}

/* ═══════════════════════════════════════════════════════════════
   ESCUDO ANTI-CRASH PARA IMAGENS WEBGL (Error Boundary)
   ═══════════════════════════════════════════════════════════════ */
class ImageBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('⚠️ Imagem bloqueada (CORS/404) e ocultada.', error.message);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/* ═══════════════════════════════════════════════════════════════
   CONSTANTES GEOMÉTRICAS DO CARTÃO
   ═══════════════════════════════════════════════════════════════ */
const CARD_W = 4.7;
const CARD_H = 3.7;

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
  const darkPlateRef = useRef<THREE.MeshBasicMaterial>(null!);

  // Refs para controle de opacidade e fade-in
  const textInstRef = useRef<any>(null!);
  const textTitleRef = useRef<any>(null!);
  const textPeriodRef = useRef<any>(null!);
  const textDescRef = useRef<any>(null!);
  const textPromptRef = useRef<any>(null!);
  const textTagsRef = useRef<any>(null!);
  const textHintRef = useRef<any>(null!);
  const imageRef = useRef<THREE.Mesh>(null!);
  const separatorRef = useRef<THREE.MeshBasicMaterial>(null!);

  const [hovered, setHovered] = useState(false);
  const { gl } = useThree();

  const color = useMemo(() => new THREE.Color(section.color), [section.color]);

  const isProject = section.type === 'projects';
  const hasLogo = !isProject && Boolean(project.institutionLogo);
  const hasImage = isProject && Boolean(project.image);

  // Prepara as variáveis em Strings limpas
  const displayInst = String(project.institution || section.title || '');
  const displayTitle = String(
    (section.type === 'experience' || section.type === 'volunteer') &&
      project.role
      ? project.role
      : project.title || '',
  );
  const displayDesc = String(project.description || '');

  // Formata o período no padrão terminal: [ Jan 2025 - Ongoing ]
  const rawPeriod = project.periodStart
    ? `${project.periodStart} - ${project.periodEnd || 'Ongoing'}`
    : project.year || '';
  const periodText = rawPeriod ? `[ ${rawPeriod} ]` : '';

  // Formata as tags/competências no padrão: [ Python ]  [ SQL ]
  const pills =
    section.type === 'education' || section.type === 'certifications'
      ? (project.competencies || project.tags || []).slice(0, 6)
      : section.type === 'experience' || section.type === 'volunteer'
        ? (project.techStack || project.tags || []).slice(0, 6)
        : (project.tags || []).slice(0, 6);

  const tagsString =
    pills.length > 0 ? pills.map((p) => `[ ${p} ]`).join('   ') : '';

  const borderGeo = useMemo(() => {
    const hw = CARD_W / 2,
      hh = CARD_H / 2,
      b = 0.15;
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

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const camZ = scrollState.current.cameraZ;
    const dist = Math.abs(position[2] - camZ);

    const visible = dist < 25;
    const opacity = visible ? Math.max(0, 1 - dist / 22) : 0;
    const hoverBoost = hovered ? 1.4 : 1;

    groupRef.current.visible = visible;
    if (!visible) return;

    if (fillRef.current) fillRef.current.opacity = opacity * 0.08 * hoverBoost;
    if (borderRef.current)
      borderRef.current.opacity = opacity * 0.6 * hoverBoost;
    if (glowRef.current) glowRef.current.opacity = hovered ? opacity * 0.06 : 0;
    if (darkPlateRef.current) darkPlateRef.current.opacity = opacity * 0.5;
    if (separatorRef.current) separatorRef.current.opacity = opacity * 0.3;

    if (textInstRef.current) textInstRef.current.fillOpacity = opacity * 0.9;
    if (textTitleRef.current) textTitleRef.current.fillOpacity = opacity;
    if (textPeriodRef.current)
      textPeriodRef.current.fillOpacity = opacity * 0.6;
    if (textPromptRef.current)
      textPromptRef.current.fillOpacity = opacity * 0.9;
    if (textDescRef.current) textDescRef.current.fillOpacity = opacity * 0.85;
    if (textTagsRef.current) textTagsRef.current.fillOpacity = opacity * 0.8;
    if (textHintRef.current) textHintRef.current.fillOpacity = opacity * 0.8;

    if (imageRef.current) {
      const mat = imageRef.current.material as any;
      if (mat && mat.opacity !== undefined) mat.opacity = opacity * 0.95;
    }

    groupRef.current.position.y =
      position[1] + Math.sin(t * 1.2 + index * 1.7) * 0.15;

    if (scanRef.current) {
      scanRef.current.position.y =
        (((t * 0.8 + index) % 2) - 1) * CARD_H * 0.45;
      (scanRef.current.material as THREE.MeshBasicMaterial).opacity =
        opacity * 0.45;
    }
    if (iconRef.current) {
      iconRef.current.rotation.y = t * 1.5;
      iconRef.current.rotation.x = Math.sin(t * 0.8) * 0.3;
      (iconRef.current.material as THREE.MeshBasicMaterial).opacity =
        opacity * 0.7;
    }
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
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <planeGeometry args={[CARD_W + 0.4, CARD_H + 0.4]} />
        <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

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

      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[CARD_W - 0.2, CARD_H - 0.2]} />
        <meshBasicMaterial
          ref={darkPlateRef}
          color='#040810'
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>

      <line geometry={borderGeo}>
        <lineBasicMaterial
          ref={borderRef}
          color={color}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </line>

      <mesh ref={scanRef} position={[0, 0, 0.01]}>
        <planeGeometry args={[CARD_W - 0.1, 0.02]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={iconRef} position={[CARD_W / 2 - 0.4, CARD_H / 2 - 0.4, 0.1]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          wireframe
          depthWrite={false}
        />
      </mesh>

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

      {/* ═══ TERMINAL LAYOUT (NATIVE 3D TEXT) ═══ */}
      <group position={[0, 0, 0.06]} style={{ pointerEvents: 'none' }}>
        {!isProject ? (
          // ── LAYOUT DE TERMINAL (EXPERIÊNCIA, EDUCAÇÃO, ETC) ──
          <>
            {/* LOGO QUADRADA (Esquerda) */}
            {hasLogo ? (
              <ImageBoundary>
                <Suspense fallback={null}>
                  <DreiImage
                    ref={imageRef}
                    url={project.institutionLogo!}
                    position={[-1.5, 1.05, 0]} // Centralizada na coluna da esquerda
                    scale={[0.7, 0.7]}
                    transparent
                  />
                </Suspense>
              </ImageBoundary>
            ) : null}

            {/* EMPRESA / INSTITUIÇÃO */}
            {displayInst && (
              <Text
                ref={textInstRef}
                position={[hasLogo ? -0.9 : -1.9, 1.35, 0]}
                anchorX='left'
                anchorY='top'
                fontSize={0.16}
                color='#ffffff'
                letterSpacing={0.05}
                fontWeight='bold'
              >
                {displayInst.toUpperCase()}
              </Text>
            )}

            {/* CARGO */}
            {displayTitle && (
              <Text
                ref={textTitleRef}
                position={[hasLogo ? -0.9 : -1.9, 1.05, 0]}
                anchorX='left'
                anchorY='top'
                fontSize={0.2}
                color={color}
                fontStyle='italic'
                maxWidth={hasLogo ? 3.0 : 4.0}
              >
                {displayTitle}
              </Text>
            )}

            {/* PERÍODO (Movido para debaixo do cargo, alinhado à esquerda) */}
            {periodText && (
              <Text
                ref={textPeriodRef}
                position={[hasLogo ? -0.9 : -1.9, 0.75, 0]}
                anchorX='left'
                anchorY='top'
                fontSize={0.12}
                color='rgba(255,255,255,0.7)'
                letterSpacing={0.1}
              >
                {periodText}
              </Text>
            )}

            {/* LINHA SEPARADORA */}
            <mesh position={[hasLogo ? 0.5 : 0.0, 0.5, 0]}>
              <planeGeometry args={[hasLogo ? 2.8 : 3.8, 0.015]} />
              <meshBasicMaterial
                ref={separatorRef}
                color={color}
                transparent
                opacity={0.3}
                depthWrite={false}
              />
            </mesh>

            {/* TAGS / PILLS (Coloridas e Responsivas com MaxWidth) */}
            {tagsString && (
              <Text
                ref={textTagsRef}
                position={[-1.9, 0.2, 0]}
                anchorX='left'
                anchorY='top'
                fontSize={0.12}
                color={color}
                letterSpacing={0.05}
                maxWidth={3.8}
                lineHeight={1.6}
              >
                {tagsString}
              </Text>
            )}

            {/* BULLET POINT PROMPT ( > ) + DESCRIÇÃO (Abaixado para dar espaço às Tags se quebrarem linha) */}
            {displayDesc && (
              <group position={[-1.9, -0.25, 0]}>
                <Text
                  ref={textPromptRef}
                  position={[0, 0, 0]}
                  anchorX='left'
                  anchorY='top'
                  fontSize={0.14}
                  color={color}
                  fontWeight='bold'
                >
                  {'>'}
                </Text>
                <Text
                  ref={textDescRef}
                  position={[0.2, 0, 0]}
                  anchorX='left'
                  anchorY='top'
                  fontSize={0.13}
                  color='#e2e8f0'
                  maxWidth={3.6}
                  lineHeight={1.5}
                >
                  {displayDesc}
                </Text>
              </group>
            )}
          </>
        ) : (
          // ── LAYOUT HERO BANNER (PROJETOS) ──
          <Suspense fallback={null}>
            {hasImage ? (
              <ImageBoundary>
                <DreiImage
                  ref={imageRef}
                  url={project.image}
                  position={[0, 0.8, 0]}
                  scale={[4.2, 1.6]}
                  transparent
                />
              </ImageBoundary>
            ) : null}

            {displayTitle && (
              <Text
                ref={textTitleRef}
                position={[-1.9, -0.25, 0]}
                anchorX='left'
                anchorY='top'
                fontSize={0.28}
                color='#ffffff'
                maxWidth={4.0}
                lineHeight={1.1}
              >
                {displayTitle}
              </Text>
            )}

            {periodText && (
              <Text
                ref={textPeriodRef}
                position={[-1.9, -0.65, 0]}
                anchorX='left'
                anchorY='top'
                fontSize={0.11}
                color={color}
                letterSpacing={0.1}
              >
                {periodText}
              </Text>
            )}

            {displayDesc && (
              <group position={[-1.9, -0.9, 0]}>
                <Text
                  ref={textPromptRef}
                  position={[0, 0, 0]}
                  anchorX='left'
                  anchorY='top'
                  fontSize={0.14}
                  color={color}
                  fontWeight='bold'
                >
                  {'>'}
                </Text>
                <Text
                  ref={textDescRef}
                  position={[0.2, 0, 0]}
                  anchorX='left'
                  anchorY='top'
                  fontSize={0.13}
                  color='#e2e8f0'
                  maxWidth={3.7}
                  lineHeight={1.4}
                >
                  {displayDesc}
                </Text>
              </group>
            )}
          </Suspense>
        )}

        {/* CLICK HINT (Rodapé Global) */}
        <Text
          ref={textHintRef}
          position={[2.0, -1.5, 0]}
          anchorX='right'
          anchorY='top'
          fontSize={0.09}
          color={color}
          letterSpacing={0.15}
        >
          ▸ CLICK TO EXPAND
        </Text>
      </group>
    </group>
  );
}
