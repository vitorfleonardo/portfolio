import * as THREE from 'three';
import type { SectionType } from '../types';

/* ═══════════════════════════════════════════════════════════════
   BIOME THEME ENGINE
   
   Each section gets a unique visual identity:
   - Ring shape (triangle, hexagon, circle, diamond, pentagon)
   - Color palette (primary, fog tint, particle color)
   - Fog density
   - Grid color
   - Portal geometry style
   ═══════════════════════════════════════════════════════════════ */

export type RingShape =
  | 'triangle'
  | 'hexagon'
  | 'circle'
  | 'diamond'
  | 'pentagon';

export interface BiomeTheme {
  ringShape: RingShape;
  fogDensity: number;
  fogColor: THREE.Color;
  gridColor: string;
  particleColor: string;
  /** Extra accent rings between cards (concentric / orbiting) */
  accentRingCount: number;
  /** Portal: how many concentric layers the gate has */
  portalLayers: number;
  /** Speed multiplier for ring rotation in this biome */
  rotationSpeed: number;
}

/**
 * Create the vertices for a given ring shape.
 * Returns a closed loop of Vector3 (last point === first).
 */
export function createShapePoints(
  shape: RingShape,
  size: number,
): THREE.Vector3[] {
  switch (shape) {
    case 'triangle': {
      const h = size * Math.sin(Math.PI / 3);
      return [
        new THREE.Vector3(0, h * 0.66, 0),
        new THREE.Vector3(-size / 2, -h * 0.33, 0),
        new THREE.Vector3(size / 2, -h * 0.33, 0),
        new THREE.Vector3(0, h * 0.66, 0),
      ];
    }
    case 'hexagon': {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        pts.push(
          new THREE.Vector3(
            Math.cos(a) * size * 0.55,
            Math.sin(a) * size * 0.55,
            0,
          ),
        );
      }
      return pts;
    }
    case 'circle': {
      const pts: THREE.Vector3[] = [];
      const segs = 32;
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        pts.push(
          new THREE.Vector3(
            Math.cos(a) * size * 0.5,
            Math.sin(a) * size * 0.5,
            0,
          ),
        );
      }
      return pts;
    }
    case 'diamond': {
      const r = size * 0.5;
      return [
        new THREE.Vector3(0, r, 0),
        new THREE.Vector3(r * 0.7, 0, 0),
        new THREE.Vector3(0, -r, 0),
        new THREE.Vector3(-r * 0.7, 0, 0),
        new THREE.Vector3(0, r, 0),
      ];
    }
    case 'pentagon': {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        pts.push(
          new THREE.Vector3(
            Math.cos(a) * size * 0.52,
            Math.sin(a) * size * 0.52,
            0,
          ),
        );
      }
      return pts;
    }
  }
}

/** Section type → biome theme mapping */
const BIOME_MAP: Record<SectionType, BiomeTheme> = {
  experience: {
    ringShape: 'hexagon',
    fogDensity: 0.018,
    fogColor: new THREE.Color(0x001520),
    gridColor: '#003355',
    particleColor: '#0088cc',
    accentRingCount: 2,
    portalLayers: 5,
    rotationSpeed: 1.0,
  },
  education: {
    ringShape: 'triangle',
    fogDensity: 0.022,
    fogColor: new THREE.Color(0x0a0020),
    gridColor: '#1a0040',
    particleColor: '#8844cc',
    accentRingCount: 1,
    portalLayers: 4,
    rotationSpeed: 0.8,
  },
  volunteer: {
    ringShape: 'circle',
    fogDensity: 0.016,
    fogColor: new THREE.Color(0x001510),
    gridColor: '#003322',
    particleColor: '#22aa66',
    accentRingCount: 3,
    portalLayers: 6,
    rotationSpeed: 1.2,
  },
  projects: {
    ringShape: 'diamond',
    fogDensity: 0.02,
    fogColor: new THREE.Color(0x150008),
    gridColor: '#330011',
    particleColor: '#cc2244',
    accentRingCount: 2,
    portalLayers: 5,
    rotationSpeed: 1.5,
  },
  certifications: {
    ringShape: 'pentagon',
    fogDensity: 0.019,
    fogColor: new THREE.Color(0x151000),
    gridColor: '#332200',
    particleColor: '#ccaa00',
    accentRingCount: 2,
    portalLayers: 4,
    rotationSpeed: 0.9,
  },
};

/** Get the biome theme for a section by its type */
export function getBiomeTheme(sectionType: SectionType): BiomeTheme {
  return BIOME_MAP[sectionType];
}

/**
 * Smoothly interpolate between two biome themes.
 * `t` is 0..1 (0 = themeA, 1 = themeB).
 * Returns fog density and fog color for the current frame.
 */
export function lerpBiomes(
  themeA: BiomeTheme,
  themeB: BiomeTheme,
  t: number,
): { fogDensity: number; fogColor: THREE.Color } {
  const clamped = Math.max(0, Math.min(1, t));
  return {
    fogDensity:
      themeA.fogDensity + (themeB.fogDensity - themeA.fogDensity) * clamped,
    fogColor: themeA.fogColor.clone().lerp(themeB.fogColor, clamped),
  };
}
