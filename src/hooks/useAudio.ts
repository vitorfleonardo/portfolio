import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useAudio
 *
 * Manages background audio for the corridor experience.
 *
 * In production, replace the procedural synth with a real audio file:
 *   const audio = new Audio("/assets/ambient.mp3");
 *
 * The procedural version here generates a dark ambient pad
 * so the prototype works without external assets.
 */
export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<OscillatorNode[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  /**
   * Start the ambient audio.
   * Must be called from a user gesture (click handler).
   */
  const startAudio = useCallback(() => {
    if (ctxRef.current) return; // already running

    try {
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      // Master gain
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 3); // fade in
      master.connect(ctx.destination);
      gainRef.current = master;

      // === Dark ambient pad: layered detuned oscillators ===
      const freqs = [55, 82.41, 110, 146.83]; // A1, E2, A2, D3
      const types: OscillatorType[] = ['sine', 'triangle', 'sine', 'triangle'];

      freqs.forEach((freq, i) => {
        // Main osc
        const osc = ctx.createOscillator();
        osc.type = types[i];
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        // Slow detune drift
        osc.detune.setValueAtTime(0, ctx.currentTime);
        osc.detune.linearRampToValueAtTime(
          i % 2 === 0 ? 8 : -8,
          ctx.currentTime + 10,
        );

        // Per-voice gain
        const voiceGain = ctx.createGain();
        voiceGain.gain.setValueAtTime(0.3 - i * 0.05, ctx.currentTime);

        // Subtle filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400 + i * 200, ctx.currentTime);
        filter.Q.setValueAtTime(0.5, ctx.currentTime);

        osc.connect(filter);
        filter.connect(voiceGain);
        voiceGain.connect(master);

        osc.start(ctx.currentTime + i * 0.3);
        nodesRef.current.push(osc);
      });

      // === Subtle LFO on master gain for breathing effect ===
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // very slow
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.03, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(master.gain);
      lfo.start();
      nodesRef.current.push(lfo);

      setIsPlaying(true);
    } catch (err) {
      console.warn('Audio failed to initialize:', err);
    }
  }, []);

  /** Fade out and stop */
  const stopAudio = useCallback(() => {
    if (!ctxRef.current || !gainRef.current) return;
    const ctx = ctxRef.current;
    gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);

    setTimeout(() => {
      nodesRef.current.forEach((n) => {
        try {
          n.stop();
        } catch {
          /* already stopped */
        }
      });
      nodesRef.current = [];
      try {
        ctx.close();
      } catch {
        /* already closed */
      }
      ctxRef.current = null;
      gainRef.current = null;
      setIsPlaying(false);
    }, 1200);
  }, []);

  /** Toggle mute/unmute without destroying the context */
  const toggleAudio = useCallback(() => {
    if (!gainRef.current || !ctxRef.current) {
      setIsEnabled((prev) => !prev);
      return;
    }

    const ctx = ctxRef.current;
    if (isPlaying) {
      gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      setIsPlaying(false);
      setIsEnabled(false);
    } else {
      gainRef.current.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.5);
      setIsPlaying(true);
      setIsEnabled(true);
    }
  }, [isPlaying]);

  /** Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        nodesRef.current.forEach((n) => {
          try {
            n.stop();
          } catch {
            /* */
          }
        });
        try {
          ctxRef.current.close();
        } catch {
          /* */
        }
      }
    };
  }, []);

  return {
    startAudio,
    stopAudio,
    toggleAudio,
    isPlaying,
    isEnabled,
    setIsEnabled,
  };
}
