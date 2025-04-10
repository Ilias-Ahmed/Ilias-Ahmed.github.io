import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import FloatingErrorCode from "./FloatingErrorCode";
import ReactiveDistortSphere from "./ReactiveDistortSphere";
import DigitalGrid from "./DigitalGrid";
import Effects from "./Effects";

interface Scene3DProps {
  isGlitching: boolean;
  mousePosition: [number, number] | null;
}

const Scene3D: React.FC<Scene3DProps> = ({ isGlitching, mousePosition }) => {
  try {
    return (
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight
          position={[-10, -10, -10]}
          color="#EC4899"
          intensity={0.5}
        />

        <Suspense fallback={null}>
          <FloatingErrorCode isGlitching={isGlitching} />
          <ReactiveDistortSphere
            mousePosition={mousePosition}
            isGlitching={isGlitching}
          />
          <DigitalGrid />
          <Environment preset="city" />
          <Effects isGlitching={isGlitching} />
        </Suspense>
      </Canvas>
    );
  } catch (error) {
    console.error("Error rendering 3D scene:", error);
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="text-4xl font-bold">404</div>
      </div>
    );
  }
};

export default Scene3D;
