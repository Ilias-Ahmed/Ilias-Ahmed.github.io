import React, { useState, useRef, useEffect, Suspense, useMemo } from "react";
import Hero from "@/pages/Hero";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import { NavigationProvider } from "@/contexts/NavigationContext";
import Navigation from "@/components/navigation/Navigation";
import CustomCursor from "@/components/ui/CustomCursor";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate } from "react-router-dom";

const Toaster = React.lazy(() =>
  import("@/components/ui/sonner").then((mod) => ({ default: mod.Toaster }))
);
const LoadingScreen = React.lazy(() => import("@/components/ui/LoadingScreen"));

// Lazy-loaded sections
const AboutSection = React.lazy(() => import("@/components/about"));
const SkillsSection = React.lazy(() => import("@/components/skills"));
const ProjectsSection = React.lazy(() => import("@/components/projects"));
const ContactSection = React.lazy(() => import("@/components/contact"));

/**
 * Main Index component - Optimized for performance
 */
const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollingRef = useRef(false);

  // Define navigation sections
  const navSections = useMemo(
    () => [
      {
        id: "home",
        name: "Home",
        href: "#home",
        path: "/",
        keywords: ["start", "landing", "main"],
      },
      {
        id: "about",
        name: "About",
        href: "#about",
        path: "/about",
        keywords: ["me", "bio", "profile"],
      },
      {
        id: "skills",
        name: "Skills",
        href: "#skills",
        path: "/skills",
        keywords: ["abilities", "expertise", "tech stack"],
      },
      {
        id: "projects",
        name: "Projects",
        href: "#projects",
        path: "/projects",
        keywords: ["work", "portfolio", "showcase"],
      },
      {
        id: "contact",
        name: "Contact",
        href: "#contact",
        path: "/contact",
        keywords: ["message", "get in touch", "email"],
      },
    ],
    []
  );

  // Handle URL-based navigation on initial load and URL changes
  useEffect(() => {
    // Don't process if we're already scrolling programmatically
    if (scrollingRef.current) return;

    const path = location.pathname;
    let targetSection;

    if (path === "/") {
      targetSection = "home";
    } else {
      // Remove leading slash and find matching section
      const sectionId = path.substring(1);
      const matchingSection = navSections.find(
        (section) => section.id === sectionId
      );
      targetSection = matchingSection ? matchingSection.id : "home";
    }

    const element = document.getElementById(targetSection);
    if (element) {
      // Set flag to prevent scroll handler from firing during programmatic scroll
      scrollingRef.current = true;
      element.scrollIntoView({ behavior: "smooth" });

      // Reset flag after animation completes
      setTimeout(() => {
        scrollingRef.current = false;
      }, 1000);
    }
  }, [location.pathname, navSections]);

  // Track scroll progress and update URL
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (typeof window === "undefined" || scrollingRef.current) return;

      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = scrollTop / (documentHeight - windowHeight);

      setScrollProgress(Math.min(1, Math.max(0, progress)));

      // Debounce URL updates to avoid excessive history entries
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Find which section is most visible
        const viewportMid = scrollTop + windowHeight / 2;

        for (const section of navSections) {
          const element = document.getElementById(section.id);
          if (!element) continue;

          const rect = element.getBoundingClientRect();
          const sectionTop = scrollTop + rect.top;
          const sectionBottom = sectionTop + rect.height;

          // If viewport middle is within this section
          if (viewportMid >= sectionTop && viewportMid <= sectionBottom) {
            // Only update URL if it's different from current path
            const targetPath = section.id === "home" ? "/" : `/${section.id}`;
            if (location.pathname !== targetPath) {
              navigate(targetPath, { replace: true });
            }
            break;
          }
        }
      }, 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [navSections, navigate, location.pathname]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Add CustomCursor component */}
      {!isMobile && <CustomCursor />}

      <Suspense fallback={null}>{isLoading && <LoadingScreen />}</Suspense>

      <NavigationProvider customSections={navSections}>
        <div
          className="relative w-full min-h-screen overflow-hidden"
          ref={containerRef}
        >
          {/* Main content with standard scrolling */}
          <main className="relative z-10">
            <section
              id="home"
              data-section-name="Home"
              data-keywords="start,landing,main"
            >
              <Hero />
            </section>

            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              }
            >
              <section
                id="about"
                data-section-name="About"
                data-keywords="me,bio,profile"
              >
                <AboutSection />
              </section>

              <section
                id="skills"
                data-section-name="Skills"
                data-keywords="abilities,expertise,tech stack"
              >
                <SkillsSection />
              </section>

              <section
                id="projects"
                data-section-name="Projects"
                data-keywords="work,portfolio,showcase"
              >
                <ProjectsSection />
              </section>

              <section
                id="contact"
                data-section-name="Contact"
                data-keywords="message,get in touch,email"
              >
                <ContactSection />
              </section>
            </Suspense>
          </main>

          {/* Integrated Navigation System */}
          <Navigation
            enableDots={!isMobile}
            enableVoice={!isMobile}
            enableCommandPalette={true}
            enableBackToTop={true}
          />

          {/* Scroll progress indicator */}
          <ScrollProgressBar progress={scrollProgress} />

          {/* Toast notifications */}
          <Suspense fallback={null}>
            <Toaster position="bottom-right" />
          </Suspense>
        </div>
      </NavigationProvider>
    </>
  );
};

export default React.memo(Index);
