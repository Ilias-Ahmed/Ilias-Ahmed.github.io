import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useHeroStore } from "@/hooks/useHero";
import { cn } from "@/lib/utils";

interface NavigationHelpProps {
  initialTab?: "voice" | "keyboard" | "gesture" | "menu";
}

const NavigationHelp = ({ initialTab = "menu" }: NavigationHelpProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "voice" | "keyboard" | "gesture" | "menu"
  >(initialTab);
  const { theme, accent } = useTheme();
  const { mode } = useHeroStore();
  const isDark = theme === "dark";

  // Get accent color
  const accentColors = useMemo(
    () => ({
      purple: "#8B5CF6",
      blue: "#3B82F6",
      green: "#10B981",
      amber: "#F59E0B",
      pink: "#EC4899",
    }),
    []
  );

  const accentColor =
    accentColors[accent as keyof typeof accentColors] || accentColors.purple;

  // Define navigation methods with their commands/shortcuts
  const navigationMethods = useMemo(
    () => ({
      voice: [
        { command: "Go to [page]", description: "Navigate to a specific page" },
        { command: "Show [page]", description: "Alternative way to navigate" },
        { command: "Start listening", description: "Enable voice commands" },
        { command: "Stop listening", description: "Disable voice commands" },
        { command: "What can I say", description: "Show available commands" },
      ],
      keyboard: [
        { command: "↑ / ↓", description: "Navigate to previous/next section" },
        { command: "Home / End", description: "Go to first/last section" },
        { command: "1-5", description: "Jump to specific section" },
        { command: "Esc", description: "Close modals or menus" },
        { command: "?", description: "Show this help dialog" },
      ],
      gesture: [
        {
          command: "Swipe left/right",
          description: "Navigate between sections",
        },
        { command: "Swipe up/down", description: "Scroll within section" },
        { command: "Tap navigation dots", description: "Jump to section" },
        { command: "Pinch", description: "Zoom in/out (where applicable)" },
        {
          command: "Long press",
          description: "Show context menu (where applicable)",
        },
      ],
      menu: [
        {
          command: "Navigation menu",
          description: "Click ☰ in top right corner",
        },
        {
          command: "Theme toggle",
          description: "Click sun/moon icon in top left",
        },
        {
          command: "Scroll to top",
          description: "Click ↑ button in bottom right",
        },
        {
          command: "Section indicators",
          description: "Click dots on right side",
        },
        {
          command: "Voice toggle",
          description: "Click microphone icon when available",
        },
      ],
    }),
    []
  );

  // Toggle help dialog
  const toggleHelp = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Add keyboard shortcut for help
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" || (e.key === "h" && e.ctrlKey)) {
        toggleHelp();
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleHelp]);

  return (
    <>
      {/* Help Button */}
      <motion.button
        className={cn(
          "fixed left-4 sm:left-20 bottom-4 z-40 w-10 h-10 rounded-full flex items-center justify-center",
          isDark ? "bg-gray-900/80" : "bg-white/80",
          "backdrop-blur-sm shadow-lg border"
        )}
        style={{
          borderColor: `${accentColor}40`,
          boxShadow: `0 0 15px ${accentColor}30`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleHelp}
        aria-label="Navigation help"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </motion.button>

      {/* Help Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Dialog Content */}
            <motion.div
              className={cn(
                "relative w-full max-w-lg rounded-lg shadow-xl overflow-hidden",
                "border border-opacity-30",
                isDark
                  ? "bg-gray-900/95 border-gray-700"
                  : "bg-white/95 border-gray-300"
              )}
              style={{ borderColor: `${accentColor}40` }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="p-4 border-b"
                style={{ borderColor: `${accentColor}30` }}
              >
                <h2
                  className={cn(
                    "text-xl font-bold flex items-center",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  <span style={{ color: accentColor }}>⌘</span>
                  <span className="ml-2">Navigation Guide</span>
                </h2>
                <p
                  className={cn(
                    "text-sm mt-1",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}
                >
                  Multiple ways to navigate through the portfolio
                </p>
              </div>

              {/* Tabs */}
              <div
                className="flex border-b"
                style={{ borderColor: `${accentColor}20` }}
              >
                {(["menu", "keyboard", "gesture", "voice"] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      className={cn(
                        "flex-1 py-2 px-4 text-sm font-medium transition-colors",
                        activeTab === tab
                          ? isDark
                            ? "bg-gray-800"
                            : "bg-gray-100"
                          : "hover:bg-opacity-10",
                        isDark ? "hover:bg-white/5" : "hover:bg-black/5"
                      )}
                      style={{
                        color:
                          activeTab === tab
                            ? accentColor
                            : isDark
                            ? "white"
                            : "black",
                        borderBottom:
                          activeTab === tab
                            ? `2px solid ${accentColor}`
                            : "none",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(tab);
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  )
                )}
              </div>

              {/* Tab Content */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ul className="space-y-3">
                      {navigationMethods[activeTab].map((item, index) => (
                        <motion.li
                          key={index}
                          className="flex flex-col"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <span
                            className={cn(
                              "font-medium",
                              isDark ? "text-gray-200" : "text-gray-800"
                            )}
                            style={{ color: accentColor }}
                          >
                            {item.command}
                          </span>
                          <span
                            className={
                              isDark ? "text-gray-400" : "text-gray-600"
                            }
                          >
                            {item.description}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div
                className={cn(
                  "p-3 border-t text-center text-xs",
                  isDark
                    ? "text-gray-400 border-gray-700"
                    : "text-gray-500 border-gray-300"
                )}
                style={{ borderColor: `${accentColor}30` }}
              >
                Press{" "}
                <kbd
                  className="px-2 py-1 rounded bg-opacity-20 mx-1"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  ?
                </kbd>{" "}
                anytime to show this help
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationHelp;
