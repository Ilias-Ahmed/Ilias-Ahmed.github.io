import { motion } from "framer-motion";
import { Grid3X3, Layers, Clock } from "lucide-react";
import { ViewMode } from "./types";
import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";

interface ProjectViewToggleProps {
  activeView: ViewMode;
  onChange: (view: ViewMode) => void;
}

const ProjectViewToggle = ({
  activeView,
  onChange,
}: ProjectViewToggleProps) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const viewOptions = [
    {
      id: "showcase" as ViewMode,
      label: "Showcase",
      icon: <Layers size={18} />,
      description: "Featured project carousel",
    },
    {
      id: "grid" as ViewMode,
      label: "Grid",
      icon: <Grid3X3 size={18} />,
      description: "All projects in grid layout",
    },
    {
      id: "timeline" as ViewMode,
      label: "Timeline",
      icon: <Clock size={18} />,
      description: "Chronological project timeline",
    },
  ];

  return (
    <div className="flex justify-center mt-8 mb-12">
      <div
        className="inline-flex items-center p-1 rounded-xl border"
        style={{
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.8)",
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {viewOptions.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => {
              onChange(option.id);
              triggerHapticFeedback();
            }}
            className="relative px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2"
            style={{
              color:
                activeView === option.id
                  ? "white"
                  : isDark
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(0,0,0,0.7)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Active background */}
            {activeView === option.id && (
              <motion.div
                layoutId="activeViewBackground"
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
                  boxShadow: `0 4px 12px ${accentColors.shadow}`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
              {option.icon}
              <span>{option.label}</span>
            </span>

            {/* Tooltip */}
            <motion.div
              className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 pointer-events-none"
              style={{
                backgroundColor: isDark
                  ? "rgba(0,0,0,0.8)"
                  : "rgba(255,255,255,0.9)",
                color: isDark ? "white" : "black",
                border: `1px solid ${
                  isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                }`,
              }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {option.description}
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: "4px solid transparent",
                  borderRight: "4px solid transparent",
                  borderBottom: `4px solid ${
                    isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)"
                  }`,
                }}
              />
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ProjectViewToggle;
