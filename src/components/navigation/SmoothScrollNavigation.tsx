import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface SmoothScrollNavigationProps {
  sections: Array<{ id: string; route: string; label?: string }>;
  activeSection: string | null;
  onNavigate: (route: string) => void;
}

const SmoothScrollNavigation: React.FC<SmoothScrollNavigationProps> = ({
  sections,
  activeSection,
  onNavigate,
}) => {
  const { theme } = useTheme();

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40">
      <div
        className={cn(
          "flex flex-col items-center gap-4 p-2 rounded-full",
          theme === "dark"
            ? "bg-gray-900/30 backdrop-blur-sm"
            : "bg-white/30 backdrop-blur-sm"
        )}
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onNavigate(section.route)}
            className="relative w-3 h-3 rounded-full group"
            aria-label={`Navigate to ${section.label || section.id}`}
          >
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full",
                activeSection === section.id
                  ? "bg-primary"
                  : theme === "dark"
                  ? "bg-gray-400"
                  : "bg-gray-500"
              )}
              whileHover={{ scale: 1.5 }}
              animate={
                activeSection === section.id ? { scale: 1.2 } : { scale: 1 }
              }
            />

            {/* Label that appears on hover */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div
                className={cn(
                  "px-2 py-1 rounded whitespace-nowrap text-sm",
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800",
                  "shadow-md"
                )}
              >
                {section.label || section.id}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(SmoothScrollNavigation);


