import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { Project } from "./types";

interface ProjectShowcaseProps {
  projects: Project[];
}

const ProjectShowcase = ({ projects }: ProjectShowcaseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Auto-rotate carousel
  useEffect(() => {
    const startTimeout = () => {
      timeoutRef.current = setTimeout(() => {
        goToNext();
      }, 6000);
    };

    startTimeout();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        type: "spring",
        bounce: 0.2,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.8,
      },
    }),
  };

  // Get adjacent projects for 3D effect
  const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;

  return (
    <div className="relative h-[600px] mb-16">
      <div className="absolute inset-x-0 top-1/2 flex justify-between items-center z-20 px-4 md:px-10">
        <motion.button
          onClick={goToPrev}
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.5)" }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={24} />
        </motion.button>

        <motion.button
          onClick={goToNext}
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.5)" }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      <div className="relative h-full flex items-center justify-center">
        {/* Previous project (smaller, to the left) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-0 opacity-40 scale-75 transform -translate-x-1/4 blur-[1px]">
          <ProjectCard project={projects[prevIndex]} index={prevIndex} />
        </div>

        {/* Next project (smaller, to the right) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-0 opacity-40 scale-75 transform translate-x-1/4 blur-[1px]">
          <ProjectCard project={projects[nextIndex]} index={nextIndex} />
        </div>

        {/* Current project (center, full size) */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute w-full max-w-2xl z-10"
          >
            <ProjectCard
              project={projects[currentIndex]}
              index={currentIndex}
              featured
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {projects.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-primary" : "bg-white/30"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectShowcase;
