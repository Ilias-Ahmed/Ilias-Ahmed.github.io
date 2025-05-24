import { useNavigation } from "@/contexts/NavigationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Home,
  Mail,
  User,
  Workflow,
  Menu,
  Moon,
  Sun,
  Monitor,
  Settings,
  Palette,
  Info,
  X,
} from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";

// Memoized section icons configuration
const SECTION_ICONS = [
  { id: "home", name: "Home", icon: Home },
  { id: "projects", name: "Projects", icon: Code },
  { id: "skills", name: "Skills", icon: Workflow },
  { id: "about", name: "About", icon: User },
  { id: "contact", name: "Contact", icon: Mail },
] as const;

const THEME_ICONS = {
  dark: Moon,
  light: Sun,
  system: Monitor,
} as const;

const ACCENT_COLORS = [
  { name: "purple", color: "bg-purple-500", label: "Purple" },
  { name: "blue", color: "bg-blue-500", label: "Blue" },
  { name: "pink", color: "bg-pink-500", label: "Pink" },
] as const;

const DockNavigation = React.memo(() => {
  const { activeSection, navigateToSection } = useNavigation();
  const { theme, setTheme, accent, setAccent } = useTheme();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Memoized handlers
  const handleNavigation = useCallback(
    (sectionId: string) => {
      navigateToSection(sectionId);
      try {
        triggerHapticFeedback("light");
      } catch (error) {
        console.debug("Haptics failed:", error);
      }
    },
    [navigateToSection]
  );

  const handleMouseEnter = useCallback((iconId: string) => {
    setHoveredIcon(iconId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIcon(null);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    try {
      triggerHapticFeedback("medium");
    } catch (error) {
      console.debug("Haptics failed:", error);
    }
  }, []);

  const handleThemeChange = useCallback(
    (newTheme: "light" | "dark" | "system") => {
      setTheme(newTheme);
      try {
        triggerHapticFeedback("light");
      } catch (error) {
        console.debug("Haptic feedback failed:", error);
      }
    },
    [setTheme]
  );

  const handleAccentChange = useCallback(
    (newAccent: "purple" | "blue" | "pink") => {
      setAccent(newAccent);
      try {
        triggerHapticFeedback("light");
      } catch (error) {
        console.debug("Haptic feedback failed:", error);
      }
    },
    [setAccent]
  );

  // Optimized scale calculation
  const getIconScale = useCallback(
    (iconId: string) => {
      if (hoveredIcon === null) return 1;
      if (hoveredIcon === iconId) return 1.6;

      const hoveredIndex = SECTION_ICONS.findIndex(
        (item) => item.id === hoveredIcon
      );
      const currentIndex = SECTION_ICONS.findIndex(
        (item) => item.id === iconId
      );
      const distance = Math.abs(hoveredIndex - currentIndex);

      if (distance === 1) return 1.3;
      if (distance === 2) return 1.15;
      return 1;
    },
    [hoveredIcon]
  );

  // Memoized animation variants
  const dockVariants = useMemo(
    () => ({
      initial: { opacity: 0, y: 30, scale: 0.9 },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          delay: 0.5,
          type: "spring",
          stiffness: 200,
          damping: 20,
        },
      },
    }),
    []
  );

  const tooltipVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 5, scale: 0.9 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 500, damping: 30 },
      },
    }),
    []
  );

  const menuVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: 20,
        scale: 0.9,
        transition: { duration: 0.2 },
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
          staggerChildren: 0.05,
          delayChildren: 0.1,
        },
      },
    }),
    []
  );

  const menuItemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0 },
    }),
    []
  );

  return (
    <>
      <motion.div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 hidden lg:block"
        variants={dockVariants}
        initial="initial"
        animate="animate"
      >
        <div className="relative">
          {/* Dock background */}
          <div className="bg-white/5 backdrop-blur-2xl px-4 py-3 rounded-2xl border border-white/10 shadow-2xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            {/* Icons container */}
            <div className="relative flex items-end gap-4">
              {/* Menu Button */}
              <motion.div className="relative flex flex-col items-center">
                <motion.button
                  className={`relative p-3 rounded-xl focus:outline-none transition-colors duration-200 ${
                    isMenuOpen
                      ? "text-blue-400"
                      : "text-white/80 hover:text-white"
                  }`}
                  onClick={handleMenuToggle}
                  onMouseEnter={() => handleMouseEnter("menu")}
                  onMouseLeave={handleMouseLeave}
                  whileTap={{ scale: 0.85 }}
                  aria-label="Open menu"
                  aria-expanded={isMenuOpen}
                >
                  {/* Menu button background */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200"
                    animate={{ scale: hoveredIcon === "menu" ? 1.6 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />

                  {/* Menu icon */}
                  <motion.div
                    className="relative z-10"
                    animate={{
                      scale: hoveredIcon === "menu" ? 1.6 : 1,
                      rotate: isMenuOpen ? 90 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Menu size={20} />
                  </motion.div>

                  {/* Glass reflection */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/30 via-transparent to-transparent opacity-40"
                    animate={{ scale: hoveredIcon === "menu" ? 1.6 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                </motion.button>

                {/* Menu tooltip */}
                <motion.div
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-xl border border-white/10"
                  variants={tooltipVariants}
                  animate={hoveredIcon === "menu" ? "visible" : "hidden"}
                >
                  Menu
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
                </motion.div>

                {/* Active indicator for menu */}
                {isMenuOpen && (
                  <motion.div
                    className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-lg"
                    layoutId="activeDockMenu"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>

              {/* Separator */}
              <div className="w-px h-8 bg-white/20" />

              {/* Navigation Icons */}
              {SECTION_ICONS.map((section) => {
                const IconComponent = section.icon;
                const isActive = activeSection === section.id;
                const scale = getIconScale(section.id);

                return (
                  <motion.div
                    key={section.id}
                    className="relative flex flex-col items-center"
                  >
                    {/* Icon button */}
                    <motion.button
                      className={`relative p-3 rounded-xl focus:outline-none transition-colors duration-200 ${
                        isActive
                          ? "text-blue-400"
                          : "text-white/80 hover:text-white"
                      }`}
                      onClick={() => handleNavigation(section.id)}
                      onMouseEnter={() => handleMouseEnter(section.id)}
                      onMouseLeave={handleMouseLeave}
                      whileTap={{ scale: 0.85 }}
                      aria-label={`Navigate to ${section.name}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {/* Icon background */}
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200"
                        animate={{ scale }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                      />

                      {/* Icon */}
                      <motion.div
                        className="relative z-10"
                        animate={{ scale }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                      >
                        <IconComponent size={20} />
                      </motion.div>

                      {/* Glass reflection */}
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/30 via-transparent to-transparent opacity-40"
                        animate={{ scale }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                      />
                    </motion.button>

                    {/* Tooltip */}
                    <motion.div
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-xl border border-white/10"
                      variants={tooltipVariants}
                      animate={
                        hoveredIcon === section.id ? "visible" : "hidden"
                      }
                    >
                      {section.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
                    </motion.div>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-lg"
                        layoutId="activeDockSection"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Dock reflection */}
          <div className="absolute top-full left-0 right-0 h-8 bg-gradient-to-b from-white/5 to-transparent rounded-b-2xl transform scale-y-50 opacity-30 blur-sm" />
        </div>
      </motion.div>

      {/* Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleMenuToggle}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-80 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Header */}
              <motion.div
                className="flex items-center justify-between p-4 border-b border-white/10"
                variants={menuItemVariants}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-white/80" />
                  <h3 className="text-white font-medium">Settings</h3>
                </div>
                <button
                  onClick={handleMenuToggle}
                  className="p-1 text-white/60 hover:text-white transition-colors rounded"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </motion.div>

              {/* Theme Section */}
              <motion.div
                className="p-4 border-b border-white/10"
                variants={menuItemVariants}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-white/80" />
                  <h4 className="text-white/90 text-sm font-medium uppercase tracking-wider">
                    Theme
                  </h4>
                </div>
                <div className="flex gap-2">
                  {(["dark", "light", "system"] as const).map((themeOption) => {
                    const IconComponent = THEME_ICONS[themeOption];
                    return (
                      <motion.button
                        key={themeOption}
                        onClick={() => handleThemeChange(themeOption)}
                        className={`flex-1 p-3 rounded-xl transition-all duration-200 ${
                          theme === themeOption
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label={`${themeOption} theme`}
                      >
                        <IconComponent className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs capitalize">
                          {themeOption}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Accent Color Section */}
              <motion.div
                className="p-4 border-b border-white/10"
                variants={menuItemVariants}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-white/80" />
                  <h4 className="text-white/90 text-sm font-medium uppercase tracking-wider">
                    Accent Color
                  </h4>
                </div>
                <div className="flex gap-3">
                  {ACCENT_COLORS.map(({ name, color, label }) => (
                    <motion.button
                      key={name}
                      onClick={() =>
                        handleAccentChange(name as "purple" | "blue" | "pink")
                      }
                      className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-200 ${
                        accent === name ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`${label} accent`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${color} transition-transform ${
                          accent === name
                            ? "ring-2 ring-white scale-110"
                            : "hover:scale-105"
                        }`}
                      />
                      <span className="text-xs text-white/70">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div className="p-4" variants={menuItemVariants}>
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-white/80" />
                  <h4 className="text-white/90 text-sm font-medium uppercase tracking-wider">
                    Quick Actions
                  </h4>
                </div>
                <div className="space-y-2">
                  <motion.button
                    onClick={() => {
                      handleNavigation("about");
                      handleMenuToggle();
                    }}
                    className="w-full p-3 text-left text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4" />
                      <span className="text-sm">About Me</span>
                    </div>
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      handleNavigation("contact");
                      handleMenuToggle();
                    }}
                    className="w-full p-3 text-left text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Get in Touch</span>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

DockNavigation.displayName = "DockNavigation";

export default DockNavigation;
