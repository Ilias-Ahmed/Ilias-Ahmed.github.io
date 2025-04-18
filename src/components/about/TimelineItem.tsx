import { triggerHapticFeedback } from "@/utils/haptics";
import { motion, AnimatePresence } from "framer-motion";
export interface TimelineItemProps {
  year: string;
  title: string;
  company: string;
  description: string;
  achievements: string[];
  technologies: string[];
  index: number;
  activeTimelineItem: number | null;
  setActiveTimelineItem: (index: number | null) => void;
  isInView: boolean;
}
const TimelineItem = ({
  year,
  title,
  company,
  description,
  achievements,
  technologies,
  index,
  activeTimelineItem,
  setActiveTimelineItem,
  isInView
}: TimelineItemProps) => {
  return (
    <motion.div
      key={index}
      className="mb-8 sm:mb-10 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
    >
      {/* Animated Node */}
      <motion.div
        className={`absolute -left-4 sm:-left-8 w-3 sm:w-4 h-3 sm:h-4 rounded-full ${
          activeTimelineItem === index ? "bg-primary scale-125" : "bg-primary"
        } z-10`}
        whileHover={{ scale: 1.5 }}
        animate={{
          boxShadow: activeTimelineItem === index
            ? [
              "0 0 0 0 rgba(156, 81, 255, 0.4)",
              "0 0 0 10px rgba(156, 81, 255, 0)",
            ]
            : "none"
        }}
        transition={{
          duration: 1.5,
          repeat: activeTimelineItem === index ? Infinity : 0,
          repeatType: "loop"
        }}
      />

      {/* Small Connecting Line */}
      <div className="absolute -left-4 sm:-left-8 top-4 w-6 sm:w-8 h-0.5 bg-gray-700" />

      <motion.div
        className="bg-secondary p-4 sm:p-5 rounded-lg glass-effect"
        whileHover={{
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
        }}
        onClick={() => { setActiveTimelineItem(activeTimelineItem === index ? null : index); triggerHapticFeedback(); }}
      >
        <span className="inline-block px-2 sm:px-3 py-1 text-xs rounded-full bg-primary/20 text-primary mb-2">
          {year}
        </span>
        <h4 className="text-base sm:text-lg font-medium">{title}</h4>
        <p className="text-primary/80 text-sm sm:text-base">{company}</p>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">{description}</p>

        {/* Expandable Content */}
        <AnimatePresence>
          {activeTimelineItem === index && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                <h5 className="text-sm font-medium mb-2">Key Achievements</h5>
                <ul className="list-disc list-inside text-gray-400 text-xs sm:text-sm space-y-1">
                  {achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {achievement}
                    </motion.li>
                  ))}
                </ul>

                <h5 className="text-sm font-medium mt-3 sm:mt-4 mb-2">Technologies Used</h5>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {technologies.map((tech, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default TimelineItem;
