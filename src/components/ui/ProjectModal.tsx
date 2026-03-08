import { useEffect, useState } from 'react';
import type { ProjectModalProps, SectionType } from '../../types/index';

/* ═══════════════════════════════════════════════════════════════
   PROJECT MODAL — Expanded with type-specific layouts + STAR toggles
   ═══════════════════════════════════════════════════════════════ */

const FONT = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";

/* ── Reusable sub-components ── */

function FieldLabel({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        fontSize: 12,
        letterSpacing: 2,
        color: `${color}`, // Cor vibrante em vez de opaca
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
}: {
  start?: string;
  end?: string;
  color: string;
}) {
  if (!start) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        letterSpacing: 1,
        color: '#ffffff', // Branco absoluto para melhor contraste
        padding: '6px 16px',
        background: `${color}20`,
        border: `1px solid ${color}40`,
        borderRadius: 4,
        fontWeight: 500,
      }}
    >
      <span>{start}</span>
      <span style={{ opacity: 0.5 }}>→</span>
      <span>{end || 'Ongoing'}</span>
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
            color: '#ffffff', // Textos das tags totalmente brancos
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
}: {
  name: string;
  logo?: string;
  color: string;
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
            width: 80, // Logo em tamanho mais elegante
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
        <FieldLabel label='INSTITUTION / COMPANY' color={color} />
        <div
          style={{
            fontSize: 28, // Ajustado para não competir com o Cargo
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

/* ═══════════════════════════════════════════════════════════════
   STAR TOGGLE SECTION — Collapsible Q&A
   ═══════════════════════════════════════════════════════════════ */

interface StarItem {
  question: string;
  answer?: string;
}

function StarSection({ items, color }: { items: StarItem[]; color: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const filteredItems = items.filter((item) => item.answer);
  if (filteredItems.length === 0) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <FieldLabel label='DEEP DIVE' color={color} />
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
              {/* Toggle header */}
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

              {/* Collapsible answer */}
              {isOpen && item.answer && (
                <div
                  style={{
                    padding: '0 18px 18px',
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.9)', // Muito mais fácil de ler
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

/* ═══════════════════════════════════════════════════════════════
   CONTENT RENDERERS — one per section type
   ═══════════════════════════════════════════════════════════════ */

function EducationContent({ project, color }: { project: any; color: string }) {
  return (
    <>
      {project.institution && (
        <InstitutionHeader
          name={project.institution}
          logo={project.institutionLogo}
          color={color}
        />
      )}
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: color, // Destaque no curso (em vez de repetir instituição)
          margin: '0 0 14px',
          lineHeight: 1.3,
        }}
      >
        {project.role || project.title}
      </h2>
      <PeriodBadge
        start={project.periodStart}
        end={project.periodEnd}
        color={color}
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
          color: 'rgba(255,255,255,0.9)', // Mais branco para legibilidade
          lineHeight: 1.8,
          margin: '0 0 24px',
        }}
      >
        {project.description}
      </p>
      {project.competencies?.length > 0 && (
        <>
          <FieldLabel label='COMPETENCIES' color={color} />
          <PillRow items={project.competencies} color={color} size='md' />
        </>
      )}
    </>
  );
}

function ExperienceContent({
  project,
  color,
}: {
  project: any;
  color: string;
}) {
  return (
    <>
      {project.institution && (
        <InstitutionHeader
          name={project.institution}
          logo={project.institutionLogo}
          color={color}
        />
      )}
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: color, // Dá super destaque ao CARGO (Role)
          margin: '0 0 14px',
          lineHeight: 1.3,
        }}
      >
        {project.role || project.title}
      </h2>
      <PeriodBadge
        start={project.periodStart}
        end={project.periodEnd}
        color={color}
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
          color: 'rgba(255,255,255,0.9)', // Brighter text!
          lineHeight: 1.8,
          margin: '0 0 24px',
        }}
      >
        {project.description}
      </p>
      {project.techStack?.length > 0 && (
        <>
          <FieldLabel label='TECH STACK' color={color} />
          <PillRow items={project.techStack} color={color} size='md' />
        </>
      )}

      {/* Highlight metric */}
      {project.starMetric && (
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
                color: color,
                marginBottom: 4,
              }}
            >
              KEY RESULT
            </div>
            <div
              style={{
                fontSize: 16,
                color: '#ffffff',
                fontWeight: 600,
              }}
            >
              {project.starMetric}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProjectContent({ project, color }: { project: any; color: string }) {
  return (
    <>
      <h2
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#ffffff', // Em Projetos o Título do projeto ganha o branco
          margin: '0 0 14px',
          lineHeight: 1.3,
        }}
      >
        {project.title}
      </h2>
      <PeriodBadge
        start={project.periodStart}
        end={project.periodEnd}
        color={color}
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
        {project.description}
      </p>
      {project.tags?.length > 0 && (
        <PillRow items={project.tags} color={color} size='md' />
      )}
      {project.starMetric && (
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
                color: color,
                marginBottom: 4,
              }}
            >
              KEY RESULT
            </div>
            <div
              style={{
                fontSize: 16,
                color: '#ffffff',
                fontWeight: 600,
              }}
            >
              {project.starMetric}
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
            color: '#ffffff', // Texto de Botão perfeitamente legível
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
          VIEW PROJECT →
        </a>
      )}
    </>
  );
}

function CertificationContent({
  project,
  color,
}: {
  project: any;
  color: string;
}) {
  return (
    <>
      {project.institution && (
        <InstitutionHeader
          name={project.institution}
          logo={project.institutionLogo}
          color={color}
        />
      )}
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: color,
          margin: '0 0 14px',
          lineHeight: 1.3,
        }}
      >
        {project.role || project.title}
      </h2>
      <PeriodBadge
        start={project.periodStart}
        end={project.periodEnd}
        color={color}
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
        {project.description}
      </p>
      {project.competencies?.length > 0 && (
        <>
          <FieldLabel label='COMPETENCIES' color={color} />
          <PillRow items={project.competencies} color={color} size='md' />
        </>
      )}
    </>
  );
}

const CONTENT_RENDERERS: Record<
  SectionType,
  (props: { project: any; color: string }) => React.ReactNode
> = {
  education: EducationContent,
  experience: ExperienceContent,
  volunteer: ExperienceContent,
  projects: ProjectContent,
  certifications: CertificationContent,
};

/* ═══════════════════════════════════════════════════════════════
   MODAL COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function ProjectModal({
  project,
  section,
  onClose,
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
  const sectionType = section.type;
  const ContentRenderer = CONTENT_RENDERERS[sectionType] || ProjectContent;
  const showHeroImage = sectionType === 'projects';

  /* Build STAR items */
  const starItems: StarItem[] = [
    {
      question: 'What was the context and scale of this challenge?',
      answer: project.starSituation,
    },
    {
      question: 'What specific task did you take on?',
      answer: project.starTask,
    },
    {
      question: 'What concrete actions did you plan and execute?',
      answer: project.starAction,
    },
    {
      question: 'What tangible results did you achieve?',
      answer: project.starResult,
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
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 0, 12, 0.88)',
          backdropFilter: 'blur(16px)',
        }}
      />

      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: 680, // Expandimos levemente a largura da Modal
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
        {/* Accent bar */}
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            boxShadow: `0 0 20px ${color}80`,
          }}
        />

        {/* Hero image (projects only) */}
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

        {/* Header row */}
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
              color: `${color}`,
              textTransform: 'uppercase',
            }}
          >
            {section.title}
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

        {/* Type-specific content */}
        <div style={{ padding: '20px 32px 12px' }}>
          <ContentRenderer project={project} color={color} />
        </div>

        {/* STAR toggle sections */}
        {hasStarContent && (
          <div style={{ padding: '0 32px 32px' }}>
            <StarSection items={starItems} color={color} />
          </div>
        )}

        {/* Bottom close area */}
        {!hasStarContent && <div style={{ height: 24 }} />}
      </div>

      {/* CSS */}
      <style>{`
        @keyframes starReveal {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
