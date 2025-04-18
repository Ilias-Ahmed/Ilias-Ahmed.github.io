import React, { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Keyboard,
  Hand,
  Menu,
  Settings,
  Info,
  X,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerHapticFeedback } from "@/utils/haptics";

interface HelpProps {
  activeTab: "menu" | "keyboard" | "gesture" | "voice" | "settings" | "about";
  setActiveTab: React.Dispatch<
    React.SetStateAction<
      "menu" | "keyboard" | "gesture" | "voice" | "settings" | "about"
    >
  >;
  onBack: () => void;
  onClose: () => void;
}

const Help: React.FC<HelpProps> = ({
  activeTab,
  setActiveTab,
  onBack,
  onClose,
}) => {
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

  const accentColor = accentColors.purple;

  // Define help sections with their commands/shortcuts
  const helpSections = useMemo(
    () => ({
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
        { command: "Ctrl+K", description: "Open command palette" },
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

  // Get icon for tab
  const getTabIcon = useCallback((tab: string) => {
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
  }, []);

  return (
    <div className="text-white relative w-full max-w-2xl overflow-hidden">
      {/* Header with back button */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <button
          onClick={() => { onBack(); triggerHapticFeedback(); }}
          className="flex items-center text-white/70 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-lg font-medium">Portfolio Guide</h2>
        <button onClick={() => {
          onClose();
          triggerHapticFeedback();
        }
        }
          className="text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-white/10 overflow-x-auto">
        {(
          ["menu", "keyboard", "gesture", "voice", "settings", "about"] as const
        ).map((tab) => (
          <button
            key={tab}
            className={cn(
              "py-2 px-4 text-sm font-medium transition-colors flex items-center whitespace-nowrap",
              activeTab === tab ? "bg-white/10" : "hover:bg-white/5"
            )}
            style={{
              color: activeTab === tab ? accentColor : "white",
              borderBottom:
                activeTab === tab ? `2px solid ${accentColor}` : "none",
            }}
            onClick={() => {
              setActiveTab(tab)
              triggerHapticFeedback();
            }}
          >
            {getTabIcon(tab)}
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
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
                    className="font-medium text-white"
                    style={{ color: accentColor }}
                  >
                    {item.command}
                  </span>
                  <span className="text-gray-400">{item.description}</span>
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
            className="p-3 rounded-lg bg-gray-800 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: `${accentColor}30` }}
              >
                <Mic style={{ color: accentColor }} className="w-4 h-4" />
              </div>
              <div>
                <div className="text-white">Voice Recognition</div>
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
            {["1", "2", "3", "4", "5", "?", "T", "M", "Esc"].map((key) => (
              <motion.div
                key={key}
                className="p-2 rounded text-center bg-gray-800"
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
            ))}
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-white/10 text-center text-xs text-gray-400">
        Press{" "}
        <kbd
          className="px-2 py-1 rounded bg-opacity-20 mx-1"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          ?
        </kbd>{" "}
        anytime to show this help or{" "}
        <kbd
          className="px-2 py-1 rounded bg-opacity-20 mx-1"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          Ctrl+K
        </kbd>{" "}
        for the command palette
      </div>
    </div>
  );
};

export default Help;
