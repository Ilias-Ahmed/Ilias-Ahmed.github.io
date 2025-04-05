import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart2,
  PieChart as PieChartIcon,
  RadarIcon,
  Network,
} from "lucide-react";
import { Skill } from "./types";
import { useTheme } from "@/contexts/ThemeContext";

type SkillCategory = {
  name: string;
  count: number;
  color: string;
};

interface EnhancedSkillVisualizationProps {
  skills: Skill[];
  className?: string;
}

const SkillVisualization: React.FC<EnhancedSkillVisualizationProps> = ({
  skills,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState("radar");
  const { theme } = useTheme();

  // Get skill categories with counts
  const categories = skills.reduce(
    (acc: { [key: string]: SkillCategory }, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = {
          name: skill.category,
          count: 0,
          color: getRandomColor(skill.category),
        };
      }
      acc[skill.category].count++;
      return acc;
    },
    {}
  );

  const categoryData = Object.values(categories);

  // Prepare data for radar chart
  const radarData = skills
    .map((skill) => ({
      name: skill.name,
      value: skill.level,
      fullMark: 100,
      color: skill.color || getRandomColor(skill.name),
    }))
    .slice(0, 8); // Limit to prevent overcrowding

  // Prepare data for network graph
  const topSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, 12);

  const gridTextColor =
    theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)";

  return (
    <motion.div
      className={`p-6 rounded-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs
        defaultValue="radar"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-center mb-8">
          <TabsList className="bg-background/30 backdrop-blur-md">
            <TabsTrigger value="radar" className="flex gap-2 items-center">
              <RadarIcon size={16} />
              <span className="hidden sm:inline">Radar</span>
            </TabsTrigger>
            <TabsTrigger value="bar" className="flex gap-2 items-center">
              <BarChart2 size={16} />
              <span className="hidden sm:inline">Bar</span>
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex gap-2 items-center">
              <PieChartIcon size={16} />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="network" className="flex gap-2 items-center">
              <Network size={16} />
              <span className="hidden sm:inline">Network</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="radar" className="mt-0">
          <div className="text-center mb-4">
            <h3 className="text-xl font-medium mb-2">
              Skill Proficiency Radar
            </h3>
            <p className="text-muted-foreground text-sm">
              Visualizing skill proficiency across different technologies
            </p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart outerRadius={150} data={radarData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fill: gridTextColor, fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: gridTextColor }}
              />
              <Radar
                name="Skill Level"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(30, 30, 30, 0.9)"
                      : "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "none",
                  color: theme === "dark" ? "white" : "black",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="bar" className="mt-0">
          <div className="text-center mb-4">
            <h3 className="text-xl font-medium mb-2">
              Skill Proficiency Levels
            </h3>
            <p className="text-muted-foreground text-sm">
              Comparing skill levels across technologies
            </p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={skills.sort((a, b) => b.level - a.level).slice(0, 15)}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: gridTextColor }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                tick={{ fill: gridTextColor, fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(30, 30, 30, 0.9)"
                      : "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "none",
                  color: theme === "dark" ? "white" : "black",
                }}
              />
              <Bar dataKey="level" radius={[0, 4, 4, 0]}>
                {skills.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color || getRandomColor(entry.name)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="pie" className="mt-0">
          <div className="text-center mb-4">
            <h3 className="text-xl font-medium mb-2">Skills by Category</h3>
            <p className="text-muted-foreground text-sm">
              Distribution of skills across different categories
            </p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(30, 30, 30, 0.9)"
                      : "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "none",
                  color: theme === "dark" ? "white" : "black",
                }}
                formatter={(value) => [`${value} skills`, "Count"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="network" className="mt-0">
          <div className="text-center mb-4">
            <h3 className="text-xl font-medium mb-2">Skill Network</h3>
            <p className="text-muted-foreground text-sm">
              Top skills represented as a network
            </p>
          </div>
          <div className="w-full h-[400px] flex items-center justify-center">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-3xl">
              {topSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  className="relative"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <motion.div
                    className="aspect-square rounded-full flex items-center justify-center p-2 text-center"
                    style={{
                      backgroundColor: `${
                        skill.color || getRandomColor(skill.name)
                      }40`,
                      border: `2px solid ${
                        skill.color || getRandomColor(skill.name)
                      }`,
                      boxShadow: `0 0 15px ${
                        skill.color || getRandomColor(skill.name)
                      }40`,
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div>
                      <div className="text-xs md:text-sm font-medium">
                        {skill.name}
                      </div>
                      <div className="text-xs opacity-80">{skill.level}%</div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

// Helper function to generate colors
function getRandomColor(seed: string): string {
  // Simple hash function for consistent colors
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Predefined nice colors for skills
  const colors = [
    "#4285F4", // Google Blue
    "#EA4335", // Google Red
    "#FBBC05", // Google Yellow
    "#34A853", // Google Green
    "#9C27B0", // Purple
    "#2196F3", // Blue
    "#00BCD4", // Cyan
    "#009688", // Teal
    "#4CAF50", // Green
    "#8BC34A", // Light Green
    "#CDDC39", // Lime
    "#FFC107", // Amber
    "#FF9800", // Orange
    "#FF5722", // Deep Orange
    "#795548", // Brown
  ];

  return colors[Math.abs(hash) % colors.length];
}

export default SkillVisualization;
