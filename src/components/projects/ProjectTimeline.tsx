import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

// Define proper TypeScript interface
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  github?: string;
}

interface ProjectTimelineProps {
  projects: Project[];
}

/**
 * ProjectCard component to display individual project information
 */
const ProjectCard: React.FC<{
  project: Project;
  index: number;
}> = ({ project, index }) => {
  const { theme, accent } = useTheme();
  const isEven = index % 2 === 0;

  // Get accent color
  const accentColors: Record<string, string> = {
    purple: "#8B5CF6",
    blue: "#3B82F6",
    green: "#10B981",
    amber: "#F59E0B",
    pink: "#EC4899",
  };

  const accentColor = accentColors[accent] || accentColors.purple;

  // Animation variants
  const contentVariants = {
    hidden: {
      opacity: 0,
      x: isEven ? -20 : 20,
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.1 * i,
      },
    }),
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      x: isEven ? 20 : -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const dotVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  return (
    <div
      className={cn(
        "flex items-center mb-24",
        isEven ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Content */}
      <div className={cn("w-[45%]", isEven ? "pr-8 text-right" : "pl-8")}>
        <motion.h3
          className="text-2xl font-bold mb-3"
          style={{ color: accentColor }}
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
        >
          {project.title}
        </motion.h3>

        <motion.p
          className="text-gray-400 mb-4"
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
        >
          {project.description}
        </motion.p>

        <motion.div
          className={cn(
            "flex flex-wrap gap-2 mb-4",
            isEven ? "justify-end" : "justify-start"
          )}
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
        >
          {project.tags.map((tag, i) => (
            <span
              key={`${project.id}-tag-${i}`}
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div
          className={cn(
            "flex gap-3 items-center",
            isEven ? "justify-end" : "justify-start"
          )}
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={4}
        >
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-3 py-1 rounded-md transition-all duration-300"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor,
            }}
          >
            View Project
          </a>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium px-3 py-1 rounded-md transition-all duration-300"
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(30, 30, 30, 0.5)"
                    : "rgba(240, 240, 240, 0.5)",
                color: theme === "dark" ? "#fff" : "#333",
              }}
            >
              GitHub
            </a>
          )}
        </motion.div>
      </div>

      {/* Timeline dot */}
      <div className="relative flex items-center justify-center w-[10%]">
        <motion.div
          className="w-5 h-5 rounded-full z-10"
          style={{ backgroundColor: accentColor }}
          variants={dotVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />
        <motion.div
          className="absolute w-10 h-10 rounded-full z-0"
          style={{ backgroundColor: `${accentColor}30` }}
          variants={dotVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{
            delay: 0.1,
          }}
        />
      </div>

      {/* Image */}
      <div className="w-[45%] overflow-hidden rounded-lg">
        <motion.div
          className="relative h-64 overflow-hidden rounded-lg"
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${
                theme === "dark" ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)"
              } 0%, transparent 100%)`,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

/**
 * Main ProjectTimeline component
 */
const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Scroll animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress to timeline height
  const timelineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative py-10">
      {/* Timeline line background (static) */}
      <div
        className="absolute left-[50%] top-0 bottom-0 w-0.5"
        style={{
          backgroundColor:
            theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        }}
      />

      {/* Timeline line foreground (animated) */}
      <motion.div
        className="absolute left-[50%] top-0 w-0.5 origin-top"
        style={{
          height: timelineHeight,
          background: `linear-gradient(to bottom, ${accentColor}20, ${accentColor}, ${accentColor}20)`,
          boxShadow: `0 0 8px ${accentColor}40`,
        }}
      />

      {/* Project cards */}
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
};

export default ProjectTimeline;
