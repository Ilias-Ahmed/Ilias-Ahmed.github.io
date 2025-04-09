import React, { useRef, useEffect, useState } from "react";

interface NeuralNetworkVisualizationProps {
  isGlitching: boolean;
}

interface Node {
  x: number;
  y: number;
  radius: number;
  speed: number;
  angle: number;
}

type Connection = [number, number];

const NeuralNetworkVisualization: React.FC<NeuralNetworkVisualizationProps> = ({
  isGlitching,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Store nodes and connections in refs to avoid re-renders
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const isMountedRef = useRef(true);

  // Initialize nodes and connections
  useEffect(() => {
    const nodeCount = 20;
    const newNodes: Node[] = [];

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
    const newConnections: Connection[] = [];
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
          height: window.innerHeight,
        });
      }
    };

    // Set initial size
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
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
      nodesRef.current = nodesRef.current.map((node) => {
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
      nodesRef.current.forEach((node) => {
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

export default NeuralNetworkVisualization;
