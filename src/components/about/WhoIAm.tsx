import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { TechStackItem } from "./aboutData";

interface WhoIAmProps {
  techStack: TechStackItem[];
  isInView: boolean;
}

const WhoIAm = ({ techStack, isInView }: WhoIAmProps) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
          }}
        >
          Who I Am
        </span>
      </h3>

      <div className="space-y-4 mb-6">
        <p className="text-sm sm:text-base opacity-80">
          I'm a passionate full-stack developer with a love for creating
          beautiful, functional, and user-friendly web applications. With over 6
          years of experience in the industry, I've worked on a wide range of
          projects from small business websites to large enterprise
          applications.
        </p>
        <p className="text-sm sm:text-base opacity-80">
          My approach combines technical expertise with creative
          problem-solving. I believe that great code should not only work
          flawlessly but also be maintainable, scalable, and accessible.
        </p>
        <p className="text-sm sm:text-base opacity-80">
          When I'm not coding, you can find me exploring new technologies,
          contributing to open-source projects, or sharing my knowledge through
          technical writing and mentoring.
        </p>
      </div>

      {/* Tech Stack Section */}
      <div className="tech-stack mt-6">
        <h4 className="text-lg font-semibold mb-4">Tech Stack</h4>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              className="px-3 py-1 rounded-full text-sm transition-all duration-300 cursor-pointer backdrop-blur-sm border"
              style={{
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: `${accentColors.primary}20`,
                borderColor: `${accentColors.primary}30`,
                color: accentColors.primary,
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {tech.name}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WhoIAm;
