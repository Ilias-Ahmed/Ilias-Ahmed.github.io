import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Download, Github, Linkedin, Twitter } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import profileImage from "/images/profile.png?url";
import ResumeViewer from "../ui/ResumeViewer";
import { triggerHapticFeedback } from "@/utils/haptics";

const ProfileCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showResume, setShowResume] = useState(false);

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const skills = ["React", "Node.js", "TypeScript", "GraphQL", "AWS", "UI/UX"];

  const quickFacts = [
    { icon: "🌍", title: "Location", content: "India, Assam" },
    { icon: "🎓", title: "Education", content: "BCA, Gauhati University" },
    { icon: "🌱", title: "Learning", content: "Fullstack Developer" },
    {
      icon: "🎯",
      title: "Goal",
      content: "Building impactful products that solve real problems",
    },
  ];

  const stats = [
    { number: "3+", label: "Years Experience" },
    { number: "50+", label: "Projects Completed" },
    { number: "15+", label: "Happy Clients" },
    { number: "10+", label: "Open Source Contributions" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Profile Image with Card Flip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-md w-full"
        >
          {/* Background decorative elements */}
          <div
            className="absolute -z-10 -top-10 -left-10 w-full h-full rounded-full blur-lg"
            style={{
              background: `linear-gradient(135deg, ${accentColors.primary}10, ${accentColors.secondary}05)`,
            }}
          />
          <div
            className="absolute -z-10 bottom-10 right-10 w-40 h-40 rounded-full blur-md"
            style={{
              backgroundColor: `${accentColors.primary}10`,
            }}
          />

          {/* Card with flip effect */}
          <div
            className="relative w-full h-[450px] perspective-3d cursor-pointer"
            onClick={() => {
              setIsFlipped(!isFlipped);
              triggerHapticFeedback();
            }}
            style={{ perspective: "1000px" }}
          >
            <motion.div
              className="relative w-full h-full transition-all duration-700 rounded-2xl"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.7, type: "spring", damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front - Profile Image */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="relative h-full w-full">
                  <img
                    src={profileImage}
                    alt="Ilias Ahmed"
                    className="object-cover w-full h-full"
                  />

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      background: `linear-gradient(to top, ${
                        isDark
                          ? "rgba(17, 24, 39, 1)"
                          : "rgba(255, 255, 255, 1)"
                      } 0%, ${
                        isDark
                          ? "rgba(17, 24, 39, 0.2)"
                          : "rgba(255, 255, 255, 0.2)"
                      } 50%, transparent 100%)`,
                    }}
                  />

                  {/* Social links */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-4">
                    {[
                      {
                        icon: <Github size={18} />,
                        url: "https://github.com/Ilias-Ahmed",
                      },
                      {
                        icon: <Linkedin size={18} />,
                        url: "https://www.linkedin.com/in/ilias-ahmed9613/",
                      },
                      {
                        icon: <Twitter size={18} />,
                        url: "https://twitter.com",
                      },
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-colors"
                        style={{
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                          borderColor: isDark
                            ? "rgba(255,255,255,0.2)"
                            : "rgba(0,0,0,0.2)",
                        }}
                        whileHover={{
                          scale: 1.1,
                          y: -5,
                          backgroundColor: `${accentColors.primary}80`,
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>

                  {/* Flip indicator */}
                  <motion.div
                    className="absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full text-xs border"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.2)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Tap for quick facts
                  </motion.div>
                </div>
              </div>

              {/* Back - Quick Facts */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div
                  className="h-full w-full backdrop-blur-md border shadow-xl p-8 flex flex-col"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(17, 24, 39, 0.95)"
                      : "rgba(255, 255, 255, 0.95)",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  }}
                >
                  <h4 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColors.primary }}
                    />
                    <span>Quick Facts</span>
                  </h4>

                  <motion.ul
                    className="space-y-5 flex-1 overflow-y-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {quickFacts.map((fact, index) => (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        className="flex items-start gap-4"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: `${accentColors.primary}20`,
                            color: accentColors.primary,
                          }}
                        >
                          {fact.icon}
                        </div>
                        <div>
                          <h5 className="font-medium text-base">
                            {fact.title}
                          </h5>
                          <p className="opacity-70 text-sm">{fact.content}</p>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.div
                    className="mt-4 pt-3 border-t text-center"
                    style={{
                      borderColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="text-sm opacity-70">Tap to flip back</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Profile Info */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="space-y-8"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-block">
              <div
                className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-4"
                style={{
                  background: `linear-gradient(135deg, ${accentColors.primary}20, ${accentColors.secondary}20)`,
                  color: accentColors.primary,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: accentColors.primary }}
                />
                <span>Full Stack Developer</span>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-block"
              >
                Hello, I'm{" "}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
                }}
              >
                Ilias Ahmed
              </motion.span>
            </h2>
            <div
              className="w-20 h-1 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            {[
              "I'm a passionate full-stack developer with a love for creating beautiful, functional, and user-friendly web applications. With over 6 years of experience in the industry, I've worked on a wide range of projects from small business websites to large enterprise applications.",
              "My approach combines technical expertise with creative problem-solving. I believe that great code should not only work flawlessly but also be maintainable, scalable, and accessible.",
              "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through technical writing and mentoring.",
            ].map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="opacity-80 leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2">
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="px-4 py-2 border rounded-full text-sm transition-colors"
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
                    color: accentColors.primary,
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 pt-4"
          >
            <motion.a
              href="/contact"
              className="px-6 py-3 text-white rounded-full flex items-center gap-2 transition-all"
              style={{
                background: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
                boxShadow: `0 4px 14px ${accentColors.shadow}`,
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: `0 6px 20px ${accentColors.shadow}`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Get in Touch</span>
              <ArrowRight size={18} />
            </motion.a>

            <motion.button
              onClick={() => {
                setShowResume(true);
                triggerHapticFeedback();
              }}
              className="px-6 py-3 rounded-full flex items-center gap-2 transition-all border"
              style={{
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              }}
              whileHover={{
                scale: 1.03,
                backgroundColor: `${accentColors.primary}10`,
                borderColor: `${accentColors.primary}30`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Resume</span>
              <Download size={18} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Experience stats */}
      <motion.div
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {stats.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.1 }}
            className="backdrop-blur-sm border rounded-xl p-6 text-center transition-colors group"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
            whileHover={{
              backgroundColor: `${accentColors.primary}10`,
              borderColor: `${accentColors.primary}30`,
            }}
          >
            <motion.h3
              className="text-3xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.number}
            </motion.h3>
            <p className="opacity-70 text-sm mt-2 group-hover:opacity-90 transition-opacity">
              {item.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Resume Viewer Modal */}
      <ResumeViewer isOpen={showResume} onClose={() => setShowResume(false)} />
    </div>
  );
};

export default ProfileCard;
