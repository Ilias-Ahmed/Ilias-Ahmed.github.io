import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export type BackgroundMode =
  | "adaptive"
  | "particles"
  | "neural"
  | "hologram"
  | "matrix"
  | "minimal";

export type IntensityLevel = "low" | "medium" | "high";
export type PerformanceMode = "auto" | "high" | "low";

export interface BackgroundConfig {
  mode: BackgroundMode;
  intensity: IntensityLevel;
  performanceMode: PerformanceMode;
  enableInteractivity: boolean;
  enableAudioVisualization: boolean;
  enableParallax: boolean;
  adaptToSection: boolean;
  opacity: number;
  particleCount: number;
  animationSpeed: number;
}

export interface BackgroundContextType {
  config: BackgroundConfig;
  currentSection: string;
  backgroundOpacity: number;
  isPerformanceMode: boolean;
  updateConfig: (updates: Partial<BackgroundConfig>) => void;
  setCurrentSection: (section: string) => void;
  setBackgroundOpacity: (opacity: number) => void;
  resetToDefaults: () => void;
  getOptimizedConfig: () => BackgroundConfig;
}

const DEFAULT_CONFIG: BackgroundConfig = {
  mode: "adaptive",
  intensity: "medium",
  performanceMode: "auto",
  enableInteractivity: true,
  enableAudioVisualization: true,
  enableParallax: true,
  adaptToSection: true,
  opacity: 0.8,
  particleCount: 100,
  animationSpeed: 1,
};

const MOBILE_CONFIG: Partial<BackgroundConfig> = {
  mode: "minimal",
  intensity: "low",
  performanceMode: "low",
  enableInteractivity: false,
  enableAudioVisualization: false,
  enableParallax: false,
  particleCount: 30,
  animationSpeed: 0.5,
};

const LOW_PERFORMANCE_CONFIG: Partial<BackgroundConfig> = {
  intensity: "low",
  enableInteractivity: false,
  enableAudioVisualization: false,
  enableParallax: false,
  particleCount: 50,
  animationSpeed: 0.7,
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined
);

export function useBackground(): BackgroundContextType {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}

interface BackgroundProviderProps {
  children: ReactNode;
  defaultConfig?: Partial<BackgroundConfig>;
}

export function BackgroundProvider({
  children,
  defaultConfig = {},
}: BackgroundProviderProps): React.ReactElement {
  const isMobile = useIsMobile();

  const [config, setConfig] = useState<BackgroundConfig>(() => {
    if (typeof window === "undefined") {
      return { ...DEFAULT_CONFIG, ...defaultConfig };
    }

    const savedConfig = localStorage.getItem("background-config");
    let parsedConfig: Partial<BackgroundConfig> = {};

    if (savedConfig) {
      try {
        parsedConfig = JSON.parse(savedConfig);
      } catch (error) {
        console.warn("Failed to parse saved background config:", error);
      }
    }

    let finalConfig = { ...DEFAULT_CONFIG, ...parsedConfig, ...defaultConfig };

    if (isMobile) {
      finalConfig = { ...finalConfig, ...MOBILE_CONFIG };
    }

    return finalConfig;
  });

  const [currentSection, setCurrentSectionState] = useState<string>("home");
  const [backgroundOpacity, setBackgroundOpacityState] = useState<number>(0.8);
  const [isPerformanceMode, setIsPerformanceMode] = useState<boolean>(false);

  useEffect(() => {
    if (config.performanceMode !== "auto") return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const monitorPerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const shouldOptimize = fps < 30 || (isMobile && fps < 45);

        if (shouldOptimize !== isPerformanceMode) {
          setIsPerformanceMode(shouldOptimize);

          if (shouldOptimize) {
            setConfig((prev) => ({
              ...prev,
              ...LOW_PERFORMANCE_CONFIG,
            }));
          }
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrame = requestAnimationFrame(monitorPerformance);
    };

    animationFrame = requestAnimationFrame(monitorPerformance);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [config.performanceMode, isMobile, isPerformanceMode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("background-config", JSON.stringify(config));
    }
  }, [config]);

  const updateConfig = useCallback((updates: Partial<BackgroundConfig>) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };

      if (newConfig.opacity < 0) newConfig.opacity = 0;
      if (newConfig.opacity > 1) newConfig.opacity = 1;
      if (newConfig.particleCount < 10) newConfig.particleCount = 10;
      if (newConfig.particleCount > 500) newConfig.particleCount = 500;
      if (newConfig.animationSpeed < 0.1) newConfig.animationSpeed = 0.1;
      if (newConfig.animationSpeed > 3) newConfig.animationSpeed = 3;

      return newConfig;
    });
  }, []);

  const setCurrentSection = useCallback(
    (section: string) => {
      setCurrentSectionState(section);

      if (config.adaptToSection) {
        const sectionAdaptations: Record<string, Partial<BackgroundConfig>> = {
          home: { intensity: "high", opacity: 0.9 },
          about: { intensity: "low", opacity: 0.6 },
          skills: { intensity: "medium", opacity: 0.8 },
          projects: { intensity: "high", opacity: 0.9 },
          contact: { intensity: "medium", opacity: 0.7 },
        };

        const adaptation = sectionAdaptations[section];
        if (adaptation) {
          updateConfig(adaptation);
        }
      }
    },
    [config.adaptToSection, updateConfig]
  );

  const setBackgroundOpacity = useCallback(
    (opacity: number) => {
      const clampedOpacity = Math.max(0, Math.min(1, opacity));
      setBackgroundOpacityState(clampedOpacity);
      updateConfig({ opacity: clampedOpacity });
    },
    [updateConfig]
  );

  const resetToDefaults = useCallback(() => {
    const resetConfig = isMobile
      ? { ...DEFAULT_CONFIG, ...MOBILE_CONFIG }
      : DEFAULT_CONFIG;

    setConfig(resetConfig);
    setBackgroundOpacityState(resetConfig.opacity);
    setIsPerformanceMode(false);

    if (typeof window !== "undefined") {
      localStorage.removeItem("background-config");
    }
  }, [isMobile]);

  const getOptimizedConfig = useCallback((): BackgroundConfig => {
    let optimizedConfig = { ...config };

    if (isPerformanceMode || config.performanceMode === "low") {
      optimizedConfig = { ...optimizedConfig, ...LOW_PERFORMANCE_CONFIG };
    }

    if (isMobile && config.performanceMode === "auto") {
      optimizedConfig = { ...optimizedConfig, ...MOBILE_CONFIG };
    }

    return optimizedConfig;
  }, [config, isPerformanceMode, isMobile]);

  const contextValue = useMemo(
    (): BackgroundContextType => ({
      config: getOptimizedConfig(),
      currentSection,
      backgroundOpacity,
      isPerformanceMode,
      updateConfig,
      setCurrentSection,
      setBackgroundOpacity,
      resetToDefaults,
      getOptimizedConfig,
    }),
    [
      getOptimizedConfig,
      currentSection,
      backgroundOpacity,
      isPerformanceMode,
      updateConfig,
      setCurrentSection,
      setBackgroundOpacity,
      resetToDefaults,
    ]
  );

  return (
    <BackgroundContext.Provider value={contextValue}>
      {children}
    </BackgroundContext.Provider>
  );
}
