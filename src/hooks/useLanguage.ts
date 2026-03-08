import { useCallback, useState } from 'react';
import type { Language } from '../types';

/**
 * useLanguage
 *
 * Manages the current language with localStorage persistence.
 * Also detects browser language on first visit.
 */
export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first
    try {
      const stored = localStorage.getItem('portfolio-lang');
      if (stored === 'en' || stored === 'pt' || stored === 'es') return stored;
    } catch {
      // localStorage unavailable (privacy mode, etc.)
    }

    // Auto-detect from browser
    const browserLang = navigator.language?.slice(0, 2)?.toLowerCase();
    if (browserLang === 'pt') return 'pt';
    if (browserLang === 'es') return 'es';
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('portfolio-lang', lang);
    } catch {
      // silent fail
    }
    // Update <html lang> for accessibility
    document.documentElement.lang = lang;
  }, []);

  return { language, setLanguage };
}
