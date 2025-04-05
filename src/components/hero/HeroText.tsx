import { useRef, useEffect } from "react";
import { Text3D, useMatcapTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { useHeroStore } from "@/hooks/useHero";

interface HeroTextProps {
  mode: "developer" | "designer" | "creative";
}

export function HeroText({ mode }: HeroTextProps) {
  const textRef = useRef<THREE.Group>(null);
  const { timeOfDay } = useHeroStore();

  // Load matcap texture for metallic text
  const [matcapTexture] = useMatcapTexture(
    mode === "developer"
      ? "3E2335_D36A1B_8E4A2E_2842A5"
      : mode === "designer"
      ? "D5C3A0_92765C_B59B64_C1A578"
      : "C8D1DC_575B62_818892_6E747B", // creative mode
    1024
  );

  // Spring animation for text based on mode
  const textSpring = useSpring({
    scale: [1, 1, 1],
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    config: { mass: 2, tension: 200, friction: 30 },
    from: {
      scale: [0, 0, 0],
      position: [0, -1, 0],
      rotation: [0, -Math.PI, 0],
    },
    reset: true,
    delay: 300,
  });

  // Get text content based on mode
  const getText = () => {
    switch (mode) {
      case "developer":
        return "DEVELOPER";
      case "designer":
        return "DESIGNER";
      case "creative":
        return "CREATIVE";
    }
  };

  // Subtle floating animation
  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y =
        0.5 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      textRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  // Update material based on time of day
  useEffect(() => {
    if (textRef.current) {
      textRef.current.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshMatcapMaterial
        ) {
          // Adjust material properties based on time of day
          if (timeOfDay === "night") {
            child.material.emissive = new THREE.Color(
              mode === "developer"
                ? "#3080ff"
                : mode === "designer"
                ? "#ff3080"
                : "#8B5CF6"
            );
            child.material.emissiveIntensity = 0.5;
          } else {
            child.material.emissive = new THREE.Color("#000000");
            child.material.emissiveIntensity = 0;
          }
        }
      });
    }
  }, [timeOfDay, mode]);

  return (
    <animated.group ref={textRef} {...textSpring}>
      <Text3D
        font="/fonts/inter_bold.json"
        size={0.5}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
        position={[-2, 0, 0]} // Adjust based on text length
      >
        {getText()}
        <meshMatcapMaterial matcap={matcapTexture} transparent opacity={0.9} />
      </Text3D>
    </animated.group>
  );
}

