import { useEffect, useState, useCallback, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { triggerHapticFeedback } from "@/utils/haptics";

type NavSection = {
  name: string;
  href: string;
  id: string;
};

const sections: NavSection[] = [
  { name: "Home", href: "#home", id: "home" },
  { name: "Projects", href: "#projects", id: "projects" },
  { name: "Skills", href: "#skills", id: "skills" },
  { name: "About", href: "#about", id: "about" },
  { name: "Contact", href: "#contact", id: "contact" },
];

// Changed return type to React.ReactElement | null to avoid JSX namespace error
const GestureNavigation = (): React.ReactElement | null => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [isGesturing, setIsGesturing] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef<boolean>(false);

  const navigateToSection = useCallback((index: number): void => {
    if (index >= 0 && index < sections.length) {
      const section = document.getElementById(sections[index].id);

      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        setCurrentSectionIndex(index);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = (): void => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;

        const sectionElements = sections.map((section, index) => {
          const element = document.getElementById(section.id);
          const offset = element?.getBoundingClientRect().top || 0;
          const height = element?.offsetHeight || 0;

          return {
            index,
            name: section.name,
            offset: offset + scrollPosition,
            height,
          };
        });

        // Find the section that takes up most of the viewport
        const currentSection = sectionElements.reduce((prev, current) => {
          const prevVisible = Math.max(
            0,
            Math.min(
              prev.offset + prev.height,
              scrollPosition + viewportHeight
            ) - Math.max(prev.offset, scrollPosition)
          );

          const currentVisible = Math.max(
            0,
            Math.min(
              current.offset + current.height,
              scrollPosition + viewportHeight
            ) - Math.max(current.offset, scrollPosition)
          );

          return currentVisible > prevVisible ? current : prev;
        }, sectionElements[0]);

        if (currentSection && currentSection.index !== currentSectionIndex) {
          setCurrentSectionIndex(currentSection.index);
        }

        isScrollingRef.current = false;
      }, 100); // 100ms throttle
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentSectionIndex]);

  // Fixed gesture handling to ensure it works properly
  const bind = useGesture(
    {
      onDrag: ({ direction: [dirX], down, distance, event }) => {
        // Prevent default to avoid conflicts with other touch events
        if (event && event.cancelable) {
          event.preventDefault();
        }

        // Show visual feedback during drag
        if (down && Math.hypot(...distance) > 20) {
          setIsGesturing(true);
          setSwipeDirection(dirX > 0 ? "right" : "left");
        }

        // Handle the swipe when released
        if (!down && Math.hypot(...distance) > 50) {
          if (dirX > 0) {
            // Swipe right (previous section)
            navigateToSection(currentSectionIndex - 1);
          } else if (dirX < 0) {
            // Swipe left (next section)
            navigateToSection(currentSectionIndex + 1);
          }

          // Reset gesture state
          setIsGesturing(false);
          setSwipeDirection(null);
        } else if (!down) {
          // Reset if released without sufficient distance
          setIsGesturing(false);
          setSwipeDirection(null);
        }
      },
    },
    {
      drag: {
        threshold: 5, // Lower threshold for responsiveness
        filterTaps: true,
        axis: "x", // Only detect horizontal swipes
        pointer: { touch: true }, // Only respond to touch events
      },
    }
  );

  // Don't render anything if not mobile
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Swipe area - covers the entire screen for better gesture detection */}
      <div
        {...bind()}
        className="fixed inset-x-0 inset-y-0 z-30 pointer-events-auto"
        style={{ touchAction: "pan-y" }}
        aria-hidden="true"
      >
        {/* Visual swipe indicator */}
        {isGesturing && swipeDirection && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
          >
            <div
              className="w-16 h-16 rounded-full bg-cyberpunk-dark flex items-center justify-center
              border-2 border-cyberpunk-pink"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-cyberpunk-pink"
                style={{
                  transform:
                    swipeDirection === "right" ? "rotate(180deg)" : "none",
                }}
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
                />
              </svg>
            </div>
          </motion.div>
        )}
      </div>

      {/* Section indicators */}
      <nav
        className="fixed top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-2 z-40"
        aria-label="Section navigation"
      >
        {sections.map((section, index) => (
          <motion.button
            key={index}
            className={`
              w-2 h-2 rounded-full transition-all duration-300 cursor-pointer
              ${
                index === currentSectionIndex
                  ? "bg-cyberpunk-pink"
                  : "bg-white/30"
              }
            `}
            whileHover={{ scale: 1.5 }}
            onClick={() => {
              navigateToSection(index)
              triggerHapticFeedback();
            }}
            aria-label={`Navigate to ${section.name}`}
            aria-current={index === currentSectionIndex ? "page" : undefined}
            animate={{
              scale: index === currentSectionIndex ? 1.2 : 1,
            }}
          />
        ))}
      </nav>

      {/* Current section name toast */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 py-1 px-3
                   bg-cyberpunk-dark/80 border border-cyberpunk-pink rounded-full
                   text-white text-xs z-40"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: isGesturing ? 1 : 0,
          y: isGesturing ? 0 : 10,
        }}
        transition={{ duration: 0.2 }}
        aria-live="polite"
        aria-atomic="true"
      >
        {currentSectionIndex < sections.length &&
          sections[currentSectionIndex].name}
      </motion.div>
    </>
  );
};

export default GestureNavigation;
