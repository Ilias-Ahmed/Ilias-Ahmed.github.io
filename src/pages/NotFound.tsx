import { triggerHapticFeedback } from "@/utils/haptics";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const portalRef = useRef<HTMLCanvasElement | null>(null);

  // Handle mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({
        x: e.clientX,
        y: e.clientY,
      });

      // Generate particles on mouse move
      if (Math.random() > 0.7) {
        const newParticle: Particle = {
          id: Date.now() + Math.random().toString(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 5 + 2,
          color: `hsl(${Math.random() * 60 + 240}, 100%, 70%)`,
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
  }, [showPortal]);

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
    if (!showPortal || !portalRef.current) return;

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

      // Draw portal
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        150
      );

      gradient.addColorStop(0, "rgba(147, 51, 234, 0.9)");
      gradient.addColorStop(0.5, "rgba(79, 70, 229, 0.6)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw swirling effect
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

        ctx.strokeStyle = `hsla(${260 + i * 15}, 100%, 70%, 0.7)`;
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
  }, [showPortal]);

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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      {/* Background canvas for digital noise */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      />

      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.life / 100,
              transform: `scale(${particle.life / 100})`,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          backgroundPosition: "center center",
        }}
      />

      {/* Circular glow following cursor */}
      <div
        className="absolute pointer-events-none z-0 rounded-full opacity-20 transition-transform duration-300"
        style={{
          width: "300px",
          height: "300px",
          left: `${cursorPosition.x - 150}px`,
          top: `${cursorPosition.y - 150}px`,
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(0, 0, 0, 0) 70%)",
          transform: isGlitching ? "scale(1.2)" : "scale(1)",
        }}
      />

      {/* Main content */}
      <div
        className={`relative z-30 max-w-2xl w-full mx-4 text-center ${
          isGlitching ? "translate-x-[3px]" : ""
        }`}
        style={{
          transition: "transform 0.1s",
          transform: `perspective(1000px) rotateX(${
            (cursorPosition.y - window.innerHeight / 2) / 50
          }deg) rotateY(${
            -(cursorPosition.x - window.innerWidth / 2) / 50
          }deg)`,
        }}
      >
        {/* Error code */}
        <h1
          className={`text-9xl font-bold mb-6 tracking-tighter ${
            isGlitching ? "text-red-500" : "text-indigo-500"
          }`}
          style={{
            textShadow: `0 0 20px ${isGlitching ? "#ef4444" : "#6366f1"}`,
            fontFamily: "monospace",
          }}
        >
          {errorCode.split("").map((char, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                animation: isGlitching
                  ? `glitch-${i % 3} 0.3s infinite`
                  : "none",
                position: "relative",
                transform: isGlitching
                  ? `translateY(${Math.sin(i) * 5}px)`
                  : "none",
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Message */}
        <div
          className={`mb-8 backdrop-blur-sm bg-black/30 p-6 rounded-lg border ${
            isGlitching ? "border-red-500/50" : "border-indigo-500/50"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">Reality Breach Detected</h2>
          <p className="text-gray-300 mb-4">
            The dimensional coordinates you're attempting to access don't exist
            in this reality.
          </p>
          <div className="text-sm font-mono p-2 bg-black/50 rounded inline-block">
            <span className={isGlitching ? "text-red-400" : "text-indigo-400"}>
              LOCATION_NOT_FOUND: {window.location.pathname}
            </span>
          </div>
        </div>

        {/* Portal energy meter */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-indigo-300">
              DIMENSIONAL PORTAL
            </span>
            <span className="text-xs font-mono text-indigo-300">
              {portalEnergy}%
            </span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-indigo-500/30">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
              style={{ width: `${portalEnergy}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/">
            <button
              className={`
                px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1
                ${
                  showPortal
                    ? "bg-purple-600 text-white"
                    : "bg-indigo-600 text-white"
                }
                border border-indigo-400/50 relative overflow-hidden group
              `}
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
              <span
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/0 via-white/30 to-purple-600/0"
                style={{
                  transform: "translateX(-100%)",
                }}
              />
            </button>
          </Link>

          <button
            className="px-8 py-3 bg-transparent text-indigo-400 font-medium rounded-lg
                      border border-indigo-500/30 hover:border-indigo-500/70 transition-all duration-300 hover:bg-indigo-500/10"
            onClick={() => {
              window.history.back()
              triggerHapticFeedback()
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
          </button>
        </div>
      </div>

      {/* Portal effect */}
      {showPortal && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25">
          <canvas
            ref={portalRef}
            width={500}
            height={500}
            className="absolute"
          />
        </div>
      )}

      {/* Floating binary/hex data */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none z-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-xs font-mono whitespace-nowrap text-indigo-500"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.7,
            }}
          >
            {Array.from({ length: 20 }, () =>
              Math.random() > 0.5
                ? Math.round(Math.random()).toString()
                : "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
            ).join("")}
          </div>
        ))}
      </div>

      {/* Scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none z-40 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 4px",
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
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <path
          d="M0,150 C100,50 300,250 400,150 M0,100 C150,200 250,0 400,100 M50,0 C200,150 100,300 350,200"
          stroke="url(#circuitGradient)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="5,5"
        />

        {/* Circuit nodes */}
        {Array.from({ length: 15 }).map((_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r="3"
              fill="#8b5cf6"
              opacity="0.6"
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
    </div>
  );
};

export default NotFound;
