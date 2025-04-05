import ProjectGrid from "@/components/projects/ProjectGrid";
import { projectsData } from "@/components/projects/projectsData";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import ProjectStats from "@/components/projects/ProjectStats";
import ProjectTimeline from "@/components/projects/ProjectTimeline";
import ProjectViewToggle from "@/components/projects/ProjectViewToggle";
import { ViewMode } from "@/components/projects/types";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [viewMode, setViewMode] = useState<ViewMode>("showcase");

  return (
    <div
      className="py-10 px-6 relative overflow-hidden"
      id="projects"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Explore my projects that showcase my passion for creating beautiful,
            functional, and user-centered digital experiences.
          </p>

          <ProjectViewToggle activeView={viewMode} onChange={setViewMode} />
        </motion.div>

        {viewMode === "showcase" && <ProjectShowcase projects={projectsData} />}
        {viewMode === "grid" && <ProjectGrid projects={projectsData} />}
        {viewMode === "timeline" && <ProjectTimeline projects={projectsData} />}

        <ProjectStats />
      </div>
    </div>
  );
};

export default ProjectsSection;
