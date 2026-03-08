import { useState } from 'react';
import { ACCENT_DIM, LANGUAGES } from '../../data/i18n';
import { SECTIONS } from '../../data/projects';
import { ts } from '../../data/projectTranslations';
import type { Language } from '../../types/index';

interface ScrollIndicatorProps {
  currentSection: number;
  progress: number;
  hasScrolled: boolean;
  isVisible: boolean;
  onNavigate: (sectionIndex: number) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  fontSize: number;
  onAdjustFont: (delta: number) => void;
}

const FONT = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";

const SCROLL_HINT: Record<string, string> = {
  en: 'SCROLL TO EXPLORE',
  pt: 'SCROLL PARA EXPLORAR',
  es: 'SCROLL PARA EXPLORAR',
};

export default function ScrollIndicator({
  currentSection,
  progress,
  hasScrolled,
  isVisible,
  onNavigate,
  language,
  onChangeLanguage,
  fontSize,
  onAdjustFont,
}: ScrollIndicatorProps) {
  const section = SECTIONS[currentSection] || SECTIONS[0];
  const translated = ts(section.id, language);
  const [langOpen, setLangOpen] = useState(false);

  const base: React.CSSProperties = {
    fontFamily: FONT,
    pointerEvents: 'none',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.8s ease',
  };

  return (
    <>
      {/* ─── TOP LEFT: Branding + Section (translated) ─── */}
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
          {translated.title}
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
          {translated.subtitle}
        </div>
      </div>

      {/* ─── TOP RIGHT: Depth + Accessibility Controls ─── */}
      <div
        style={{
          ...base,
          position: 'fixed',
          top: 0,
          right: 0,
          padding: '26px 32px',
          zIndex: 20,
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        {/* Language selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${ACCENT_DIM}0.15)`,
              borderRadius: 4,
              padding: '6px 12px',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 11,
              letterSpacing: 2,
              cursor: 'pointer',
              fontFamily: FONT,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.3s ease',
            }}
          >
            {LANGUAGES.find((l) => l.code === language)?.flag}
            <span style={{ fontSize: 9, opacity: 0.4 }}>▼</span>
          </button>

          {langOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                background: 'rgba(6,12,22,0.96)',
                border: `1px solid ${ACCENT_DIM}0.12)`,
                borderRadius: 4,
                overflow: 'hidden',
                backdropFilter: 'blur(16px)',
                animation: 'labelFadeIn 0.2s ease',
                zIndex: 50,
              }}
            >
              {LANGUAGES.map((lang_item) => (
                <button
                  key={lang_item.code}
                  onClick={() => {
                    onChangeLanguage(lang_item.code);
                    setLangOpen(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 16px',
                    background:
                      language === lang_item.code
                        ? `${ACCENT_DIM}0.08)`
                        : 'transparent',
                    border: 'none',
                    color:
                      language === lang_item.code
                        ? 'rgba(255,255,255,0.8)'
                        : 'rgba(255,255,255,0.4)',
                    fontSize: 10,
                    letterSpacing: 1.5,
                    cursor: 'pointer',
                    fontFamily: FONT,
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {lang_item.flag}&nbsp;&nbsp;{lang_item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font size controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: `1px solid ${ACCENT_DIM}0.12)`,
            borderRadius: 4,
            padding: '3px 4px',
          }}
        >
          <button
            onClick={() => onAdjustFont(-0.1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontFamily: FONT,
              fontSize: 13,
              padding: '2px 6px',
              lineHeight: 1,
              fontWeight: 600,
              transition: 'color 0.2s',
            }}
          >
            A−
          </button>
          <div
            style={{ width: 1, height: 14, background: `${ACCENT_DIM}0.1)` }}
          />
          <button
            onClick={() => onAdjustFont(0.1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontFamily: FONT,
              fontSize: 13,
              padding: '2px 6px',
              lineHeight: 1,
              fontWeight: 600,
              transition: 'color 0.2s',
            }}
          >
            A+
          </button>
        </div>

        {/* Depth indicator */}
        <div style={{ textAlign: 'right' }}>
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
      </div>

      {/* ─── RIGHT: Section Nav Dots (translated tooltips) ─── */}
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
          const sTranslated = ts(s.id, language);
          return (
            <button
              key={s.id}
              onClick={() => onNavigate(i)}
              title={sTranslated.title}
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
                    fontFamily: FONT,
                    animation: 'labelFadeIn 0.3s ease',
                  }}
                >
                  {sTranslated.title}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── BOTTOM CENTER: Scroll Hint (translated) ─── */}
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
            {SCROLL_HINT[language] || SCROLL_HINT.en}
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
