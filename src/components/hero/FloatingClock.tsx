import { useRef, useState, useEffect, useMemo } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import * as THREE from "three";
interface FloatingClockProps {
  position: [number, number, number];
}

export function FloatingClock({ position }: FloatingClockProps) {
  const [time, setTime] = useState("00:00:00");
  const [prevTime, setPrevTime] = useState("00:00:00");
  const clockRef = useRef<Group>(null);
  const digitsRef = useRef<{ [key: string]: THREE.Mesh | null }>({});

  // Memoize font path to avoid recreating
  const fontPath = useMemo(() => "/fonts/digital-7.ttf", []);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const newTime = `${hours}:${minutes}:${seconds}`;

      if (newTime !== time) {
        setPrevTime(time);
        setTime(newTime);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [time]);

  // Animate digit changes
  useEffect(() => {
    if (prevTime !== time) {
      for (let i = 0; i < time.length; i++) {
        if (time[i] !== prevTime[i] && digitsRef.current[`digit-${i}`]) {
          // Get the current digit element
          const digit = digitsRef.current[`digit-${i}`];

          // Animate using spring physics instead of GSAP for better performance
          if (digit) {
            // Reset position
            digit.position.y = 0.2;
            digit.material.opacity = 0;

            // Animate back to normal
            const animateDigit = () => {
              // Move towards target position
              digit.position.y = digit.position.y * 0.8;
              digit.material.opacity = Math.min(
                1,
                digit.material.opacity + 0.1
              );

              // Continue animation until complete
              if (
                digit.position.y > 0.01 ||
                (Array.isArray(digit.material)
                  ? digit.material.some((mat) => mat.opacity < 0.99)
                  : digit.material.opacity < 0.99)
              ) {
                requestAnimationFrame(animateDigit);
              }
            };

            requestAnimationFrame(animateDigit);
          }
        }
      }
    }
  }, [time, prevTime]);

  // Floating animation
  useFrame(({ clock }) => {
    if (clockRef.current) {
      clockRef.current.position.y =
        position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      clockRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group ref={clockRef} position={position}>
      {time.split("").map((char, index) => (
        <Text
          key={`digit-${index}`}
          ref={(el) => (digitsRef.current[`digit-${index}`] = el)}
          position={[index * 0.3 - 1, 0, 0]}
          fontSize={0.3}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          font={fontPath}
          material-transparent
        >
          {char}
        </Text>
      ))}
    </group>
  );
}

