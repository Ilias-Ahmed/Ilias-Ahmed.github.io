import { useHeroStore } from "@/hooks/useHero";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const VoiceCommandsHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mode } = useHeroStore();

  // Colors based on mode
  const primaryColor = mode === "developer" ? "#3080ff" : "#ff3080";

  const commands = [
    { command: "Go to [page]", description: "Navigate to a specific page" },
    { command: "Show [page]", description: "Alternative way to navigate" },
    { command: "Start listening", description: "Enable voice commands" },
    { command: "Stop listening", description: "Disable voice commands" },
    { command: "What can I say", description: "Show available commands" },
  ];

  return (
    <div className="fixed right-4 bottom-4 z-40">
      <motion.button
        className="flex items-center justify-center w-12 h-12 rounded-full bg-black bg-opacity-80 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: primaryColor }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 bg-black bg-opacity-90 backdrop-blur-lg rounded-lg shadow-xl w-72 overflow-hidden"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
          >
            <div className="p-4">
              <h3 className="text-white font-bold text-lg mb-3">
                Voice Commands
              </h3>
              <ul className="space-y-3">
                {commands.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex flex-col"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span
                      className="font-medium"
                      style={{ color: primaryColor }}
                    >
                      {item.command}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {item.description}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-4 pt-3 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  Click the microphone icon to toggle voice recognition
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceCommandsHelp;
