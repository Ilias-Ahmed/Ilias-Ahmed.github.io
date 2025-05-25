import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  ChevronDown,
  Download,
  Github,
  Linkedin,
  Mail,
  Code2,
  Sparkles,
  Terminal,
  Zap,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useBackground } from "@/contexts/BackgroundContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ControlPanel from "@/components/ui/ControlPanel";


interface SocialLink {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href?: string;
  action?: () => void;
  label: string;
  description: string;
}

// Constants
const ROTATING_ROLES = [
  "Full Stack Developer",
  "UI/UX Designer",
  "Cloud Architect",
  "Tech Innovator",
  "Problem Solver",
  "Digital Creator",
];

const ROLE_ROTATION_INTERVAL = 3000;
const PULSE_ANIMATION_DURATION = 2000;
const FLOATING_ANIMATION_DURATION = 4000;
const MOUSE_MOVE_MULTIPLIER = 0.05;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

// AccentColors type definition
interface AccentColors {
  primary: string;
  border: string;
  glow: string;
}

// Status Badge Component
const StatusBadge: React.FC<{ accentColors: AccentColors; isDark: boolean }> = ({
  accentColors,
  isDark,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-4 z-50"
    >
      <div
        className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm
          backdrop-blur-lg border shadow-lg transition-all duration-300"
        style={{
          backgroundColor: isDark
            ? "rgba(17, 24, 39, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          borderColor: accentColors.border,
          backdropFilter: "blur(20px)",
        }}
      >
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: accentColors.primary }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: PULSE_ANIMATION_DURATION / 1000,
            repeat: Infinity,
          }}
        />
        <Sparkles size={14} style={{ color: accentColors.primary }} />
        <span className="font-medium">Available for hire</span>
        <span className="text-xs opacity-70">{formatTime(currentTime)}</span>
      </div>
    </motion.div>
  );
};

// Floating Icon Component
const FloatingIcon: React.FC<{
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  index: number;
  accentColors: AccentColors;
}> = ({ Icon, index, accentColors }) => {
  const positions = [
    { left: "10%", top: "15%" },
    { left: "30%", top: "30%" },
    { left: "50%", top: "45%" },
    { left: "70%", top: "60%" },
  ];

  const position = positions[index] || positions[0];

  return (
    <motion.div
      className="absolute p-2 rounded-lg backdrop-blur-sm border"
      style={{
        ...position,
        backgroundColor: `${accentColors.primary}20`,
        borderColor: `${accentColors.primary}30`,
      }}
      animate={{
        y: [0, -10, 0],
        rotate: [0, index % 2 === 0 ? 5 : -5, 0],
      }}
      transition={{
        duration: FLOATING_ANIMATION_DURATION / 1000,
        repeat: Infinity,
        delay: index * 0.5,
      }}
      whileHover={{ scale: 1.2 }}
    >
      <Icon size={16} style={{ color: accentColors.primary }} />
    </motion.div>
  );
};

// Main Hero Component
const Hero: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { isDark, getAccentColors } = useTheme();
  const accentColors: AccentColors = getAccentColors() as unknown as AccentColors;
  const { setCurrentSection } = useBackground();
  const { navigateToSection } = useNavigation();
  const isMobile = useIsMobile();

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = useMemo(() => ({ stiffness: 100, damping: 30 }), []);
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Social links configuration
  const socialLinks: SocialLink[] = useMemo(
    () => [
      {
        icon: Github,
        href: "https://github.com/Ilias-Ahmed",
        label: "GitHub",
        description: "View my open source projects",
      },
      {
        icon: Linkedin,
        href: "https://www.linkedin.com/in/ilias-ahmed9613/",
        label: "LinkedIn",
        description: "Connect with me professionally",
      },
      {
        icon: Mail,
        href: "mailto:ilias.ahmed.dev@gmail.com",
        label: "Email",
        description: "Get in touch directly",
      },
      {
        icon: Download,
        action: () => {
          try {
            const link = document.createElement("a");
            link.href = "/resume.pdf";
            link.download = "Ilias_Ahmed_Resume.pdf";
            link.click();
          } catch (error) {
            console.error("Failed to download resume:", error);
          }
        },
        label: "Resume",
        description: "Download my CV",
      },
    ],
    []
  );

  // Optimized mouse tracking
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile || !heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseXPos =
        (e.clientX - rect.left - centerX) * MOUSE_MOVE_MULTIPLIER;
      const mouseYPos =
        (e.clientY - rect.top - centerY) * MOUSE_MOVE_MULTIPLIER;

      mouseX.set(mouseXPos);
      mouseY.set(mouseYPos);
    },
    [mouseX, mouseY, isMobile]
  );

  // Handle social link clicks
  const handleSocialClick = useCallback(
    (social: SocialLink) => (e: React.MouseEvent) => {
      e.preventDefault();

      if (social.action) {
        social.action();
      } else if (social.href) {
        window.open(social.href, "_blank", "noopener,noreferrer");
      }
    },
    []
  );

  // Handle navigation
  const handleViewWork = useCallback(() => {
    navigateToSection("projects");
  }, [navigateToSection]);

  const handleGetInTouch = useCallback(() => {
    navigateToSection("contact");
  }, [navigateToSection]);

  const handleScrollDown = useCallback(() => {
    navigateToSection("about");
  }, [navigateToSection]);

  // Role rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % ROTATING_ROLES.length);
    }, ROLE_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Component mount effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Set current section for background system
  useEffect(() => {
    setCurrentSection("hero");
  }, [setCurrentSection]);

  // Background styles
  const backgroundStyles = useMemo(
    () => ({
      backgroundImage: isMobile
        ? `url('https://cdn.pixabay.com/photo/2019/10/09/07/28/development-4536630_1280.png')`
        : "none",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center right",
    }),
    [isMobile]
  );

  const overlayStyles = useMemo(
    () => ({
      background: isDark
        ? "linear-gradient(to right, rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.5))"
        : "linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.5))",
    }),
    [isDark]
  );

  const floatingIcons = [Code2, Terminal, Zap, Sparkles];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      id="hero"
      style={backgroundStyles}
    >
      {/* Status Badge */}
      <StatusBadge accentColors={accentColors} isDark={isDark} />

      {/* Control Panel */}
      <ControlPanel />

      {/* Background overlay for mobile readability */}
      {isMobile && <div className="absolute inset-0" style={overlayStyles} />}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen"
        >
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Terminal greeting */}
            <motion.div variants={itemVariants}>
              <div
                className="flex items-center gap-2 font-mono text-sm"
                style={{ color: accentColors.primary }}
              >
                <Terminal size={16} />
                <span>$ whoami</span>
              </div>
            </motion.div>

            {/* Main title */}
            <motion.div variants={titleVariants} className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block" style={{ color: accentColors.primary }}>
                  Ilias Ahmed
                </span>
              </h1>

              {/* Dynamic role */}
              <div className="h-12 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentRole}
                    initial={{ opacity: 0, y: 20, rotateX: 90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: -90 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-xl md:text-2xl lg:text-3xl font-medium opacity-70"
                  >
                    {ROTATING_ROLES[currentRole]}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl opacity-80 max-w-2xl leading-relaxed"
            >
              Crafting exceptional digital experiences with modern technologies.
              I transform ideas into powerful, scalable solutions that make a
              real impact.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                className="group px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-white"
                style={{
                  backgroundColor: accentColors.primary,
                  boxShadow: `0 4px 14px ${accentColors.glow}`,
                }}
                onClick={handleViewWork}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  <Code2 size={18} />
                  View My Work
                  <Zap
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </span>
              </motion.button>

              <motion.button
                className="group px-6 py-3 rounded-lg transition-all duration-300 font-medium border-2"
                style={{
                  borderColor: accentColors.border,
                  backgroundColor: `${accentColors.primary}10`,
                }}
                onClick={handleGetInTouch}
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  backgroundColor: `${accentColors.primary}20`,
                }}
                whileTap={{ scale: 0.98 }}
              >
                Get In Touch
              </motion.button>
            </motion.div>

            {/* Social links */}
            <motion.div variants={itemVariants} className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.button
                  key={social.label}
                  onClick={handleSocialClick(social)}
                  className="group p-3 rounded-lg border-2 transition-all duration-300 backdrop-blur-sm relative"
                  style={{
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                  }}
                  whileHover={{
                    scale: 1.1,
                    y: -2,
                    borderColor: accentColors.primary,
                    backgroundColor: `${accentColors.primary}10`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  title={social.description}
                  aria-label={social.description}
                >
                  <social.icon
                    size={20}
                    className="transition-colors duration-300 group-hover:text-current"
                  />
                  {social.href && (
                    <ExternalLink
                      size={12}
                      className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: accentColors.primary }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Visual (Desktop only) */}
          {!isMobile && (
            <motion.div
              variants={itemVariants}
              className="relative flex items-center justify-center"
              style={{ x, y }}
            >
              <motion.div
                className="relative w-full max-w-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://cdn.pixabay.com/photo/2019/10/09/07/28/development-4536630_1280.png"
                  alt="Development Illustration"
                  className="w-full h-auto object-contain opacity-90"
                  style={{
                    filter: `drop-shadow(0 0 40px ${accentColors.glow})`,
                  }}
                  loading="lazy"
                />

                {/* Floating elements around the image */}
                {floatingIcons.map((Icon, index) => (
                  <FloatingIcon
                    key={index}
                    Icon={Icon}
                    index={index}
                    accentColors={accentColors}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-sm opacity-70">Scroll to explore</span>
          <motion.button
            onClick={handleScrollDown}
            className="p-2 rounded-full border-2 transition-all duration-300"
            style={{
              borderColor: accentColors.border,
              backgroundColor: `${accentColors.primary}10`,
            }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{
              scale: 1.1,
              borderColor: accentColors.primary,
              backgroundColor: `${accentColors.primary}20`,
            }}
            aria-label="Scroll to next section"
          >
            <ChevronDown
              size={20}
              className="transition-colors"
              style={{ color: accentColors.primary }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
