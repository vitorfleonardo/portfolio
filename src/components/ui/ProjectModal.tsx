import { useEffect, useRef } from 'react';
import type { ProjectModalProps } from '../../types/index';

/* ═══════════════════════════════════════════════════════════════
   PROJECT MODAL — Full-screen overlay with project details
   
   Renders outside the Canvas as a DOM overlay.
   Uses CSS animations (no Framer dependency needed).
   ═══════════════════════════════════════════════════════════════ */
export default function ProjectModal({
  project,
  sectionColor,
  onClose,
}: ProjectModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  /* Close on Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      ref={backdropRef}
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
          maxWidth: 580,
          width: '100%',
          background:
            'linear-gradient(145deg, rgba(18,8,36,0.97), rgba(8,4,18,0.99))',
          border: `1px solid ${sectionColor}44`,
          borderRadius: 8,
          overflow: 'hidden',
          animation: 'modalSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${sectionColor}, transparent)`,
            boxShadow: `0 0 20px ${sectionColor}80`,
          }}
        />

        {/* Hero image */}
        <div
          style={{
            height: 200,
            background: `linear-gradient(180deg, transparent 40%, rgba(4,0,12,0.95)), url(${project.image}) center/cover`,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${sectionColor}18, transparent)`,
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              width: 32,
              height: 32,
              borderRadius: 4,
              border: `1px solid ${sectionColor}40`,
              background: 'rgba(4,0,12,0.6)',
              color: sectionColor,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = `${sectionColor}30`;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = 'rgba(4,0,12,0.6)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px 28px' }}>
          {/* Year badge */}
          {project.year && (
            <div
              style={{
                display: 'inline-block',
                fontSize: 10,
                letterSpacing: 3,
                color: sectionColor,
                padding: '4px 10px',
                background: `${sectionColor}12`,
                border: `1px solid ${sectionColor}25`,
                borderRadius: 3,
                marginBottom: 12,
              }}
            >
              {project.year}
            </div>
          )}

          {/* Title */}
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.95)',
              margin: '0 0 14px',
              letterSpacing: 0.3,
              lineHeight: 1.3,
            }}
          >
            {project.title}
          </h2>

          {/* Separator */}
          <div
            style={{
              height: 1,
              background: `linear-gradient(90deg, ${sectionColor}30, transparent)`,
              marginBottom: 14,
            }}
          />

          {/* Description */}
          <p
            style={{
              fontSize: 13.5,
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.75,
              margin: '0 0 20px',
            }}
          >
            {project.description}
          </p>

          {/* Tags */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 24,
            }}
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 10,
                  letterSpacing: 1.5,
                  padding: '5px 12px',
                  background: `${sectionColor}12`,
                  border: `1px solid ${sectionColor}30`,
                  borderRadius: 3,
                  color: sectionColor,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Link button (if available) */}
          {project.link && (
            <a
              href={project.link}
              target='_blank'
              rel='noopener noreferrer'
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                background: `${sectionColor}15`,
                border: `1px solid ${sectionColor}35`,
                borderRadius: 4,
                color: sectionColor,
                fontSize: 11,
                letterSpacing: 3,
                textAlign: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  `${sectionColor}28`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  `${sectionColor}15`;
              }}
            >
              VIEW PROJECT →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
