import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  duration?: number;
  quotes?: string[];
}

/**
 * An advanced, unique loading screen with 3D effects, elegant animations,
 * particle systems, and dynamic interactions with proper theming
 */
const LoadingScreen = ({
  onLoadingComplete,
  duration = 5000,
  quotes = [
    "Crafting digital experiences that inspire.",
    "Where innovation meets design.",
    "Turning ideas into elegant solutions.",
    "Building tomorrow's interfaces today.",
    "Perfection is in the details.",
  ],
}: LoadingScreenProps) => {
  const {isDark } = useTheme();

  // Main state management
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [typedQuote, setTypedQuote] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; size: number; speed: number; color: string }>
  >([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const progressControls = useAnimationControls();
  const galaxyRef = useRef<HTMLDivElement>(null);

  // Get computed theme colors for canvas usage
  const getComputedThemeColors = useCallback(() => {
    if (typeof window === "undefined") return null;

    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    // Get the HSL values and convert to usable format
    const primaryHSL = computedStyle.getPropertyValue("--primary").trim();

    // Convert HSL to RGB for canvas usage
    const hslToRgb = (h: number, s: number, l: number) => {
      s /= 100;
      l /= 100;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let r = 0,
        g = 0,
        b = 0;

      if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return { r, g, b };
    };

    // Parse HSL values
    const hslValues = primaryHSL
      .split(" ")
      .map((v) => parseFloat(v.replace("%", "")));
    const [h, s, l] = hslValues;
    const { r, g, b } = hslToRgb(h, s, l);

    return {
      primary: `rgb(${r}, ${g}, ${b})`,
      primaryAlpha: (alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`,
      secondary: `rgb(${Math.min(255, r + 20)}, ${Math.min(
        255,
        g + 20
      )}, ${Math.min(255, b + 20)})`,
      secondaryAlpha: (alpha: number) =>
        `rgba(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(
          255,
          b + 20
        )}, ${alpha})`,
    };
  }, []);

  const themeColors = getComputedThemeColors();

  // Component mount detection
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Generate hexagon grid for background
  const hexagons = useMemo(() => {
    const hexArray = [];
    for (let i = 0; i < 50; i++) {
      hexArray.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        hueRotate: Math.floor(Math.random() * 90) - 45,
      });
    }
    return hexArray;
  }, []);

  // Initialize random particles with theme colors
  useEffect(() => {
    if (!themeColors) return;

    const newParticles = [];
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        x:
          Math.random() *
          (typeof window !== "undefined" ? window.innerWidth : 800),
        y:
          Math.random() *
          (typeof window !== "undefined" ? window.innerHeight : 600),
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        color:
          Math.random() > 0.5 ? themeColors.primary : themeColors.secondary,
      });
    }
    setParticles(newParticles);
  }, [themeColors]);

  // Handle typing effect for quotes
  useEffect(() => {
    const currentQuote = quotes[activeQuoteIndex];

    if (typingIndex < currentQuote.length) {
      const timeout = setTimeout(() => {
        setTypedQuote((prev) => prev + currentQuote[typingIndex]);
        setTypingIndex((prev) => prev + 1);
      }, 40);

      return () => clearTimeout(timeout);
    } else {
      // After completing typing, wait and then switch to next quote
      const timeout = setTimeout(() => {
        setTypedQuote("");
        setTypingIndex(0);
        setActiveQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [activeQuoteIndex, quotes, typingIndex]);

  // Mouse move effect for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Interactive galaxy effect rendering
  useEffect(() => {
    if (
      !canvasRef.current ||
      !galaxyRef.current ||
      typeof window === "undefined" ||
      !themeColors
    )
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const galaxyEl = galaxyRef.current;
      if (galaxyEl) {
        canvas.width = galaxyEl.offsetWidth;
        canvas.height = galaxyEl.offsetHeight;
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Animation loop for galaxy effect
    const renderGalaxy = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate center with subtle mouse influence
      const centerX =
        canvas.width / 2 + (mousePosition.x - window.innerWidth / 2) * 0.05;
      const centerY =
        canvas.height / 2 + (mousePosition.y - window.innerHeight / 2) * 0.05;

      // Draw galaxy spiral arms
      const drawArm = (rotation: number, color: string, width: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();

        for (let i = 0; i < 400; i++) {
          const angle = i * 0.05 + rotation;
          const radius = i * 0.35;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      };

      // Draw multiple arms with slight variations
      const time = Date.now() * 0.0001;
      const rotationBase = time % (Math.PI * 2);

      ctx.globalAlpha = 0.4;
      drawArm(rotationBase, themeColors.primary, 1.5);
      drawArm(rotationBase + Math.PI * 0.25, themeColors.secondary, 1.2);
      drawArm(rotationBase + Math.PI * 0.5, themeColors.primary, 1);
      drawArm(rotationBase + Math.PI * 0.75, themeColors.secondary, 0.8);

      // Particles
      ctx.globalAlpha = 0.7;
      particles.forEach((particle, i) => {
        // Update particle position
        particle.y -= particle.speed;
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }

        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Update the particle in the array
        const newParticles = [...particles];
        newParticles[i] = particle;
        setParticles(newParticles);
      });

      // Core glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        100
      );
      gradient.addColorStop(0, themeColors.primaryAlpha(0.8));
      gradient.addColorStop(0.5, themeColors.secondaryAlpha(0.4));
      gradient.addColorStop(1, "transparent");

      ctx.globalAlpha = 0.3;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
      ctx.fill();

      frameRef.current = requestAnimationFrame(renderGalaxy);
    };

    renderGalaxy();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [particles, mousePosition, themeColors]);

  // Cubic bezier function for smooth easing
  const cubicBezier = useCallback(
    (x1: number, y1: number, x2: number, y2: number, t: number): number => {
      // Implementation of cubic bezier curve calculation
      const cx = 3 * x1;
      const bx = 3 * (x2 - x1) - cx;
      const ax = 1 - cx - bx;

      const cy = 3 * y1;
      const by = 3 * (y2 - y1) - cy;
      const ay = 1 - cy - by;

      const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
      const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;

      // Use binary search to find t for given x
      if (t === 0 || t === 1) return t;

      // Newton-Raphson iteration to find better t approximation
      let tCurrent = t;
      for (let i = 0; i < 8; i++) {
        const currentX = sampleCurveX(tCurrent) - t;
        if (Math.abs(currentX) < 0.001) break;

        const derivative = (3 * ax * tCurrent + 2 * bx) * tCurrent + cx;
        if (Math.abs(derivative) < 0.000001) break;

        tCurrent = tCurrent - currentX / derivative;
      }

      return sampleCurveY(tCurrent);
    },
    []
  );

  // Exit animation trigger
  const triggerExitAnimation = useCallback(() => {
    if (!isMounted) return;

    progressControls.start({
      scale: [1, 1.2, 0],
      opacity: [1, 1, 0],
      transition: { duration: 1.5 },
    });

    setExitAnimation(true);

    // Complete loading after exit animation
    setTimeout(() => {
      setLoadingComplete(true);
      if (onLoadingComplete) onLoadingComplete();
    }, 2500);
  }, [isMounted, progressControls, onLoadingComplete]);

  // Main loading progress simulation
  useEffect(() => {
    if (!isMounted) return;

    // Smooth progression with easing
    const simulateProgress = () => {
      const startTime = Date.now();
      const animateProgress = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        // Calculate progress with cubic-bezier easing
        const t = Math.min(elapsed / duration, 1);
        const easedT = cubicBezier(0.34, 0.52, 0.57, 0.98, t);
        const nextProgress = Math.min(100, easedT * 100);

        setProgress(nextProgress);

        // Determine if we should continue animation
        if (t < 1) {
          requestAnimationFrame(animateProgress);
        } else {
          // Trigger exit animation after reaching 100%
          setTimeout(() => {
            triggerExitAnimation();
          }, 800);
        }
      };

      requestAnimationFrame(animateProgress);
    };

    simulateProgress();
  }, [duration, cubicBezier, triggerExitAnimation, isMounted]);

  if (loadingComplete || !themeColors) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: isDark ? "#000000" : "#ffffff" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Hexagon grid */}
          <div className="absolute inset-0 opacity-20">
            {hexagons.map((hex, index) => (
              <motion.div
                key={index}
                className="absolute rounded-md origin-center"
                style={{
                  width: `${hex.size}rem`,
                  height: `${hex.size}rem`,
                  left: `${hex.x}%`,
                  top: `${hex.y}%`,
                  background: `linear-gradient(135deg, ${themeColors.primaryAlpha(
                    hex.opacity
                  )} 0%, ${themeColors.secondaryAlpha(hex.opacity)} 100%)`,
                  filter: `hue-rotate(${hex.hueRotate}deg)`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: {
                    repeat: Infinity,
                    duration: 20 + Math.random() * 10,
                    ease: "linear",
                  },
                  scale: {
                    repeat: Infinity,
                    duration: 4 + Math.random() * 2,
                    ease: "easeInOut",
                  },
                }}
              />
            ))}
          </div>

          {/* Interactive galaxy background */}
          <div ref={galaxyRef} className="absolute inset-0 opacity-70">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>
        </div>

        {/* Central container */}
        <motion.div
          className="relative z-10 w-96 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* 3D Logo element */}
          <div className="perspective-1000 mb-10">
            <motion.div
              className="relative w-24 h-24 flex items-center justify-center"
              animate={{
                rotateY: [0, 180, 360],
                rotateX: [0, 30, 0, -30, 0],
              }}
              transition={{
                rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
                rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {/* Layers of the 3D cube */}
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor:
                      index === 0
                        ? themeColors.primaryAlpha(0.3)
                        : "transparent",
                    transform: `translateZ(${-(index * 5)}px)`,
                    backdropFilter: "blur(5px)",
                    border: `1px solid ${
                      isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
                    }`,
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${themeColors.primaryAlpha(0.3)}`,
                      `0 0 30px ${themeColors.secondaryAlpha(0.5)}`,
                      `0 0 20px ${themeColors.primaryAlpha(0.3)}`,
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                >
                  {index === 0 && (
                    <div
                      className="text-2xl font-bold tracking-wider"
                      style={{ color: isDark ? "#ffffff" : "#000000" }}
                    >
                      IA
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Progress display */}
          <motion.div className="relative mb-6" animate={progressControls}>
            {/* Digital counter */}
            <div className="w-full text-center mb-4">
              <div className="inline-block relative">
                <motion.div
                  className="text-5xl font-bold filter drop-shadow-lg"
                  style={{
                    background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary}, ${themeColors.primary})`,
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  animate={{
                    backgroundPosition: ["0% center", "200% center"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {Math.floor(progress)}
                </motion.div>
                <div
                  className="absolute -right-8 top-0 text-3xl font-light"
                  style={{ color: themeColors.primary }}
                >
                  %
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="relative w-64 h-2 rounded-full overflow-hidden"
              style={{
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Ambient glow */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: `0 0 10px ${themeColors.primary}, 0 0 20px ${themeColors.secondary}`,
                }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Main progress fill */}
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary})`,
                }}
              />

              {/* Animated glow particles along progress bar */}
              <motion.div
                className="absolute top-0 bottom-0 w-20 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${themeColors.primaryAlpha(
                    0.8
                  )}, ${themeColors.secondaryAlpha(0.8)}, transparent)`,
                  left: `${progress - 10}%`,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            </div>
          </motion.div>

          {/* Quote Display */}
          <motion.div
            className="text-center w-full h-20 flex items-center justify-center mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              className="text-lg italic px-6"
              style={{
                color: isDark
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(0, 0, 0, 0.7)",
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              "{typedQuote}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                |
              </motion.span>
              "
            </motion.div>
          </motion.div>

          {/* Status messages with tech-inspired animations */}
          <motion.div
            className="w-full relative h-6 overflow-hidden font-mono text-sm text-center"
            style={{
              color:
                progress < 50 ? themeColors.primary : themeColors.secondary,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`status-${Math.floor(progress / 25)}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {progress < 25
                  ? "Initializing core systems..."
                  : progress < 50
                  ? "Loading digital assets..."
                  : progress < 75
                  ? "Establishing neural connections..."
                  : progress < 95
                  ? "Calibrating interface dynamics..."
                  : "Synchronization complete..."}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Side decorative elements - Left */}
        <div className="absolute left-10 top-0 bottom-0 w-20 pointer-events-none opacity-60">
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-1/2 rounded-full"
            style={{
              background: `linear-gradient(to bottom, transparent, ${themeColors.primary}, transparent)`,
            }}
            animate={{
              height: ["40%", "60%", "40%"],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-[40%] left-2 h-0.5 rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, ${themeColors.primary})`,
            }}
            animate={{ width: ["0.5rem", "2.5rem", "0.5rem"] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute top-[60%] left-2 h-0.5 rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, ${themeColors.secondary})`,
            }}
            animate={{ width: ["0.5rem", "4rem", "0.5rem"] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        {/* Side decorative elements - Right */}
        <div className="absolute right-10 top-0 bottom-0 w-20 pointer-events-none opacity-60">
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 right-0 w-0.5 h-1/2 rounded-full"
            style={{
              background: `linear-gradient(to bottom, transparent, ${themeColors.secondary}, transparent)`,
            }}
            animate={{
              height: ["40%", "60%", "40%"],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute top-[40%] right-2 h-0.5 rounded-full"
            style={{
              background: `linear-gradient(to left, transparent, ${themeColors.secondary})`,
            }}
            animate={{ width: ["0.5rem", "2.5rem", "0.5rem"] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute top-[60%] right-2 h-0.5 rounded-full"
            style={{
              background: `linear-gradient(to left, transparent, ${themeColors.primary})`,
            }}
            animate={{ width: ["0.5rem", "4rem", "0.5rem"] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
        </div>

        {/* Top and bottom decorative elements */}
        <div className="absolute inset-x-0 top-10 h-20 flex justify-center pointer-events-none opacity-60">
          <motion.div
            className="w-0.5 rounded-full"
            style={{
              background: `linear-gradient(to bottom, transparent, ${themeColors.primary})`,
            }}
            animate={{ height: ["1rem", "2.5rem", "1rem"] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-10 h-20 flex justify-center pointer-events-none opacity-60">
          <motion.div
            className="w-0.5 rounded-full"
            style={{
              background: `linear-gradient(to top, transparent, ${themeColors.secondary})`,
            }}
            animate={{ height: ["1rem", "2.5rem", "1rem"] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        {/* Exit animation effects */}
        <AnimatePresence>
          {exitAnimation && (
            <>
              {/* Split screen animation */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 right-1/2 z-40"
                style={{ backgroundColor: isDark ? "#000000" : "#ffffff" }}
                initial={{ x: 0 }}
                animate={{ x: "-100%" }}
                transition={{
                  duration: 1.5,
                  ease: [0.43, 0.13, 0.23, 0.96],
                  delay: 0.5,
                }}
              >
                <div
                  className="absolute right-0 top-0 bottom-0 w-1 opacity-50"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${themeColors.primary}, transparent)`,
                  }}
                />
              </motion.div>
              <motion.div
                className="absolute left-1/2 top-0 bottom-0 right-0 z-40"
                style={{ backgroundColor: isDark ? "#000000" : "#ffffff" }}
                initial={{ x: 0 }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  ease: [0.43, 0.13, 0.23, 0.96],
                  delay: 0.5,
                }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 opacity-50"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${themeColors.secondary}, transparent)`,
                  }}
                />
              </motion.div>

              {/* Flash effect */}
              <motion.div
                className="absolute inset-0 z-30"
                style={{ backgroundColor: isDark ? "#ffffff" : "#000000" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 1, times: [0, 0.5, 1], delay: 0.3 }}
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;

