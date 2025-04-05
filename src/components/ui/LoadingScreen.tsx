import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);
  const { theme } = useTheme();
  const [quote, setQuote] = useState("");
  const [typedQuote, setTypedQuote] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);

  const quotes = [
    "Dream big, work hard, stay focused.",
    "Every great design begins with an even better story.",
    "Innovation distinguishes between a leader and a follower.",
    "The only limit is your imagination.",
    "The future belongs to those who believe in the beauty of their dreams.",
  ];

  // Handle typing effect for quotes
  useEffect(() => {
    if (!quote) return;

    if (typingIndex < quote.length) {
      const timeout = setTimeout(() => {
        setTypedQuote(prev => prev + quote[typingIndex]);
        setTypingIndex(prev => prev + 1);
      }, 40);

      return () => clearTimeout(timeout);
    }
  }, [quote, typingIndex]);

  useEffect(() => {
    // Set initial quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    // Simulate loading with incremental progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const increment = Math.random() > 0.7
          ? 0.5 // Occasional slow progress
          : Math.max(1, Math.floor((100 - prevProgress) / 10));

        const nextProgress = Math.min(100, prevProgress + increment);

        // Update quote every 25% progress
        if (Math.floor(nextProgress / 25) > Math.floor(prevProgress / 25)) {
          const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
          setQuote(newQuote);
          setTypedQuote("");
          setTypingIndex(0);
        }

        if (nextProgress === 100) {
          clearInterval(interval);

          // Trigger exit animation after reaching 100%
          setTimeout(() => {
            setExitAnimation(true);

            // Complete loading after exit animation
            setTimeout(() => {
              setLoadingComplete(true);
              if (onLoadingComplete) onLoadingComplete();
            }, 2600);
          }, 1000);
        }

        return nextProgress;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onLoadingComplete, quotes]);

  if (loadingComplete) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center">
        {/* Left Curtain */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2 bg-background border-r border-primary/30 z-20"
          initial={{ x: 0 }}
          animate={{ x: exitAnimation ? "-100%" : 0 }}
          transition={{
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
            {/* Decorative grid lines */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            {/* Animated circuit paths */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                d="M50,0 C30,30 70,70 50,100"
                stroke="url(#leftGradient)"
                strokeWidth="0.2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d="M70,0 C40,40 80,60 70,100"
                stroke="url(#leftGradient)"
                strokeWidth="0.2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              />
              <defs>
                <linearGradient id="leftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Left side content */}
            <div className="flex flex-col items-center">
              {/* Logo */}
              <motion.div
                className="relative mb-8 w-20 h-20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-full h-full bg-gradient-to-r from-primary to-accent rounded-lg shadow-lg shadow-primary/30 flex items-center justify-center"
                  animate={{
                    rotate: [0, 360],
                    boxShadow: [
                      "0 0 10px rgba(139, 92, 246, 0.3)",
                      "0 0 20px rgba(139, 92, 246, 0.6)",
                      "0 0 10px rgba(139, 92, 246, 0.3)",
                    ],
                  }}
                  transition={{
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <div className="text-white font-bold text-2xl">IA</div>
                </motion.div>
              </motion.div>

              {/* Loading Text */}
              <motion.div
                className="text-sm text-muted-foreground font-mono mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {progress < 30
                  ? "Initializing systems..."
                  : progress < 60
                  ? "Loading resources..."
                  : progress < 90
                  ? "Preparing interface..."
                  : "Almost ready..."}
              </motion.div>
            </div>

            {/* Edge glow */}
            <motion.div
              className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Right Curtain */}
        <motion.div
          className="absolute top-0 bottom-0 right-0 w-1/2 bg-background border-l border-primary/30 z-20"
          initial={{ x: 0 }}
          animate={{ x: exitAnimation ? "100%" : 0 }}
          transition={{
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
            {/* Decorative grid lines */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            {/* Animated circuit paths */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                d="M50,0 C70,30 30,70 50,100"
                stroke="url(#rightGradient)"
                strokeWidth="0.2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d="M30,0 C60,40 20,60 30,100"
                stroke="url(#rightGradient)"
                strokeWidth="0.2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              />
              <defs>
                <linearGradient id="rightGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity="0" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Right side content */}
            <div className="flex flex-col items-center">
              {/* Progress Percentage */}
              <motion.div
                className="text-4xl font-bold text-primary mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {Math.floor(progress)}%
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                className="w-48 h-2 bg-gray-800/50 rounded-full mb-6 overflow-hidden relative"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "12rem", opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Main progress fill */}
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-purple-500 to-accent rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />

                {/* Animated glow effect */}
                <motion.div
                  className="absolute top-0 h-full w-4 bg-white blur-sm"
                  initial={{ left: "0%" }}
                  animate={{ left: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>

            {/* Edge glow */}
            <motion.div
              className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-accent/0 via-accent/50 to-accent/0"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Center content (visible behind the curtains) */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="max-w-md text-center px-6">
            {/* Quote Display */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.p
                className="text-lg text-muted-foreground italic"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                "{typedQuote}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  |
                </motion.span>
                "
              </motion.p>
            </motion.div>

            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/50"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: 0,
                  }}
                  animate={{
                    y: [null, Math.random() * -100 - 50],
                    scale: [0, 1, 0],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Exit animation flash */}
        {exitAnimation && (
          <motion.div
            className="absolute inset-0 bg-white z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 1, times: [0, 0.5, 1] }}
          />
        )}
      </div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
