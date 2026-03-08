import { useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CORRIDOR, SECTIONS, TOTAL_PROJECTS } from '../data/projects';
import type { ScrollState } from '../types';

/**
 * useScrollProgress
 *
 * Central scroll state manager. Uses refs for the hot path (60fps reads)
 * and React state only for UI that needs re-renders (section changes).
 *
 * Returns:
 *  - scrollState ref: read in useFrame without causing re-renders
 *  - currentSection: React state for DOM UI
 *  - scrollTo: imperative jump to a normalised position
 */
export function useScrollProgress() {
  const target = useRef(0);
  const smoothed = useRef(0);
  const locked = useRef(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  const totalZ =
    TOTAL_PROJECTS * CORRIDOR.CARD_Z_SPACING +
    SECTIONS.length * 12 +
    CORRIDOR.ENTRY_BUFFER * 2;

  /** Ref-based state readable in useFrame */
  const scrollState = useRef<ScrollState>({
    progress: 0,
    smoothProgress: 0,
    currentSection: 0,
    cameraZ: CORRIDOR.ENTRY_BUFFER,
  });

  /** Lock scrolling (e.g. when modal is open) */
  const setLocked = useCallback((v: boolean) => {
    locked.current = v;
  }, []);

  /** Jump to a normalised scroll position (0–1) */
  const scrollTo = useCallback((normalised: number) => {
    target.current = Math.max(0, Math.min(1, normalised));
  }, []);

  /* — Wheel & touch listeners (attached to window) — */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (locked.current) return;
      target.current = Math.max(
        0,
        Math.min(1, target.current + e.deltaY * CORRIDOR.SCROLL_SPEED),
      );
      if (!hasScrolled) setHasScrolled(true);
    };

    let lastTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (locked.current) return;
      const dy = lastTouchY - e.touches[0].clientY;
      lastTouchY = e.touches[0].clientY;
      target.current = Math.max(
        0,
        Math.min(1, target.current + dy * CORRIDOR.SCROLL_SPEED * 2.5),
      );
      if (!hasScrolled) setHasScrolled(true);
    };

    // Keyboard support
    const onKeyDown = (e: KeyboardEvent) => {
      if (locked.current) return;
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        target.current = Math.min(1, target.current + 0.02);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        target.current = Math.max(0, target.current - 0.02);
      }
      if (!hasScrolled) setHasScrolled(true);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [hasScrolled]);

  /* — Per-frame lerp (runs inside R3F render loop) — */
  useFrame(() => {
    smoothed.current +=
      (target.current - smoothed.current) * CORRIDOR.SMOOTH_FACTOR;

    const cameraZ = CORRIDOR.ENTRY_BUFFER - smoothed.current * totalZ;

    // Determine current section from camera position
    let accZ = -CORRIDOR.ENTRY_BUFFER;
    let sIdx = 0;
    for (let i = 0; i < SECTIONS.length; i++) {
      const sectionEnd =
        accZ - SECTIONS[i].projects.length * CORRIDOR.CARD_Z_SPACING - 12;
      if (cameraZ < sectionEnd) {
        sIdx = Math.min(i + 1, SECTIONS.length - 1);
      }
      accZ = sectionEnd;
    }

    scrollState.current = {
      progress: target.current,
      smoothProgress: smoothed.current,
      currentSection: sIdx,
      cameraZ,
    };

    // Only trigger React re-render when section actually changes
    if (sIdx !== currentSection) {
      setCurrentSection(sIdx);
    }
  });

  return {
    scrollState,
    currentSection,
    hasScrolled,
    scrollTo,
    setLocked,
    totalZ,
  };
}
