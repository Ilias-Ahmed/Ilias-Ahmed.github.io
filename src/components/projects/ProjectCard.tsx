import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Info } from "lucide-react";
import { Project } from "./types";

interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
}

const ProjectCard = ({
  project,
  index,
  featured = false,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Mouse rotation effect
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);
  const brightness = useTransform(y, [-100, 0, 100], [1.1, 1, 0.9]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const resetMouse = () => {
    x.set(0);
    y.set(0);
  };

  // Card animations
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative h-full perspective-1000 ${
        featured ? "w-full" : "w-full"
      }`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        resetMouse();
      }}
    >
      <motion.div
        className="relative w-full h-full rounded-xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(78, 149, 255, 0.2)"
            : "0 10px 30px rgba(0, 0, 0, 0.3)",
          filter: `brightness(${brightness})`,
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* Background image with parallax effect */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${project.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transformStyle: "preserve-3d",
            transform: "translateZ(-20px)",
            scale: isHovered ? 1.05 : 1,
            transition: "scale 0.5s ease-out",
          }}
        />

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
          style={{
            opacity: isHovered ? 0.85 : 0.7,
            transformStyle: "preserve-3d",
            transform: "translateZ(-10px)",
          }}
        />

        {/* Card content */}
        <div className="relative h-full w-full p-6 flex flex-col justify-end">
          {/* Project tags */}
          <motion.div
            className="flex flex-wrap gap-2 mb-4"
            style={{
              transform: "translateZ(40px)",
              opacity: isHovered ? 1 : 0.7,
            }}
          >
            {project.tags.map((tag, i) => (
              <motion.span
                key={i}
                className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/90 backdrop-blur-sm"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(78, 149, 255, 0.2)",
                }}
                style={{
                  transform: `translateZ(${50 + i * 5}px)`,
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Project title */}
          <motion.h3
            className="text-2xl font-bold mb-2"
            style={{
              transform: "translateZ(60px)",
              color: isHovered ? "#4e95ff" : "white",
              textShadow: isHovered
                ? "0 0 15px rgba(78, 149, 255, 0.5)"
                : "none",
              transition: "color 0.3s ease, text-shadow 0.3s ease",
            }}
          >
            {project.title}
          </motion.h3>

          {/* Project description */}
          <motion.p
            className="text-sm text-gray-300 mb-6"
            style={{
              transform: "translateZ(40px)",
              opacity: isHovered ? 1 : 0.7,
            }}
          >
            {project.description}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            className="flex space-x-3"
            style={{
              transform: "translateZ(70px)",
              opacity: isHovered ? 1 : 0,
            }}
          >
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-primary text-white flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink size={14} />
              View Project
            </motion.a>

            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={16} />
              </motion.a>
            )}

            <motion.button
              onClick={() => setShowDetails(true)}
              className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Info size={16} />
            </motion.button>
          </motion.div>
        </div>
        {/* Floating particles effect */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/70"
                initial={{
                  x: Math.random() * 100 - 50 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  y: [null, Math.random() * -50 - 10 + "%"],
                  opacity: [0, 0.8, 0],
                  scale: [0, Math.random() * 2 + 1, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Project details modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              className="bg-secondary/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h2 className="absolute bottom-4 left-4 text-3xl font-bold text-white">
                  {project.title}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-primary/20 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                {project.description}
                <br />
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                facilisi. Maecenas euismod, nisi vel consectetur euismod, nisl
                nisi consectetur nisl, euismod nisl nisi vel consectetur. Nulla
                facilisi. Maecenas euismod, nisi vel consectetur euismod, nisl
                nisi consectetur nisl.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Responsive design across all devices</li>
                    <li>Interactive user interface with animations</li>
                    <li>Real-time data synchronization</li>
                    <li>Optimized performance and loading times</li>
                  </ul>
                </div>

                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Technical Details
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Frontend: React with TypeScript</li>
                    <li>Styling: Tailwind CSS</li>
                    <li>Animation: Framer Motion</li>
                    <li>Deployment: Vercel</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-primary text-white flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-gray-700 text-white flex items-center gap-2"
                    >
                      <Github size={16} />
                      Source Code
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectCard;
