import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { Project } from "./types";

interface ProjectGridProps {
  projects: Project[];
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {projects.map((project, index) => (
        <div key={project.id} className="h-[450px]">
          <ProjectCard project={project} index={index} />
        </div>
      ))}
    </motion.div>
  );
};

export default ProjectGrid;
