import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { ScrollState } from '../types';

interface PortalTransitionState {
  /** 0–1 intensity of the portal flash effect */
  flashIntensity: number;
  /** The color of the portal currently being traversed */
  activeColor: THREE.Color;
  /** Whether the camera is currently inside a portal zone */
  insidePortal: boolean;
}

/**
 * usePortalTransition
 *
 * Tracks when the camera crosses portal boundaries and provides
 * a flash intensity value for post-processing / overlay effects.
 */
export function usePortalTransition(
  scrollState: React.MutableRefObject<ScrollState>,
  portalPositions: number[],
) {
  const state = useRef<PortalTransitionState>({
    flashIntensity: 0,
    activeColor: new THREE.Color('#ffffff'),
    insidePortal: false,
  });

  const prevCameraZ = useRef<number>(0);

  useFrame(() => {
    const { cameraZ } = scrollState.current;
    const threshold = 3; // how close to trigger

    let nearestDist = Infinity;
    let nearPortal = false;

    for (const pz of portalPositions) {
      const dist = Math.abs(cameraZ - pz);
      if (dist < threshold) {
        nearPortal = true;
        if (dist < nearestDist) nearestDist = dist;
      }
    }

    if (nearPortal) {
      // Intensity peaks when exactly at the portal
      const intensity = Math.max(0, 1 - nearestDist / threshold);
      state.current.flashIntensity = intensity;
      state.current.insidePortal = true;
    } else {
      // Decay
      state.current.flashIntensity *= 0.92;
      if (state.current.flashIntensity < 0.01) {
        state.current.flashIntensity = 0;
        state.current.insidePortal = false;
      }
    }

    prevCameraZ.current = cameraZ;
  });

  return state;
}
