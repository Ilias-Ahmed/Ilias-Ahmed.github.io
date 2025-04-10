import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { AugmentedRealityOverlay, BiometricScanner, CyberneticCountdown, DNAAuthentication, HolographicTerminal, NeuralNetworkVisualization, Scene3D } from "@/components/notFound";

const NotFound: React.FC = () => {
  const location = useLocation();
  const [count, setCount] = useState(5);
  const [isGlitching, setIsGlitching] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [dnaVerified, setDnaVerified] = useState(false);
  const [showEmergencyProtocol, setShowEmergencyProtocol] = useState(false);
  const [mousePosition, setMousePosition] = useState<[number, number] | null>(
    null
  );
  const [showFallback, setShowFallback] = useState(false);

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position for parallax effects
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  // Refs for cleanup
  const timersRef = useRef<{
    countdown: NodeJS.Timeout | null;
    glitch: NodeJS.Timeout | null;
    emergency: NodeJS.Timeout | null;
  }>({
    countdown: null,
    glitch: null,
    emergency: null,
  });

  useEffect(() => {
    // Try to catch any errors with Three.js
    try {
      // Log error for analytics
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );

      // Mouse move handler
      const handleMouseMove = (e: MouseEvent) => {
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
            if (timersRef.current.countdown) {
              clearInterval(timersRef.current.countdown);
            }
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
    } catch (error) {
      console.error("Error in NotFound component:", error);
      setShowFallback(true);
    }
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

  // Fallback simple 404 page if there are errors with Three.js
  if (showFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-gray-800/80 backdrop-blur-lg p-8 rounded-xl border border-purple-500/30 shadow-xl"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Page Not Found
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>

            <p className="text-gray-300 mb-6">
              The page you're looking for doesn't exist or has been moved to
              another location.
            </p>

            <div className="text-sm text-pink-400 font-mono mb-8 p-2 bg-black/30 rounded border border-pink-500/20 inline-block">
              ERROR 404: {location.pathname}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/">
              <motion.button
                className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg
                          shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Return to Home
              </motion.button>
            </Link>

            <motion.button
              className="w-full sm:w-auto px-6 py-2 bg-transparent text-purple-400 font-medium rounded-lg
                        border border-purple-500/30 hover:border-purple-500/70 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900/20 to-black overflow-hidden relative">
      {/* Neural Network Background */}
      <NeuralNetworkVisualization isGlitching={isGlitching} />

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        {/* Wrap in error boundary */}
        <ErrorCatcher>
          <Scene3D isGlitching={isGlitching} mousePosition={mousePosition} />
        </ErrorCatcher>
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

// Simple error catcher component
const ErrorCatcher: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return null;
  }

  return <>{children}</>;
};

export default NotFound;

