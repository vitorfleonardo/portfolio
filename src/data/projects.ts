import { assets } from '../assets';
import type { Section } from '../types';

/* ═══════════════════════════════════════════════════════════════
   DATA — Portfolio sections & projects
   ═══════════════════════════════════════════════════════════════ */

export const SECTIONS: Section[] = [
  /* ── 1. PROFESSIONAL EXPERIENCE ── */
  {
    id: 'experience',
    title: 'PROFESSIONAL EXPERIENCE',
    subtitle: 'Career',
    color: '#06b6d4',
    portalColor: '#22d3ee',
    type: 'experience',
    projects: [
      {
        id: 'exp-01',
        title: 'Mindsight',
        description:
          'Building and maintaining data pipelines for HR analytics platform. Designing ETL processes, data modeling, and automated reporting systems for enterprise clients.',
        tags: ['Data Engineering', 'ETL', 'Analytics'],
        image: assets.logoMindsight,
        institution: 'Mindsight',
        institutionLogo: assets.logoMindsight,
        role: 'Data Engineer',
        periodStart: 'Jan 2025',
        periodEnd: 'Ongoing',
        techStack: ['Python', 'SQL', 'dbt', 'Airflow', 'AWS', 'Snowflake'],
        starSituation:
          'Joined an HR-tech startup that needed to scale its data infrastructure from handling dozens of clients to hundreds, with increasingly complex analytics requirements.',
        starTask:
          'Design and implement robust data pipelines that could ingest, transform, and serve data reliably across multiple client tenants.',
        starAction:
          'Architected a multi-tenant ETL pipeline using dbt and Airflow on AWS. Implemented data quality checks, automated alerting, and built self-serve dashboards for the product team.',
        starResult:
          'Reduced data processing time by 40% and eliminated manual reporting tasks. Pipeline now processes data for 100+ enterprise clients daily without intervention.',
        starMetric: '40% reduction in processing time',
      },
    ],
  },

  /* ── 1. EDUCATION ── */
  {
    id: 'education',
    title: 'EDUCATION',
    subtitle: 'Academic Background',
    color: '#a855f7',
    portalColor: '#c084fc',
    type: 'education',
    projects: [
      {
        id: 'edu-01',
        title: 'Software Engineering',
        description:
          'Bachelor degree in Software Engineering with focus on systems architecture, data structures, distributed systems, and software project management.',
        tags: ['Software Engineering', 'Data Engineering'],
        image: assets.logoUnb,
        institution: 'Universidade de Brasília (UnB)',
        institutionLogo: assets.logoUnb,
        periodStart: 'Jun 2022',
        periodEnd: 'Dec 2027',
        competencies: [
          'Software Engineering',
          'Data Engineering',
          'C/C++',
          'Python',
          'Networks',
          'Operating Systems',
          'Databases',
          'Algorithms',
        ],
        starSituation:
          "Chose to pursue Software Engineering at one of Brazil's top public universities to build a strong foundation in computer science and systems thinking.",
        starTask:
          'Complete a rigorous 5-year program covering everything from low-level systems to enterprise architecture while maintaining practical project experience.',
        starAction:
          'Combined coursework with lab research, junior enterprise participation, and personal projects. Focused on data engineering and embedded systems as specializations.',
        starResult:
          'Built a diverse portfolio of projects spanning mobile apps, data pipelines, IoT systems, and web applications. Developed strong fundamentals in algorithms, architecture, and teamwork.',
        starMetric: '15+ projects delivered across 10 semesters',
      },
      {
        id: 'edu-02',
        title: 'Embedded Systems Residency',
        description:
          'Specialized residency program focused on embedded systems development, IoT protocols, microcontrollers, and real-time operating systems.',
        tags: ['Embedded Systems', 'IoT'],
        image: assets.logoUnb,
        institution: 'Universidade de Brasília (UnB)',
        institutionLogo: assets.logoUnb,
        periodStart: 'Mar 2024',
        periodEnd: 'Dec 2025',
        competencies: [
          'ESP32',
          'RTOS',
          'MQTT',
          'Embedded C',
          'PCB Design',
          'Sensor Integration',
        ],
        starSituation:
          'Identified a gap in practical embedded systems skills within the software engineering curriculum.',
        starTask:
          'Complete an intensive residency program while balancing main degree coursework.',
        starAction:
          'Developed hands-on projects with ESP32 microcontrollers, designed PCBs, implemented real-time communication protocols, and built IoT sensor networks.',
        starResult:
          'Gained end-to-end hardware-software integration skills, from PCB design to cloud data ingestion.',
        starMetric: '4 embedded prototypes built from scratch',
      },
    ],
  },

  /* ── 3. VOLUNTEER EXPERIENCE ── */
  {
    id: 'volunteer',
    title: 'VOLUNTEER',
    subtitle: 'Community Impact',
    color: '#10b981',
    portalColor: '#34d399',
    type: 'volunteer',
    projects: [
      {
        id: 'vol-01',
        title: 'EngNet Consultoria',
        description:
          'Junior enterprise focused on engineering consulting. Led technology initiatives and mentored new members.',
        tags: ['Consulting', 'Leadership'],
        image: assets.logoUnb,
        institution: 'EngNet Consultoria',
        institutionLogo: assets.logoUnb,
        role: 'Technology Lead',
        periodStart: 'Mar 2023',
        periodEnd: 'Dec 2023',
        techStack: ['Project Management', 'React', 'Node.js'],
        starSituation:
          'Junior enterprise lacked standardized tech processes, leading to inconsistent project delivery.',
        starTask:
          'Establish tech best practices and lead a team of junior developers through client projects.',
        starAction:
          'Introduced Git workflows, code reviews, and CI/CD pipelines. Mentored 8 new developers and led 3 client-facing consulting projects.',
        starResult:
          'Reduced project delivery time by 30% and improved client satisfaction scores. All mentees became autonomous contributors.',
        starMetric: '8 developers mentored, 3 projects delivered',
      },
    ],
  },

  /* ── 4. PROJECTS ── */
  {
    id: 'projects',
    title: 'PROJECTS',
    subtitle: 'What I Built',
    color: '#f43f5e',
    portalColor: '#fb7185',
    type: 'projects',
    projects: [
      {
        id: 'proj-01',
        title: 'Automated Water Rocket',
        description:
          'Water rocket with automated ESP32 launch base — pressure sensing, servo release, and Bluetooth telemetry.',
        tags: ['ESP32', 'IoT', 'Hardware'],
        image: assets.logoUnb,
        periodStart: 'Jan 2025',
        periodEnd: 'Jun 2025',
        starSituation:
          'Wanted to apply embedded systems skills to a fun, tangible engineering challenge.',
        starTask:
          'Design a fully automated water rocket launch system with telemetry feedback.',
        starAction:
          'Designed the pressure vessel, built a PCB with ESP32, pressure transducer and servo controller. Implemented BLE telemetry for real-time launch data.',
        starResult:
          'Successfully launched 20+ rockets with consistent pressure control and real-time telemetry at 10Hz.',
        starMetric: '20+ successful launches',
      },
    ],
  },

  /* ── 5. COURSES & CERTIFICATIONS ── */
  {
    id: 'certifications',
    title: 'CERTIFICATIONS',
    subtitle: 'Continuous Learning',
    color: '#eab308',
    portalColor: '#facc15',
    type: 'certifications',
    projects: [
      {
        id: 'cert-01',
        title: 'Fundamentals of Statistics',
        description:
          'Comprehensive statistics course covering probability, hypothesis testing, regression, and Bayesian inference.',
        tags: ['Statistics', 'Data Science'],
        image: assets.logoUnb,
        institution: 'USP (Universidade de São Paulo)',
        institutionLogo: assets.logoUnb,
        periodStart: 'Sep 2025',
        periodEnd: 'Jun 2026',
        competencies: [
          'Probability',
          'Hypothesis Testing',
          'Regression',
          'Bayesian Inference',
          'Statistical Modeling',
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   CORRIDOR CONSTANTS
   ═══════════════════════════════════════════════════════════════ */
export const CORRIDOR = {
  TOTAL_LENGTH: 280,
  ENTRY_BUFFER: 8,
  CARD_Y_BASE: 0.2,
  CARD_X_OFFSET: 3.6,
  CARD_Z_SPACING: 9,
  RING_SIZE: 5,
  RING_COUNT: 140,
  SCROLL_SPEED: 0.00035,
  SMOOTH_FACTOR: 0.055,
} as const;

export function getSectionStartZ(sectionIndex: number): number {
  let z = -CORRIDOR.ENTRY_BUFFER;
  for (let i = 0; i < sectionIndex; i++) {
    z -= SECTIONS[i].projects.length * CORRIDOR.CARD_Z_SPACING + 12;
  }
  return z;
}

export const TOTAL_PROJECTS = SECTIONS.reduce(
  (sum, s) => sum + s.projects.length,
  0,
);
