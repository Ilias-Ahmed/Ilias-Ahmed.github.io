import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Lenis from "@studio-freight/lenis";
import { scrollToElement } from "@/utils/scroll";

export type NavSection = {
  name: string;
  href: string;
  id: string;
  keywords?: string[];
};

interface NavigationContextType {
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  sections: NavSection[];
  lenis: Lenis | null;
  navigateToSection: (
    sectionId: string,
    options?: { offset?: number; duration?: number }
  ) => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const defaultSections: NavSection[] = [
  {
    name: "Home",
    href: "#home",
    id: "home",
    keywords: ["start", "landing", "main"],
  },
  {
    name: "Projects",
    href: "#projects",
    id: "projects",
    keywords: ["work", "portfolio", "showcase"],
  },
  {
    name: "Skills",
    href: "#skills",
    id: "skills",
    keywords: ["abilities", "expertise", "tech stack"],
  },
  {
    name: "About",
    href: "#about",
    id: "about",
    keywords: ["me", "bio", "profile"],
  },
  {
    name: "Contact",
    href: "#contact",
    id: "contact",
    keywords: ["message", "get in touch", "email"],
  },
];

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
  customSections?: NavSection[];
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  customSections,
}) => {
  const [activeSection, setActiveSection] = useState("home");
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sections = customSections || defaultSections;

  // Detect if device is mobile
  const isMobile =
    typeof window !== "undefined"
      ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      : false;

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const lenisInstance = new Lenis({
        duration: isMobile ? 1.0 : 1.2, // Slightly increased for smoother feel
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: isMobile ? 1.0 : 0.8, // Adjusted for mobile
        touchMultiplier: 1.5, // Increased for better touch response
        infinite: false,
        smoothTouch: true, // Enable smooth touch scrolling
      });

      setLenis(lenisInstance);

      const raf = (time: number) => {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);

      return () => {
        lenisInstance.destroy();
      };
    } catch (error) {
      console.error("Failed to initialize Lenis:", error);
      return () => {};
    }
  }, [isMobile]);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;

      const scrollPosition = window.scrollY;

      const sectionElements = sections.map((section) => ({
        id: section.id,
        offset: document.getElementById(section.id)?.offsetTop || 0,
        height: document.getElementById(section.id)?.offsetHeight || 0,
      }));

      // Sort sections by their position on the page
      sectionElements.sort((a, b) => a.offset - b.offset);

      // Find the current section
      const currentSection = sectionElements.find(
        (section) =>
          scrollPosition >= section.offset - 100 &&
          scrollPosition < section.offset + section.height - 100
      );

      if (currentSection) {
        setActiveSection(currentSection.id);
      } else if (scrollPosition < sectionElements[0]?.offset) {
        // If we're above the first section, set it as active
        setActiveSection(sectionElements[0]?.id || "home");
      } else if (
        scrollPosition + window.innerHeight >=
        document.body.scrollHeight - 50
      ) {
        // If we're at the bottom of the page, set the last section as active
        setActiveSection(
          sectionElements[sectionElements.length - 1]?.id || "contact"
        );
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  // Handle menu open/close effects
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("menu-open");
    } else {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("menu-open");
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("menu-open");
    };
  }, [isMenuOpen]);

  // Navigation function
  const navigateToSection = useCallback(
    (sectionId: string, options?: { offset?: number; duration?: number }) => {
      if (!sectionId || typeof document === "undefined") return;

      const element = document.getElementById(sectionId);
      if (!element) {
        console.warn(`Element with id "${sectionId}" not found`);
        return;
      }

      scrollToElement(lenis, element, options);

      // Close menu if it's open
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    },
    [lenis, isMenuOpen]
  );

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const value = {
    activeSection,
    setActiveSection,
    sections,
    lenis,
    navigateToSection,
    isMenuOpen,
    toggleMenu,
    closeMenu,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;
