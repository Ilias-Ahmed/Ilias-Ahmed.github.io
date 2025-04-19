import { memo } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";
import { Skill, DistributionData } from "./types";
import { skills as allSkills, categories } from "./skillsData";
import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";

interface ComparisonViewProps {
  comparisonSkills: string[];
  toggleComparisonSkill: (skillId: string) => void;
  skills: Skill[];
}

/**
 * ComparisonView component allows comparing multiple skills with visualizations
 */
const ComparisonView = ({
  comparisonSkills,
  toggleComparisonSkill,
  skills,
}: ComparisonViewProps) => {
  const { theme, accent } = useTheme();

  // Get accent color
  const accentColors: Record<string, string> = {
    purple: "#8B5CF6",
    blue: "#3B82F6",
    green: "#10B981",
    amber: "#F59E0B",
    pink: "#EC4899",
  };

  const accentColor = accentColors[accent] || accentColors.purple;

  // Distribution data for pie chart
  const distributionData: DistributionData[] = categories.map((category) => {
    const categorySkills = skills.filter(
      (skill) => skill.category === category
    );
    return {
      name: category,
      value: categorySkills.length,
      color: categorySkills[0]?.color || "#666666",
    };
  });

  // For the comparison data
  const comparisonData = [
    {
      name: "Proficiency",
      ...Object.fromEntries(
        comparisonSkills.map((id) => {
          const skill = allSkills.find((s) => s.id === id);
          return [skill?.name || id, skill?.level || 0];
        })
      ),
    },
    {
      name: "Projects",
      ...Object.fromEntries(
        comparisonSkills.map((id) => {
          const skill = allSkills.find((s) => s.id === id);
          return [skill?.name || id, skill?.projects || 0];
        })
      ),
    },
    {
      name: "Experience (Years)",
      ...Object.fromEntries(
        comparisonSkills.map((id) => {
          const skill = allSkills.find((s) => s.id === id);
          return [skill?.name || id, skill?.yearsExperience || 0];
        })
      ),
    },
  ];

  // Format data for radar chart
  const radarData = comparisonSkills
    .map((id) => {
      const skill = allSkills.find((s) => s.id === id);
      if (!skill) return null;

      return {
        name: skill.name,
        proficiency: skill.level,
        projects: skill.projects * 10, // Scale up for better visualization
        experience: skill.yearsExperience * 20, // Scale up for better visualization
        color: skill.color,
      };
    })
    .filter(Boolean) as Array<{
      name: string;
      proficiency: number;
      projects: number;
      experience: number;
      color: string;
    }>;

  // Handle skill toggle
  const handleSkillToggle = (skillId: string) => {
    toggleComparisonSkill(skillId);
    triggerHapticFeedback();
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl p-6 border border-gray-300 dark:border-gray-700"
      >
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
          Select up to 3 skills to compare
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          {allSkills.map((skill) => (
            <motion.button
              key={skill.id}
              className={`p-3 rounded-lg text-center transition-all ${
                comparisonSkills.includes(skill.id)
                  ? "bg-purple-700 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              onClick={() => handleSkillToggle(skill.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={
                comparisonSkills.length >= 3 &&
                !comparisonSkills.includes(skill.id)
              }
              aria-label={`Select ${skill.name} for comparison`}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">{skill.icon}</span>
                <span className="text-sm">{skill.name}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {comparisonSkills.length > 0 ? (
          <ComparisonContent
            comparisonSkills={comparisonSkills}
            toggleComparisonSkill={handleSkillToggle}
            radarData={radarData}
            comparisonData={comparisonData}
            accentColor={accentColor}
            theme={theme}
          />
        ) : (
          <EmptyComparisonState />
        )}
      </motion.div>

      {/* Distribution chart */}
      <DistributionChart
        distributionData={distributionData}
        theme={theme}
        allSkills={allSkills}
      />
    </div>
  );
};

// Helper component for empty comparison state
const EmptyComparisonState = () => (
  <div className="text-center py-10 text-gray-600 dark:text-gray-400">
    <svg
      className="w-16 h-16 mx-auto mb-4 opacity-30"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
    </svg>
    <p className="text-lg">Select skills above to compare them</p>
  </div>
);

// Helper component for comparison content
const ComparisonContent = ({
  comparisonSkills,
  toggleComparisonSkill,
  radarData,
  comparisonData,
  accentColor,
  theme
}: {
    comparisonSkills: string[];
  toggleComparisonSkill: (skillId: string) => void;
  radarData: Array<{
    name: string;
    proficiency: number;
    projects: number;
    experience: number;
    color: string;
  }>;
  comparisonData: Array<Record<string, any>>;
  accentColor: string;
  theme: string;
}) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {comparisonSkills.map((skillId) => {
          const skill = allSkills.find((s) => s.id === skillId);
          if (!skill) return null;

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-5 border border-gray-300 dark:border-gray-700 relative"
            >
              <button
                className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                onClick={() => toggleComparisonSkill(skill.id)}
                aria-label={`Remove ${skill.name} from comparison`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>

              <div className="flex items-center mb-4">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg mr-4 text-2xl"
                  style={{
                    backgroundColor: `${skill.color}20`,
                    color: skill.color,
                  }}
                >
                  {skill.icon}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-800 dark:text-white">
                    {skill.name}
                  </h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <SkillMetricBar
                  label="Proficiency"
                  value={skill.level}
                  suffix="%"
                  color={skill.color}
                  maxValue={100}
                />

                <SkillMetricBar
                  label="Projects"
                  value={skill.projects}
                  color={skill.color}
                  maxValue={30}
                />

                <SkillMetricBar
                  label="Experience"
                  value={skill.yearsExperience}
                  suffix=" years"
                  color={skill.color}
                  maxValue={5}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {comparisonSkills.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-300 dark:border-gray-700"
        >
          <h4 className="text-lg font-bold mb-6 text-center text-gray-800 dark:text-white">
            Side-by-Side Comparison
          </h4>

          <div className="space-y-8">
            <ComparisonBarCharts
              comparisonSkills={comparisonSkills}
            />

            {/* Radar Chart */}
            {comparisonSkills.length >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8"
              >
                <h5 className="text-gray-600 dark:text-gray-400 mb-3 text-center">
                  Skill Metrics Comparison
                </h5>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="80%" data={radarData}>
                      <PolarGrid
                        stroke={theme === "dark" ? "#444" : "#ddd"}
                      />
                      <PolarAngleAxis
                        dataKey="name"
                        tick={{
                          fill: theme === "dark" ? "#fff" : "#333",
                        }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{
                          fill: theme === "dark" ? "#fff" : "#333",
                        }}
                      />
                      <Radar
                        name="Proficiency"
                        dataKey="proficiency"
                        stroke={accentColor}
                        fill={accentColor}
                        fillOpacity={0.5}
                      />
                      <Radar
                        name="Projects"
                        dataKey="projects"
                        stroke="#38bdf8"
                        fill="#38bdf8"
                        fillOpacity={0.5}
                      />
                      <Radar
                        name="Experience"
                        dataKey="experience"
                        stroke="#4ade80"
                        fill="#4ade80"
                        fillOpacity={0.5}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          const numericValue = Number(value);
                          if (name === "proficiency")
                            return [`${numericValue}%`, "Proficiency"];
                          if (name === "projects")
                            return [`${numericValue / 10}`, "Projects"];
                          if (name === "experience")
                            return [
                              `${numericValue / 20} years`,
                              "Experience",
                            ];
                          return [value, name];
                        }}
                        contentStyle={{
                          backgroundColor:
                            theme === "dark" ? "#1f2937" : "#ffffff",
                          borderColor:
                            theme === "dark" ? "#374151" : "#e5e7eb",
                          color: theme === "dark" ? "#f3f4f6" : "#1f2937",
                        }}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Comparison Table */}
            {comparisonSkills.length >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-8 overflow-x-auto"
              >
                <h5 className="text-gray-600 dark:text-gray-400 mb-3 text-center">
                  Detailed Comparison
                </h5>
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Metric
                      </th>
                      {comparisonSkills.map((skillId) => {
                        const skill = allSkills.find(
                          (s) => s.id === skillId
                        );
                        if (!skill) return null;
                        return (
                          <th
                            key={skill.id}
                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            style={{ color: skill.color }}
                          >
                            {skill.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {comparisonData.map((row, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0
                            ? "bg-gray-50 dark:bg-gray-900/30"
                            : ""
                        }
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {row.name}
                        </td>
                        {comparisonSkills.map((skillId) => {
                          const skill = allSkills.find(
                            (s) => s.id === skillId
                          );
                          if (!skill) return null;

                          const value = row[skill.name];
                          let displayValue = value;

                          // Format the value based on the metric
                          if (row.name === "Proficiency") {
                            displayValue = `${value}%`;
                          } else if (row.name === "Experience (Years)") {
                            displayValue = `${value} years`;
                          }

                          return (
                            <td
                              key={`${row.name}-${skill.id}`}
                              className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                            >
                              <span
                                className="font-semibold"
                                style={{ color: skill.color }}
                              >
                                {displayValue}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Helper component for skill metric bars
const SkillMetricBar = ({
  label,
  value,
  suffix = "",
  color,
  maxValue
}: {
  label: string;
  value: number;
  suffix?: string;
  color: string;
  maxValue: number;
}) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600 dark:text-gray-400">
        {label}
      </span>
      <span className="text-gray-800 dark:text-white font-medium">
        {value}{suffix}
      </span>
    </div>
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${(value / maxValue) * 100}%` }}
        transition={{ duration: 1 }}
      />
    </div>
  </div>
);

// Helper component for comparison bar charts
const ComparisonBarCharts = ({
  comparisonSkills,
}: {
  comparisonSkills: string[];
}) => (
  <>
    <div>
      <h5 className="text-gray-600 dark:text-gray-400 mb-3">
        Proficiency Level
      </h5>
      <div className="flex items-end h-40 space-x-4">
        {comparisonSkills.map((skillId) => {
          const skill = allSkills.find((s) => s.id === skillId);
          if (!skill) return null;

          return (
            <div key={skill.id} className="flex-1 flex flex-col items-center">
              <motion.div
                className="w-full rounded-t-lg"
                style={{
                  backgroundColor: skill.color,
                  height: `${skill.level}%`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${skill.level}%` }}
                transition={{ duration: 1 }}
              />
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-800 dark:text-white">
                  {skill.level}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {skill.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div>
      <h5 className="text-gray-600 dark:text-gray-400 mb-3">
        Projects Completed
      </h5>
      <div className="flex items-end h-40 space-x-4">
        {comparisonSkills.map((skillId) => {
          const skill = allSkills.find((s) => s.id === skillId);
          if (!skill) return null;

          const heightPercentage = (skill.projects / 30) * 100;

          return (
            <div key={skill.id} className="flex-1 flex flex-col items-center">
              <motion.div
                className="w-full rounded-t-lg"
                style={{
                  backgroundColor: skill.color,
                  height: `${heightPercentage}%`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${heightPercentage}%` }}
                transition={{ duration: 1 }}
              />
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-800 dark:text-white">
                  {skill.projects}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {skill.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div>
      <h5 className="text-gray-600 dark:text-gray-400 mb-3">
        Years of Experience
      </h5>
      <div className="flex items-end h-40 space-x-4">
        {comparisonSkills.map((skillId) => {
          const skill = allSkills.find((s) => s.id === skillId);
          if (!skill) return null;

          const heightPercentage = (skill.yearsExperience / 5) * 100;

          return (
            <div key={skill.id} className="flex-1 flex flex-col items-center">
              <motion.div
                className="w-full rounded-t-lg"
                style={{
                  backgroundColor: skill.color,
                  height: `${heightPercentage}%`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${heightPercentage}%` }}
                transition={{ duration: 1 }}
              />
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-800 dark:text-white">
                  {skill.yearsExperience} years
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {skill.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </>
);

// Helper component for distribution chart
const DistributionChart = ({
  distributionData,
  theme,
  allSkills,
}: {
  distributionData: DistributionData[];
  theme: string;
  allSkills: Skill[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl p-6 border border-gray-300 dark:border-gray-700"
  >
    <h3 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-white">
      Skill Distribution
    </h3>

    <div className="flex flex-col md:flex-row items-center justify-center">
      <div className="w-full md:w-1/2 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} skills`, ""]}
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                borderRadius: "0.5rem",
                color: theme === "dark" ? "#f3f4f6" : "#1f2937",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full md:w-1/2 mt-6 md:mt-0">
        <h4 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
          Category Breakdown
        </h4>
        <div className="space-y-3">
          {distributionData.map((entry) => (
            <div key={entry.name} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: entry.color }}
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-gray-800 dark:text-white">
                    {entry.name}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {entry.value} skills
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: entry.color }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(entry.value / allSkills.length) * 100}%`,
                    }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default memo(ComparisonView);


