import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLenis } from '@/components/SmoothScroll';
import { toast } from 'sonner';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useDrag } from '@use-gesture/react';

interface NavigationOptions {
  routes?: string[];
  enableKeyboard?: boolean;
  enableVoice?: boolean;
  enableGestures?: boolean;
  showFeedback?: boolean;
}

export const useNavigation = ({
  routes = ["/", "/about", "/skills", "/projects", "/contact"],
  enableKeyboard = true,
  enableVoice = true,
  enableGestures = true,
  showFeedback = true,
}: NavigationOptions = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lenis } = useLenis();
  const [isNavigating, setIsNavigating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [previousPath, setPreviousPath] = useState("/");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);

  // Map route paths to readable names
  const routeNames = useMemo(
    () => ({
      "/": "Home",
      "/about": "About",
      "/skills": "Skills",
      "/projects": "Projects",
      "/contact": "Contact",
    }),
    []
  );

  // Navigate to a specific route with direction tracking
  const navigateTo = useCallback(
    (path: string) => {
      if (path === location.pathname) return;

      const currentIndex = routes.indexOf(location.pathname);
      const targetIndex = routes.indexOf(path);

      if (currentIndex !== -1 && targetIndex !== -1) {
        setDirection(currentIndex < targetIndex ? "forward" : "backward");
      }

      setIsNavigating(true);
      navigate(path);

      if (showFeedback) {
        toast.success(
          `Navigating to ${routeNames[path as keyof typeof routeNames] || path}`
        );
      }

      // Reset navigation state after animation completes
      setTimeout(() => {
        setIsNavigating(false);
      }, 800);
    },
    [location.pathname, navigate, routes, routeNames, showFeedback]
  );

  // Scroll to a specific section
  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (!lenis) return;

      const element = document.getElementById(sectionId);
      if (element) {
        lenis.scrollTo(element, {
          offset: 0,
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    },
    [lenis]
  );

  // Navigate to next/previous section
  const navigateNext = useCallback(() => {
    const currentIndex = routes.indexOf(location.pathname);
    if (currentIndex < routes.length - 1) {
      navigateTo(routes[currentIndex + 1]);
    }
  }, [location.pathname, navigateTo, routes]);

  const navigatePrevious = useCallback(() => {
    const currentIndex = routes.indexOf(location.pathname);
    if (currentIndex > 0) {
      navigateTo(routes[currentIndex - 1]);
    }
  }, [location.pathname, navigateTo, routes]);

  // Track previous path for direction detection
  useEffect(() => {
    if (location.pathname !== previousPath) {
      setPreviousPath(location.pathname);
    }
  }, [location.pathname, previousPath]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          navigatePrevious();
          break;
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          navigateNext();
          break;
        case "Home":
          e.preventDefault();
          navigateTo(routes[0]);
          break;
        case "End":
          e.preventDefault();
          navigateTo(routes[routes.length - 1]);
          break;
        // Number keys 1-9 for direct section navigation
        default:
          if (/^[1-9]$/.test(e.key)) {
            const index = parseInt(e.key) - 1;
            if (index < routes.length) {
              e.preventDefault();
              navigateTo(routes[index]);
            }
          }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboard, navigateNext, navigatePrevious, navigateTo, routes]);

  // Voice navigation
  const voiceCommands = useMemo(() => {
    const commands = [];

    // Navigation commands
    for (const [path, name] of Object.entries(routeNames)) {
      commands.push({
        command: [
          `go to ${name.toLowerCase()}`,
          `show ${name.toLowerCase()}`,
          `open ${name.toLowerCase()}`,
          `navigate to ${name.toLowerCase()}`,
        ],
        callback: () => navigateTo(path),
        matchInterim: false,
      });
    }

    // Utility commands
    commands.push(
      {
        command: ["start listening", "enable voice", "listen to me"],
        callback: () => {
          setIsListening(true);
          if (showFeedback) {
            toast.success("Voice navigation activated");
          }
        },
        matchInterim: false,
      },
      {
        command: ["stop listening", "disable voice", "stop voice"],
        callback: () => {
          setIsListening(false);
          if (showFeedback) {
            toast.success("Voice navigation deactivated");
          }
        },
        matchInterim: false,
      },
      {
        command: ["what can I say", "help", "show commands", "voice commands"],
        callback: () => {
          if (showFeedback) {
            toast.info(
              <div className="space-y-2">
                <p className="font-bold">Available voice commands:</p>
                <ul className="list-disc pl-4">
                  <li>Go to [page name]</li>
                  <li>Show [page name]</li>
                  <li>Start/Stop listening</li>
                </ul>
              </div>,
              { duration: 5000 }
            );
          }
        },
        matchInterim: false,
      },
      {
        command: ["next page", "next section", "go forward"],
        callback: () => navigateNext(),
        matchInterim: false,
      },
      {
        command: ["previous page", "previous section", "go back"],
        callback: () => navigatePrevious(),
        matchInterim: false,
      }
    );

    return commands;
  }, [navigateTo, navigateNext, navigatePrevious, routeNames, showFeedback]);

  // Set up speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands: enableVoice ? voiceCommands : [] });

  // Check if browser supports speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setVoiceSupported(false);
      if (showFeedback && enableVoice) {
        toast.error("Your browser does not support voice recognition");
      }
    }
  }, [browserSupportsSpeechRecognition, showFeedback, enableVoice]);

  // Start/stop listening based on isListening state
  useEffect(() => {
    if (!voiceSupported || !enableVoice) return;

    if (isListening && !listening) {
      SpeechRecognition.startListening({ continuous: true });
    } else if (!isListening && listening) {
      SpeechRecognition.stopListening();
    }

    // Clean up on unmount
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [isListening, listening, voiceSupported, enableVoice]);

  // Toggle listening state
  const toggleVoiceListening = useCallback(() => {
    setIsListening((prev) => !prev);
  }, []);

  // Implement gesture-based navigation
  const handleDrag = useCallback(
    ({ direction: [xDir], distance, cancel }: { direction: [number, number]; distance: [number, number]; cancel: () => void }) => {
      if (!enableGestures) return;

      if (Math.sqrt(distance[0] ** 2 + distance[1] ** 2) > 100) {
        cancel();
        const currentIndex = routes.indexOf(location.pathname);

        if (xDir > 0 && currentIndex > 0) {
          // Swipe right - go to previous section
          setDirection("backward");
          navigatePrevious();
        } else if (xDir < 0 && currentIndex < routes.length - 1) {
          // Swipe left - go to next section
          setDirection("forward");
          navigateNext();
        }
      }
    },
    [enableGestures, location.pathname, routes, navigateNext, navigatePrevious]
  );

  // Set up gesture binding
  const bind = useDrag(handleDrag, {
    axis: "x",
    threshold: 50,
    filterTaps: true,
    rubberband: true,
    enabled: enableGestures,
  });

  return {
    // Current state
    currentPath: location.pathname,
    isNavigating,
    direction,

    // Navigation methods
    navigateTo,
    navigateNext,
    navigatePrevious,
    scrollToSection,

    // Voice navigation
    isListening,
    toggleVoiceListening,
    transcript,
    resetTranscript,
    voiceSupported,

    // Gesture navigation
    gestureBindings: enableGestures ? bind() : {},

    // Routes info
    routes,
    routeNames,
  };
};
