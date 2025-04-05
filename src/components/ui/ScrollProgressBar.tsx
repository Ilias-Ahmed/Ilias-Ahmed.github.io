import { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ChevronUp } from "lucide-react";

interface CyberpunkScrollProgressBarProps {
  // Base colors
  primaryColor?: string;
  secondaryColor?: string;

  // Dimensions and positioning
  height?: number;
  zIndex?: number;

  // Feature toggles
  showPercentage?: boolean;
  showGlow?: boolean;
  showPulse?: boolean;
  showBackToTop?: boolean;
  showScanline?: boolean;
  showGlitchEffect?: boolean;

  // Cyberpunk theme options
  theme?: "neon" | "hologram" | "glitch" | "circuit";

  // Animation speed
  animationSpeed?: number;

  // Custom class names
  className?: string;
}

export const ScrollProgressBar = ({
  primaryColor = "#8B5CF6", // Purple from your NotFound page
  secondaryColor = "#EC4899", // Pink from your NotFound page
  height = 4,
  zIndex = 100,
  showPercentage = true,
  showGlow = true,
  showPulse = true,
  showBackToTop = true,
  showScanline = true,
  showGlitchEffect = true,
  theme = "glitch",
  animationSpeed = 1,
  className = "",
}: CyberpunkScrollProgressBarProps) => {
  const { scrollYProgress } = useScroll();
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Transform the scroll progress for various effects
  const gradientPosition = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"]
  );

  // Create a pulse effect that speeds up as you scroll more
  const pulseScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);

  // Update scroll percentage and trigger glitch effects
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setScrollPercentage(Math.round(value * 100));

      // Random glitch effect
      if (showGlitchEffect && Math.random() > 0.95) {
        setIsGlitching(true);

        if (glitchTimeoutRef.current) {
          clearTimeout(glitchTimeoutRef.current);
        }

        glitchTimeoutRef.current = setTimeout(() => {
          setIsGlitching(false);
        }, 200);
      }
    });

    return () => {
      unsubscribe();
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current);
      }
    };
  }, [scrollYProgress, showGlitchEffect]);

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case "neon":
        return {
          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
          boxShadow: showGlow
            ? `0 0 10px ${primaryColor}, 0 0 20px ${secondaryColor}`
            : "none",
        };
      case "hologram":
        return {
          background: `linear-gradient(to right, ${primaryColor}88, ${secondaryColor}88)`,
          boxShadow: showGlow ? `0 0 15px ${primaryColor}88` : "none",
          backdropFilter: "blur(2px)",
        };
      case "circuit":
        return {
          background: primaryColor,
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, ${secondaryColor} 10px, ${secondaryColor} 12px)`,
          boxShadow: showGlow ? `0 0 8px ${primaryColor}` : "none",
        };
      case "glitch":
      default:
        return {
          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
          boxShadow: showGlow ? `0 0 10px ${primaryColor}` : "none",
        };
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 ${className}`}
        style={{ zIndex }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={progressBarRef}
      >
        <div className="relative">
          {/* Base progress bar */}
          <motion.div
            className="origin-left"
            style={{
              height,
              scaleX: scrollYProgress,
              backgroundSize: "200% 100%",
              backgroundPosition: gradientPosition,
              ...getThemeStyles(),
            }}
            animate={
              isGlitching
                ? {
                    x: [0, -2, 3, -1, 0],
                    opacity: [1, 0.8, 1, 0.9, 1],
                  }
                : {}
            }
            transition={{ duration: 0.2 }}
          />

          {/* Pulse effect */}
          {showPulse && scrollPercentage > 0 && (
            <motion.div
              className="absolute top-0 left-0 h-full origin-left"
              style={{
                width: `${scrollPercentage}%`,
                opacity: 0.3,
                background: primaryColor,
                scaleX: pulseScale,
              }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                repeat: Infinity,
                duration: 2 / animationSpeed,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Scanline effect */}
          {showScanline && (
            <motion.div
              className="absolute top-0 h-full w-full overflow-hidden"
              style={{ opacity: 0.2 }}
            >
              <motion.div
                className="h-full w-8"
                style={{
                  background: `linear-gradient(90deg, transparent, ${secondaryColor}, transparent)`,
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 3 / animationSpeed,
                  ease: "linear",
                }}
              />
            </motion.div>
          )}

          {/* Digital markers/ticks */}
          <div className="absolute top-0 w-full h-full flex justify-between pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-full w-px"
                style={{
                  background: `${secondaryColor}40`,
                  boxShadow: showGlow ? `0 0 3px ${secondaryColor}40` : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Percentage indicator with cyberpunk styling */}
        {showPercentage && (
          <motion.div
            className="fixed top-2 right-4 dark:bg-black/70 backdrop-blur-sm border border-purple-500/30 text-white px-3 py-1 rounded-md text-sm font-mono flex items-center justify-center"
            style={{ zIndex }}
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: 1,
              y: 0,
              scale:
                scrollPercentage === 100 ? [1, 1.2, 1] : isHovered ? 1.05 : 1,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="mr-2 text-xs uppercase tracking-wider"
              animate={
                isGlitching
                  ? {
                      x: [0, -1, 2, -1, 0],
                      opacity: [1, 0.7, 1, 0.8, 1],
                    }
                  : {}
              }
            >

            </motion.div>

            <div className="flex items-center">
              <motion.span
                className="font-bold"
                animate={
                  isGlitching
                    ? {
                        x: [0, 2, -1, 1, 0],
                      }
                    : {}
                }
              >
                {scrollPercentage}%
              </motion.span>

              <motion.span
                className="ml-2 w-2 h-2 rounded-full"
                animate={{
                  boxShadow: [
                    `0 0 3px ${
                      scrollPercentage < 50
                        ? primaryColor
                        : scrollPercentage < 80
                        ? "orange"
                        : "#22c55e"
                    }`,
                    `0 0 6px ${
                      scrollPercentage < 50
                        ? primaryColor
                        : scrollPercentage < 80
                        ? "orange"
                        : "#22c55e"
                    }`,
                    `0 0 3px ${
                      scrollPercentage < 50
                        ? primaryColor
                        : scrollPercentage < 80
                        ? "orange"
                        : "#22c55e"
                    }`,
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    scrollPercentage < 50
                      ? primaryColor
                      : scrollPercentage < 80
                      ? "orange"
                      : "#22c55e",
                }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Back to top button with cyberpunk styling */}
      {showBackToTop && (
        <AnimatePresence>
          {scrollPercentage > 20 && (
            <motion.button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-10 h-10
                        bg-black/80 backdrop-blur-sm border border-purple-500/50 rounded-full
                        text-white shadow-lg hover:bg-black transition-colors duration-300 overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ y: -3, borderColor: "rgba(139, 92, 246, 0.8)" }}
              whileTap={{ scale: 0.9 }}
              aria-label="Back to top"
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(circle, ${secondaryColor}50 0%, transparent 70%)`,
                }}
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Scanline effect */}
              {showScanline && (
                <motion.div
                  className="absolute inset-0 overflow-hidden opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                    backgroundSize: "100% 4px",
                  }}
                  animate={{ backgroundPosition: ["0px 0px", "0px 100px"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}

              {/* Icon */}
              <ChevronUp className="w-5 h-5 relative z-10" />

              {/* Glowing border effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: `0 0 0 1px ${primaryColor}50`,
                  opacity: 0.5,
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </>
  );
};
