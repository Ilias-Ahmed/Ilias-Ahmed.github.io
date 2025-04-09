import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BiometricScannerProps {
  onComplete: () => void;
}

const BiometricScanner: React.FC<BiometricScannerProps> = ({ onComplete }) => {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  const generateFingerprint = (): string | null => {
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

    let intervalId: NodeJS.Timeout | null = null;

    intervalId = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          if (intervalId) clearInterval(intervalId);
          setTimeout(() => {
            setScanComplete(true);
            onComplete();
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
              repeat: scanProgress < 100 ? Infinity : 0,
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
export default BiometricScanner;
