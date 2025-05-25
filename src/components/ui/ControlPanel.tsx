import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Monitor,
  Zap,
  Palette,
  RotateCcw,
  BarChart3,
  Activity,
  Circle,
  Sparkles,
  Waves,
  X,
  Maximize2,
  GripVertical,
  Headphones,
  Settings2,
  Cpu,
  Eye,
} from "lucide-react";
import {
  useBackground,
  BackgroundMode,
  IntensityLevel,
} from "@/contexts/BackgroundContext";
import { useAudio } from "@/contexts/AudioContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface ControlPanelProps {
  className?: string;
}

type PanelMode = "collapsed" | "audio" | "background";
type TabType = "player" | "visualizer" | "modes" | "performance" | "effects";

const ControlPanel: React.FC<ControlPanelProps> = ({ className = "" }) => {
  const [panelMode, setPanelMode] = useState<PanelMode>("collapsed");
  const [activeTab, setActiveTab] = useState<TabType>("player");
  const [isDragging, setIsDragging] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();
  const isMobile = useIsMobile();

  // Audio Controls
  const {
    isPlaying,
    volume,
    currentTime,
    duration,
    isLoading,
    error,
    play,
    pause,
    setVolume,
    seek,
  } = useAudio();

  // Background Controls
  const { config, updateConfig, resetToDefaults, isPerformanceMode } =
    useBackground();

  // Dragging functionality
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  // Audio state
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [currentVisualizer, setCurrentVisualizer] = useState("bars");

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setPanelMode("collapsed");
    }
  }, [isMobile]);

  // Audio controls
  const togglePlay = useCallback(async () => {
    try {
      if (isPlaying) {
        pause();
      } else {
        await play();
      }
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, volume, previousVolume, setVolume]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      seek(newTime);
    },
    [duration, seek]
  );

  // Constants
  const progress = useMemo(
    () => (duration > 0 ? (currentTime / duration) * 100 : 0),
    [currentTime, duration]
  );

  const backgroundModes: {
    value: BackgroundMode;
    label: string;
    icon: React.ElementType;
  }[] = useMemo(
    () => [
      { value: "adaptive", label: "Adaptive", icon: Zap },
      { value: "particles", label: "Particles", icon: Circle },
      { value: "neural", label: "Neural", icon: Activity },
      { value: "hologram", label: "Hologram", icon: Monitor },
      { value: "matrix", label: "Matrix", icon: BarChart3 },
      { value: "minimal", label: "Minimal", icon: Eye },
    ],
    []
  );

  const visualizerTypes = useMemo(
    () => [
      { id: "bars", name: "Bars", icon: BarChart3 },
      { id: "wave", name: "Wave", icon: Activity },
      { id: "circular", name: "Circular", icon: Circle },
      { id: "particles", name: "Particles", icon: Sparkles },
    ],
    []
  );

  const intensityLevels: { value: IntensityLevel; label: string }[] = useMemo(
    () => [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
    []
  );

  // Panel state handlers
  const handleAudioClick = useCallback(() => {
    if (panelMode === "audio") {
      togglePlay();
    } else {
      setPanelMode("audio");
      setActiveTab("player");
    }
  }, [panelMode, togglePlay]);

  const handleBackgroundClick = useCallback(() => {
    setPanelMode(panelMode === "background" ? "collapsed" : "background");
    setActiveTab("modes");
  }, [panelMode]);

  const closePanel = useCallback(() => {
    setPanelMode("collapsed");
  }, []);

  // Don't render on mobile
  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* Drag constraints */}
      <div
        ref={dragConstraintsRef}
        className="fixed inset-4 pointer-events-none"
        style={{ zIndex: 80 }}
      />

      {/* Main Control Panel */}
      <motion.div
        ref={panelRef}
        className={`fixed top-4 right-4 z-50 ${className}`}
        style={{ x: springX, y: springY }}
        drag={isDragging}
        dragConstraints={dragConstraintsRef}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        whileDrag={{ scale: 1.02, rotate: 1 }}
      >
        <motion.div
          className="relative"
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Compact Control Bar */}
          <motion.div
            className="flex items-center gap-2 rounded-2xl backdrop-blur-xl border shadow-2xl"
            style={{
              backgroundColor: isDark
                ? "rgba(17, 24, 39, 0.9)"
                : "rgba(255, 255, 255, 0.9)",
              borderColor: accentColors.border,
              boxShadow: `0 8px 32px ${accentColors.glow}`,
            }}
            layout
          >
            {/* Drag Handle */}
            <motion.div
              className="cursor-grab active:cursor-grabbing p-1 rounded-lg transition-colors"
              style={{ color: accentColors.primary }}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              whileHover={{ backgroundColor: `${accentColors.primary}20` }}
            >
              <GripVertical size={16} />
            </motion.div>

            {/* Audio Button */}
            <motion.button
              onClick={handleAudioClick}
              className="relative p-3 rounded-xl transition-all duration-300 group"
              style={{
                backgroundColor:
                  panelMode === "audio"
                    ? `${accentColors.primary}20`
                    : "transparent",
                borderColor:
                  panelMode === "audio" ? accentColors.primary : "transparent",
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: `${accentColors.primary}15`,
              }}
              whileTap={{ scale: 0.95 }}
              title={
                panelMode === "audio"
                  ? "Toggle Playback"
                  : "Open Audio Controls"
              }
            >
              {/* Status indicators */}
              <div className="absolute -top-1 -right-1 flex gap-1">
                {isPlaying && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {error && <div className="w-2 h-2 bg-red-500 rounded-full" />}
              </div>

              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Headphones
                    size={20}
                    style={{ color: accentColors.primary }}
                  />
                </motion.div>
              ) : isPlaying ? (
                <Pause size={20} style={{ color: accentColors.primary }} />
              ) : (
                <Play size={20} style={{ color: accentColors.primary }} />
              )}
            </motion.button>

            {/* Background Button */}
            <motion.button
              onClick={handleBackgroundClick}
              className="relative p-3 rounded-xl transition-all duration-300 group"
              style={{
                backgroundColor:
                  panelMode === "background"
                    ? `${accentColors.primary}20`
                    : "transparent",
                borderColor:
                  panelMode === "background"
                    ? accentColors.primary
                    : "transparent",
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: `${accentColors.primary}15`,
              }}
              whileTap={{ scale: 0.95 }}
              title="Background Settings"
            >
              {/* Performance indicator */}
              {isPerformanceMode && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              )}

              <Settings2 size={20} style={{ color: accentColors.primary }} />
            </motion.button>

            {/* Expand indicator */}
            {panelMode !== "collapsed" && (
              <motion.button
                onClick={closePanel}
                className="p-2 rounded-lg transition-all duration-300"
                style={{ color: accentColors.primary }}
                whileHover={{
                  backgroundColor: `${accentColors.primary}20`,
                  scale: 1.1,
                }}
                whileTap={{ scale: 0.9 }}
                title="Close Panel"
              >
                <X size={16} />
              </motion.button>
            )}
          </motion.div>

          {/* Expanded Panel */}
          <AnimatePresence>
            {panelMode !== "collapsed" && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-full right-0 mt-3 w-80 backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden"
                style={{
                  backgroundColor: isDark
                    ? "rgba(17, 24, 39, 0.95)"
                    : "rgba(255, 255, 255, 0.95)",
                  borderColor: accentColors.border,
                  boxShadow: `0 20px 60px ${accentColors.glow}`,
                }}
              >
                {/* Panel Header */}
                <div
                  className="p-4 border-b"
                  style={{ borderColor: accentColors.border }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">
                      {panelMode === "audio"
                        ? "Audio Controls"
                        : "Background Settings"}
                    </h3>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => setPanelMode("collapsed")}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: accentColors.primary }}
                        whileHover={{
                          backgroundColor: `${accentColors.primary}20`,
                        }}
                      >
                        <Maximize2 size={14} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex gap-1 overflow-x-auto">
                    {panelMode === "audio" &&
                      [
                        { id: "player", label: "Player", icon: Music },
                        { id: "visualizer", label: "Visualizer", icon: Waves },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setActiveTab(id as TabType)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                            activeTab === id
                              ? "text-white"
                              : "hover:bg-opacity-10"
                          }`}
                          style={{
                            backgroundColor:
                              activeTab === id
                                ? accentColors.primary
                                : "transparent",
                          }}
                        >
                          <Icon size={14} />
                          {label}
                        </button>
                      ))}

                    {panelMode === "background" &&
                      [
                        { id: "modes", label: "Modes", icon: Palette },
                        { id: "performance", label: "Performance", icon: Cpu },
                        { id: "effects", label: "Effects", icon: Monitor },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setActiveTab(id as TabType)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                            activeTab === id
                              ? "text-white"
                              : "hover:bg-opacity-10"
                          }`}
                          style={{
                            backgroundColor:
                              activeTab === id
                                ? accentColors.primary
                                : "transparent",
                          }}
                        >
                          <Icon size={14} />
                          {label}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Panel Content */}
                <div className="p-4 max-h-80 overflow-y-auto">
                  {/* Audio Player Tab */}
                  {activeTab === "player" && (
                    <div className="space-y-4">
                      {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                          {error}
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs opacity-70 mb-2">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                        <div
                          className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer overflow-hidden"
                          onClick={handleSeek}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${accentColors.primary}, ${accentColors.secondary})`,
                              width: `${progress}%`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                      </div>

                      {/* Playback Controls */}
                      <div className="flex items-center justify-center gap-4">
                        <motion.button
                          onClick={togglePlay}
                          className="p-4 rounded-full"
                          style={{ backgroundColor: accentColors.primary }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isPlaying ? (
                            <Pause size={24} className="text-white" />
                          ) : (
                            <Play size={24} className="text-white" />
                          )}
                        </motion.button>
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={toggleMute}
                          className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                          style={{ color: accentColors.primary }}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX size={18} />
                          ) : (
                            <Volume2 size={18} />
                          )}
                        </button>
                        <div className="flex-1">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) =>
                              setVolume(parseFloat(e.target.value))
                            }
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, ${
                                accentColors.primary
                              } 0%, ${accentColors.primary} ${
                                volume * 100
                              }%, rgb(156 163 175) ${
                                volume * 100
                              }%, rgb(156 163 175) 100%)`,
                            }}
                          />
                        </div>
                        <span className="text-xs opacity-70 min-w-[3ch]">
                          {Math.round(volume * 100)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Visualizer Tab */}
                  {activeTab === "visualizer" && (
                    <div className="grid grid-cols-2 gap-3">
                      {visualizerTypes.map((viz) => (
                        <motion.button
                          key={viz.id}
                          onClick={() => setCurrentVisualizer(viz.id)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200`}
                          style={{
                            backgroundColor:
                              currentVisualizer === viz.id
                                ? `${accentColors.primary}20`
                                : "transparent",
                            borderColor:
                              currentVisualizer === viz.id
                                ? accentColors.primary
                                : "transparent",
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <viz.icon
                              size={20}
                              style={{ color: accentColors.primary }}
                            />
                            <span className="text-sm">{viz.name}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Background Modes Tab */}
                  {activeTab === "modes" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {backgroundModes.map((mode) => (
                          <motion.button
                            key={mode.value}
                            onClick={() => updateConfig({ mode: mode.value })}
                            className="p-3 rounded-lg border-2 transition-all"
                            style={{
                              backgroundColor:
                                config.mode === mode.value
                                  ? `${accentColors.primary}20`
                                  : "transparent",
                              borderColor:
                                config.mode === mode.value
                                  ? accentColors.primary
                                  : "transparent",
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <mode.icon
                                size={18}
                                style={{ color: accentColors.primary }}
                              />
                              <span className="text-xs">{mode.label}</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      {/* Intensity Level */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Intensity Level
                        </label>
                        <div className="flex gap-2">
                          {intensityLevels.map((level) => (
                            <button
                              key={level.value}
                              onClick={() =>
                                updateConfig({ intensity: level.value })
                              }
                              className="flex-1 p-2 rounded-lg border transition-all"
                              style={{
                                backgroundColor:
                                  config.intensity === level.value
                                    ? `${accentColors.primary}20`
                                    : "transparent",
                                borderColor:
                                  config.intensity === level.value
                                    ? accentColors.primary
                                    : "#e5e7eb",
                              }}
                            >
                              <span className="text-sm">{level.label}</span>
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
                          Particle Count: {config.particleCount}
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          value={config.particleCount}
                          onChange={(e) =>
                            updateConfig({
                              particleCount: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${
                              accentColors.primary
                            } 0%, ${accentColors.primary} ${
                              ((config.particleCount - 10) / 190) * 100
                            }%, rgb(156 163 175) ${
                              ((config.particleCount - 10) / 190) * 100
                            }%, rgb(156 163 175) 100%)`,
                          }}
                        />
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
                            updateConfig({
                              animationSpeed: parseFloat(e.target.value),
                            })
                          }
                          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${
                              accentColors.primary
                            } 0%, ${accentColors.primary} ${
                              ((config.animationSpeed - 0.1) / 2.9) * 100
                            }%, rgb(156 163 175) ${
                              ((config.animationSpeed - 0.1) / 2.9) * 100
                            }%, rgb(156 163 175) 100%)`,
                          }}
                        />
                      </div>

                      {isPerformanceMode && (
                        <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Zap size={16} className="text-yellow-600" />
                            <span className="text-sm font-medium">
                              Performance Mode Active
                            </span>
                          </div>
                          <p className="text-xs opacity-70 mt-1">
                            Settings optimized for better performance
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Effects Tab */}
                  {activeTab === "effects" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Background Opacity: {Math.round(config.opacity * 100)}
                          %
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={config.opacity}
                          onChange={(e) =>
                            updateConfig({
                              opacity: parseFloat(e.target.value),
                            })
                          }
                          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${
                              accentColors.primary
                            } 0%, ${accentColors.primary} ${
                              config.opacity * 100
                            }%, rgb(156 163 175) ${
                              config.opacity * 100
                            }%, rgb(156 163 175) 100%)`,
                          }}
                        />
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            key: "enableAudioVisualization",
                            label: "Audio Visualization",
                            desc: "React to audio",
                          },
                          {
                            key: "enableInteractivity",
                            label: "Mouse Interaction",
                            desc: "Respond to mouse",
                          },
                          {
                            key: "enableParallax",
                            label: "Parallax Effect",
                            desc: "Depth movement",
                          },
                          {
                            key: "adaptToSection",
                            label: "Section Adaptation",
                            desc: "Change with sections",
                          },
                        ].map(({ key, label, desc }) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <div className="font-medium text-sm">{label}</div>
                              <div className="text-xs opacity-70">{desc}</div>
                            </div>
                            <button
                              onClick={() =>
                                updateConfig({
                                  [key]: !config[key as keyof typeof config],
                                })
                              }
                              className="px-3 py-1 rounded-full text-sm transition-all"
                              style={{
                                backgroundColor: config[
                                  key as keyof typeof config
                                ]
                                  ? accentColors.primary
                                  : "transparent",
                                color: config[key as keyof typeof config]
                                  ? "white"
                                  : "inherit",
                              }}
                            >
                              {config[key as keyof typeof config]
                                ? "On"
                                : "Off"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Panel Footer */}
                <div
                  className="p-3 border-t flex items-center justify-between"
                  style={{ borderColor: accentColors.border }}
                >
                  <div className="text-xs opacity-70">
                    {panelMode === "audio"
                      ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                      : `${config.mode} • ${config.intensity}`}
                  </div>
                  <button
                    onClick={resetToDefaults}
                    className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
                    style={{ color: accentColors.primary }}
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ControlPanel;
