import React from "react";
import { motion } from "framer-motion";

interface CyberneticCountdownProps {
  count: number;
  isGlitching: boolean;
}

const CyberneticCountdown: React.FC<CyberneticCountdownProps> = ({
  count,
  isGlitching,
}) => {
  const digits = String(count || 0)
    .padStart(2, "0")
    .split("");

  return (
    <div className="flex items-center space-x-1">
      <div className="text-xs text-purple-400 uppercase tracking-widest mr-2">
        System Lockdown:
      </div>

      {digits.map((digit, index) => (
        <motion.div
          key={index}
          className="relative w-8 h-10 bg-black/50 border border-purple-500/50 rounded flex items-center justify-center overflow-hidden"
          animate={{
            borderColor: isGlitching
              ? [
                  "rgba(139, 92, 246, 0.5)",
                  "rgba(236, 72, 153, 0.5)",
                  "rgba(139, 92, 246, 0.5)",
                ]
              : "rgba(139, 92, 246, 0.5)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Digit */}
          <motion.div
            className="text-2xl font-mono text-purple-400 font-bold"
            key={`digit-${digit}-${index}`}
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {digit}
          </motion.div>

          {/* Scan line */}
          <motion.div
            className="absolute w-full h-1 bg-purple-500/30"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-purple-500" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-purple-500" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-purple-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-purple-500" />
        </motion.div>
      ))}

      <div className="text-xs text-purple-400 uppercase tracking-widest ml-2">
        sec
      </div>
    </div>
  );
};

export default CyberneticCountdown;
