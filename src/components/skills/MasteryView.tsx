import { useMemo } from "react";
import { motion } from "framer-motion";
import { Skill, MasteryLevel } from "./types";
import { triggerHapticFeedback } from "@/utils/haptics";
import { useTheme } from "@/contexts/ThemeContext";

interface MasteryViewProps {
  skills: Skill[];
  setSelectedSkill: (skill: Skill | null) => void;
}

/**
 * MasteryView component groups skills by proficiency levels
 */
const MasteryView = ({ skills, setSelectedSkill }: MasteryViewProps) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Group skills by mastery levels
  const masteryLevels: MasteryLevel[] = useMemo(() => {
    const levels = [
      { name: "Expert", range: [90, 100], skills: [] },
      { name: "Advanced", range: [75, 89], skills: [] },
      { name: "Intermediate", range: [60, 74], skills: [] },
      { name: "Beginner", range: [0, 59], skills: [] },
    ] as MasteryLevel[];

    skills.forEach((skill) => {
      const level = levels.find(
        (l) => skill.level >= l.range[0] && skill.level <= l.range[1]
      );
      if (level) {
        level.skills.push(skill);
      }
    });

    return levels.filter((level) => level.skills.length > 0);
  }, [skills]);

  const getMasteryColor = (masteryName: string) => {
    switch (masteryName) {
      case "Expert":
        return "#10b981"; // Green
      case "Advanced":
        return "#3b82f6"; // Blue
      case "Intermediate":
        return "#f59e0b"; // Orange
      case "Beginner":
        return "#6b7280"; // Gray
      default:
        return accentColors.primary;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h3
          className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r"
          style={{
            backgroundImage: `linear-gradient(to right, ${accentColors.primary}, ${accentColors.secondary})`,
          }}
        >
          Skills by Mastery Level
        </h3>
        <p
          className="max-w-2xl mx-auto"
          style={{
            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
          }}
        >
          Skills organized by proficiency levels, showcasing depth of expertise
          across different technologies and domains.
        </p>
      </div>

      <div className="space-y-8">
        {masteryLevels.map((level, levelIndex) => {
          const masteryColor = getMasteryColor(level.name);

          return (
            <motion.div
              key={level.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: levelIndex * 0.1 }}
              className="relative"
            >
              {/* Level Header */}
              <div className="flex items-center mb-6">
                <div
                  className="w-4 h-4 rounded-full mr-4"
                  style={{ backgroundColor: masteryColor }}
                />
                <h4
                  className="text-xl font-bold"
                  style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                >
                  {level.name}
                </h4>
                <span
                  className="ml-3 text-sm px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: `${masteryColor}20`,
                    color: masteryColor,
                    border: `1px solid ${masteryColor}40`,
                  }}
                >
                  {level.range[0]}% - {level.range[1]}%
                </span>
                <span
                  className="ml-auto text-sm"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                  }}
                >
                  {level.skills.length} skills
                </span>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {level.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: levelIndex * 0.1 + skillIndex * 0.05,
                    }}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedSkill(skill);
                      triggerHapticFeedback();
                    }}
                  >
                    <div
                      className="p-4 rounded-lg border transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
                      style={{
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(255,255,255,0.8)",
                        borderColor: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                      }}
                    >
                      {/* Skill Header */}
                      <div className="flex items-center mb-3">
                        <div
                          className="w-8 h-8 flex items-center justify-center rounded-lg mr-3 text-lg transition-all duration-300 group-hover:scale-110"
                          style={{
                            backgroundColor: `${skill.color}20`,
                            color: skill.color,
                          }}
                        >
                          {skill.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5
                            className="font-medium truncate group-hover:text-primary transition-colors"
                            style={{
                              color: isDark ? "#ffffff" : "#1f2937",
                            }}
                          >
                            {skill.name}
                          </h5>
                          <p
                            className="text-xs truncate"
                            style={{
                              color: isDark
                                ? "rgba(255,255,255,0.6)"
                                : "rgba(0,0,0,0.6)",
                            }}
                          >
                            {skill.category}
                          </p>
                        </div>
                      </div>

                      {/* Proficiency Bar */}
                      <div className="mb-3">
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
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.1)",
                          }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: masteryColor }}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{
                              duration: 1,
                              delay: levelIndex * 0.1 + skillIndex * 0.05 + 0.3,
                            }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex justify-between text-xs">
                        <span
                          style={{
                            color: isDark
                              ? "rgba(255,255,255,0.6)"
                              : "rgba(0,0,0,0.6)",
                          }}
                        >
                          {skill.projects} projects
                        </span>
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

                      {/* Hover overlay */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${masteryColor}05 0%, transparent 50%, ${accentColors.primary}05 100%)`,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MasteryView;
