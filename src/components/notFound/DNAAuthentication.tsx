import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface DNAAuthenticationProps {
  onComplete: () => void;
}

const DNAAuthentication: React.FC<DNAAuthenticationProps> = ({
  onComplete,
}) => {
  const [authenticating, setAuthenticating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [authenticated, setAuthenticated] = useState(false);
  const [dnaStrands, setDnaStrands] = useState<
    Array<{
      x: number;
      height: number;
      color: string;
      speed: number;
    }>
  >([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate DNA strands
  useEffect(() => {
    const strands = [];
    for (let i = 0; i < 20; i++) {
      strands.push({
        x: i * 10,
        height: Math.random() * 20 + 5,
        color: Math.random() > 0.5 ? "#8B5CF6" : "#EC4899",
        speed: Math.random() * 0.5 + 0.2,
      });
    }
    setDnaStrands(strands);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Authentication process
  useEffect(() => {
    if (!authenticating) return;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setAuthenticated(true);
          if (onComplete && typeof onComplete === "function") {
            onComplete();
          }
          return 100;
        }
        return next;
      });
    }, 30);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [authenticating, onComplete]);

  // Animate DNA strands
  useEffect(() => {
    if (!authenticating) return;

    const interval = setInterval(() => {
      setDnaStrands((prev) =>
        prev.map((strand) => ({
          ...strand,
          height: Math.random() * 20 + 5,
          color: Math.random() > 0.5 ? "#8B5CF6" : "#EC4899",
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, [authenticating]);

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <motion.div
        className="text-xs text-purple-400 uppercase tracking-widest mb-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {authenticated
          ? "DNA Verified"
          : authenticating
          ? "Analyzing DNA Sequence"
          : "DNA Authentication Required"}
      </motion.div>

      <motion.div
        className="w-48 h-16 border border-purple-500/50 rounded bg-black/30 overflow-hidden relative cursor-pointer"
        whileHover={{ scale: 1.05, borderColor: "rgba(139, 92, 246, 0.8)" }}
        onClick={() => !authenticating && setAuthenticating(true)}
      >
        {/* DNA visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-full items-center space-x-0.5">
            {dnaStrands.map((strand, index) => (
              <motion.div
                key={index}
                className="w-1 rounded-full"
                style={{
                  height: `${strand.height}px`,
                  backgroundColor: strand.color,
                }}
                animate={{
                  height: authenticating
                    ? [`${strand.height}px`, `${Math.random() * 20 + 5}px`]
                    : `${strand.height}px`,
                  backgroundColor:
                    authenticating && Math.random() > 0.7
                      ? ["#8B5CF6", "#EC4899", "#8B5CF6"]
                      : strand.color,
                }}
                transition={{
                  height: {
                    duration: strand.speed,
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                  backgroundColor: { duration: 0.3 },
                }}
              />
            ))}
          </div>
        </div>

        {/* Scanning effect */}
        {authenticating && (
          <motion.div
            className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
            initial={{ left: "-10%" }}
            animate={{ left: "110%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Authentication complete */}
        {authenticated && (
          <motion.div
            className="absolute inset-0 bg-green-500/10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-green-500 font-mono text-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              MATCH FOUND
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {authenticating && !authenticated && (
        <motion.div className="w-full mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default DNAAuthentication;
