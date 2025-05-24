import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  Code2,
  Braces,
  Terminal,
  GitBranch,
  Zap,
  Sparkles,
  Github,
  Linkedin,
  Download,
  Monitor,
  Smartphone,
  Database,
  Cloud,
  Globe,
  Cpu,
  ChevronDown,
  ExternalLink,
  Volume2,
  VolumeX,
  Layers,
} from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile, useDeviceDetection } from "@/hooks/use-mobile";

// Performance-optimized type definitions
interface MousePosition {
  x: number;
  y: number;
}

interface AccentColors {
  primary: string;
  secondary: string;
  tertiary: string;
  glow: string;
  gradient: string;
  mesh: string;
  shadow: string;
  border: string;
}

interface TechStackItem {
  icon: React.ComponentType<{
    size?: number;
    style?: React.CSSProperties;
    className?: string;
  }>;
  label: string;
  color: string;
  description: string;
}

interface HologramNode {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface CodeParticle {
  id: string;
  text: string;
  x: number;
  y: number;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

// Performance-optimized animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Unique Interactive Hologram Component
const InteractiveHologram: React.FC<{
  accentColors: AccentColors;
  isActive: boolean;
}> = ({ accentColors, isActive }) => {
  const [nodes, setNodes] = useState<HologramNode[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize hologram nodes (performance optimized)
  useEffect(() => {
    if (!isActive) return;

    const initialNodes: HologramNode[] = Array.from({ length: 12 }, (_, i) => ({
      id: `node-${i}`,
      x: Math.random() * 400,
      y: Math.random() * 400,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.7 + 0.3,
    }));
    setNodes(initialNodes);

    // Optimized animation loop
    const animate = () => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          y: (node.y + node.speed) % 400,
          opacity: 0.3 + Math.sin(Date.now() * 0.001 + node.x) * 0.4,
        }))
      );
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Holographic grid */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke={accentColors.primary}
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor={accentColors.primary}
              stopOpacity="0.8"
            />
            <stop
              offset="100%"
              stopColor={accentColors.secondary}
              stopOpacity="0.2"
            />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.1" />

        {/* Hologram nodes */}
        {nodes.map((node, index) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="url(#nodeGradient)"
              opacity={node.opacity}
            />
            {/* Connection lines between nearby nodes */}
            {nodes.slice(index + 1).map((otherNode) => {
              const distance = Math.sqrt(
                Math.pow(node.x - otherNode.x, 2) +
                  Math.pow(node.y - otherNode.y, 2)
              );
              if (distance < 100) {
                return (
                  <line
                    key={`${node.id}-${otherNode.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={otherNode.x}
                    y2={otherNode.y}
                    stroke={accentColors.primary}
                    strokeWidth="1"
                    opacity={Math.max(0, 0.5 - distance / 200)}
                  />
                );
              }
              return null;
            })}
          </g>
        ))}
      </svg>
    </div>
  );
};

// Unique Code Rain with Interactive Particles
const CodeParticleSystem: React.FC<{
  accentColors: AccentColors;
  isActive: boolean;
}> = ({ accentColors, isActive }) => {
  const [particles, setParticles] = useState<CodeParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const codeSnippets = useMemo(
    () => [
      "const magic = () => {",
      "return innovation;",
      "}",
      "useState(🚀)",
      "useEffect(() => {",
      "createAmazement();",
      "}, [ideas])",
      "npm install dreams",
      "git push origin main",
      "// TODO: Change the world",
    ],
    []
  );

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      if (particles.length < 15) {
        const newParticle: CodeParticle = {
          id: `particle-${Date.now()}-${Math.random()}`,
          text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
          x: Math.random() * (containerRef.current?.clientWidth || 400),
          y: -20,
          velocity: {
            x: (Math.random() - 0.5) * 0.5,
            y: Math.random() * 2 + 1,
          },
          life: 0,
          maxLife: 200 + Math.random() * 100,
        };

        setParticles((prev) => [...prev, newParticle]);
      }
    }, 2000);

    const animationInterval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            life: particle.life + 1,
          }))
          .filter(
            (particle) =>
              particle.life < particle.maxLife &&
              particle.y < (containerRef.current?.clientHeight || 600) + 50
          )
      );
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(animationInterval);
    };
  }, [isActive, particles.length, codeSnippets]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-xs font-mono select-none whitespace-nowrap"
          style={{
            left: particle.x,
            top: particle.y,
            color: accentColors.primary,
            opacity: Math.max(0, 1 - particle.life / particle.maxLife),
          }}
          initial={{ scale: 0, rotateZ: -10 }}
          animate={{ scale: 1, rotateZ: 0 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          {particle.text}
        </motion.div>
      ))}
    </div>
  );
};

// Performance-optimized Neural Network Background
const NeuralNetwork: React.FC<{
  accentColors: AccentColors;
  mousePosition: MousePosition;
}> = ({ accentColors, mousePosition }) => {
  const nodes = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: (i % 3) * 150 + 75,
        y: Math.floor(i / 3) * 100 + 50,
        pulse: i * 0.5,
      })),
    []
  );

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-30"
      style={{ zIndex: 1 }}
    >
      <defs>
        <radialGradient id="neuralGradient">
          <stop
            offset="0%"
            stopColor={accentColors.primary}
            stopOpacity="0.8"
          />
          <stop
            offset="100%"
            stopColor={accentColors.secondary}
            stopOpacity="0.1"
          />
        </radialGradient>
      </defs>

      {/* Neural connections */}
      {nodes.map((node, i) =>
        nodes
          .slice(i + 1)
          .map((otherNode) => (
            <motion.line
              key={`${node.id}-${otherNode.id}`}
              x1={node.x}
              y1={node.y}
              x2={otherNode.x}
              y2={otherNode.y}
              stroke={accentColors.primary}
              strokeWidth="1"
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.1 }}
            />
          ))
      )}

      {/* Neural nodes */}
      {nodes.map((node) => (
        <motion.circle
          key={node.id}
          cx={node.x + mousePosition.x * 10}
          cy={node.y + mousePosition.y * 10}
          r="4"
          fill="url(#neuralGradient)"
          animate={{
            r: [4, 6, 4],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: node.pulse,
          }}
        />
      ))}
    </svg>
  );
};

const Hero: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const isMobile = useIsMobile();
  const deviceDetection = useDeviceDetection();
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.3 });
  const controls = useAnimation();

  // Performance states
  const [isHighPerformance, setIsHighPerformance] = useState(false);
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentMode, setCurrentMode] = useState<
    "normal" | "hologram" | "matrix"
  >("normal");

  // Safe destructuring with fallbacks
  const { navigateToSection = () => {} } = navigation || {};
  const { isDark = true, accent = "purple" } = theme || {};

  // Optimized state management
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [currentWord, setCurrentWord] = useState<number>(0);

  // Performance-optimized mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const mouseYSpring = useSpring(mouseY, { damping: 50, stiffness: 400 });

  // Enhanced rotating words with professional touch
  const rotatingWords: string[] = useMemo(
    () => [
      "Innovator",
      "Architect",
      "Visionary",
      "Creator",
      "Problem Solver",
      "Tech Alchemist",
    ],
    []
  );

  // Performance-optimized accent colors
  const getAccentColors = useCallback((): AccentColors => {
    const colors: Record<string, AccentColors> = {
      purple: {
        primary: "#8B5CF6",
        secondary: "#A855F7",
        tertiary: "#C084FC",
        glow: "rgba(139, 92, 246, 0.3)",
        gradient: "from-purple-400 via-purple-500 to-purple-600",
        mesh: "from-purple-500/20 via-pink-500/20 to-indigo-500/20",
        shadow: "rgba(139, 92, 246, 0.25)",
        border: "rgba(139, 92, 246, 0.5)",
      },
      blue: {
        primary: "#3B82F6",
        secondary: "#60A5FA",
        tertiary: "#93C5FD",
        glow: "rgba(59, 130, 246, 0.3)",
        gradient: "from-blue-400 via-blue-500 to-blue-600",
        mesh: "from-blue-500/20 via-cyan-500/20 to-indigo-500/20",
        shadow: "rgba(59, 130, 246, 0.25)",
        border: "rgba(59, 130, 246, 0.5)",
      },
      pink: {
        primary: "#EC4899",
        secondary: "#F472B6",
        tertiary: "#F9A8D4",
        glow: "rgba(236, 72, 153, 0.3)",
        gradient: "from-pink-400 via-pink-500 to-pink-600",
        mesh: "from-pink-500/20 via-rose-500/20 to-purple-500/20",
        shadow: "rgba(236, 72, 153, 0.25)",
        border: "rgba(236, 72, 153, 0.5)",
      },
      green: {
        primary: "#10B981",
        secondary: "#34D399",
        tertiary: "#6EE7B7",
        glow: "rgba(16, 185, 129, 0.3)",
        gradient: "from-green-400 via-green-500 to-green-600",
        mesh: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
        shadow: "rgba(16, 185, 129, 0.25)",
        border: "rgba(16, 185, 129, 0.5)",
      },
      orange: {
        primary: "#F59E0B",
        secondary: "#FBBF24",
        tertiary: "#FCD34D",
        glow: "rgba(245, 158, 11, 0.3)",
        gradient: "from-orange-400 via-orange-500 to-orange-600",
        mesh: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
        shadow: "rgba(245, 158, 11, 0.25)",
        border: "rgba(245, 158, 11, 0.5)",
      },
    };
    return colors[accent] || colors.purple;
  }, [accent]);

  const accentColors = getAccentColors();

  // Check if device should use background vector image
  const shouldUseBackgroundVector = useMemo(() => {
    return (
      isMobile ||
      deviceDetection.isMobile ||
      deviceDetection.isTablet ||
      deviceDetection.screenSize === "sm" ||
      deviceDetection.screenSize === "xs" ||
      deviceDetection.screenSize === "md"
    );
  }, [isMobile, deviceDetection]);

  // Performance detection
  useEffect(() => {
    const checkPerformance = () => {
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
      const isSlowConnection =
        connection?.effectiveType === "2g" ||
        connection?.effectiveType === "slow-2g";
      const isLowEndDevice = navigator.hardwareConcurrency <= 2;

      setIsHighPerformance(!isSlowConnection && !isLowEndDevice && !shouldUseBackgroundVector);
      setEffectsEnabled(!isSlowConnection && !isLowEndDevice);
    };

    checkPerformance();
  }, [shouldUseBackgroundVector]);

  // Optimized mouse tracking
  useEffect(() => {
    if (!isHighPerformance || shouldUseBackgroundVector) return;

    let ticking = false;
    const handleMouseMove = (e: MouseEvent): void => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 0.5;
          const y = (e.clientY / window.innerHeight - 0.5) * 0.5;
          mouseX.set(x);
          mouseY.set(y);
          setMousePosition({ x, y });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isHighPerformance, shouldUseBackgroundVector]);

  // Word rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  // Initialize animations
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Enhanced navigation functions
  const openLink = useCallback((url: string): void => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const downloadResume = useCallback((): void => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Ilias_Ahmed_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Enhanced tech stack with descriptions
  const techStackData: TechStackItem[] = useMemo(
    () => [
      {
        icon: Monitor,
        label: "Frontend",
        color: accentColors.primary,
        description: "React, Vue, Angular",
      },
      {
        icon: Database,
        label: "Backend",
        color: accentColors.secondary,
        description: "Node.js, Python, Go",
      },
      {
        icon: Cloud,
        label: "Cloud",
        color: accentColors.tertiary,
        description: "AWS, Azure, GCP",
      },
      {
        icon: Smartphone,
        label: "Mobile",
        color: accentColors.primary,
        description: "React Native, Flutter",
      },
      {
        icon: Globe,
        label: "Web3",
        color: accentColors.secondary,
        description: "Blockchain, DeFi, NFT",
      },
      {
        icon: Cpu,
        label: "AI/ML",
        color: accentColors.tertiary,
        description: "TensorFlow, PyTorch",
      },
    ],
    [accentColors]
  );

  // Social links with enhanced actions
  const socialLinks = useMemo(
    () => [
      {
        icon: Github,
        action: () => openLink("https://github.com/iliasahmed"),
        label: "GitHub",
        href: "https://github.com/iliasahmed",
      },
      {
        icon: Linkedin,
        action: () => openLink("https://linkedin.com/in/iliasahmed"),
        label: "LinkedIn",
        href: "https://linkedin.com/in/iliasahmed",
      },
      {
        icon: Download,
        action: downloadResume,
        label: "Resume",
      },
    ],
    [openLink, downloadResume]
  );

  // Dynamic background styles for mobile/tablet
  const backgroundStyles = useMemo(() => {
    if (shouldUseBackgroundVector) {
      return {
        backgroundImage: `url('https://cdn.pixabay.com/photo/2019/10/09/07/28/development-4536630_1280.png')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center right',
        backgroundAttachment: 'scroll', // Changed from fixed for better mobile performance
      };
    }
    return {};
  }, [shouldUseBackgroundVector]);

  return (
    <section
      ref={heroRef}
      id="home"
      className={`relative min-h-screen w-full overflow-hidden flex items-center justify-center ${
        isDark ? "bg-gray-950" : "bg-gray-50"
      }`}
      style={backgroundStyles}
      data-gesture-area="true"
    >
      {/* Performance-Optimized Background System */}
      <div className="absolute inset-0">
        {/* Background overlay for mobile/tablet to ensure text readability */}
        {shouldUseBackgroundVector && (
          <div
            className={`absolute inset-0 z-10 ${
              isDark
                ? "bg-gradient-to-r from-gray-950/95 via-gray-950/85 to-gray-950/50"
                : "bg-gradient-to-r from-gray-50/95 via-gray-50/85 to-gray-50/50"
            }`}
          />
        )}

        {/* Base gradient - always visible */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${accentColors.mesh} ${
            shouldUseBackgroundVector ? "opacity-30" : "opacity-100"
          }`}
          style={{
            backgroundSize: "400% 400%",
            animation: effectsEnabled
              ? "gradientShift 20s ease infinite"
              : "none",
          }}
        />

        {/* High-performance effects - only on desktop */}
        {isHighPerformance && effectsEnabled && !shouldUseBackgroundVector && (
          <>
            {currentMode === "hologram" && (
              <InteractiveHologram
                accentColors={accentColors}
                isActive={true}
              />
            )}

            {currentMode === "matrix" && (
              <CodeParticleSystem accentColors={accentColors} isActive={true} />
            )}

            {currentMode === "normal" && (
              <NeuralNetwork
                accentColors={accentColors}
                mousePosition={mousePosition}
              />
            )}
          </>
        )}

        {/* Simplified particle system for low-end devices or mobile */}
        {effectsEnabled &&
          (shouldUseBackgroundVector || !isHighPerformance) && (
            <div className="absolute inset-0 z-20">
              {[...Array(shouldUseBackgroundVector ? 3 : 4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: accentColors.primary,
                    left: `${25 + i * 20}%`,
                    top: `${30 + i * 15}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>
          )}
      </div>

      {/* Control Panel - Unique Feature - Hidden on mobile for better UX */}
      {!shouldUseBackgroundVector && (
        <motion.div
          className="absolute top-6 right-6 z-50 flex gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {/* Mode Switcher */}
          <motion.button
            className={`p-3 rounded-lg backdrop-blur-lg ${
              isDark ? "bg-gray-900/80" : "bg-white/80"
            } border border-gray-300/30 transition-all duration-300`}
            style={{ borderColor: accentColors.border }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const modes: Array<"normal" | "hologram" | "matrix"> = [
                "normal",
                "hologram",
                "matrix",
              ];
              const currentIndex = modes.indexOf(currentMode);
              setCurrentMode(modes[(currentIndex + 1) % modes.length]);
            }}
            title="Switch Visual Mode"
          >
            <Layers size={18} style={{ color: accentColors.primary }} />
          </motion.button>

          {/* Performance Toggle */}
          <motion.button
            className={`p-3 rounded-lg backdrop-blur-lg ${
              isDark ? "bg-gray-900/80" : "bg-white/80"
            } border border-gray-300/30 transition-all duration-300`}
            style={{ borderColor: accentColors.border }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEffectsEnabled(!effectsEnabled)}
            title="Toggle Effects"
          >
            {effectsEnabled ? (
              <Zap size={18} style={{ color: accentColors.primary }} />
            ) : (
              <Zap size={18} style={{ color: "#6B7280" }} />
            )}
          </motion.button>

          {/* Audio Toggle */}
          <motion.button
            className={`p-3 rounded-lg backdrop-blur-lg ${
              isDark ? "bg-gray-900/80" : "bg-white/80"
            } border border-gray-300/30 transition-all duration-300`}
            style={{ borderColor: accentColors.border }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAudioEnabled(!audioEnabled)}
            title="Toggle Audio"
          >
            {audioEnabled ? (
              <Volume2 size={18} style={{ color: accentColors.primary }} />
            ) : (
              <VolumeX size={18} style={{ color: "#6B7280" }} />
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Main Hero Content */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className={`grid grid-cols-1 ${
            shouldUseBackgroundVector ? "lg:grid-cols-1" : "lg:grid-cols-2"
          } gap-12 items-center min-h-screen`}
        >
          {/* Left Column - Enhanced Content */}
          <div
            className={`text-left space-y-8 ${
              shouldUseBackgroundVector ? "text-center lg:text-left" : ""
            }`}
          >
            {/* Status Indicator with Real-time Clock */}
            <motion.div variants={itemVariants}>
              <motion.div
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-lg shadow-xl border transition-all duration-300 ${
                  isDark
                    ? "bg-gray-900/70 text-gray-300 border-gray-700/50"
                    : "bg-white/80 text-gray-700 border-gray-300/50"
                }`}
                style={{
                  borderColor: accentColors.border,
                  boxShadow: `0 4px 24px ${accentColors.shadow}`,
                }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: accentColors.primary }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Sparkles size={16} style={{ color: accentColors.primary }} />
                <span>Available for Innovation</span>
                <span className="text-xs opacity-60">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </motion.div>
            </motion.div>

            {/* Interactive Greeting */}
            <motion.div variants={itemVariants}>
              <motion.div
                className="flex items-center gap-2 text-xl font-mono cursor-pointer"
                style={{ color: accentColors.primary }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setCurrentMode("matrix")}
              >
                <Terminal size={24} />
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ./initialize_greatness.sh
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Enhanced Name & Title */}
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.h1
                className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-none ${
                  isDark ? "text-white" : "text-gray-900"
                } ${shouldUseBackgroundVector ? "text-shadow-lg" : ""}`}
                whileHover={{ scale: 1.02 }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  ILIAS AHMED
                </motion.span>
                <br />
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${accentColors.primary}, ${accentColors.secondary}, ${accentColors.tertiary})`,
                    backgroundSize: "200% 200%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  initial={{ opacity: 0, x: 50 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Ahmed
                </motion.span>
              </motion.h1>

              {/* Dynamic Subtitle with Skills */}
              <motion.div className="text-lg md:text-xl lg:text-2xl font-semibold h-16 flex flex-col">
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  Full Stack Developer &{" "}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWord}
                    initial={{ opacity: 0, y: 20, rotateX: 90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: -90 }}
                    className="font-bold"
                    style={{ color: accentColors.primary }}
                    transition={{ duration: 0.5 }}
                  >
                    {rotatingWords[currentWord]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Enhanced Description */}
            <motion.div variants={itemVariants}>
              <motion.div
                className={`text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } ${shouldUseBackgroundVector ? "mx-auto lg:mx-0" : ""}`}
              >
                Crafting{" "}
                <motion.span
                  className="font-bold cursor-pointer relative inline-block"
                  style={{ color: accentColors.primary }}
                  whileHover={{ scale: 1.05 }}
                  onHoverStart={() =>
                    !shouldUseBackgroundVector && setCurrentMode("hologram")
                  }
                >
                  digital experiences
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-current block"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>{" "}
                that bridge imagination and reality through cutting-edge
                technology
              </motion.div>
            </motion.div>

            {/* Tech Stack Preview */}
            <motion.div variants={itemVariants}>
              <div
                className={`flex flex-wrap gap-3 ${
                  shouldUseBackgroundVector
                    ? "justify-center lg:justify-start"
                    : ""
                }`}
              >
                {techStackData.slice(0, 4).map((tech, index) => (
                  <motion.div
                    key={tech.label}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                      isDark ? "bg-gray-800/70" : "bg-white/70"
                    } backdrop-blur-sm border border-gray-300/30 cursor-pointer`}
                    style={{ borderColor: accentColors.border }}
                    whileHover={{
                      scale: 1.05,
                      borderColor: accentColors.primary,
                      boxShadow: `0 4px 20px ${accentColors.glow}`,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    title={tech.description}
                  >
                    <tech.icon size={16} style={{ color: tech.color }} />
                    <span className="font-medium">{tech.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Social Links */}
            <motion.div
              variants={itemVariants}
              className={`flex gap-4 ${
                shouldUseBackgroundVector
                  ? "justify-center lg:justify-start"
                  : ""
              }`}
            >
              {socialLinks.map((social, index) => (
                <motion.button
                  key={social.label}
                  onClick={social.action}
                  className={`group relative p-4 rounded-xl transition-all duration-300 ${
                    isDark
                      ? "bg-gray-900/70 hover:bg-gray-800/80 border border-gray-700/50"
                      : "bg-white/70 hover:bg-white/90 border border-gray-300/50"
                  } backdrop-blur-sm`}
                  style={{
                    borderColor: accentColors.border,
                    boxShadow: `0 2px 12px ${accentColors.shadow}`,
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: index % 2 === 0 ? 5 : -5,
                    borderColor: accentColors.primary,
                    boxShadow: `0 8px 32px ${accentColors.glow}`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  aria-label={social.label}
                >
                  <social.icon
                    size={24}
                    style={{ color: accentColors.primary }}
                  />
                  {social.href && (
                    <ExternalLink
                      size={12}
                      className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: accentColors.secondary }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Interactive 3D Visual (Desktop Only) */}
          {!shouldUseBackgroundVector && (
            <motion.div
              variants={itemVariants}
              className="relative flex items-center justify-center"
            >
              <motion.div
                className="relative w-full max-w-2xl"
                style={{
                  x: isHighPerformance ? mouseXSpring : 0,
                  y: isHighPerformance ? mouseYSpring : 0,
                }}
              >
                {/* Enhanced Visual */}
                <motion.div
                  className="relative z-10 flex items-center justify-center"
                  animate={{
                    rotateY: isHighPerformance ? [0, 5, 0, -5, 0] : 0,
                    rotateX: isHighPerformance ? [0, 2, 0, -2, 0] : 0,
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                  onHoverStart={() => setCurrentMode("hologram")}
                >
                  <motion.img
                    src="https://cdn.pixabay.com/photo/2019/10/09/07/28/development-4536630_1280.png"
                    alt="Software Development Visualization"
                    className="w-full h-auto object-contain opacity-90"
                    style={{
                      filter: `drop-shadow(0 0 40px ${accentColors.glow}) brightness(1.2) contrast(1.1)`,
                      mixBlendMode: "screen",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.9, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                  />
                </motion.div>

                {/* Floating Elements */}
                {effectsEnabled && (
                  <>
                    {[Code2, GitBranch, Braces, Zap].map((Icon, index) => (
                      <motion.div
                        key={index}
                        className="absolute p-3 rounded-lg backdrop-blur-sm border"
                        style={{
                          backgroundColor: `${accentColors.primary}15`,
                          borderColor: `${accentColors.primary}30`,
                          left: `${20 + index * 15}%`,
                          top: `${10 + index * 20}%`,
                        }}
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, index % 2 === 0 ? 5 : -5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                      >
                        <Icon
                          size={20}
                          style={{ color: accentColors.primary }}
                          className="opacity-80"
                        />
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 z-40"
        >
          <motion.span
            className={`text-sm font-medium ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Explore the Journey
          </motion.span>
          <motion.button
            className="group relative w-8 h-12 border-2 rounded-full flex justify-center cursor-pointer items-center transition-all duration-300"
            style={{ borderColor: accentColors.border }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => navigateToSection("about")}
            whileHover={{
              scale: 1.1,
              borderColor: accentColors.primary,
              boxShadow: `0 0 20px ${accentColors.glow}`,
            }}
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="group-hover:animate-bounce"
            >
              <ChevronDown size={16} style={{ color: accentColors.primary }} />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>

      {/* Custom CSS for gradient animation */}
      <style>{`
        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </section>
  );
};

export default Hero;
