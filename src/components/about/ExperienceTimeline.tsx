import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { timelineData } from "./aboutData";
import { triggerHapticFeedback } from "@/utils/haptics";

interface ExperienceTimelineProps {
  timelineData: typeof timelineData;
}

const ExperienceTimeline = ({ timelineData }: ExperienceTimelineProps) => {
  const [activeItem, setActiveItem] = useState<number | null>(0);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-12 gap-8">
        {/* Timeline Navigation */}
        <div className="md:col-span-4">
          <div className="sticky top-24 space-y-1">
            <h3 className="text-2xl font-bold mb-6">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
                }}
              >
                My Journey
              </span>
            </h3>

            {timelineData.map((item, index) => (
              <motion.button
                key={index}
                className="w-full text-left p-4 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor:
                    activeItem === index
                      ? `${accentColors.primary}20`
                      : hoveredItem === index
                      ? isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)"
                      : isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.03)",
                  borderLeft:
                    activeItem === index
                      ? `4px solid ${accentColors.primary}`
                      : hoveredItem === index
                      ? `2px solid ${accentColors.primary}50`
                      : "2px solid transparent",
                }}
                onClick={() => {
                  setActiveItem(index);
                  triggerHapticFeedback();
                }}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="font-medium"
                    style={{
                      color:
                        activeItem === index || hoveredItem === index
                          ? accentColors.primary
                          : undefined,
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    className="text-sm px-2 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        hoveredItem === index && activeItem !== index
                          ? `${accentColors.primary}20`
                          : `${accentColors.primary}10`,
                      color: accentColors.primary,
                    }}
                  >
                    {item.year}
                  </span>
                </div>
                <p className="text-sm mt-1 opacity-70">{item.company}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            {timelineData.map(
              (item, index) =>
                activeItem === index && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="backdrop-blur-sm rounded-xl p-6 border"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(255,255,255,0.8)",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.1)",
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold">{item.title}</h4>
                        <p style={{ color: accentColors.primary }}>
                          {item.company}
                        </p>
                      </div>
                      <span
                        className="text-sm px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: `${accentColors.primary}20`,
                          color: accentColors.primary,
                        }}
                      >
                        {item.year}
                      </span>
                    </div>

                    <p className="opacity-80 mb-6">{item.description}</p>

                    <div className="mb-6">
                      <h5 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <span style={{ color: accentColors.primary }}>✓</span>
                        <span>Key Achievements</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.achievements.map((achievement, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-2 p-3 rounded-lg"
                            style={{
                              backgroundColor: isDark
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.05)",
                            }}
                          >
                            <span
                              style={{ color: accentColors.primary }}
                              className="mt-0.5"
                            >
                              •
                            </span>
                            <span className="text-sm opacity-80">
                              {achievement}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <span style={{ color: accentColors.primary }}>⚙️</span>
                        <span>Technologies Used</span>
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="px-3 py-1 text-sm rounded-full border"
                            style={{
                              backgroundColor: `${accentColors.primary}10`,
                              color: accentColors.primary,
                              borderColor: `${accentColors.primary}20`,
                            }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ExperienceTimeline;
