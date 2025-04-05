import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Loader } from "@react-three/drei";
import ParticleField from "../ParticleField";

interface ThreeJSBackgroundProps {
  theme: string;
  mode: string;
  performanceLevel: "high" | "medium" | "low";
  x: { get: () => number };
  y: { get: () => number };
}

// Scene content component
function SceneContent({
  theme,
  mode,
  performanceLevel,
  x,
  y,
}: ThreeJSBackgroundProps) {
  // Configure particle density based on performance
  const particleDensity = useMemo(() => {
    if (performanceLevel === "high") return 2500;
    if (performanceLevel === "medium") return 1500;
    return 800; // Low performance
  }, [performanceLevel]);

  // Determine color based on mode
  const lightColor = useMemo(() => {
    switch (mode) {
      case "developer":
        return "#3080ff";
      case "designer":
        return "#ff3080";
      default:
        return "#8B5CF6";
    }
  }, [mode]);

  return (
    <>
      {/* Ambient light for the scene */}
      <ambientLight intensity={theme === "dark" ? 0.3 : 0.5} />

      {/* Subtle directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={theme === "dark" ? 0.5 : 0.7}
        color={lightColor}
      />

      {/* Environment for reflections - only on medium/high */}
      {performanceLevel !== "low" && (
        <Environment preset={theme === "dark" ? "night" : "city"} />
      )}

      {/* Main particle field */}
      <ParticleField
        offset={{ get: () => [x.get(), y.get()] }}
        density={particleDensity}
        interactionRadius={performanceLevel === "high" ? 3.0 : 2.0}
        interactionStrength={performanceLevel === "high" ? 0.5 : 0.3}
        noiseIntensity={performanceLevel === "high" ? 0.08 : 0.05}
        waveSpeed={performanceLevel === "high" ? 0.5 : 0.3}
      />
    </>
  );
}

const ThreeJSBackground = (props: ThreeJSBackgroundProps) => {
  const { performanceLevel, theme } = props;

  // Memoize canvas props to prevent unnecessary re-renders
  const canvasProps = useMemo(
    () => ({
      camera: { position: [0, 0, 15], fov: 50 },
      dpr: [
        1,
        performanceLevel === "high"
          ? 2
          : performanceLevel === "medium"
          ? 1.5
          : 1,
      ],
      gl: {
        antialias: performanceLevel !== "low",
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      },
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      },
    }),
    [performanceLevel]
  );

  return (
    <>
      <Canvas {...canvasProps}>
        <Suspense fallback={null}>
          <SceneContent {...props} />
        </Suspense>
      </Canvas>

      <Loader
        containerStyles={{
          background: "transparent",
          zIndex: 1000,
        }}
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
        dataStyles={{
          color: theme === "dark" ? "#ffffff" : "#000000",
          fontSize: "0.8rem",
          fontFamily: "monospace",
        }}
      />
    </>
  );
};

export default ThreeJSBackground;
