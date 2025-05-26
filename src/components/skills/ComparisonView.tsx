import { useMemo } from "react";
import { motion } from "framer-motion";
import { Skill } from "./types";
import { triggerHapticFeedback } from "@/utils/haptics";
import { useTheme } from "@/contexts/ThemeContext";

interface ComparisonViewProps {
  comparisonSkills: string[];
  toggleComparisonSkill: (skillId: string) => void;
  skills: Skill[];
}

/**
 * ComparisonView component allows side-by-side comparison of skills
 */
const ComparisonView = ({
  comparisonSkills,
  toggleComparisonSkill,
  skills,
}: ComparisonViewProps) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Get selected skills for comparison
  const selectedSkills = useMemo(() => {
    return comparisonSkills
      .map((id) => skills.find((skill) => skill.id === id))
      .filter((skill): skill is Skill => skill !== undefined);
  }, [comparisonSkills, skills]);

  // Get available skills for selection (excluding already selected)
  const availableSkills = useMemo(() => {
    return skills.filter((skill) => !comparisonSkills.includes(skill.id));
  }, [skills, comparisonSkills]);

  const metrics = [
    { key: "level", label: "Proficiency Level", suffix: "%" },
    { key: "projects", label: "Projects", suffix: "" },
    { key: "yearsExperience", label: "Years Experience", suffix: "y" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h3
          className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r"
          style={{
            backgroundImage: `linear-gradient(to right, ${accentColors.primary}, ${accentColors.secondary})`,
          }}
        >
          Skills Comparison
        </h3>
        <p
          className="max-w-2xl mx-auto"
          style={{
            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
          }}
        >
          Compare skills side-by-side to understand proficiency levels,
          experience, and project involvement across different technologies.
        </p>
      </div>

      {/* Skill Selection */}
      {comparisonSkills.length < 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h4
            className="text-lg font-semibold mb-4"
            style={{ color: isDark ? "#ffffff" : "#1f2937" }}
          >
            Add Skills to Compare ({comparisonSkills.length}/3)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {availableSkills.slice(0, 12).map((skill) => (
              <motion.button
                key={skill.id}
                onClick={() => {
                  toggleComparisonSkill(skill.id);
                  triggerHapticFeedback();
                }}
                className="p-3 rounded-lg border transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.8)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
                whileHover={{
                  scale: 1.05,
                  borderColor: accentColors.primary,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-lg mx-auto mb-2"
                  style={{
                    backgroundColor: `${skill.color}20`,
                    color: skill.color,
                  }}
                >
                  {skill.icon}
                </div>
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                >
                  {skill.name}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Comparison Table */}
      {selectedSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div
            className="rounded-xl border backdrop-blur-sm overflow-hidden"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.8)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                  }}
                >
                  <th
                    className="text-left p-4 font-semibold"
                    style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                  >
                    Skill
                  </th>
                  {selectedSkills.map((skill) => (
                    <th key={skill.id} className="text-center p-4">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-12 h-12 flex items-center justify-center rounded-lg mb-2 text-xl"
                          style={{
                            backgroundColor: `${skill.color}20`,
                            color: skill.color,
                          }}
                        >
                          {skill.icon}
                        </div>
                        <span
                          className="font-semibold"
                          style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                        >
                          {skill.name}
                        </span>
                        <span
                          className="text-xs"
                          style={{
                            color: isDark
                              ? "rgba(255,255,255,0.6)"
                              : "rgba(0,0,0,0.6)",
                          }}
                        >
                          {skill.category}
                        </span>
                        <button
                          onClick={() => {
                            toggleComparisonSkill(skill.id);
                            triggerHapticFeedback();
                          }}
                          className="mt-2 text-xs px-2 py-1 rounded-full transition-colors"
                          style={{
                            backgroundColor: `${accentColors.primary}20`,
                            color: accentColors.primary,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric, index) => (
                  <tr
                    key={metric.key}
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? "transparent"
                          : isDark
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(0,0,0,0.02)",
                    }}
                  >
                    <td
                      className="p-4 font-medium"
                      style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                    >
                      {metric.label}
                    </td>
                    {selectedSkills.map((skill) => {
                      const value = skill[metric.key as keyof Skill] as number;
                      const maxValue = Math.max(
                        ...selectedSkills.map(
                          (s) => s[metric.key as keyof Skill] as number
                        )
                      );
                      const isHighest = value === maxValue;

                      return (
                        <td key={skill.id} className="p-4 text-center">
                          <div className="flex flex-col items-center">
                            <span
                              className={`text-lg font-bold ${
                                isHighest ? "text-primary" : ""
                              }`}
                              style={{
                                color: isHighest
                                  ? accentColors.primary
                                  : isDark
                                  ? "#ffffff"
                                  : "#1f2937",
                              }}
                            >
                              {value}
                              {metric.suffix}
                            </span>
                            {metric.key === "level" && (
                              <div className="w-16 mt-2">
                                <div
                                  className="h-2 rounded-full overflow-hidden"
                                  style={{
                                    backgroundColor: isDark
                                      ? "rgba(255,255,255,0.1)"
                                      : "rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: skill.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${value}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                  />
                                </div>
                              </div>
                            )}
                            {isHighest && (
                              <span
                                className="text-xs mt-1 px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: `${accentColors.primary}20`,
                                  color: accentColors.primary,
                                }}
                              >
                                Highest
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Description Row */}
                <tr>
                  <td
                    className="p-4 font-medium"
                    style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                  >
                    Description
                  </td>
                  {selectedSkills.map((skill) => (
                    <td key={skill.id} className="p-4">
                      <p
                        className="text-sm text-center"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)",
                        }}
                      >
                        {skill.description}
                      </p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {selectedSkills.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: `${accentColors.primary}20` }}
          >
            <span className="text-3xl">⚖️</span>
          </div>
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: isDark ? "#ffffff" : "#1f2937" }}
          >
            Select Skills to Compare
          </h3>
          <p
            className="max-w-md mx-auto"
            style={{
              color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
            }}
          >
            Choose up to 3 skills from the grid above to see a detailed
            side-by-side comparison of proficiency levels and experience.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ComparisonView;
