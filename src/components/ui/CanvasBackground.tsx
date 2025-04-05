import React, { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface CanvasBackgroundProps {
  mousePosition: { x: number; y: number };
}

const CanvasBackground: React.FC<CanvasBackgroundProps> = ({
  mousePosition,
}) => {
  const { theme, accent } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get accent color
  const getAccentColors = () => {
    const accentColors = {
      purple: { primary: "#8B5CF6", secondary: "#C4B5FD" },
      blue: { primary: "#3B82F6", secondary: "#93C5FD" },
      green: { primary: "#10B981", secondary: "#6EE7B7" },
      amber: { primary: "#F59E0B", secondary: "#FCD34D" },
      pink: { primary: "#EC4899", secondary: "#F9A8D4" },
    };

    return (
      accentColors[accent as keyof typeof accentColors] || accentColors.purple
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const updateDimensions = () => {
      const { innerWidth: width, innerHeight: height } = window;
      canvas.width = width;
      canvas.height = height;
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Create particles
    const particleCount = 100;
    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      const colors = getAccentColors();
      const primaryColor = colors.primary;
      const secondaryColor = colors.secondary;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const gradient = ctx.createRadialGradient(
        mousePosition.x * canvas.width,
        mousePosition.y * canvas.height,
        0,
        mousePosition.x * canvas.width,
        mousePosition.y * canvas.height,
        canvas.width * 0.8
      );

      if (theme === "dark") {
        gradient.addColorStop(0, "#1E1B4B");
        gradient.addColorStop(1, "#000000");
      } else {
        gradient.addColorStop(0, "#FFFFFF");
        gradient.addColorStop(1, "#EDE9FE");
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Apply mouse influence
        const dx = mousePosition.x * canvas.width - particle.x;
        const dy = mousePosition.y * canvas.height - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 10000;
          particle.speedX += Math.cos(angle) * force;
          particle.speedY += Math.sin(angle) * force;
        }

        // Dampen speed
        particle.speedX *= 0.99;
        particle.speedY *= 0.99;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = theme === "dark" ? primaryColor : secondaryColor;
        ctx.fill();

        // Draw connections between nearby particles
        particles.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `${
              theme === "dark" ? primaryColor : secondaryColor
            }${Math.floor((1 - distance / 100) * 255)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [theme, accent, mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: -1 }}
    />
  );
};

export default React.memo(CanvasBackground);
