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
  Settings,
  Command,
  ChevronUp,
  Volume2,
  Wifi,
  Battery,
  CheckCircle,
  X,
  Mic,
  MicOff,
  Keyboard,
  Palette,
  HelpCircle,
  ArrowUp,
} from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import {
  useTheme,
  type ThemeMode,
  type ThemeAccent,
} from "@/contexts/ThemeContext";

// Type definitions
interface SectionIcon {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AccentColor {
  name: ThemeAccent;
  color: string;
  label: string;
}

interface SizeConfig {
  icon: string;
  container: string;
  dock: string;
  spacing: string;
}

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
  enabled?: boolean;
  badge?: string;
}

interface DockNavigationProps {
  className?: string;
  showThemeControls?: boolean;
  showCommandPalette?: boolean;
  iconSize?: "sm" | "md" | "lg";
  position?: "bottom" | "top";
}

// Configuration constants
const SECTION_ICONS: readonly SectionIcon[] = [
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

const ACCENT_COLORS: readonly AccentColor[] = [
  { name: "purple", color: "bg-purple-500", label: "Purple" },
  { name: "blue", color: "bg-blue-500", label: "Blue" },
  { name: "pink", color: "bg-pink-500", label: "Pink" },
  { name: "green", color: "bg-green-500", label: "Green" },
  { name: "orange", color: "bg-orange-500", label: "Orange" },
] as const;

const SIZE_CONFIGS: Record<string, SizeConfig> = {
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
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

const tooltipVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// Utility functions for notifications
const showNotification = (
  message: string,
  type: "success" | "info" | "error" | "warning" = "info"
) => {
  // Enhanced notification system
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 z-[100] p-4 rounded-lg shadow-lg border backdrop-blur-sm max-w-sm ${
    type === "success"
      ? "bg-green-500/90 border-green-400 text-white"
      : type === "error"
      ? "bg-red-500/90 border-red-400 text-white"
      : type === "warning"
      ? "bg-yellow-500/90 border-yellow-400 text-black"
      : "bg-blue-500/90 border-blue-400 text-white"
  } text-sm font-medium transform transition-all duration-300 translate-x-full`;

  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <div class="w-2 h-2 rounded-full bg-current opacity-75"></div>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
};

// Main component
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
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  // Time update effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Battery level monitoring
  useEffect(() => {
    const updateBattery = async () => {
      try {
        if ("getBattery" in navigator) {
          interface BatteryManager {
            level: number;
            addEventListener: (type: string, listener: EventListener) => void;
          }
          const battery = await (navigator as { getBattery(): Promise<BatteryManager> }).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));

          battery.addEventListener("levelchange", () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        }
      } catch (_error) {
        console.warn("Battery API not supported:", _error);
      }
    };
    updateBattery();  }, []);

  // Online status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
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

  // Listen for external events
  useEffect(() => {
    const handleToggleVoice = (event: CustomEvent<{ enabled: boolean }>) => {
      setIsVoiceEnabled(event.detail.enabled);
      setIsListening(event.detail.enabled);
    };

    const handleVoiceStart = () => setIsListening(true);
    const handleVoiceEnd = () => setIsListening(false);

    window.addEventListener("toggleVoiceNavigation", handleToggleVoice as EventListener);
    window.addEventListener("voiceNavigationStart", handleVoiceStart);
    window.addEventListener("voiceNavigationEnd", handleVoiceEnd);

    return () => {
      window.removeEventListener(
        "toggleVoiceNavigation",
        handleToggleVoice as EventListener
      );
      window.removeEventListener("voiceNavigationStart", handleVoiceStart);
      window.removeEventListener("voiceNavigationEnd", handleVoiceEnd);
    };
  }, []);
  // Haptic feedback helper
  const hapticFeedback = useCallback(
    (intensity: "light" | "medium" | "heavy" = "medium") => {
      try {
        if (navigator.vibrate) {
          const patterns = { light: 20, medium: 50, heavy: 100 };
          navigator.vibrate(patterns[intensity]);
        }
      } catch (error) {
        console.warn("Haptic feedback failed:", error);
      }
    },
    []
  );

  // Event handlers
  const handleNavigation = useCallback(
    (sectionId: string) => {
      navigateToSection(sectionId);
      hapticFeedback("medium");

      const sectionName = sections.find((s) => s.id === sectionId)?.name;
      if (sectionName) {
        showNotification(`Navigated to ${sectionName}`, "success");
      }
    },
    [navigateToSection, hapticFeedback, sections]
  );

  const handleMouseEnter = useCallback(
    (iconId: string) => {
      setHoveredIcon(iconId);
      hapticFeedback("light");
    },
    [hapticFeedback]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredIcon(null);
  }, []);

  const handleSystemTrayToggle = useCallback(() => {
    setIsSystemTrayOpen(!isSystemTrayOpen);
    hapticFeedback("medium");
  }, [isSystemTrayOpen, hapticFeedback]);

  const handleThemeChange = useCallback(
    (newMode: ThemeMode) => {
      setTheme(newMode);
      hapticFeedback("light");
      showNotification(`Theme changed to ${newMode}`, "success");
    },
    [setTheme, hapticFeedback]
  );

  const handleAccentChange = useCallback(
    (newAccent: ThemeAccent) => {
      setAccent(newAccent);
      hapticFeedback("light");
      showNotification(`Accent color changed to ${newAccent}`, "success");
    },
    [setAccent, hapticFeedback]
  );

  // Quick Actions with enhanced functionality
  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        id: "command-palette",
        name: "Command Palette",
        description: "Quick navigation and search",
        icon: Command,
        shortcut: "⌘K",
        enabled: true,
        action: () => {
          try {
            const event = new CustomEvent("openCommandPalette", {
              detail: { source: "dock", timestamp: Date.now() },
            });
            window.dispatchEvent(event);

            setIsSystemTrayOpen(false);
            hapticFeedback("medium");
            showNotification("Command palette opened", "info");
          } catch (error) {
            console.error("Failed to open command palette:", error);
            showNotification("Failed to open command palette", "error");
          }
        },
      },
      {
        id: "voice-navigation",
        name: "Voice Navigation",
        description: isVoiceEnabled
          ? isListening
            ? "Listening..."
            : "Voice commands active"
          : "Enable voice commands",
        icon: isListening ? Mic : isVoiceEnabled ? Volume2 : MicOff,
        enabled: true,
        badge: isListening ? "🔴" : isVoiceEnabled ? "🟢" : undefined,
        action: () => {
          try {
            if (
              !("webkitSpeechRecognition" in window) &&
              !("SpeechRecognition" in window)
            ) {
              showNotification(
                "Voice recognition not supported in this browser",
                "warning"
              );
              return;
            }

            const newState = !isVoiceEnabled;
            setIsVoiceEnabled(newState);

            const event = new CustomEvent("toggleVoiceNavigation", {
              detail: { enabled: newState, source: "dock" },
            });
            window.dispatchEvent(event);

            hapticFeedback("medium");
            showNotification(
              `Voice navigation ${newState ? "enabled" : "disabled"}`,
              "success"
            );
          } catch (error) {
            console.error("Failed to toggle voice navigation:", error);
            showNotification("Failed to toggle voice navigation", "error");
          }
        },
      },
      {
        id: "keyboard-shortcuts",
        name: "Keyboard Shortcuts",
        description: "View all available shortcuts",
        icon: Keyboard,
        shortcut: "?",
        enabled: true,
        action: () => {
          try {
            const event = new CustomEvent("showKeyboardShortcuts", {
              detail: { source: "dock", timestamp: Date.now() },
            });
            window.dispatchEvent(event);

            setIsSystemTrayOpen(false);
            hapticFeedback("medium");
            showNotification("Keyboard shortcuts panel opened", "info");
          } catch (error) {
            console.error("Failed to show keyboard shortcuts:", error);
            showNotification("Failed to show keyboard shortcuts", "error");
          }
        },
      },
      {
        id: "theme-generator",
        name: "Theme Generator",
        description: "Cycle through accent colors",
        icon: Palette,
        enabled: true,
        action: () => {
          try {
            const currentIndex = ACCENT_COLORS.findIndex(
              (color) => color.name === accent
            );
            const nextIndex = (currentIndex + 1) % ACCENT_COLORS.length;
            const nextAccent = ACCENT_COLORS[nextIndex];

            handleAccentChange(nextAccent.name);
            showNotification(`Generated theme: ${nextAccent.label}`, "success");
          } catch (error) {
            console.error("Failed to generate theme:", error);
            showNotification("Failed to generate theme", "error");
          }
        },
      },
      {
        id: "help-center",
        name: "Help Center",
        description: "Get help and documentation",
        icon: HelpCircle,
        enabled: true,
        action: () => {
          try {
            const event = new CustomEvent("openHelpCenter", {
              detail: { source: "dock", timestamp: Date.now() },
            });
            window.dispatchEvent(event);

            setIsSystemTrayOpen(false);
            hapticFeedback("medium");
            showNotification("Help center opened", "info");
          } catch (error) {
            console.error("Failed to open help center:", error);
            showNotification("Failed to open help center", "error");
          }
        },
      },
      {
        id: "scroll-to-top",
        name: "Scroll to Top",
        description: "Return to the top of the page",
        icon: ArrowUp,
        enabled: true,
        action: () => {
          try {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setIsSystemTrayOpen(false);
            hapticFeedback("light");
            showNotification("Scrolled to top", "info");
          } catch (error) {
            console.error("Failed to scroll to top:", error);
            showNotification("Failed to scroll to top", "error");
          }
        },
      },
    ],
    [isVoiceEnabled, isListening, accent, hapticFeedback, handleAccentChange]
  );

  // Computed values
  const availableSections = useMemo(() => {
    return SECTION_ICONS.filter((iconConfig) =>
      sections.some((section) => section.id === iconConfig.id)
    );
  }, [sections]);

  const getIconScale = useCallback(
    (iconId: string, index: number) => {
      if (hoveredIcon === iconId) return 1.3;

      const hoveredIndex = availableSections.findIndex(
        (s) => s.id === hoveredIcon
      );
      if (hoveredIndex !== -1 && Math.abs(hoveredIndex - index) === 1) {
        return 1.1;
      }
      return 1;
    },
    [hoveredIcon, availableSections]
  );

  // Styling
  const positionClass = position === "bottom" ? "bottom-4" : "top-4";
  const dockStyling = isDark
    ? "bg-black/80 border-white/10 shadow-2xl shadow-black/50"
    : "bg-white/80 border-black/10 shadow-2xl shadow-black/20";
  const systemTrayStyling = isDark
    ? "bg-black/95 border-white/20"
    : "bg-white/95 border-black/20";

  // Utility functions
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return "🔋";
    if (batteryLevel > 50) return "🔋";
    if (batteryLevel > 25) return "🪫";
    return "🪫";
  };

  const getBatteryColor = () => {
    if (batteryLevel > 50) return "text-green-500";
    if (batteryLevel > 25) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <>
      {/* Main Dock */}
      <motion.nav
        className={`fixed ${positionClass} left-1/2 transform -translate-x-1/2 z-50
          ${dockStyling} backdrop-blur-xl border rounded-2xl
          ${config.dock} ${className}`}
        initial={{ y: position === "bottom" ? 100 : -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        role="navigation"
        aria-label="Main navigation dock"
      >
        <div className={`flex items-center ${config.spacing} px-4`}>
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
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                    ${
                      isActive
                        ? "bg-primary/20 text-primary border border-primary/30 shadow-lg"
                        : isDark
                        ? "text-gray-300 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-black hover:bg-black/10"
                    }`}
                  onClick={() => handleNavigation(iconConfig.id)}
                  onMouseEnter={() => handleMouseEnter(iconConfig.id)}
                  onMouseLeave={handleMouseLeave}
                  animate={{
                    scale,
                    y: scale > 1 ? -((scale - 1) * 20) : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                  aria-label={`Navigate to ${iconConfig.name}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <IconComponent className={config.icon} />

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2
                        w-1 h-1 bg-primary rounded-full"
                      layoutId="activeIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
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
                        className={`absolute left-1/2 transform -translate-x-1/2
                          ${position === "bottom" ? "top-full" : "bottom-full"}
                          w-0 h-0 border-l-2 border-r-2 border-transparent
                          ${
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
          <div
            className={`w-px h-8 mx-3 ${
              isDark ? "bg-white/20" : "bg-black/20"
            }`}
          />

          {/* System Tray Area */}
          <div className="flex items-center space-x-2">
            {/* Status Icons */}
            <div className="flex items-center space-x-1 px-2">
              <Wifi
                className={`w-3 h-3 ${
                  isOnline ? "text-green-500" : "text-red-500"
                }`}
              />
              <Volume2 className="w-3 h-3 text-muted-foreground" />
              <Battery className={`w-3 h-3 ${getBatteryColor()}`} />
              {isListening && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Mic className="w-3 h-3 text-red-500" />
                </motion.div>
              )}
            </div>

            {/* Time and Date */}
            <div className="text-xs text-muted-foreground px-2 py-1 min-w-[60px] text-center">
              <div className="font-semibold">{formatTime(currentTime)}</div>
              <div className="text-[10px] opacity-75">
                {formatDate(currentTime)}
              </div>
            </div>

            {/* System Tray Toggle */}
            <div ref={systemTrayRef} className="relative">
              <motion.button
                className={`${
                  config.container
                } rounded-xl transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                  ${
                    isSystemTrayOpen
                      ? "bg-accent text-accent-foreground"
                      : isDark
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-600 hover:text-black hover:bg-black/10"
                  }`}
                onClick={handleSystemTrayToggle}
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

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredIcon === "systemTray" && !isSystemTrayOpen && (
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
                    System Tray
                  </motion.div>
                )}
              </AnimatePresence>

              {/* System Tray Menu */}
              <AnimatePresence>
                {isSystemTrayOpen && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className={`absolute ${
                      position === "bottom"
                        ? "bottom-full mb-3"
                        : "top-full mt-3"
                    } right-0 w-80 ${systemTrayStyling} backdrop-blur-xl border rounded-xl
                      shadow-2xl p-4 z-50 max-h-[80vh] overflow-y-auto`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Quick Settings
                      </h3>
                      <motion.button
                        onClick={() => setIsSystemTrayOpen(false)}
                        className="p-1 rounded-lg hover:bg-accent transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Close system tray"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* System Status */}
                    <div className="mb-4 p-3 bg-accent/10 rounded-lg">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              isOnline ? "text-green-500" : "text-red-500"
                            }
                          >
                            {isOnline ? "🟢" : "🔴"}
                          </span>
                          <span>{isOnline ? "Online" : "Offline"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{getBatteryIcon()}</span>
                          <span>{batteryLevel}%</span>
                        </div>
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
                                  transition-all duration-200 text-xs
                                  ${
                                    isActive
                                      ? "bg-primary/20 text-primary border border-primary/30"
                                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  aria-label={`Switch to ${themeMode} theme`}
                                >
                                  <ThemeIcon className="w-4 h-4" />
                                  <span className="capitalize">
                                    {themeMode}
                                  </span>
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
                              ${color.color}
                              ${
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

                    {/* Quick Actions */}
                    <div>
                      <div className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wide">
                        Quick Actions
                      </div>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {quickActions.map((action) => {
                          const IconComponent = action.icon;

                          return (
                            <motion.button
                              key={action.id}
                              onClick={action.action}
                              disabled={action.enabled === false}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg
                                transition-colors text-left group relative
                                ${
                                  action.enabled === false
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-accent"
                                }`}
                              whileHover={action.enabled ? { x: 2 } : {}}
                              whileTap={action.enabled ? { scale: 0.98 } : {}}
                            >
                              <IconComponent
                                className={`w-4 h-4 transition-colors
                                  ${
                                    action.id === "voice-navigation" &&
                                    (isVoiceEnabled || isListening)
                                      ? isListening
                                        ? "text-red-500"
                                        : "text-green-500"
                                      : "text-muted-foreground group-hover:text-foreground"
                                  }`}
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium flex items-center gap-2">
                                  {action.name}
                                  {action.badge && (
                                    <span className="text-xs">
                                      {action.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {action.description}
                                </div>
                              </div>
                              {action.shortcut && (
                                <div className="text-xs text-muted-foreground font-mono">
                                  {action.shortcut}
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* System Info */}
                    <div className="mt-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {isDark ? "Dark" : "Light"} • {accent} •{" "}
                          {availableSections.length} sections
                        </span>
                        <span className="font-mono">
                          {formatTime(currentTime)}
                        </span>
                      </div>
                      {(isVoiceEnabled || isListening) && (
                        <div className="mt-2 text-xs text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                              isListening
                                ? "bg-red-500/20 text-red-500"
                                : "bg-green-500/20 text-green-500"
                            }`}
                          >
                            {isListening ? (
                              <>
                                <Mic className="w-3 h-3" />
                                Listening...
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                Voice Ready
                              </>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default DockNavigation;
