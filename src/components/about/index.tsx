import { certifications, timelineData } from "./aboutData";
import CertificationsGallery from "./CertificationsGallery";
import ExperienceTimeline from "./ExperienceTimeline";
import ProfileCard from "./ProfileCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";
import { useSpring, animated } from "@react-spring/web";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState("profile");
  const [scrollY, setScrollY] = useState(0);

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

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
    },
    [api]
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
      className="py-16 md:py-32 relative overflow-hidden theme-transition"
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
          backgroundColor: `${accentColors.primary}10`,
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
          background: `${accentColors.secondary}10`,
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
          backgroundColor: `${accentColors.primary}10`,
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
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 50%, ${accentColors.tertiary} 100%)`,
              }}
            >
              My Journey & Expertise
            </span>
          </h2>

          <motion.p
            className="text-base sm:text-lg opacity-70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            The story behind my work, skills, and professional journey
          </motion.p>
        </motion.div>

        {/* Interactive Tabs - Enhanced with proper theming */}
        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-20"
        >
          <TabsList
            className="flex gap-4 max-w-md mx-auto mb-16 p-1 backdrop-blur-lg rounded-xl border shadow-xl theme-transition"
            style={{
              backgroundColor: isDark
                ? "rgba(17, 24, 39, 0.4)"
                : "rgba(255, 255, 255, 0.4)",
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            }}
          >
            <TabsTrigger
              value="profile"
              className="flex-1 px-6 py-3 rounded-lg transition-all duration-300 border theme-transition"
              style={{
                backgroundColor:
                  activeTab === "profile"
                    ? `linear-gradient(135deg, ${accentColors.primary}80, ${accentColors.secondary}80)`
                    : "transparent",
                borderColor:
                  activeTab === "profile"
                    ? accentColors.primary
                    : isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                color:
                  activeTab === "profile"
                    ? "white"
                    : isDark
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(0,0,0,0.8)",
                boxShadow:
                  activeTab === "profile"
                    ? `0 4px 14px ${accentColors.shadow}`
                    : "none",
              }}
              onClick={() => triggerHapticFeedback()}
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
              className="flex-1 px-6 py-3 rounded-lg transition-all duration-300 border theme-transition"
              style={{
                backgroundColor:
                  activeTab === "experience"
                    ? `linear-gradient(135deg, ${accentColors.primary}80, ${accentColors.secondary}80)`
                    : "transparent",
                borderColor:
                  activeTab === "experience"
                    ? accentColors.primary
                    : isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                color:
                  activeTab === "experience"
                    ? "white"
                    : isDark
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(0,0,0,0.8)",
                boxShadow:
                  activeTab === "experience"
                    ? `0 4px 14px ${accentColors.shadow}`
                    : "none",
              }}
              onClick={() => triggerHapticFeedback()}
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

        {/* Skills Showcase Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-24"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
                }}
              >
                Core Technologies
              </span>
            </h3>
            <p className="opacity-70 max-w-2xl mx-auto">
              The tools and technologies I use to bring ideas to life
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {[
              { name: "React", icon: "⚛️", level: 95 },
              { name: "TypeScript", icon: "📘", level: 90 },
              { name: "Node.js", icon: "🟢", level: 88 },
              { name: "Python", icon: "🐍", level: 85 },
              { name: "AWS", icon: "☁️", level: 82 },
              { name: "Docker", icon: "🐳", level: 80 },
              { name: "GraphQL", icon: "🔗", level: 78 },
              { name: "MongoDB", icon: "🍃", level: 85 },
              { name: "PostgreSQL", icon: "🐘", level: 83 },
              { name: "Redis", icon: "🔴", level: 75 },
              { name: "Kubernetes", icon: "⚙️", level: 70 },
              { name: "Next.js", icon: "▲", level: 92 },
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="group relative p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
                whileHover={{
                  backgroundColor: `${accentColors.primary}10`,
                  borderColor: `${accentColors.primary}30`,
                  boxShadow: `0 8px 25px ${accentColors.shadow}`,
                }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                    {skill.icon}
                  </div>
                  <h4 className="font-medium mb-2">{skill.name}</h4>

                  {/* Skill Level Bar */}
                  <div
                    className="w-full h-2 rounded-full mb-2"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${accentColors.primary}, ${accentColors.secondary})`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 1 }}
                    />
                  </div>
                  <span className="text-xs opacity-70">{skill.level}%</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Fun Facts Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-24"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
                }}
              >
                Fun Facts About Me
              </span>
            </h3>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: "☕",
                title: "Coffee Consumed",
                value: "2,847",
                subtitle: "Cups this year",
                color: "#8B4513",
              },
              {
                icon: "🌙",
                title: "Late Night Coding",
                value: "847",
                subtitle: "Hours past midnight",
                color: "#4A90E2",
              },
              {
                icon: "🐛",
                title: "Bugs Fixed",
                value: "1,234",
                subtitle: "And counting...",
                color: "#E74C3C",
              },
              {
                icon: "🎯",
                title: "Projects Completed",
                value: "156",
                subtitle: "With passion",
                color: "#2ECC71",
              },
            ].map((fact, index) => (
              <motion.div
                key={fact.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center p-6 rounded-xl backdrop-blur-sm border group hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
                whileHover={{
                  backgroundColor: `${accentColors.primary}10`,
                  borderColor: `${accentColors.primary}30`,
                }}
              >
                <div
                  className="text-4xl mb-4 group-hover:scale-110 transition-transform"
                  style={{ filter: `drop-shadow(0 0 10px ${fact.color}50)` }}
                >
                  {fact.icon}
                </div>
                <h4
                  className="text-2xl font-bold mb-2"
                  style={{ color: accentColors.primary }}
                >
                  {fact.value}
                </h4>
                <p className="font-medium mb-1">{fact.title}</p>
                <p className="text-sm opacity-70">{fact.subtitle}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Interactive Easter Egg - Enhanced with accessibility and theming */}
        <motion.div
          whileHover={{
            scale: 1.05,
            backgroundColor: `${accentColors.primary}10`,
            borderColor: `${accentColors.primary}30`,
          }}
          whileTap={{ scale: 0.98 }}
          className="text-center cursor-pointer p-6 mt-20 opacity-60 hover:opacity-100 transition-all duration-300 rounded-lg"
          onClick={() => {
            handleEasterEggClick();
            triggerHapticFeedback();
          }}
          role="button"
          tabIndex={0}
          aria-label="Discover Easter Egg"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleEasterEggClick();
            }
          }}
          style={{
            background: `linear-gradient(135deg, ${accentColors.primary}05, ${accentColors.secondary}05)`,
            border: `1px solid ${accentColors.primary}20`,
          }}
        >
          <p className="text-sm flex items-center justify-center gap-2">
            <motion.span
              className="animate-pulse"
              aria-hidden="true"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              ✨
            </motion.span>
            <span>There's more than meets the eye...</span>
            <motion.span
              className="animate-pulse"
              aria-hidden="true"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5,
              }}
            >
              ✨
            </motion.span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

