import { useState } from 'react';
import {
  ACCENT,
  ACCENT_DIM,
  LANGUAGES,
  SOCIAL_LINKS,
  t,
  TECH_STACK,
} from '../../data/i18n';
import type { LandingPageProps } from '../../types';

const FONT = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";

/* ── SVG Logos for each tech (keyed by name) ── */
const TECH_LOGOS: Record<string, React.ReactNode> = {
  Python: (
    <svg viewBox='0 0 256 255' width='20' height='20'>
      <defs>
        <linearGradient id='py1' x1='12.9%' y1='12.6%' x2='79.7%' y2='78.5%'>
          <stop offset='0%' stopColor='#387EB8' />
          <stop offset='100%' stopColor='#366994' />
        </linearGradient>
        <linearGradient id='py2' x1='19.1%' y1='20.6%' x2='90.6%' y2='88.8%'>
          <stop offset='0%' stopColor='#FFE052' />
          <stop offset='100%' stopColor='#FFC331' />
        </linearGradient>
      </defs>
      <path
        d='M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0111.13 11.13 11.12 11.12 0 01-11.13 11.13 11.12 11.12 0 01-11.13-11.13 11.12 11.12 0 0111.13-11.13z'
        fill='url(#py1)'
      />
      <path
        d='M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 01-11.13-11.13 11.12 11.12 0 0111.13-11.131 11.12 11.12 0 0111.13 11.13 11.12 11.12 0 01-11.13 11.13z'
        fill='url(#py2)'
      />
    </svg>
  ),
  SQL: (
    <svg viewBox='0 0 24 24' width='20' height='20' fill='none'>
      <ellipse
        cx='12'
        cy='6'
        rx='8'
        ry='3'
        stroke='#e48e00'
        strokeWidth='1.5'
      />
      <path
        d='M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6'
        stroke='#e48e00'
        strokeWidth='1.5'
      />
      <path
        d='M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6'
        stroke='#e48e00'
        strokeWidth='1.5'
      />
    </svg>
  ),
  'Apache Spark': (
    <svg viewBox='0 0 24 24' width='20' height='20' fill='#E25A1C'>
      <path d='M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z' />
    </svg>
  ),
  Airflow: (
    <svg viewBox='0 0 24 24' width='20' height='20' fill='none'>
      <path
        d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'
        stroke='#017CEE'
        strokeWidth='1.2'
      />
      <path
        d='M12 6v6l4.5 2.5'
        stroke='#017CEE'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <circle cx='12' cy='12' r='1.5' fill='#017CEE' />
      <path
        d='M7 17l1.5-3M17 17l-1.5-3M12 6V4'
        stroke='#017CEE'
        strokeWidth='1'
        strokeLinecap='round'
        opacity='0.5'
      />
    </svg>
  ),
  dbt: (
    <svg viewBox='0 0 24 24' width='20' height='20' fill='none'>
      <path
        d='M12 3L3 8v8l9 5 9-5V8l-9-5z'
        stroke='#FF694B'
        strokeWidth='1.5'
        strokeLinejoin='round'
      />
      <path
        d='M3 8l9 5 9-5M12 13v8'
        stroke='#FF694B'
        strokeWidth='1.5'
        strokeLinejoin='round'
      />
    </svg>
  ),
  AWS: (
    <svg viewBox='0 0 24 24' width='20' height='20' fill='none'>
      <path
        d='M6.5 11.5l2.5-5 2.5 5M7.5 10h3'
        stroke='#FF9900'
        strokeWidth='1.3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M17.5 11.5l-2-5-2 5M14.5 10h3'
        stroke='#FF9900'
        strokeWidth='1.3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M3 14.5s3 2.5 9 2.5 9-2.5 9-2.5'
        stroke='#FF9900'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M19 15l2-1.5L19 12'
        stroke='#FF9900'
        strokeWidth='1.3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  Kafka: (
    <svg viewBox='0 0 24 24' width='20' height='20' fill='none'>
      <circle cx='12' cy='12' r='2' stroke='#aaa' strokeWidth='1.3' />
      <circle cx='12' cy='5' r='1.5' stroke='#aaa' strokeWidth='1.2' />
      <circle cx='18' cy='8' r='1.5' stroke='#aaa' strokeWidth='1.2' />
      <circle cx='18' cy='16' r='1.5' stroke='#aaa' strokeWidth='1.2' />
      <circle cx='12' cy='19' r='1.5' stroke='#aaa' strokeWidth='1.2' />
      <circle cx='6' cy='16' r='1.5' stroke='#aaa' strokeWidth='1.2' />
      <circle cx='6' cy='8' r='1.5' stroke='#aaa' strokeWidth='1.2' />
      <line x1='12' y1='10' x2='12' y2='6.5' stroke='#aaa' strokeWidth='1' />
      <line
        x1='13.7'
        y1='10.8'
        x2='16.7'
        y2='8.8'
        stroke='#aaa'
        strokeWidth='1'
      />
      <line
        x1='13.7'
        y1='13.2'
        x2='16.7'
        y2='15.2'
        stroke='#aaa'
        strokeWidth='1'
      />
      <line x1='12' y1='14' x2='12' y2='17.5' stroke='#aaa' strokeWidth='1' />
      <line
        x1='10.3'
        y1='13.2'
        x2='7.3'
        y2='15.2'
        stroke='#aaa'
        strokeWidth='1'
      />
      <line
        x1='10.3'
        y1='10.8'
        x2='7.3'
        y2='8.8'
        stroke='#aaa'
        strokeWidth='1'
      />
    </svg>
  ),
  Docker: (
    <svg viewBox='0 0 24 24' width='20' height='20' fill='none'>
      <rect
        x='3'
        y='11'
        width='3'
        height='2.5'
        rx='0.3'
        stroke='#2496ED'
        strokeWidth='1'
      />
      <rect
        x='6.5'
        y='11'
        width='3'
        height='2.5'
        rx='0.3'
        stroke='#2496ED'
        strokeWidth='1'
      />
      <rect
        x='10'
        y='11'
        width='3'
        height='2.5'
        rx='0.3'
        stroke='#2496ED'
        strokeWidth='1'
      />
      <rect
        x='6.5'
        y='8'
        width='3'
        height='2.5'
        rx='0.3'
        stroke='#2496ED'
        strokeWidth='1'
      />
      <rect
        x='10'
        y='8'
        width='3'
        height='2.5'
        rx='0.3'
        stroke='#2496ED'
        strokeWidth='1'
      />
      <rect
        x='10'
        y='5'
        width='3'
        height='2.5'
        rx='0.3'
        stroke='#2496ED'
        strokeWidth='1'
      />
      <rect
        x='13.5'
        y='11'
        width='3'
        height='2.5'
        rx='0.3'
        stroke='#2496ED'
        strokeWidth='1'
      />
      <path
        d='M2 14c0 0 1.5 5 9 5s10.5-3 11-5.5c0 0-1.5-1-3-1'
        stroke='#2496ED'
        strokeWidth='1.3'
        strokeLinecap='round'
      />
      <path
        d='M19.5 10c.8-.8 1-2.5.5-3.5'
        stroke='#2496ED'
        strokeWidth='1'
        strokeLinecap='round'
      />
    </svg>
  ),
};

/* ── Holographic corner accent ── */
function CornerAccent({ top, left }: { top: boolean; left: boolean }) {
  const v = top ? 'top' : 'bottom';
  const h = left ? 'left' : 'right';
  return (
    <div
      style={{
        position: 'absolute',
        [v]: -1,
        [h]: -1,
        width: 18,
        height: 18,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          [v]: 0,
          [h]: 0,
          width: 18,
          height: 1,
          background: ACCENT,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          [v]: 0,
          [h]: 0,
          width: 1,
          height: 18,
          background: ACCENT,
          opacity: 0.5,
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage({
  language,
  onChangeLanguage,
  onStart,
  isTransitioning,
  audioEnabled,
  onToggleAudio,
  fontSize,
  onAdjustFont,
}: LandingPageProps) {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [hoveredStart, setHoveredStart] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  /** Scale any base px size by the fontSize multiplier */
  const fs = (base: number) => base * fontSize;

  const fade: React.CSSProperties = {
    opacity: isTransitioning ? 0 : 1,
    transition: 'opacity 1.2s ease',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: isTransitioning ? 'none' : 'auto',
      }}
    >
      {/* ═══════════════════════ TOP BAR ═══════════════════════ */}
      <div
        style={{
          ...fade,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 28px',
          flexShrink: 0,
        }}
      >
        {/* Left: Language + Font size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Language selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${ACCENT_DIM}0.18)`,
                borderRadius: 6,
                padding: '8px 16px',
                color: `${ACCENT_DIM}0.7)`,
                fontSize: fs(14),
                letterSpacing: 2,
                cursor: 'pointer',
                fontFamily: FONT,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.3s ease',
              }}
            >
              {LANGUAGES.find((l) => l.code === language)?.flag}
              <span style={{ fontSize: 14, opacity: 0.4 }}>▼</span>
            </button>

            {langOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  background: 'rgba(6,12,22,0.96)',
                  border: `1px solid ${ACCENT_DIM}0.12)`,
                  borderRadius: 6,
                  overflow: 'hidden',
                  backdropFilter: 'blur(16px)',
                  animation: 'dropIn 0.2s ease',
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
                      padding: '10px 20px',
                      background:
                        language === lang_item.code
                          ? `${ACCENT_DIM}0.08)`
                          : 'transparent',
                      border: 'none',
                      color:
                        language === lang_item.code
                          ? `${ACCENT_DIM}0.9)`
                          : 'rgba(255,255,255,0.4)',
                      fontSize: fs(12),
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
              gap: 4,
              border: `1px solid ${ACCENT_DIM}0.12)`,
              borderRadius: 6,
              padding: '4px 6px',
            }}
          >
            <button
              onClick={() => onAdjustFont(-0.1)}
              style={{
                background: 'none',
                border: 'none',
                color: `${ACCENT_DIM}0.45)`,
                cursor: 'pointer',
                fontFamily: FONT,
                fontSize: 17,
                padding: '2px 8px',
                lineHeight: 1,
                fontWeight: 600,
                transition: 'color 0.2s',
              }}
              title='Decrease font'
            >
              A−
            </button>
            <div
              style={{ width: 1, height: 16, background: `${ACCENT_DIM}0.1)` }}
            />
            <button
              onClick={() => onAdjustFont(0.1)}
              style={{
                background: 'none',
                border: 'none',
                color: `${ACCENT_DIM}0.45)`,
                cursor: 'pointer',
                fontFamily: FONT,
                fontSize: 17,
                padding: '2px 8px',
                lineHeight: 1,
                fontWeight: 600,
                transition: 'color 0.2s',
              }}
              title='Increase font'
            >
              A+
            </button>
          </div>
        </div>

        {/* Right: Social links */}
        <div style={{ display: 'flex', gap: 10 }}>
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target='_blank'
              rel='noopener noreferrer'
              title={social.platform}
              onMouseEnter={() => setHoveredSocial(social.platform)}
              onMouseLeave={() => setHoveredSocial(null)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 6,
                border: `1px solid ${ACCENT_DIM}${hoveredSocial === social.platform ? '0.3)' : '0.12)'}`,
                background:
                  hoveredSocial === social.platform
                    ? `${ACCENT_DIM}0.08)`
                    : 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                transform:
                  hoveredSocial === social.platform
                    ? 'translateY(-2px)'
                    : 'none',
              }}
            >
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill={
                  hoveredSocial === social.platform
                    ? `${ACCENT_DIM}0.9)`
                    : `${ACCENT_DIM}0.4)`
                }
                style={{ transition: 'fill 0.3s' }}
              >
                <path d={social.svgPath} />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* ═══════════════════ CENTER: HOLOGRAPHIC CARD ═══════════════════ */}
      <div
        style={{
          ...fade,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          minHeight: 0, // flex child scroll prevention
        }}
      >
        <div
          style={{
            position: 'relative',
            maxWidth: 680,
            width: '100%',
            padding: '40px 44px 36px',
            background: `linear-gradient(135deg, ${ACCENT_DIM}0.04), rgba(8,16,30,0.3))`,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {/* Border */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 8,
              border: `1px solid ${ACCENT_DIM}0.15)`,
              pointerEvents: 'none',
            }}
          />

          {/* Corner accents */}
          <CornerAccent top left />
          <CornerAccent top left={false} />
          <CornerAccent top={false} left />
          <CornerAccent top={false} left={false} />

          {/* Top glow line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${ACCENT}60, transparent)`,
            }}
          />

          {/* Animated scan line */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${ACCENT_DIM}0.25), transparent)`,
              animation: 'scanMove 4s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />

          {/* ── Photo + Identity row ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              marginBottom: 28,
            }}
          >
            {/* Photo */}
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: -3,
                  borderRadius: '50%',
                  border: `1px solid ${ACCENT_DIM}0.2)`,
                  boxShadow: `0 0 25px ${ACCENT_DIM}0.1)`,
                  animation: 'pulseRing 4s ease infinite',
                }}
              />
              <div
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${ACCENT_DIM}0.15), rgba(20,40,70,0.3))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${ACCENT_DIM}0.12)`,
                  overflow: 'hidden',
                }}
              >
                <img
                  src='https://avatars.githubusercontent.com/u/69637300?v=4'
                  alt='Profile'
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Hello + Name + Role */}
            <div>
              <div
                style={{
                  fontSize: fs(20),
                  letterSpacing: 4,
                  color: `${ACCENT_DIM}0.7)`,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                }}
              >
                {t('landing.greeting', language)}
              </div>
              <h1
                style={{
                  fontSize: fs(38),
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.93)',
                  margin: 0,
                  letterSpacing: 1,
                  lineHeight: 1.15,
                }}
              >
                {t('landing.name', language)}
              </h1>
              <div
                style={{
                  fontSize: fs(13),
                  letterSpacing: 5,
                  color: ACCENT,
                  marginTop: 8,
                  opacity: 0.7,
                }}
              >
                {t('landing.role', language)}
              </div>
            </div>
          </div>

          {/* Separator */}
          <div
            style={{
              height: 1,
              background: `linear-gradient(90deg, ${ACCENT_DIM}0.2), transparent)`,
              marginBottom: 20,
            }}
          />

          {/* Tagline */}
          <p
            style={{
              fontSize: fs(18),
              color: `${ACCENT_DIM}0.75)`,
              margin: '0 0 14px',
              lineHeight: 1.5,
              letterSpacing: 0.3,
              fontWeight: 500,
            }}
          >
            {t('landing.tagline', language)}
          </p>

          {/* Bio */}
          <p
            style={{
              fontSize: fs(14),
              color: 'rgba(255,255,255,0.8)',
              margin: '0 0 30px',
              lineHeight: 1.8,
            }}
          >
            {t('landing.bio', language)}
          </p>

          {/* ── Tech Stack with logos ── */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontSize: fs(14),
                letterSpacing: 5,
                color: `${ACCENT_DIM}0.75)`,
                marginBottom: 14,
              }}
            >
              {t('landing.stack', language)}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {TECH_STACK.map((tech) => (
                <div
                  key={tech.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 6,
                    background: `${tech.color}0a`,
                    border: `1px solid ${tech.color}22`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      opacity: 0.85,
                    }}
                  >
                    {TECH_LOGOS[tech.name] ?? null}
                  </span>
                  <span
                    style={{
                      fontSize: fs(12),
                      letterSpacing: 1,
                      color: `${tech.color}cc`,
                    }}
                  >
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Start Button ── */}
          <button
            onClick={onStart}
            onMouseEnter={() => setHoveredStart(true)}
            onMouseLeave={() => setHoveredStart(false)}
            style={{
              width: '100%',
              padding: '16px 0',
              background: hoveredStart
                ? `${ACCENT_DIM}0.12)`
                : `${ACCENT_DIM}0.04)`,
              border: `1px solid ${ACCENT_DIM}${hoveredStart ? '0.4)' : '0.2)'}`,
              borderRadius: 6,
              color: `${ACCENT_DIM}0.9)`,
              fontSize: fs(14),
              letterSpacing: 5,
              cursor: 'pointer',
              fontFamily: FONT,
              transition: 'all 0.4s ease',
              transform: hoveredStart ? 'translateY(-1px)' : 'none',
              boxShadow: hoveredStart
                ? `0 4px 30px ${ACCENT_DIM}0.12)`
                : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 16, opacity: 0.7 }}>▷</span>
            {t('landing.startButton', language)}
          </button>
        </div>
      </div>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <div
        style={{
          ...fade,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 28px 20px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: fs(15),
            letterSpacing: 2,
            color: 'rgba(187, 176, 176, 0.18)',
          }}
        >
          <svg
            width='15'
            height='15'
            viewBox='0 0 24 24'
            fill='none'
            stroke='rgba(255,255,255,0.18)'
            strokeWidth='1.5'
          >
            <path d='M3 18v-6a9 9 0 0118 0v6' />
            <path d='M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z' />
          </svg>
          {t('landing.headphones', language)}
        </div>

        {/* Right: audio toggle */}
        <button
          onClick={onToggleAudio}
          title={audioEnabled ? 'Mute' : 'Unmute'}
          style={{
            width: 40,
            height: 40,
            borderRadius: 6,
            border: `1px solid ${ACCENT_DIM}0.12)`,
            background: 'rgba(255,255,255,0.02)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            transition: 'all 0.3s ease',
          }}
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke={
              audioEnabled ? `${ACCENT_DIM}0.6)` : 'rgba(255,255,255,0.18)'
            }
            strokeWidth='1.5'
          >
            {audioEnabled ? (
              <>
                <path d='M11 5L6 9H2v6h4l5 4V5z' />
                <path d='M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07' />
              </>
            ) : (
              <>
                <path d='M11 5L6 9H2v6h4l5 4V5z' />
                <line x1='23' y1='9' x2='17' y2='15' />
                <line x1='17' y1='9' x2='23' y2='15' />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* ── Transition flash overlay ── */}
      {isTransitioning && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background:
              'radial-gradient(ellipse at center, rgba(68,136,204,0.15) 0%, transparent 70%)',
            animation: 'portalFlash 2.5s ease forwards',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 25px ${ACCENT_DIM}0.1); }
          50% { box-shadow: 0 0 45px ${ACCENT_DIM}0.2); }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes portalFlash {
          0% { opacity: 0; }
          30% { opacity: 1; }
          60% { opacity: 1; background: radial-gradient(ellipse at center, rgba(68,170,255,0.3) 0%, rgba(4,8,16,0.95) 60%); }
          100% { opacity: 1; background: rgba(4,8,16,1); }
        }
        @keyframes scanMove {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
