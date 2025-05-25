import { useEffect, useRef, useState, useCallback } from 'react';
import { useBackground } from '@/contexts/BackgroundContext';
import { useAudio } from '@/contexts/AudioContext';
import { useTheme } from '@/contexts/ThemeContext';

// Define proper types for the background effects
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  opacity: number;
  baseOpacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
  activity: number;
  size: number;
}

interface HologramLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
  phase: number;
}

interface MatrixDrop {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
}

interface AudioAnalysis {
  averageLevel: number;
  bassLevel: number;
  midLevel: number;
  trebleLevel: number;
  peak: number;
}

interface ThemeColors {
  primary: number[];
  secondary: number[];
  background: number[];
  text: number[];
}

// Animation Frame Manager Class
class AnimationFrameManager {
  private animationId: number | null = null;
  private isRunning = false;
  private callbacks: (() => void)[] = [];

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    const animate = () => {
      if (!this.isRunning) return;

      this.callbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Animation callback error:', error);
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

// Utility Functions
const createParticleSystem = (canvas: HTMLCanvasElement, count: number): Particle[] => {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const size = Math.random() * 3 + 1;
    const opacity = Math.random() * 0.5 + 0.2;

    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size,
      baseSize: size,
      opacity,
      baseOpacity: opacity,
      color: `hsl(${Math.random() * 60 + 240}, 70%, 60%)`,
      life: Math.random() * 100,
      maxLife: 100,
    });
  }

  return particles;
};

const updateParticles = (
  particles: Particle[],
  canvas: HTMLCanvasElement,
  deltaTime: number,
  mousePosition?: { x: number; y: number }
) => {
  particles.forEach(particle => {
    // Update position
    particle.x += particle.vx * deltaTime * 0.01;
    particle.y += particle.vy * deltaTime * 0.01;

    // Mouse interaction
    if (mousePosition) {
      const dx = mousePosition.x - particle.x;
      const dy = mousePosition.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100 && distance > 0) {
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
    particle.life += deltaTime * 0.01;
    if (particle.life > particle.maxLife) {
      particle.life = 0;
      particle.opacity = Math.random() * 0.5 + 0.2;
      particle.baseOpacity = particle.opacity;
    }

    // Velocity damping
    particle.vx *= 0.99;
    particle.vy *= 0.99;
  });
};

const renderParticles = (
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
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

const createNeuralNetwork = (canvas: HTMLCanvasElement, nodeCount: number): NeuralNode[] => {
  const nodes: NeuralNode[] = [];

  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    const node: NeuralNode = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      connections: [],
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

const updateNeuralNetwork = (
  nodes: NeuralNode[],
  canvas: HTMLCanvasElement,
  deltaTime: number,
  audioData?: Uint8Array
) => {
  nodes.forEach((node, index) => {
    // Update position
    node.x += node.vx * deltaTime * 0.01;
    node.y += node.vy * deltaTime * 0.01;

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

const renderNeuralNetwork = (
  ctx: CanvasRenderingContext2D,
  nodes: NeuralNode[],
  colors: ThemeColors,
  opacity: number = 1
) => {
  // Render connections
  ctx.save();
  ctx.globalAlpha = opacity * 0.3;
  nodes.forEach((node, index) => {
    node.connections.forEach(connectionIndex => {
      if (connectionIndex < index) return; // Avoid duplicate lines

      const connectedNode = nodes[connectionIndex];
      if (!connectedNode) return;

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

const createHologramGrid = (canvas: HTMLCanvasElement): HologramLine[] => {
  const gridSize = 50;
  const lines: HologramLine[] = [];

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

const updateHologramGrid = (
  lines: HologramLine[],
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
      line.opacity = Math.max(0, baseOpacity);
    }
  });
};

const renderHologramGrid = (
  ctx: CanvasRenderingContext2D,
  lines: HologramLine[],
  colors: ThemeColors,
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

const createMatrixRain = (canvas: HTMLCanvasElement): MatrixDrop[] => {
  const columns = Math.floor(canvas.width / 20);
  const drops: MatrixDrop[] = [];

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

const updateMatrixRain = (
  drops: MatrixDrop[],
  canvas: HTMLCanvasElement,
  deltaTime: number
) => {
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

  drops.forEach(drop => {
    drop.y += drop.speed * deltaTime * 0.1;

    if (drop.y > canvas.height) {
      drop.y = -20;
      drop.char = chars[Math.floor(Math.random() * chars.length)];
      drop.opacity = Math.random();
    }
  });
};

const renderMatrixRain = (
  ctx: CanvasRenderingContext2D,
  drops: MatrixDrop[],
  colors: ThemeColors,
  opacity: number = 1
) => {
  ctx.save();
  ctx.font = "16px monospace";

  drops.forEach((drop) => {
    ctx.globalAlpha = opacity * drop.opacity;
    ctx.fillStyle = `rgba(${colors.primary.join(",")}, 1)`;
    ctx.fillText(drop.char, drop.x, drop.y);

    // Add glow effect
    ctx.globalAlpha = opacity * drop.opacity * 0.5;
    ctx.fillStyle = `rgba(${colors.secondary.join(",")}, 1)`;
    ctx.fillText(drop.char, drop.x, drop.y);
  });

  ctx.restore();
};

// Audio visualization utilities
const getAudioAnalysis = (audioData: Uint8Array): AudioAnalysis => {
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

const applyAudioVisualization = (
  particles: Particle[],
  audioAnalysis: AudioAnalysis
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
    particle.size = particle.baseSize * (1 + influence * 2);
    particle.opacity = particle.baseOpacity * (0.5 + influence * 0.5);

    // Apply peak influence to velocity
    const speedMultiplier = 1 + peak * 3;
    particle.vx *= speedMultiplier;
    particle.vy *= speedMultiplier;
  });
};

// Color utilities for theming
const getThemeColors = (accent: string, isDark: boolean): ThemeColors => {
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
      primary: colors.primary.map((c) => Math.max(0, c - 50)) as number[],
      secondary: colors.secondary.map((c) => Math.max(0, c - 30)) as number[],
      background: [255, 255, 255],
      text: [0, 0, 0],
    };
  }
};

// Canvas utilities
const resizeCanvas = (
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

const clearCanvas = (
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

// Main hook
export const useBackgroundEffects = (
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const { config } = useBackground();
  const { audioData } = useAudio();
  const { accent, isDark } = useTheme();

  const [isInitialized, setIsInitialized] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const animationManagerRef = useRef<AnimationFrameManager | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const neuralNodesRef = useRef<NeuralNode[]>([]);
  const hologramLinesRef = useRef<HologramLine[]>([]);
  const matrixDropsRef = useRef<MatrixDrop[]>([]);
  const lastTimeRef = useRef(performance.now());

  // Initialize animation systems
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize animation manager
    if (!animationManagerRef.current) {
      animationManagerRef.current = new AnimationFrameManager();
    }

    // Initialize effect systems based on mode
    const initializeEffects = () => {
      switch (config.mode) {
        case "particles":
          particlesRef.current = createParticleSystem(
            canvas,
            config.particleCount
          );
          break;
        case "neural":
          neuralNodesRef.current = createNeuralNetwork(
            canvas,
            Math.floor(config.particleCount / 2)
          );
          break;
        case "hologram":
          hologramLinesRef.current = createHologramGrid(canvas);
          break;
        case "matrix":
          matrixDropsRef.current = createMatrixRain(canvas);
          break;
        case "adaptive":
          // Initialize multiple systems for adaptive mode
          particlesRef.current = createParticleSystem(
            canvas,
            Math.floor(config.particleCount / 2)
          );
          neuralNodesRef.current = createNeuralNetwork(
            canvas,
            Math.floor(config.particleCount / 4)
          );
          break;
        default:
          // Default to particles
          particlesRef.current = createParticleSystem(
            canvas,
            config.particleCount
          );
          break;
      }
    };

    initializeEffects();
    setIsInitialized(true);

    return () => {
      if (animationManagerRef.current) {
        animationManagerRef.current.stop();
      }
    };
  }, [config.mode, config.particleCount, canvasRef]);

  // Handle mouse movement for interactivity
  useEffect(() => {
    if (!config.enableInteractivity) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [config.enableInteractivity, canvasRef]);

  // Animation callback
  const animate = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentTime = performance.now();
    const deltaTime =
      (currentTime - lastTimeRef.current) * config.animationSpeed;
    lastTimeRef.current = currentTime;

    // Resize canvas if needed
    if (canvas.parentElement) {
      const resized = resizeCanvas(canvas, canvas.parentElement);
      if (resized) {
        // Reinitialize effects if canvas was resized
        switch (config.mode) {
          case "particles":
            particlesRef.current = createParticleSystem(
              canvas,
              config.particleCount
            );
            break;
          case "neural":
            neuralNodesRef.current = createNeuralNetwork(
              canvas,
              Math.floor(config.particleCount / 2)
            );
            break;
          case "hologram":
            hologramLinesRef.current = createHologramGrid(canvas);
            break;
          case "matrix":
            matrixDropsRef.current = createMatrixRain(canvas);
            break;
          case "adaptive":
            particlesRef.current = createParticleSystem(
              canvas,
              Math.floor(config.particleCount / 2)
            );
            neuralNodesRef.current = createNeuralNetwork(
              canvas,
              Math.floor(config.particleCount / 4)
            );
            break;
        }
      }
    }

    const colors = getThemeColors(accent, isDark);

    // Clear canvas
    clearCanvas(ctx, canvas, isDark ? [0, 0, 0] : [255, 255, 255]);

    // Get audio analysis if available
    const audioAnalysis =
      config.enableAudioVisualization && audioData
        ? getAudioAnalysis(audioData)
        : null;

    // Update and render based on mode
    switch (config.mode) {
      case "particles":
        updateParticles(
          particlesRef.current,
          canvas,
          deltaTime,
          config.enableInteractivity ? mousePosition : undefined
        );

        if (audioAnalysis) {
          applyAudioVisualization(particlesRef.current, audioAnalysis);
        }

        renderParticles(ctx, particlesRef.current, config.opacity);
        break;

      case "neural":
        updateNeuralNetwork(
          neuralNodesRef.current,
          canvas,
          deltaTime,
          config.enableAudioVisualization && audioData ? audioData : undefined
        );

        renderNeuralNetwork(
          ctx,
          neuralNodesRef.current,
          colors,
          config.opacity
        );
        break;

      case "hologram":
        updateHologramGrid(
          hologramLinesRef.current,
          currentTime,
          config.enableAudioVisualization && audioData ? audioData : undefined
        );

        renderHologramGrid(
          ctx,
          hologramLinesRef.current,
          colors,
          config.opacity
        );
        break;

      case "matrix":
        updateMatrixRain(matrixDropsRef.current, canvas, deltaTime);
        renderMatrixRain(ctx, matrixDropsRef.current, colors, config.opacity);
        break;

      case "adaptive":
        // Render multiple effects for adaptive mode
        updateParticles(
          particlesRef.current,
          canvas,
          deltaTime,
          config.enableInteractivity ? mousePosition : undefined
        );

        updateNeuralNetwork(
          neuralNodesRef.current,
          canvas,
          deltaTime,
          config.enableAudioVisualization && audioData != null ? audioData : undefined
        );

        if (audioAnalysis) {
          applyAudioVisualization(particlesRef.current, audioAnalysis);
        }

        renderParticles(ctx, particlesRef.current, config.opacity * 0.7);
        renderNeuralNetwork(
          ctx,
          neuralNodesRef.current,
          colors,
          config.opacity * 0.5
        );
        break;

      case "minimal": {
        // Minimal mode - just a subtle gradient or simple effect
        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height
        );
        gradient.addColorStop(
          0,
          `rgba(${colors.primary.join(",")}, ${config.opacity * 0.1})`
        );
        gradient.addColorStop(
          1,
          `rgba(${colors.secondary.join(",")}, ${config.opacity * 0.05})`
        );

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
      }

      default:
        // Default case - render particles
        updateParticles(
          particlesRef.current,
          canvas,
          deltaTime,
          config.enableInteractivity ? mousePosition : undefined
        );
        renderParticles(ctx, particlesRef.current, config.opacity);
        break;
    }
  }, [config, accent, isDark, mousePosition, audioData, canvasRef]);

  // Main animation loop
  useEffect(() => {
    if (!isInitialized || !animationManagerRef.current) return;

    // Add animation callback
    const removeCallback = animationManagerRef.current.addCallback(animate);
    animationManagerRef.current.start();

    return removeCallback;
  }, [isInitialized, animate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationManagerRef.current) {
        animationManagerRef.current.stop();
      }
    };
  }, []);

  return {
    isInitialized,
    mousePosition,
  };
};

