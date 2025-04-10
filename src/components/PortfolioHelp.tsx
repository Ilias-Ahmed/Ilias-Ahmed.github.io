import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useHeroStore } from "@/hooks/useHero";
import { cn } from "@/lib/utils";
import { HelpCircle, Mic, Keyboard, Hand, Menu, Settings, Info } from "lucide-react";
export interface PortfolioHelpProps {
  initialTab?: "voice" | "keyboard" | "gesture" | "menu" | "settings" | "about";
}
export interface PortfolioHelpProps {
  isVisible: boolean;
  onClose: () => void;
}

const PortfolioHelp = ({ initialTab = "menu" }: PortfolioHelpProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "voice" | "keyboard" | "gesture" | "menu" | "settings" | "about"
  >(initialTab);
  const { theme, accent } = useTheme();
  const { mode, incrementInteraction } = useHeroStore();
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
  const helpSections = useMemo(
    () => ({
      voice: [
        { command: "Go to [page]", description: "Navigate to a specific page" },
        { command: "Show [page]", description: "Alternative way to navigate" },
        { command: "Start listening", description: "Enable voice commands" },
        { command: "Stop listening", description: "Disable voice commands" },
        { command: "What can I say", description: "Show available commands" },
        {
          command: "Toggle theme",
          description: "Switch between light and dark mode",
        },
        {
          command: "Change accent to [color]",
          description: "Change the accent color",
        },
      ],
      keyboard: [
        { command: "↑ / ↓", description: "Navigate to previous/next section" },
        { command: "← / →", description: "Alternative navigation" },
        { command: "Home / End", description: "Go to first/last section" },
        { command: "1-5", description: "Jump to specific section" },
        { command: "Esc", description: "Close modals or menus" },
        { command: "?", description: "Show this help dialog" },
        { command: "T", description: "Toggle theme (light/dark)" },
        { command: "M", description: "Toggle menu" },
        { command: "V", description: "Toggle voice recognition" },
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
        {
          command: "Double tap",
          description: "Activate primary action",
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
        {
          command: "Bottom navigation",
          description: "Quick access to all sections",
        },
      ],
      settings: [
        {
          command: "Mode selection",
          description: "Choose between Developer, Designer, or Creative modes",
        },
        {
          command: "Time of day",
          description: "Change the lighting in 3D scenes",
        },
        {
          command: "Camera auto-rotate",
          description: "Toggle automatic camera movement",
        },
        {
          command: "Particles",
          description: "Toggle particle effects for visual enhancement",
        },
        {
          command: "Post processing",
          description: "Toggle advanced visual effects",
        },
        {
          command: "Performance mode",
          description: "Adjust for better performance on slower devices",
        },
      ],
      about: [
        {
          command: "Portfolio",
          description: "A showcase of my work and skills as a developer",
        },
        {
          command: "Technologies",
          description:
            "Built with React, TypeScript, Framer Motion, and Three.js",
        },
        {
          command: "Accessibility",
          description:
            "Designed to be accessible with keyboard and voice navigation",
        },
        {
          command: "Responsive",
          description: "Optimized for all devices from mobile to desktop",
        },
        {
          command: "Open Source",
          description: "Code available on GitHub",
        },
      ],
    }),
    []
  );

  // Toggle help dialog
  const toggleHelp = useCallback(() => {
    setIsOpen((prev) => !prev);
    incrementInteraction();
  }, [incrementInteraction]);

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

  // Get icon for tab
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "voice":
        return <Mic className="w-4 h-4 mr-2" />;
      case "keyboard":
        return <Keyboard className="w-4 h-4 mr-2" />;
      case "gesture":
        return <Hand className="w-4 h-4 mr-2" />;
      case "menu":
        return <Menu className="w-4 h-4 mr-2" />;
      case "settings":
        return <Settings className="w-4 h-4 mr-2" />;
      case "about":
        return <Info className="w-4 h-4 mr-2" />;
      default:
        return <HelpCircle className="w-4 h-4 mr-2" />;
    }
  };

  // Determine if we should add creative effects based on mode
  const isCreativeMode = mode === "creative";

  return (
    <>
      {/* Help Button */}
      <motion.button
        className={cn(
          "fixed left-20 bottom-4 z-40 w-12 h-12 rounded-full flex items-center justify-center",
          isDark ? "bg-gray-900/80" : "bg-white/80",
          "backdrop-blur-sm shadow-lg border"
        )}
        style={{
          borderColor: `${accentColor}40`,
          boxShadow: `0 0 15px ${accentColor}30`,
        }}
        whileHover={{
          scale: 1.1,
          boxShadow: `0 0 20px ${accentColor}50`,
        }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleHelp}
        aria-label="Portfolio help"
        data-cursor-hover="true"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "close" : "help"}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
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
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pulse effect for creative mode */}
        {isCreativeMode && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 0 0 ${accentColor}00`,
                `0 0 0 4px ${accentColor}30`,
                `0 0 0 8px ${accentColor}00`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        )}
      </motion.button>

      {/* Help Dialog */}
      <AnimatePresence mode="wait">
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
                "relative w-full max-w-2xl rounded-lg shadow-xl overflow-hidden",
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
                  <span className="ml-2">Portfolio Guide</span>
                </h2>
                <p
                  className={cn(
                    "text-sm mt-1",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}
                >
                  Everything you need to know to navigate and interact with this
                  portfolio
                </p>
              </div>

              {/* Tabs */}
              <div
                className="flex flex-wrap border-b"
                style={{ borderColor: `${accentColor}20` }}
              >
                {(
                  [
                    "menu",
                    "keyboard",
                    "gesture",
                    "voice",
                    "settings",
                    "about",
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab}
                    className={cn(
                      "py-2 px-4 text-sm font-medium transition-colors flex items-center",
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
                        activeTab === tab ? `2px solid ${accentColor}` : "none",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab(tab);
                    }}
                  >
                    {getTabIcon(tab)}
                    <span className="hidden sm:inline">
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </span>
                  </button>
                ))}
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
                      {helpSections[activeTab].map((item, index) => (
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

              {/* Interactive elements based on active tab */}
              {activeTab === "voice" && (
                <div className="px-4 pb-4">
                  <motion.div
                    className={`p-3 rounded-lg ${
                      isDark ? "bg-gray-800" : "bg-gray-100"
                    } flex items-center justify-between`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3`}
                        style={{ backgroundColor: `${accentColor}30` }}
                      >
                        <Mic
                          style={{ color: accentColor }}
                          className="w-4 h-4"
                        />
                      </div>
                      <div>
                        <div
                          className={isDark ? "text-white" : "text-gray-900"}
                        >
                          Voice Recognition
                        </div>
                        <div className="text-xs text-gray-500">
                          Say "Start listening" to activate
                        </div>
                      </div>
                    </div>
                    <motion.div
                      className="text-xs font-mono px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentColor,
                      }}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      TRY IT
                    </motion.div>
                  </motion.div>
                </div>
              )}

              {activeTab === "keyboard" && (
                <div className="px-4 pb-4">
                  <motion.div
                    className="grid grid-cols-3 gap-2 mt-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {["1", "2", "3", "4", "5", "?", "T", "M", "Esc"].map(
                      (key) => (
                        <motion.div
                          key={key}
                          className={`p-2 rounded text-center ${
                            isDark ? "bg-gray-800" : "bg-gray-100"
                          }`}
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: `${accentColor}20`,
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <kbd
                            className="px-2 py-1 text-sm font-mono rounded"
                            style={{
                              backgroundColor: `${accentColor}20`,
                              color: accentColor,
                            }}
                          >
                            {key}
                          </kbd>
                        </motion.div>
                      )
                    )}
                  </motion.div>
                </div>
              )}

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

              {/* Creative mode decorative elements */}
              {isCreativeMode && (
                <>
                  <motion.div
                    className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 w-40 h-40 opacity-10 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 2,
                    }}
                  />
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PortfolioHelp;

