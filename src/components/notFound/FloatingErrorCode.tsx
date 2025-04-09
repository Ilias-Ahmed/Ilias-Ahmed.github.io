import React, { useRef } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

interface FloatingErrorCodeProps {
  isGlitching: boolean;
}

const FloatingErrorCode: React.FC<FloatingErrorCodeProps> = ({
  isGlitching,
}) => {
  const textRef = useRef<THREE.Mesh | null>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!textRef.current) return;

    const time = state.clock.getElapsedTime();
    textRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    textRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    textRef.current.rotation.z = Math.cos(time * 0.2) * 0.05;

    // Apply glitch effect
    if (isGlitching) {
      textRef.current.position.x += (Math.random() - 0.5) * 0.1;
      textRef.current.position.y += (Math.random() - 0.5) * 0.1;
    }
  });

  return (
    <Text
      ref={textRef}
      position={[0, 0, 0]}
      fontSize={viewport.width / 12}
      color="#f0f0f0"
      font="/fonts/Orbitron-Bold.ttf"
      letterSpacing={0.1}
      textAlign="center"
    >
      404
      <meshStandardMaterial
        color="#8B5CF6"
        emissive="#8B5CF6"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </Text>
  );
};

export default FloatingErrorCode;
