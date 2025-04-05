import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/three";
import { useHeroStore } from "@/hooks/useHero";
import { useLenis } from "@/components/SmoothScroll";

interface BackgroundParticlesOptimizedProps {
  offset: THREE.Vector3;
  interactionIntensity?: number;
  density?: number;
}

// This is a performance-optimized version for mobile devices
const BackgroundParticlesOptimized = ({
  offset,
  interactionIntensity = 0.2,
  density = 200,
}: BackgroundParticlesOptimizedProps) => {
  const { mode } = useHeroStore();
  const { lenis } = useLenis();
  const { viewport, mouse } = useThree();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // References for particle groups
  const particlesRef = useRef<THREE.Points>(null);

  // Mouse position in 3D space
  const mousePos = useMemo(() => new THREE.Vector3(), []);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track scroll position
  useEffect(() => {
    if (!lenis) return;

    const onScroll = ({ progress }: { progress: number }) => {
      setScrollProgress(progress);
    };

    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  // Generate particles
  const particles = useMemo(() => {
    const temp = [];
    const actualDensity = isMobile ? density * 0.5 : density;

    for (let i = 0; i < actualDensity; i++) {
      const x = (Math.random() - 0.5) * viewport.width * 2;
      const y = (Math.random() - 0.5) * viewport.height * 2;
      const z = (Math.random() - 0.5) * 5;
      temp.push(x, y, z);
    }

    return new Float32Array(temp);
  }, [viewport, density, isMobile]);

  // Dynamic colors based on mode and scroll position
  const primaryColor = mode === "coder" ? "#3080ff" : "#ff3080";
  const secondaryColor = mode === "coder" ? "#22c55e" : "#ffbb00";

  // Interpolate colors based on scroll progress
  const particleColor = useMemo(() => {
    const color = new THREE.Color(primaryColor);
    const targetColor = new THREE.Color(secondaryColor);
    return color.lerp(targetColor, scrollProgress);
  }, [primaryColor, secondaryColor, scrollProgress]);

  // Spring animation for parallax effect
  const { position } = useSpring({
    position: [offset.get()[0] * 0.1, offset.get()[1] * 0.1, 0],
    config: { mass: 1, tension: 280, friction: 60 },
  });

  // Animation frame updates
  useFrame((state, delta) => {
    // Update mouse position in 3D space
    mousePos.set(
      (mouse.x * viewport.width) / 2,
      (mouse.y * viewport.height) / 2,
      0
    );

    // Animate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
      particlesRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.05) * 0.1;

      // Only do interactive animation on desktop
      if (!isMobile) {
        const positions = particlesRef.current.geometry.attributes.position
          .array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];

          // Calculate distance to mouse
          const dx = mousePos.x - x;
          const dy = mousePos.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Apply force based on mouse proximity
          if (distance < 3) {
            const force = (1 - distance / 3) * interactionIntensity;
            positions[i] += dx * force * delta;
            positions[i + 1] += dy * force * delta;
          }

          // Gentle wave motion
          positions[i] += Math.sin(state.clock.elapsedTime * 0.1 + x) * 0.01;
          positions[i + 1] +=
            Math.cos(state.clock.elapsedTime * 0.1 + y) * 0.01;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <animated.group position={position}>
      <Points
        ref={particlesRef}
        positions={particles}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color={particleColor}
          size={isMobile ? 0.05 : 0.08}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </animated.group>
  );
};

export default BackgroundParticlesOptimized;
