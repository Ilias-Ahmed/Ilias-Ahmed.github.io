import { create } from "zustand";

// Define the store for managing hero state
interface HeroState {
  // Basic settings
  mode: "developer" | "designer" | "creative";
  timeOfDay: "morning" | "day" | "evening" | "night";

  // Performance settings
  performanceMode: "low" | "medium" | "high";
  enableParticles: boolean;
  enablePostProcessing: boolean;

  // Camera settings
  cameraAutoRotate: boolean;
  cameraDistance: number;
  cameraHeight: number;

  // Interaction tracking
  interactionCount: number;

  // Actions
  setMode: (mode: "developer" | "designer" | "creative") => void;
  setTimeOfDay: (time: "morning" | "day" | "evening" | "night") => void;
  setPerformanceMode: (mode: "low" | "medium" | "high") => void;
  toggleParticles: () => void;
  togglePostProcessing: () => void;
  toggleCameraAutoRotate: () => void;
  setCameraDistance: (distance: number) => void;
  setCameraHeight: (height: number) => void;
  resetCamera: () => void;
  incrementInteraction: () => void;
}

export const useHeroStore = create<HeroState>((set) => ({
  // Initial state
  mode: "developer",
  timeOfDay: "day",
  performanceMode: "medium",
  enableParticles: true,
  enablePostProcessing: true,
  cameraAutoRotate: false,
  cameraDistance: 5,
  cameraHeight: 1.5,
  interactionCount: 0,

  // Actions
  setMode: (mode) => set({ mode }),
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  setPerformanceMode: (performanceMode) => set({ performanceMode }),
  toggleParticles: () =>
    set((state) => ({ enableParticles: !state.enableParticles })),
  togglePostProcessing: () =>
    set((state) => ({ enablePostProcessing: !state.enablePostProcessing })),
  toggleCameraAutoRotate: () =>
    set((state) => ({ cameraAutoRotate: !state.cameraAutoRotate })),
  setCameraDistance: (cameraDistance) => set({ cameraDistance }),
  setCameraHeight: (cameraHeight) => set({ cameraHeight }),
  resetCamera: () =>
    set({ cameraDistance: 5, cameraHeight: 1.5, cameraAutoRotate: false }),
  incrementInteraction: () =>
    set((state) => ({ interactionCount: state.interactionCount + 1 })),
}));
