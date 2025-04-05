import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  Sphere,
  MeshDistortMaterial,
  Environment,
  useTexture,
  Plane,
} from "@react-three/drei";
import {
  EffectComposer,
  Glitch,
  Noise,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

// FEATURE 1: Interactive 3D Error Code - Simplified and error-proofed
const FloatingErrorCode = ({ isGlitching }) => {
  const textRef = useRef(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!textRef.current) return;

    const time = state.clock.getElapsedTime();
    textRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    textRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    textRef.current.rotation.z = Math.cos(time * 0.2) * 0.05;

    // Apply glitch effect
    if (isGlitching) {
      textRef.current.position.x += (Math.random() - 0.5) * 0.1;
      textRef.current.position.y += (Math.random() - 0.5) * 0.1;
    }
  });

  return (
    <Text
      ref={textRef}
      position={[0, 0, 0]}
      fontSize={viewport.width / 12}
      color="#f0f0f0"
      font="/fonts/Orbitron-Bold.ttf"
      letterSpacing={0.1}
      textAlign="center"
    >
      404
      <meshStandardMaterial
        color="#8B5CF6"
        emissive="#8B5CF6"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </Text>
  );
};

// FEATURE 2: Reactive Distortion Sphere - Completely rewritten
const ReactiveDistortSphere = ({ mousePosition, isGlitching }) => {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState([0, 0, -2]);

  // Use state for position to avoid direct ref manipulation in animation frame
  useFrame(() => {
    if (!meshRef.current || !mousePosition) return;

    const targetX = (mousePosition[0] || 0) / 5;
    const targetY = (mousePosition[1] || 0) / 5;

    setPosition(prev => [
      THREE.MathUtils.lerp(prev[0], targetX, 0.1),
      THREE.MathUtils.lerp(prev[1], targetY, 0.1),
      prev[2]
    ]);
  });

  return (
    <Sphere
      args={[1, 64, 64]}
      position={position}
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <MeshDistortMaterial
        color="#EC4899"
        envMapIntensity={0.8}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
        metalness={0.9}
        distort={hovered ? 0.6 : 0.3}
        speed={isGlitching ? 5 : 2}
      />
    </Sphere>
  );
};

// FEATURE 3: Digital Grid Floor - Simplified
const DigitalGrid = () => {
  // Handle potential texture loading errors
  const gridTexture = useTexture("/images/grid.png", (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }, () => {
    console.error("Failed to load grid texture");
  });

  return (
    <Plane
      args={[40, 40]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
    >
      <meshStandardMaterial
        map={gridTexture}
        transparent
        opacity={0.2}
        color="#8B5CF6"
        emissive="#8B5CF6"
        emissiveIntensity={0.5}
      />
    </Plane>
  );
};

// FEATURE 4: Post-processing Effects - Unchanged but wrapped in error boundary
const Effects = ({ isGlitching }) => {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={1.5}
      />
      <Noise opacity={0.1} blendFunction={BlendFunction.OVERLAY} />
      <ChromaticAberration
        offset={isGlitching ? [0.01, 0.01] : [0.002, 0.002]}
      />
      <Glitch
        delay={[1.5, 3.5]}
        duration={[0.1, 0.3]}
        strength={isGlitching ? [0.3, 0.6] : [0.01, 0.02]}
        mode={1}
        active={true}
      />
    </EffectComposer>
  );
};

// FEATURE 5: Holographic Terminal - Simplified and updated text
const HolographicTerminal = ({ pathAttempted, countdown }) => {
  const [terminalLines, setTerminalLines] = useState([]);
  const terminalRef = useRef(null);

  useEffect(() => {
    // Simulate terminal output
    const lines = [
      { text: "> SYSTEM ERROR: Route not found", delay: 300 },
      { text: `> Attempted to access: ${pathAttempted || "unknown path"}`, delay: 800 },
      { text: "> Running diagnostics...", delay: 1500 },
      { text: "> ERROR CODE: 404", delay: 2000 },
      { text: "> CRITICAL: Neural pathway disconnected", delay: 2800 },
      {
        text: `> System status: T-${countdown || 0}s until lockdown`, // Changed from auto-redirect
        delay: 3500,
      },
      { text: "> Manual navigation required", delay: 4200 }, // Changed message
    ];

    // Clear any existing timeouts to prevent memory leaks
    const timeouts = [];

    lines.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setTerminalLines(prev => [...prev, line.text]);

        // Auto-scroll to bottom
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, line.delay);

      timeouts.push(timeout);
    });

    // Cleanup function to clear all timeouts
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [pathAttempted, countdown]);

  return (
    <motion.div
      className="bg-black/80 border border-purple-500/50 rounded-md p-4 font-mono text-sm text-green-400 max-h-48 overflow-y-auto w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      ref={terminalRef}
    >
      {terminalLines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={line.includes("ERROR") ? "text-red-400" : ""}
        >
          {line}
          {index === terminalLines.length - 1 && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              _
            </motion.span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

// FEATURE 6: Biometric Scanner - Simplified
const BiometricScanner = ({ onComplete }) => {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [fingerprint, setFingerprint] = useState(null);

  const generateFingerprint = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");

      if (!ctx) return null;

      // Draw fingerprint pattern
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, 200, 200);

      ctx.strokeStyle = "#8B5CF6";
      ctx.lineWidth = 0.5;

      // Generate random arcs for fingerprint
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        const radius = Math.random() * 50 + 20;
        const startAngle = Math.random() * Math.PI * 2;
        const endAngle = startAngle + Math.random() * Math.PI;

        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle);
        ctx.stroke();
      }

      return canvas.toDataURL();
    } catch (error) {
      console.error("Error generating fingerprint:", error);
      return null;
    }
  };

  useEffect(() => {
    setFingerprint(generateFingerprint());
  }, []);

  useEffect(() => {
    if (!scanning) return;

    let intervalId = null;

    intervalId = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(intervalId);
          setTimeout(() => {
            setScanComplete(true);
            if (onComplete && typeof onComplete === 'function') {
              onComplete();
            }
          }, 500);
          return 100;
        }
        return next;
      });
    }, 50);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [scanning, onComplete]);

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        className="text-xs text-purple-400 uppercase tracking-widest mb-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {scanComplete
          ? "Identity Verified"
          : scanning
          ? "Scanning..."
          : "Place Finger to Verify"}
      </motion.div>

      <motion.div
        className="w-16 h-20 border-2 border-purple-500/50 rounded-lg overflow-hidden relative cursor-pointer"
        whileHover={{ scale: 1.05, borderColor: "rgba(139, 92, 246, 0.8)" }}
        onClick={() => !scanning && setScanning(true)}
      >
        {fingerprint && (
          <img
            src={fingerprint}
            alt="Fingerprint"
            className="w-full h-full object-cover opacity-30"
          />
        )}

        {scanning && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0"
            initial={{ top: "-100%" }}
            animate={{ top: "100%" }}
            transition={{
              duration: 2,
              repeat: scanProgress < 100,
              repeatType: "loop",
            }}
          />
        )}

        {scanComplete && (
          <motion.div
            className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {scanning && !scanComplete && (
        <motion.div className="w-full mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
            style={{ width: `${scanProgress}%` }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

// FEATURE 7: Neural Network Visualization - Completely rewritten
const NeuralNetworkVisualization = ({ isGlitching }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Store nodes and connections in refs to avoid re-renders
  const nodesRef = useRef([]);
  const connectionsRef = useRef([]);
  const isMountedRef = useRef(true);

  // Initialize nodes and connections
  useEffect(() => {
    const nodeCount = 20;
    const newNodes = [];

    for (let i = 0; i < nodeCount; i++) {
      newNodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
      });
    }

    nodesRef.current = newNodes;

    // Create connections between nodes
    const newConnections = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() > 0.85) {
          newConnections.push([i, j]);
        }
      }
    }

    connectionsRef.current = newConnections;

        // Handle window resize
    const handleResize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    };

    // Set initial size
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Update canvas size
    if (canvasRef.current) {
      canvasRef.current.width = canvasSize.width;
      canvasRef.current.height = canvasSize.height;
    }

    const render = () => {
      if (!isMountedRef.current || !canvasRef.current || !ctx) return;

      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      // Update and draw nodes
      nodesRef.current = nodesRef.current.map(node => {
        // Move nodes
        let x = node.x + Math.cos(node.angle) * node.speed;
        let y = node.y + Math.sin(node.angle) * node.speed;

        // Bounce off edges
        if (x < 0 || x > canvasSize.width) {
          node.angle = Math.PI - node.angle;
          x = Math.max(0, Math.min(canvasSize.width, x));
        }
        if (y < 0 || y > canvasSize.height) {
          node.angle = -node.angle;
          y = Math.max(0, Math.min(canvasSize.height, y));
        }

        // Add some randomness to movement if glitching
        if (isGlitching && Math.random() > 0.7) {
          node.angle += (Math.random() - 0.5) * 0.5;
        }

        return { ...node, x, y };
      });

      // Draw connections
      connectionsRef.current.forEach(([i, j]) => {
        const nodeA = nodesRef.current[i];
        const nodeB = nodesRef.current[j];

        if (!nodeA || !nodeB) return;

        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only draw connections within a certain distance
        if (distance < 150) {
          const opacity = 1 - distance / 150;
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.5})`;
          ctx.lineWidth = opacity;

          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodesRef.current.forEach(node => {
        ctx.fillStyle =
          isGlitching && Math.random() > 0.7
            ? "#EC4899" // Pink during glitch
            : "#8B5CF6"; // Purple normally

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Continue animation loop
      animationRef.current = requestAnimationFrame(render);
    };

    // Start animation
    render();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasSize, isGlitching]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
    />
  );
};

// FEATURE 8: Augmented Reality Overlay - Simplified
const AugmentedRealityOverlay = ({ isGlitching }) => {
  const [targets, setTargets] = useState([]);
  const timeoutsRef = useRef([]);

  // Generate random AR targeting elements
  useEffect(() => {
    const newTargets = [];
    for (let i = 0; i < 5; i++) {
      newTargets.push({
        x: Math.random() * 80 + 10, // percentage
        y: Math.random() * 80 + 10, // percentage
        size: Math.random() * 60 + 40, // pixels
        type: Math.random() > 0.5 ? "circle" : "square",
        analyzing: false,
        analyzed: false,
        data: {
          id: `OBJ-${Math.floor(Math.random() * 1000)}`,
          type: ["Unknown", "Anomaly", "Error", "Artifact"][
            Math.floor(Math.random() * 4)
          ],
          threat: ["Low", "Medium", "High", "Unknown"][
            Math.floor(Math.random() * 4)
          ],
        },
      });
    }
    setTargets(newTargets);

    // Start analyzing targets one by one
    let delay = 1000;
    newTargets.forEach((_, index) => {
      const timeout1 = setTimeout(() => {
        setTargets(prev => {
          if (!prev || prev.length === 0) return [];
          return prev.map((target, i) =>
            i === index ? { ...target, analyzing: true } : target
          );
        });

        // Complete analysis after a delay
        const timeout2 = setTimeout(() => {
          setTargets(prev => {
            if (!prev || prev.length === 0) return [];
            return prev.map((target, i) =>
              i === index
                ? { ...target, analyzing: false, analyzed: true }
                : target
            );
          });
        }, 2000);

        timeoutsRef.current.push(timeout2);
      }, delay);

      timeoutsRef.current.push(timeout1);
      delay += 3000;
    });

    // Cleanup timeouts
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* AR HUD Elements */}
      <div className="absolute top-4 left-4 text-xs font-mono text-purple-400 opacity-70">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SYS://AUGMENTED_REALITY_v3.4
        </motion.div>
        <motion.div
          animate={{ opacity: isGlitching ? [1, 0, 1, 0, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          STATUS: {isGlitching ? "COMPROMISED" : "ACTIVE"}
        </motion.div>
      </div>

      {/* Targeting elements */}
      {targets.map((target, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            width: target.size,
            height: target.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: target.analyzed ? 0.8 : 0.4,
            scale: 1,
            rotate: target.type === "square" ? 45 : 0,
          }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
        >
          {/* Target shape */}
          <div
            className={`
              w-full h-full border border-purple-500
              ${target.type === "circle" ? "rounded-full" : ""}
              ${target.analyzing ? "border-yellow-400" : ""}
              ${target.analyzed ? "border-green-400" : ""}
            `}
          >
            {/* Scanning animation */}
            {target.analyzing && (
              <motion.div
                className="absolute inset-0 border border-yellow-400 rounded-full"
                animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>

          {/* Target data */}
          {target.analyzed && (
            <motion.div
              className="absolute -bottom-16 -right-4 bg-black/70 border border-green-500/30 p-1 text-xs font-mono text-green-400 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div>ID: {target.data.id}</div>
              <div>TYPE: {target.data.type}</div>
              <div>THREAT: {target.data.threat}</div>
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-16 h-16 border border-purple-500/50 rounded-full flex items-center justify-center"
          animate={{
            scale: isGlitching ? [1, 1.1, 0.9, 1] : [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-1 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  );
};

// FEATURE 9: Cybernetic Countdown - Updated text
const CyberneticCountdown = ({ count, isGlitching }) => {
  const digits = String(count || 0).padStart(2, "0").split("");

  return (
    <div className="flex items-center space-x-1">
      <div className="text-xs text-purple-400 uppercase tracking-widest mr-2">
        System Lockdown:
      </div>

      {digits.map((digit, index) => (
        <motion.div
          key={index}
          className="relative w-8 h-10 bg-black/50 border border-purple-500/50 rounded flex items-center justify-center overflow-hidden"
          animate={{
            borderColor: isGlitching
              ? [
                  "rgba(139, 92, 246, 0.5)",
                  "rgba(236, 72, 153, 0.5)",
                  "rgba(139, 92, 246, 0.5)",
                ]
              : "rgba(139, 92, 246, 0.5)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Digit */}
          <motion.div
            className="text-2xl font-mono text-purple-400 font-bold"
            key={`digit-${digit}-${index}`}
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {digit}
          </motion.div>

          {/* Scan line */}
          <motion.div
            className="absolute w-full h-1 bg-purple-500/30"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-purple-500" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-purple-500" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-purple-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-purple-500" />
        </motion.div>
      ))}

      <div className="text-xs text-purple-400 uppercase tracking-widest ml-2">
        sec
      </div>
    </div>
  );
};

// FEATURE 10: DNA Authentication System - Simplified
const DNAAuthentication = ({ onComplete }) => {
  const [authenticating, setAuthenticating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [authenticated, setAuthenticated] = useState(false);
  const [dnaStrands, setDnaStrands] = useState([]);
  const intervalRef = useRef(null);

  // Generate DNA strands
  useEffect(() => {
    const strands = [];
    for (let i = 0; i < 20; i++) {
      strands.push({
        x: i * 10,
        height: Math.random() * 20 + 5,
        color: Math.random() > 0.5 ? "#8B5CF6" : "#EC4899",
        speed: Math.random() * 0.5 + 0.2,
      });
    }
    setDnaStrands(strands);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Authentication process
  useEffect(() => {
    if (!authenticating) return;

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(intervalRef.current);
          setAuthenticated(true);
          if (onComplete && typeof onComplete === 'function') {
            onComplete();
          }
          return 100;
        }
        return next;
      });
    }, 30);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [authenticating, onComplete]);

  // Animate DNA strands
  useEffect(() => {
    if (!authenticating) return;

    const interval = setInterval(() => {
      setDnaStrands(prev =>
        prev.map(strand => ({
          ...strand,
          height: Math.random() * 20 + 5,
          color: Math.random() > 0.5 ? "#8B5CF6" : "#EC4899",
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, [authenticating]);

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
    >
      <motion.div
        className="text-xs text-purple-400 uppercase tracking-widest mb-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {authenticated
          ? "DNA Verified"
          : authenticating
          ? "Analyzing DNA Sequence"
          : "DNA Authentication Required"}
      </motion.div>

      <motion.div
        className="w-48 h-16 border border-purple-500/50 rounded bg-black/30 overflow-hidden relative cursor-pointer"
        whileHover={{ scale: 1.05, borderColor: "rgba(139, 92, 246, 0.8)" }}
        onClick={() => !authenticating && setAuthenticating(true)}
      >
        {/* DNA visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-full items-center space-x-0.5">
            {dnaStrands.map((strand, index) => (
              <motion.div
                key={index}
                className="w-1 rounded-full"
                style={{
                  height: `${strand.height}px`,
                  backgroundColor: strand.color,
                }}
                animate={{
                  height: authenticating
                    ? [`${strand.height}px`, `${Math.random() * 20 + 5}px`]
                    : `${strand.height}px`,
                  backgroundColor:
                    authenticating && Math.random() > 0.7
                      ? ["#8B5CF6", "#EC4899", "#8B5CF6"]
                      : strand.color,
                }}
                transition={{
                  height: {
                    duration: strand.speed,
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                  backgroundColor: { duration: 0.3 },
                }}
              />
            ))}
          </div>
        </div>

        {/* Scanning effect */}
        {authenticating && (
          <motion.div
            className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
            initial={{ left: "-10%" }}
            animate={{ left: "110%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Authentication complete */}
        {authenticated && (
          <motion.div
            className="absolute inset-0 bg-green-500/10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-green-500 font-mono text-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              MATCH FOUND
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {authenticating && !authenticated && (
        <motion.div className="w-full mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

// Main NotFound Component - Completely refactored with no auto-redirect
const NotFound: React.FC = () => {
  const location = useLocation();
  const [count, setCount] = useState(5);
  const [isGlitching, setIsGlitching] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [dnaVerified, setDnaVerified] = useState(false);
  const [showEmergencyProtocol, setShowEmergencyProtocol] = useState(false);
  const [mousePosition, setMousePosition] = useState([0, 0]);

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position for parallax effects
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  // Refs for cleanup
  const timersRef = useRef({
    countdown: null,
    glitch: null,
    emergency: null,
  });

  useEffect(() => {
    // Log error for analytics
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Mouse move handler
    const handleMouseMove = (e) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;

      mouseX.set(x);
      mouseY.set(y);
      setMousePosition([x / window.innerWidth, y / window.innerHeight]);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Countdown timer WITHOUT auto-redirect
    timersRef.current.countdown = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timersRef.current.countdown);
          // No navigation here - removed the auto-redirect
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    // Random glitch effect
    timersRef.current.glitch = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);

    // Show emergency protocol after delay
    timersRef.current.emergency = setTimeout(() => {
      setShowEmergencyProtocol(true);
    }, 2000);

    // Cleanup function
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      // Clear all timers
      if (timersRef.current.countdown)
        clearInterval(timersRef.current.countdown);
      if (timersRef.current.glitch) clearInterval(timersRef.current.glitch);
      if (timersRef.current.emergency)
        clearTimeout(timersRef.current.emergency);
    };
  }, [location.pathname, mouseX, mouseY]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Error boundary wrapper for 3D scene
  const Scene3D = () => {
    try {
      return (
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight
            position={[-10, -10, -10]}
            color="#EC4899"
            intensity={0.5}
          />

          <FloatingErrorCode isGlitching={isGlitching} />
          <ReactiveDistortSphere
            mousePosition={mousePosition}
            isGlitching={isGlitching}
          />
          <DigitalGrid />
          <Environment preset="city" />
          <Effects isGlitching={isGlitching} />
        </Canvas>
      );
    } catch (error) {
      console.error("Error rendering 3D scene:", error);
      return (
        <div className="w-full h-full flex items-center justify-center text-white">
          <div className="text-4xl font-bold">404</div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900/20 to-black overflow-hidden relative">
      {/* Neural Network Background */}
      <NeuralNetworkVisualization isGlitching={isGlitching} />

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>

      {/* Augmented Reality Overlay */}
      <AugmentedRealityOverlay isGlitching={isGlitching} />

      {/* Main content card with glassmorphism */}
      <motion.div
        className="relative z-10 max-w-2xl w-full mx-4"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className={`
            bg-gray-900/70 backdrop-blur-xl p-8 rounded-2xl
            border border-purple-500/30 shadow-2xl
            ${isGlitching ? "glitch-effect" : ""}
          `}
          animate={{
            boxShadow: isGlitching
              ? [
                  "0 0 20px rgba(139, 92, 246, 0.5)",
                  "0 0 40px rgba(236, 72, 153, 0.7)",
                  "0 0 20px rgba(139, 92, 246, 0.5)",
                ]
              : "0 0 20px rgba(139, 92, 246, 0.5)",
          }}
        >
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <motion.h1
              className="text-4xl font-bold mb-2 text-white font-display"
              variants={itemVariants}
            >
              SYSTEM BREACH DETECTED
            </motion.h1>

            <motion.div
              className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"
              variants={itemVariants}
            />

            <motion.p className="text-gray-300 mb-4" variants={itemVariants}>
              The neural pathway you're attempting to access has been corrupted
              or doesn't exist.
            </motion.p>

            <motion.div
              className="text-sm text-pink-400 font-mono mb-6 p-2 bg-black/30 rounded border border-pink-500/20 inline-block"
              variants={itemVariants}
            >
              <motion.span
                animate={{
                  opacity: isGlitching ? [1, 0, 1, 0, 1] : 1,
                  x: isGlitching ? [-2, 2, -1, 1, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                ERROR 404: {location.pathname}
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Terminal and Authentication Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            variants={itemVariants}
          >
            {/* Left Column - Terminal */}
            <motion.div variants={itemVariants}>
              <HolographicTerminal
                pathAttempted={location.pathname}
                countdown={count}
              />
            </motion.div>

            {/* Right Column - Authentication */}
            <motion.div
              className="flex flex-col space-y-6"
              variants={itemVariants}
            >
              <BiometricScanner onComplete={() => setBiometricVerified(true)} />
              <DNAAuthentication onComplete={() => setDnaVerified(true)} />
            </motion.div>
          </motion.div>

          {/* Emergency Protocol Section - Updated text */}
          <AnimatePresence>
            {showEmergencyProtocol && (
              <motion.div
                className="border border-red-500/30 rounded-lg p-4 bg-black/30 mb-8"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="flex items-center justify-between mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-red-500 font-mono text-sm font-bold flex items-center">
                    <motion.div
                      className="w-2 h-2 bg-red-500 rounded-full mr-2"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    EMERGENCY PROTOCOL ACTIVATED
                  </div>
                  <CyberneticCountdown
                    count={count}
                    isGlitching={isGlitching}
                  />
                </motion.div>

                <motion.div
                  className="text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p>
                    Please use the navigation options below to return to a safe
                    node.
                  </p>
                  <div className="mt-2 flex items-center">
                    <div className="text-xs text-gray-500 mr-2">
                      SECURITY STATUS:
                    </div>
                    <div
                      className={`text-xs ${
                        biometricVerified && dnaVerified
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {biometricVerified && dnaVerified
                        ? "FULLY AUTHENTICATED"
                        : biometricVerified || dnaVerified
                        ? "PARTIAL AUTHENTICATION"
                        : "AUTHENTICATION REQUIRED"}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            variants={itemVariants}
          >
            <Link to="/">
              <motion.button
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg
                          shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                          border border-purple-500/50 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Button glow effect */}
                <motion.span
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/0 via-white/80 to-pink-600/0"
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "100%", opacity: 0.5 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                    repeatDelay: 0.5,
                  }}
                />

                <span className="relative z-10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Return to Home</span>
                </span>
              </motion.button>
            </Link>

            <motion.button
              className="w-full sm:w-auto px-8 py-3 bg-transparent text-purple-400 font-medium rounded-lg
                        border border-purple-500/30 hover:border-purple-500/70 transition-all duration-300"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
                <span>Go Back</span>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Decorative circuit lines */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10"
          viewBox="0 0 400 300"
          fill="none"
        >
          <motion.path
            d="M0,150 C100,50 300,250 400,150"
            stroke="url(#purpleGradient)"
            strokeWidth="0.5"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,100 C150,200 250,0 400,100"
            stroke="url(#pinkGradient)"
            strokeWidth="0.5"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
          <defs>
            <linearGradient
              id="purpleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Scan line effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-40 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 2px)",
        }}
      />

      {/* Glitch overlay effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay"
        animate={{
          opacity: isGlitching ? [0, 0.05, 0.02, 0.03, 0] : 0,
        }}
        style={{
          backgroundImage:
            'url("data:image/png;base64,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")',
          backgroundSize: "200px 200px",
        }}
      />

      {/* Binary code background for cyberpunk effect */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="text-xs text-purple-500 font-mono whitespace-nowrap"
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, y: -100 }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [0, window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          >
            {Array.from({ length: 20 }, () => Math.round(Math.random())).join(
              ""
            )}
          </motion.div>
        ))}
      </div>

      {/* Floating data particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFound;



