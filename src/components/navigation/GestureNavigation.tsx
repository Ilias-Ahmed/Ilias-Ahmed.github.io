import { useNavigation } from "@/contexts/NavigationContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGesture } from "@use-gesture/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Navigation } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface GestureState {
  isActive: boolean;
  direction: "left" | "right" | null;
  progress: number;
  targetSection: string | null;
}

interface GestureNavigationProps {
  enabled?: boolean;
  threshold?: number;
  sensitivity?: number;
  showIndicators?: boolean;
  showProgress?: boolean;
}

const GestureNavigation: React.FC<GestureNavigationProps> = ({
  enabled = true,
  threshold = 80,
  sensitivity = 1,
  showIndicators = true,
  showProgress = true,
}) => {
  const {
    sections,
    activeSection,
    navigateToSection,
    getNextSection,
    getPreviousSection,
  } = useNavigation();

  const isMobile = useIsMobile();

  const [gestureState, setGestureState] = useState<GestureState>({
    isActive: false,
    direction: null,
    progress: 0,
    targetSection: null,
  });

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const gestureRef = useRef<HTMLDivElement>(null);
  const cooldownRef = useRef(false);

  // Update current section index when active section changes
  useEffect(() => {
    const index = sections.findIndex((s) => s.id === activeSection);
    if (index !== -1) {
      setCurrentSectionIndex(index);
    }
  }, [activeSection, sections]);

  // Get target section based on gesture direction
  const getTargetSection = useCallback(
    (direction: "left" | "right"): string | null => {
      if (direction === "right") {
        return getNextSection();
      } else {
        return getPreviousSection();
      }
    },
    [getNextSection, getPreviousSection]
  );

  // Handle gesture navigation
  const handleNavigation = useCallback(
    async (direction: "left" | "right") => {
      if (cooldownRef.current) return;

      const targetSection = getTargetSection(direction);
      if (!targetSection) return;

      cooldownRef.current = true;

      try {
        await navigateToSection(targetSection, {
          duration: 0.8,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });
      } catch (error) {
        console.error("Gesture navigation failed:", error);
      } finally {
        // Reset cooldown after animation
        setTimeout(() => {
          cooldownRef.current = false;
        }, 800);
      }
    },
    [getTargetSection, navigateToSection]
  );

  // Setup gesture handlers
  const bind = useGesture(
    {
      onDrag: ({
        down,
        movement: [mx],
        velocity: [vx],
        cancel,
        event,
      }) => {
        // Prevent default to avoid conflicts
        if (
          event &&
          "preventDefault" in event &&
          typeof event.preventDefault === "function"
        ) {
          event.preventDefault();
        }

        // Only process horizontal gestures
        const absMovement = Math.abs(mx);
        const isHorizontal = absMovement > Math.abs(0); // Simplified check

        if (!isHorizontal && down) return;

        if (down) {
          const direction = mx > 0 ? "left" : "right";
          const targetSection = getTargetSection(direction);
          const progress = Math.min(absMovement / threshold, 1);

          setGestureState({
            isActive: true,
            direction,
            progress: progress * sensitivity,
            targetSection,
          });

          // Cancel if no target section available
          if (!targetSection && cancel) {
            cancel();
          }
        } else {
          // Gesture ended
          const shouldNavigate = absMovement > threshold || Math.abs(vx) > 0.5;

          if (shouldNavigate && gestureState.targetSection) {
            const direction = mx > 0 ? "left" : "right";
            handleNavigation(direction);
          }

          // Reset gesture state
          setGestureState({
            isActive: false,
            direction: null,
            progress: 0,
            targetSection: null,
          });
        }
      },    },
    {
      drag: {
        axis: "x",
        threshold: 10,
        filterTaps: true,
        pointer: { touch: true },
        rubberband: true,
      },
    }
  );

  // Don't render on desktop unless explicitly enabled
  if (!isMobile && !enabled) {
    return null;
  }

  return (
    <>
      {/* Gesture Area */}
      <div
        ref={gestureRef}
        {...bind()}
        className="fixed inset-0 z-30 touch-pan-y"
        style={{
          touchAction: "pan-y",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        aria-hidden="true"
      />

      {/* Section Indicators */}
      {showIndicators && (
        <nav
          className="fixed top-1/2 right-4 transform -translate-y-1/2
            flex flex-col items-center space-y-3 z-40"
          aria-label="Section indicators"
        >

          {sections.map((section) => {
            const isActive = section.id === activeSection;
            const isTarget = section.id === gestureState.targetSection;

            return (
              <motion.button
                key={section.id}
                className={`w-3 h-3 rounded-full transition-all duration-300
                  ${
                    isActive
                      ? "bg-primary w-4 h-4"
                      : isTarget && gestureState.isActive
                      ? "bg-primary/60 w-3.5 h-3.5"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                onClick={() => navigateToSection(section.id)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: isTarget && gestureState.isActive ? 1.3 : 1,
                  opacity: isActive ? 1 : 0.7,
                }}
                aria-label={`Navigate to ${section.name}`}
                aria-current={isActive ? "page" : undefined}
              />
            );

          })}        </nav>
      )}

      {/* Gesture Progress Indicator */}
      <AnimatePresence>
        {gestureState.isActive && showProgress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div
              className="flex items-center gap-3 px-4 py-3 bg-background/90
              backdrop-blur-md border border-border rounded-full shadow-lg"
            >
              {/* Direction Indicator */}
              <div className="flex items-center gap-2">
                {gestureState.direction === "left" ? (
                  <ChevronLeft className="w-5 h-5 text-primary" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-primary" />
                )}

                <span className="text-sm font-medium">
                  {gestureState.targetSection
                    ? sections.find((s) => s.id === gestureState.targetSection)
                        ?.name
                    : "No more sections"}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(gestureState.progress * 100, 100)}%`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Section Display */}
      <AnimatePresence>
        {gestureState.isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40
              px-3 py-1 bg-primary/20 border border-primary/30 rounded-full"
          >
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="w-4 h-4" />
              <span>
                {currentSectionIndex + 1} / {sections.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hints */}
      {!gestureState.isActive && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30
            text-xs text-muted-foreground text-center pointer-events-none"
        >
          <div className="flex items-center gap-1">
            <ChevronLeft className="w-3 h-3" />
            <span>Swipe to navigate</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default GestureNavigation;
