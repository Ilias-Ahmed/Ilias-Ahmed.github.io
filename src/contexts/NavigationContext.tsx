import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import {
  scrollToSection,
  getCurrentSection,
  initSmoothScrolling,
  ScrollOptions,
} from "@/utils/scroll";
import Lenis from "lenis";

export interface NavSection {
  id: string;
  name: string;
  href: string;
  keywords?: string[];
  description?: string;
}

interface NavigationContextType {
  // Core navigation state
  activeSection: string;
  sections: NavSection[];
  lenis: Lenis | null;

  // Navigation functions
  navigateToSection: (
    sectionId: string,
    options?: ScrollOptions
  ) => Promise<void>;
  setActiveSection: (sectionId: string) => void;

  // Menu state
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;

  // Utility functions
  getSectionByKeyword: (keyword: string) => NavSection | null;
  getNextSection: () => string | null;
  getPreviousSection: () => string | null;

  // Scroll state
  isScrolling: boolean;
  scrollProgress: number;
}

const defaultSections: NavSection[] = [
  {
    id: "home",
    name: "Home",
    href: "#home",
    keywords: ["start", "landing", "main", "top"],
    description: "Welcome section",
  },
  {
    id: "about",
    name: "About",
    href: "#about",
    keywords: ["me", "bio", "profile", "story"],
    description: "About me section",
  },
  {
    id: "skills",
    name: "Skills",
    href: "#skills",
    keywords: ["abilities", "expertise", "tech", "stack", "technologies"],
    description: "Technical skills and expertise",
  },
  {
    id: "projects",
    name: "Projects",
    href: "#projects",
    keywords: ["work", "portfolio", "showcase", "demos"],
    description: "Project portfolio",
  },
  {
    id: "contact",
    name: "Contact",
    href: "#contact",
    keywords: ["message", "touch", "email", "reach"],
    description: "Get in touch section",
  },
];

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}

interface NavigationProviderProps {
  children: ReactNode;
  customSections?: NavSection[];
}

export function NavigationProvider({
  children,
  customSections,
}: NavigationProviderProps): React.ReactElement {
  const sections = useMemo(
    () => customSections || defaultSections,
    [customSections]
  );

  // Core state
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || "home"
  );
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Initialize smooth scrolling
  useEffect(() => {
    const lenisInstance = initSmoothScrolling();
    setLenis(lenisInstance);

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
        // Fixed: Remove any type
        if (typeof window !== "undefined") {
          delete ((window as unknown) as Record<string, unknown>).__lenis;
        }
      }
    };
  }, []);

  // Track scroll progress and active section
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout>;

    const handleScroll = (): void => {
      // Calculate scroll progress
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));

      // Track scrolling state
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setIsScrolling(false), 150);

      // Update active section
      const sectionIds = sections.map((s) => s.id);
      const currentSection = getCurrentSection(sectionIds);
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [sections, activeSection]);

  // Handle menu body scroll lock
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isMenuOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isMenuOpen]);

  // Navigation functions
  const navigateToSection = useCallback(
    async (sectionId: string, options?: ScrollOptions): Promise<void> => {
      if (!sections.find((s) => s.id === sectionId)) {
        console.warn(`Section "${sectionId}" not found`);
        return;
      }

      try {
        await scrollToSection(sectionId, options);
        setActiveSection(sectionId);

        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
      } catch (error) {
        console.error(`Failed to navigate to section "${sectionId}":`, error);
      }
    },
    [sections, isMenuOpen]
  );

  const setActiveSectionCallback = useCallback(
    (sectionId: string): void => {
      if (sections.find((s) => s.id === sectionId)) {
        setActiveSection(sectionId);
      }
    },
    [sections]
  );

  // Menu functions
  const toggleMenu = useCallback((): void => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback((): void => {
    setIsMenuOpen(false);
  }, []);

  const openMenu = useCallback((): void => {
    setIsMenuOpen(true);
  }, []);

  // Utility functions
  const getSectionByKeyword = useCallback(
    (keyword: string): NavSection | null => {
      const normalizedKeyword = keyword.toLowerCase().trim();

      return (
        sections.find(
          (section) =>
            section.keywords?.some(
              (k) =>
                k.toLowerCase().includes(normalizedKeyword) ||
                normalizedKeyword.includes(k.toLowerCase())
            ) ||
            section.name.toLowerCase().includes(normalizedKeyword) ||
            section.id.toLowerCase().includes(normalizedKeyword)
        ) || null
      );
    },
    [sections]
  );

  const getNextSection = useCallback((): string | null => {
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex === -1 || currentIndex === sections.length - 1)
      return null;
    return sections[currentIndex + 1].id;
  }, [sections, activeSection]);

  const getPreviousSection = useCallback((): string | null => {
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex <= 0) return null;
    return sections[currentIndex - 1].id;
  }, [sections, activeSection]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Escape to close menu
      if (e.key === "Escape" && isMenuOpen) {
        e.preventDefault();
        closeMenu();
        return;
      }

      // Don't handle other shortcuts when typing
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // Navigation shortcuts (Alt + number)
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= sections.length) {
          e.preventDefault();
          navigateToSection(sections[num - 1].id);
        }
      }

      // Arrow navigation
      if (e.key === "ArrowDown" && e.altKey) {
        e.preventDefault();
        const next = getNextSection();
        if (next) navigateToSection(next);
      }

      if (e.key === "ArrowUp" && e.altKey) {
        e.preventDefault();
        const prev = getPreviousSection();
        if (prev) navigateToSection(prev);
      }

      // Home/End navigation
      if (e.key === "Home" && e.altKey) {
        e.preventDefault();
        navigateToSection(sections[0].id);
      }

      if (e.key === "End" && e.altKey) {
        e.preventDefault();
        navigateToSection(sections[sections.length - 1].id);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isMenuOpen,
    closeMenu,
    navigateToSection,
    getNextSection,
    getPreviousSection,
    sections,
  ]);

  // Memoized context value
  const contextValue = useMemo(
    (): NavigationContextType => ({
      activeSection,
      sections,
      lenis,
      navigateToSection,
      setActiveSection: setActiveSectionCallback,
      isMenuOpen,
      toggleMenu,
      closeMenu,
      openMenu,
      getSectionByKeyword,
      getNextSection,
      getPreviousSection,
      isScrolling,
      scrollProgress,
    }),
    [
      activeSection,
      sections,
      lenis,
      navigateToSection,
      setActiveSectionCallback,
      isMenuOpen,
      toggleMenu,
      closeMenu,
      openMenu,
      getSectionByKeyword,
      getNextSection,
      getPreviousSection,
      isScrolling,
      scrollProgress,
    ]
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

export default NavigationContext;
