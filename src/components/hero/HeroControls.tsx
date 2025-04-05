import { useHeroStore } from "@/hooks/useHero";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

export function HeroControls() {
  const {
    mode,
    timeOfDay,
    setMode,
    setTimeOfDay,
    performanceMode,
    setPerformanceMode,
    enableParticles,
    toggleParticles,
    enablePostProcessing,
    togglePostProcessing,
    cameraAutoRotate,
    toggleCameraAutoRotate,
    resetCamera,
  } = useHeroStore();

  const { theme, accent, setAccent } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);

  // Magnetic button effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate magnetic pull for each button
  const getMagneticStyle = useCallback(
    (buttonId: string) => {
      const button = document.getElementById(buttonId);
      if (!button) return {};

      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const distanceX = mousePos.x - buttonCenterX;
      const distanceY = mousePos.y - buttonCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // Only apply magnetic effect when cursor is close
      if (distance < 100) {
        const pull = 20 * (1 - distance / 100);
        const pullX = (distanceX / distance) * pull;
        const pullY = (distanceY / distance) * pull;

        return {
          transform: `translate(${pullX}px, ${pullY}px)`,
        };
      }

      return {};
    },
    [mousePos]
  );

  // Get accent color
  const getAccentColor = useCallback(() => {
    const accentColors: Record<string, string> = {
      purple: "#8B5CF6",
      blue: "#3B82F6",
      green: "#10B981",
      amber: "#F59E0B",
      pink: "#EC4899",
    };
    return accentColors[accent] || accentColors.purple;
  }, [accent]);

  return (
    <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-10">
      {/* Mode toggle */}
      <motion.div
        id="mode-toggle"
        className={`px-4 py-2 rounded-full cursor-pointer text-white font-medium ${
          mode === "developer"
            ? "bg-blue-600"
            : mode === "designer"
            ? "bg-pink-600"
            : "bg-purple-600"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          // Cycle through modes
          if (mode === "developer") setMode("designer");
          else if (mode === "designer") setMode("creative");
          else setMode("developer");
        }}
        style={getMagneticStyle("mode-toggle")}
      >
        {mode === "developer"
          ? "Switch to Designer"
          : mode === "designer"
          ? "Switch to Creative"
          : "Switch to Developer"}
      </motion.div>

      {/* Time of day controls */}
      <div className="flex gap-2">
        {(["morning", "day", "evening", "night"] as const).map((time) => (
          <motion.div
            key={time}
            id={`time-${time}`}
            className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center ${
              timeOfDay === time ? "ring-2 ring-white" : ""
            }`}
            style={{
              ...getMagneticStyle(`time-${time}`),
              backgroundColor:
                time === "morning"
                  ? "#ffd6aa"
                  : time === "day"
                  ? "#87ceeb"
                  : time === "evening"
                  ? "#ff7e33"
                  : "#050520",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTimeOfDay(time)}
          />
        ))}
      </div>

      {/* Advanced controls toggle */}
      <motion.div
        id="advanced-toggle"
        className="px-4 py-2 rounded-full cursor-pointer text-white font-medium bg-gray-700 flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAdvancedControls(!showAdvancedControls)}
        style={getMagneticStyle("advanced-toggle")}
      >
        <span className="mr-2">
          {showAdvancedControls ? "Hide" : "Show"} Advanced
        </span>
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
          className={`transition-transform ${
            showAdvancedControls ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </motion.div>

      {/* Advanced controls */}
      {showAdvancedControls && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-xl p-4 space-y-4"
        >
          {/* Performance mode */}
          <div>
            <p className="text-white text-sm mb-2">Performance Mode</p>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((level) => (
                <motion.button
                  key={level}
                  className={`px-3 py-1 rounded-md text-sm ${
                    performanceMode === level
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPerformanceMode(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Visual effects toggles */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              className={`px-3 py-1 rounded-md text-sm ${
                enableParticles
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleParticles}
            >
              {enableParticles ? "Disable" : "Enable"} Particles
            </motion.button>

            <motion.button
              className={`px-3 py-1 rounded-md text-sm ${
                enablePostProcessing
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePostProcessing}
            >
              {enablePostProcessing ? "Disable" : "Enable"} Effects
            </motion.button>

            <motion.button
              className={`px-3 py-1 rounded-md text-sm ${
                cameraAutoRotate
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCameraAutoRotate}
            >
              {cameraAutoRotate ? "Disable" : "Enable"} Auto-Rotate
            </motion.button>

            <motion.button
              className="px-3 py-1 rounded-md text-sm bg-gray-700 text-gray-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetCamera}
            >
              Reset Camera
            </motion.button>
          </div>

          {/* Theme accent color */}
          <div>
            <p className="text-white text-sm mb-2">Accent Color</p>
            <div className="flex gap-2">
              {(["purple", "blue", "green", "amber", "pink"] as const).map(
                (color) => (
                  <motion.div
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer ${
                      accent === color ? "ring-2 ring-white" : ""
                    }`}
                    style={{
                      backgroundColor:
                        color === "purple"
                          ? "#8B5CF6"
                          : color === "blue"
                          ? "#3B82F6"
                          : color === "green"
                          ? "#10B981"
                          : color === "amber"
                          ? "#F59E0B"
                          : "#EC4899",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAccent(color)}
                  />
                )
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
