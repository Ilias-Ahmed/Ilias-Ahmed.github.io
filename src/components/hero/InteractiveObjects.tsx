import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useHeroStore } from "@/hooks/useHero";
import { Html } from "@react-three/drei";

export function InteractiveObjects() {
  const { mode, incrementInteraction } = useHeroStore();
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  // Define interactive objects based on mode
  const getObjects = () => {
    switch (mode) {
      case "developer":
        return [
          {
            id: "code",
            position: [2, 0, 1],
            icon: "</>",
            label: "Code",
            color: "#3080ff",
          },
          {
            id: "database",
            position: [-2, 0, 1],
            icon: "🗄️",
            label: "Database",
            color: "#22c55e",
          },
          {
            id: "api",
            position: [0, 1.5, 1],
            icon: "API",
            label: "REST API",
            color: "#f59e0b",
          },
        ];
      case "designer":
        return [
          {
            id: "ui",
            position: [2, 0, 1],
            icon: "🎨",
            label: "UI Design",
            color: "#ff3080",
          },
          {
            id: "ux",
            position: [-2, 0, 1],
            icon: "👤",
            label: "UX Research",
            color: "#8b5cf6",
          },
          {
            id: "prototype",
            position: [0, 1.5, 1],
            icon: "📱",
            label: "Prototyping",
            color: "#f59e0b",
          },
        ];
      case "creative":
        return [
          {
            id: "3d",
            position: [2, 0, 1],
            icon: "🧊",
            label: "3D Modeling",
            color: "#8b5cf6",
          },
          {
            id: "animation",
            position: [-2, 0, 1],
            icon: "🎬",
            label: "Animation",
            color: "#22c55e",
          },
          {
            id: "vfx",
            position: [0, 1.5, 1],
            icon: "✨",
            label: "Visual Effects",
            color: "#3080ff",
          },
        ];
    }
  };

  // Animate objects on mode change
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        // Animate each object with a staggered delay
        const delay = index * 200;

        // Reset position and scale
        child.position.y -= 2;
        child.scale.set(0.1, 0.1, 0.1);

        // Animate to final position
        setTimeout(() => {
          const targetPosition = getObjects()[index]?.position || [0, 0, 0];

          // Simple animation using requestAnimationFrame for better performance
          let progress = 0;
          const animate = () => {
            progress += 0.05;

            // Ease out cubic
            const t = 1 - Math.pow(1 - progress, 3);

            // Update position and scale
            child.position.y =
              child.position.y + (targetPosition[1] - child.position.y) * t;
            child.scale.x = 0.1 + (1 - 0.1) * t;
            child.scale.y = 0.1 + (1 - 0.1) * t;
            child.scale.z = 0.1 + (1 - 0.1) * t;

            // Continue animation until complete
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          animate();
        }, delay);
      });
    }
  }, [mode]);

  // Floating animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        // Different floating patterns for each object
        const offset = index * 0.5;
        child.position.y +=
          Math.sin(clock.getElapsedTime() * 0.5 + offset) * 0.002;
        child.rotation.y =
          Math.sin(clock.getElapsedTime() * 0.3 + offset) * 0.1;
      });
    }
  });

  // Handle object interaction
  const handleObjectClick = (id: string) => {
    incrementInteraction();

    // Find the clicked object
    const object = groupRef.current?.children.find(
      (child) => child.userData.id === id
    );

    if (object) {
      // Animate the object
      const originalScale = object.scale.clone();
      const originalPosition = object.position.clone();

      // Scale up
      object.scale.multiplyScalar(1.5);

      // Return to original scale after animation
      setTimeout(() => {
        // Animate back to original scale
        let progress = 0;
        const animate = () => {
          progress += 0.05;

          // Ease out cubic
          const t = 1 - Math.pow(1 - progress, 3);

          // Update scale and position
          object.scale.x =
            object.scale.x + (originalScale.x - object.scale.x) * t;
          object.scale.y =
            object.scale.y + (originalScale.y - object.scale.y) * t;
          object.scale.z =
            object.scale.z + (originalScale.z - object.scale.z) * t;

          object.position.x =
            object.position.x + (originalPosition.x - object.position.x) * t;
          object.position.y =
            object.position.y + (originalPosition.y - object.position.y) * t;
          object.position.z =
            object.position.z + (originalPosition.z - object.position.z) * t;

          // Continue animation until complete
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        animate();
      }, 300);
    }
  };

  return (
    <group ref={groupRef}>
      {getObjects().map((obj) => (
        <group
          key={obj.id}
          position={[obj.position[0], obj.position[1], obj.position[2]]}
          userData={{ id: obj.id }}
          onClick={() => handleObjectClick(obj.id)}
          onPointerOver={() => setHoveredObject(obj.id)}
          onPointerOut={() => setHoveredObject(null)}
        >
          {/* Object mesh */}
          <mesh castShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial
              color={obj.color}
              emissive={obj.color}
              emissiveIntensity={0.3}
              metalness={0.8}
              roughness={0.2}
            />

            {/* Icon or text */}
            <Html position={[0, 0, 0.5]} center distanceFactor={10}>
              <div className="text-2xl">{obj.icon}</div>
            </Html>
          </mesh>

          {/* Label - only show when hovered */}
          {hoveredObject === obj.id && (
            <Html position={[0, -0.8, 0]} center distanceFactor={10}>
              <div className="px-3 py-1 bg-black bg-opacity-70 text-white rounded-lg text-sm whitespace-nowrap">
                {obj.label}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}
