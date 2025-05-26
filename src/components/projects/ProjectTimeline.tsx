import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Code, ExternalLink, Github, ChevronDown } from "lucide-react";
import { Project } from "./types";
import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";

interface ProjectTimelineProps {
  projects: Project[];
}

const ProjectTimeline = ({ projects }: ProjectTimelineProps) => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Group projects by year
  const projectsByYear = useMemo(() => {
    const grouped = projects.reduce((acc, project) => {
      const year = project.year || "2024";
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(project);
      return acc;
    }, {} as Record<string, Project[]>);

    // Sort years in descending order
    const sortedYears = Object.keys(grouped).sort(
      (a, b) => parseInt(b) - parseInt(a)
    );

    return sortedYears.map((year) => ({
      year,
      projects: grouped[year].sort((a, b) => a.title.localeCompare(b.title)),
    }));
  }, [projects]);

  const toggleProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
    triggerHapticFeedback();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-8 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: `${accentColors.primary}30` }}
        />

        {projectsByYear.map((yearGroup, yearIndex) => (
          <motion.div
            key={yearGroup.year}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: yearIndex * 0.1 }}
            className="relative mb-12"
          >
            {/* Year marker */}
            <div className="flex items-center mb-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center border-4 z-10"
                style={{
                  backgroundColor: isDark ? "#111827" : "#ffffff",
                  borderColor: accentColors.primary,
                  boxShadow: `0 0 20px ${accentColors.glow}`,
                }}
              >
                <Calendar size={24} style={{ color: accentColors.primary }} />
              </div>
              <div className="ml-6">
                <h2
                  className="text-3xl font-bold"
                  style={{ color: accentColors.primary }}
                >
                  {yearGroup.year}
                </h2>
                <p className="opacity-70">
                  {yearGroup.projects.length} project
                  {yearGroup.projects.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Projects for this year */}
            <div className="ml-24 space-y-6">
              {yearGroup.projects.map((project, projectIndex) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: yearIndex * 0.1 + projectIndex * 0.05 }}
                  className="relative"
                >
                  {/* Project connector */}
                  <div
                    className="absolute -left-20 top-6 w-12 h-0.5"
                    style={{ backgroundColor: `${accentColors.primary}30` }}
                  />
                  <div
                    className="absolute -left-20 top-5 w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColors.primary }}
                  />

                  {/* Project card */}
                  <motion.div
                    className="rounded-xl overflow-hidden border cursor-pointer"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(255,255,255,0.8)",
                      borderColor:
                        expandedProject === project.id
                          ? accentColors.primary
                          : isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                      boxShadow:
                        expandedProject === project.id
                          ? `0 8px 32px ${accentColors.shadow}`
                          : "none",
                    }}
                    onClick={() => toggleProject(project.id)}
                    whileHover={{
                      y: -2,
                      boxShadow: `0 8px 25px ${accentColors.shadow}`,
                    }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: `${accentColors.primary}20`,
                              }}
                            >
                              <Code
                                size={18}
                                style={{ color: accentColors.primary }}
                              />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">
                                {project.title}
                              </h3>
                              <p className="text-sm opacity-70">
                                {project.category}
                              </p>
                            </div>
                          </div>

                          <p className="opacity-80 mb-4">
                            {project.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.slice(0, 4).map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs rounded-full"
                                style={{
                                  backgroundColor: `${accentColors.primary}20`,
                                  color: accentColors.primary,
                                  border: `1px solid ${accentColors.primary}30`,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 4 && (
                              <span className="px-2 py-1 text-xs rounded-full opacity-70">
                                +{project.tags.length - 4} more
                              </span>
                            )}
                          </div>

                          {/* Status badge */}
                          {project.status && (
                            <div className="flex items-center gap-2 mb-4">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  project.status === "completed"
                                    ? "bg-green-500"
                                    : project.status === "in-progress"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                                }`}
                              />
                              <span className="text-sm opacity-70 capitalize">
                                {project.status.replace("-", " ")}
                              </span>
                            </div>
                          )}
                        </div>

                        <motion.div
                          animate={{
                            rotate: expandedProject === project.id ? 180 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown
                            size={20}
                            style={{ color: accentColors.primary }}
                          />
                        </motion.div>
                      </div>

                      {/* Quick actions */}
                      <div
                        className="flex gap-3 pt-4 border-t"
                        style={{
                          borderColor: isDark
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                        }}
                      >
                        <motion.a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                          style={{
                            backgroundColor: accentColors.primary,
                            color: "white",
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} />
                          View
                        </motion.a>

                        {project.github && (
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border"
                            style={{
                              backgroundColor: isDark
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.05)",
                              borderColor: isDark
                                ? "rgba(255,255,255,0.2)"
                                : "rgba(0,0,0,0.2)",
                            }}
                            whileHover={{
                              scale: 1.05,
                              backgroundColor: `${accentColors.primary}10`,
                              borderColor: accentColors.primary,
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github size={14} />
                            Code
                          </motion.a>
                        )}
                      </div>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {expandedProject === project.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-6 pb-6 border-t"
                            style={{
                              borderColor: isDark
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.1)",
                            }}
                          >
                            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Project image */}
                              <div className="relative h-48 rounded-lg overflow-hidden">
                                <img
                                  src={project.image}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                                <div
                                  className="absolute inset-0"
                                  style={{
                                    background:
                                      "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
                                  }}
                                />
                              </div>

                              {/* Additional details */}
                              <div className="space-y-4">
                                {project.features && (
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Key Features
                                    </h4>
                                    <ul className="list-disc list-inside opacity-80 space-y-1 text-sm">
                                      {project.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {project.technologies && (
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Technologies
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                      {project.technologies.map((tech, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-1 text-xs rounded-full"
                                          style={{
                                            backgroundColor: `${accentColors.primary}10`,
                                            color: accentColors.primary,
                                            border: `1px solid ${accentColors.primary}20`,
                                          }}
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {project.challenges && (
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Challenges
                                    </h4>
                                    <ul className="list-disc list-inside opacity-80 space-y-1 text-sm">
                                      {project.challenges.map(
                                        (challenge, i) => (
                                          <li key={i}>{challenge}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* All tags */}
                            <div
                              className="mt-6 pt-4 border-t"
                              style={{
                                borderColor: isDark
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.1)",
                              }}
                            >
                              <h4 className="font-semibold mb-3">
                                All Technologies
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 text-sm rounded-full"
                                    style={{
                                      backgroundColor: `${accentColors.primary}15`,
                                      color: accentColors.primary,
                                      border: `1px solid ${accentColors.primary}30`,
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTimeline;

