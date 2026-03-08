import type { Language } from '../types';

/* ═══════════════════════════════════════════════════════════════
   i18n — All translatable strings for the portfolio
   ═══════════════════════════════════════════════════════════════ */

const translations: Record<Language, Record<string, string>> = {
  en: {
    /* ── Landing Page ── */
    'landing.greeting': "Hey, I'm",
    'landing.name': 'Vitor Feijó',
    'landing.tagline': 'Data Engineer crafting pipelines that power decisions.',
    'landing.bio':
      'I turn messy, scattered data into reliable systems that teams actually trust. From real-time streaming to warehouse architecture — I build the infrastructure behind the insights.',
    'landing.role': 'DATA ENGINEER',
    'landing.startButton': 'TELL ME MORE',
    'landing.headphones': 'Headphones recommended for full experience',
    'landing.stack': 'CORE STACK',
    'landing.built': 'BUILT WITH THREE.JS + REACT',

    /* ── HUD ── */
    'hud.portfolio': 'PORTFOLIO // 2026',
    'hud.depth': 'DEPTH',
    'hud.scrollHint': 'SCROLL TO EXPLORE',

    /* ── Sections ── */
    'section.education': 'EDUCATION',
    'section.education.sub': 'Academic Background',
    'section.experience': 'EXPERIENCE',
    'section.experience.sub': 'Professional Career',
    'section.volunteer': 'VOLUNTEER',
    'section.volunteer.sub': 'Community Impact',
    'section.projects': 'PROJECTS',
    'section.projects.sub': 'What I Built',
    'section.certifications': 'CERTIFICATIONS',
    'section.certifications.sub': 'Continuous Learning',

    /* ── Modal labels ── */
    'modal.viewProject': 'VIEW PROJECT →',
    'modal.close': 'CLOSE',
    'modal.institution': 'INSTITUTION',
    'modal.role': 'ROLE',
    'modal.period': 'PERIOD',
    'modal.stack': 'TECH STACK',
    'modal.competencies': 'COMPETENCIES',
    'modal.ongoing': 'Ongoing',
  },

  pt: {
    'landing.greeting': 'Olá, eu sou',
    'landing.name': 'Vitor Feijó',
    'landing.tagline':
      'Engenheiro de Dados construindo pipelines que impulsionam decisões.',
    'landing.bio':
      'Transformo dados dispersos e caóticos em sistemas confiáveis que as equipes realmente confiam. De streaming em tempo real à arquitetura de data warehouse — eu construo a infraestrutura por trás dos insights.',
    'landing.role': 'ENGENHEIRO DE DADOS',
    'landing.startButton': 'SAIBA MAIS',
    'landing.headphones': 'Recomendado usar fones para a experiência completa',
    'landing.stack': 'STACK PRINCIPAL',
    'landing.built': 'FEITO COM THREE.JS + REACT',

    'hud.portfolio': 'PORTFÓLIO // 2026',
    'hud.depth': 'PROFUNDIDADE',
    'hud.scrollHint': 'SCROLL PARA EXPLORAR',

    'section.education': 'EDUCAÇÃO',
    'section.education.sub': 'Formação Acadêmica',
    'section.experience': 'EXPERIÊNCIA',
    'section.experience.sub': 'Carreira Profissional',
    'section.volunteer': 'VOLUNTARIADO',
    'section.volunteer.sub': 'Impacto Comunitário',
    'section.projects': 'PROJETOS',
    'section.projects.sub': 'O Que Construí',
    'section.certifications': 'CERTIFICAÇÕES',
    'section.certifications.sub': 'Aprendizado Contínuo',

    'modal.viewProject': 'VER PROJETO →',
    'modal.close': 'FECHAR',
    'modal.institution': 'INSTITUIÇÃO',
    'modal.role': 'CARGO',
    'modal.period': 'PERÍODO',
    'modal.stack': 'STACK TECNOLÓGICA',
    'modal.competencies': 'COMPETÊNCIAS',
    'modal.ongoing': 'Em andamento',
  },

  es: {
    'landing.greeting': 'Hola, soy',
    'landing.name': 'Vitor Feijó',
    'landing.tagline':
      'Ingeniero de Datos creando pipelines que impulsan decisiones.',
    'landing.bio':
      'Transformo datos dispersos y caóticos en sistemas confiables en los que los equipos realmente confían. Desde streaming en tiempo real hasta arquitectura de data warehouse — construyo la infraestructura detrás de los insights.',
    'landing.role': 'INGENIERO DE DATOS',
    'landing.startButton': 'CUÉNTAME MÁS',
    'landing.headphones':
      'Se recomiendan auriculares para la experiencia completa',
    'landing.stack': 'STACK PRINCIPAL',
    'landing.built': 'HECHO CON THREE.JS + REACT',

    'hud.portfolio': 'PORTAFOLIO // 2026',
    'hud.depth': 'PROFUNDIDAD',
    'hud.scrollHint': 'SCROLL PARA EXPLORAR',

    'section.education': 'EDUCACIÓN',
    'section.education.sub': 'Formación Académica',
    'section.experience': 'EXPERIENCIA',
    'section.experience.sub': 'Carrera Profesional',
    'section.volunteer': 'VOLUNTARIADO',
    'section.volunteer.sub': 'Impacto Comunitario',
    'section.projects': 'PROYECTOS',
    'section.projects.sub': 'Lo Que Construí',
    'section.certifications': 'CERTIFICACIONES',
    'section.certifications.sub': 'Aprendizaje Continuo',

    'modal.viewProject': 'VER PROYECTO →',
    'modal.close': 'CERRAR',
    'modal.institution': 'INSTITUCIÓN',
    'modal.role': 'CARGO',
    'modal.period': 'PERÍODO',
    'modal.stack': 'STACK TECNOLÓGICA',
    'modal.competencies': 'COMPETENCIAS',
    'modal.ongoing': 'En curso',
  },
};

export function t(key: string, lang: Language): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'pt', label: 'Português', flag: 'PT' },
  { code: 'es', label: 'Español', flag: 'ES' },
];

export const TECH_STACK = [
  { name: 'Python', color: '#3776ab' },
  { name: 'SQL', color: '#e48e00' },
  { name: 'Apache Spark', color: '#e25a1c' },
  { name: 'Airflow', color: '#017cee' },
  { name: 'dbt', color: '#ff694b' },
  { name: 'AWS', color: '#ff9900' },
  { name: 'Kafka', color: '#231f20' },
  { name: 'Docker', color: '#2496ed' },
];

export const ACCENT = '#4d9fff';
export const ACCENT_DIM = 'rgba(77,159,255,';

export const SOCIAL_LINKS = [
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/vitorfleonardo/',
    svgPath:
      'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    platform: 'YouTube',
    url: 'https://www.youtube.com/channel/UCx_PkhoksDaglJ5rlJ0PTVw',
    svgPath:
      'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    platform: 'GitHub',
    url: 'https://github.com/vitorfleonardo',
    svgPath:
      'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
];
