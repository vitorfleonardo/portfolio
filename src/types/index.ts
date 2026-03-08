/* ═══════════════════════════════════════════════════════════════
   TYPES — Single source of truth for the entire app
   ═══════════════════════════════════════════════════════════════ */

/* ── App State Machine ── */
export type AppPhase = 'landing' | 'transition' | 'corridor';

export type Language = 'en' | 'pt' | 'es';

/* ── Portfolio Data ── */
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  year?: string;
  link?: string;
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  portalColor: string;
  projects: Project[];
}

/* ── Scroll State (shared between Canvas & DOM) ── */
export interface ScrollState {
  progress: number;
  smoothProgress: number;
  currentSection: number;
  cameraZ: number;
}

/* ── Component Props ── */
export interface HoloCardProps {
  project: Project;
  section: Section;
  position: [number, number, number];
  rotation?: [number, number, number];
  index: number;
  onSelect: (project: Project, section: Section) => void;
}

export interface PortalProps {
  section: Section;
  positionZ: number;
  index: number;
}

export interface ProjectModalProps {
  project: Project | null;
  sectionColor: string;
  onClose: () => void;
}

/* ── Landing Page ── */
export interface SocialLink {
  platform: string;
  url: string;
}

export interface LandingPageProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onStart: () => void;
  isTransitioning: boolean;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  /** Current font scale multiplier (e.g. 0.85, 1, 1.15) */
  fontSize: number;
  /** Adjust font by delta (e.g. +0.1 or -0.1) */
  onAdjustFont: (delta: number) => void;
}

export interface LandingSceneProps {
  /** 0 → 1, drives the portal-open zoom animation */
  transitionProgress: number;
}
