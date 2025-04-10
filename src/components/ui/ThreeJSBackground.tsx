import { useRef, useMemo, useEffect, memo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useHeroStore } from "@/hooks/useHero";
import { useTheme } from "@/contexts/ThemeContext";
import { ParticleField } from "@/components/ParticleField";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import BackgroundParticles from "./BackgroundParticles";

interface ThreeJSBackgroundProps {
  theme: string;
  mode: string;
  performanceLevel: "high" | "medium" | "low";
  x: { get: () => number };
  y: { get: () => number };
}

// Camera controller to handle mouse movement
const CameraController = ({
  x,
  y,
}: {
  x: { get: () => number };
  y: { get: () => number };
}) => {
  const { camera } = useThree();

  useEffect(() => {
    const handleMouseMove = () => {
      // Apply subtle camera movement based on mouse position
      camera.position.x = x.get() * 0.5;
      camera.position.y = y.get() * 0.5;
    };

    // Set up animation frame
    let frameId: number;
    const animate = () => {
      handleMouseMove();
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [camera, x, y]);

  return null;
};

// Post-processing effects component
const PostProcessingEffects = memo(
  ({ enabled, theme }: { enabled: boolean; theme: string }) => {
    if (!enabled) return null;

    return (
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={0.8}
        />
        <Vignette
          eskil={false}
          offset={0.1}
          darkness={theme === "dark" ? 0.7 : 0.5}
        />
      </EffectComposer>
    );
  }
);

const ThreeJSBackground = ({
  theme,
  mode,
  performanceLevel,
  x,
  y,
}: ThreeJSBackgroundProps) => {
  const { enableParticles, enablePostProcessing } = useHeroStore();
  const { accent } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Properly memoize the offset vector to prevent unnecessary recreations
  const offsetVector = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    // Update offset vector when x or y changes
    offsetVector.set(x.get(), y.get(), 0);
  }, [offsetVector, x, y]);

  // Get accent color based on theme and accent
  const accentColors = useMemo(() => {
    const colors = {
      purple: { primary: "#8B5CF6", secondary: "#C4B5FD" },
      blue: { primary: "#3B82F6", secondary: "#93C5FD" },
      green: { primary: "#10B981", secondary: "#6EE7B7" },
      amber: { primary: "#F59E0B", secondary: "#FCD34D" },
      pink: { primary: "#EC4899", secondary: "#F9A8D4" },
    };

    // Mode-specific colors
    const modeColors = {
      developer: { primary: "#3080ff", secondary: "#93C5FD" },
      designer: { primary: "#ff3080", secondary: "#F9A8D4" },
      creative: { primary: "#8B5CF6", secondary: "#C4B5FD" },
    };

    // Use mode-specific colors if available, otherwise use accent colors
    if (Object.prototype.hasOwnProperty.call(modeColors, mode)) {
      return modeColors[mode as keyof typeof modeColors];
    }

    return accent in colors
      ? colors[accent as keyof typeof colors]
      : colors.purple;
  }, [accent, mode]);

  // Memoize particle density to prevent recalculation
  const particleDensity = useMemo(() => {
    switch (performanceLevel) {
      case "high":
        return 3000;
      case "medium":
        return 1500;
      case "low":
        return 800;
      default:
        return 1500;
    }
  }, [performanceLevel]);

  // If particles are disabled, return early
  if (!enableParticles) {
    return null;
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, performanceLevel === "low" ? 1 : 2]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        <CameraController x={x} y={y} />
        <ambientLight intensity={0.5} />
        <fog
          attach="fog"
          args={[theme === "dark" ? "#000000" : "#ffffff", 15, 30]}
        />

        {/* Use the appropriate particle system based on performance level */}
        {performanceLevel === "low" ? (
          <BackgroundParticles
            offset={offsetVector}
            interactionIntensity={0.2}
            density={particleDensity * 0.5}
            primaryColor={accentColors.primary}
            secondaryColor={accentColors.secondary}
          />
        ) : (
          <ParticleField
            offset={{ get: () => [offsetVector.x, offsetVector.y] }}
            density={particleDensity}
            noiseIntensity={mode === "creative" ? 0.12 : 0.08}
            waveSpeed={mode === "creative" ? 0.8 : 0.5}
            interactionStrength={mode === "creative" ? 0.5 : 0.3}
            primaryColor={accentColors.primary}
            secondaryColor={accentColors.secondary}
          />
        )}

        {/* Add post-processing effects if enabled and not on low performance */}
        {performanceLevel !== "low" && (
          <PostProcessingEffects enabled={enablePostProcessing} theme={theme} />
        )}
      </Canvas>
    </div>
  );
};

// Add memo to prevent unnecessary re-renders
export default memo(ThreeJSBackground);
