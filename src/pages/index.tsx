import React, { useState, useRef, useEffect, Suspense, useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Hero from "@/sections/Hero";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import { NavigationProvider } from "@/contexts/NavigationContext";
import Navigation from "@/components/navigation/Navigation";
import CustomCursor from "@/components/ui/CustomCursor";
import { useIsMobile } from "@/hooks/use-mobile";

const Toaster = React.lazy(() =>
  import("@/components/ui/sonner").then((mod) => ({ default: mod.Toaster }))
);
const LoadingScreen = React.lazy(() => import("@/components/ui/LoadingScreen"));

// Lazy-loaded sections
const AboutSection = React.lazy(() => import("@/sections/AboutSection"));
const SkillsSection = React.lazy(() => import("@/sections/SkillsSection"));
const ProjectsSection = React.lazy(() => import("@/sections/ProjectsSection"));
const ContactSection = React.lazy(() => import("@/sections/ContactSection"));

/**
 * Main Index component - Optimized for performance
 */
const Index = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Define navigation sections
  const navSections = useMemo(
    () => [
      {
        id: "home",
        name: "Home",
        href: "#home",
        keywords: ["start", "landing", "main"],
      },
      {
        id: "about",
        name: "About",
        href: "#about",
        keywords: ["me", "bio", "profile"],
      },
      {
        id: "skills",
        name: "Skills",
        href: "#skills",
        keywords: ["abilities", "expertise", "tech stack"],
      },
      {
        id: "projects",
        name: "Projects",
        href: "#projects",
        keywords: ["work", "portfolio", "showcase"],
      },
      {
        id: "contact",
        name: "Contact",
        href: "#contact",
        keywords: ["message", "get in touch", "email"],
      },
    ],
    []
  );

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;

      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = scrollTop / (documentHeight - windowHeight);

      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            enableGestures={true}
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
