import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useBackground } from '@/contexts/BackgroundContext';
import { useAudio } from '@/contexts/AudioContext';
import { useDeviceDetection } from '@/hooks/use-mobile';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  audioInfluence: number;
}

interface NeuralNode {
  x: number;
  y: number;
  connections: number[];
  activity: number;
  audioBoost: number;
}

interface AudioAnalysis {
  bassLevel: number;
  midLevel: number;
  trebleLevel: number;
  averageLevel: number;
  peakLevel: number;
  bassFreq: number[];
  midFreq: number[];
  trebleFreq: number[];
}

const GlobalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const neuralNodesRef = useRef<NeuralNode[]>([]);
  const timeRef = useRef(0);

  const { accent, isDark } = useTheme();
  const { config, currentSection, backgroundOpacity } = useBackground();
  const { audioData, isPlaying } = useAudio();
  const deviceDetection = useDeviceDetection();

  const audioAnalysis = useMemo((): AudioAnalysis => {
    if (!audioData || !isPlaying) {
      return {
        bassLevel: 0,
        midLevel: 0,
        trebleLevel: 0,
        averageLevel: 0,
        peakLevel: 0,
        bassFreq: [],
        midFreq: [],
        trebleFreq: [],
      };
    }

    const dataLength = audioData.length;
    const bassEnd = Math.floor(dataLength * 0.1);
    const midEnd = Math.floor(dataLength * 0.5);

    const bassFreq = Array.from(audioData.slice(0, bassEnd));
    const midFreq = Array.from(audioData.slice(bassEnd, midEnd));
    const trebleFreq = Array.from(audioData.slice(midEnd));

    const bassLevel =
      bassFreq.reduce((sum, val) => sum + val, 0) / bassFreq.length / 255;
    const midLevel =
      midFreq.reduce((sum, val) => sum + val, 0) / midFreq.length / 255;
    const trebleLevel =
      trebleFreq.reduce((sum, val) => sum + val, 0) / trebleFreq.length / 255;
    const averageLevel =
      Array.from(audioData).reduce((sum, val) => sum + val, 0) /
      dataLength /
      255;
    const peakLevel = Math.max(...Array.from(audioData)) / 255;

    return {
      bassLevel,
      midLevel,
      trebleLevel,
      averageLevel,
      peakLevel,
      bassFreq,
      midFreq,
      trebleFreq,
    };
  }, [audioData, isPlaying]);

  const getThemeColors = useCallback(() => {
    const colorMaps = {
      purple: {
        primary: [168, 85, 247],
        secondary: [196, 132, 252],
        accent: [139, 92, 246],
      },
      blue: {
        primary: [59, 130, 246],
        secondary: [96, 165, 250],
        accent: [37, 99, 235],
      },
      pink: {
        primary: [236, 72, 153],
        secondary: [244, 114, 182],
        accent: [219, 39, 119],
      },
      green: {
        primary: [34, 197, 94],
        secondary: [74, 222, 128],
        accent: [22, 163, 74],
      },
      orange: {
        primary: [249, 115, 22],
        secondary: [251, 146, 60],
        accent: [234, 88, 12],
      },
    };
    return colorMaps[accent];
  }, [accent]);

  const initializeParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      const particleCount =
        config.intensity === "high"
          ? 150
          : config.intensity === "medium"
          ? 100
          : 50;
      const particles: Particle[] = [];
      const colors = getThemeColors();

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          color: `rgb(${colors.primary.join(",")})`,
          life: Math.random() * 100 + 50,
          maxLife: Math.random() * 100 + 50,
          audioInfluence: Math.random() * 0.5 + 0.5,
        });
      }

      particlesRef.current = particles;
    },
    [config.intensity, getThemeColors]
  );

  const initializeNeuralNodes = useCallback(
    (canvas: HTMLCanvasElement) => {
      const nodeCount =
        config.intensity === "high"
          ? 50
          : config.intensity === "medium"
          ? 30
          : 20;
      const nodes: NeuralNode[] = [];

      for (let i = 0; i < nodeCount; i++) {
        const connections: number[] = [];
        const connectionCount = Math.floor(Math.random() * 4) + 2;

        for (let j = 0; j < connectionCount; j++) {
          const targetIndex = Math.floor(Math.random() * nodeCount);
          if (targetIndex !== i && !connections.includes(targetIndex)) {
            connections.push(targetIndex);
          }
        }

        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          connections,
          activity: Math.random(),
          audioBoost: 0,
        });
      }

      neuralNodesRef.current = nodes;
    },
    [config.intensity]
  );

  const renderParticles = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const particles = particlesRef.current;
      const colors = getThemeColors();
      const { bassLevel, midLevel, trebleLevel, averageLevel } = audioAnalysis;

      particles.forEach((particle) => {
        if (config.enableAudioVisualization && isPlaying) {
          const audioBoost = averageLevel * particle.audioInfluence;
          const bassBoost = bassLevel * 2;
          const trebleBoost = trebleLevel * 1.5;

          particle.vx += (Math.random() - 0.5) * audioBoost * 0.5;
          particle.vy += (Math.random() - 0.5) * audioBoost * 0.5;

          const audioSize = particle.size * (1 + audioBoost * 2);

          const r = Math.min(255, colors.primary[0] + bassBoost * 100);
          const g = Math.min(255, colors.primary[1] + midLevel * 100);
          const b = Math.min(255, colors.primary[2] + trebleBoost * 100);

          particle.color = `rgb(${r},${g},${b})`;

          ctx.save();
          ctx.globalAlpha = 0.8;
          ctx.shadowBlur = 10 + audioBoost * 20;
          ctx.shadowColor = particle.color;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, audioSize, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();

          if (audioBoost > 0.7) {
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, audioSize * 2, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
          }

          ctx.restore();
        } else {
          ctx.save();
          ctx.globalAlpha = (particle.life / particle.maxLife) * 0.6;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          ctx.restore();
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        particle.vx *= 0.99;
        particle.vy *= 0.99;

        particle.life -= 0.5;
        if (particle.life <= 0) {
          particle.life = particle.maxLife;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }
      });
    },
    [getThemeColors, audioAnalysis, config.enableAudioVisualization, isPlaying]
  );

  const renderNeuralNetwork = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const nodes = neuralNodesRef.current;
      const colors = getThemeColors();
      const { bassFreq } = audioAnalysis;

      nodes.forEach((node, index) => {
        if (config.enableAudioVisualization && isPlaying) {
          const freqIndex = Math.floor(
            (index / nodes.length) * bassFreq.length
          );
          const freqValue = bassFreq[freqIndex] || 0;
          node.audioBoost = (freqValue / 255) * 2;
          node.activity = Math.min(1, node.activity + node.audioBoost * 0.1);
        } else {
          node.activity *= 0.95;
          node.audioBoost = 0;
        }
      });

      ctx.save();
      nodes.forEach((node) => {
        node.connections.forEach((connectionIndex) => {
          if (connectionIndex < nodes.length) {
            const targetNode = nodes[connectionIndex];
            const distance = Math.sqrt(
              Math.pow(node.x - targetNode.x, 2) +
                Math.pow(node.y - targetNode.y, 2)
            );

            if (distance < 200) {
              const activity = (node.activity + targetNode.activity) / 2;
              const audioInfluence = config.enableAudioVisualization
                ? (node.audioBoost + targetNode.audioBoost) / 2
                : 0;

              ctx.strokeStyle = `rgba(${colors.primary.join(",")}, ${
                activity * 0.3 + audioInfluence * 0.4
              })`;
              ctx.lineWidth = 1 + audioInfluence * 2;

              if (audioInfluence > 0.5) {
                ctx.shadowBlur = 5;
                ctx.shadowColor = `rgb(${colors.secondary.join(",")})`;
              }

              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(targetNode.x, targetNode.y);
              ctx.stroke();
            }
          }
        });
      });
      ctx.restore();

      ctx.save();
      nodes.forEach((node) => {
        const baseSize = 3;
        const audioSize = config.enableAudioVisualization
          ? baseSize + node.audioBoost * 5
          : baseSize;

        const alpha = 0.6 + node.activity * 0.4;

        if (node.audioBoost > 0.7) {
          ctx.save();
          ctx.globalAlpha = 0.3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgb(${colors.accent.join(",")})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, audioSize * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${colors.accent.join(",")})`;
          ctx.fill();
          ctx.restore();
        }

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(node.x, node.y, audioSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${colors.primary.join(",")})`;
        ctx.fill();

        if (config.enableAudioVisualization && node.audioBoost > 0.3) {
          ctx.globalAlpha = node.audioBoost * 0.5;
          ctx.strokeStyle = `rgb(${colors.secondary.join(",")})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(
            node.x,
            node.y,
            audioSize + node.audioBoost * 10,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      });
      ctx.restore();
    },
    [getThemeColors, audioAnalysis, config.enableAudioVisualization, isPlaying]
  );

  const renderHologram = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const colors = getThemeColors();
      const { averageLevel, bassLevel, trebleLevel } = audioAnalysis;
      const time = timeRef.current;

      const gridSize = 50;
      const audioDistortion = config.enableAudioVisualization
        ? averageLevel * 20
        : 0;

      ctx.save();
      ctx.strokeStyle = `rgba(${colors.primary.join(",")}, 0.3)`;
      ctx.lineWidth = 1;

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);

        for (let y = 0; y <= canvas.height; y += 10) {
          const audioWave = config.enableAudioVisualization
            ? Math.sin((y + time) * 0.01) *
              audioDistortion *
              Math.sin(time * 0.005)
            : 0;
          const bassWave = config.enableAudioVisualization
            ? Math.sin((y + time) * 0.02) * bassLevel * 15
            : 0;

          ctx.lineTo(x + audioWave + bassWave, y);
        }

        if (config.enableAudioVisualization && averageLevel > 0.3) {
          ctx.strokeStyle = `rgba(${colors.secondary.join(",")}, ${
            0.3 + averageLevel * 0.4
          })`;
          ctx.shadowBlur = averageLevel * 10;
          ctx.shadowColor = `rgb(${colors.primary.join(",")})`;
        }

        ctx.stroke();
      }

      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);

        for (let x = 0; x <= canvas.width; x += 10) {
          const audioWave = config.enableAudioVisualization
            ? Math.sin((x + time) * 0.01) *
              audioDistortion *
              Math.cos(time * 0.003)
            : 0;
          const trebleWave = config.enableAudioVisualization
            ? Math.sin((x + time) * 0.03) * trebleLevel * 10
            : 0;

          ctx.lineTo(x, y + audioWave + trebleWave);
        }

        if (config.enableAudioVisualization && averageLevel > 0.3) {
          ctx.strokeStyle = `rgba(${colors.accent.join(",")}, ${
            0.3 + averageLevel * 0.4
          })`;
        }

        ctx.stroke();
      }

      if (config.enableAudioVisualization && isPlaying) {
        for (let x = 0; x <= canvas.width; x += gridSize) {
          for (let y = 0; y <= canvas.height; y += gridSize) {
            const distance = Math.sqrt(
              Math.pow(x - canvas.width / 2, 2) +
                Math.pow(y - canvas.height / 2, 2)
            );
            const audioInfluence =
              Math.sin(distance * 0.01 + time * 0.01) * averageLevel;

            if (audioInfluence > 0.3) {
              ctx.save();
              ctx.globalAlpha = audioInfluence;
              ctx.fillStyle = `rgb(${colors.secondary.join(",")})`;
              ctx.shadowBlur = audioInfluence * 20;
              ctx.shadowColor = `rgb(${colors.primary.join(",")})`;

              ctx.beginPath();
              ctx.arc(x, y, audioInfluence * 5, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
        }
      }

      ctx.restore();
    },
    [getThemeColors, audioAnalysis, config.enableAudioVisualization, isPlaying]
  );

  const renderMatrix = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const colors = getThemeColors();
      const { bassFreq } = audioAnalysis;

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);

      ctx.fillStyle = `rgba(0, 0, 0, ${
        config.enableAudioVisualization && isPlaying ? 0.05 : 0.1
      })`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns; i++) {
        const audioIndex = Math.floor((i / columns) * bassFreq.length);
        const audioValue = config.enableAudioVisualization
          ? (bassFreq[audioIndex] || 0) / 255
          : 0.1;

        const dropSpeed = config.enableAudioVisualization
          ? Math.max(0.5, audioValue * 3)
          : 1;

        if (Math.random() < dropSpeed * 0.1) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = Math.random() * canvas.height;

          const intensity = config.enableAudioVisualization
            ? Math.min(1, 0.3 + audioValue * 0.7)
            : 0.5;

          let color;
          if (audioValue > 0.7) {
            color = `rgba(${colors.secondary.join(",")}, ${intensity})`;
          } else if (audioValue > 0.4) {
            color = `rgba(${colors.primary.join(",")}, ${intensity})`;
          } else {
            color = `rgba(${colors.accent.join(",")}, ${intensity})`;
          }

          ctx.fillStyle = color;

          if (config.enableAudioVisualization && audioValue > 0.6) {
            ctx.shadowBlur = audioValue * 15;
            ctx.shadowColor = color;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fillText(char, x, y);
        }
      }
    },
    [getThemeColors, audioAnalysis, config.enableAudioVisualization, isPlaying]
  );

  const renderMinimal = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const colors = getThemeColors();
      const { averageLevel, bassLevel } = audioAnalysis;

      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );

      if (config.enableAudioVisualization && isPlaying) {
        const intensity1 = 0.1 + averageLevel * 0.2;
        const intensity2 = 0.05 + bassLevel * 0.15;

        gradient.addColorStop(
          0,
          `rgba(${colors.primary.join(",")}, ${intensity1})`
        );
        gradient.addColorStop(
          0.5,
          `rgba(${colors.secondary.join(",")}, ${intensity2})`
        );
        gradient.addColorStop(
          1,
          `rgba(${colors.accent.join(",")}, ${intensity1})`
        );
      } else {
        gradient.addColorStop(0, `rgba(${colors.primary.join(",")}, 0.1)`);
        gradient.addColorStop(0.5, `rgba(${colors.secondary.join(",")}, 0.05)`);
        gradient.addColorStop(1, `rgba(${colors.accent.join(",")}, 0.1)`);
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (config.enableAudioVisualization && isPlaying && averageLevel > 0.3) {
        const overlayGradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) / 2
        );

        overlayGradient.addColorStop(
          0,
          `rgba(${colors.secondary.join(",")}, ${averageLevel * 0.1})`
        );
        overlayGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = overlayGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    },
    [getThemeColors, audioAnalysis, config.enableAudioVisualization, isPlaying]
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    timeRef.current += 0.016;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.globalAlpha = backgroundOpacity;

    switch (config.mode) {
      case "particles":
        renderParticles(ctx, canvas);
        break;
      case "neural":
        renderNeuralNetwork(ctx);
        break;
      case "hologram":
        renderHologram(ctx, canvas);
        break;
      case "matrix":
        renderMatrix(ctx, canvas);
        break;
      case "minimal":
        renderMinimal(ctx, canvas);
        break;
      case "adaptive":
        switch (currentSection) {
          case "home":
            renderParticles(ctx, canvas);
            break;
          case "about":
            renderMinimal(ctx, canvas);
            break;
          case "skills":
            renderNeuralNetwork(ctx);
            break;
          case "projects":
            renderHologram(ctx, canvas);
            break;
          case "contact":
            renderMatrix(ctx, canvas);
            break;
          default:
            renderParticles(ctx, canvas);
        }
        break;
      default:
        renderParticles(ctx, canvas);
    }

    ctx.restore();

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [
    config.mode,
    currentSection,
    backgroundOpacity,
    renderParticles,
    renderNeuralNetwork,
    renderHologram,
    renderMatrix,
    renderMinimal,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (config.mode === "particles" || config.mode === "adaptive") {
        initializeParticles(canvas);
      }
      if (config.mode === "neural" || config.mode === "adaptive") {
        initializeNeuralNodes(canvas);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config.mode, initializeParticles, initializeNeuralNodes, animate]);

  const shouldRender = useMemo(() => {
    if (deviceDetection.isMobile && config.performanceMode === "auto") {
      return config.intensity !== "high";
    }
    return true;
  }, [deviceDetection.isMobile, config.performanceMode, config.intensity]);

  if (!shouldRender) {
    return (
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg,
            rgba(${getThemeColors().primary.join(",")}, 0.05) 0%,
            rgba(${getThemeColors().secondary.join(",")}, 0.03) 50%,
            rgba(${getThemeColors().accent.join(",")}, 0.05) 100%)`,
          opacity: backgroundOpacity,
        }}
      />
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: backgroundOpacity }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          mixBlendMode: isDark ? "screen" : "multiply",
        }}
      />

      {config.enableAudioVisualization && isPlaying && (
        <div className="absolute top-4 left-4 z-10">
          <motion.div
            className="flex items-center space-x-2 px-3 py-1 rounded-full backdrop-blur-md"
            style={{
              backgroundColor: `rgba(${getThemeColors().primary.join(
                ","
              )}, 0.1)`,
              border: `1px solid rgba(${getThemeColors().primary.join(
                ","
              )}, 0.2)`,
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: `rgb(${getThemeColors().secondary.join(",")})`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-xs font-medium opacity-70">
              Audio Visualization Active
            </span>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default GlobalBackground;

