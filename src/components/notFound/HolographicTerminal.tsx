import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface HolographicTerminalProps {
  pathAttempted: string;
  countdown: number;
}

const HolographicTerminal: React.FC<HolographicTerminalProps> = ({
  pathAttempted,
  countdown,
}) => {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate terminal output
    const lines = [
      { text: "> SYSTEM ERROR: Route not found", delay: 300 },
      {
        text: `> Attempted to access: ${pathAttempted || "unknown path"}`,
        delay: 800,
      },
      { text: "> Running diagnostics...", delay: 1500 },
      { text: "> ERROR CODE: 404", delay: 2000 },
      { text: "> CRITICAL: Neural pathway disconnected", delay: 2800 },
      {
        text: `> System status: T-${countdown || 0}s until lockdown`,
        delay: 3500,
      },
      { text: "> Manual navigation required", delay: 4200 },
    ];

    // Clear any existing timeouts to prevent memory leaks
    const timeouts: NodeJS.Timeout[] = [];

    lines.forEach((line) => {
      const timeout = setTimeout(() => {
        setTerminalLines((prev) => [...prev, line.text]);

        // Auto-scroll to bottom
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, line.delay);

      timeouts.push(timeout);
    });

    // Cleanup function to clear all timeouts
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [pathAttempted, countdown]);

  return (
    <motion.div
      className="bg-black/80 border border-purple-500/50 rounded-md p-4 font-mono text-sm text-green-400 max-h-48 overflow-y-auto w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      ref={terminalRef}
    >
      {terminalLines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={line.includes("ERROR") ? "text-red-400" : ""}
        >
          {line}
          {index === terminalLines.length - 1 && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              _
            </motion.span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default HolographicTerminal;
