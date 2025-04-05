import { certifications, timelineData } from "@/components/about/aboutData";
import CertificationsGallery from "@/components/about/CertificationsGallery";
import ExperienceTimeline from "@/components/about/ExperienceTimeline";
import ProfileCard from "@/components/about/ProfileCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSpring } from "@react-spring/web";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState("profile");
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect for background elements
  const [{ offset }, api] = useSpring(() => ({ offset: 0 }));

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    api.start({ offset: [x * 15, y * 15] });
  };

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

  return (
    <div
      className="py-16 md:py-32 relative overflow-hidden"
      id="about"
      onMouseMove={handleMouseMove}
    >
      {/* Floating gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-[100px] opacity-60"
        style={{
          transform: `translate(${scrollY * 0.05}px, ${-scrollY * 0.02}px)`,
          transition: "transform 0.1s ease-out",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-[120px] opacity-50"
        style={{
          transform: `translate(${-scrollY * 0.03}px, ${scrollY * 0.04}px)`,
          transition: "transform 0.1s ease-out",
        }}
      />
      <div
        className="absolute top-2/3 right-1/3 w-48 h-48 rounded-full bg-blue-500/10 blur-[80px] opacity-60"
        style={{
          transform: `translate(${scrollY * 0.02}px, ${-scrollY * 0.05}px)`,
          transition: "transform 0.1s ease-out",
        }}
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

        {/* Interactive Tabs */}
        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-20"
        >
          <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-16">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-primary/20 data-[state=active]:border-primary/30 border border-transparent transition-all duration-300"
            >
              <motion.span
                className="flex flex-col items-center gap-2 py-1"
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
              >
                <span className="text-xl mb-1">👤</span>
                <span>Profile</span>
              </motion.span>
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="data-[state=active]:bg-primary/20 data-[state=active]:border-primary/30 border border-transparent transition-all duration-300"
            >
              <motion.span
                className="flex flex-col items-center gap-2 py-1"
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
              >
                <span className="text-xl mb-1">🚀</span>
                <span>Experience</span>
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

        {/* Interactive Easter Egg */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="text-center cursor-pointer p-6 mt-20 opacity-60 hover:opacity-100 transition-opacity"
          onClick={() => {
            toast("Easter Egg Found!", {
              description: "You've discovered a hidden feature!",
              action: {
                label: "Explore",
                onClick: () =>
                  window.open("https://github.com/Ilias-Ahmed", "_blank"),
              },
              icon: "🎉",
            });
          }}
        >
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span className="animate-pulse">✨</span>
            <span>There's more than meets the eye...</span>
            <span className="animate-pulse">✨</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutSection;
