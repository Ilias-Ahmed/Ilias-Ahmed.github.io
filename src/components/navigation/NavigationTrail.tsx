import { useEffect, useRef } from 'react';
import { useHeroStore } from '@/hooks/useHero';

interface NavigationTrailProps {
  isActive: boolean;
  direction: 'forward' | 'backward';
}

const NavigationTrail = ({ isActive, direction }: NavigationTrailProps) => {
  const { mode } = useHeroStore();
  const trailRef = useRef<HTMLDivElement>(null);

  // Colors based on mode
  const primaryColor = mode === "developer" ? "#3080ff" : "#ff3080";
  const secondaryColor = mode === "developer" ? "#22c55e" : "#ffbb00";

  // Create particles when navigation is active
  useEffect(() => {
    if (!isActive || !trailRef.current) return;

    const container = trailRef.current;
    const particleCount = 30;

    // Clear previous particles
    container.innerHTML = "";

    // Create new particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");

      // Random properties
      const size = Math.random() * 10 + 5;
      const xPos = Math.random() * window.innerWidth;
      const yPos = Math.random() * window.innerHeight;
      const delay = Math.random() * 0.5;
      const duration = Math.random() * 0.5 + 0.5;
      const color = i % 2 === 0 ? primaryColor : secondaryColor;

      // Set styles
      particle.style.position = "absolute";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = "50%";
      particle.style.backgroundColor = color;
      particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      particle.style.opacity = "0";
      particle.style.left = `${xPos}px`;
      particle.style.top = `${yPos}px`;
      particle.style.pointerEvents = "none";

      // Set animation
      particle.animate(
        [
          {
            opacity: 0,
            transform: "scale(0) translate(0, 0)",
          },
          {
            opacity: 1,
            transform: `scale(1) translate(${
              direction === "forward" ? 100 : -100
            }px, 0)`,
          },
          {
            opacity: 0,
            transform: `scale(0) translate(${
              direction === "forward" ? 200 : -200
            }px, 0)`,
          },
        ],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
          fill: "forwards",
        }
      );

      // Add to container
      container.appendChild(particle);

      // Remove after animation
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, (duration + delay) * 1000);
    }
  }, [isActive, direction, primaryColor, secondaryColor]);

  return (
    <div
      ref={trailRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
};

export default NavigationTrail;

