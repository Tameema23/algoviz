import { create } from 'zustand';

export const useStore = create((set) => ({
  // Playback
  isPlaying: false,
  speed: 50, // ms per step
  currentStep: 0,
  steps: [],

  setSteps: (steps) => set({ steps, currentStep: 0, isPlaying: false }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setSpeed: (speed) => set({ speed }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.steps.length - 1) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
  reset: () => set({ currentStep: 0, isPlaying: false }),
}));
