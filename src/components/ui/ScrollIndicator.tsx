import { SECTIONS } from '../../data/projects';
import type { Section } from '../../types/index';

interface ScrollIndicatorProps {
  currentSection: number;
  progress: number;
  hasScrolled: boolean;
  isVisible: boolean;
  onNavigate: (sectionIndex: number) => void;
}

/* ═══════════════════════════════════════════════════════════════
   HUD OVERLAY — All DOM UI layered above the Canvas

   Sections:
   - Top-left: branding + current section title
   - Top-right: depth percentage
   - Right: section navigation dots
   - Bottom-center: scroll hint (fades after first scroll)
   - Bottom: progress bar
   ═══════════════════════════════════════════════════════════════ */
export default function ScrollIndicator({
  currentSection,
  progress,
  hasScrolled,
  isVisible,
  onNavigate,
}: ScrollIndicatorProps) {
  const section: Section = SECTIONS[currentSection] || SECTIONS[0];

  const base: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    pointerEvents: 'none',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.8s ease',
  };

  return (
    <>
      {/* ─── TOP LEFT: Branding + Section ─── */}
      <div
        style={{
          ...base,
          position: 'fixed',
          top: 0,
          left: 0,
          padding: '26px 32px',
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: 5,
            color: 'rgba(255,255,255,0.25)',
            marginBottom: 6,
          }}
        >
          PORTFOLIO // 2026
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: section.color,
            letterSpacing: 3,
            transition: 'color 0.5s ease',
          }}
        >
          {section.title}
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.3)',
            marginTop: 4,
            letterSpacing: 1,
            transition: 'color 0.5s ease',
          }}
        >
          {section.subtitle}
        </div>
      </div>

      {/* ─── TOP RIGHT: Depth ─── */}
      <div
        style={{
          ...base,
          position: 'fixed',
          top: 0,
          right: 0,
          padding: '26px 32px',
          textAlign: 'right',
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: 3,
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          DEPTH
        </div>
        <div
          style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.45)',
            fontVariantNumeric: 'tabular-nums',
            marginTop: 2,
          }}
        >
          {Math.round(progress * 100)}%
        </div>
      </div>

      {/* ─── RIGHT: Section Nav Dots ─── */}
      <div
        style={{
          ...base,
          position: 'fixed',
          right: 28,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          zIndex: 20,
          pointerEvents: 'auto',
        }}
      >
        {SECTIONS.map((s, i) => {
          const isActive = i === currentSection;
          return (
            <button
              key={s.id}
              onClick={() => onNavigate(i)}
              title={s.title}
              style={{
                width: 10,
                height: isActive ? 30 : 10,
                borderRadius: 5,
                border: 'none',
                background: isActive ? s.color : 'rgba(255,255,255,0.12)',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                padding: 0,
                boxShadow: isActive ? `0 0 12px ${s.color}50` : 'none',
              }}
            >
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    right: 20,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 9,
                    letterSpacing: 2,
                    color: s.color,
                    whiteSpace: 'nowrap',
                    fontFamily:
                      "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                    animation: 'labelFadeIn 0.3s ease',
                  }}
                >
                  {s.title}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── BOTTOM CENTER: Scroll Hint ─── */}
      {!hasScrolled && (
        <div
          style={{
            ...base,
            position: 'fixed',
            bottom: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 20,
            animation: 'hintFadeIn 1s ease 1.2s both',
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: 5,
              color: 'rgba(255,255,255,0.3)',
              marginBottom: 10,
            }}
          >
            SCROLL TO EXPLORE
          </div>
          <div
            style={{
              width: 20,
              height: 34,
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 10,
              margin: '0 auto',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: 3,
                height: 8,
                background: `${section.color}aa`,
                borderRadius: 2,
                position: 'absolute',
                top: 6,
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'scrollDot 2s ease infinite',
              }}
            />
          </div>
        </div>
      )}

      {/* ─── BOTTOM: Progress Bar ─── */}
      <div
        style={{
          ...base,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'rgba(255,255,255,0.04)',
          zIndex: 20,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${SECTIONS.map((s) => s.color).join(', ')})`,
            transition: 'width 0.15s ease-out',
            boxShadow: `0 0 8px ${section.color}60`,
          }}
        />

        {/* Section markers on the progress bar */}
        {SECTIONS.map((s, i) => (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              left: `${(i / SECTIONS.length) * 100}%`,
              bottom: 0,
              width: 1,
              height: 6,
              background:
                i <= currentSection ? s.color : 'rgba(255,255,255,0.08)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </>
  );
}
