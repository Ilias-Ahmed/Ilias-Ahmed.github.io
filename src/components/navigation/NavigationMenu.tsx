import React, {
  useRef,
  useEffect,
  ReactNode,
  useState,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence} from "framer-motion";
import {
  X,
  Home,
  Code,
  Workflow,
  User,
  Mail,
  Sun,
  Moon,
  Monitor,
  Command,
  Navigation as NavigationIcon,
  Settings,
  Search,
  Bell,
  Download,
  Share,
  Bookmark,
  History,
  Palette,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  ChevronRight,
  Zap,
  Star,
  Heart,
  Globe,
  Shield,
  Smartphone,
  MessageCircle,
  HelpCircle,
  Info,
} from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import {
  useTheme,
  type ThemeMode,
  type ThemeAccent,
} from "@/contexts/ThemeContext";

// Enhanced interfaces with strict typing
interface NavigationMenuProps {
  children?: ReactNode;
  showQuickActions?: boolean;
  showDeviceStatus?: boolean;
  compactMode?: boolean;
  className?: string;
  ariaLabel?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  action: () => void;
  shortcut?: string;
  description?: string;
  badge?: string | number;
  disabled?: boolean;
  category?: "navigation" | "tools" | "settings" | "social";
}

interface DeviceStatus {
  battery: number;
  isCharging: boolean;
  isOnline: boolean;
  soundEnabled: boolean;
  deviceType: "mobile" | "tablet" | "desktop";
}

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery(): Promise<BatteryManager>;
}

// Type guards
const isNavigatorWithBattery = (nav: Navigator): nav is NavigatorWithBattery => {
  return 'getBattery' in nav;
};

// Enhanced NavigationMenu component
const NavigationMenu: React.FC<NavigationMenuProps> = ({
  children,
  showQuickActions = true,
  showDeviceStatus = true,
  compactMode = false,
  className = "",
  ariaLabel = "Navigation menu",
}) => {
  // Hooks with safe destructuring
  const navigation = useNavigation();
  const theme = useTheme();
  const navRef = useRef<HTMLDivElement>(null);

  // Safe destructuring with proper fallbacks
  const {
    sections = [],
    navigateToSection = () => {},
    closeMenu = () => {},
    isMenuOpen = false,
    activeSection = "home",
  } = navigation || {};

  const {
    mode = "dark",
    setTheme = () => {},
    accent = "purple",
    setAccent = () => {},
    isDark = true,
  } = theme || {};

  // Enhanced state management
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    battery: 100,
    isCharging: false,
    isOnline: navigator.onLine,
    soundEnabled: true,
    deviceType: "desktop",
  });
  const [recentSections, setRecentSections] = useState<string[]>([]);
  const [favoriteActions, setFavoriteActions] = useState<string[]>([
    "command-palette",
  ]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize component
  useEffect(() => {
    setIsInitialized(true);

    // Detect device type
    const detectDeviceType = (): "mobile" | "tablet" | "desktop" => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);

      if (isTablet) return "tablet";
      if (isMobile) return "mobile";
      return "desktop";
    };

    setDeviceStatus(prev => ({
      ...prev,
      deviceType: detectDeviceType(),
    }));
  }, []);

  // Enhanced haptic feedback helper with proper error handling
  const triggerHaptic = useCallback(
    (intensity: "light" | "medium" | "heavy" = "medium") => {
      if (!isInitialized) return;

      try {
        if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
          const patterns = { light: 20, medium: 50, heavy: 100 };
          navigator.vibrate(patterns[intensity]);
        }
      } catch (error) {
        console.debug("Haptic feedback not available:", error);
      }
    },
    [isInitialized]
  );

  // Enhanced quick actions with categories and better organization
  const quickActions: QuickAction[] = useMemo(() => [
    // Navigation Actions
    {
      id: "command-palette",
      label: "Command Palette",
      icon: Command,
      shortcut: "⌘K",
      description: "Quick navigation and search",
      category: "navigation",
      action: () => {
        try {
          window.dispatchEvent(new CustomEvent("openCommandPalette"));
          closeMenu();
          triggerHaptic("medium");
        } catch (error) {
          console.error("Failed to open command palette:", error);
        }
      },
    },
    {
      id: "search",
      label: "Search Content",
      icon: Search,
      shortcut: "/",
      description: "Search through all content",
      category: "tools",
      action: () => {
        try {
          const searchInput = navRef.current?.querySelector(
            'input[type="search"]'
          ) as HTMLInputElement;
          searchInput?.focus();
          triggerHaptic("light");
        } catch (error) {
          console.error("Failed to focus search:", error);
        }
      },
    },

    // Communication Actions
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: "3",
      description: "View recent notifications",
      category: "tools",
      action: () => {
        try {
          window.dispatchEvent(new CustomEvent("showNotifications"));
          triggerHaptic("light");
        } catch (error) {
          console.error("Failed to show notifications:", error);
        }
      },
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      description: "Contact and messaging",
      category: "social",
      action: () => {
        try {
          navigateToSection("contact");
          closeMenu();
          triggerHaptic("medium");
        } catch (error) {
          console.error("Failed to navigate to contact:", error);
        }
      },
    },

    // Sharing Actions
    {
      id: "share",
      label: "Share Page",
      icon: Share,
      description: "Share current page",
      category: "social",
      action: () => {
        try {
          if (navigator.share && typeof navigator.share === "function") {
            navigator.share({
              title: document.title,
              url: window.location.href,
            });
          } else if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            navigator.clipboard.writeText(window.location.href);
            // Show success notification
            window.dispatchEvent(new CustomEvent("showToast", {
              detail: { message: "Link copied to clipboard!", type: "success" }
            }));
          }
          triggerHaptic("medium");
        } catch (error) {
          console.error("Failed to share:", error);
        }
      },
    },
    {
      id: "bookmark",
      label: "Bookmark Page",
      icon: Bookmark,
      description: "Save current page",
      category: "tools",
      action: () => {
        try {
          const bookmarkData = {
            url: window.location.href,
            title: document.title,
            timestamp: Date.now(),
          };
          localStorage.setItem(`bookmark_${Date.now()}`, JSON.stringify(bookmarkData));
          window.dispatchEvent(new CustomEvent("showToast", {
            detail: { message: "Page bookmarked!", type: "success" }
          }));
          triggerHaptic("light");
        } catch (error) {
          console.error("Failed to bookmark:", error);
        }
      },
    },

    // Device Actions
    {
      id: "sound-toggle",
      label: deviceStatus.soundEnabled ? "Mute Sounds" : "Enable Sounds",
      icon: deviceStatus.soundEnabled ? Volume2 : VolumeX,
      description: "Toggle sound feedback",
      category: "settings",
      action: () => {
        try {
          setDeviceStatus(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
          triggerHaptic("light");
        } catch (error) {
          console.error("Failed to toggle sound:", error);
        }
      },
    },
    {
      id: "device-info",
      label: "Device Info",
      icon: Smartphone,
      description: `${deviceStatus.deviceType} • ${deviceStatus.isOnline ? 'Online' : 'Offline'}`,
      category: "settings",
      action: () => {
        try {
          window.dispatchEvent(new CustomEvent("showDeviceInfo", {
            detail: deviceStatus
          }));
          triggerHaptic("light");
        } catch (error) {
          console.error("Failed to show device info:", error);
        }
      },
    },

    // PWA Actions
    {
      id: "install",
      label: "Install App",
      icon: Download,
      description: "Install as Progressive Web App",
      category: "tools",
      action: () => {
        try {
          window.dispatchEvent(new CustomEvent("promptPWAInstall"));
          triggerHaptic("heavy");
        } catch (error) {
          console.error("Failed to prompt PWA install:", error);
        }
      },
    },

    // Help Actions
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      description: "Get help and documentation",
      category: "tools",
      action: () => {
        try {
          window.dispatchEvent(new CustomEvent("openHelp"));
          triggerHaptic("light");
        } catch (error) {
          console.error("Failed to open help:", error);
        }
      },
    },
    {
      id: "about",
      label: "About",
      icon: Info,
      description: "App information and credits",
      category: "tools",
      action: () => {
        try {
          window.dispatchEvent(new CustomEvent("showAbout"));
          triggerHaptic("light");
        } catch (error) {
          console.error("Failed to show about:", error);
        }
      },
    },
  ], [closeMenu, triggerHaptic, navigateToSection, deviceStatus]);

  // Filter actions based on favorites, search, and compact mode
  const filteredActions = useMemo(() => {
    let actions = quickActions;

    if (searchQuery) {
      actions = actions.filter(
        (action) =>
          action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          action.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          action.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // In compact mode, show fewer actions
    if (compactMode) {
      actions = actions.slice(0, 6);
    }

    // Sort favorites first, then by category
    return actions.sort((a, b) => {
      const aIsFavorite = favoriteActions.includes(a.id);
      const bIsFavorite = favoriteActions.includes(b.id);

      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;

      // Sort by category
      const categoryOrder = ["navigation", "tools", "social", "settings"];
      const aCategoryIndex = categoryOrder.indexOf(a.category || "tools");
      const bCategoryIndex = categoryOrder.indexOf(b.category || "tools");

      return aCategoryIndex - bCategoryIndex;
    });
  }, [quickActions, searchQuery, favoriteActions, compactMode]);

  // Filter sections based on search
  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    return sections.filter(
      (section) =>
        section.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sections, searchQuery]);

  // Enhanced device status monitoring
  useEffect(() => {
    if (!isInitialized) return;

    const updateDeviceStatus = async () => {
      try {
        // Battery API with proper typing
        if (isNavigatorWithBattery(navigator)) {
          const battery = await navigator.getBattery();

          const updateBatteryInfo = () => {
            setDeviceStatus(prev => ({
              ...prev,
              battery: Math.round(battery.level * 100),
              isCharging: battery.charging,
            }));
          };

          updateBatteryInfo();

          // Listen for battery changes
          battery.addEventListener('levelchange', updateBatteryInfo);
          battery.addEventListener('chargingchange', updateBatteryInfo);
        }

        // Online status monitoring
        const handleOnline = () =>
          setDeviceStatus(prev => ({ ...prev, isOnline: true }));
        const handleOffline = () =>
          setDeviceStatus(prev => ({ ...prev, isOnline: false }));

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
          window.removeEventListener("online", handleOnline);
          window.removeEventListener("offline", handleOffline);
        };
      } catch (error) {
        console.debug("Device status monitoring not available:", error);
      }
    };

    updateDeviceStatus();
  }, [isInitialized]);

  // Recent sections tracking with validation
  useEffect(() => {
    if (activeSection &&
        sections.some(s => s.id === activeSection) &&
        !recentSections.includes(activeSection)) {
      setRecentSections(prev => [activeSection, ...prev.slice(0, 4)]);
    }
  }, [activeSection, recentSections, sections]);

  // Enhanced focus management
  useEffect(() => {
    if (!isMenuOpen || !isInitialized) return;

    const firstFocusable = navRef.current?.querySelector(
      "input, button, [tabindex]:not([tabindex='-1'])"
    ) as HTMLElement;

    if (firstFocusable) {
      // Delay focus for mobile keyboards
      const timeoutId = setTimeout(() => firstFocusable.focus(), 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isMenuOpen, isInitialized]);

  // Keyboard event handling
  useEffect(() => {
    if (!isMenuOpen || !isInitialized) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      try {
        if (e.key === "Escape") {
          closeMenu();
          triggerHaptic("light");
          return;
        }

        // Command palette shortcut
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("openCommandPalette"));
          closeMenu();
          return;
        }

        // Search shortcut
        if (e.key === "/" && !searchQuery) {
          e.preventDefault();
          const searchInput = navRef.current?.querySelector(
            'input[type="search"]'
          ) as HTMLInputElement;
          searchInput?.focus();
          return;
        }

        // Tab navigation
        if (e.key === "Tab") {
          const focusableElements = navRef.current?.querySelectorAll(
            'input, button, [tabindex]:not([tabindex="-1"])'
          ) as NodeListOf<HTMLElement>;

          if (!focusableElements?.length) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      } catch (error) {
        console.error("Keyboard navigation error:", error);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu, triggerHaptic, searchQuery, isInitialized]);

  // Enhanced navigation handler with validation
  const handleNavigation = useCallback(
    (sectionId: string) => {
      try {
        if (!sectionId || typeof navigateToSection !== "function") {
          console.warn("Invalid navigation parameters");
          return;
        }

        const sectionExists = sections.some(section => section?.id === sectionId);
        if (!sectionExists) {
          console.warn(`Section "${sectionId}" does not exist`);
          return;
        }

        navigateToSection(sectionId);
        closeMenu();
        triggerHaptic("medium");
      } catch (error) {
        console.error("Navigation error:", error);
      }
    },
    [navigateToSection, closeMenu, triggerHaptic, sections]
  );


  // Enhanced theme change handler
  const handleThemeChange = useCallback(
    (newMode: ThemeMode) => {
      try {
        if (typeof setTheme === "function") {
          setTheme(newMode);
          triggerHaptic("light");
        }
      } catch (error) {
        console.error("Theme change error:", error);
      }
    },
    [setTheme, triggerHaptic]
  );

  // Enhanced accent change handler
  const handleAccentChange = useCallback(
    (newAccent: ThemeAccent) => {
      try {
        if (typeof setAccent === "function") {
          setAccent(newAccent);
          triggerHaptic("light");
        }
      } catch (error) {
        console.error("Accent change error:", error);
      }
    },
    [setAccent, triggerHaptic]
  );

  // Favorite toggle with error handling
  const toggleFavorite = useCallback(
    (actionId: string) => {
      try {
        setFavoriteActions(prev =>
          prev.includes(actionId)
            ? prev.filter(id => id !== actionId)
            : [...prev, actionId]
        );
        triggerHaptic("light");
      } catch (error) {
        console.error("Toggle favorite error:", error);
      }
    },
    [triggerHaptic]
  );

  // Animation variants
  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  const searchVariants = {
    closed: { scale: 0.95, opacity: 0 },
    open: { scale: 1, opacity: 1 },
  };

  // Enhanced section icons mapping with fallback
  const sectionIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    home: Home,
    projects: Code,
    skills: Workflow,
    about: User,
    contact: Mail,
  };

  // Theme icons mapping
  const themeIcons: Record<ThemeMode, React.ComponentType<{ size?: number; className?: string }>> = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  // Enhanced accent color options
  const accentOptions: Array<{
    color: ThemeAccent;
    bgColor: string;
    label: string;
    gradient: string;
  }> = [
    {
      color: "purple",
      bgColor: "bg-purple-500",
      label: "Purple",
      gradient: "from-purple-400 to-purple-600",
    },
    {
      color: "blue",
      bgColor: "bg-blue-500",
      label: "Blue",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      color: "pink",
      bgColor: "bg-pink-500",
      label: "Pink",
      gradient: "from-pink-400 to-pink-600",
    },
    {
      color: "green",
      bgColor: "bg-green-500",
      label: "Green",
      gradient: "from-green-400 to-green-600",
    },
    {
      color: "orange",
      bgColor: "bg-orange-500",
      label: "Orange",
      gradient: "from-orange-400 to-orange-600",
    },
  ];

  // Early return for uninitialized state
  if (!isInitialized) {
    return null;
  }

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Enhanced backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-40"
            onClick={() => {
              closeMenu();
              triggerHaptic("light");
            }}
            aria-hidden="true"
          />

          {/* Enhanced menu panel */}
          <motion.nav
            ref={navRef}
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            dragConstraints={{ left: 0, right: 300 }}
            dragElastic={0.2}
            className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 overflow-hidden
              ${isDark
                ? "bg-gray-950/95 border-l border-gray-800"
                : "bg-white/95 border-l border-gray-200"
              } backdrop-blur-xl shadow-2xl ${className}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-title"
            aria-label={ariaLabel}
          >


            <div className="flex flex-col h-full">
              {/* Enhanced header */}
              <motion.div
                variants={itemVariants}
                className={`flex items-center justify-between p-4 ${
                  isDark ? "border-b border-gray-800" : "border-b border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isDark ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <NavigationIcon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 id="menu-title" className="text-lg font-semibold">
                      Navigation
                    </h2>
                    {showDeviceStatus && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                          className={
                            deviceStatus.isOnline ? "text-green-500" : "text-red-500"
                          }
                        >
                          {deviceStatus.isOnline ? (
                            <Wifi size={12} />
                          ) : (
                            <WifiOff size={12} />
                          )}
                        </span>
                        <span
                          className={
                            deviceStatus.battery < 20
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }
                        >
                          {deviceStatus.battery < 20 ? (
                            <BatteryLow size={12} />
                          ) : (
                            <Battery size={12} />
                          )}
                          {deviceStatus.battery}%
                        </span>
                        <Globe size={12} className="text-muted-foreground" />
                        <Shield size={12} className="text-green-500" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Settings button */}
                  <motion.button
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => triggerHaptic("light")}
                    aria-label="Settings"
                  >
                    <Settings size={18} />
                  </motion.button>

                  {/* Close button */}
                  <motion.button
                    onClick={() => {
                      closeMenu();
                      triggerHaptic("medium");
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close navigation menu"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Enhanced search */}
              <motion.div variants={searchVariants} className="p-4">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="search"
                    placeholder="Search sections and actions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all
                      focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                      }`}
                    aria-label="Search navigation items"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
                {/* Recent sections */}
                {recentSections.length > 0 && !searchQuery && !compactMode && (
                  <motion.div variants={itemVariants}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                      <History size={14} />
                      Recent
                    </h3>
                    <div className="space-y-1">
                      {recentSections.slice(0, 3).map((sectionId) => {
                        const section = sections.find((s) => s.id === sectionId);
                        if (!section) return null;

                        const IconComponent = sectionIcons[section.id] || NavigationIcon;

                        return (
                          <motion.button
                            key={`recent-${section.id}`}
                            onClick={() => handleNavigation(section.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                              transition-all duration-200 group ${
                                isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                              }`}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            aria-label={`Navigate to ${section.name} (recent)`}
                          >
                            <IconComponent
                              size={16}
                              className="text-muted-foreground group-hover:text-foreground"
                            />
                            <span className="text-sm font-medium">{section.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Navigation sections */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                    <NavigationIcon size={14} />
                    Sections
                  </h3>
                  <div className="space-y-1">
                    {filteredSections.map((section) => {
                      const isActive = activeSection === section.id;
                      const IconComponent = sectionIcons[section.id] || NavigationIcon;

                      return (
                        <motion.button
                          key={section.id}
                          variants={itemVariants}
                          onClick={() => handleNavigation(section.id)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg
                            text-left transition-all duration-200 group relative overflow-hidden
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                            ${
                              isActive
                                ? `bg-gradient-to-r ${
                                    accentOptions.find((a) => a.color === accent)?.gradient ||
                                    "from-primary to-primary"
                                  } text-white shadow-lg`
                                : isDark
                                ? "hover:bg-gray-800"
                                : "hover:bg-gray-100"
                            }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          aria-current={isActive ? "page" : undefined}
                          aria-label={`Navigate to ${section.name}`}
                        >
                          <IconComponent
                            size={20}
                            className={`transition-colors duration-200 ${
                              isActive
                                ? "text-white"
                                : "text-muted-foreground group-hover:text-foreground"
                            }`}
                          />
                          <div className="flex-1">
                            <div className={`font-medium ${isActive ? "text-white" : ""}`}>
                              {section.name}
                            </div>
                            {section.description && (
                              <div
                                className={`text-xs mt-0.5 ${
                                  isActive ? "text-white/80" : "text-muted-foreground"
                                }`}
                              >
                                {section.description}
                              </div>
                            )}
                          </div>

                          {isActive && (
                            <motion.div
                              layoutId="activeMenuIndicator"
                              className="w-2 h-2 bg-white rounded-full"
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          )}

                          <ChevronRight
                            size={16}
                            className={`transition-colors duration-200 ${
                              isActive ? "text-white/60" : "text-muted-foreground/50"
                            }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Theme settings */}
                {!compactMode && (
                  <motion.div variants={itemVariants}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                      <Palette size={14} />
                      Appearance
                    </h3>

                    {/* Theme modes */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {(["light", "dark", "system"] as ThemeMode[]).map((themeMode) => {
                        const ThemeIcon = themeIcons[themeMode];
                        const isActive = mode === themeMode;

                        return (
                          <motion.button
                            key={themeMode}
                            onClick={() => handleThemeChange(themeMode)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-lg
                            transition-all duration-200 text-xs ${
                              isActive
                                ? "bg-primary/20 text-primary border border-primary/30"
                                : isDark
                                ? "hover:bg-gray-800"
                                : "hover:bg-gray-100"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            aria-label={`Switch to ${themeMode} theme`}
                            aria-pressed={isActive}
                          >
                            <ThemeIcon size={18} />
                            <span className="capitalize font-medium">{themeMode}</span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Accent colors */}
                    <div>
                      <div className="text-sm font-medium mb-2">Accent Color</div>
                      <div className="flex flex-wrap gap-2">
                        {accentOptions.map((option) => (
                          <motion.button
                            key={option.color}
                            onClick={() => handleAccentChange(option.color)}
                            className={`relative w-10 h-10 rounded-lg border-2 transition-all duration-200
                            bg-gradient-to-br ${option.gradient}
                            ${
                              accent === option.color
                                ? "border-foreground scale-110 shadow-lg"
                                : "border-transparent hover:border-foreground/30"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Set accent color to ${option.label}`}
                            aria-pressed={accent === option.color}
                          >
                            {accent === option.color && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <Star size={16} className="text-white" fill="currentColor" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Enhanced quick actions */}
                {showQuickActions && (
                  <motion.div variants={itemVariants}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                      <Zap size={14} />
                      Quick Actions
                    </h3>
                    <div className="space-y-1">
                      {filteredActions.map((action) => {
                        const IconComponent = action.icon;
                        const isFavorite = favoriteActions.includes(action.id);

                        return (
                          <motion.div
                            key={action.id}
                            variants={itemVariants}
                            className="relative group"
                          >
                            <motion.button
                              onClick={action.action}
                              disabled={action.disabled}
                              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg
                                text-left transition-all duration-200 group relative
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                                ${
                                  action.disabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : isDark
                                    ? "hover:bg-gray-800"
                                    : "hover:bg-gray-100"
                                }`}
                              whileHover={action.disabled ? {} : { x: 4 }}
                              whileTap={action.disabled ? {} : { scale: 0.98 }}
                              aria-label={`${action.label}: ${action.description}`}
                              aria-disabled={action.disabled}
                            >
                              <div className="relative">
                                <IconComponent
                                  size={18}
                                  className="text-muted-foreground group-hover:text-foreground transition-colors"
                                />
                                {isFavorite && (
                                  <Star
                                    size={8}
                                    className="absolute -top-1 -right-1 text-yellow-500"
                                    fill="currentColor"
                                  />
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{action.label}</span>
                                  {action.badge && (
                                    <span className="px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                                      {action.badge}
                                    </span>
                                  )}
                                </div>
                                {action.description && (
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {action.description}
                                  </div>
                                )}
                              </div>

                              {action.shortcut && (
                                <div className="text-xs text-muted-foreground font-mono bg-accent/20 px-2 py-1 rounded">
                                  {action.shortcut}
                                </div>
                              )}
                            </motion.button>

                            {/* Favorite toggle */}
                            {!compactMode && (
                              <motion.button
                                onClick={() => toggleFavorite(action.id)}
                                className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100
                                transition-opacity ${
                                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label={`${isFavorite ? "Remove from" : "Add to"} favorites`}
                              >
                                <Heart
                                  size={12}
                                  className={
                                    isFavorite
                                      ? "text-red-500 fill-current"
                                      : "text-muted-foreground"
                                  }
                                />
                              </motion.button>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Custom children */}
                {children && (
                  <motion.div variants={itemVariants}>{children}</motion.div>
                )}
              </div>

              {/* Enhanced footer */}
              <motion.div
                variants={itemVariants}
                className={`p-4 ${
                  isDark ? "border-t border-gray-800" : "border-t border-gray-200"
                }`}
              >
                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <div className="flex items-center justify-center gap-4">
                    <span>⌘K Command Palette</span>
                    <span>/ Search</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default NavigationMenu;
