import { useState } from "react";
import { motion } from "framer-motion";
import TimelineItem from "./TimelineItem";
export interface TimelineData {
  year: string;
  title: string;
  company: string;
  description: string;
  achievements: string[];
  technologies: string[];
}
interface TimelineProps {
  timelineData: TimelineData[];
  isInView: boolean;
}
const Timeline = ({ timelineData, isInView }: TimelineProps) => {
  const [activeTimelineItem, setActiveTimelineItem] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Experience Timeline</h3>
      <div className="relative pl-6 sm:pl-8 border-l border-gray-700">
        {timelineData.map((item, index) => (
          <TimelineItem
            key={index}
            {...item}
            index={index}
            activeTimelineItem={activeTimelineItem}
            setActiveTimelineItem={setActiveTimelineItem}
            isInView={isInView}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Timeline;
