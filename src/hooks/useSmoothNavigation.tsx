import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLenis } from "@/components/SmoothScroll";

interface Section {
  id: string;
  route: string;
}

interface SmoothNavigationOptions {
  sections: Section[];
  scrollDuration?: number;
  scrollEasing?: (t: number) => number;
  updateUrlOnScroll?: boolean;
  offset?: number;
}

export const useSmoothNavigation = ({
  sections,
  scrollDuration = 1.2,
  scrollEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  updateUrlOnScroll = true,
  offset = 0,
}: SmoothNavigationOptions) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lenis } = useLenis();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isManualNavigation, setIsManualNavigation] = useState(false);

  // Navigate to a section by ID
  const scrollToSection = useCallback(
    (sectionId: string, options = {}) => {
      if (!lenis) return;

      const element = document.getElementById(sectionId);
      if (!element) return;

      // Mark as manual navigation to prevent URL updates during scroll
      setIsManualNavigation(true);

      // Scroll to the element
      lenis.scrollTo(element, {
        offset,
        duration: scrollDuration,
        easing: scrollEasing,
        ...options,
        onComplete: () => {
          // Reset manual navigation flag after a delay
          setTimeout(() => {
            setIsManualNavigation(false);
          }, 100);

          // Call original onComplete if provided
          if (options && typeof (options as any).onComplete === "function") {
            (options as any).onComplete();
          }
        },
      });
    },
    [lenis, offset, scrollDuration, scrollEasing]
  );

  // Navigate to a route and scroll to the corresponding section
  const navigateToRoute = useCallback(
    (route: string) => {
      // Find section ID from route
      const section = sections.find((s) => s.route === route);
      if (!section) return;

      // Update URL first
      if (route !== location.pathname) {
        navigate(route, { replace: true });
      }

      // Then scroll to section
      scrollToSection(section.id);
    },
    [sections, location.pathname, navigate, scrollToSection]
  );

  // Update URL based on active section
  useEffect(() => {
    if (!updateUrlOnScroll || isManualNavigation || !activeSection) return;

    const section = sections.find((s) => s.id === activeSection);
    if (section && section.route !== location.pathname) {
      navigate(section.route, { replace: true });
    }
  }, [
    activeSection,
    sections,
    location.pathname,
    navigate,
    updateUrlOnScroll,
    isManualNavigation,
  ]);

  // Initialize navigation to current route's section on mount
  useEffect(() => {
    // Find section for current route
    const currentSection = sections.find((s) => s.route === location.pathname);
    if (currentSection) {
      // Set a small timeout to ensure DOM is ready
      setTimeout(() => {
        scrollToSection(currentSection.id, { immediate: true });
      }, 100);
    }
  }, []);

  return {
    activeSection,
    setActiveSection,
    isScrolling,
    setIsScrolling,
    scrollToSection,
    navigateToRoute,
    isManualNavigation,
  };
};
