import { BackgroundConfig } from '@/contexts/BackgroundContext';

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderTime: number;
}

export class BackgroundPerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fpsHistory: number[] = [];
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = [];

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    const measure = () => {
      const currentTime = performance.now();
      this.frameCount++;

      // Calculate metrics every second
      if (currentTime - this.lastTime >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        const frameTime = (currentTime - this.lastTime) / this.frameCount;

        // Get memory usage if available
        let memoryUsage = 0;
        if ('memory' in performance) {
          interface PerformanceMemory {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          }
          const memory = (performance as unknown as { memory: PerformanceMemory }).memory;
          memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        }

        const metrics: PerformanceMetrics = {
          fps,
          frameTime,
          memoryUsage,
          renderTime: Math.max(0, frameTime - 16.67), // Estimate render time
        };

        this.fpsHistory.push(fps);
        if (this.fpsHistory.length > 60) {
          this.fpsHistory.shift(); // Keep last 60 measurements
        }

        // Notify callbacks
        this.callbacks.forEach(callback => callback(metrics));

        this.frameCount = 0;
        this.lastTime = currentTime;
      }

      requestAnimationFrame(measure);
    };

    requestAnimationFrame(measure);
  }

  public subscribe(callback: (metrics: PerformanceMetrics) => void) {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  public getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    return this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
  }

  public isPerformancePoor(): boolean {
    return this.getAverageFPS() < 30;
  }
}

export const optimizeConfigForPerformance = (config: BackgroundConfig): BackgroundConfig => {
  return {
    ...config,
    intensity: 'low',
    particleCount: Math.min(config.particleCount, 50),
    animationSpeed: Math.min(config.animationSpeed, 0.8),
    enableAudioVisualization: false,
        enableParallax: false,
    performanceMode: 'low',
  };
};

export const getOptimizedConfigForDevice = (config: BackgroundConfig): BackgroundConfig => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowEndDevice = () => {
    // Check available cores
    const cores = navigator.hardwareConcurrency || 1;
    if (cores < 4) return true;

    // Check memory if available
    if ('memory' in performance) {
      const memory = performance.memory as { jsHeapSizeLimit: number };
      if (memory.jsHeapSizeLimit < 50 * 1024 * 1024) return true; // Less than 50MB
    }

    // Check device pixel ratio
    if (window.devicePixelRatio < 1.5) return true;

    return false;

  };
  if (isMobile || isLowEndDevice()) {
    return optimizeConfigForPerformance(config);
  }

  return config;
};

export const createParticleSystem = (canvas: HTMLCanvasElement, count: number) => {
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
    life: number;
    maxLife: number;
  }> = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: `hsl(${Math.random() * 60 + 240}, 70%, 60%)`,
      life: Math.random() * 100,
      maxLife: 100,
    });
  }

  return particles;
};

export const updateParticles = (
  particles: ReturnType<typeof createParticleSystem>,
  canvas: HTMLCanvasElement,
  deltaTime: number,
  mousePosition?: { x: number; y: number }
) => {
  particles.forEach(particle => {
    // Update position
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;

    // Mouse interaction
    if (mousePosition) {
      const dx = mousePosition.x - particle.x;
      const dy = mousePosition.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += (dx / distance) * force * 0.1;
        particle.vy += (dy / distance) * force * 0.1;
      }
    }

    // Boundary wrapping
    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;

    // Update life
    particle.life += deltaTime;
    if (particle.life > particle.maxLife) {
      particle.life = 0;
      particle.opacity = Math.random() * 0.5 + 0.2;
    }

    // Velocity damping
    particle.vx *= 0.99;
    particle.vy *= 0.99;
  });
};

export const renderParticles = (
  ctx: CanvasRenderingContext2D,
  particles: ReturnType<typeof createParticleSystem>,
  opacity: number = 1
) => {
  particles.forEach(particle => {
    ctx.save();
    ctx.globalAlpha = particle.opacity * opacity;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
};

export const createNeuralNetwork = (canvas: HTMLCanvasElement, nodeCount: number) => {
  const nodes: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    connections: number[];
    activity: number;
    size: number;
  }> = [];

  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    const node = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      connections: [] as number[],
      activity: Math.random(),
      size: Math.random() * 4 + 2,
    };

    // Create connections to nearby nodes
    for (let j = 0; j < nodes.length; j++) {
      const dx = node.x - nodes[j].x;
      const dy = node.y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150 && Math.random() < 0.3) {
        node.connections.push(j);
        nodes[j].connections.push(i);
      }
    }

    nodes.push(node);
  }

  return nodes;
};

export const updateNeuralNetwork = (
  nodes: ReturnType<typeof createNeuralNetwork>,
  canvas: HTMLCanvasElement,
  deltaTime: number,
  audioData?: Uint8Array
) => {
  nodes.forEach((node, index) => {
    // Update position
    node.x += node.vx * deltaTime;
    node.y += node.vy * deltaTime;

    // Boundary wrapping
    if (node.x < 0) node.x = canvas.width;
    if (node.x > canvas.width) node.x = 0;
    if (node.y < 0) node.y = canvas.height;
    if (node.y > canvas.height) node.y = 0;

    // Update activity based on audio data
    if (audioData && audioData.length > 0) {
      const audioIndex = Math.floor((index / nodes.length) * audioData.length);
      const audioLevel = audioData[audioIndex] / 255;
      node.activity = Math.max(node.activity * 0.95, audioLevel);
    } else {
      // Simulate neural activity
      node.activity += (Math.random() - 0.5) * 0.1;
      node.activity = Math.max(0, Math.min(1, node.activity));
    }

    // Velocity damping
    node.vx *= 0.98;
    node.vy *= 0.98;
  });
};

export const renderNeuralNetwork = (
  ctx: CanvasRenderingContext2D,
  nodes: ReturnType<typeof createNeuralNetwork>,
  colors: { primary: number[]; secondary: number[] },
  opacity: number = 1
) => {
  // Render connections
  ctx.save();
  ctx.globalAlpha = opacity * 0.3;
  nodes.forEach((node, index) => {
    node.connections.forEach(connectionIndex => {
      if (connectionIndex < index) return; // Avoid duplicate lines

      const connectedNode = nodes[connectionIndex];
      const activity = (node.activity + connectedNode.activity) / 2;

      ctx.strokeStyle = `rgba(${colors.primary.join(',')}, ${activity})`;
      ctx.lineWidth = activity * 2;
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(connectedNode.x, connectedNode.y);
      ctx.stroke();
    });
  });

  // Render nodes
  nodes.forEach(node => {
    ctx.globalAlpha = opacity * (0.5 + node.activity * 0.5);

    // Node glow
    const gradient = ctx.createRadialGradient(
      node.x, node.y, 0,
      node.x, node.y, node.size * 2
    );
    gradient.addColorStop(0, `rgba(${colors.secondary.join(',')}, ${node.activity})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size * 2, 0, Math.PI * 2);
    ctx.fill();

    // Node core
    ctx.fillStyle = `rgba(${colors.primary.join(',')}, ${0.8 + node.activity * 0.2})`;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
};

export const createHologramGrid = (canvas: HTMLCanvasElement) => {
  const gridSize = 50;
  const lines: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    opacity: number;
    phase: number;
  }> = [];

  // Horizontal lines
  for (let y = 0; y <= canvas.height; y += gridSize) {
    lines.push({
      x1: 0,
      y1: y,
      x2: canvas.width,
      y2: y,
      opacity: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Vertical lines
  for (let x = 0; x <= canvas.width; x += gridSize) {
    lines.push({
      x1: x,
      y1: 0,
      x2: x,
      y2: canvas.height,
      opacity: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    });
  }

  return lines;
};

export const updateHologramGrid = (
  lines: ReturnType<typeof createHologramGrid>,
  time: number,
  audioData?: Uint8Array
) => {
  lines.forEach((line, index) => {
    // Update opacity with sine wave
    const baseOpacity = 0.2 + Math.sin(time * 0.001 + line.phase) * 0.3;

    if (audioData && audioData.length > 0) {
      const audioIndex = Math.floor((index / lines.length) * audioData.length);
      const audioLevel = audioData[audioIndex] / 255;
      line.opacity = Math.max(baseOpacity, audioLevel * 0.8);
    } else {
      line.opacity = baseOpacity;
    }
  });
};

export const renderHologramGrid = (
  ctx: CanvasRenderingContext2D,
  lines: ReturnType<typeof createHologramGrid>,
  colors: { primary: number[]; secondary: number[] },
  opacity: number = 1
) => {
  ctx.save();

  lines.forEach(line => {
    ctx.globalAlpha = opacity * Math.max(0, line.opacity);
    ctx.strokeStyle = `rgba(${colors.primary.join(',')}, 1)`;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();
  });

  ctx.restore();
};

export const createMatrixRain = (canvas: HTMLCanvasElement) => {
  const columns = Math.floor(canvas.width / 20);
  const drops: Array<{
    x: number;
    y: number;
    speed: number;
    char: string;
    opacity: number;
  }> = [];

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

  for (let i = 0; i < columns; i++) {
    drops.push({
      x: i * 20,
      y: Math.random() * canvas.height,
      speed: Math.random() * 3 + 1,
      char: chars[Math.floor(Math.random() * chars.length)],
      opacity: Math.random(),
    });
  }

  return drops;
};

export const updateMatrixRain = (
  drops: ReturnType<typeof createMatrixRain>,
  canvas: HTMLCanvasElement,
  deltaTime: number
) => {
  drops.forEach(drop => {
    drop.y += drop.speed * deltaTime;

    if (drop.y > canvas.height) {
      drop.y = -20;
      drop.char = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'[
        Math.floor(Math.random() * 67)
      ];
      drop.opacity = Math.random();
    }
  });
};

export const renderMatrixRain = (
  ctx: CanvasRenderingContext2D,
  drops: ReturnType<typeof createMatrixRain>,
  colors: { primary: number[]; secondary: number[] },
  opacity: number = 1
) => {
  ctx.save();
  ctx.font = '16px monospace';

  drops.forEach(drop => {
    ctx.globalAlpha = opacity * drop.opacity;
    ctx.fillStyle = `rgba(${colors.primary.join(',')}, 1)`;
    ctx.fillText(drop.char, drop.x, drop.y);

    // Add glow effect
    ctx.globalAlpha = opacity * drop.opacity * 0.5;
    ctx.fillStyle = `rgba(${colors.secondary.join(',')}, 1)`;
    ctx.fillText(drop.char, drop.x, drop.y);
  });

  ctx.restore();
};

// Audio visualization utilities
export const getAudioAnalysis = (audioData: Uint8Array) => {
  if (!audioData || audioData.length === 0) {
    return {
      averageLevel: 0,
      bassLevel: 0,
      midLevel: 0,
      trebleLevel: 0,
      peak: 0,
    };
  }

  const dataLength = audioData.length;
  const bassEnd = Math.floor(dataLength * 0.1);
  const midEnd = Math.floor(dataLength * 0.5);

  let sum = 0;
  let bassSum = 0;
  let midSum = 0;
  let trebleSum = 0;
  let peak = 0;

  for (let i = 0; i < dataLength; i++) {
    const value = audioData[i];
    sum += value;
    peak = Math.max(peak, value);

    if (i < bassEnd) {
      bassSum += value;
    } else if (i < midEnd) {
      midSum += value;
    } else {
      trebleSum += value;
    }
  }

  return {
    averageLevel: sum / dataLength / 255,
    bassLevel: bassSum / bassEnd / 255,
    midLevel: midSum / (midEnd - bassEnd) / 255,
    trebleLevel: trebleSum / (dataLength - midEnd) / 255,
    peak: peak / 255,
  };
};

export const applyAudioVisualization = (
  particles: Array<{
    size?: number;
    baseSize: number;
    opacity?: number;
    baseOpacity: number;
    vx?: number;
    vy?: number;
  }>,
  audioAnalysis: ReturnType<typeof getAudioAnalysis>
) => {
  const { bassLevel, midLevel, trebleLevel, peak } = audioAnalysis;

  particles.forEach((particle, index) => {
    const frequencyIndex = index % 3;
    let influence = 0;

    switch (frequencyIndex) {
      case 0:
        influence = bassLevel;
        break;
      case 1:
        influence = midLevel;
        break;
      case 2:
        influence = trebleLevel;
        break;
    }

    // Apply audio influence to particle properties
    if (particle.size !== undefined) {
      particle.size = particle.baseSize * (1 + influence * 2);
    }

    if (particle.opacity !== undefined) {
      particle.opacity = particle.baseOpacity * (0.5 + influence * 0.5);
    }

    if (particle.vx !== undefined && particle.vy !== undefined) {
      const speedMultiplier = 1 + peak * 3;
      particle.vx *= speedMultiplier;
      particle.vy *= speedMultiplier;
    }
  });
};

// Color utilities for theming
export const getThemeColors = (accent: string, isDark: boolean) => {
  const colorMap = {
    purple: {
      primary: [156, 81, 255],
      secondary: [139, 92, 246],
    },
    blue: {
      primary: [59, 130, 246],
      secondary: [96, 165, 250],
    },
    pink: {
      primary: [236, 72, 153],
      secondary: [244, 114, 182],
    },
    green: {
      primary: [34, 197, 94],
      secondary: [74, 222, 128],
    },
    orange: {
      primary: [249, 115, 22],
      secondary: [251, 146, 60],
    },
  };

  const colors = colorMap[accent as keyof typeof colorMap] || colorMap.purple;

  // Adjust colors for dark/light theme
  if (isDark) {
    return {
      primary: colors.primary,
      secondary: colors.secondary,
      background: [0, 0, 0],
      text: [255, 255, 255],
    };
  } else {
    return {
      primary: colors.primary.map((c) => Math.max(0, c - 50)),
      secondary: colors.secondary.map((c) => Math.max(0, c - 30)),
      background: [255, 255, 255],
      text: [0, 0, 0],
    };
  }
};

// Performance optimization utilities
export const shouldReduceEffects = (metrics: PerformanceMetrics): boolean => {
  return metrics.fps < 30 || metrics.memoryUsage > 80 || metrics.frameTime > 33;
};

export const getOptimalParticleCount = (
  baseCount: number,
  metrics: PerformanceMetrics
): number => {
  if (metrics.fps >= 55) return baseCount;
  if (metrics.fps >= 45) return Math.floor(baseCount * 0.8);
  if (metrics.fps >= 30) return Math.floor(baseCount * 0.6);
  return Math.floor(baseCount * 0.4);
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Canvas utilities
export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  container: HTMLElement
): boolean => {
  const rect = container.getBoundingClientRect();
  const newWidth = rect.width;
  const newHeight = rect.height;

  if (canvas.width !== newWidth || canvas.height !== newHeight) {
    canvas.width = newWidth;
    canvas.height = newHeight;
    return true; // Canvas was resized
  }

  return false; // No resize needed
};

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  backgroundColor?: number[]
) => {
  if (backgroundColor) {
    ctx.fillStyle = `rgb(${backgroundColor.join(",")})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

// Animation frame management
export class AnimationFrameManager {
  private animationId: number | null = null;
  private isRunning = false;
  private callbacks: (() => void)[] = [];

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    const animate = () => {
      if (!this.isRunning) return;

      this.callbacks.forEach((callback) => {
        try {
          callback();
        } catch (error) {
          console.error("Animation callback error:", error);
        }
      });

      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  addCallback(callback: () => void) {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  isActive() {
    return this.isRunning;
  }
}

// Section-based background adaptation
export const getSectionTheme = (sectionId: string) => {
  const sectionThemes = {
    home: {
      mode: "particles" as const,
      intensity: "medium" as const,
      colors: "purple" as const,
    },
    about: {
      mode: "neural" as const,
      intensity: "low" as const,
      colors: "blue" as const,
    },
    skills: {
      mode: "matrix" as const,
      intensity: "high" as const,
      colors: "green" as const,
    },
    projects: {
      mode: "hologram" as const,
      intensity: "high" as const,
      colors: "pink" as const,
    },
    contact: {
      mode: "adaptive" as const,
      intensity: "medium" as const,
      colors: "orange" as const,
    },
  };

  return (
    sectionThemes[sectionId as keyof typeof sectionThemes] || sectionThemes.home
  );
};

export const interpolateConfigs = (
  from: BackgroundConfig,
  to: BackgroundConfig,
  progress: number
): BackgroundConfig => {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return {
    ...to,
    particleCount: Math.round(
      lerp(from.particleCount, to.particleCount, progress)
    ),
    opacity: lerp(from.opacity, to.opacity, progress),
    animationSpeed: lerp(from.animationSpeed, to.animationSpeed, progress),
  };
};

