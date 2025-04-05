import { useProgress, Html } from "@react-three/drei";
import { useEffect, useState } from "react";

export function LoadingIndicator() {
  const { progress, active } = useProgress();
  const [showTip, setShowTip] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  // Loading tips
  const tips = [
    "Initializing 3D environment...",
    "Loading textures and materials...",
    "Preparing interactive elements...",
    "Calibrating physics engine...",
    "Setting up audio visualizer...",
    "Almost there! Finalizing scene...",
  ];

  // Show a random tip after a delay
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        setShowTip(true);

        // Cycle through tips every 3 seconds
        const interval = setInterval(() => {
          setTipIndex((prev) => (prev + 1) % tips.length);
        }, 3000);

        return () => {
          clearInterval(interval);
        };
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setShowTip(false);
    }
  }, [active]);

  if (!active) return null;

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 text-white text-sm font-medium">
          {Math.round(progress)}% loaded
        </div>

        {showTip && (
          <div className="mt-2 text-gray-400 text-xs max-w-xs text-center animate-pulse">
            {tips[tipIndex]}
          </div>
        )}
      </div>
    </Html>
  );
}
