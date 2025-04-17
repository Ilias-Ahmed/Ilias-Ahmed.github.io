import { useEffect, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion"; // Add motion for better visual feedback

type NavSection = {
  name: string;
  href: string;
  id: string;
};

const GestureNavigation = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [isGesturing, setIsGesturing] = useState(false);
  const isMobile = useIsMobile();

  const sections: NavSection[] = [
    { name: "Home", href: "#home", id: "home" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Skills", href: "#skills", id: "skills" },
    { name: "About", href: "#about", id: "about" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  // Navigate to section with debug info
  const navigateToSection = (index: number) => {
    console.log(`Attempting to navigate to section index: ${index}`);

    if (index >= 0 && index < sections.length) {
      const section = document.getElementById(sections[index].id);
      console.log(`Looking for element with ID: ${sections[index].id}`);

      if (section) {
        console.log(
          `Found section: ${sections[index].name}, scrolling into view`
        );
        section.scrollIntoView({ behavior: "smooth" });
        setCurrentSectionIndex(index);
      } else {
        console.error(`Element with ID '${sections[index].id}' not found`);
      }
    } else {
      console.log(
        `Invalid section index: ${index}, bounds are 0-${sections.length - 1}`
      );
    }
  };

  // Update current section based on scroll position with throttling
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;

      isScrolling = true;

      // Clear the previous timeout
      clearTimeout(scrollTimeout);

      // Set a new timeout
      scrollTimeout = setTimeout(() => {
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;

        // Log scroll position for debugging
        console.log(
          `Scroll position: ${scrollPosition}, viewport height: ${viewportHeight}`
        );

        // Check each section with a more accurate calculation
        const sectionElements = sections.map((section, index) => {
          const element = document.getElementById(section.id);
          const offset = element?.getBoundingClientRect().top || 0;
          const height = element?.offsetHeight || 0;

          return {
            index,
            name: section.name,
            // Using element.getBoundingClientRect() for more accurate positioning
            offset: offset + scrollPosition,
            height,
          };
        });

        // Log sections for debugging
        console.log(
          "Section positions:",
          sectionElements.map(
            (s) => `${s.name}: offset=${s.offset}, height=${s.height}`
          )
        );

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
          console.log(`Updating current section to: ${currentSection.name}`);
          setCurrentSectionIndex(currentSection.index);
        }

        isScrolling = false;
      }, 100); // 100ms throttle
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [sections, currentSectionIndex]);

  // Set up swipe gesture detection with improved handling
  const bind = useGesture(
    {
      onDrag: ({
        movement: [movementX],
        direction: [dirX],
        down,
        distance,
        event,
      }) => {
        // Prevent default to avoid conflicts
        if (event && event.cancelable) {
          event.preventDefault();
        }

        // Show visual feedback during drag
        if (down && distance > 20) {
          setIsGesturing(true);
          if (dirX > 0) {
            setSwipeDirection("right");
          } else if (dirX < 0) {
            setSwipeDirection("left");
          }
        }

        // Handle the swipe when released
        if (!down && distance > 50) {
          console.log(
            `Swipe detected: direction=${
              dirX > 0 ? "right" : "left"
            }, distance=${distance}`
          );

          if (dirX > 0) {
            // Swipe right (previous section)
            console.log(
              `Swiping right, navigating from index ${currentSectionIndex} to ${
                currentSectionIndex - 1
              }`
            );
            navigateToSection(currentSectionIndex - 1);
          } else if (dirX < 0) {
            // Swipe left (next section)
            console.log(
              `Swiping left, navigating from index ${currentSectionIndex} to ${
                currentSectionIndex + 1
              }`
            );
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

        return false;
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

  // Don't render anything if not mobile but keep a debug message
  if (!isMobile) {
    console.log("Gesture navigation disabled (not on mobile device)");
    return null;
  }

  return (
    <>
      {/* Swipe area - only covers the sides of the screen to avoid interference */}
      <div
        {...bind()}
        className="fixed inset-x-0 inset-y-0 z-30 pointer-events-auto"
        style={{ touchAction: "pan-y" }}
      >
        {/* Visual swipe indicator */}
        {isGesturing && swipeDirection && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
          >
            <div
              className={`
              w-16 h-16 rounded-full bg-cyberpunk-dark flex items-center justify-center
              border-2 border-cyberpunk-pink
            `}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-cyberpunk-pink"
                style={{
                  transform:
                    swipeDirection === "right" ? "rotate(180deg)" : "none",
                }}
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
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-2 z-40">
        {sections.map((section, index) => (
          <motion.div
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
            onClick={() => navigateToSection(index)}
            title={section.name}
            animate={{
              scale: index === currentSectionIndex ? 1.2 : 1,
            }}
          />
        ))}
      </div>

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
      >
        {currentSectionIndex < sections.length &&
          sections[currentSectionIndex].name}
      </motion.div>
    </>
  );
};

export default GestureNavigation;
