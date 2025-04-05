import { useHeroStore } from "@/hooks/useHero";
import { AnimatePresence, motion } from "framer-motion";

interface VoiceNavigationIndicatorProps {
  isListening: boolean;
  toggleListening: () => void;
  transcript: string;
  voiceSupported: boolean;
}

const VoiceNavigationIndicator = ({
  isListening,
  toggleListening,
  transcript,
  voiceSupported,
}: VoiceNavigationIndicatorProps) => {
  const { mode } = useHeroStore();

  // If voice is not supported, don't render anything
  if (!voiceSupported) return null;

  // Colors based on mode
  const primaryColor = mode === "coder" ? "#3080ff" : "#ff3080";

  return (
    <div className="fixed left-4 bottom-4 z-40">
      <motion.button
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-black bg-opacity-80 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleListening}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isListening
              ? [
                  `0 0 0 0px rgba(${
                    mode === "coder" ? "48, 128, 255" : "255, 48, 128"
                  }, 0)`,
                  `0 0 0 4px rgba(${
                    mode === "coder" ? "48, 128, 255" : "255, 48, 128"
                  }, 0.3)`,
                ]
              : `0 0 0 0px rgba(${
                  mode === "coder" ? "48, 128, 255" : "255, 48, 128"
                }, 0)`,
          }}
          transition={{
            repeat: isListening ? Infinity : 0,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isListening ? primaryColor : "white"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" x2="12" y1="19" y2="22"></line>
        </svg>
      </motion.button>

      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            className="absolute left-16 bottom-0 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg max-w-xs"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <p className="text-sm font-medium">I heard: "{transcript}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isListening && (
          <motion.div
            className="absolute top-0 left-0 right-0 bottom-0 rounded-full"
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1.2, 1],
              backgroundColor: [
                `rgba(${
                  mode === "coder" ? "48, 128, 255" : "255, 48, 128"
                }, 0.1)`,
                `rgba(${
                  mode === "coder" ? "48, 128, 255" : "255, 48, 128"
                }, 0.2)`,
                `rgba(${
                  mode === "coder" ? "48, 128, 255" : "255, 48, 128"
                }, 0.1)`,
              ],
            }}
            exit={{ scale: 0 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceNavigationIndicator;
