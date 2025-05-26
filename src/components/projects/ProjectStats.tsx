import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Code, Users, Award, Zap, TrendingUp, Star } from "lucide-react";
import { StatItem } from "./types";
import { useTheme } from "@/contexts/ThemeContext";

const ProjectStats = () => {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>(
    {}
  );
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const stats: StatItem[] = React.useMemo(
    () => [
      {
        value: "50+",
        label: "Projects Completed",
        icon: <Code size={24} />,
        description: "Successfully delivered projects across various domains",
        color: accentColors.primary,
      },
      {
        value: "100k+",
        label: "Users Reached",
        icon: <Users size={24} />,
        description: "Total users across all deployed applications",
        color: accentColors.secondary,
      },
      {
        value: "15+",
        label: "Technologies Mastered",
        icon: <Zap size={24} />,
        description: "Modern frameworks and tools in my tech stack",
        color: accentColors.tertiary,
      },
      {
        value: "99.9%",
        label: "Uptime Achieved",
        icon: <TrendingUp size={24} />,
        description: "Average uptime across production applications",
        color: "#10b981",
      },
      {
        value: "25+",
        label: "Happy Clients",
        icon: <Award size={24} />,
        description: "Satisfied clients and successful collaborations",
        color: "#f59e0b",
      },
      {
        value: "4.9/5",
        label: "Average Rating",
        icon: <Star size={24} />,
        description: "Client satisfaction and project quality rating",
        color: "#ec4899",
      },
    ],
    [accentColors]
  );

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Animate numbers when component comes into view
  useEffect(() => {
    if (isInView) {
      stats.forEach((stat, index) => {
        const numericValue = parseFloat(stat.value.replace(/[^0-9.]/g, ""));
        let current = 0;
        const increment = numericValue / 50; // 50 steps for smooth animation
        const timer = setInterval(() => {
          current += increment;
          if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
          }

          setAnimatedValues((prev) => ({
            ...prev,
            [stat.label]: current,
          }));
        }, 30 + index * 10); // Stagger the animations
      });
    }
  }, [isInView, stats]);

  const formatValue = (stat: StatItem, animatedValue: number) => {
    const originalValue = stat.value;
    if (originalValue.includes("k")) {
      return `${Math.floor(animatedValue / 1000)}k+`;
    } else if (originalValue.includes("%")) {
      return `${animatedValue.toFixed(1)}%`;
    } else if (originalValue.includes("/")) {
      return `${animatedValue.toFixed(1)}/5`;
    } else if (originalValue.includes("+")) {
      return `${Math.floor(animatedValue)}+`;
    }
    return Math.floor(animatedValue).toString();
  };

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className="py-16 mt-20" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-blue-500">
          Project Impact & Achievements
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Numbers that reflect the quality, reach, and impact of my work across
          various projects and collaborations.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="relative group"
          >
            <motion.div
              className="p-8 rounded-2xl border transition-all duration-300 h-full"
              style={{
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.8)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              }}
              whileHover={{
                y: -5,
                borderColor: stat.color,
                boxShadow: `0 20px 40px ${stat.color}20`,
              }}
            >
              {/* Icon */}
              <motion.div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto"
                style={{
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {stat.icon}
              </motion.div>

              {/* Animated Value */}
              <motion.div
                className="text-center mb-4"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={
                  isInView
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.5, opacity: 0 }
                }
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                <div
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{ color: stat.color }}
                >
                  {animatedValues[stat.label]
                    ? formatValue(stat, animatedValues[stat.label])
                    : stat.value}
                </div>
                <h3 className="text-lg font-semibold opacity-90">
                  {stat.label}
                </h3>
              </motion.div>

              {/* Description */}
              <p className="text-sm opacity-70 text-center leading-relaxed">
                {stat.description}
              </p>

              {/* Hover effect overlay */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}10 0%, ${stat.color}05 100%)`,
                }}
              />

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(45deg, ${stat.color}, transparent, ${stat.color})`,
                  backgroundSize: "200% 200%",
                  padding: "2px",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Additional metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-16 text-center"
      >
        <div
          className="inline-flex items-center gap-4 px-8 py-4 rounded-full border"
          style={{
            backgroundColor: isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.8)",
            borderColor: `${accentColors.primary}30`,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: "#10b981" }}
            />
            <span className="text-sm font-medium">
              Currently Available for New Projects
            </span>
          </div>
          <div className="w-px h-6 bg-gray-300 opacity-30" />
          <div className="text-sm opacity-70">
            Response time: <span className="font-medium">Within 24 hours</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectStats;


