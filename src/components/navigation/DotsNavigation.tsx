import { useNavigation } from "@/contexts/NavigationContext";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useState } from "react";

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

  // Size configurations
  const sizeConfig = {
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
  };

  const config = sizeConfig[dotSize];

  // Handle navigation with haptic feedback simulation
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

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, sectionId: string) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleNavigation(sectionId);
      }
    },
    [handleNavigation]
  );

  // Get section progress (for visual feedback)
  const getSectionProgress = useCallback(
    (sectionId: string): number => {
      const sectionIndex = sections.findIndex((s) => s.id === sectionId);
      const totalSections = sections.length;

      if (sectionIndex === -1) return 0;

      // Calculate progress based on scroll position and section position
      const sectionProgress = sectionIndex / Math.max(totalSections - 1, 1);
      return Math.min(
        Math.max(scrollProgress / Math.max(sectionProgress, 0.1), 0),
        1
      );
    },
    [sections, scrollProgress]
  );

  const positionClass = position === "left" ? "left-6" : "right-6";

  return (
    <nav
      className={`fixed top-1/2 ${positionClass} transform -translate-y-1/2
        z-40 hidden lg:flex flex-col items-center ${config.container} ${className}`}
      aria-label="Section navigation"
      role="navigation"
    >
      {/* Progress Line */}
      {showProgress && (
        <div
          className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2
          w-0.5 bg-border"
        >
          <motion.div
            className="w-full bg-primary origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: scrollProgress }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>
      )}

      {sections.map((section, index) => {
        const isActive = section.id === activeSection;
        const isHovered = hoveredSection === section.id;
        const sectionProgress = getSectionProgress(section.id);

        return (
          <div key={section.id} className="relative z-10">
            {/* Tooltip */}
            <AnimatePresence>
              {(isHovered || isActive) && showLabels && (
                <motion.div
                  initial={{
                    opacity: 0,
                    x: position === "right" ? 10 : -10,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    x: position === "right" ? -10 : 10,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    x: position === "right" ? 10 : -10,
                    scale: 0.9,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`absolute top-1/2 transform -translate-y-1/2
                    ${position === "right" ? "right-8" : "left-8"}
                    px-3 py-1.5 bg-popover border border-border rounded-md
                    shadow-md backdrop-blur-sm ${config.tooltip} font-medium
                    whitespace-nowrap pointer-events-none`}
                >
                  <span>{section.name}</span>
                  {section.description && (
                    <div className="text-xs text-muted-foreground mt-0.5">
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
                      w-0 h-0 border-t-4 border-b-4 border-transparent
                      ${
                        position === "right"
                          ? "border-r-4 border-r-border"
                          : "border-l-4 border-l-border"
                      }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Dot */}
            <motion.button
              className={`relative rounded-full border-2 transition-all duration-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                focus-visible:ring-offset-2 focus-visible:ring-offset-background
                ${
                  isActive
                    ? `${config.activeDot} bg-primary border-primary shadow-lg shadow-primary/25`
                    : `${config.dot} bg-background border-border hover:border-primary/50 hover:bg-primary/10`
                }`}
              onClick={() => handleNavigation(section.id)}
              onKeyDown={(e) => handleKeyDown(e, section.id)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: isActive ? 1.1 : 1,
                rotate: isActive ? 360 : 0,
              }}
              transition={{
                scale: { type: "spring", stiffness: 300, damping: 25 },
                rotate: { duration: 0.6, ease: "easeInOut" },
              }}
              aria-label={`Navigate to ${section.name} section`}
              aria-current={isActive ? "page" : undefined}
              aria-describedby={`section-${section.id}-desc`}
              tabIndex={0}
            >
              {/* Inner Progress Ring */}
              {showProgress && isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Section Number */}
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
                className="absolute top-full left-1/2 transform -translate-x-1/2
                  w-0.5 bg-border z-0"
                style={{
                  height: config.container.includes("space-y-2")
                    ? "8px"
                    : config.container.includes("space-y-3")
                    ? "12px"
                    : "16px",
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: sectionProgress }}
                transition={{ ease: "easeOut", duration: 0.5 }}
              />
            )}
          </div>
        );
      })}

      {/* Accessibility Info */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Currently viewing {sections.find((s) => s.id === activeSection)?.name}{" "}
        section
      </div>
    </nav>
  );
};

export default DotsNavigation;
