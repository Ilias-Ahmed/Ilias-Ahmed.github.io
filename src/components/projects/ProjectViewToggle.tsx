import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ViewMode } from "./types";
import { Layers, Grid3X3, Clock } from "lucide-react";
import { triggerHapticFeedback } from "@/utils/haptics";

interface ProjectViewToggleProps {
  activeView: ViewMode;
  onChange: (view: ViewMode) => void;
}

const ProjectViewToggle = ({
  activeView,
  onChange,
}: ProjectViewToggleProps) => {
  const viewOptions = [
    {
      id: "showcase" as ViewMode,
      label: "Showcase",
      icon: <Layers size={16} />,
    },
    {
      id: "grid" as ViewMode,
      label: "Grid",
      icon: <Grid3X3 size={16} />,
    },
    {
      id: "timeline" as ViewMode,
      label: "Timeline",
      icon: <Clock size={16} />,
    },
  ];

  return (
    <div className="flex justify-center mt-10 mb-6">
      <div className="bg-secondary/30 backdrop-blur-sm p-1.5 rounded-full flex">
        {viewOptions.map((option) => (
          <Button
            key={option.id}
            variant="ghost"
            onClick={() => {
              onChange(option.id)
              triggerHapticFeedback();
            }}
            className={`relative px-6 py-2 rounded-full transition-all duration-300 ${
              activeView === option.id
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {option.icon}
              <span>{option.label}</span>
            </span>

            {activeView === option.id && (
              <motion.div
                layoutId="activeViewBubble"
                className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProjectViewToggle;
