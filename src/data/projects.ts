import type { Section } from '../types';

/* ═══════════════════════════════════════════════════════════════
   DATA — Edit this file to populate your portfolio
   ═══════════════════════════════════════════════════════════════
   Each section maps to a corridor segment.
   Cards are auto-distributed along the walls.
*/

export const SECTIONS: Section[] = [
  {
    id: 'about',
    title: 'ABOUT',
    subtitle: 'Who I Am',
    color: '#a855f7',
    portalColor: '#c084fc',
    projects: [
      {
        id: 'about-01',
        title: 'Creative Developer',
        description:
          "8+ years crafting immersive digital experiences at the intersection of design and engineering. Passionate about pushing the boundaries of what's possible on the web through 3D, shaders, and interaction design.",
        tags: ['React', 'Three.js', 'TypeScript', 'GLSL'],
        image:
          'https://images.unsplash.com/photo-1550439062-609e1531270e?w=400&h=300&fit=crop',
      },
      {
        id: 'about-02',
        title: 'Open Source Contributor',
        description:
          'Active contributor to React Three Fiber ecosystem. Maintainer of several open-source libraries focused on creative coding and procedural generation.',
        tags: ['R3F', 'Drei', 'Open Source'],
        image:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      },
    ],
  },
  {
    id: 'experience',
    title: 'EXPERIENCE',
    subtitle: "Where I've Been",
    color: '#06b6d4',
    portalColor: '#22d3ee',
    projects: [
      {
        id: 'exp-01',
        title: 'Lead Engineer — Nexus Labs',
        description:
          'Leading a team of 12 engineers building real-time 3D collaboration tools. Reduced load times by 60% through custom WebGL pipeline optimization and smart LOD systems.',
        tags: ['WebGL', 'Node.js', 'AWS', 'Team Lead'],
        year: '2023 – Present',
        image:
          'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
      },
      {
        id: 'exp-02',
        title: 'Senior Dev — Void Studio',
        description:
          'Architected the frontend for an award-winning creative agency. Built custom shader pipelines and interactive installations for global brands.',
        tags: ['GLSL', 'React', 'Figma', 'Creative'],
        year: '2020 – 2023',
        image:
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
      },
      {
        id: 'exp-03',
        title: 'Frontend Dev — PixelForge',
        description:
          'Developed responsive web applications and interactive data visualizations for enterprise clients across finance and healthcare sectors.',
        tags: ['D3.js', 'Vue', 'Python', 'Data Viz'],
        year: '2017 – 2020',
        image:
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
      },
      {
        id: 'exp-04',
        title: 'Intern — CodeWave',
        description:
          'First professional role. Built internal tools and learned the fundamentals of production-grade software engineering.',
        tags: ['JavaScript', 'HTML/CSS', 'Git'],
        year: '2016 – 2017',
        image:
          'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop',
      },
    ],
  },
  {
    id: 'projects',
    title: 'PROJECTS',
    subtitle: "What I've Built",
    color: '#f43f5e',
    portalColor: '#fb7185',
    projects: [
      {
        id: 'proj-01',
        title: 'Nebula Dashboard',
        description:
          'Real-time 3D data visualization platform processing 10M+ events/day with WebSocket streaming and GPU-accelerated rendering.',
        tags: ['Three.js', 'WebSocket', 'D3', 'Redis'],
        link: 'https://github.com',
        image:
          'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop',
      },
      {
        id: 'proj-02',
        title: 'Synthwave Generator',
        description:
          'Procedural music visualization engine using Web Audio API and custom GLSL shaders. Featured on Awwwards SOTD.',
        tags: ['GLSL', 'Web Audio', 'Canvas'],
        link: 'https://github.com',
        image:
          'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
      },
      {
        id: 'proj-03',
        title: 'AR Portfolio Viewer',
        description:
          'Mobile AR experience allowing clients to view 3D product renders in their physical space using WebXR.',
        tags: ['WebXR', 'A-Frame', 'Blender'],
        image:
          'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=300&fit=crop',
      },
      {
        id: 'proj-04',
        title: 'CryptoVault UI',
        description:
          'Designed and developed a premium DeFi dashboard with real-time portfolio tracking, animated charts, and multi-chain support.',
        tags: ['React', 'Ethers.js', 'Chart.js'],
        image:
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
      },
      {
        id: 'proj-05',
        title: 'Procedural Terrain Engine',
        description:
          'GPU-driven terrain generation using compute shaders and Marching Cubes. Infinite world with biome blending and erosion simulation.',
        tags: ['WebGPU', 'Compute Shaders', 'Rust'],
        image:
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
      },
    ],
  },
  {
    id: 'contact',
    title: 'CONTACT',
    subtitle: "Let's Connect",
    color: '#10b981',
    portalColor: '#34d399',
    projects: [
      {
        id: 'contact-01',
        title: 'Get In Touch',
        description:
          "Open to freelance projects, creative collaborations, and full-time opportunities. Let's build something extraordinary together.",
        tags: ['Email', 'LinkedIn', 'GitHub'],
        image:
          'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=400&h=300&fit=crop',
      },
      {
        id: 'contact-02',
        title: 'Book a Call',
        description:
          'Schedule a 30-minute intro call to discuss your project, timeline, and how we can work together.',
        tags: ['Calendly', 'Zoom', 'Google Meet'],
        image:
          'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   CORRIDOR CONSTANTS — Tweak these to change the feel
   ═══════════════════════════════════════════════════════════════ */
export const CORRIDOR = {
  /** Total Z-depth of the corridor */
  TOTAL_LENGTH: 280,

  /** Extra padding before first card and after last */
  ENTRY_BUFFER: 8,

  /** Vertical gap between card rows on opposite walls */
  CARD_Y_BASE: 0.2,

  /** How far cards sit from center (X offset) */
  CARD_X_OFFSET: 3.6,

  /** Spacing between cards along Z */
  CARD_Z_SPACING: 9,

  /** Corridor width (triangle size for rings) */
  RING_SIZE: 5,

  /** Number of structural rings */
  RING_COUNT: 140,

  /** Scroll sensitivity (lower = slower) */
  SCROLL_SPEED: 0.00035,

  /** Lerp factor for smooth camera (0-1, lower = smoother) */
  SMOOTH_FACTOR: 0.055,
} as const;

/**
 * Compute the Z-start for a given section index.
 * Sections are sized proportional to their project count.
 */
export function getSectionStartZ(sectionIndex: number): number {
  let z = -CORRIDOR.ENTRY_BUFFER;
  for (let i = 0; i < sectionIndex; i++) {
    z -= SECTIONS[i].projects.length * CORRIDOR.CARD_Z_SPACING + 12; // 12 = portal gap
  }
  return z;
}

/** Total projects across all sections — used for corridor sizing */
export const TOTAL_PROJECTS = SECTIONS.reduce(
  (sum, s) => sum + s.projects.length,
  0,
);
