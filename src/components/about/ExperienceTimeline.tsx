import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { timelineData } from "./aboutData";

interface ExperienceTimelineProps {
  timelineData: typeof timelineData;
}
const ExperienceTimeline = ({ timelineData }: ExperienceTimelineProps) => {
  const [activeItem, setActiveItem] = useState<number | null>(0);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-12 gap-8">
        {/* Timeline Navigation */}
        <div className="md:col-span-4">
          <div className="sticky top-24 space-y-1">
            <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              My Journey
            </h3>

            {timelineData.map((item, index) => (
              <motion.button
                key={index}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  activeItem === index
                    ? "bg-primary/20 border-l-4 border-primary"
                    : "bg-secondary/30 hover:bg-secondary/50"
                }`}
                onClick={() => setActiveItem(index)}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`font-medium ${
                      activeItem === index ? "text-primary" : "text-gray-300"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {item.year}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{item.company}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            {timelineData.map(
              (item, index) =>
                activeItem === index && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-secondary/30 backdrop-blur-sm rounded-xl p-6 border border-white/5"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-white">
                          {item.title}
                        </h4>
                        <p className="text-primary">{item.company}</p>
                      </div>
                      <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary">
                        {item.year}
                      </span>
                    </div>

                    <p className="text-gray-300 mb-6">{item.description}</p>

                    <div className="mb-6">
                      <h5 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>Key Achievements</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.achievements.map((achievement, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-2 bg-white/5 p-3 rounded-lg"
                          >
                            <span className="text-primary mt-0.5">•</span>
                            <span className="text-sm text-gray-300">
                              {achievement}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <span className="text-primary">⚙️</span>
                        <span>Technologies Used</span>
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ExperienceTimeline;
