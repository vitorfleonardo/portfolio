/* ═══════════════════════════════════════════════════════════════
   TYPES — Single source of truth for the entire app
   ═══════════════════════════════════════════════════════════════ */

/* ── App State Machine ── */
export type AppPhase = 'landing' | 'transition' | 'corridor';

export type Language = 'en' | 'pt' | 'es';

/* ── Section types determine how HoloCards render ── */
export type SectionType =
  | 'experience'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'volunteer';

/* ── Portfolio Data ── */
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  year?: string;
  link?: string;

  /* ── Extended fields (used by specific section types) ── */
  institution?: string;
  institutionLogo?: string;
  role?: string;
  periodStart?: string;
  periodEnd?: string;
  competencies?: string[];
  techStack?: string[];

  /* ── STAR method fields (shown in expanded modal) ── */
  starSituation?: string;
  starTask?: string;
  starAction?: string;
  starResult?: string;
  starMetric?: string;
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  portalColor: string;
  type: SectionType;
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
  language: Language;
}

export interface PortalProps {
  section: Section;
  positionZ: number;
  index: number;
}

export interface ProjectModalProps {
  project: Project | null;
  section: Section | null;
  onClose: () => void;
  language: Language;
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
  fontSize: number;
  onAdjustFont: (delta: number) => void;
}

export interface LandingSceneProps {
  transitionProgress: number;
}
