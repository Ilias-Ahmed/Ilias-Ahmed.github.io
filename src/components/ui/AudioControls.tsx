import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Waves,
  Settings,
  X,
  BarChart3,
  Activity,
  Circle,
  Sparkles,
} from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { useIsMobile, useDeviceDetection } from "@/hooks/use-mobile";

interface AudioControlsProps {
  accentColors: {
    primary: string;
    secondary: string;
    border: string;
    glow: string;
  };
  isDark?: boolean;
  onVisualizerChange?: (type: string) => void;
  currentVisualizer?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  accentColors,
  isDark = true,
  onVisualizerChange,
  currentVisualizer = "bars",
}) => {
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

  // Use your existing mobile detection hooks
  const isMobile = useIsMobile();
  const deviceDetection = useDeviceDetection();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  // Determine if we should use mobile-optimized layout
  const shouldUseMobileLayout = isMobile || deviceDetection.isMobile || deviceDetection.isTablet ||
    deviceDetection.screenSize === "xs" || deviceDetection.screenSize === "sm";

  const togglePlay = async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const visualizerTypes = [
    { id: "bars", name: "Bars", icon: BarChart3 },
    { id: "wave", name: "Wave", icon: Activity },
    { id: "circular", name: "Circular", icon: Circle },
    { id: "particles", name: "Particles", icon: Sparkles },
  ];

  return (
    <motion.div
      className={`fixed z-[100] ${
        shouldUseMobileLayout
          ? "bottom-4 left-4" // Bottom right on mobile for better thumb access
          : "top-4 right-4"    // Top right on desktop
      }`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 2,
      }}
      style={{
        // Ensure it's always visible
        pointerEvents: 'auto',
        touchAction: 'manipulation',
      }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: shouldUseMobileLayout ? 20 : 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: shouldUseMobileLayout ? 20 : 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`${shouldUseMobileLayout ? 'mb-4' : 'mb-4'} p-4 md:p-6 rounded-2xl border shadow-2xl relative ${
              isDark
                ? "bg-gray-900/95 border-white/10"
                : "bg-white/95 border-black/10"
            }`}
            style={{
              borderColor: accentColors.border,
              boxShadow: `0 8px 32px ${accentColors.glow}`,
              width: shouldUseMobileLayout ? "280px" : "320px",
              maxWidth: "calc(100vw - 2rem)",
              transform: shouldUseMobileLayout
                ? "translateX(calc(-100% + 60px))"
                : "translateX(calc(-100% + 60px))",
              // Fallback for browsers that don't support backdrop-blur
              backgroundColor: isDark ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)", // Safari support
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Music size={18} style={{ color: accentColors.primary }} />
                <h3 className="font-semibold text-sm">Audio Player</h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className={`p-2 rounded-lg transition-colors ${
                  shouldUseMobileLayout ? 'min-w-[44px] min-h-[44px]' : 'p-1'
                } hover:bg-gray-500/20`}
                style={{ touchAction: 'manipulation' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div
                className={`w-full ${shouldUseMobileLayout ? 'h-3' : 'h-2'} bg-gray-700 rounded-full cursor-pointer relative overflow-hidden`}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newTime = (clickX / rect.width) * duration;
                  seek(newTime);
                }}
                style={{ touchAction: 'manipulation' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${accentColors.primary}, ${accentColors.secondary})`,
                    width: `${progress}%`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{
                    animation: isPlaying ? "shimmer 2s infinite" : "none",
                  }}
                />
              </div>
            </div>

            {/* Volume Control */}
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMute}
                  className={`${
                    shouldUseMobileLayout ? 'p-3 min-w-[44px] min-h-[44px]' : 'p-2'
                  } rounded-lg hover:bg-gray-500/20 transition-colors flex items-center justify-center`}
                  style={{ touchAction: 'manipulation' }}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={16} />
                  ) : (
                    <Volume2 size={16} />
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
                      handleVolumeChange(parseFloat(e.target.value))
                    }
                    className={`w-full ${shouldUseMobileLayout ? 'h-3' : 'h-2'} bg-gray-700 rounded-lg appearance-none cursor-pointer audio-slider`}
                    style={{ touchAction: 'manipulation' }}
                  />
                </div>
                <span className="text-xs text-gray-400 min-w-[3ch]">
                  {Math.round(volume * 100)}
                </span>
              </div>
            </div>

            {/* Visualizer Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Waves size={16} style={{ color: accentColors.primary }} />
                <span className="text-sm font-medium">Visualizer</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {visualizerTypes.map((viz) => (
                  <button
                    key={viz.id}
                    onClick={() => onVisualizerChange?.(viz.id)}
                    className={`${
                      shouldUseMobileLayout ? 'p-4 min-h-[60px]' : 'p-3'
                    } rounded-lg transition-all duration-200 text-sm border-2 ${
                      currentVisualizer === viz.id
                        ? "text-white"
                        : "hover:bg-gray-500/20 border-transparent"
                    }`}
                    style={{
                      backgroundColor:
                        currentVisualizer === viz.id
                          ? accentColors.primary + "40"
                          : "transparent",
                      borderColor:
                        currentVisualizer === viz.id
                          ? accentColors.primary
                          : "transparent",
                      touchAction: 'manipulation',
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <viz.icon size={18} />
                      <span>{viz.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Control Button */}
      <motion.button
        onClick={isExpanded ? togglePlay : () => setIsExpanded(true)}
        className={`relative ${
          shouldUseMobileLayout
            ? 'p-4 min-w-[56px] min-h-[56px]' // Larger touch target on mobile
            : 'p-3'
        } rounded-full border-2 shadow-2xl transition-all duration-300 ${
          isDark
            ? "bg-gray-900/90 hover:bg-gray-800/90"
            : "bg-white/90 hover:bg-white/95"
        } flex items-center justify-center`}
        style={{
          borderColor: accentColors.border,
          boxShadow: `0 4px 20px ${accentColors.glow}`,
          // Fallback for browsers that don't support backdrop-blur
          backgroundColor: isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)", // Safari support
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent', // Remove tap highlight on iOS
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onDoubleClick={togglePlay}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Settings size={shouldUseMobileLayout ? 24 : 20} style={{ color: accentColors.primary }} />
          </motion.div>
        ) : isPlaying ? (
          <Pause size={shouldUseMobileLayout ? 24 : 20} style={{ color: accentColors.primary }} />
        ) : (
          <Play size={shouldUseMobileLayout ? 24 : 20} style={{ color: accentColors.primary }} />
        )}

        {/* Audio Level Indicator */}
        {isPlaying && (
          <motion.div
            className="absolute -inset-1 rounded-full border-2 border-opacity-30"
            style={{ borderColor: accentColors.primary }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.button>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .audio-slider {
          background: linear-gradient(to right, ${accentColors.primary} 0%, ${
        accentColors.primary
      } ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%);
        }

        .audio-slider::-webkit-slider-thumb {
          appearance: none;
          height: ${shouldUseMobileLayout ? '20px' : '16px'};
          width: ${shouldUseMobileLayout ? '20px' : '16px'};
          border-radius: 50%;
          background: ${accentColors.primary};
          cursor: pointer;
          box-shadow: 0 0 10px ${accentColors.glow};
        }

        .audio-slider::-moz-range-thumb {
          height: ${shouldUseMobileLayout ? '20px' : '16px'};
          width: ${shouldUseMobileLayout ? '20px' : '16px'};
          border-radius: 50%;
          background: ${accentColors.primary};
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px ${accentColors.glow};
        }
      `}</style>
    </motion.div>
  );
};
export default AudioControls;
