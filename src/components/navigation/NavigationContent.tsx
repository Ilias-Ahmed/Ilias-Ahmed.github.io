import React, { useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Code,
  Workflow,
  User,
  Mail,
  Flame,
  Zap,
  Bolt,
  PanelLeft,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigation } from "@/contexts/NavigationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";

// Define the AccentColor type to match what's expected in ThemeContext
type AccentColor = "purple" | "blue" | "pink";

interface NavigationContentProps {
  children?: ReactNode;
}

const NavigationContent: React.FC<NavigationContentProps> = ({ children }) => {
  const { sections, navigateToSection, closeMenu } = useNavigation();
  const { theme, setTheme, accent, setAccent } = useTheme();
  const navRef = useRef<HTMLDivElement>(null);

  // Focus trap for accessibility
  useEffect(() => {
    // Focus first interactive element when opened
    const firstFocusable = navRef.current?.querySelector(
      "a, button"
    ) as HTMLElement;
    if (firstFocusable) firstFocusable.focus();

    // Trap focus within the menu
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }

      if (e.key !== "Tab") return;

      const focusableElements =
        navRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) || [];

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMenu]);

  const handleNavigation = (sectionId: string) => {
    navigateToSection(sectionId);
  };

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
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  // Map section IDs to icons
  const sectionIcons: Record<string, React.ReactNode> = {
    home: <Home size={18} />,
    projects: <Code size={18} />,
    skills: <Workflow size={18} />,
    about: <User size={18} />,
    contact: <Mail size={18} />,
  };

  // Define accent color options with proper typing
  const accentOptions: Array<{
    color: AccentColor;
    icon: React.ReactNode;
    bgColor: string;
  }> = [
    { color: "purple", icon: <Zap size={16} />, bgColor: "bg-purple-500" },
    { color: "blue", icon: <Bolt size={16} />, bgColor: "bg-blue-500" },
    { color: "pink", icon: <Flame size={16} />, bgColor: "bg-pink-500" },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 backdrop-blur-sm bg-background/80 dark:bg-background/80"
      initial="closed"
      animate="open"
      exit="closed"
      variants={menuVariants}
    >
      <motion.div
        ref={navRef}
        className="absolute top-0 right-0 h-full w-full sm:w-80 bg-background dark:bg-background border-l border-border shadow-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Main Navigation"
      >
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-6">
            <motion.div variants={itemVariants} className="space-y-1">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => {
                    handleNavigation(section.id);
                    triggerHapticFeedback();
                  }}
                >
                  {sectionIcons[section.id] || <PanelLeft size={18} />}
                  <span>{section.name}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* Additional content passed as children */}
            {children && (
              <motion.div
                variants={itemVariants}
                className="pt-4 border-t border-border"
              >
                {children}
              </motion.div>
            )}

            {/* Theme and Accent Controls - Only show if useTheme is available */}
            {setTheme && (
              <motion.div
                variants={itemVariants}
                className="space-y-4 pt-6 border-t border-border"
              >
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Customize Appearance
                </h3>

                <div className="flex flex-col gap-4">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Theme
                    </span>
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                          theme === "dark" ? "bg-indigo-500" : "bg-yellow-400"
                        }`}
                        onClick={() => {
                          setTheme(theme === "light" ? "dark" : "light");
                          triggerHapticFeedback();
                        }}
                      >
                        <motion.div
                          layout
                          className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            theme === "dark"
                              ? "translate-x-6 bg-gray-800"
                              : "translate-x-0 bg-white"
                          }`}
                        />
                      </motion.button>
                    </div>
                  </div>

                  {/* Accent Color Picker */}
                  {setAccent && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Accent Color
                      </span>
                      <div className="flex gap-3 mt-2">
                        {accentOptions.map(({ color, icon, bgColor }) => (
                          <motion.button
                            key={color}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setAccent(color as AccentColor);
                              triggerHapticFeedback();
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              accent === color
                                ? `ring-2 ring-offset-2 ring-primary ${bgColor}`
                                : `${bgColor} bg-opacity-50 hover:bg-opacity-80`
                            }`}
                            aria-label={`${color} accent`}
                          >
                            {icon}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
};

export default NavigationContent;
