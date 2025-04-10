import { useRef, useState, useEffect, useMemo } from "react";
import ErrorBoundaryWrapper from "@/components/ui/ErrorBoundary";
import { useSpring } from "@react-spring/web";
import { useMove } from "@use-gesture/react";
import { useTheme } from "@/contexts/ThemeContext";
import { useHeroStore } from "@/hooks/useHero";
import CanvasBackground from "./CanvasBackground";

// Performance detection utility
const detectPerformanceLevel = (): "high" | "medium" | "low" => {
  if (typeof window === "undefined") return "medium";

  // Check for mobile devices
  if (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return "low";
  }

  // Simple performance detection based on device memory if available
  if ("deviceMemory" in navigator) {
    const deviceMemory = (navigator as Navigator & { deviceMemory: number })
      .deviceMemory;
    if (deviceMemory <= 2) return "low";
    if (deviceMemory <= 6) return "medium";
    return "high";
  }

  // Default to medium as a safe option
  return "medium";
};

const DynamicBackground = () => {
  const { theme, accent = "purple" } = useTheme();
  const { mode = "developer", performanceMode: storePerformanceMode } =
    useHeroStore();
  const [autoDetectedPerformance, setAutoDetectedPerformance] = useState<
    "high" | "medium" | "low"
  >("medium");
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0.5, y: 0.5 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [useThreeJS, setUseThreeJS] = useState(false);
  const [threeJSFailed, setThreeJSFailed] = useState(false);
  const [ThreeJSBackground, setThreeJSBackground] =
    useState<React.ComponentType<{ theme: string; mode: string; performanceLevel: string; x: number; y: number }> | null>(null);

  // Use store performance mode if set, otherwise use auto-detected
  const performanceLevel = storePerformanceMode || autoDetectedPerformance;

  // Container ref for gesture binding
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse movement for parallax effect
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  // Detect device capabilities - only run once
  useEffect(() => {
    const performance = detectPerformanceLevel();
    setAutoDetectedPerformance(performance);

    // Delay initialization to ensure smooth loading
    const timer = setTimeout(() => {
      setIsInitialized(true);

      // Only try to load Three.js if we're on the client
      if (typeof window !== "undefined") {
        // Dynamically import ThreeJSBackground
        import("./ThreeJSBackground")
          .then((module) => {
            setThreeJSBackground(() => (props: { theme: string; mode: string; performanceLevel: string; x: number; y: number }) => {
              const Component = module.default as React.ComponentType<{ theme: string; mode: string; performanceLevel: string; x: { get: () => number }; y: { get: () => number } }>;
              return <Component {...props} x={{ get: () => props.x }} y={{ get: () => props.y }} />;
            });
            setUseThreeJS(true);
          })
          .catch((err) => {
            console.error("Failed to load Three.js background:", err);
            setThreeJSFailed(true);
          });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Use gesture to track mouse movement - optimized to reduce updates
  const bind = useMove(
    ({ xy: [px, py] }) => {
      if (!containerRef.current) return;

      const x = (px / window.innerWidth) * 2 - 1;
      const y = -(py / window.innerHeight) * 2 + 1;
      api.start({ x, y });

      // Update hover position for glow effect
      setHoverPosition({
        x: px / window.innerWidth,
        y: py / window.innerHeight,
      });
    },
    {
      // Add throttling to reduce updates
      eventOptions: { passive: true },
      delay:
        performanceLevel === "low"
          ? 100
          : performanceLevel === "medium"
          ? 50
          : 16,
    }
  );

  // Get background gradient based on theme and accent - memoized
  const backgroundStyles = useMemo(() => {
    const accentColors = {
      purple: { dark: "#1E1B4B", light: "#EDE9FE", glow: "#8B5CF6" },
      blue: { dark: "#172554", light: "#E0F2FE", glow: "#3B82F6" },
      green: { dark: "#064E3B", light: "#ECFDF5", glow: "#10B981" },
      amber: { dark: "#78350F", light: "#FEF3C7", glow: "#F59E0B" },
      pink: { dark: "#831843", light: "#FCE7F3", glow: "#EC4899" },
    };

    // Get colors based on accent or fallback to purple
    const colorObj =
      accentColors[accent as keyof typeof accentColors] || accentColors.purple;

    // Mode-specific colors
    const modeColors = {
      developer: { glow: "#3080ff" },
      designer: { glow: "#ff3080" },
      creative: { glow: "#8B5CF6" },
    };

    // Use mode-specific glow color if available
    const glowColor =
      (mode && modeColors[mode as keyof typeof modeColors]?.glow) ||
      colorObj.glow;

    const baseColor = theme === "dark" ? colorObj.dark : colorObj.light;
    const secondaryColor = theme === "dark" ? "#000000" : "#FFFFFF";

    // Create a dynamic radial gradient based on mouse position
    const gradientX = isHovering ? hoverPosition.x * 100 : 50;
    const gradientY = isHovering ? hoverPosition.y * 100 : 50;

    return {
      background:
        theme === "dark"
          ? `radial-gradient(circle at ${gradientX}% ${gradientY}%, ${baseColor} 0%, ${secondaryColor} 100%)`
          : `radial-gradient(circle at ${gradientX}% ${gradientY}%, ${secondaryColor} 0%, ${baseColor} 100%)`,
      backgroundBlendMode: "multiply",
      boxShadow: isHovering
        ? `inset 0 0 100px ${glowColor}40, 0 0 50px ${glowColor}20`
        : "none",
      transition: "box-shadow 0.5s ease-out",
    };
  }, [theme, accent, mode, isHovering, hoverPosition.x, hoverPosition.y]);

  return (
    <div
      ref={containerRef}
      {...bind()}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={backgroundStyles}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Always render the background with accent color */}
      <div
        className="absolute inset-0 w-full h-full"
        style={backgroundStyles}
      />

      {/* Render Canvas background as fallback */}
      {(threeJSFailed || performanceLevel === "low") && isInitialized && (
        <CanvasBackground mousePosition={hoverPosition} />
      )}

      {/* Render Three.js background only if initialized and available */}
      {isInitialized && useThreeJS && ThreeJSBackground && !threeJSFailed && (
        <ErrorBoundaryWrapper
          fallback={<div className="hidden">ThreeJS failed</div>}
        >
          <ThreeJSBackground
            theme={theme}
            mode={mode}
            performanceLevel={performanceLevel}
            x={x.get()}
            y={y.get()}
          />
        </ErrorBoundaryWrapper>
      )}

      {/* Optional foreground noise texture - only on medium/high */}
      {performanceLevel !== "low" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/noise.png')",
            backgroundRepeat: "repeat",
            opacity: theme === "dark" ? 0.03 : 0.02,
            mixBlendMode: theme === "dark" ? "overlay" : "multiply",
          }}
        />
      )}
    </div>
  );
};

export default DynamicBackground;
