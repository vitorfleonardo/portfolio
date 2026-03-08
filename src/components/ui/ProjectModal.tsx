import { useEffect, useState } from 'react';
import { t } from '../../data/i18n';
import { getStarQuestions, tp, ts } from '../../data/projectTranslations';
// IMPORTANTE: Adicionamos o tipo 'Language' aqui na importação
import type {
  Language,
  ProjectModalProps,
  SectionType,
} from '../../types/index';

const FONT = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";

const DEEP_DIVE: Record<string, string> = {
  en: 'DEEP DIVE',
  pt: 'APROFUNDAMENTO',
  es: 'ANÁLISIS PROFUNDO',
};
const KEY_RESULT: Record<string, string> = {
  en: 'KEY RESULT',
  pt: 'RESULTADO CHAVE',
  es: 'RESULTADO CLAVE',
};
const INST_LABEL: Record<string, string> = {
  en: 'INSTITUTION / COMPANY',
  pt: 'INSTITUIÇÃO / EMPRESA',
  es: 'INSTITUCIÓN / EMPRESA',
};
const COMPETENCIES_LABEL: Record<string, string> = {
  en: 'COMPETENCIES',
  pt: 'COMPETÊNCIAS',
  es: 'COMPETENCIAS',
};
const STACK_LABEL: Record<string, string> = {
  en: 'TECH STACK',
  pt: 'STACK TECNOLÓGICA',
  es: 'STACK TECNOLÓGICA',
};

function FieldLabel({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        fontSize: 12,
        letterSpacing: 2,
        color,
        marginBottom: 8,
        textTransform: 'uppercase',
        fontWeight: 600,
      }}
    >
      {label}
    </div>
  );
}

function PeriodBadge({
  start,
  end,
  color,
  lang,
}: {
  start?: string;
  end?: string;
  color: string;
  lang: Language; // CORRIGIDO PARA Language
}) {
  if (!start) return null;
  const ongoing: Record<string, string> = {
    en: 'Ongoing',
    pt: 'Em andamento',
    es: 'En curso',
  };
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        letterSpacing: 1,
        color: '#ffffff',
        padding: '6px 16px',
        background: `${color}20`,
        border: `1px solid ${color}40`,
        borderRadius: 4,
        fontWeight: 500,
      }}
    >
      <span>{start}</span>
      <span style={{ opacity: 0.5 }}>→</span>
      <span>{end || ongoing[lang] || ongoing.en}</span>
    </div>
  );
}

function PillRow({
  items,
  color,
  size = 'md',
}: {
  items: string[];
  color: string;
  size?: 'sm' | 'md';
}) {
  const pad = size === 'md' ? '6px 14px' : '4px 10px';
  const fs = size === 'md' ? 13 : 11;
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {items.map((item) => (
        <span
          key={item}
          style={{
            fontSize: fs,
            letterSpacing: 1,
            padding: pad,
            background: `${color}15`,
            border: `1px solid ${color}35`,
            borderRadius: 4,
            color: '#ffffff',
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function InstitutionHeader({
  name,
  logo,
  color,
  lang,
}: {
  name: string;
  logo?: string;
  color: string;
  lang: Language; // CORRIGIDO PARA Language
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
      }}
    >
      {logo && (
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            border: `1px solid ${color}30`,
            background: 'rgba(255,255,255,0.06)',
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={logo}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <div>
        <FieldLabel label={INST_LABEL[lang] || INST_LABEL.en} color={color} />
        <div
          style={{
            fontSize: 28,
            color: '#ffffff',
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}

/* ── STAR Toggle ── */
interface StarItem {
  question: string;
  answer?: string;
}

function StarSection({
  items,
  color,
  lang,
}: {
  items: StarItem[];
  color: string;
  lang: Language; // CORRIGIDO PARA Language
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const filteredItems = items.filter((item) => item.answer);
  if (filteredItems.length === 0) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <FieldLabel label={DEEP_DIVE[lang] || DEEP_DIVE.en} color={color} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filteredItems.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              style={{
                border: `1px solid ${isOpen ? `${color}40` : `${color}20`}`,
                borderRadius: 6,
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
                background: isOpen ? `${color}08` : 'transparent',
              }}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'none',
                  border: 'none',
                  color: isOpen ? '#ffffff' : 'rgba(255,255,255,0.85)',
                  fontSize: 14,
                  fontWeight: isOpen ? 600 : 400,
                  fontFamily: FONT,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'color 0.2s ease',
                  lineHeight: 1.5,
                }}
              >
                <span>{item.question}</span>
                <span
                  style={{
                    fontSize: 12,
                    opacity: 0.6,
                    flexShrink: 0,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  ▼
                </span>
              </button>
              {isOpen && item.answer && (
                <div
                  style={{
                    padding: '0 18px 18px',
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.75,
                    animation: 'starReveal 0.3s ease',
                  }}
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Content Renderers ── */
function EducationContent({
  project,
  color,
  lang,
}: {
  project: any;
  color: string;
  lang: Language; // CORRIGIDO PARA Language
}) {
  const institution = tp(project.id, 'institution', lang, project.institution);
  const title = tp(project.id, 'title', lang, project.title);
  const desc = tp(project.id, 'description', lang, project.description);
  const comps =
    tp(project.id, 'competencies', lang, project.competencies) || [];
  return (
    <>
      {institution && (
        <InstitutionHeader
          name={institution}
          logo={project.institutionLogo}
          color={color}
          lang={lang}
        />
      )}
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          color,
          margin: '0 0 14px',
          lineHeight: 1.3,
        }}
      >
        {project.role || title}
      </h2>
      <PeriodBadge
        start={project.periodStart}
        end={project.periodEnd}
        color={color}
        lang={lang}
      />
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${color}50, transparent)`,
          margin: '22px 0',
        }}
      />
      <p
        style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.9)',
          lineHeight: 1.8,
          margin: '0 0 24px',
        }}
      >
        {desc}
      </p>
      {comps.length > 0 && (
        <>
          <FieldLabel
            label={COMPETENCIES_LABEL[lang] || COMPETENCIES_LABEL.en}
            color={color}
          />
          <PillRow items={comps} color={color} size='md' />
        </>
      )}
    </>
  );
}

function ExperienceContent({
  project,
  color,
  lang,
}: {
  project: any;
  color: string;
  lang: Language; // CORRIGIDO PARA Language
}) {
  const institution = tp(project.id, 'institution', lang, project.institution);
  const role = tp(project.id, 'role', lang, project.role);
  const desc = tp(project.id, 'description', lang, project.description);
  const stack = tp(project.id, 'techStack', lang, project.techStack) || [];
  const metric = tp(project.id, 'starMetric', lang, project.starMetric);
  return (
    <>
      {institution && (
        <InstitutionHeader
          name={institution}
          logo={project.institutionLogo}
          color={color}
          lang={lang}
        />
      )}
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          color,
          margin: '0 0 14px',
          lineHeight: 1.3,
        }}
      >
        {role || project.title}
      </h2>
      <PeriodBadge
        start={project.periodStart}
        end={project.periodEnd}
        color={color}
        lang={lang}
      />
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${color}50, transparent)`,
          margin: '22px 0',
        }}
      />
      <p
        style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.9)',
          lineHeight: 1.8,
          margin: '0 0 24px',
        }}
      >
        {desc}
      </p>
      {stack.length > 0 && (
        <>
          <FieldLabel
            label={STACK_LABEL[lang] || STACK_LABEL.en}
            color={color}
          />
          <PillRow items={stack} color={color} size='md' />
        </>
      )}
      {metric && (
        <div
          style={{
            marginTop: 24,
            padding: '16px 20px',
            borderRadius: 6,
            background: `${color}08`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ fontSize: 22, color, opacity: 0.9 }}>◆</div>
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 2,
                fontWeight: 600,
                color,
                marginBottom: 4,
              }}
            >
              {KEY_RESULT[lang] || KEY_RESULT.en}
            </div>
            <div style={{ fontSize: 16, color: '#ffffff', fontWeight: 600 }}>
              {metric}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProjectContent({
  project,
  color,
  lang,
}: {
  project: any;
  color: string;
  lang: Language; // CORRIGIDO PARA Language
}) {
  const title = tp(project.id, 'title', lang, project.title);
  const desc = tp(project.id, 'description', lang, project.description);
  const tags = tp(project.id, 'tags', lang, project.tags) || [];
  const metric = tp(project.id, 'starMetric', lang, project.starMetric);
  return (
    <>
      <h2
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#ffffff',
          margin: '0 0 14px',
          lineHeight: 1.3,
        }}
      >
        {title}
      </h2>
      <PeriodBadge
        start={project.periodStart}
        end={project.periodEnd}
        color={color}
        lang={lang}
      />
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${color}50, transparent)`,
          margin: '22px 0',
        }}
      />
      <p
        style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.9)',
          lineHeight: 1.8,
          margin: '0 0 24px',
        }}
      >
        {desc}
      </p>
      {tags.length > 0 && <PillRow items={tags} color={color} size='md' />}
      {metric && (
        <div
          style={{
            marginTop: 24,
            padding: '16px 20px',
            borderRadius: 6,
            background: `${color}08`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ fontSize: 22, color, opacity: 0.9 }}>◆</div>
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 2,
                fontWeight: 600,
                color,
                marginBottom: 4,
              }}
            >
              {KEY_RESULT[lang] || KEY_RESULT.en}
            </div>
            <div style={{ fontSize: 16, color: '#ffffff', fontWeight: 600 }}>
              {metric}
            </div>
          </div>
        </div>
      )}
      {project.link && (
        <a
          href={project.link}
          target='_blank'
          rel='noopener noreferrer'
          style={{
            display: 'block',
            width: '100%',
            padding: '14px',
            marginTop: 24,
            background: `${color}15`,
            border: `1px solid ${color}40`,
            borderRadius: 6,
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 2,
            textAlign: 'center',
            textDecoration: 'none',
            cursor: 'pointer',
            fontFamily: FONT,
            transition: 'all 0.25s ease',
          }}
        >
          {t('modal.viewProject', lang)}
        </a>
      )}
    </>
  );
}

function CertificationContent({
  project,
  color,
  lang,
}: {
  project: any;
  color: string;
  lang: Language; // CORRIGIDO PARA Language
}) {
  const institution = tp(project.id, 'institution', lang, project.institution);
  const title = tp(project.id, 'title', lang, project.title);
  const desc = tp(project.id, 'description', lang, project.description);
  const comps =
    tp(project.id, 'competencies', lang, project.competencies) || [];
  return (
    <>
      {institution && (
        <InstitutionHeader
          name={institution}
          logo={project.institutionLogo}
          color={color}
          lang={lang}
        />
      )}
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          color,
          margin: '0 0 14px',
          lineHeight: 1.3,
        }}
      >
        {project.role || title}
      </h2>
      <PeriodBadge
        start={project.periodStart}
        end={project.periodEnd}
        color={color}
        lang={lang}
      />
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${color}50, transparent)`,
          margin: '22px 0',
        }}
      />
      <p
        style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.9)',
          lineHeight: 1.8,
          margin: '0 0 24px',
        }}
      >
        {desc}
      </p>
      {comps.length > 0 && (
        <>
          <FieldLabel
            label={COMPETENCIES_LABEL[lang] || COMPETENCIES_LABEL.en}
            color={color}
          />
          <PillRow items={comps} color={color} size='md' />
        </>
      )}
    </>
  );
}

const CONTENT_RENDERERS: Record<
  SectionType,
  (props: { project: any; color: string; lang: Language }) => React.ReactNode // CORRIGIDO AQUI TBM
> = {
  education: EducationContent,
  experience: ExperienceContent,
  volunteer: ExperienceContent,
  projects: ProjectContent,
  certifications: CertificationContent,
};

/* ═══════════════════════════════════════════════════════════════
   MODAL
   ═══════════════════════════════════════════════════════════════ */
export default function ProjectModal({
  project,
  section,
  onClose,
  language,
}: ProjectModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!project || !section) return null;

  const color = section.color;
  const lang = language as Language; // Garante a tipagem ao instanciar
  const sectionType = section.type;
  const ContentRenderer = CONTENT_RENDERERS[sectionType] || ProjectContent;
  const showHeroImage = sectionType === 'projects';

  const sectionTitle = ts(section.id, lang).title;
  const starQuestions = getStarQuestions(lang);

  const starItems: StarItem[] = [
    {
      question: starQuestions[0],
      answer:
        tp(project.id, 'starSituation', lang, project.starSituation) ||
        undefined,
    },
    {
      question: starQuestions[1],
      answer: tp(project.id, 'starTask', lang, project.starTask) || undefined,
    },
    {
      question: starQuestions[2],
      answer:
        tp(project.id, 'starAction', lang, project.starAction) || undefined,
    },
    {
      question: starQuestions[3],
      answer:
        tp(project.id, 'starResult', lang, project.starResult) || undefined,
    },
  ];

  const hasStarContent = starItems.some((item) => item.answer);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'modalFadeIn 0.35s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 0, 12, 0.88)',
          backdropFilter: 'blur(16px)',
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: 680,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          background:
            'linear-gradient(145deg, rgba(18,8,36,0.97), rgba(8,4,18,0.99))',
          border: `1px solid ${color}55`,
          borderRadius: 12,
          overflow: 'hidden',
          animation: 'modalSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            boxShadow: `0 0 20px ${color}80`,
          }}
        />
        {showHeroImage && project.image && (
          <div
            style={{
              height: 220,
              background: `linear-gradient(180deg, transparent 40%, rgba(4,0,12,0.95)), url(${project.image}) center/cover`,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${color}18, transparent)`,
              }}
            />
          </div>
        )}
        <div
          style={{
            padding: showHeroImage ? '20px 32px 0' : '28px 32px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 3,
              color,
              textTransform: 'uppercase',
            }}
          >
            {sectionTitle}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: `1px solid ${color}40`,
              background: 'rgba(255,255,255,0.05)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: '20px 32px 12px' }}>
          <ContentRenderer project={project} color={color} lang={lang} />
        </div>
        {hasStarContent && (
          <div style={{ padding: '0 32px 32px' }}>
            <StarSection items={starItems} color={color} lang={lang} />
          </div>
        )}
        {!hasStarContent && <div style={{ height: 24 }} />}
      </div>
      <style>{`@keyframes starReveal { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
