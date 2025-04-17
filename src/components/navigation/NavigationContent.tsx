import React, { useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
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
        <div className="flex items-center justify-between p-4 border-b border-border">
          <motion.h2
            className="text-xl font-bold text-primary"
            variants={itemVariants}
          >
            Menu
          </motion.h2>
        </div>

        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-6">
            <motion.div variants={itemVariants} className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Navigation
              </h3>

              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => handleNavigation(section.id)}
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
                className="space-y-2 pt-4 border-t border-border"
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Appearance
                </h3>

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground">Theme</span>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTheme("light")}
                      className={`p-2 rounded-md flex items-center justify-center ${
                        theme === "light"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      aria-label="Light theme"
                    >
                      <Sun size={16} />
                      <span className="ml-2">Light</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTheme("dark")}
                      className={`p-2 rounded-md flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      aria-label="Dark theme"
                    >
                      <Moon size={16} />
                      <span className="ml-2">Dark</span>
                    </motion.button>
                  </div>
                </div>

                {/* Accent Color - Only show if setAccent is available */}
                {setAccent && (
                  <div className="flex flex-col gap-2 mt-4">
                    <span className="text-xs text-muted-foreground">
                      Accent Color
                    </span>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAccent("purple")}
                        className={`p-2 rounded-md flex items-center justify-center ${
                          accent === "purple"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                        aria-label="Purple accent"
                      >
                        <Zap size={16} />
                        <span className="ml-2">Purple</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAccent("blue")}
                        className={`p-2 rounded-md flex items-center justify-center ${
                          accent === "blue"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                        aria-label="Blue accent"
                      >
                        <Bolt size={16} />
                        <span className="ml-2">Blue</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAccent("pink")}
                        className={`p-2 rounded-md flex items-center justify-center ${
                          accent === "pink"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                        aria-label="Pink accent"
                      >
                        <Flame size={16} />
                        <span className="ml-2">Pink</span>
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
};

export default NavigationContent;
