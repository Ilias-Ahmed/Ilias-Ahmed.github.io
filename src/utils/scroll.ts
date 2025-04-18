import Lenis from "@studio-freight/lenis";

/**
 * Scroll to a specific element with smooth animation
 * with mobile device handling
 */
export const scrollToElement = (
  lenis: Lenis | null,
  element: HTMLElement | null,
  options?: { offset?: number; duration?: number }
) => {
  if (!element) {
    console.warn("Element not found for scrolling");
    return;
  }

  // Check if we're on a mobile device
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // If lenis is not available or failed, use native scroll as fallback
  if (!lenis) {
    try {
      element.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Native scroll failed:", error);
      // Ultimate fallback - instant scroll
      window.scrollTo(0, element.offsetTop - (options?.offset || 0));
    }
    return;
  }

  // Ensure the element is interactive after scrolling
  setTimeout(() => {
    if (element) {
      element.style.pointerEvents = "auto";
    }
  }, (options?.duration || 1.2) * 1000 + 100);

  // Use shorter duration on mobile for better responsiveness
  const duration = isMobile
    ? options?.duration
      ? options.duration * 0.8
      : 0.8
    : options?.duration ?? 1.2;

  try {
    lenis.scrollTo(element, {
      offset: options?.offset ?? -100,
      duration: duration,
      immediate: false,
    });
  } catch (error) {
    console.error("Lenis scroll failed:", error);
    // Fallback to native scroll
    try {
      element.scrollIntoView({ behavior: "smooth" });
    } catch (secondError) {
      console.error("Native scroll failed as fallback:", secondError);
      // Ultimate fallback - instant scroll
      window.scrollTo(0, element.offsetTop - (options?.offset || 0));
    }
  }
};

/**
 * Scroll to a specific section by ID
 * with improved mobile handling
 */
export const scrollToSection = (
  lenis: Lenis | null,
  sectionId: string,
  options?: { offset?: number; duration?: number }
) => {
  if (!sectionId) {
    console.warn("No section ID provided for scrolling");
    return;
  }

  const section = document.getElementById(sectionId);
  if (!section) {
    console.warn(`Section with ID "${sectionId}" not found`);
    return;
  }

  // Check if we're on a mobile device
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // If we're on mobile, ensure touch events work after scrolling
  if (isMobile) {
    section.style.pointerEvents = "auto";

    // Set all other sections to have pointer events as well
    document.querySelectorAll("section, [id]").forEach((el) => {
      (el as HTMLElement).style.pointerEvents = "auto";
    });
  }

  scrollToElement(lenis, section, options);
};

/**
 * Create a navigation index for the page
 * by finding all sections with IDs
 */
export const createNavigationIndex = () => {
  const sections = Array.from(document.querySelectorAll("[id]"))
    .filter((el) => {
      // Only include elements that are actual sections or have specific classes
      return (
        el.tagName.toLowerCase() === "section" ||
        el.classList.contains("section") ||
        el.getAttribute("data-section") === "true"
      );
    })
    .map((el) => ({
      id: el.id,
      name:
        el.getAttribute("data-section-name") ||
        el.id.charAt(0).toUpperCase() + el.id.slice(1),
      href: `#${el.id}`,
      keywords: el.getAttribute("data-keywords")?.split(",") || [],
    }));

  return sections;
};
