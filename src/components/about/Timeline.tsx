import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
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
  const [activeTimelineItem, setActiveTimelineItem] = useState<number | null>(
    null
  );
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
          }}
        >
          Experience Timeline
        </span>
      </h3>
      <div
        className="relative pl-6 sm:pl-8 border-l"
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
        }}
      >
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
