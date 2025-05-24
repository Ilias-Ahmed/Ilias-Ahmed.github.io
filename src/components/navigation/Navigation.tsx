import React, { useState, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigation } from "@/contexts/NavigationContext";
import { useIsMobile } from "@/hooks/use-mobile";
import DotsNavigation from "./DotsNavigation";
import VoiceNavigation from "./VoiceNavigation";
import DockNavigation from "./DockNavigation";
import NavigationMenu from "./NavigationMenu";
import BackToTop from "../ui/BackToTop";
import CommandPalette from "../ui/CommandPalette";

// Enhanced interfaces
interface NavigationProps {
  enableDots?: boolean;
  enableVoice?: boolean;
  enableCommandPalette?: boolean;
  enableBackToTop?: boolean;
  enableDock?: boolean;
  enableMenu?: boolean;
  preferDockOnDesktop?: boolean;
  navigationStyle?: "dock" | "menu" | "dots" | "auto";
  className?: string;
  ariaLabel?: string;
}

interface SectionMapping {
  [key: string]: string;
}

// Utility function for haptic feedback with proper error handling
const triggerHapticFeedback = (
  intensity: "light" | "medium" | "heavy" = "medium"
): void => {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 20, medium: 50, heavy: 100 };
      navigator.vibrate(patterns[intensity]);
    }
  } catch (error) {
    // Silently fail - haptic feedback is optional
    console.debug("Haptic feedback not available:", error);
  }
};

// Main Navigation Component
const Navigation: React.FC<NavigationProps> = ({
  enableDots = true,
  enableVoice = true,
  enableCommandPalette = true,
  enableBackToTop = true,
  enableDock = true,
  enableMenu = true,
  preferDockOnDesktop = true,
  navigationStyle = "auto",
  className = "",
  ariaLabel = "Main navigation",
}) => {
  // Hooks
  const navigation = useNavigation();
  const isMobile = useIsMobile();

  // State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Safe destructuring with fallbacks and type safety
  const {
    isMenuOpen = false,
    toggleMenu = () => {},
    closeMenu = () => {},
    sections = [],
    navigateToSection = () => {},
    activeSection = "home",
  } = navigation || {};

  // Initialize component
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Enhanced haptic feedback with proper error boundaries
  const safeHapticFeedback = useCallback(
    (intensity: "light" | "medium" | "heavy" = "medium") => {
      if (!isInitialized) return;
      triggerHapticFeedback(intensity);
    },
    [isInitialized]
  );

  // Menu toggle handler with error boundaries
  const handleMenuToggle = useCallback(() => {
    try {
      if (typeof toggleMenu === "function") {
        toggleMenu();
        safeHapticFeedback("medium");
      }
    } catch (error) {
      console.error("Error toggling menu:", error);
    }
  }, [toggleMenu, safeHapticFeedback]);

  // Command palette handlers
  const handleCommandPaletteOpen = useCallback(() => {
    try {
      setIsCommandPaletteOpen(true);
      safeHapticFeedback("light");
    } catch (error) {
      console.error("Error opening command palette:", error);
    }
  }, [safeHapticFeedback]);

  const handleCommandPaletteClose = useCallback((open: boolean) => {
    try {
      setIsCommandPaletteOpen(open);
    } catch (error) {
      console.error("Error closing command palette:", error);
    }
  }, []);

  // Navigation handler with proper validation
  const handleNavigation = useCallback(
    (sectionId: string) => {
      try {
        if (!sectionId || typeof navigateToSection !== "function") {
          console.warn("Invalid navigation parameters");
          return;
        }

        // Validate section exists
        const sectionExists = sections.some(
          (section) => section?.id === sectionId
        );
        if (!sectionExists) {
          console.warn(`Section with id "${sectionId}" does not exist`);
          return;
        }

        navigateToSection(sectionId);

        // Close menu if open
        if (isMenuOpen && typeof closeMenu === "function") {
          closeMenu();
        }

        safeHapticFeedback("medium");
      } catch (error) {
        console.error("Error navigating to section:", error);
      }
    },
    [navigateToSection, closeMenu, isMenuOpen, sections, safeHapticFeedback]
  );

  // Memoized section mapping for performance
  const sectionMapping: SectionMapping = useMemo(
    () => ({
      "1": "home",
      "2": "about",
      "3": "skills",
      "4": "projects",
      "5": "contact",
    }),
    []
  );

  // Navigation style determination with memoization
  const currentNavigationStyle = useMemo(() => {
    if (navigationStyle !== "auto") return navigationStyle;

    if (isMobile) return "menu";
    if (preferDockOnDesktop && enableDock) return "dock";
    if (enableDots) return "dots";
    return "menu";
  }, [navigationStyle, isMobile, preferDockOnDesktop, enableDock, enableDots]);

  // Component visibility flags with memoization
  const navigationFlags = useMemo(
    () => ({
      showHamburgerMenu:
        currentNavigationStyle === "menu" || (isMobile && enableMenu),
      showDock: currentNavigationStyle === "dock" && enableDock && !isMobile,
      showDots: currentNavigationStyle === "dots" && enableDots && !isMobile,
    }),
    [currentNavigationStyle, isMobile, enableMenu, enableDock, enableDots]
  );

  // Global keyboard shortcuts with proper cleanup
  useEffect(() => {
    if (!isInitialized) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      try {
        // Prevent shortcuts when user is typing in inputs
        const activeElement = document.activeElement;
        const isTyping =
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.getAttribute("contenteditable") === "true");

        // Close modals on ESC key
        if (e.key === "Escape") {
          if (isMenuOpen && typeof closeMenu === "function") {
            e.preventDefault();
            closeMenu();
            safeHapticFeedback("light");
            return;
          }

          if (isCommandPaletteOpen) {
            e.preventDefault();
            setIsCommandPaletteOpen(false);
            return;
          }

          return;
        }

        // Skip other shortcuts if typing
        if (isTyping) return;

        // Toggle menu on Alt+M (only for hamburger menu)
        if (e.altKey && e.key.toLowerCase() === "m") {
          if (navigationFlags.showHamburgerMenu) {
            e.preventDefault();
            handleMenuToggle();
          }
          return;
        }

        // Open command palette on Ctrl+K or Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          handleCommandPaletteOpen();
          return;
        }

        // Quick navigation shortcuts (Alt + number)
        if (e.altKey && !isCommandPaletteOpen && !isMenuOpen) {
          const sectionId = sectionMapping[e.key];
          if (sectionId) {
            e.preventDefault();
            handleNavigation(sectionId);
          }
        }
      } catch (error) {
        console.error("Error handling keyboard shortcut:", error);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isInitialized,
    isMenuOpen,
    isCommandPaletteOpen,
    closeMenu,
    handleMenuToggle,
    handleCommandPaletteOpen,
    handleNavigation,
    sectionMapping,
    navigationFlags.showHamburgerMenu,
    safeHapticFeedback,
  ]);

  // Custom events handling with proper cleanup
  useEffect(() => {
    if (!isInitialized) return;

    const handleOpenCommandPalette = () => {
      try {
        handleCommandPaletteOpen();
      } catch (error) {
        console.error("Error handling open command palette event:", error);
      }
    };

    const handleCloseModals = () => {
      try {
        if (isMenuOpen && typeof closeMenu === "function") {
          closeMenu();
        }
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
        }
      } catch (error) {
        console.error("Error handling close modals event:", error);
      }
    };

    // Listen for custom events
    const events = [
      { name: "openCommandPalette", handler: handleOpenCommandPalette },
      { name: "open-command-palette", handler: handleOpenCommandPalette },
      { name: "close-modals", handler: handleCloseModals },
    ];

    events.forEach(({ name, handler }) => {
      window.addEventListener(name, handler);
    });

    return () => {
      events.forEach(({ name, handler }) => {
        window.removeEventListener(name, handler);
      });
    };
  }, [
    isInitialized,
    isMenuOpen,
    isCommandPaletteOpen,
    closeMenu,
    handleCommandPaletteOpen,
  ]);

  // Early return for SSR or uninitialized state
  if (!isInitialized || typeof window === "undefined") {
    return null;
  }

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      opacity: 1,
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
    closed: { opacity: 0, x: 30 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <div
      className={`navigation-container ${className}`}
      role="navigation"
      aria-label={ariaLabel}
    >
      {/* Hamburger Menu Toggle Button */}
      {navigationFlags.showHamburgerMenu && (
        <motion.button
          onClick={handleMenuToggle}
          className="fixed top-4 right-4 md:top-6 md:right-6 z-[60] p-3
            bg-background/80 backdrop-blur-sm shadow-2xl rounded-full
            border border-border/50 hover:bg-background/90
            transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50
            touch-manipulation select-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="navigation-menu"
          aria-haspopup="true"
          tabIndex={0}
          type="button"
        >
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-foreground"
            aria-hidden="true"
          >
            <motion.path
              initial={false}
              animate={isMenuOpen ? "open" : "closed"}
              variants={{
                closed: {
                  d: "M3 6h18M3 12h18M3 18h18",
                  transition: { duration: 0.3, ease: "easeInOut" },
                },
                open: {
                  d: "M6 6L18 18M6 18L18 6",
                  transition: { duration: 0.3, ease: "easeInOut" },
                },
              }}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.button>
      )}

      {/* Enhanced Navigation Menu Component */}
      {navigationFlags.showHamburgerMenu && enableMenu && (
        <NavigationMenu
          showQuickActions={true}
          showDeviceStatus={true}
          compactMode={false}
        />
      )}

      {/* Fallback Traditional Menu */}
      {navigationFlags.showHamburgerMenu && !enableMenu && (
        <AnimatePresence mode="wait">
          {isMenuOpen && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="navigation-title"
              id="navigation-menu"
              className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleMenuToggle();
                }
              }}
            >
              <div className="h-full flex flex-col justify-center max-w-screen-lg mx-auto px-6 py-20">
                <h2 id="navigation-title" className="sr-only">
                  Navigation Menu
                </h2>

                {/* Navigation Links */}
                <nav
                  className="space-y-3 mb-12"
                  role="navigation"
                  aria-label="Main navigation"
                >
                  {sections.map((section, index) => (
                    <motion.button
                      key={section?.id || index}
                      variants={itemVariants}
                      className={`group flex items-center gap-4 w-full px-6 py-4
                        text-xl md:text-2xl hover:bg-white/5 rounded-xl
                        transition-all duration-200 focus:outline-none
                        focus:bg-white/10 focus:ring-2 focus:ring-primary/50
                        ${
                          activeSection === section?.id
                            ? "bg-primary/20 text-primary"
                            : "text-white"
                        }
                        touch-manipulation`}
                      onClick={() =>
                        section?.id && handleNavigation(section.id)
                      }
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 8, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      tabIndex={0}
                      type="button"
                      aria-label={`Navigate to ${
                        section?.name || "unknown"
                      } section`}
                      aria-current={
                        activeSection === section?.id ? "page" : undefined
                      }
                    >
                      <span className="font-medium">
                        {section?.name || "Unknown Section"}
                      </span>
                      {activeSection === section?.id && (
                        <motion.div
                          className="w-2 h-2 bg-primary rounded-full"
                          layoutId="activeIndicator"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.button>
                  ))}
                </nav>

                {/* Command Palette Button */}
                {enableCommandPalette && (
                  <motion.button
                    variants={itemVariants}
                    className="flex items-center justify-between w-full px-6 py-4
                      text-left hover:bg-white/5 rounded-xl transition-colors
                      group focus:outline-none focus:bg-white/10
                      focus:ring-2 focus:ring-primary/50 touch-manipulation"
                    onClick={() => {
                      if (typeof closeMenu === "function") closeMenu();
                      handleCommandPaletteOpen();
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    tabIndex={0}
                    type="button"
                    aria-label="Open command palette"
                  >
                    <span className="font-medium text-white">
                      Command Palette
                    </span>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 text-xs bg-background/40 rounded border border-border/30">
                        {typeof navigator !== "undefined" &&
                        navigator.platform?.includes("Mac")
                          ? "⌘"
                          : "Ctrl"}
                      </kbd>
                      <kbd className="px-2 py-1 text-xs bg-background/40 rounded border border-border/30">
                        K
                      </kbd>
                    </div>
                  </motion.button>
                )}

                {/* Footer */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 pt-4 border-t border-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center text-sm text-white/60">
                    <p>
                      Press{" "}
                      <kbd className="px-1 py-0.5 bg-white/20 rounded text-xs">
                        Esc
                      </kbd>{" "}
                      to close
                    </p>
                    <p className="mt-1">Use Alt + 1-5 for quick navigation</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Desktop Navigation Components */}
      {navigationFlags.showDock && <DockNavigation />}

      {!isMobile && (
        <>
          {navigationFlags.showDots && <DotsNavigation />}
          {enableVoice && (
            <VoiceNavigation
              position="bottom-left"
              showTranscript={true}
              autoStopTimeout={5000}
            />
          )}
        </>
      )}

      {/* Command Palette */}
      {enableCommandPalette && (
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onOpenChange={handleCommandPaletteClose}
        />
      )}

      {/* Back to Top Button */}
      {enableBackToTop && <BackToTop position="bottom-right" threshold={300} />}

      {/* Accessibility Features */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
          z-[70] px-4 py-2 bg-primary text-primary-foreground rounded-md
          font-medium transition-all focus:scale-105"
        onFocus={() => safeHapticFeedback("light")}
      >
        Skip to main content
      </a>

      {/* Screen reader announcements */}
      <div
        id="keyboard-shortcuts-hint"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        Navigation shortcuts: Alt+M for menu, Ctrl+K for command palette,
        Alt+1-5 for quick navigation, Escape to close
      </div>

      {/* Active section announcement for screen readers */}
      <div
        id="active-section-announcement"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {activeSection &&
          `Current section: ${
            sections.find((s) => s?.id === activeSection)?.name || activeSection
          }`}
      </div>
    </div>
  );
};

export default Navigation;
