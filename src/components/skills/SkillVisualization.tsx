import { useMemo } from "react";
import { motion } from "framer-motion";
import { Skill, DistributionData } from "./types";
import { useTheme } from "@/contexts/ThemeContext";

interface SkillVisualizationProps {
  skills: Skill[];
  className?: string;
}

/**
 * SkillVisualization component displays an interactive chart of skill distribution
 */
const SkillVisualization = ({
  skills,
  className = "",
}: SkillVisualizationProps) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Calculate skill distribution by category
  const distributionData: DistributionData[] = useMemo(() => {
    const categoryMap = new Map<string, number>();

    skills.forEach((skill) => {
      categoryMap.set(
        skill.category,
        (categoryMap.get(skill.category) || 0) + 1
      );
    });

    const colors = [
      accentColors.primary,
      accentColors.secondary,
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
    ];

    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [skills, accentColors]);

  // Calculate average proficiency by category
  const categoryAverages = useMemo(() => {
    const categoryMap = new Map<string, { total: number; count: number }>();

    skills.forEach((skill) => {
      const current = categoryMap.get(skill.category) || { total: 0, count: 0 };
      categoryMap.set(skill.category, {
        total: current.total + skill.level,
        count: current.count + 1,
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      average: Math.round(data.total / data.count),
      color:
        distributionData.find((d) => d.name === category)?.color ||
        accentColors.primary,
    }));
  }, [skills, distributionData, accentColors]);

  const totalSkills = skills.length;

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 rounded-xl border backdrop-blur-sm"
          style={{
            backgroundColor: isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.8)",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        >
          <h3
            className="text-xl font-bold mb-6"
            style={{ color: isDark ? "#ffffff" : "#1f2937" }}
          >
            Skills Distribution
          </h3>

          <div className="space-y-4">
            {distributionData.map((item, index) => {
              const percentage = (item.value / totalSkills) * 100;

              return (
                <div key={item.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="font-medium"
                      style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                    >
                      {item.name}
                    </span>
                    <span
                      className="text-sm"
                      style={{
                        color: isDark
                          ? "rgba(255,255,255,0.6)"
                          : "rgba(0,0,0,0.6)",
                      }}
                    >
                      {item.value} skills ({percentage.toFixed(0)}%)
                    </span>
                  </div>

                  <div
                    className="h-3 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{
                        duration: 1,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Average Proficiency by Category */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 rounded-xl border backdrop-blur-sm"
          style={{
            backgroundColor: isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.8)",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        >
          <h3
            className="text-xl font-bold mb-6"
            style={{ color: isDark ? "#ffffff" : "#1f2937" }}
          >
            Average Proficiency
          </h3>

          <div className="space-y-4">
            {categoryAverages.map((item, index) => (
              <div key={item.category}>
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="font-medium"
                    style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                  >
                    {item.category}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: item.color }}
                  >
                    {item.average}%
                  </span>
                </div>

                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.average}%` }}
                    transition={{
                      duration: 1,
                      delay: 0.3 + index * 0.1,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Skills", value: totalSkills, suffix: "" },
          { label: "Categories", value: distributionData.length, suffix: "" },
          {
            label: "Avg Proficiency",
            value: Math.round(
              skills.reduce((acc, skill) => acc + skill.level, 0) /
                skills.length
            ),
            suffix: "%",
          },
          {
            label: "Total Projects",
            value: skills.reduce((acc, skill) => acc + skill.projects, 0),
            suffix: "",
          },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="p-4 rounded-lg border text-center backdrop-blur-sm"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.8)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            <motion.div
              className="text-2xl font-bold mb-1"
              style={{ color: accentColors.primary }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              {stat.value}
              {stat.suffix}
            </motion.div>
            <div
              className="text-sm"
              style={{
                color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SkillVisualization;

