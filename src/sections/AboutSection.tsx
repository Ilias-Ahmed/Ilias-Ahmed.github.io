import { certifications, timelineData } from "@/components/about/aboutData";
import CertificationsGallery from "@/components/about/CertificationsGallery";
import ExperienceTimeline from "@/components/about/ExperienceTimeline";
import ProfileCard from "@/components/about/ProfileCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSpring, animated } from "@react-spring/web";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState("profile");
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect for background elements
  const [{ offset }, api] = useSpring(() => ({ offset: [0, 0] }));

  // Track scroll position for parallax effects - improved with useCallback
  const handleScroll = useCallback(() => {
    if (typeof window !== "undefined") {
      setScrollY(window.scrollY);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Improved mouse move handler with validation
  const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
          if (!e) return;

          const x = (e.clientX / window.innerWidth) * 2 - 1;
          const y = (e.clientY / window.innerHeight) * 2 - 1;
          api.start({ offset: [x * 15, y * 15] });
        },    [api]
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Handle Easter egg click with error handling
  const handleEasterEggClick = useCallback(() => {
    try {
      toast("Easter Egg Found!", {
        description: "You've discovered a hidden feature!",
        action: {
          label: "Explore",
          onClick: () =>
            window.open("https://github.com/Ilias-Ahmed", "_blank"),
        },
        icon: "🎉",
      });
    } catch (error) {
      console.error("Toast notification failed:", error);
    }
  }, []);

  return (
    <section
      className="py-16 md:py-32 relative overflow-hidden"
      id="about"
      onMouseMove={handleMouseMove}
      aria-label="About Section"
    >
      {/* Floating gradient orbs with mouse parallax effect */}
      <animated.div
        style={{
          position: "absolute",
          top: "25%",
          left: "25%",
          width: "16rem",
          height: "16rem",
          borderRadius: "9999px",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          filter: "blur(100px)",
          opacity: 0.6,
          transform: offset.to(
            (x, y) =>
              `translate(${scrollY * 0.05 + x}px, ${-scrollY * 0.02 + y}px)`
          ),
        }}
        aria-hidden="true"
      />
      <animated.div
        style={{
          position: "absolute",
          bottom: "33.333%",
          right: "25%",
          width: "20rem",
          height: "20rem",
          borderRadius: "9999px",
          background: "rgba(168, 85, 247, 0.1)",
          filter: "blur(120px)",
          opacity: 0.5,
          transform: offset.to(
            (x, y) =>
              `translate(${-scrollY * 0.03 - x * 0.8}px, ${
                scrollY * 0.04 - y * 0.8
              }px)`
          ),
        }}
        aria-hidden="true"
      />
      <animated.div
        style={{
          position: "absolute",
          top: "66.6667%",
          right: "33.3333%",
          width: "12rem",
          height: "12rem",
          borderRadius: "9999px",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          filter: "blur(80px)",
          opacity: 0.6,
          transform: offset.to(
            (x, y) =>
              `translate(${scrollY * 0.02 + x * 1.2}px, ${
                -scrollY * 0.05 + y * 1.2
              }px)`
          ),
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-blue-500">
            My Journey & Expertise
          </h2>

          <motion.p
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            The story behind my work, skills, and professional journey
          </motion.p>
        </motion.div>

        {/* Interactive Tabs - Improved with proper TabsContent */}
        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-20"
        >
          <TabsList className="flex gap-4 max-w-md mx-auto mb-16 p-1 bg-gray-800/40 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-xl">
            <TabsTrigger
              value="profile"
              className="flex-1 px-6 py-3 rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/80 data-[state=active]:to-purple-600/80 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 data-[state=active]:border-none data-[state=active]:text-white border border-gray-700/30 transition-all duration-300"
            >
              <motion.span
                className="flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg" aria-hidden="true">
                  👤
                </span>
                <span className="font-medium">Profile</span>
              </motion.span>
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="flex-1 px-6 py-3 rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/80 data-[state=active]:to-purple-600/80 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 data-[state=active]:border-none data-[state=active]:text-white border border-gray-700/30 transition-all duration-300"
            >
              <motion.span
                className="flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg" aria-hidden="true">
                  🚀
                </span>
                <span className="font-medium">Experience</span>
              </motion.span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ProfileCard />
              </motion.div>
            )}
            {activeTab === "experience" && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ExperienceTimeline timelineData={timelineData} />
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>

        {/* Certifications Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-24"
        >
          <motion.div variants={itemVariants}>
            <CertificationsGallery certifications={certifications} />
          </motion.div>
        </motion.div>

        {/* Interactive Easter Egg - Improved with accessibility */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="text-center cursor-pointer p-6 mt-20 opacity-60 hover:opacity-100 transition-opacity"
          onClick={handleEasterEggClick}
          role="button"
          tabIndex={0}
          aria-label="Discover Easter Egg"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleEasterEggClick();
            }
          }}
        >
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span className="animate-pulse" aria-hidden="true">
              ✨
            </span>
            <span>There's more than meets the eye...</span>
            <span className="animate-pulse" aria-hidden="true">
              ✨
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
export default AboutSection;
