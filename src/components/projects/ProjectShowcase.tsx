import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, ExternalLink, Github } from "lucide-react";
import { Project } from "./types";
import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";

interface ProjectShowcaseProps {
  projects: Project[];
  autoplay?: boolean;
  showNavigation?: boolean;
}

const ProjectShowcase = ({
  projects,
  autoplay = true,
  showNavigation = true,
}: ProjectShowcaseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [direction, setDirection] = useState(0);
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mouse tracking for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const resetMouse = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && projects.length > 1) {
      intervalRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, projects.length]);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    triggerHapticFeedback();
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    triggerHapticFeedback();
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    triggerHapticFeedback();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    triggerHapticFeedback();
  };

  const currentProject = projects[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main showcase area */}
      <div
        className="relative h-[600px] rounded-2xl overflow-hidden perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetMouse}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.4 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                goToNext();
              } else if (swipe > swipeConfidenceThreshold) {
                goToPrevious();
              }
            }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Project background */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${currentProject.image})`,
                transform: "translateZ(-50px) scale(1.1)",
              }}
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)"
                  : "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
                transform: "translateZ(-25px)",
              }}
            />

            {/* Content */}
            <div className="relative h-full flex items-center justify-center p-8 md:p-12">
              <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Project info */}
                <motion.div
                  className="space-y-6"
                  style={{ transform: "translateZ(50px)" }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {/* Category badge */}
                  <motion.div
                    className="inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${accentColors.primary}20`,
                        color: accentColors.primary,
                        border: `1px solid ${accentColors.primary}40`,
                      }}
                    >
                      {currentProject.category || "Featured Project"}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {currentProject.title}
                  </h1>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                    {currentProject.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {currentProject.tags.slice(0, 6).map((tag, i) => (
                      <motion.span
                        key={i}
                        className="px-3 py-1 text-sm rounded-full text-white/80"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                        whileHover={{
                          backgroundColor: `${accentColors.primary}30`,
                          borderColor: accentColors.primary,
                          scale: 1.05,
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-4">
                    <motion.a
                      href={currentProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2"
                      style={{
                        backgroundColor: accentColors.primary,
                        boxShadow: `0 8px 25px ${accentColors.shadow}`,
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: `0 12px 35px ${accentColors.shadow}`,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink size={18} />
                      View Project
                    </motion.a>

                    {currentProject.github && (
                      <motion.a
                        href={currentProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 border text-white"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderColor: "rgba(255,255,255,0.3)",
                        }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(255,255,255,0.2)",
                          borderColor: "rgba(255,255,255,0.5)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github size={18} />
                        View Code
                      </motion.a>
                    )}
                  </div>
                </motion.div>

                {/* Project preview */}
                <motion.div
                  className="relative"
                  style={{ transform: "translateZ(30px)" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-2xl">
                    <img
                      src={currentProject.image}
                      alt={currentProject.title}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div
                      className="absolute inset-0 ring-2 ring-opacity-50 rounded-xl"
                      style={{ boxShadow: `0 0 0 2px ${accentColors.primary}80` }}
                    />
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 rounded-full"
                    style={{ backgroundColor: accentColors.primary }}
                    animate={{
                      y: [0, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full"
                    style={{ backgroundColor: `${accentColors.secondary}80` }}
                    animate={{
                      y: [0, 10, 0],
                      scale: [1, 0.9, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {showNavigation && projects.length > 1 && (
          <>
            <motion.button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: `${accentColors.primary}80`,
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} className="text-white" />
            </motion.button>

            <motion.button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: `${accentColors.primary}80`,
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} className="text-white" />
            </motion.button>
          </>
        )}

        {/* Play/Pause button */}
        {autoplay && projects.length > 1 && (
          <motion.button
            onClick={togglePlayPause}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            whileHover={{
              scale: 1.1,
              backgroundColor: `${accentColors.primary}80`,
            }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <Pause size={16} className="text-white" />
            ) : (
              <Play size={16} className="text-white ml-0.5" />
            )}
          </motion.button>
        )}
      </div>

      {/* Dots indicator */}
      {projects.length > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {projects.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  index === currentIndex
                    ? accentColors.primary
                    : isDark
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.3)",
              }}
              whileHover={{
                scale: 1.2,
                backgroundColor: accentColors.primary,
              }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {isPlaying && projects.length > 1 && (
        <div className="mt-4 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accentColors.primary }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            key={currentIndex}
          />
        </div>
      )}

      {/* Project counter */}
      <div className="absolute bottom-4 left-4 z-10">
        <div
          className="px-3 py-1 rounded-full text-sm font-medium text-white"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {currentIndex + 1} / {projects.length}
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;
