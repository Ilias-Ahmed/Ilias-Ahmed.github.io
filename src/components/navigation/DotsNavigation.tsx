import React from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigation } from "@/contexts/NavigationContext";
import { triggerHapticFeedback } from "@/utils/haptics";

const DotsNavigation: React.FC = () => {
  const { activeSection, sections, navigateToSection } = useNavigation();

  // Handle keyboard navigation for dots
  const handleKeyNav = (e: React.KeyboardEvent, sectionId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigateToSection(sectionId);
    }
  };

  return (
    <TooltipProvider>
      <nav
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col items-center space-y-4"
        aria-label="Section navigation"
        role="navigation"
      >
        {sections.map((section) => (
          <Tooltip key={section.id}>
            <TooltipTrigger asChild>
              <motion.button
                className="interactive focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full p-1"
                onClick={() => {
                  navigateToSection(section.id)
                  triggerHapticFeedback();
                }}
                onKeyDown={(e) => handleKeyNav(e, section.id)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Navigate to ${section.name}`}
                aria-current={activeSection === section.id ? "page" : undefined}
                tabIndex={0}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-primary w-4 h-4"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{section.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </TooltipProvider>
  );
};

export default DotsNavigation;
