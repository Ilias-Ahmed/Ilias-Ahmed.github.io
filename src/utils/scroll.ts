import Lenis from "lenis";

/**
 * Enhanced scroll utility with improved error handling and mobile optimization
 */

export interface ScrollOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
  easing?: (t: number) => number;
}

/**
 * Detects if the user is on a mobile device
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
};

/**
 * Scroll to a specific element with enhanced error handling
 */
export const scrollToElement = async (
  element: HTMLElement | null,
  options: ScrollOptions = {}
): Promise<void> => {
  if (!element) {
    console.warn("Element not found for scrolling");
    return Promise.resolve();
  }

  const {
    offset = -100,
    duration = isMobileDevice() ? 0.8 : 1.2,
    immediate = false,
    easing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  } = options;

  // Get Lenis instance from window if available
  interface LenisWindow extends Window {
    __lenis?: Lenis;
  }
  const lenis = (window as LenisWindow).__lenis;

  if (lenis && !immediate) {
    try {
      return new Promise<void>((resolve) => {
        lenis.scrollTo(element, {
          offset,
          duration,
          easing,
          onComplete: () => resolve(),
        });
      });
    } catch (error) {
      console.error("Lenis scroll failed:", error);
      // Fallback to native scroll
    }
  }

  // Native scroll fallback
  try {
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    const targetPosition = elementTop + offset;

    if (immediate || !("scrollBehavior" in document.documentElement.style)) {
      window.scrollTo(0, targetPosition);
      return Promise.resolve();
    }

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });

    return Promise.resolve();
  } catch (error) {
    console.error("Native scroll failed:", error);
    return Promise.resolve();
  }
};

/**
 * Scroll to a section by ID with improved error handling
 */
export const scrollToSection = async (
  sectionId: string,
  options: ScrollOptions = {}
): Promise<void> => {
  if (!sectionId) {
    console.warn("No section ID provided for scrolling");
    return Promise.resolve();
  }

  const section = document.getElementById(sectionId);
  if (!section) {
    console.warn(`Section with ID "${sectionId}" not found`);
    return Promise.resolve();
  }

  return scrollToElement(section, options);
};

/**
 * Get the currently visible section based on scroll position
 */
export const getCurrentSection = (
  sections: string[],
  offset: number = 100
): string | null => {
  if (typeof window === "undefined" || !sections.length) return null;

  const scrollPosition = window.scrollY + offset;
  const viewportHeight = window.innerHeight;

  // Find section that is most visible in viewport
  let maxVisibleArea = 0;
  let currentSection: string | null = null;

  sections.forEach((sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + window.scrollY;
    const elementBottom = elementTop + rect.height;

    // Calculate visible area, considering offset
    const visibleTop = Math.max(elementTop, scrollPosition);
    const visibleBottom = Math.min(elementBottom, scrollPosition + viewportHeight);
    const visibleArea = Math.max(0, visibleBottom - visibleTop);

    if (visibleArea > maxVisibleArea) {
      maxVisibleArea = visibleArea;
      currentSection = sectionId;
    }
  });

  return currentSection;
};

/**
 * Initialize smooth scrolling with Lenis
 */
export const initSmoothScrolling = (): Lenis | null => {
  if (typeof window === "undefined") return null;

  try {
    const lenis = new Lenis({
      duration: isMobileDevice() ? 1.0 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: isMobileDevice() ? 1.0 : 0.8,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Store globally for access
    interface LenisWindow extends Window {
      __lenis?: Lenis;
    }
    (window as LenisWindow).__lenis = lenis;

    const raf = (time: number): void => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return lenis;
  } catch (error) {
    console.error("Failed to initialize Lenis:", error);
    return null;
  }
};
