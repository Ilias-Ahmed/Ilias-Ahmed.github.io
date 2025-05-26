import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Cpu,
  HardDrive,
  Monitor,
  TrendingUp,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  cpuUsage: number;
  renderTime: number;
  particleCount: number;
}

interface BackgroundPerformanceMonitorProps {
  showDetails?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

const BackgroundPerformanceMonitor: React.FC<
  BackgroundPerformanceMonitorProps
> = ({ showDetails = false, position = "bottom-left", className = "" }) => {
  // Call ALL hooks at the top level, before any conditional logic
  const isMobile = useIsMobile();

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    cpuUsage: 0,
    renderTime: 0,
    particleCount: 0,
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [performanceHistory, setPerformanceHistory] = useState<number[]>([]);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>(0);

  // Performance monitoring
  const updateMetrics = useCallback(() => {
    const now = performance.now();
    const delta = now - lastTimeRef.current;

    frameCountRef.current++;

    if (delta >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / delta);
      const frameTime = delta / frameCountRef.current;

      // Get memory usage if available
      let memoryUsage = 0;
      if ("memory" in performance) {
        interface MemoryInfo {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        }
        const memory = (performance as Performance & { memory: MemoryInfo }).memory;
        memoryUsage = Math.round(
          (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
        );
      }

      const newMetrics = {
        fps,
        frameTime: Math.round(frameTime * 100) / 100,
        memoryUsage,
        cpuUsage: Math.min(100, Math.max(0, 100 - fps * 1.67)), // Rough CPU estimation
        renderTime: frameTime,
        particleCount: 0, // This would be passed from your background system
      };

      setMetrics(newMetrics);
      setPerformanceHistory((prev) => [...prev.slice(-19), fps]);

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(updateMetrics);
  }, []);

  const getPerformanceColor = useCallback((value: number, metric: string) => {
    switch (metric) {
      case "fps":
        if (value >= 55) return "#10b981"; // green
        if (value >= 30) return "#f59e0b"; // yellow
        return "#ef4444"; // red
      case "memory":
      case "cpu":
        if (value <= 50) return "#10b981"; // green
        if (value <= 80) return "#f59e0b"; // yellow
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  }, []);

  useEffect(() => {
    if (showDetails && !isMobile) {
      updateMetrics();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showDetails, updateMetrics, isMobile]);

  // NOW we can conditionally return after all hooks are called
  if (isMobile || !showDetails) {
    return null;
  }

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-8 right-40",
    "bottom-right": "bottom-4 right-4",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed ${positionClasses[position]} z-30 ${className}`}
    >
      <motion.div
        className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg
          text-white text-xs font-mono shadow-2xl overflow-hidden"
        layout
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-green-400" />
            <span className="font-semibold">Performance</span>
          </div>
          <div className="flex items-center gap-1">
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isExpanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
            </motion.button>
          </div>
        </div>

        {/* Compact View */}
        <div className="p-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: getPerformanceColor(metrics.fps, "fps"),
                }}
              />
              <span>{metrics.fps} FPS</span>
            </div>
            {metrics.memoryUsage > 0 && (
              <div className="flex items-center gap-1">
                <HardDrive size={10} />
                <span>{metrics.memoryUsage}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-white/10"
            >
              <div className="p-3 space-y-3">
                {/* FPS Chart */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">FPS History</span>
                    <span
                      style={{ color: getPerformanceColor(metrics.fps, "fps") }}
                    >
                      {metrics.fps}
                    </span>
                  </div>
                  <div className="h-8 flex items-end gap-px">
                    {performanceHistory.map((fps, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm transition-all duration-200"
                        style={{
                          height: `${(fps / 60) * 100}%`,
                          backgroundColor: getPerformanceColor(fps, "fps"),
                          minHeight: "2px",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Monitor size={10} />
                        <span>Frame</span>
                      </div>
                      <span>{metrics.frameTime.toFixed(1)}ms</span>
                    </div>

                    {metrics.memoryUsage > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <HardDrive size={10} />
                          <span>Memory</span>
                        </div>
                        <span
                          style={{
                            color: getPerformanceColor(
                              metrics.memoryUsage,
                              "memory"
                            ),
                          }}
                        >
                          {metrics.memoryUsage}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Cpu size={10} />
                        <span>CPU</span>
                      </div>
                      <span
                        style={{
                          color: getPerformanceColor(metrics.cpuUsage, "cpu"),
                        }}
                      >
                        {metrics.cpuUsage}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={10} />
                        <span>Render</span>
                      </div>
                      <span>{metrics.renderTime.toFixed(1)}ms</span>
                    </div>
                  </div>
                </div>

                {/* Performance Status */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-center text-xs">
                    <span className="text-gray-400">Status: </span>
                    <span
                      style={{ color: getPerformanceColor(metrics.fps, "fps") }}
                    >
                      {metrics.fps >= 55
                        ? "Excellent"
                        : metrics.fps >= 30
                        ? "Good"
                        : "Poor"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default BackgroundPerformanceMonitor;
