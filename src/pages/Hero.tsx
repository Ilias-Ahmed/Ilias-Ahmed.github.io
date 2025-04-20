import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { triggerHapticFeedback } from "@/utils/haptics";

const Hero = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Lightweight mouse tracking for subtle effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse move calculations for performance
      if (!window.requestAnimationFrame) return;

      window.requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        setMousePosition({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Navigation handlers
  const handleExploreClick = () => navigate("/about");
  const handleContactClick = () => navigate("/contact");

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20"
        style={{
          transform: `translate(${mousePosition.x * 10}px, ${
            mousePosition.y * 10
          }px)`,
        }}
      />

      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-grid-pattern" />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col justify-center items-center px-4 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full text-center"
        >
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6"
          >
            <motion.div
              animate={{
                color: isHovered ? "#EC4899" : "#8B5CF6",
              }}
              transition={{ duration: 0.3 }}
              className="inline-block text-xl md:text-2xl font-mono mb-4"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              &lt; Hello World /&gt;
            </motion.div>
          </motion.div>

          {/* Name and title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white font-display"
          >
            I'm{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
              style={{
                backgroundPosition: `${50 + mousePosition.x * 20}% ${
                  50 + mousePosition.y * 20
                }%`,
              }}
            >
              Ilias Ahmed
            </span>
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"
          />

          {/* Profession */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Web Developer & Creative Coder
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8"
          >
            {/* Explore button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg
                        shadow-lg transition-all duration-300 relative overflow-hidden"
              onClick={() => {
                handleExploreClick()
                triggerHapticFeedback()
              }
              }
            >
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
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
                <span>Explore My Work</span>
              </span>
            </motion.button>

            {/* Contact button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -2,
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-3 bg-transparent text-purple-400 font-medium rounded-lg
                        border border-purple-500/30 transition-all duration-300"
              onClick={() => {
                handleContactClick()
                triggerHapticFeedback()
              }
              }
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>Let's Connect</span>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-xs text-purple-400 uppercase tracking-widest mb-2">
            Scroll Down
          </span>
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            className="w-6 h-10 border-2 border-purple-500/50 rounded-full flex justify-center p-1"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-1.5 h-1.5 bg-purple-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
