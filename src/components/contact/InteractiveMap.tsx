import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const InteractiveMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulated map with canvas
    if (!mapContainerRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = mapContainerRef.current.clientWidth;
    canvas.height = 220;

    // Add canvas to the DOM
    mapContainerRef.current.appendChild(canvas);

    // Draw cosmic map-like pattern
    ctx.fillStyle = "rgba(15, 15, 20, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 0.5;

    const cellSize = 20;

    // Vertical lines
    for (let x = 0; x <= canvas.width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw stars
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 1.5;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
      ctx.fill();
    }

    // Draw location marker
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Pulsating circle
    const drawPulse = () => {
      if (!ctx) return;

      // Clear previous state
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw background
      ctx.fillStyle = "rgba(15, 15, 20, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Redraw grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Redraw stars with twinkling effect
      const time = Date.now() * 0.001;

      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5;
        const twinkle = Math.sin(time + i) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.5 + 0.3})`;
        ctx.fill();
      }

      // Current time for animation
      const pulseTime = Date.now() * 0.001;

      // Outer pulse ring
      const pulseRadius = 20 + Math.sin(pulseTime * 2) * 10;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(var(--primary-rgb), 0.1)";
      ctx.fill();

      // Middle ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(var(--primary-rgb), 0.3)";
      ctx.fill();

      // Inner circle - location marker
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "hsl(var(--primary))";
      ctx.fill();

      // Draw cosmic rays from the center
      const rayCount = 8;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + pulseTime * 0.5;
        const rayLength = 30 + Math.sin(pulseTime * 3 + i) * 10;

        const startX = centerX + Math.cos(angle) * 10;
        const startY = centerY + Math.sin(angle) * 10;
        const endX = centerX + Math.cos(angle) * rayLength;
        const endY = centerY + Math.sin(angle) * rayLength;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "rgba(var(--primary-rgb), 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Request next frame
      requestAnimationFrame(drawPulse);
    };

    // Start animation
    drawPulse();

    return () => {
      if (mapContainerRef.current && mapContainerRef.current.contains(canvas)) {
        mapContainerRef.current.removeChild(canvas);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="dark:bg-[#0f0f14] rounded-xl overflow-hidden shadow-lg border border-white/5 cosmic-card"
    >
      <div ref={mapContainerRef} className="w-full h-[195px] relative">
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-sm flex items-center space-x-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span>Kamrup, Assam</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveMap;
