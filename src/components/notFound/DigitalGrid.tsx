import React from "react";
import { Plane, useTexture } from "@react-three/drei";
import * as THREE from "three";

const DigitalGrid: React.FC = () => {
  // Handle potential texture loading errors
  const gridTexture = useTexture(
    "/images/grid.png",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  );

  return (
    <Plane
      args={[40, 40]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
    >
      <meshStandardMaterial
        map={gridTexture}
        transparent
        opacity={0.2}
        color="#8B5CF6"
        emissive="#8B5CF6"
        emissiveIntensity={0.5}
      />
    </Plane>
  );
};

export default DigitalGrid;
