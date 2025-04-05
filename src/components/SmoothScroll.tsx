import React, {
  useEffect,
  createContext,
  useContext,
  useRef,
  useMemo,
} from "react";
import Lenis from "@studio-freight/lenis";

// Define types for context
type LenisContextType = {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number, options?: any) => void;
};

// Create context with default values
const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
});

// Custom hook to access Lenis instance
export const useLenis = () => useContext(LenisContext);

interface SmoothScrollProps {
  children: React.ReactNode;
  options?: {
    duration?: number;
    easing?: (t: number) => number;
    smoothWheel?: boolean;
    smoothTouch?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    infinite?: boolean;
    orientation?: "vertical" | "horizontal";
  };
  onScroll?: (lenis: Lenis) => void;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({
  children,
  options = {},
  onScroll,
}) => {
  // Use refs instead of state to avoid re-renders
  const lenisRef = useRef<Lenis | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Default scroll options - memoized to avoid recreating on each render
  const defaultScrollOptions = useMemo(
    () => ({
      offset: 0,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    }),
    []
  );

  // Scroll to function - memoized with useCallback
  const scrollTo = React.useCallback(
    (target: string | HTMLElement | number, scrollOptions = {}) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, {
          ...defaultScrollOptions,
          ...scrollOptions,
        });
      }
    },
    [defaultScrollOptions]
  );

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    // Default Lenis options
    const defaultOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical" as const,
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    };

    // Create Lenis instance with merged options
    const lenisInstance = new Lenis({
      ...defaultOptions,
      ...options,
    });

    // Store in ref
    lenisRef.current = lenisInstance;

    // Set up RAF loop
    const raf = (time: number) => {
      lenisInstance.raf(time);
      reqIdRef.current = requestAnimationFrame(raf);
    };

    reqIdRef.current = requestAnimationFrame(raf);

    // Add scroll event listener if provided
    if (onScroll) {
      lenisInstance.on("scroll", onScroll);
    }

    // Cleanup function
    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
        reqIdRef.current = null;
      }

      if (onScroll) {
        lenisInstance.off("scroll", onScroll);
      }

      lenisInstance.destroy();
      lenisRef.current = null;
    };
  }, [
    // Only re-initialize if these options change
    options.duration,
    options.orientation,
    options.smoothWheel,
    options.smoothTouch,
    options.wheelMultiplier,
    options.touchMultiplier,
    options.infinite,
    onScroll,
  ]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      lenis: lenisRef.current,
      scrollTo,
    }),
    [scrollTo]
  );

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
};

export default React.memo(SmoothScroll);
