import { useNavigation } from "@/contexts/NavigationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";
import { motion } from "framer-motion";
import {
  CircleDot,
  Code,
  Home,
  Mail,
  Monitor,
  Moon,
  Sun,
  User,
  Workflow,
  X,
} from "lucide-react";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

interface NavigationMenuProps {
  children?: ReactNode;
}

// Memoized icon mapping for better performance
const SECTION_ICONS = {
  home: Home,
  projects: Code,
  skills: Workflow,
  about: User,
  contact: Mail,
} as const;

const THEME_ICONS = {
  dark: Moon,
  light: Sun,
  system: Monitor,
} as const;

const ACCENT_COLORS = [
  { name: "purple", color: "bg-purple-500" },
  { name: "blue", color: "bg-blue-500" },
  { name: "pink", color: "bg-pink-500" },
] as const;

const NavigationMenu = React.memo<NavigationMenuProps>(({ children }) => {
  const { sections, navigateToSection, closeMenu } = useNavigation();
  const { theme, setTheme, accent, setAccent } = useTheme();
  const navRef = useRef<HTMLDivElement>(null);

  // Memoized handlers
  const handleNavigation = useCallback(
    (sectionId: string) => {
      navigateToSection(sectionId);
      closeMenu();
      try {
        triggerHapticFeedback("medium");
      } catch (error) {
        console.debug("Haptic feedback failed:", error);
      }
    },
    [navigateToSection, closeMenu]
  );

  const handleCloseMenu = useCallback(() => {
    closeMenu();
    try {
      triggerHapticFeedback("medium");
    } catch (error) {
      console.debug("Haptic feedback failed:", error);
    }
  }, [closeMenu]);

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

  // Optimized keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: true });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseMenu]);

  // Memoized icon component
  const getSectionIcon = useCallback((id: string) => {
    const IconComponent =
      SECTION_ICONS[id as keyof typeof SECTION_ICONS] || CircleDot;
    return <IconComponent className="w-6 h-6" />;
  }, []);

  // Memoized animation variants
  const menuVariants = useMemo(
    () => ({
      closed: {
        x: "100%",
        transition: { type: "spring", stiffness: 400, damping: 40 },
      },
      open: {
        x: "0%",
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 40,
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      closed: { x: 20, opacity: 0 },
      open: { x: 0, opacity: 1 },
    }),
    []
  );

  return (
    <motion.div
      id="navigation-menu"
      className="fixed inset-0 bg-black/90 backdrop-blur-lg pointer-events-auto"
      style={{ zIndex: 50 }} // Explicit high z-index for menu
      initial="closed"
      animate="open"
      exit="closed"
      variants={menuVariants}
    >
      {/* Close button */}
      <button
        className="absolute top-8 right-8 p-3 bg-background/80 backdrop-blur-sm shadow-2xl rounded-full pointer-events-auto"
        style={{
          zIndex: 60,
          touchAction: "manipulation",
        }}
        onClick={handleCloseMenu}
        aria-label="Close menu"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        ref={navRef}
        className="h-full flex flex-col justify-center max-w-screen-lg mx-auto px-6 pointer-events-auto"
        style={{ touchAction: "manipulation" }}
      >
        {/* Main Navigation Links */}
        <nav className="space-y-4 mb-8">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              className="group flex items-center gap-4 w-full px-4 py-3 text-2xl hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => handleNavigation(section.id)}
              variants={itemVariants}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
            >
              <span className="p-3 bg-background/20 rounded-xl group-hover:bg-primary/20 transition-colors">
                {getSectionIcon(section.id)}
              </span>
              <span>{section.name}</span>
            </motion.button>
          ))}
        </nav>

        {/* Theme and Accent Controls */}
        <motion.div
          className="mt-auto border-t border-white/10 pt-6 space-y-6"
          variants={itemVariants}
        >
          {/* Theme Toggle */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm uppercase tracking-wider opacity-60">
              Theme
            </h3>
            <div className="flex space-x-3">
              {(["dark", "light", "system"] as const).map((themeOption) => {
                const IconComponent = THEME_ICONS[themeOption];
                return (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
                    className={`p-3 rounded-lg transition-colors ${
                      theme === themeOption
                        ? "bg-primary text-white"
                        : "bg-background/20"
                    }`}
                    aria-label={`${themeOption} theme`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color Selection */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm uppercase tracking-wider opacity-60">
              Accent
            </h3>
            <div className="flex space-x-3">
              {ACCENT_COLORS.map(({ name, color }) => (
                <button
                  key={name}
                  onClick={() =>
                    handleAccentChange(name as "purple" | "blue" | "pink")
                  }
                  className={`w-8 h-8 rounded-full ${color} transition-transform ${
                    accent === name
                      ? "ring-2 ring-white scale-110"
                      : "hover:scale-105"
                  }`}
                  aria-label={`${name} accent`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Additional Content */}
        {children && (
          <motion.div
            className="mt-6 border-t border-white/10 pt-6"
            variants={itemVariants}
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

NavigationMenu.displayName = "NavigationMenu";

export default NavigationMenu;
