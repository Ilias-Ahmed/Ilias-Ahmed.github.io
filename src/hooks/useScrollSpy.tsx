import { useState, useEffect, useCallback } from "react";
import { useLenis } from "@/components/SmoothScroll";

interface Section {
  id: string;
  route: string;
}

export const useScrollSpy = (sections: Section[], offset = 0) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolling, setScrolling] = useState(false);
  const { lenis } = useLenis();

  // Function to check which section is in view
  const checkSections = useCallback(() => {
    if (!lenis || isScrolling) return;

    const scrollPosition = lenis.scroll;

    // Get all section elements
    const sectionElements = sections
      .map((section) => ({
        id: section.id,
        element: document.getElementById(section.id),
      }))
      .filter((section) => section.element !== null);

    // Find the section that is currently in view
    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const { id, element } = sectionElements[i];
      if (!element) continue;

      const rect = element.getBoundingClientRect();

      // Check if the section is in view
      if (rect.top <= offset + 100) {
        setActiveSection(id);
        return;
      }
    }

    // If no section is in view, set the first section as active
    if (sectionElements.length > 0) {
      setActiveSection(sectionElements[0].id);
    }
  }, [lenis, sections, offset, isScrolling]);

  // Set up scroll event listener
  useEffect(() => {
    if (!lenis) return;

    // Initial check
    checkSections();

    // Add scroll event listener
    lenis.on("scroll", checkSections);

    return () => {
      lenis.off("scroll", checkSections);
    };
  }, [lenis, checkSections]);

  return { activeSection, setScrolling };
};
