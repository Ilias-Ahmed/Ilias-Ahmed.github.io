import { motion } from "framer-motion";
import { Skill } from "./types";

interface GridViewProps {
  skills: Skill[];
  setSelectedSkill: (skill: Skill | null) => void;
  setHoveredSkill: (skillId: string | null) => void;
  hoveredSkill: string | null;
  setViewMode: (mode: "grid" | "mastery" | "comparison") => void;
  setComparisonSkills: (skills: string[]) => void;
  viewMode: "grid" | "mastery" | "comparison";
}

const GridView = ({
  skills,
  setSelectedSkill,
  setHoveredSkill,
  hoveredSkill,
  setViewMode,
  setComparisonSkills,
  viewMode,
}: GridViewProps) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Skills & Expertise
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A comprehensive showcase of my technical skills and areas of
          expertise, highlighting proficiency levels and practical experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => {
          // Check if this skill is currently hovered
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
              className="relative group"
              onMouseEnter={() => setHoveredSkill(skill.id)}
              onMouseLeave={() => setHoveredSkill(null)}
              onClick={() => setSelectedSkill(skill)}
            >
              {/* Card Container */}
              <div
                className={`relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-6 h-full border transition-all duration-300 transform ${
                  isHovered
                    ? `border-${skill.color.replace(
                        "#",
                        ""
                      )} shadow-lg shadow-${skill.color}20 -translate-y-1`
                    : "border-gray-300 dark:border-gray-700 hover:border-purple-500 hover:-translate-y-1 hover:shadow-xl"
                }`}
              >
                {/* Background glow effect (enhanced when hovered) */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 dark:block hidden ${
                    isHovered
                      ? "opacity-30"
                      : "opacity-0 group-hover:opacity-20"
                  }`}
                  style={{
                    background: `radial-gradient(circle at center, ${skill.color}80 0%, transparent 70%)`,
                    filter: "blur(20px)",
                  }}
                />

                {/* Skill Icon and Title */}
                <div className="flex items-start mb-4">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-lg mr-4 text-2xl transition-all duration-300 ${
                      isHovered ? "scale-110" : ""
                    }`}
                    style={{
                      backgroundColor: `${skill.color}${
                        isHovered ? "30" : "20"
                      }`,
                      color: skill.color,
                    }}
                  >
                    {skill.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 dark:text-white">
                      {skill.name}
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {skill.category}
                    </span>
                  </div>
                </div>

                {/* Skill Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {skill.description}
                </p>

                {/* Proficiency Bar */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Proficiency</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
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
                        className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">
                        {skill.projects} Projects
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">
                        {skill.yearsExperience} Years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons (more visible on hover) */}
                <div
                  className={`absolute bottom-4 right-4 transition-all duration-300 flex space-x-2 ${
                    isHovered
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                  }`}
                >
                  {viewMode !== "comparison" && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-full text-white ${
                        isHovered ? "bg-purple-700" : "bg-purple-600"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode("comparison");
                        setComparisonSkills([skill.id]);
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
                      </svg>
                    </motion.button>
                  )}
                </div>

                {/* New: Highlight indicator for hovered skill */}
                {isHovered && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r"
                    style={{
                      backgroundImage: `linear-gradient(to right, transparent, ${skill.color}, transparent)`,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GridView;
