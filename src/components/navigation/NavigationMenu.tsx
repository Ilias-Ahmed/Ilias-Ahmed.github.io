import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useHeroStore } from "@/hooks/useHero";
import CyberThemeToggle from "../ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { Sparkles, Compass, Zap } from "lucide-react";

interface NavigationMenuProps {
  currentPath: string;
}

const navItems = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/about", label: "About", icon: "👨‍💻" },
  { path: "/skills", label: "Skills", icon: "🛠️" },
  { path: "/projects", label: "Projects", icon: "🚀" },
  { path: "/contact", label: "Contact", icon: "📬" },
];

const NavigationMenu = ({ currentPath }: NavigationMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  // Use hero store for 3D mode settings
  const {
    mode,
    setMode,
    timeOfDay,
    setTimeOfDay,
    cameraAutoRotate,
    toggleCameraAutoRotate,
    enableParticles,
    toggleParticles,
    enablePostProcessing,
    togglePostProcessing,
    incrementInteraction,
  } = useHeroStore();

  const { accent, isDark } = useTheme();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  // Handle navigation
  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
      setIsOpen(false);
      incrementInteraction();
    },
    [navigate, incrementInteraction]
  );

  // Dynamic styles
  const accentGradient = useMemo(() => {
    const colors = {
      blue: ["#2563eb", "#60a5fa"],
      green: ["#059669", "#10b981"],
      amber: ["#d97706", "#f59e0b"],
      pink: ["#db2777", "#ec4899"],
      purple: ["#7c3aed", "#8b5cf6"],
    };
    const [light, dark] = colors[accent] ?? colors.purple;
    return `linear-gradient(to right, ${isDark ? dark : light}, ${
      isDark ? light : dark
    })`;
  }, [accent, isDark]);

  const menuBg = useMemo(
    () => (isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)"),
    [isDark]
  );

  const getTextColor = useCallback(
    (isActive: boolean) =>
      isActive
        ? isDark
          ? "text-white"
          : "text-gray-900"
        : isDark
        ? "text-gray-400 hover:text-white"
        : "text-gray-500 hover:text-gray-900",
    [isDark]
  );

  // 3D perspective styles
  const perspective = "perspective(1000px)";

  return (
    <>
      {/* Theme Toggle */}
      <div className="fixed top-4 left-4 z-50">
        <CyberThemeToggle isGlitching={mode === "creative"} />
      </div>

      {/* Menu Button with 3D effect */}
      <motion.button
        className={`fixed top-4 right-4 z-50 w-12 h-12 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center
          border border-${accent}-500/50 ${
          isDark ? "bg-gray-900/80" : "bg-white/80"
        }`}
        style={{
          boxShadow: `0 0 20px ${
            isDark ? `rgba(139,92,246,0.4)` : `rgba(139,92,246,0.3)`
          }`,
          transform: perspective,
        }}
        onClick={() => {
          setIsOpen((prev) => !prev);
          incrementInteraction();
        }}
        animate={{
          rotate: isOpen ? 45 : 0,
          scale: isOpen ? 1.2 : 1,
          y: isOpen ? 5 : 0,
        }}
        whileHover={{
          scale: 1.1,
          rotateY: [-5, 5, -5, 0],
          transition: { duration: 0.5 },
        }}
        whileTap={{ scale: 0.9 }}
        data-cursor-hover="true"
      >
        <span className={`text-${accent}-${isDark ? "400" : "500"} text-2xl`}>
          {isOpen ? "✕" : "☰"}
        </span>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isOpen
              ? [
                  `0 0 20px rgba(139,92,246,0.4)`,
                  `0 0 30px rgba(139,92,246,0.6)`,
                  `0 0 20px rgba(139,92,246,0.4)`,
                ]
              : `0 0 15px rgba(139,92,246,0.3)`,
          }}
          transition={{
            duration: 2,
            repeat: isOpen ? Infinity : 0,
            repeatType: "reverse",
          }}
        />
      </motion.button>

      {/* Full-Screen Menu with 3D effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ clipPath: "circle(0% at 95% 5%)" }}
            animate={{
              clipPath: "circle(150% at 95% 5%)",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.7,
              },
            }}
            exit={{
              clipPath: "circle(0% at 95% 5%)",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.5,
              },
            }}
          >
            <div
              className="absolute inset-0 backdrop-blur-xl"
              style={{ backgroundColor: menuBg }}
            />

            {/* 3D Grid Background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to right, ${
                    isDark ? "#1e293b20" : "#e2e8f020"
                  } 1px, transparent 1px),
                                   linear-gradient(to bottom, ${
                                     isDark ? "#1e293b20" : "#e2e8f020"
                                   } 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                  transform: perspective,
                }}
                animate={{
                  y: [0, 20],
                  x: [0, 10],
                  rotateX: [0, 10],
                  rotateY: [0, 5],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Floating particles for creative mode */}
            {mode === "creative" && enableParticles && (
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full bg-${accent}-500/60`}
                    initial={{
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight,
                      opacity: Math.random() * 0.7 + 0.3,
                    }}
                    animate={{
                      x: [
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerWidth,
                      ],
                      y: [
                        Math.random() * window.innerHeight,
                        Math.random() * window.innerHeight,
                        Math.random() * window.innerHeight,
                      ],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 10 + Math.random() * 20,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "linear",
                    }}
                  />
                ))}
              </div>
            )}

            <div className="relative z-10 flex flex-col md:flex-row gap-8 w-full max-w-6xl px-4">
              {/* Main Navigation */}
              <nav className="flex-1">
                <ul className="space-y-6">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.path}
                      initial={{ y: 50, opacity: 0, rotateX: 30 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 24,
                          delay: index * 0.1,
                        },
                      }}
                      onHoverStart={() => setHoverIndex(index)}
                      onHoverEnd={() => setHoverIndex(null)}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <motion.button
                        onClick={() => handleNavigation(item.path)}
                        className={`flex items-center text-2xl md:text-4xl font-bold px-8 py-4 rounded-xl transition-all duration-300 group w-full text-left ${getTextColor(
                          currentPath === item.path
                        )}`}
                        data-cursor-hover="true"
                        whileHover={{
                          scale: 1.05,
                          z: 20,
                          transition: { duration: 0.2 },
                        }}
                        animate={{
                          rotateY: hoverIndex === index ? [-5, 5, -5, 0] : 0,
                          z: hoverIndex === index ? 20 : 0,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: hoverIndex === index ? Infinity : 0,
                          repeatType: "loop",
                        }}
                        style={{
                          transformStyle: "preserve-3d",
                          transform: perspective,
                          boxShadow:
                            currentPath === item.path
                              ? `0 10px 30px -10px ${
                                  isDark
                                    ? "rgba(139,92,246,0.3)"
                                    : "rgba(139,92,246,0.2)"
                                }`
                              : "none",
                          background:
                            currentPath === item.path
                              ? isDark
                                ? "rgba(30, 41, 59, 0.5)"
                                : "rgba(255, 255, 255, 0.5)"
                              : "transparent",
                        }}
                      >
                        <motion.span
                          className="mr-6 text-3xl md:text-5xl transform group-hover:rotate-12 transition-transform duration-300"
                          animate={
                            mode === "creative" && currentPath === item.path
                              ? {
                                  rotateY: [0, 360],
                                  transition: {
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                  },
                                }
                              : {}
                          }
                        >
                          {item.icon}
                        </motion.span>
                        <span className="relative">
                          {item.label}
                          {currentPath === item.path && (
                            <motion.span
                              className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                              style={{ background: accentGradient }}
                              layoutId="activeNavIndicator"
                              animate={{
                                opacity:
                                  mode === "creative" ? [0.7, 1, 0.7] : 1,
                                width:
                                  mode === "creative"
                                    ? ["100%", "80%", "100%"]
                                    : "100%",
                              }}
                              transition={{
                                duration: 2,
                                repeat: mode === "creative" ? Infinity : 0,
                                repeatType: "reverse",
                              }}
                            />
                          )}
                        </span>

                        {/* 3D hover effect */}
                        {hoverIndex === index && (
                          <motion.div
                            className="absolute inset-0 rounded-xl -z-10"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 0.15,
                              background: `linear-gradient(135deg, transparent 0%, ${
                                isDark
                                  ? `rgba(139,92,246,0.3)`
                                  : `rgba(139,92,246,0.2)`
                              } 50%, transparent 100%)`,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Settings Panel */}
              <div className="md:w-80 p-6 rounded-2xl backdrop-blur-md"
                style={{
                  background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                  boxShadow: `0 10px 30px -10px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
                  transform: perspective
                }}>
                <motion.h3
                  className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Experience Settings
                </motion.h3>

                {/* Mode Selector */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, x: 20                  }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Mode
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <motion.button
                      className={`p-3 rounded-lg flex flex-col items-center justify-center text-xs font-medium
                        ${mode === 'developer'
                          ? `bg-${accent}-500/20 border border-${accent}-500/50`
                          : `border border-${accent}-500/10 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}
                        ${isDark ? 'text-white' : 'text-gray-900'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setMode('developer');
                        incrementInteraction();
                      }}
                      data-cursor-hover="true"
                    >
                      <Sparkles className={`w-5 h-5 mb-1 ${mode === 'developer' ? `text-${accent}-400` : ''}`} />
                      Developer
                    </motion.button>

                    <motion.button
                      className={`p-3 rounded-lg flex flex-col items-center justify-center text-xs font-medium
                        ${mode === 'designer'
                          ? `bg-${accent}-500/20 border border-${accent}-500/50`
                          : `border border-${accent}-500/10 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}
                        ${isDark ? 'text-white' : 'text-gray-900'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setMode('designer');
                        incrementInteraction();
                      }}
                      data-cursor-hover="true"
                    >
                      <Zap className={`w-5 h-5 mb-1 ${mode === 'designer' ? `text-${accent}-400` : ''}`} />
                      Designer
                    </motion.button>

                    <motion.button
                      className={`p-3 rounded-lg flex flex-col items-center justify-center text-xs font-medium
                        ${mode === 'creative'
                          ? `bg-${accent}-500/20 border border-${accent}-500/50`
                          : `border border-${accent}-500/10 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}
                        ${isDark ? 'text-white' : 'text-gray-900'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setMode('creative');
                        incrementInteraction();
                      }}
                      data-cursor-hover="true"
                    >
                      <Compass className={`w-5 h-5 mb-1 ${mode === 'creative' ? `text-${accent}-400` : ''}`} />
                      Creative
                    </motion.button>
                  </div>
                </motion.div>

                {/* Time of Day Selector */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Time of Day
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['morning', 'day', 'evening', 'night'].map((time) => (
                      <motion.button
                        key={time}
                        className={`p-2 rounded-lg flex flex-col items-center justify-center text-xs font-medium
                          ${timeOfDay === time
                            ? `bg-${accent}-500/20 border border-${accent}-500/50`
                            : `border border-${accent}-500/10 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}
                          ${isDark ? 'text-white' : 'text-gray-900'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setTimeOfDay(time as "morning" | "day" | "evening" | "night");
                          incrementInteraction();
                        }}
                        data-cursor-hover="true"
                      >
                        <span className="text-lg mb-1">
                          {time === 'morning' ? '🌅' :
                           time === 'day' ? '☀️' :
                           time === 'evening' ? '🌆' : '🌙'}
                        </span>
                        <span className="capitalize">{time}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Toggle Switches */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {/* Camera Auto-Rotate */}
                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Camera Auto-Rotate
                    </div>
                    <motion.button
                      className={`w-12 h-6 rounded-full relative ${
                        cameraAutoRotate
                          ? `bg-${accent}-500`
                          : isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}
                      onClick={() => {
                        toggleCameraAutoRotate();
                        incrementInteraction();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-cursor-hover="true"
                    >
                      <motion.div
                        className={`absolute top-1 w-4 h-4 rounded-full ${isDark ? 'bg-gray-200' : 'bg-white'}`}
                        animate={{
                          left: cameraAutoRotate ? 'calc(100% - 20px)' : '4px',
                          backgroundColor: cameraAutoRotate ? (isDark ? 'rgb(255, 255, 255)' : 'rgb(255, 255, 255)') : ''
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>

                  {/* Particles */}
                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Particles
                    </div>
                    <motion.button
                      className={`w-12 h-6 rounded-full relative ${
                        enableParticles
                          ? `bg-${accent}-500`
                          : isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}
                      onClick={() => {
                        toggleParticles();
                        incrementInteraction();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-cursor-hover="true"
                    >
                      <motion.div
                        className={`absolute top-1 w-4 h-4 rounded-full ${isDark ? 'bg-gray-200' : 'bg-white'}`}
                        animate={{
                          left: enableParticles ? 'calc(100% - 20px)' : '4px',
                          backgroundColor: enableParticles ? (isDark ? 'rgb(255, 255, 255)' : 'rgb(255, 255, 255)') : ''
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>

                  {/* Post Processing */}
                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Post Processing
                    </div>
                    <motion.button
                      className={`w-12 h-6 rounded-full relative ${
                        enablePostProcessing
                          ? `bg-${accent}-500`
                          : isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}
                      onClick={() => {
                        togglePostProcessing();
                        incrementInteraction();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-cursor-hover="true"
                    >
                      <motion.div
                        className={`absolute top-1 w-4 h-4 rounded-full ${isDark ? 'bg-gray-200' : 'bg-white'}`}
                        animate={{
                          left: enablePostProcessing ? 'calc(100% - 20px)' : '4px',
                          backgroundColor: enablePostProcessing ? (isDark ? 'rgb(255, 255, 255)' : 'rgb(255, 255, 255)') : ''
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Mode indicator */}
                <motion.div
                  className={`mt-6 text-center text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full bg-${accent}-500 animate-pulse`}></span>
                    <span>MODE: {mode.toUpperCase()}</span>
                    <span className={`inline-block w-2 h-2 rounded-full bg-${accent}-500 animate-pulse`}></span>
                  </div>
                  {mode === "creative" && (
                    <motion.div
                      className="mt-2 text-xs"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      CREATIVE MODE ACTIVE
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationMenu;

