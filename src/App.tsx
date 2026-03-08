import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AppPhase, Project, Section } from './types';

/* Canvas components */
import Corridor from './components/canvas/Corridor';
import Environment from './components/canvas/Environment';
import HoloCard from './components/canvas/HoloCard';
import LandingScene from './components/canvas/LandingScene';
import Portal from './components/canvas/Portal';

/* DOM components */
import LandingPage from './components/ui/LandingPage';
import ProjectModal from './components/ui/ProjectModal';
import ScrollIndicator from './components/ui/ScrollIndicator';

/* Hooks */
import { useAudio } from './hooks/useAudio';
import { useLanguage } from './hooks/useLanguage';
import { usePortalTransition } from './hooks/usePortalTransition';
import { useScrollProgress } from './hooks/useScrollProgress';

/* Data */
import { CORRIDOR, SECTIONS } from './data/projects';

/* ═══════════════════════════════════════════════════════════════
   CORRIDOR SCENE — Lives inside <Canvas>, renders when phase
   is "transition" (late) or "corridor"
   ═══════════════════════════════════════════════════════════════ */
function CorridorScene({
  onSelectProject,
}: {
  onSelectProject: (project: Project, section: Section) => void;
}) {
  const {
    scrollState,
    currentSection,
    hasScrolled,
    scrollTo,
    setLocked,
    totalZ,
  } = useScrollProgress();

  /* Compute layout once */
  const layout = useMemo(() => {
    const portals: { section: Section; z: number; index: number }[] = [];
    const cards: {
      project: Project;
      section: Section;
      position: [number, number, number];
      rotation: [number, number, number];
      index: number;
    }[] = [];

    let z = -CORRIDOR.ENTRY_BUFFER;
    let globalCardIdx = 0;

    SECTIONS.forEach((section, sIdx) => {
      if (sIdx > 0) {
        portals.push({ section, z: z + 2, index: sIdx });
        z -= 4;
      }
      section.projects.forEach((project, pIdx) => {
        z -= CORRIDOR.CARD_Z_SPACING;
        const side = pIdx % 2 === 0 ? -1 : 1;
        cards.push({
          project,
          section,
          position: [side * CORRIDOR.CARD_X_OFFSET, CORRIDOR.CARD_Y_BASE, z],
          rotation: [0, side * -0.35, 0],
          index: globalCardIdx++,
        });
      });
      z -= 8;
    });

    return { portals, cards };
  }, []);

  const portalZs = useMemo(
    () => layout.portals.map((p) => p.z),
    [layout.portals],
  );
  usePortalTransition(scrollState, portalZs);

  /* Bridge to DOM (simple approach — in production use Zustand) */
  (window as any).__corridorScroll = {
    scrollTo,
    setLocked,
    currentSection,
    hasScrolled,
    scrollState,
    totalZ,
  };

  return (
    <>
      <Environment scrollState={scrollState} totalZ={totalZ} />
      <Corridor scrollState={scrollState} />
      {layout.portals.map((p) => (
        <Portal
          key={p.section.id}
          section={p.section}
          positionZ={p.z}
          index={p.index}
          scrollState={scrollState}
        />
      ))}
      {layout.cards.map((card) => (
        <HoloCard
          key={card.project.id}
          project={card.project}
          section={card.section}
          position={card.position}
          rotation={card.rotation}
          index={card.index}
          onSelect={onSelectProject}
          scrollState={scrollState}
        />
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP — Root orchestrator with phase state machine
   
   Phases:
     "landing"    → LandingScene (3D) + LandingPage (DOM)
     "transition" → Portal zoom animation (2.5s)
     "corridor"   → Corridor (3D) + HUD (DOM)
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [phase, setPhase] = useState<AppPhase>('landing');
  const [transitionProgress, setTransitionProgress] = useState(0);
  const transitionRef = useRef<number>(0);
  const [canvasReady, setCanvasReady] = useState(false);

  const [selectedProject, setSelectedProject] = useState<{
    project: Project;
    section: Section;
  } | null>(null);

  /* Hooks */
  const { language, setLanguage } = useLanguage();
  const {
    startAudio,
    toggleAudio,
    isEnabled: audioEnabled,
    setIsEnabled,
  } = useAudio();

  /* Font scale (0.8 – 1.3) */
  const [fontSize, setFontSize] = useState(1);
  const adjustFont = useCallback((delta: number) => {
    setFontSize((prev) =>
      Math.max(0.8, Math.min(1.3, +(prev + delta).toFixed(2))),
    );
  }, []);

  /* ── Transition animation (landing → corridor) ── */
  const startTransition = useCallback(() => {
    if (phase !== 'landing') return;

    setPhase('transition');

    // Start audio if enabled
    if (audioEnabled) {
      startAudio();
    }

    // Animate transitionProgress from 0 → 1 over 2.8 seconds
    const duration = 2800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-in-out cubic for smooth acceleration
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setTransitionProgress(eased);

      if (progress < 1) {
        transitionRef.current = requestAnimationFrame(animate);
      } else {
        // Transition complete → enter corridor
        setPhase('corridor');
        setTransitionProgress(0);
      }
    };

    transitionRef.current = requestAnimationFrame(animate);
  }, [phase, audioEnabled, startAudio]);

  /* Cleanup transition on unmount */
  useEffect(() => {
    return () => {
      if (transitionRef.current) cancelAnimationFrame(transitionRef.current);
    };
  }, []);

  /* ── Project modal handlers ── */
  const handleSelectProject = useCallback(
    (project: Project, section: Section) => {
      setSelectedProject({ project, section });
      (window as any).__corridorScroll?.setLocked(true);
    },
    [],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
    (window as any).__corridorScroll?.setLocked(false);
  }, []);

  const handleNavigate = useCallback((sectionIndex: number) => {
    const scroll = (window as any).__corridorScroll;
    if (!scroll) return;
    const target = sectionIndex / SECTIONS.length + 0.01;
    scroll.scrollTo(target);
  }, []);

  /* Audio toggle on landing */
  const handleToggleAudio = useCallback(() => {
    setIsEnabled((prev: boolean) => !prev);
  }, [setIsEnabled]);

  /* Read corridor scroll state for HUD */
  const scrollProxy = (window as any).__corridorScroll;
  const currentSection = scrollProxy?.currentSection ?? 0;
  const hasScrolled = scrollProxy?.hasScrolled ?? false;
  const progress = scrollProxy?.scrollState?.current?.progress ?? 0;

  const isLanding = phase === 'landing' || phase === 'transition';
  const isCorridor = phase === 'corridor';
  const isTransitioning = phase === 'transition';

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#040810',
        position: 'relative',
      }}
    >
      {/* ─── SINGLE CANVAS (always mounted) ─── */}
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 300,
          position: [0, 0, 8],
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: 5,
          toneMappingExposure: 1.2,
        }}
        onCreated={() => setCanvasReady(true)}
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Landing scene: visible during landing + transition */}
        {isLanding && <LandingScene transitionProgress={transitionProgress} />}

        {/* Corridor scene: mounts during corridor phase */}
        {isCorridor && <CorridorScene onSelectProject={handleSelectProject} />}
      </Canvas>

      {/* ─── LOADING SCREEN ─── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#040810',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          opacity: canvasReady ? 0 : 1,
          pointerEvents: canvasReady ? 'none' : 'all',
          transition: 'opacity 0.8s ease',
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: 6,
              color: 'rgba(100,160,220,0.4)',
              marginBottom: 24,
            }}
          >
            LOADING
          </div>
          <div
            style={{
              width: 160,
              height: 2,
              background: 'rgba(100,160,220,0.08)',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #4488cc, #44aaff)',
                borderRadius: 1,
                animation: 'loadBar 1.8s ease infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── LANDING PAGE (DOM overlay) ─── */}
      {isLanding && canvasReady && (
        <LandingPage
          language={language}
          onChangeLanguage={setLanguage}
          onStart={startTransition}
          isTransitioning={isTransitioning}
          audioEnabled={audioEnabled}
          onToggleAudio={handleToggleAudio}
          fontSize={fontSize}
          onAdjustFont={adjustFont}
        />
      )}

      {/* ─── CORRIDOR HUD ─── */}
      {isCorridor && (
        <>
          <ScrollIndicator
            currentSection={currentSection}
            progress={progress}
            hasScrolled={hasScrolled}
            isVisible={true}
            onNavigate={handleNavigate}
          />

          {/* Audio toggle in corridor (bottom-right) */}
          <button
            onClick={toggleAudio}
            style={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 25,
              width: 32,
              height: 32,
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <svg
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              stroke='rgba(255,255,255,0.35)'
              strokeWidth='1.5'
            >
              {audioEnabled ? (
                <>
                  <path d='M11 5L6 9H2v6h4l5 4V5z' />
                  <path d='M15.54 8.46a5 5 0 010 7.07' />
                </>
              ) : (
                <>
                  <path d='M11 5L6 9H2v6h4l5 4V5z' />
                  <line x1='23' y1='9' x2='17' y2='15' />
                  <line x1='17' y1='9' x2='23' y2='15' />
                </>
              )}
            </svg>
          </button>
        </>
      )}

      {/* ─── PROJECT MODAL ─── */}
      <ProjectModal
        project={selectedProject?.project || null}
        section={selectedProject?.section || null}
        onClose={handleCloseModal}
      />

      {/* ─── GLOBAL STYLES ─── */}
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow: hidden; background: #040810; }
        
        @keyframes loadBar {
          0% { width: 0; transform: translateX(0); }
          50% { width: 100%; }
          100% { width: 0; transform: translateX(160px); }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { transform: translateY(30px) scale(0.96); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes scrollDot {
          0% { top: 6px; opacity: 1; }
          100% { top: 20px; opacity: 0; }
        }
        @keyframes hintFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(15px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes labelFadeIn {
          from { opacity: 0; transform: translateX(5px) translateY(-50%); }
          to { opacity: 1; transform: translateX(0) translateY(-50%); }
        }
      `}</style>
    </div>
  );
}
