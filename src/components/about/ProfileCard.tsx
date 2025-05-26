import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Brain,
  Heart,
  Target,
  Coffee,
  Code,
  Palette,
  Zap,
  Globe,
} from "lucide-react";
import profileImage from "/images/profile.png?url";

const ProfileCard = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const personalityCards = [
    {
      icon: Brain,
      title: "The Thinker",
      description:
        "I approach every challenge with analytical thinking and creative problem-solving.",
      traits: ["Strategic Planning", "System Design", "Innovation"],
      color: accentColors.primary,
    },
    {
      icon: Heart,
      title: "The Creator",
      description:
        "Passionate about crafting experiences that genuinely impact people's lives.",
      traits: ["User Empathy", "Design Thinking", "Quality Focus"],
      color: accentColors.secondary,
    },
    {
      icon: Target,
      title: "The Achiever",
      description:
        "Goal-oriented mindset with a track record of delivering exceptional results.",
      traits: ["Results Driven", "Continuous Learning", "Excellence"],
      color: accentColors.tertiary,
    },
  ];

  const lifeMetrics = [
    {
      label: "Lines of Code",
      value: "500k+",
      icon: Code,
      description: "Written with passion",
    },
    {
      label: "Coffee Cups",
      value: "2,847",
      icon: Coffee,
      description: "This year alone",
    },
    {
      label: "Design Hours",
      value: "3.2k",
      icon: Palette,
      description: "Perfecting interfaces",
    },
    {
      label: "Countries Reached",
      value: "25+",
      icon: Globe,
      description: "Through my work",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % personalityCards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [personalityCards.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto space-y-6 md:space-y-8"
    >
      {/* Main Profile Section with Integrated Background */}
      <div className="relative overflow-hidden">
        {/* Background with Profile Image Integration */}
        <motion.div
          className="absolute inset-0"
        />

        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full opacity-5 md:opacity-10"
          style={{
            backgroundImage: `url(${profileImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            maskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, transparent 100%)",
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Geometric Elements - Scaled for mobile */}
        <motion.div
          className="absolute top-4 left-4 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 rounded-full opacity-20"
          style={{ backgroundColor: accentColors.primary }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-10 h-10 md:w-16 md:h-16 opacity-15"
          style={{
            backgroundColor: accentColors.secondary,
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
          animate={{
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-4 md:p-8 lg:p-12">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-start">
            {/* Left: Identity - Full width on mobile */}
            <motion.div
              className="lg:col-span-2 space-y-4 md:space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* Header */}
              <div>
                <motion.div
                  className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-3 md:mb-4"
                  style={{
                    backgroundColor: `${accentColors.primary}20`,
                    border: `1px solid ${accentColors.primary}30`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColors.primary }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs md:text-sm font-medium">
                    About Me
                  </span>
                </motion.div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
                    }}
                  >
                    Beyond the Code
                  </span>
                </h3>
                <p className="text-sm md:text-base lg:text-lg opacity-80 leading-relaxed">
                  I'm not just a developer—I'm a digital architect who believes
                  in the power of technology to solve real-world problems. My
                  journey spans from crafting pixel-perfect interfaces to
                  building robust backend systems.
                </p>
              </div>

              {/* Philosophy */}
              <motion.div
                className="p-4 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-sm border"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.8)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.1)",
                }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <motion.div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accentColors.primary}20` }}
                    whileHover={{ rotate: 10 }}
                  >
                    <Zap size={20} style={{ color: accentColors.primary }} />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">
                      My Philosophy
                    </h4>
                    <p className="opacity-80 text-xs md:text-sm leading-relaxed">
                      "Great software isn't just about clean code—it's about
                      understanding people, solving problems elegantly, and
                      creating experiences that feel magical."
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Personality Cards - Full width on mobile, stacked */}
            <motion.div
              className="space-y-3 md:space-y-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {personalityCards.map((card, index) => (
                <motion.div
                  key={index}
                  className="p-3 md:p-4 rounded-lg md:rounded-xl cursor-pointer transition-all duration-300 border"
                  style={{
                    backgroundColor:
                      activeCard === index
                        ? `${card.color}15`
                        : isDark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(255,255,255,0.8)",
                    borderColor:
                      activeCard === index
                        ? `${card.color}40`
                        : isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.1)",
                    transform:
                      activeCard === index ? "scale(1.02)" : "scale(1)",
                  }}
                  onClick={() => setActiveCard(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <motion.div
                      className="w-8 h-8 md:w-10 md:h-10 rounded-md md:rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${card.color}20`,
                        color: card.color,
                      }}
                      animate={
                        activeCard === index ? { scale: [1, 1.1, 1] } : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <card.icon size={16} className="md:w-5 md:h-5" />
                    </motion.div>
                    <h4
                      className="font-semibold text-sm md:text-base"
                      style={{
                        color: activeCard === index ? card.color : undefined,
                      }}
                    >
                      {card.title}
                    </h4>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{
                      height: activeCard === index ? "auto" : 0,
                      opacity: activeCard === index ? 1 : 0,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs md:text-sm opacity-80 mb-2 md:mb-3">
                      {card.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {card.traits.map((trait) => (
                        <span
                          key={trait}
                          className="px-2 py-0.5 md:py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${card.color}15`,
                            color: card.color,
                          }}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Life Metrics - Better mobile grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        {lifeMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="p-4 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-sm border text-center group"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.8)",
              borderColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.1)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{
              y: -4,
              backgroundColor: `${accentColors.primary}08`,
              borderColor: `${accentColors.primary}30`,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-lg md:rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColors.primary}20` }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <metric.icon
                size={20}
                className="md:w-6 md:h-6"
                style={{ color: accentColors.primary }}
              />
            </motion.div>

            <motion.div
              className="text-lg md:text-2xl font-bold mb-1"
              style={{ color: accentColors.primary }}
              whileHover={{ scale: 1.05 }}
            >
              {metric.value}
            </motion.div>

            <div className="text-xs md:text-sm font-medium mb-1">
              {metric.label}
            </div>
            <div className="text-xs opacity-60 hidden md:block">
              {metric.description}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quote Section - Responsive text */}
      <motion.div
        className="text-center py-6 md:py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.blockquote
          className="text-lg md:text-xl lg:text-2xl font-medium italic max-w-3xl mx-auto px-4"
          style={{ color: accentColors.primary }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          "The best code is not just functional—it's an expression of empathy,
          crafted with the user's journey in mind."
        </motion.blockquote>
        <motion.p
          className="mt-3 md:mt-4 opacity-70 text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.4 }}
        >
          — My approach to development
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default ProfileCard;
