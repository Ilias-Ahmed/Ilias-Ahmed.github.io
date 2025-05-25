import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Monitor,
  Zap,
  Volume2,
  VolumeX,
  Palette,
  RotateCcw,
  ChevronUp
} from 'lucide-react';
import { useBackground, BackgroundMode, IntensityLevel, PerformanceMode } from '@/contexts/BackgroundContext';
import { useTheme } from '@/contexts/ThemeContext';

interface BackgroundSettingsProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({
  className = "",
  position = "top-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "mode" | "performance" | "effects"
  >("mode");

  const { config, updateConfig, resetToDefaults, isPerformanceMode } =
    useBackground();

  const { isDark } = useTheme();

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  const backgroundModes: {
    value: BackgroundMode;
    label: string;
    description: string;
  }[] = [
    {
      value: "adaptive",
      label: "Adaptive",
      description: "Changes based on section",
    },
    {
      value: "particles",
      label: "Particles",
      description: "Floating particle system",
    },
    {
      value: "neural",
      label: "Neural",
      description: "Connected network nodes",
    },
    {
      value: "hologram",
      label: "Hologram",
      description: "Grid-based holographic effect",
    },
    { value: "matrix", label: "Matrix", description: "Digital rain effect" },
    {
      value: "minimal",
      label: "Minimal",
      description: "Subtle gradient background",
    },
  ];

  const intensityLevels: {
    value: IntensityLevel;
    label: string;
    description: string;
  }[] = [
    {
      value: "low",
      label: "Low",
      description: "Minimal effects for performance",
    },
    {
      value: "medium",
      label: "Medium",
      description: "Balanced visual quality",
    },
    { value: "high", label: "High", description: "Maximum visual effects" },
  ];

  const performanceModes: {
    value: PerformanceMode;
    label: string;
    description: string;
  }[] = [
    { value: "auto", label: "Auto", description: "Automatically optimize" },
    { value: "high", label: "High", description: "Prioritize visual quality" },
    { value: "low", label: "Low", description: "Prioritize performance" },
  ];

  const handleModeChange = (mode: BackgroundMode) => {
    updateConfig({ mode });
  };

  const handleIntensityChange = (intensity: IntensityLevel) => {
    updateConfig({ intensity });
  };

  const handlePerformanceModeChange = (performanceMode: PerformanceMode) => {
    updateConfig({ performanceMode });
  };

  const handleToggleFeature = (feature: keyof typeof config) => {
    updateConfig({ [feature]: !config[feature] });
  };

  const handleSliderChange = (key: keyof typeof config, value: number) => {
    updateConfig({ [key]: value });
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Settings Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ${
          isDark
            ? "bg-gray-900/80 border-gray-700 hover:bg-gray-800/80"
            : "bg-white/80 border-gray-200 hover:bg-white/90"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Background Settings"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Settings className="w-5 h-5" />
        </motion.div>

        {/* Performance indicator */}
        {isPerformanceMode && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
        )}
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: position.includes("top") ? 10 : -10,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: position.includes("top") ? 10 : -10,
            }}
            transition={{ duration: 0.2 }}
            className={`absolute ${
              position.includes("top") ? "top-14" : "bottom-14"
            } ${
              position.includes("right") ? "right-0" : "left-0"
            } w-80 backdrop-blur-md rounded-lg border shadow-xl ${
              isDark
                ? "bg-gray-900/95 border-gray-700"
                : "bg-white/95 border-gray-200"
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Background Settings</h3>
                <button
                  onClick={resetToDefaults}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex mt-3 space-x-1">
                {[
                  { id: "mode", label: "Mode", icon: Palette },
                  { id: "performance", label: "Performance", icon: Zap },
                  { id: "effects", label: "Effects", icon: Monitor },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as typeof activeTab)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm transition-colors ${
                      activeTab === id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {/* Mode Tab */}
              {activeTab === "mode" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Background Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {backgroundModes.map((mode) => (
                        <button
                          key={mode.value}
                          onClick={() => handleModeChange(mode.value)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            config.mode === mode.value
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                          }`}
                        >
                          <div className="font-medium text-sm">
                            {mode.label}
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            {mode.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Intensity Level
                    </label>
                    <div className="space-y-2">
                      {intensityLevels.map((level) => (
                        <button
                          key={level.value}
                          onClick={() => handleIntensityChange(level.value)}
                          className={`w-full p-2 rounded border text-left transition-all ${
                            config.intensity === level.value
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">
                              {level.label}
                            </span>
                            <span className="text-xs opacity-70">
                              {level.description}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === "performance" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Performance Mode
                    </label>
                    <div className="space-y-2">
                      {performanceModes.map((mode) => (
                        <button
                          key={mode.value}
                          onClick={() =>
                            handlePerformanceModeChange(mode.value)
                          }
                          className={`w-full p-2 rounded border text-left transition-all ${
                            config.performanceMode === mode.value
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">
                              {mode.label}
                            </span>
                            <span className="text-xs opacity-70">
                              {mode.description}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {isPerformanceMode && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Performance Mode Active
                        </span>
                      </div>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Settings have been automatically optimized for better
                        performance.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Particle Count: {config.particleCount}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={config.particleCount}
                      onChange={(e) =>
                        handleSliderChange(
                          "particleCount",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs opacity-70 mt-1">
                      <span>10</span>
                      <span>200</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Animation Speed: {config.animationSpeed.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={config.animationSpeed}
                      onChange={(e) =>
                        handleSliderChange(
                          "animationSpeed",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs opacity-70 mt-1">
                      <span>0.1x</span>
                      <span>3.0x</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Effects Tab */}
              {activeTab === "effects" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Background Opacity: {Math.round(config.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={config.opacity}
                      onChange={(e) =>
                        handleSliderChange(
                          "opacity",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs opacity-70 mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">
                          Audio Visualization
                        </div>
                        <div className="text-xs opacity-70">
                          React to audio playback
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleToggleFeature("enableAudioVisualization")
                        }
                        className={`p-2 rounded transition-colors ${
                          config.enableAudioVisualization
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {config.enableAudioVisualization ? (
                          <Volume2 className="w-4 h-4" />
                        ) : (
                          <VolumeX className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Interactivity</div>
                        <div className="text-xs opacity-70">
                          Respond to mouse movement
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleToggleFeature("enableInteractivity")
                        }
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          config.enableInteractivity
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {config.enableInteractivity ? "On" : "Off"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">
                          Parallax Effect
                        </div>
                        <div className="text-xs opacity-70">
                          Depth-based movement
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleFeature("enableParallax")}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          config.enableParallax
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {config.enableParallax ? "On" : "Off"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">
                          Section Adaptation
                        </div>
                        <div className="text-xs opacity-70">
                          Change with page sections
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleFeature("adaptToSection")}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          config.adaptToSection
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {config.adaptToSection ? "On" : "Off"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs opacity-70">
                <span>
                  Current: {config.mode} • {config.intensity}
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-1 hover:opacity-100 transition-opacity"
                >
                  <span>Close</span>
                  <ChevronUp className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackgroundSettings;

