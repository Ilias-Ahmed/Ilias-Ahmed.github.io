import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BackgroundParticlesProps {
  offset: THREE.Vector3;
  interactionIntensity?: number;
  density?: number;
  primaryColor: string;
  secondaryColor: string;
}

// A simplified particle system for low-performance devices
const BackgroundParticles = ({
  offset,
  interactionIntensity = 0.2,
  density = 800,
  primaryColor = "#8B5CF6",
  secondaryColor = "#C4B5FD",
}: BackgroundParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Create geometry with particles
  const { geometry } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(density * 3);
    const colors = new Float32Array(density * 3);
    const sizes = new Float32Array(density);
    const colorObj1 = new THREE.Color(primaryColor);
    const colorObj2 = new THREE.Color(secondaryColor);

    for (let i = 0; i < density; i++) {
      // Position particles in a sphere
      const radius = 5 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Mix colors
      const mixFactor = Math.random();
      colors[i * 3] = colorObj1.r * (1 - mixFactor) + colorObj2.r * mixFactor;
      colors[i * 3 + 1] =
        colorObj1.g * (1 - mixFactor) + colorObj2.g * mixFactor;
      colors[i * 3 + 2] =
        colorObj1.b * (1 - mixFactor) + colorObj2.b * mixFactor;

      // Random sizes
      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    return { geometry, colorArray: colors };
  }, [density, primaryColor, secondaryColor]);

  // Material for particles
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
  }, []);

  // Animation loop
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const time = clock.getElapsedTime();

    // Gentle rotation
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = Math.sin(time * 0.025) * 0.1;

    // Apply offset from mouse movement
    pointsRef.current.position.x = offset.x * interactionIntensity;
    pointsRef.current.position.y = offset.y * interactionIntensity;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

export default BackgroundParticles;
