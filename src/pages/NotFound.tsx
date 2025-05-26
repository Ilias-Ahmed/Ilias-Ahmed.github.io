import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHapticFeedback } from "@/utils/haptics";
import { useTheme } from "@/contexts/ThemeContext";

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: {
    x: number;
    y: number;
  };
  life: number;
}

const NotFound: React.FC = () => {
  const { isDark } = useTheme();

  // State for interactive elements
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [showPortal, setShowPortal] = useState<boolean>(false);
  const [portalEnergy, setPortalEnergy] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [errorCode, setErrorCode] = useState<string>("404");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const portalRef = useRef<HTMLCanvasElement | null>(null);

  // Get computed theme colors for canvas usage
  const getComputedThemeColors = () => {
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
      primaryHex: `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
    };
  };

  const themeColors = getComputedThemeColors();

  // Component mount animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({
        x: e.clientX,
        y: e.clientY,
      });

      // Generate particles on mouse move with theme colors
      if (Math.random() > 0.7 && themeColors) {
        const newParticle: Particle = {
          id: Date.now() + Math.random().toString(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 5 + 2,
          color: themeColors.primary,
          velocity: {
            x: (Math.random() - 0.5) * 3,
            y: (Math.random() - 0.5) * 3,
          },
          life: 100,
        };

        setParticles((prev) => [...prev, newParticle]);
      }
    };

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setErrorCode(
        Math.random() > 0.8
          ? ["404", "4○4", "40¤", "4Ø4", "ᗣᗣᗣ"][Math.floor(Math.random() * 5)]
          : "404"
      );

      setTimeout(() => setIsGlitching(false), 150);
    }, 3000);

    // Increase portal energy over time
    const portalInterval = setInterval(() => {
      setPortalEnergy((prev) => {
        const newValue = Math.min(prev + 1, 100);
        if (newValue === 100 && !showPortal) {
          setShowPortal(true);
        }
        return newValue;
      });
    }, 100);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(glitchInterval);
      clearInterval(portalInterval);
    };
  }, [showPortal, themeColors]);

  // Update particles
  useEffect(() => {
    if (particles.length === 0) return;

    const timer = setTimeout(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.velocity.x,
            y: p.y + p.velocity.y,
            life: p.life - 1,
            size: p.size * 0.98,
          }))
          .filter((p) => p.life > 0)
      );
    }, 16);

    return () => clearTimeout(timer);
  }, [particles]);

  // Portal animation
  useEffect(() => {
    if (!showPortal || !portalRef.current || !themeColors) return;

    const ctx = portalRef.current.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let angle = 0;

    const drawPortal = () => {
      const width = portalRef.current?.width || 0;
      const height = portalRef.current?.height || 0;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Draw portal with theme colors
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        150
      );

      gradient.addColorStop(0, themeColors.primaryAlpha(0.9));
      gradient.addColorStop(0.5, themeColors.primaryAlpha(0.6));
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw swirling effect with theme colors
      for (let i = 0; i < 5; i++) {
        const spiralAngle = angle + (i * Math.PI) / 2.5;
        const spiralRadius = 20 + i * 25;

        ctx.beginPath();
        for (let j = 0; j < 30; j++) {
          const pointAngle = spiralAngle + j * 0.2;
          const pointRadius = spiralRadius - j * 0.5;
          const x = centerX + Math.cos(pointAngle) * pointRadius;
          const y = centerY + Math.sin(pointAngle) * pointRadius;

          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = themeColors.primaryAlpha(0.7);
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      angle += 0.02;
      animationFrame = requestAnimationFrame(drawPortal);
    };

    drawPortal();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [showPortal, themeColors]);

  // Digital noise canvas effect
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawNoise = () => {
      // Only draw when glitching
      if (isGlitching && canvas) {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const noise = Math.random() > 0.99;
          const value = noise ? 255 : 0;

          data[i] = value * (Math.random() > 0.5 ? 1 : 0); // R
          data[i + 1] = value * (Math.random() > 0.5 ? 1 : 0); // G
          data[i + 2] = value; // B
          data[i + 3] = noise ? 50 : 0; // A
        }

        ctx.putImageData(imageData, 0, 0);
      } else if (canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      animationFrame = requestAnimationFrame(drawNoise);
    };

    drawNoise();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isGlitching]);

  if (!themeColors) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="relative w-full h-screen overflow-hidden flex items-center justify-center"
        style={{
          backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
          color: isDark ? "#ffffff" : "#000000",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background canvas for digital noise */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        />

        {/* Particle effects */}
        <AnimatePresence>
          <div className="absolute inset-0 pointer-events-none z-20">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}px`,
                  top: `${particle.y}px`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: particle.life / 100,
                  scale: particle.life / 100,
                }}
                exit={{ opacity: 0, scale: 0 }}
              />
            ))}
          </div>
        </AnimatePresence>

        {/* Grid lines with theme colors */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${themeColors.primaryAlpha(
                0.1
              )} 1px, transparent 1px),
              linear-gradient(to bottom, ${themeColors.primaryAlpha(
                0.1
              )} 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            backgroundPosition: "center center",
          }}
        />

        {/* Circular glow following cursor */}
        <motion.div
          className="absolute pointer-events-none z-0 rounded-full opacity-20"
          style={{
            width: "300px",
            height: "300px",
            background: `radial-gradient(circle, ${themeColors.primaryAlpha(
              0.8
            )} 0%, rgba(0, 0, 0, 0) 70%)`,
          }}
          animate={{
            x: cursorPosition.x - 150,
            y: cursorPosition.y - 150,
            scale: isGlitching ? 1.2 : 1,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />

        {/* Main content */}
        <motion.div
          className="relative z-30 max-w-2xl w-full mx-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
            x: isGlitching ? [0, 3, -3, 0] : 0,
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            transform: `perspective(1000px) rotateX(${
              (cursorPosition.y -
                (typeof window !== "undefined" ? window.innerHeight / 2 : 0)) /
              50
            }deg) rotateY(${
              -(
                cursorPosition.x -
                (typeof window !== "undefined" ? window.innerWidth / 2 : 0)
              ) / 50
            }deg)`,
          }}
        >
          {/* Error code */}
          <motion.h1
            className="text-9xl font-bold mb-6 tracking-tighter"
            style={{
              color: isGlitching ? "#ef4444" : themeColors.primary,
              textShadow: `0 0 20px ${
                isGlitching ? "#ef4444" : themeColors.primary
              }`,
              fontFamily: "monospace",
            }}
            animate={{
              textShadow: isGlitching
                ? [`0 0 20px #ef4444`, `0 0 30px #ef4444`, `0 0 20px #ef4444`]
                : [
                    `0 0 20px ${themeColors.primary}`,
                    `0 0 30px ${themeColors.primary}`,
                    `0 0 20px ${themeColors.primary}`,
                  ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AnimatePresence mode="wait">
              {errorCode.split("").map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: isGlitching ? [0, Math.sin(i) * 5, 0] : 0,
                    x: isGlitching ? [0, Math.random() * 4 - 2, 0] : 0,
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: isGlitching ? 0.1 : 0.3,
                    delay: i * 0.1,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.h1>

          {/* Message */}
          <motion.div
            className="mb-8 p-6 rounded-lg border-2"
            style={{
              backgroundColor: isDark
                ? "rgba(17, 24, 39, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
              borderColor: isGlitching
                ? "#ef4444"
                : themeColors.primaryAlpha(0.5),
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.h2
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Reality Breach Detected
            </motion.h2>
            <motion.p
              className="mb-4"
              style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              The dimensional coordinates you're attempting to access don't
              exist in this reality.
            </motion.p>
            <motion.div
              className="text-sm font-mono p-2 rounded inline-block"
              style={{
                backgroundColor: isDark
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(255, 255, 255, 0.5)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <span
                style={{ color: isGlitching ? "#ef4444" : themeColors.primary }}
              >
                LOCATION_NOT_FOUND:{" "}
                {typeof window !== "undefined"
                  ? window.location.pathname
                  : "/404"}
              </span>
            </motion.div>
          </motion.div>

          {/* Portal energy meter */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-mono"
                style={{ color: themeColors.primary }}
              >
                DIMENSIONAL PORTAL
              </span>
              <motion.span
                className="text-xs font-mono"
                style={{ color: themeColors.primary }}
                key={portalEnergy}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {portalEnergy}%
              </motion.span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden border"
              style={{
                backgroundColor: isDark
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(255, 255, 255, 0.5)",
                borderColor: themeColors.primaryAlpha(0.3),
              }}
            >
              <motion.div
                className="h-full"
                style={{
                  background: `linear-gradient(to right, ${
                    themeColors.primary
                  }, ${themeColors.primaryAlpha(0.8)})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${portalEnergy}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <Link to="/">
              <motion.button
                className="px-8 py-3 rounded-lg font-medium border-2 relative overflow-hidden group"
                style={{
                  backgroundColor: showPortal
                    ? themeColors.primary
                    : themeColors.primary,
                  color: "#ffffff",
                  borderColor: themeColors.primaryAlpha(0.5),
                  boxShadow: `0 4px 20px ${themeColors.primaryAlpha(0.25)}`,
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 6px 25px ${themeColors.primaryAlpha(0.4)}`,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => triggerHapticFeedback()}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>{showPortal ? "Enter Portal" : "Return Home"}</span>
                </span>

                {/* Button glow effect */}
                <motion.span
                  className="absolute inset-0 w-full h-full rounded-lg"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${themeColors.primaryAlpha(
                      0.3
                    )}, transparent)`,
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.button>
            </Link>

            <motion.button
              className="px-8 py-3 font-medium rounded-lg border-2 transition-all duration-300"
              style={{
                backgroundColor: "transparent",
                color: themeColors.primary,
                borderColor: themeColors.primaryAlpha(0.5),
              }}
              whileHover={{
                scale: 1.02,
                backgroundColor: themeColors.primaryAlpha(0.1),
                borderColor: themeColors.primary,
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                window.history.back();
                triggerHapticFeedback();
              }}
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
                <span>Go Back</span>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Portal effect */}
        <AnimatePresence>
          {showPortal && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-25"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              <canvas
                ref={portalRef}
                width={500}
                height={500}
                className="absolute"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating binary/hex data */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none z-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs font-mono whitespace-nowrap"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.7,
                color: themeColors.primary,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {Array.from({ length: 20 }, () =>
                Math.random() > 0.5
                  ? Math.round(Math.random()).toString()
                  : "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
              ).join("")}
            </motion.div>
          ))}
        </div>

        {/* Scan line effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-40 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${
              isDark ? "#ffffff" : "#000000"
            }, ${
              isDark ? "#ffffff" : "#000000"
            } 1px, transparent 1px, transparent 2px)`,
            backgroundSize: "100% 4px",
          }}
          animate={{
            backgroundPosition: ["0 0", "0 100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Circuit board traces */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20"
          style={{ filter: "blur(1px)" }}
        >
          <defs>
            <linearGradient
              id="circuitGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor={themeColors.primary}
                stopOpacity="0.1"
              />
              <stop
                offset="50%"
                stopColor={themeColors.primary}
                stopOpacity="0.6"
              />
              <stop
                offset="100%"
                stopColor={themeColors.primary}
                stopOpacity="0.1"
              />
            </linearGradient>
          </defs>

          <motion.path
            d="M0,150 C100,50 300,250 400,150 M0,100 C150,200 250,0 400,100 M50,0 C200,150 100,300 350,200"
            stroke="url(#circuitGradient)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="5,5"
            animate={{
              strokeDashoffset: [0, 20],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Circuit nodes */}
          {Array.from({ length: 15 }).map((_, i) => {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            return (
              <motion.circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill={themeColors.primary}
                opacity="0.6"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  r: [2, 4, 2],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            );
          })}
        </svg>

        <style>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 0.2;
            }
            50% {
              opacity: 0.8;
            }
          }

          @keyframes scan {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 0 100%;
            }
          }

          @keyframes float-y {
            0% {
              transform: translateY(100vh);
            }
            100% {
              transform: translateY(-100%);
            }
          }

                    @keyframes glitch-0 {
            0%,
            100% {
              transform: translate(0);
            }
            20% {
              transform: translate(-2px, 2px);
            }
            40% {
              transform: translate(-2px, -2px);
            }
            60% {
              transform: translate(2px, 2px);
            }
            80% {
              transform: translate(2px, -2px);
            }
          }

          @keyframes glitch-1 {
            0%,
            100% {
              transform: translate(0);
            }
            20% {
              transform: translate(2px, -2px);
            }
            40% {
              transform: translate(2px, 2px);
            }
            60% {
              transform: translate(-2px, -2px);
            }
            80% {
              transform: translate(-2px, 2px);
            }
          }

          @keyframes glitch-2 {
            0%,
            100% {
              transform: translate(0);
            }
            20% {
              transform: translate(-1px, 1px);
            }
            40% {
              transform: translate(1px, 1px);
            }
            60% {
              transform: translate(1px, -1px);
            }
            80% {
              transform: translate(-1px, -1px);
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotFound;

