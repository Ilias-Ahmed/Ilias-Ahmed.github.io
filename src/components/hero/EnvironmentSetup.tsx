import { useEffect } from "react";
import { Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useHeroStore } from "@/hooks/useHero";

export function EnvironmentSetup() {
  const { scene } = useThree();
  const { timeOfDay, performanceMode } = useHeroStore();

  // Set up scene environment
  useEffect(() => {
    // Background color based on time of day
    let bgColor;
    switch (timeOfDay) {
      case "morning":
        bgColor = new THREE.Color("#ffeedd");
        break;
      case "day":
        bgColor = new THREE.Color("#87ceeb");
        break;
      case "evening":
        bgColor = new THREE.Color("#ff7e33");
        break;
      case "night":
        bgColor = new THREE.Color("#050520");
        break;
      default:
        bgColor = new THREE.Color("#87ceeb");
    }

    scene.background = bgColor;
    scene.fog = new THREE.Fog(
      bgColor,
      performanceMode === "low" ? 5 : 8,
      performanceMode === "low" ? 12 : 20
    );

    return () => {
      scene.fog = null;
    };
  }, [scene, timeOfDay, performanceMode]);

  // Get environment preset based on time of day
  const getEnvironmentPreset = () => {
    switch (timeOfDay) {
      case "morning":
        return "dawn";
      case "day":
        return "park";
      case "evening":
        return "sunset";
      case "night":
        return "night";
      default:
        return "park";
    }
  };

  return (
    <>
      {/* Main directional light */}
      <directionalLight
        position={[
          timeOfDay === "morning"
            ? 5
            : timeOfDay === "day"
            ? 10
            : timeOfDay === "evening"
            ? -5
            : 0,

          timeOfDay === "morning"
            ? 5
            : timeOfDay === "day"
            ? 10
            : timeOfDay === "evening"
            ? 3
            : 0.5,

          timeOfDay === "morning"
            ? 5
            : timeOfDay === "day"
            ? 5
            : timeOfDay === "evening"
            ? 5
            : 5,
        ]}
        intensity={
          timeOfDay === "morning"
            ? 1
            : timeOfDay === "day"
            ? 1.5
            : timeOfDay === "evening"
            ? 0.8
            : 0.2
        }
        color={
          timeOfDay === "morning"
            ? "#ffedcc"
            : timeOfDay === "day"
            ? "#ffffff"
            : timeOfDay === "evening"
            ? "#ff9966"
            : "#3344ff"
        }
        castShadow={performanceMode !== "low"}
        shadow-mapSize={[
          performanceMode === "low"
            ? 512
            : performanceMode === "medium"
            ? 1024
            : 2048,
          performanceMode === "low"
            ? 512
            : performanceMode === "medium"
            ? 1024
            : 2048,
        ]}
      />

      {/* Ambient light */}
      <ambientLight
        intensity={
          timeOfDay === "morning"
            ? 0.5
            : timeOfDay === "day"
            ? 0.7
            : timeOfDay === "evening"
            ? 0.4
            : 0.2
        }
        color={
          timeOfDay === "morning"
            ? "#ffedcc"
            : timeOfDay === "day"
            ? "#ffffff"
            : timeOfDay === "evening"
            ? "#ff9966"
            : "#3344ff"
        }
      />

      {/* Environment for reflections */}
      <Environment preset={getEnvironmentPreset()} background={false} />
    </>
  );
}
