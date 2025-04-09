import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AugmentedRealityOverlayProps {
  isGlitching: boolean;
}

interface Target {
  x: number;
  y: number;
  size: number;
  type: "circle" | "square";
  analyzing: boolean;
  analyzed: boolean;
  data: {
    id: string;
    type: string;
    threat: string;
  };
}

const AugmentedRealityOverlay: React.FC<AugmentedRealityOverlayProps> = ({
  isGlitching,
}) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Generate random AR targeting elements
  useEffect(() => {
    const newTargets: Target[] = [];
    for (let i = 0; i < 5; i++) {
      newTargets.push({
        x: Math.random() * 80 + 10, // percentage
        y: Math.random() * 80 + 10, // percentage
        size: Math.random() * 60 + 40, // pixels
        type: Math.random() > 0.5 ? "circle" : "square",
        analyzing: false,
        analyzed: false,
        data: {
          id: `OBJ-${Math.floor(Math.random() * 1000)}`,
          type: ["Unknown", "Anomaly", "Error", "Artifact"][
            Math.floor(Math.random() * 4)
          ],
          threat: ["Low", "Medium", "High", "Unknown"][
            Math.floor(Math.random() * 4)
          ],
        },
      });
    }
    setTargets(newTargets);

    // Start analyzing targets one by one
    let delay = 1000;
    newTargets.forEach((_, index) => {
      const timeout1 = setTimeout(() => {
        setTargets((prev) => {
          if (!prev || prev.length === 0) return [];
          return prev.map((target, i) =>
            i === index ? { ...target, analyzing: true } : target
          );
        });

        // Complete analysis after a delay
        const timeout2 = setTimeout(() => {
          setTargets((prev) => {
            if (!prev || prev.length === 0) return [];
            return prev.map((target, i) =>
              i === index
                ? { ...target, analyzing: false, analyzed: true }
                : target
            );
          });
        }, 2000);

        timeoutsRef.current.push(timeout2);
      }, delay);

      timeoutsRef.current.push(timeout1);
      delay += 3000;
    });

    // Cleanup timeouts
    return () => {
      const timeouts = timeoutsRef.current;
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* AR HUD Elements */}
      <div className="absolute top-4 left-4 text-xs font-mono text-purple-400 opacity-70">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SYS://AUGMENTED_REALITY_v3.4
        </motion.div>
        <motion.div
          animate={{ opacity: isGlitching ? [1, 0, 1, 0, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          STATUS: {isGlitching ? "COMPROMISED" : "ACTIVE"}
        </motion.div>
      </div>

      {/* Targeting elements */}
      {targets.map((target, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            width: target.size,
            height: target.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: target.analyzed ? 0.8 : 0.4,
            scale: 1,
            rotate: target.type === "square" ? 45 : 0,
          }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
        >
          {/* Target shape */}
          <div
            className={`
              w-full h-full border border-purple-500
              ${target.type === "circle" ? "rounded-full" : ""}
              ${target.analyzing ? "border-yellow-400" : ""}
              ${target.analyzed ? "border-green-400" : ""}
            `}
          >
            {/* Scanning animation */}
            {target.analyzing && (
              <motion.div
                className="absolute inset-0 border border-yellow-400 rounded-full"
                animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>

          {/* Target data */}
          {target.analyzed && (
            <motion.div
              className="absolute -bottom-16 -right-4 bg-black/70 border border-green-500/30 p-1 text-xs font-mono text-green-400 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div>ID: {target.data.id}</div>
              <div>TYPE: {target.data.type}</div>
              <div>THREAT: {target.data.threat}</div>
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-16 h-16 border border-purple-500/50 rounded-full flex items-center justify-center"
          animate={{
            scale: isGlitching ? [1, 1.1, 0.9, 1] : [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-1 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AugmentedRealityOverlay;
