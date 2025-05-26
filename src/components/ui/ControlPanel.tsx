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
  const [showMobilePanel, setShowMobilePanel] = useState(false);

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

  // Dragging functionality (desktop only)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  // Audio state
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [currentVisualizer, setCurrentVisualizer] = useState("bars");

  // Reset mobile state when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setShowMobilePanel(false);
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

  // Mobile handlers
  const handleMobileToggle = useCallback(() => {
    setShowMobilePanel(!showMobilePanel);
    if (!showMobilePanel) {
      setPanelMode("audio");
      setActiveTab("player");
    } else {
      setPanelMode("collapsed");
    }
  }, [showMobilePanel]);

  const closeMobilePanel = useCallback(() => {
    setShowMobilePanel(false);
    setPanelMode("collapsed");
  }, []);

  // Desktop handlers
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

  // Render mobile version
  if (isMobile) {
    return (
      <>
        {/* Mobile Floating Button */}
        <motion.div
          className="fixed bottom-4 left-4 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handleMobileToggle}
            className="relative p-4 rounded-full backdrop-blur-xl border shadow-2xl"
            style={{
              backgroundColor: isDark
                ? "rgba(17, 24, 39, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              borderColor: accentColors.border,
              boxShadow: `0 8px 32px ${accentColors.glow}`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={showMobilePanel ? { rotate: 180 } : { rotate: 0 }}
          >
            {/* Status indicators */}
            <div className="absolute -top-1 -right-1 flex gap-1">
              {isPlaying && (
                <motion.div
                  className="w-3 h-3 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              {error && <div className="w-3 h-3 bg-red-500 rounded-full" />}
              {isPerformanceMode && (
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
              )}
            </div>

            {showMobilePanel ? (
              <X size={24} style={{ color: accentColors.primary }} />
            ) : (
              <Settings2 size={24} style={{ color: accentColors.primary }} />
            )}
          </motion.button>
        </motion.div>

        {/* Mobile Panel Overlay */}
        <AnimatePresence>
          {showMobilePanel && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobilePanel}
              />

              {/* Panel */}
              <motion.div
                className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t shadow-2xl max-h-[80vh] overflow-hidden"
                style={{
                  backgroundColor: isDark
                    ? "rgba(17, 24, 39, 0.98)"
                    : "rgba(255, 255, 255, 0.98)",
                  borderColor: accentColors.border,
                  boxShadow: `0 -20px 60px ${accentColors.glow}`,
                }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                {/* Handle */}
                <div className="flex justify-center py-2">
                  <div
                    className="w-12 h-1 rounded-full opacity-50"
                    style={{ backgroundColor: accentColors.primary }}
                  />
                </div>

                {/* Header */}
                <div
                  className="px-6 py-4 border-b flex items-center justify-between"
                  style={{ borderColor: accentColors.border }}
                >
                  <h3 className="font-semibold text-lg">
                    {panelMode === "audio"
                      ? "Audio Controls"
                      : "Background Settings"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => {
                        setPanelMode(panelMode === "audio" ? "background" : "audio");
                        setActiveTab(panelMode === "audio" ? "modes" : "player");
                      }}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: accentColors.primary }}
                      whileHover={{
                        backgroundColor: `${accentColors.primary}20`,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {panelMode === "audio" ? (
                        <Settings2 size={20} />
                      ) : (
                        <Music size={20} />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto max-h-96">
                  {panelMode === "audio" && (
                    <div className="space-y-6">
                      {error && (
                        <motion.div
                          className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <p className="text-sm">{error}</p>
                        </motion.div>
                      )}

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm opacity-70 mb-3">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                        <div
                          className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer overflow-hidden"
                          onClick={handleSeek}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${accentColors.primary}, ${accentColors.secondary})`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                      </div>

                      {/* Playback Controls */}
                      <div className="flex items-center justify-center gap-6">
                        <motion.button
                          onClick={togglePlay}
                          className="p-6 rounded-full shadow-lg"
                          style={{ backgroundColor: accentColors.primary }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Headphones size={28} className="text-white" />
                            </motion.div>
                          ) : isPlaying ? (
                            <Pause size={28} className="text-white" />
                          ) : (
                            <Play size={28} className="text-white" />
                          )}
                        </motion.button>
                      </div>

                      {/* Volume Control */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Volume</span>
                          <span className="text-sm opacity-70">
                            {Math.round(volume * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <motion.button
                                                      onClick={toggleMute}
                            className="p-3 rounded-lg transition-colors"
                            style={{ color: accentColors.primary }}
                            whileHover={{
                              backgroundColor: `${accentColors.primary}20`,
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX size={20} />
                            ) : (
                              <Volume2 size={20} />
                            )}
                          </motion.button>
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
                              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
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
                        </div>
                      </div>

                      {/* Visualizer Selection */}
                      <div>
                        <h4 className="text-sm font-medium mb-3">Visualizer</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {visualizerTypes.map((viz) => (
                            <motion.button
                              key={viz.id}
                              onClick={() => setCurrentVisualizer(viz.id)}
                              className="p-4 rounded-lg border-2 transition-all"
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
                      </div>
                    </div>
                  )}

                  {panelMode === "background" && (
                    <div className="space-y-6">
                      {/* Background Modes */}
                      <div>
                        <h4 className="text-sm font-medium mb-3">Background Mode</h4>
                        <div className="grid grid-cols-3 gap-2">
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
                              <div className="flex flex-col items-center gap-1">
                                <mode.icon
                                  size={16}
                                  style={{ color: accentColors.primary }}
                                />
                                <span className="text-xs">{mode.label}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Intensity Level */}
                      <div>
                        <h4 className="text-sm font-medium mb-3">Intensity Level</h4>
                        <div className="flex gap-2">
                          {intensityLevels.map((level) => (
                            <motion.button
                              key={level.value}
                              onClick={() =>
                                updateConfig({ intensity: level.value })
                              }
                              className="flex-1 p-3 rounded-lg border transition-all"
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
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="text-sm">{level.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Performance Settings */}
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
                            className="w-full h-3 rounded-lg appearance-none cursor-pointer"
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
                            className="w-full h-3 rounded-lg appearance-none cursor-pointer"
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
                              updateConfig({
                                opacity: parseFloat(e.target.value),
                              })
                            }
                            className="w-full h-3 rounded-lg appearance-none cursor-pointer"
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
                      </div>

                      {/* Toggle Settings */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Effects</h4>
                        {[
                          {
                            key: "enableAudioVisualization",
                            label: "Audio Visualization",
                            desc: "React to audio",
                          },
                          {
                            key: "enableInteractivity",
                            label: "Mouse Interaction",
                            desc: "Respond to touch",
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
                            className="flex items-center justify-between p-3 rounded-lg border"
                            style={{ borderColor: accentColors.border }}
                          >
                            <div>
                              <div className="font-medium text-sm">{label}</div>
                              <div className="text-xs opacity-70">{desc}</div>
                            </div>
                            <motion.button
                              onClick={() =>
                                updateConfig({
                                  [key]: !config[key as keyof typeof config],
                                })
                              }
                              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                              style={{
                                backgroundColor: config[
                                  key as keyof typeof config
                                ]
                                  ? accentColors.primary
                                  : "transparent",
                                color: config[key as keyof typeof config]
                                  ? "white"
                                  : accentColors.primary,
                                border: `1px solid ${accentColors.primary}`,
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {config[key as keyof typeof config] ? "ON" : "OFF"}
                            </motion.button>
                          </div>
                        ))}
                      </div>

                      {/* Performance Warning */}
                      {isPerformanceMode && (
                        <motion.div
                          className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <div className="flex items-center gap-2">
                            <Zap size={18} className="text-yellow-600" />
                            <span className="text-sm font-medium">
                              Performance Mode Active
                            </span>
                          </div>
                          <p className="text-xs opacity-70 mt-1">
                            Settings optimized for better performance
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  className="px-6 py-4 border-t flex items-center justify-between"
                  style={{ borderColor: accentColors.border }}
                >
                  <div className="text-sm opacity-70">
                    {panelMode === "audio"
                      ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                      : `${config.mode} • ${config.intensity}`}
                  </div>
                  <motion.button
                    onClick={resetToDefaults}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{ color: accentColors.primary }}
                    whileHover={{
                      backgroundColor: `${accentColors.primary}20`,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={14} />
                    Reset
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop version
  return (
    <>
      {/* Drag constraints (desktop only) */}
      <div
        ref={dragConstraintsRef}
        className="fixed inset-4 pointer-events-none z-40"
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
        layout
      >
        <motion.div
          className="relative"
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Desktop Compact Control Bar */}
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

            {/* Close button when expanded */}
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

          {/* Expanded Panel - Desktop */}
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
                    <motion.button
                      onClick={closePanel}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: accentColors.primary }}
                      whileHover={{
                        backgroundColor: `${accentColors.primary}20`,
                      }}
                    >
                      <Maximize2 size={14} />
                    </motion.button>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex gap-1 overflow-x-auto">
                    {panelMode === "audio" &&
                      [
                        { id: "player", label: "Player", icon: Music },
                        { id: "visualizer", label: "Visualizer", icon: Waves },
                      ].map(({ id, label, icon: Icon }) => (
                        <motion.button
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
                          whileHover={
                            activeTab !== id
                              ? { backgroundColor: `${accentColors.primary}10` }
                              : {}
                          }
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon size={14} />
                          {label}
                        </motion.button>
                      ))}

                    {panelMode === "background" &&
                      [
                        { id: "modes", label: "Modes", icon: Palette },
                        { id: "performance", label: "Performance", icon: Cpu },
                        { id: "effects", label: "Effects", icon: Monitor },
                      ].map(({ id, label, icon: Icon }) => (
                        <motion.button
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
                          whileHover={
                            activeTab !== id
                              ? { backgroundColor: `${accentColors.primary}10` }
                              : {}
                          }
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon size={14} />
                          {label}
                        </motion.button>
                      ))}
                  </div>
                </div>

                {/* Panel Content */}
                <div className="p-4 max-h-80 overflow-y-auto">
                  {/* Audio Player Tab */}
                  {activeTab === "player" && (
                    <div className="space-y-4">
                      {error && (
                        <motion.div
                          className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {error}
                        </motion.div>
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
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Headphones size={24} className="text-white" />
                            </motion.div>
                          ) : isPlaying ? (
                            <Pause size={24} className="text-white" />
                          ) : (
                            <Play size={24} className="text-white" />
                          )}
                        </motion.button>
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={toggleMute}
                          className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                          style={{ color: accentColors.primary }}
                          whileHover={{
                            backgroundColor: `${accentColors.primary}20`,
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX size={18} />
                          ) : (
                            <Volume2 size={18} />
                          )}
                        </motion.button>
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
                          className="p-4 rounded-lg border-2 transition-all duration-200"
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
                            <motion.button
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
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="text-sm">{level.label}</span>
                            </motion.button>
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
                        <motion.div
                          className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <div className="flex items-center gap-2">
                            <Zap size={16} className="text-yellow-600" />
                            <span className="text-sm font-medium">
                              Performance Mode Active
                            </span>
                          </div>
                          <p className="text-xs opacity-70 mt-1">
                            Settings optimized for better performance
                          </p>
                        </motion.div>
                      )}
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
                            <motion.button
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
                                border: `1px solid ${accentColors.primary}`,
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {config[key as keyof typeof config] ? "ON" : "OFF"}
                            </motion.button>
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
                  <motion.button
                    onClick={resetToDefaults}
                    className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
                    style={{ color: accentColors.primary }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={12} />
                    Reset
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Custom styles for better mobile experience */}
      <style>{`
        /* Custom range slider styles */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-track {
          background: transparent;
          height: 100%;
          border-radius: 9999px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: ${accentColors.primary};
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]::-moz-range-track {
          background: transparent;
          height: 100%;
          border-radius: 9999px;
          border: none;
        }

        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: ${accentColors.primary};
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* Smooth scrolling for mobile panel */
        .mobile-panel-content {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        /* Better touch targets for mobile */
        @media (max-width: 768px) {
          button {
            min-height: 44px;
            min-width: 44px;
          }

          input[type="range"] {
            min-height: 44px;
          }
        }

        /* Backdrop blur fallback */
        @supports not (backdrop-filter: blur(12px)) {
          .backdrop-blur-xl {
            background-color: ${isDark
              ? "rgba(17, 24, 39, 0.95)"
              : "rgba(255, 255, 255, 0.95)"
            } !important;
          }
        }
      `}</style>
    </>
  );
};

export default ControlPanel;


