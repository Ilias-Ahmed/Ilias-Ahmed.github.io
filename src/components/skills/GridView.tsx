import { memo } from "react";
import { motion } from "framer-motion";
import { Skill, ViewMode } from "./types";
import { triggerHapticFeedback } from "@/utils/haptics";
import { useTheme } from "@/contexts/ThemeContext";

interface GridViewProps {
  skills: Skill[];
  setSelectedSkill: (skill: Skill | null) => void;
  setHoveredSkill: (skillId: string | null) => void;
  hoveredSkill: string | null;
  setViewMode: (mode: ViewMode) => void;
  setComparisonSkills: (skills: string[]) => void;
  viewMode: ViewMode;
}

/**
 * GridView component displays skills in a card grid layout
 */
const GridView = ({
  skills,
  setSelectedSkill,
  setHoveredSkill,
  hoveredSkill,
  setViewMode,
  setComparisonSkills,
}: GridViewProps) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Handle comparison button click
  const handleCompareClick = (e: React.MouseEvent, skillId: string) => {
    e.stopPropagation();
    setViewMode("comparison");
    setComparisonSkills([skillId]);
    triggerHapticFeedback();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h3
          className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r"
          style={{
            backgroundImage: `linear-gradient(to right, ${accentColors.primary}, ${accentColors.secondary})`,
          }}
        >
          Skills & Expertise
        </h3>
        <p
          className="max-w-2xl mx-auto"
          style={{
            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
          }}
        >
          A comprehensive showcase of my technical skills and areas of
          expertise, highlighting proficiency levels and practical experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => {
          const isHovered = hoveredSkill === skill.id;

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: hoveredSkill ? (isHovered ? 1 : 0.7) : 1,
                y: 0,
                scale: isHovered ? 1.03 : 1,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                scale: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredSkill(skill.id)}
              onMouseLeave={() => setHoveredSkill(null)}
              onClick={() => {
                setSelectedSkill(skill);
                triggerHapticFeedback();
              }}
            >
              {/* Card Container */}
              <div
                className="relative overflow-hidden rounded-xl p-6 h-full border transition-all duration-300 transform backdrop-blur-sm"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.8)",
                  borderColor: isHovered
                    ? accentColors.primary
                    : isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                  boxShadow: isHovered
                    ? `0 20px 40px ${accentColors.shadow}`
                    : "none",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {/* Background glow effect */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${skill.color}20 0%, transparent 70%)`,
                    opacity: isHovered ? 0.3 : 0,
                    filter: "blur(20px)",
                  }}
                />

                {/* Skill Icon and Title */}
                <div className="flex items-start mb-4 relative z-10">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-lg mr-4 text-2xl transition-all duration-300"
                    style={{
                      backgroundColor: `${skill.color}${
                        isHovered ? "30" : "20"
                      }`,
                      color: skill.color,
                      transform: isHovered ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {skill.icon}
                  </div>
                  <div>
                    <h3
                      className="font-bold text-xl transition-colors duration-300"
                      style={{
                        color: isDark ? "#ffffff" : "#1f2937",
                      }}
                    >
                      {skill.name}
                    </h3>
                    <span
                      className="text-sm"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,0.6)"
                          : "rgba(0,0,0,0.6)",
                      }}
                    >
                      {skill.category}
                    </span>
                  </div>
                </div>

                {/* Skill Description */}
                <p
                  className="text-sm mb-4 relative z-10"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                  }}
                >
                  {skill.description}
                </p>

                {/* Proficiency Bar */}
                <div className="space-y-3 relative z-10">
                  <div>
                    <div
                      className="flex justify-between text-xs mb-1"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,0.6)"
                          : "rgba(0,0,0,0.6)",
                      }}
                    >
                      <span>Proficiency</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                      }}
                    >
                      <motion.div
                        className="h-full"
                        style={{ backgroundColor: skill.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{
                          duration: isHovered ? 0.8 : 1,
                          delay: isHovered ? 0 : 0.2 + index * 0.05,
                        }}
                      />
                    </div>
                  </div>

                  {/* Projects and Experience */}
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(0,0,0,0.6)",
                        }}
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(0,0,0,0.6)",
                        }}
                      >
                        {skill.projects} projects
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(0,0,0,0.6)",
                        }}
                      >
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                      </svg>
                      <span
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(0,0,0,0.6)",
                        }}
                      >
                        {skill.yearsExperience}y exp
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compare Button */}
                <motion.button
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{
                    backgroundColor: `${accentColors.primary}20`,
                    color: accentColors.primary,
                    border: `1px solid ${accentColors.primary}40`,
                  }}
                  onClick={(e) => handleCompareClick(e, skill.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Compare this skill"
                >
                  ⚖️
                </motion.button>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${skill.color}05 0%, transparent 50%, ${accentColors.primary}05 100%)`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(GridView);

