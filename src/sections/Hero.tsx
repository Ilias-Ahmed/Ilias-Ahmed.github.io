import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "@/components/hero/Scene";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized coordinates (-1 to 1)
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      id="hero"
      className="w-full h-screen">
      <Canvas shadows>
        <Scene mousePosition={mousePosition} />
      </Canvas>
    </section>
  );
}
