import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

type PerformanceLevel = "high" | "medium" | "low";

interface PerformanceContextType {
  performanceLevel: PerformanceLevel;
  isLowPerformance: boolean;
  isMobile: boolean;
  fps: number;
  setPerformanceLevel: (level: PerformanceLevel) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(
  undefined
);

export const PerformanceProvider = ({ children }: { children: ReactNode }) => {
  const [performanceLevel, setPerformanceLevel] =
    useState<PerformanceLevel>("high");
  const [isMobile, setIsMobile] = useState(false);
  const [fps, setFps] = useState(60);
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  // Detect device capabilities
  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);

      // Auto-set performance level based on device
      if (mobile) {
        setPerformanceLevel("low");
      } else {
        // Check GPU capabilities
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl");

        if (!gl) {
          setPerformanceLevel("low");
          return;
        }

        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

          // Check for integrated GPUs or mobile GPUs
          if (
            renderer.includes("Intel") ||
            renderer.includes("AMD Radeon(TM)") ||
            renderer.includes("Mali") ||
            renderer.includes("Adreno")
          ) {
            setPerformanceLevel("medium");
          } else {
            setPerformanceLevel("high");
          }
        }
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Monitor FPS
  useEffect(() => {
    let animationFrameId: number;

    const measureFps = (timestamp: number) => {
      setFrameCount((prev) => prev + 1);

      // Calculate FPS every second
      if (timestamp - lastTime >= 1000) {
        setFps(frameCount);
        setFrameCount(0);
        setLastTime(timestamp);

        // Auto-adjust performance level based on FPS
        if (fps < 30 && performanceLevel !== "low") {
          setPerformanceLevel("low");
        } else if (fps >= 30 && fps < 50 && performanceLevel === "high") {
          setPerformanceLevel("medium");
        }
      }

      animationFrameId = requestAnimationFrame(measureFps);
    };

    animationFrameId = requestAnimationFrame(measureFps);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [frameCount, lastTime, fps, performanceLevel]);

  const isLowPerformance = performanceLevel === "low";

  return (
    <PerformanceContext.Provider
      value={{
        performanceLevel,
        isLowPerformance,
        isMobile,
        fps,
        setPerformanceLevel,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};
