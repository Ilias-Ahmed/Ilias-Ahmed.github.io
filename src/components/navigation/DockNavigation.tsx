import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Code,
  Workflow,
  User,
  Mail,
  Moon,
  Sun,
  Monitor,
  Command,
  ChevronUp,
  CheckCircle,
} from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import {
  useTheme,
  type ThemeMode,
  type ThemeAccent,
} from "@/contexts/ThemeContext";

// ...existing interfaces...
interface DockNavigationProps {
  className?: string;
  showThemeControls?: boolean;
  showCommandPalette?: boolean;
  iconSize?: "sm" | "md" | "lg";
  position?: "bottom" | "top";
}

// Configuration constants
const SECTION_ICONS = [
  { id: "home", name: "Home", icon: Home },
  { id: "projects", name: "Projects", icon: Code },
  { id: "skills", name: "Skills", icon: Workflow },
  { id: "about", name: "About", icon: User },
  { id: "contact", name: "Contact", icon: Mail },
] as const;

const THEME_ICONS: Record<
  ThemeMode,
  React.ComponentType<{ className?: string }>
> = {
  dark: Moon,
  light: Sun,
  system: Monitor,
};

const ACCENT_COLORS = [
  { name: "purple", color: "bg-purple-500", label: "Purple" },
  { name: "blue", color: "bg-blue-500", label: "Blue" },
  { name: "pink", color: "bg-pink-500", label: "Pink" },
  { name: "green", color: "bg-green-500", label: "Green" },
  { name: "orange", color: "bg-orange-500", label: "Orange" },
] as const;

const SIZE_CONFIGS = {
  sm: {
    icon: "w-4 h-4",
    container: "p-2",
    dock: "h-12",
    spacing: "space-x-1",
  },
  md: {
    icon: "w-5 h-5",
    container: "p-2.5",
    dock: "h-14",
    spacing: "space-x-1.5",
  },
  lg: {
    icon: "w-6 h-6",
    container: "p-3",
    dock: "h-16",
    spacing: "space-x-2",
  },
};

// Optimized DockNavigation component
const DockNavigation: React.FC<DockNavigationProps> = ({
  className = "",
  showThemeControls = true,
  iconSize = "md",
  position = "bottom",
}) => {
  // Hooks
  const navigation = useNavigation();
  const theme = useTheme();
  const systemTrayRef = useRef<HTMLDivElement>(null);

  // State
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [isSystemTrayOpen, setIsSystemTrayOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Safe destructuring with fallbacks
  const {
    activeSection = "home",
    navigateToSection = () => {},
    sections = [],
  } = navigation || {};

  const {
    mode = "dark",
    accent = "purple",
    setTheme = () => {},
    setAccent = () => {},
    isDark = true,
  } = theme || {};

  // Get size configuration
  const config = SIZE_CONFIGS[iconSize];

  // Memoized available sections to prevent unnecessary re-renders
  const availableSections = useMemo(() => {
    return SECTION_ICONS.filter((iconConfig) =>
      sections.some((section) => section.id === iconConfig.id)
    );
  }, [sections]);

  // Memoized haptic feedback function
  const hapticFeedback = useCallback(
    (intensity: "light" | "medium" | "heavy" = "medium") => {
      try {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          const patterns = { light: 20, medium: 50, heavy: 100 };
          navigator.vibrate(patterns[intensity]);
        }
      } catch (error) {
        console.debug("Haptic feedback not available:", error);
      }
    },
    []
  );

  // Optimized navigation handler
  const handleNavigation = useCallback(
    (sectionId: string) => {
      try {
        navigateToSection(sectionId);
        hapticFeedback("light");
      } catch (error) {
        console.error("Navigation failed:", error);
      }
    },
    [navigateToSection, hapticFeedback]
  );

  // Optimized mouse handlers
  const handleMouseEnter = useCallback((iconId: string) => {
    setHoveredIcon(iconId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIcon(null);
  }, []);

  // Icon scale calculation for dock effect
  const getIconScale = useCallback(
    (iconId: string, index: number) => {
      if (hoveredIcon === iconId) return 1.2;
      if (
        hoveredIcon &&
        Math.abs(
          availableSections.findIndex((s) => s.id === hoveredIcon) - index
        ) === 1
      ) {
        return 1.1;
      }
      return 1;
    },
    [hoveredIcon, availableSections]
  );

  // Optimized theme handlers
  const handleThemeChange = useCallback(
    (newMode: ThemeMode) => {
      setTheme(newMode);
      hapticFeedback("light");
    },
    [setTheme, hapticFeedback]
  );

  const handleAccentChange = useCallback(
    (newAccent: ThemeAccent) => {
      setAccent(newAccent);
      hapticFeedback("light");
    },
    [setAccent, hapticFeedback]
  );

  // Time update effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Click outside to close system tray
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        systemTrayRef.current &&
        !systemTrayRef.current.contains(event.target as Node)
      ) {
        setIsSystemTrayOpen(false);
      }
    };

    if (isSystemTrayOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSystemTrayOpen]);

  // Animation variants
  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      y: position === "bottom" ? 10 : -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <div
      className={`fixed ${position === "bottom" ? "bottom-6" : "top-6"}
        left-1/2 transform -translate-x-1/2 z-40 ${className}`}
    >
      {/* Main Dock */}
      <motion.div
        className={`flex items-center ${config.spacing} ${config.dock}
          bg-background/80 backdrop-blur-xl border border-border/50
          rounded-2xl px-4 shadow-2xl`}
        initial={{ opacity: 0, y: position === "bottom" ? 50 : -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Navigation Icons */}
        {availableSections.map((iconConfig, index) => {
          const isActive = activeSection === iconConfig.id;
          const IconComponent = iconConfig.icon;
          const scale = getIconScale(iconConfig.id, index);

          return (
            <div key={iconConfig.id} className="relative">
              <motion.button
                className={`relative ${
                  config.container
                } rounded-xl transition-all duration-300
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-lg"
                      : isDark
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-600 hover:text-black hover:bg-black/10"
                  }`}
                onClick={() => handleNavigation(iconConfig.id)}
                onMouseEnter={() => handleMouseEnter(iconConfig.id)}
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Navigate to ${iconConfig.name}`}
              >
                <IconComponent className={config.icon} />

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2
                      w-1 h-1 bg-primary rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredIcon === iconConfig.id && (
                  <motion.div
                    variants={tooltipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className={`absolute ${
                      position === "bottom"
                        ? "bottom-full mb-2"
                        : "top-full mt-2"
                    } left-1/2 transform -translate-x-1/2 px-3 py-1
                      bg-popover border border-border rounded-lg text-xs font-medium
                      whitespace-nowrap pointer-events-none backdrop-blur-sm z-50 shadow-lg`}
                  >
                    {iconConfig.name}
                    <div
                      className={`absolute left-1/2 transform -translate-x-1/2 ${
                        position === "bottom" ? "top-full" : "bottom-full"
                      } w-0 h-0 border-l-2 border-r-2 border-transparent ${
                        position === "bottom"
                          ? "border-t-2 border-t-border"
                          : "border-b-2 border-b-border"
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Separator */}
        <div className="w-px h-8 bg-border/50 mx-2" />

        {/* System Tray Toggle */}
        <div className="relative" ref={systemTrayRef}>
          <motion.button
            className={`${
              config.container
            } rounded-xl transition-all duration-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                isDark
                  ? "text-gray-300 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-black hover:bg-black/10"
              }`}
            onClick={() => setIsSystemTrayOpen(!isSystemTrayOpen)}
            onMouseEnter={() => handleMouseEnter("systemTray")}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open system tray"
            aria-expanded={isSystemTrayOpen}
          >
            <motion.div
              animate={{ rotate: isSystemTrayOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronUp className={config.icon} />
            </motion.div>
          </motion.button>

          {/* System Tray Menu */}
          <AnimatePresence>
            {isSystemTrayOpen && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`absolute ${
                  position === "bottom" ? "bottom-full mb-2" : "top-full mt-2"
                } left-1/2 transform -translate-x-1/2 w-72
                  bg-popover border border-border rounded-xl shadow-xl
                  backdrop-blur-xl p-4 z-50`}
              >
                <div className="space-y-4">
                  {/* Time Display */}
                  <div className="text-center">
                    <div className="text-lg font-mono">
                      {currentTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {currentTime.toLocaleDateString()}
                    </div>
                  </div>

                  {/* Theme Selection */}
                  {showThemeControls && (
                    <div className="mb-4">
                      <div className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wide">
                        Appearance
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(["light", "dark", "system"] as ThemeMode[]).map(
                          (themeMode) => {
                            const ThemeIcon = THEME_ICONS[themeMode];
                            const isActive = mode === themeMode;

                            return (
                              <motion.button
                                key={themeMode}
                                onClick={() => handleThemeChange(themeMode)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-lg
                                transition-all duration-200 text-xs ${
                                  isActive
                                    ? "bg-primary/20 text-primary border border-primary/30"
                                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                aria-label={`Switch to ${themeMode} theme`}
                              >
                                <ThemeIcon className="w-4 h-4" />
                                <span className="capitalize">{themeMode}</span>
                                {isActive && (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                              </motion.button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {/* Accent Colors */}
                  <div className="mb-4">
                    <div className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wide">
                      Accent Color
                    </div>
                    <div className="flex gap-2 justify-center">
                      {ACCENT_COLORS.map((color) => (
                        <motion.button
                          key={color.name}
                          onClick={() => handleAccentChange(color.name)}
                          className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200
                            ${color.color} ${
                            accent === color.name
                              ? "border-foreground scale-110 shadow-lg"
                              : "border-transparent hover:border-foreground/50"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={`Set accent color to ${color.label}`}
                        >
                          {accent === color.name && (
                            <CheckCircle className="absolute inset-0 m-auto w-4 h-4 text-white" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Command Palette Trigger */}
                  <motion.button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("openCommandPalette")
                      );
                      setIsSystemTrayOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg
                      hover:bg-accent transition-colors text-left"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Command className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Command Palette</div>
                      <div className="text-xs text-muted-foreground">
                        Quick navigation and search
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono bg-accent/20 px-2 py-1 rounded">
                      ⌘K
                    </div>
                  </motion.button>
                </div>

                {/* Arrow indicator */}
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 ${
                    position === "bottom" ? "top-full" : "bottom-full"
                  } w-0 h-0 border-l-4 border-r-4 border-transparent ${
                    position === "bottom"
                      ? "border-t-4 border-t-border"
                      : "border-b-4 border-b-border"
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredIcon === "systemTray" && !isSystemTrayOpen && (
              <motion.div
                variants={tooltipVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`absolute ${
                  position === "bottom" ? "bottom-full mb-2" : "top-full mt-2"
                } left-1/2 transform -translate-x-1/2 px-3 py-1
                  bg-popover border border-border rounded-lg text-xs font-medium
                  whitespace-nowrap pointer-events-none backdrop-blur-sm z-50 shadow-lg`}
              >
                System Tray
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 ${
                    position === "bottom" ? "top-full" : "bottom-full"
                  } w-0 h-0 border-l-2 border-r-2 border-transparent ${
                    position === "bottom"
                      ? "border-t-2 border-t-border"
                      : "border-b-2 border-b-border"
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(DockNavigation);
