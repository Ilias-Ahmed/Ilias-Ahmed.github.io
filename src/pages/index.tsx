import React, {
  useState,
  useRef,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import SmoothScroll, { useLenis } from "@/components/SmoothScroll";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useVoiceNavigation } from "@/hooks/useVoiceNavigation";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";

// Lazy-loaded components
const DynamicBackground = React.lazy(
  () => import("@/components/ui/DynamicBackground")
);
const CustomCursor = React.lazy(() => import("@/components/ui/CustomCursor"));
const NavigationMenu = React.lazy(
  () => import("@/components/navigation/NavigationMenu")
);
const Toaster = React.lazy(() =>
  import("@/components/ui/sonner").then((mod) => ({ default: mod.Toaster }))
);
const VoiceCommandsHelp = React.lazy(
  () => import("@/components/navigation/VoiceCommandsHelp")
);
const VoiceNavigationIndicator = React.lazy(
  () => import("@/components/navigation/VoiceNavigationIndicator")
);
const NavigationIndicator = React.lazy(
  () => import("@/components/navigation/NavigationIndicator")
);
const NavigationTrail = React.lazy(
  () => import("@/components/navigation/NavigationTrail")
);
const LoadingScreen = React.lazy(() => import("@/components/ui/LoadingScreen"));

// Lazy-loaded sections
const AboutSection = React.lazy(() => import("@/sections/AboutSection"));
const SkillsSection = React.lazy(() => import("@/sections/SkillsSection"));
const ProjectsSection = React.lazy(() => import("@/sections/ProjectsSection"));
const ContactSection = React.lazy(() => import("@/sections/ContactSection"));

/**
 * Main Index component
 */
const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, accent } = useTheme();
  const [isNavigating, setIsNavigating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [previousPath, setPreviousPath] = useState("/");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Memoize constant values
  const routes = useMemo(
    () => ["/", "/about", "/skills", "/projects", "/contact"],
    []
  );

  const sections = useMemo(
    () => [
      { id: "home", route: "/" },
      { id: "about", route: "/about" },
      { id: "skills", route: "/skills" },
      { id: "projects", route: "/projects" },
      { id: "contact", route: "/contact" },
    ],
    []
  );

  // Use scroll spy to track active section
  const { activeSection, setScrolling } = useScrollSpy(sections, 100);

  // Enable keyboard navigation
  useKeyboardNavigation(routes);

  // Enable voice navigation - memoize the routes object
  const voiceRoutes = useMemo(
    () => ({
      home: "/",
      about: "/about",
      skills: "/skills",
      projects: "/projects",
      contact: "/contact",
    }),
    []
  );

  const { isListening, toggleListening, transcript, voiceSupported } =
    useVoiceNavigation({
      enabled: true,
      commandFeedback: true,
      routes: voiceRoutes,
    });

  // Handle route changes with useCallback
  const handleRouteChange = useCallback(() => {
    if (previousPath && location.pathname !== previousPath) {
      const prevIndex = routes.indexOf(previousPath);
      const currentIndex = routes.indexOf(location.pathname);

      setDirection(prevIndex < currentIndex ? "forward" : "backward");
      setIsNavigating(true);

      // Reset navigation state after animation completes
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 800);

      return () => clearTimeout(timer);
    }

    setPreviousPath(location.pathname);
  }, [location.pathname, previousPath, routes]);

  useEffect(handleRouteChange, [handleRouteChange]);

  // Handle scroll-based navigation with useCallback
  const handleScrollNavigation = useCallback(() => {
    if (activeSection && !isNavigating && !isScrolling) {
      const sectionRoute = sections.find(
        (section) => section.id === activeSection
      )?.route;

      if (sectionRoute && sectionRoute !== location.pathname) {
        navigate(sectionRoute, { replace: true });
      }
    }
  }, [
    activeSection,
    isNavigating,
    isScrolling,
    navigate,
    location.pathname,
    sections,
  ]);

  useEffect(handleScrollNavigation, [handleScrollNavigation]);

  // Simulate loading screen - reduced time for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle gesture-based navigation with useCallback
  const handleDrag = useCallback(
    ({ direction: [xDir], distance, cancel }) => {
      if (Math.sqrt(distance[0] ** 2 + distance[1] ** 2) > 100) {
        cancel();
        const currentIndex = routes.indexOf(location.pathname);

        if (xDir > 0 && currentIndex > 0) {
          // Swipe right - go to previous section
          setDirection("backward");
          navigate(routes[currentIndex - 1]);
        } else if (xDir < 0 && currentIndex < routes.length - 1) {
          // Swipe left - go to next section
          setDirection("forward");
          navigate(routes[currentIndex + 1]);
        }
      }
    },
    [location.pathname, navigate, routes]
  );

  const bind = useDrag(handleDrag, {
    axis: "x",
    threshold: 50,
    filterTaps: true,
    rubberband: true,
  });

  // Handle user interaction with useCallback
  const handleInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [hasInteracted]);

  useEffect(() => {
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [handleInteraction]);

  // Memoize page transition variants
  const pageVariants = useMemo(
    () => ({
      initial: {
        opacity: 0,
        x: direction === "backward" ? -50 : 50,
      },
      animate: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      },
      exit: {
        opacity: 0,
        x: direction === "backward" ? 50 : -50,
        transition: {
          duration: 0.4,
          ease: "easeIn",
        },
      },
    }),
    [direction]
  );

  // Memoize section rendering
  const renderSection = useCallback(() => {
    switch (location.pathname) {
      case "/":
        return null;
      case "/about":
        return <AboutSection />;
      case "/skills":
        return <SkillsSection />;
      case "/projects":
        return <ProjectsSection />;
      case "/contact":
        return <ContactSection />;
      default:
        return null;
    }
  }, [location.pathname]);

  // Memoize scroll handler
  const handleScroll = useCallback(
    (instance) => {
      const isMoving = Math.abs(instance.velocity) > 0.5;
      setIsScrolling(isMoving);
      setScrolling(isMoving);
    },
    [setScrolling]
  );

  return (
    <>
      <Suspense fallback={null}>{isLoading && <LoadingScreen />}</Suspense>

      <div
        className="relative w-full min-h-screen overflow-hidden"
        ref={containerRef}
        {...bind()}
      >
        {/* Dynamic background - only render when not loading */}
        <Suspense fallback={null}>
          {!isLoading && <DynamicBackground />}
        </Suspense>

        {/* Custom cursor - only render when not loading */}
        <Suspense fallback={null}>{!isLoading && <CustomCursor />}</Suspense>

        {/* Navigation trail effect */}
        <Suspense fallback={null}>
          <NavigationTrail isActive={isNavigating} direction={direction} />
        </Suspense>

        {/* Main content with smooth scrolling */}
        <SmoothScroll onScroll={handleScroll}>
          <main className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={cn(
                  "min-h-screen",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}
              >
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center min-h-screen">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  }
                >
                  {renderSection()}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </main>
        </SmoothScroll>

        {/* Navigation menu */}
        <Suspense fallback={null}>
          <NavigationMenu currentPath={location.pathname} />
        </Suspense>

        {/* Scroll progress indicator */}
        <ScrollProgressBar />

        {/* Navigation indicator */}
        <Suspense fallback={null}>
          <NavigationIndicator
            currentPath={location.pathname}
            routes={routes}
            isNavigating={isNavigating}
          />
        </Suspense>

        {/* Voice navigation indicator - only render when supported */}
        {voiceSupported && (
          <Suspense fallback={null}>
            <VoiceNavigationIndicator
              isListening={isListening}
              toggleListening={toggleListening}
              transcript={transcript}
              voiceSupported={voiceSupported}
            />

            <AnimatePresence>
              {isListening && <VoiceCommandsHelp />}
            </AnimatePresence>
          </Suspense>
        )}

        {/* Toast notifications */}
        <Suspense fallback={null}>
          <Toaster position="bottom-right" />
        </Suspense>

        {/* Idle animation prompt - only show when needed */}
        <AnimatePresence>
          {!hasInteracted && !isLoading && (
            <motion.div
              className={cn(
                "fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 rounded-full px-6 py-3 shadow-lg",
                theme === "dark"
                  ? "bg-gray-900 text-gray-200"
                  : "bg-white text-gray-800"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 5, duration: 0.5 }}
            >
              <p className="text-sm font-medium">
                <span className="mr-2">✨</span>
                Scroll, swipe, or use arrow keys to navigate
                <span className="ml-2">✨</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Use memo to prevent unnecessary re-renders of the entire component
export default React.memo(Index);
