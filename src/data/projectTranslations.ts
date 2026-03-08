import type { Language } from '../types';

/* ═══════════════════════════════════════════════════════════════
   PROJECT TRANSLATIONS
   
   English is the base language (stored in projects.ts).
   This file contains PT and ES overrides keyed by project ID.
   
   Usage: tp(project, 'description', 'pt') → translated string
   ═══════════════════════════════════════════════════════════════ */

interface ProjectTranslation {
  title?: string;
  description?: string;
  role?: string;
  institution?: string;
  tags?: string[];
  competencies?: string[];
  techStack?: string[];
  starSituation?: string;
  starTask?: string;
  starAction?: string;
  starResult?: string;
  starMetric?: string;
}

type ProjectTranslationMap = Record<string, Record<string, ProjectTranslation>>;

const PROJECT_TRANSLATIONS: Record<'pt' | 'es', ProjectTranslationMap> = {
  pt: {
    'exp-01': {
      default: {
        title: 'Mindsight',
        description:
          'Construção e manutenção de pipelines de dados para plataforma de analytics de RH. Design de processos ETL, modelagem de dados e sistemas de relatórios automatizados para clientes enterprise.',
        role: 'Engenheiro de Dados',
        institution: 'Mindsight',
        techStack: ['Python', 'SQL', 'dbt', 'Airflow', 'AWS', 'Snowflake'],
        starSituation:
          'Entrei em uma startup de HR-tech que precisava escalar sua infraestrutura de dados de dezenas para centenas de clientes, com requisitos analíticos cada vez mais complexos.',
        starTask:
          'Projetar e implementar pipelines de dados robustos que pudessem ingerir, transformar e servir dados de forma confiável em múltiplos tenants de clientes.',
        starAction:
          'Arquitetei um pipeline ETL multi-tenant usando dbt e Airflow na AWS. Implementei verificações de qualidade de dados, alertas automatizados e construí dashboards self-serve para o time de produto.',
        starResult:
          'Reduzi o tempo de processamento de dados em 40% e eliminei tarefas de relatórios manuais. O pipeline agora processa dados de 100+ clientes enterprise diariamente sem intervenção.',
        starMetric: '40% de redução no tempo de processamento',
      },
    },
    'edu-01': {
      default: {
        title: 'Engenharia de Software',
        description:
          'Bacharelado em Engenharia de Software com foco em arquitetura de sistemas, estruturas de dados, sistemas distribuídos e gerenciamento de projetos de software.',
        institution: 'Universidade de Brasília (UnB)',
        competencies: [
          'Engenharia de Software',
          'Engenharia de Dados',
          'C/C++',
          'Python',
          'Redes',
          'Sistemas Operacionais',
          'Bancos de Dados',
          'Algoritmos',
        ],
        starSituation:
          'Escolhi cursar Engenharia de Software em uma das melhores universidades públicas do Brasil para construir uma base sólida em ciência da computação e pensamento sistêmico.',
        starTask:
          'Completar um programa rigoroso de 5 anos cobrindo desde sistemas de baixo nível até arquitetura enterprise, mantendo experiência prática em projetos.',
        starAction:
          'Combinei disciplinas com pesquisa em laboratório, participação em empresa júnior e projetos pessoais. Foquei em engenharia de dados e sistemas embarcados como especializações.',
        starResult:
          'Construí um portfólio diverso de projetos abrangendo apps mobile, pipelines de dados, sistemas IoT e aplicações web. Desenvolvi fundamentos sólidos em algoritmos, arquitetura e trabalho em equipe.',
        starMetric: '15+ projetos entregues em 10 semestres',
      },
    },
    'edu-02': {
      default: {
        title: 'Residência em Sistemas Embarcados',
        description:
          'Programa de residência especializado focado em desenvolvimento de sistemas embarcados, protocolos IoT, microcontroladores e sistemas operacionais de tempo real.',
        institution: 'Universidade de Brasília (UnB)',
        competencies: [
          'ESP32',
          'RTOS',
          'MQTT',
          'C Embarcado',
          'Design de PCB',
          'Integração de Sensores',
        ],
        starSituation:
          'Identifiquei uma lacuna em habilidades práticas de sistemas embarcados dentro do currículo de engenharia de software.',
        starTask:
          'Completar um programa de residência intensivo enquanto equilibrava as disciplinas do curso principal.',
        starAction:
          'Desenvolvi projetos práticos com microcontroladores ESP32, projetei PCBs, implementei protocolos de comunicação em tempo real e construí redes de sensores IoT.',
        starResult:
          'Adquiri habilidades de integração hardware-software de ponta a ponta, desde design de PCB até ingestão de dados na nuvem.',
        starMetric: '4 protótipos embarcados construídos do zero',
      },
    },
    'vol-01': {
      default: {
        title: 'EngNet Consultoria',
        description:
          'Empresa júnior focada em consultoria de engenharia. Liderou iniciativas tecnológicas e mentorou novos membros.',
        role: 'Líder de Tecnologia',
        institution: 'EngNet Consultoria',
        techStack: ['Gestão de Projetos', 'React', 'Node.js'],
        starSituation:
          'A empresa júnior não tinha processos tecnológicos padronizados, levando a entregas de projeto inconsistentes.',
        starTask:
          'Estabelecer melhores práticas de tecnologia e liderar um time de desenvolvedores juniores em projetos para clientes.',
        starAction:
          'Introduzi workflows Git, code reviews e pipelines CI/CD. Mentorei 8 novos desenvolvedores e liderei 3 projetos de consultoria para clientes.',
        starResult:
          'Reduzi o tempo de entrega de projetos em 30% e melhorei os scores de satisfação dos clientes. Todos os mentorados se tornaram contribuidores autônomos.',
        starMetric: '8 desenvolvedores mentorados, 3 projetos entregues',
      },
    },
    'proj-01': {
      default: {
        title: 'Foguete de Água Automatizado',
        description:
          'Foguete de água com base de lançamento automatizada ESP32 — sensor de pressão, liberação por servo e telemetria Bluetooth.',
        tags: ['ESP32', 'IoT', 'Hardware'],
        starSituation:
          'Queria aplicar habilidades de sistemas embarcados a um desafio de engenharia divertido e tangível.',
        starTask:
          'Projetar um sistema de lançamento de foguete de água totalmente automatizado com feedback de telemetria.',
        starAction:
          'Projetei o vaso de pressão, construí uma PCB com ESP32, transdutor de pressão e controlador servo. Implementei telemetria BLE para dados de lançamento em tempo real.',
        starResult:
          'Lancei com sucesso 20+ foguetes com controle de pressão consistente e telemetria em tempo real a 10Hz.',
        starMetric: '20+ lançamentos bem-sucedidos',
      },
    },
    'cert-01': {
      default: {
        title: 'Fundamentos de Estatística',
        description:
          'Curso abrangente de estatística cobrindo probabilidade, testes de hipótese, regressão e inferência bayesiana.',
        institution: 'USP (Universidade de São Paulo)',
        competencies: [
          'Probabilidade',
          'Testes de Hipótese',
          'Regressão',
          'Inferência Bayesiana',
          'Modelagem Estatística',
        ],
      },
    },
  },

  es: {
    'exp-01': {
      default: {
        title: 'Mindsight',
        description:
          'Construcción y mantenimiento de pipelines de datos para plataforma de análisis de RRHH. Diseño de procesos ETL, modelado de datos y sistemas de reportes automatizados para clientes enterprise.',
        role: 'Ingeniero de Datos',
        institution: 'Mindsight',
        techStack: ['Python', 'SQL', 'dbt', 'Airflow', 'AWS', 'Snowflake'],
        starSituation:
          'Me uní a una startup de HR-tech que necesitaba escalar su infraestructura de datos de docenas a cientos de clientes, con requisitos analíticos cada vez más complejos.',
        starTask:
          'Diseñar e implementar pipelines de datos robustos que pudieran ingerir, transformar y servir datos de manera confiable en múltiples tenants de clientes.',
        starAction:
          'Diseñé un pipeline ETL multi-tenant usando dbt y Airflow en AWS. Implementé verificaciones de calidad de datos, alertas automatizadas y construí dashboards self-serve para el equipo de producto.',
        starResult:
          'Reduje el tiempo de procesamiento de datos en un 40% y eliminé tareas de reportes manuales. El pipeline ahora procesa datos de 100+ clientes enterprise diariamente sin intervención.',
        starMetric: '40% de reducción en tiempo de procesamiento',
      },
    },
    'edu-01': {
      default: {
        title: 'Ingeniería de Software',
        description:
          'Licenciatura en Ingeniería de Software con enfoque en arquitectura de sistemas, estructuras de datos, sistemas distribuidos y gestión de proyectos de software.',
        institution: 'Universidade de Brasília (UnB)',
        competencies: [
          'Ingeniería de Software',
          'Ingeniería de Datos',
          'C/C++',
          'Python',
          'Redes',
          'Sistemas Operativos',
          'Bases de Datos',
          'Algoritmos',
        ],
        starSituation:
          'Elegí cursar Ingeniería de Software en una de las mejores universidades públicas de Brasil para construir una base sólida en ciencias de la computación y pensamiento sistémico.',
        starTask:
          'Completar un programa riguroso de 5 años cubriendo desde sistemas de bajo nivel hasta arquitectura enterprise, manteniendo experiencia práctica en proyectos.',
        starAction:
          'Combiné cursos con investigación en laboratorio, participación en empresa junior y proyectos personales. Me enfoqué en ingeniería de datos y sistemas embebidos como especializaciones.',
        starResult:
          'Construí un portafolio diverso de proyectos abarcando apps móviles, pipelines de datos, sistemas IoT y aplicaciones web. Desarrollé fundamentos sólidos en algoritmos, arquitectura y trabajo en equipo.',
        starMetric: '15+ proyectos entregados en 10 semestres',
      },
    },
    'edu-02': {
      default: {
        title: 'Residencia en Sistemas Embebidos',
        description:
          'Programa de residencia especializado enfocado en desarrollo de sistemas embebidos, protocolos IoT, microcontroladores y sistemas operativos en tiempo real.',
        institution: 'Universidade de Brasília (UnB)',
        competencies: [
          'ESP32',
          'RTOS',
          'MQTT',
          'C Embebido',
          'Diseño de PCB',
          'Integración de Sensores',
        ],
        starSituation:
          'Identifiqué una brecha en habilidades prácticas de sistemas embebidos dentro del currículo de ingeniería de software.',
        starTask:
          'Completar un programa de residencia intensivo mientras equilibraba los cursos del grado principal.',
        starAction:
          'Desarrollé proyectos prácticos con microcontroladores ESP32, diseñé PCBs, implementé protocolos de comunicación en tiempo real y construí redes de sensores IoT.',
        starResult:
          'Adquirí habilidades de integración hardware-software de extremo a extremo, desde diseño de PCB hasta ingestión de datos en la nube.',
        starMetric: '4 prototipos embebidos construidos desde cero',
      },
    },
    'vol-01': {
      default: {
        title: 'EngNet Consultoría',
        description:
          'Empresa junior enfocada en consultoría de ingeniería. Lideró iniciativas tecnológicas y mentoreó nuevos miembros.',
        role: 'Líder de Tecnología',
        institution: 'EngNet Consultoría',
        techStack: ['Gestión de Proyectos', 'React', 'Node.js'],
        starSituation:
          'La empresa junior carecía de procesos tecnológicos estandarizados, lo que llevaba a entregas de proyectos inconsistentes.',
        starTask:
          'Establecer mejores prácticas tecnológicas y liderar un equipo de desarrolladores junior en proyectos para clientes.',
        starAction:
          'Introduje workflows Git, code reviews y pipelines CI/CD. Mentoreé a 8 nuevos desarrolladores y lideré 3 proyectos de consultoría para clientes.',
        starResult:
          'Reduje el tiempo de entrega de proyectos en un 30% y mejoré los puntajes de satisfacción de clientes. Todos los mentoreados se convirtieron en contribuidores autónomos.',
        starMetric: '8 desarrolladores mentoreados, 3 proyectos entregados',
      },
    },
    'proj-01': {
      default: {
        title: 'Cohete de Agua Automatizado',
        description:
          'Cohete de agua con base de lanzamiento automatizada ESP32 — sensor de presión, liberación por servo y telemetría Bluetooth.',
        tags: ['ESP32', 'IoT', 'Hardware'],
        starSituation:
          'Quería aplicar habilidades de sistemas embebidos a un desafío de ingeniería divertido y tangible.',
        starTask:
          'Diseñar un sistema de lanzamiento de cohete de agua totalmente automatizado con feedback de telemetría.',
        starAction:
          'Diseñé el recipiente de presión, construí una PCB con ESP32, transductor de presión y controlador servo. Implementé telemetría BLE para datos de lanzamiento en tiempo real.',
        starResult:
          'Lancé con éxito 20+ cohetes con control de presión consistente y telemetría en tiempo real a 10Hz.',
        starMetric: '20+ lanzamientos exitosos',
      },
    },
    'cert-01': {
      default: {
        title: 'Fundamentos de Estadística',
        description:
          'Curso completo de estadística cubriendo probabilidad, pruebas de hipótesis, regresión e inferencia bayesiana.',
        institution: 'USP (Universidade de São Paulo)',
        competencies: [
          'Probabilidad',
          'Pruebas de Hipótesis',
          'Regresión',
          'Inferencia Bayesiana',
          'Modelado Estadístico',
        ],
      },
    },
  },
};

/* ═══════════════════════════════════════════════════════════════
   SECTION TITLE TRANSLATIONS
   ═══════════════════════════════════════════════════════════════ */
const SECTION_TRANSLATIONS: Record<
  string,
  Record<Language, { title: string; subtitle: string }>
> = {
  experience: {
    en: { title: 'PROFESSIONAL EXPERIENCE', subtitle: 'Career' },
    pt: { title: 'EXPERIÊNCIA PROFISSIONAL', subtitle: 'Carreira' },
    es: { title: 'EXPERIENCIA PROFESIONAL', subtitle: 'Carrera' },
  },
  education: {
    en: { title: 'EDUCATION', subtitle: 'Academic Background' },
    pt: { title: 'EDUCAÇÃO', subtitle: 'Formação Acadêmica' },
    es: { title: 'EDUCACIÓN', subtitle: 'Formación Académica' },
  },
  volunteer: {
    en: { title: 'VOLUNTEER', subtitle: 'Community Impact' },
    pt: { title: 'VOLUNTARIADO', subtitle: 'Impacto Comunitário' },
    es: { title: 'VOLUNTARIADO', subtitle: 'Impacto Comunitario' },
  },
  projects: {
    en: { title: 'PROJECTS', subtitle: 'What I Built' },
    pt: { title: 'PROJETOS', subtitle: 'O Que Construí' },
    es: { title: 'PROYECTOS', subtitle: 'Lo Que Construí' },
  },
  certifications: {
    en: { title: 'CERTIFICATIONS', subtitle: 'Continuous Learning' },
    pt: { title: 'CERTIFICAÇÕES', subtitle: 'Aprendizado Contínuo' },
    es: { title: 'CERTIFICACIONES', subtitle: 'Aprendizaje Continuo' },
  },
};

/* ═══════════════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Get a translated project field. Falls back to English (the base in projects.ts).
 */
export function tp<K extends keyof ProjectTranslation>(
  projectId: string,
  field: K,
  language: Language,
  fallback: ProjectTranslation[K],
): NonNullable<ProjectTranslation[K]> {
  if (language === 'en')
    return (fallback ?? '') as NonNullable<ProjectTranslation[K]>;

  const langMap = PROJECT_TRANSLATIONS[language];
  if (!langMap) return (fallback ?? '') as NonNullable<ProjectTranslation[K]>;

  const projectMap = langMap[projectId];
  if (!projectMap?.default)
    return (fallback ?? '') as NonNullable<ProjectTranslation[K]>;

  const translated = projectMap.default[field];
  return (translated ?? fallback ?? '') as NonNullable<ProjectTranslation[K]>;
}

/**
 * Get translated section title & subtitle.
 */
export function ts(
  sectionId: string,
  language: Language,
): { title: string; subtitle: string } {
  return (
    SECTION_TRANSLATIONS[sectionId]?.[language] ??
    SECTION_TRANSLATIONS[sectionId]?.en ?? { title: sectionId, subtitle: '' }
  );
}

/**
 * STAR method question translations
 */
const STAR_QUESTIONS: Record<Language, string[]> = {
  en: [
    'What was the context and scale of this challenge?',
    'What specific task did you take on?',
    'What concrete actions did you plan and execute?',
    'What tangible results did you achieve?',
  ],
  pt: [
    'Qual era o contexto e a escala desse desafio?',
    'Qual tarefa específica você assumiu?',
    'Quais ações concretas você planejou e executou?',
    'Quais resultados tangíveis você obteve?',
  ],
  es: [
    '¿Cuál era el contexto y la escala de este desafío?',
    '¿Qué tarea específica asumiste?',
    '¿Qué acciones concretas planificaste y ejecutaste?',
    '¿Qué resultados tangibles obtuviste?',
  ],
};

export function getStarQuestions(language: Language): string[] {
  return STAR_QUESTIONS[language] ?? STAR_QUESTIONS.en;
}
