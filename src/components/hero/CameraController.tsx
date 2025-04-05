import { useHeroStore } from "@/hooks/useHero";
import { useFrame, useThree } from "@react-three/fiber";
import { useSpring } from "@react-spring/three";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

interface CameraControllerProps {
  mousePosition: { x: number; y: number };
  scrollY: number;
}

export function CameraController({
  mousePosition,
  scrollY,
}: CameraControllerProps) {
  const { camera } = useThree();
  const { mode, cameraDistance, cameraHeight, cameraAutoRotate } =
    useHeroStore();
  const initialCameraPosition = useRef(
    new Vector3(0, cameraHeight, cameraDistance)
  );
  const targetPosition = useRef(new Vector3(0, cameraHeight, cameraDistance));
  const lastUpdateTime = useRef(Date.now());

  // Spring animation for smoother camera movement
  const [spring, api] = useSpring(() => ({
    position: [0, cameraHeight, cameraDistance],
    config: { mass: 1, tension: 180, friction: 30, precision: 0.001 },
  }));

  // Update camera position based on scroll
  useEffect(() => {
    if (cameraAutoRotate) return; // Don't adjust camera when auto-rotate is on

    // Calculate how far down the page we've scrolled (0 to 1)
    const scrollProgress = Math.min(scrollY / window.innerHeight, 1);

    // Move camera based on scroll
    targetPosition.current.z = cameraDistance - scrollProgress * 2; // Move camera closer as we scroll
    targetPosition.current.y = cameraHeight + scrollProgress * 1; // Move camera up slightly as we scroll

    // Tilt camera down slightly as we scroll
    camera.rotation.x = -scrollProgress * 0.2;

    // Update spring animation target
    api.start({
      position: [
        targetPosition.current.x,
        targetPosition.current.y,
        targetPosition.current.z,
      ],
    });
  }, [scrollY, camera, cameraDistance, cameraHeight, cameraAutoRotate, api]);

  // Update camera position based on mode
  useEffect(() => {
    if (cameraAutoRotate) return; // Don't adjust camera when auto-rotate is on

    if (mode === "developer") {
      targetPosition.current.x = 1; // Shift slightly to the right for developer mode
    } else if (mode === "designer") {
      targetPosition.current.x = -1; // Shift slightly to the left for designer mode
    } else {
      targetPosition.current.x = 0; // Center for creative mode
    }

    // Update spring animation target
    api.start({
      position: [
        targetPosition.current.x,
        targetPosition.current.y,
        targetPosition.current.z,
      ],
    });
  }, [mode, cameraAutoRotate, api]);

  // Subtle camera movement following the mouse
  useFrame(() => {
    if (cameraAutoRotate) return; // Don't adjust camera when auto-rotate is on

    // Throttle updates for better performance
    const now = Date.now();
    if (now - lastUpdateTime.current < 16) return; // Limit to ~60fps
    lastUpdateTime.current = now;

    // Add subtle mouse-based movement
    const targetX = targetPosition.current.x + mousePosition.x * 0.3;
    const targetY = targetPosition.current.y + mousePosition.y * 0.2;

    // Update camera position using spring animation
    api.start({
      position: [targetX, targetY, targetPosition.current.z],
    });

    // Apply spring values to camera
    const [x, y, z] = spring.position.get();
    camera.position.set(x, y, z);

    // Always look at the center with slight offset based on mode
    const lookAtX = mode === "developer" ? 0.5 : mode === "designer" ? -0.5 : 0;
    camera.lookAt(new Vector3(lookAtX, 0, 0));
  });

  return null; // This component doesn't render anything
}
