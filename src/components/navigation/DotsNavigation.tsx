import { useNavigation } from "@/contexts/NavigationContext";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface DotsNavigationProps {
  position?: "left" | "right";
  showLabels?: boolean;
  showProgress?: boolean;
  dotSize?: "sm" | "md" | "lg";
  className?: string;
}

const DotsNavigation: React.FC<DotsNavigationProps> = ({
  position = "right",
  showLabels = true,
  showProgress = true,
  dotSize = "md",
  className = "",
}) => {
  const { sections, activeSection, navigateToSection, scrollProgress } =
    useNavigation();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Memoized size configurations
  const sizeConfig = React.useMemo(
    () => ({
      sm: {
        dot: "w-2 h-2",
        activeDot: "w-3 h-3",
        container: "space-y-2",
        tooltip: "text-xs",
      },
      md: {
        dot: "w-3 h-3",
        activeDot: "w-4 h-4",
        container: "space-y-3",
        tooltip: "text-sm",
      },
      lg: {
        dot: "w-4 h-4",
        activeDot: "w-5 h-5",
        container: "space-y-4",
        tooltip: "text-base",
      },
    }),
    []
  );

  const config = sizeConfig[dotSize];

  // Optimized navigation handler with haptic feedback
  const handleNavigation = useCallback(
    async (sectionId: string) => {
      try {
        // Simulate haptic feedback for mobile devices
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        await navigateToSection(sectionId);
      } catch (error) {
        console.error("Navigation failed:", error);
      }
    },
    [navigateToSection]
  );

  // Optimized keyboard navigation handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, sectionId: string) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleNavigation(sectionId);
      }
    },
    [handleNavigation]
  );

  // Memoized hover handlers
  const handleMouseEnter = useCallback((sectionId: string) => {
    setHoveredSection(sectionId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredSection(null);
  }, []);

  // Get section progress for current section
  const getSectionProgress = useCallback(
    (sectionId: string) => {
      if (activeSection !== sectionId) return 0;
      return scrollProgress && typeof scrollProgress === "object"
        ? (scrollProgress[sectionId] as number) || 0
        : 0;
    },
    [activeSection, scrollProgress]
  );

  // Don't render if no sections
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <nav
      className={`fixed ${position === "right" ? "right-6" : "left-6"}
        top-1/2 transform -translate-y-1/2 z-40 ${className}`}
      role="navigation"
      aria-label="Section navigation"
      style={{
        filter: `drop-shadow(0 4px 12px ${accentColors.glow})`,
      }}
    >
      <div className={`flex flex-col ${config.container}`}>
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;
          const isHovered = hoveredSection === section.id;
          const sectionProgress = getSectionProgress(section.id);

          return (
            <div key={section.id} className="relative">
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && showLabels && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: position === "right" ? 10 : -10,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      x: position === "right" ? -12 : 12,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      x: position === "right" ? 10 : -10,
                      scale: 0.9,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`absolute top-1/2 transform -translate-y-1/2 z-50
                      ${position === "right" ? "right-8" : "left-8"}
                      px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm border
                      ${
                        config.tooltip
                      } font-medium whitespace-nowrap pointer-events-none`}
                    style={{
                      backgroundColor: isDark
                        ? "rgba(17, 24, 39, 0.95)"
                        : "rgba(255, 255, 255, 0.95)",
                      borderColor: accentColors.border,
                      color: isDark ? "#ffffff" : "#000000",
                      boxShadow: `0 8px 32px ${accentColors.glow}`,
                    }}
                  >
                    <span className="font-semibold">{section.name}</span>
                    {section.description && (
                      <div className="text-xs opacity-70 mt-1">
                        {section.description}
                      </div>
                    )}

                    {/* Tooltip Arrow */}
                    <div
                      className={`absolute top-1/2 transform -translate-y-1/2
                        ${
                          position === "right"
                            ? "left-0 -translate-x-full"
                            : "right-0 translate-x-full"
                        }
                        w-0 h-0 border-t-4 border-b-4 border-transparent`}
                      style={{
                        borderRightColor:
                          position === "right"
                            ? accentColors.border
                            : "transparent",
                        borderLeftColor:
                          position === "left"
                            ? accentColors.border
                            : "transparent",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Dot */}
              <motion.button
                className={`relative rounded-full border-2 transition-all duration-300 cursor-pointer
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75
                  focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  backdrop-blur-sm ${
                    isActive
                      ? `${config.activeDot} shadow-lg`
                      : `${config.dot} hover:scale-110`
                  }`}
                style={{
                  backgroundColor: isActive
                    ? accentColors.primary
                    : isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                  borderColor: isActive
                    ? accentColors.primary
                    : isDark
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(0, 0, 0, 0.3)",
                  boxShadow: isActive
                    ? `0 0 20px ${accentColors.glow}, 0 0 40px ${accentColors.glow}40`
                    : "none",
                }}
                onClick={() => handleNavigation(section.id)}
                onKeyDown={(e) => handleKeyDown(e, section.id)}
                onMouseEnter={() => handleMouseEnter(section.id)}
                onMouseLeave={handleMouseLeave}
                whileHover={{
                  scale: 1.2,
                  backgroundColor: accentColors.primary,
                  borderColor: accentColors.primary,
                }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  rotate: isActive ? 360 : 0,
                }}
                transition={{
                  scale: { type: "spring", stiffness: 300, damping: 25 },
                  rotate: { duration: 0.6, ease: "easeInOut" },
                  backgroundColor: { duration: 0.2 },
                  borderColor: { duration: 0.2 },
                }}
                aria-label={`Navigate to ${section.name} section`}
                aria-current={isActive ? "page" : undefined}
                aria-describedby={`section-${section.id}-desc`}
                tabIndex={0}
              >
                {/* Inner Progress Ring */}
                {showProgress && isActive && sectionProgress > 0 && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{
                      borderColor: `${accentColors.primary}60`,
                      borderTopColor: accentColors.primary,
                    }}
                    initial={{ rotate: 0 }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}

                {/* Pulsing animation for active dot */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: accentColors.primary,
                      opacity: 0.3,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Section Number for accessibility */}
                <span className="sr-only">
                  Section {index + 1}: {section.name}
                </span>

                {/* Hidden description for screen readers */}
                <div id={`section-${section.id}-desc`} className="sr-only">
                  {section.description || `Navigate to ${section.name} section`}
                </div>
              </motion.button>

              {/* Connection Line to Next Dot */}
              {index < sections.length - 1 && showProgress && (
                <motion.div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 z-0"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.2)",
                    height: config.container.includes("space-y-2")
                      ? "8px"
                      : config.container.includes("space-y-3")
                      ? "12px"
                      : "16px",
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{
                    scaleY: sectionProgress,
                    backgroundColor: isActive
                      ? `${accentColors.primary}80`
                      : isDark
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.2)",
                  }}
                  transition={{ ease: "easeOut", duration: 0.5 }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Accessibility Info */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Currently viewing {sections.find((s) => s.id === activeSection)?.name}{" "}
        section ({sections.findIndex((s) => s.id === activeSection) + 1} of{" "}
        {sections.length})
      </div>
    </nav>
  );
};

export default React.memo(DotsNavigation);
