import React, { useRef, useState } from "react";
import { Sphere } from "@react-three/drei";
import { MeshDistortMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ReactiveDistortSphereProps {
  mousePosition: [number, number] | null;
  isGlitching: boolean;
}

const ReactiveDistortSphere: React.FC<ReactiveDistortSphereProps> = ({
  mousePosition,
  isGlitching,
}) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState<[number, number, number]>([
    0, 0, -2,
  ]);

  useFrame(() => {
    if (!meshRef.current || !mousePosition) return;

    const targetX = (mousePosition[0] || 0) / 5;
    const targetY = (mousePosition[1] || 0) / 5;

    setPosition((prev) => [
      THREE.MathUtils.lerp(prev[0], targetX, 0.1),
      THREE.MathUtils.lerp(prev[1], targetY, 0.1),
      prev[2],
    ]);
  });

  return (
    <Sphere
      args={[1, 64, 64]}
      position={position}
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <MeshDistortMaterial
        color="#EC4899"
        envMapIntensity={0.8}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
        metalness={0.9}
        distort={hovered ? 0.6 : 0.3}
        speed={isGlitching ? 5 : 2}
      />
    </Sphere>
  );
};

export default ReactiveDistortSphere;
