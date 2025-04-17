import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface BackToTopProps {
  threshold?: number;
  className?: string;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
}

const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 300,
  className = "",
  position = "bottom-right",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Determine position classes
  const positionClasses = {
    "bottom-right": "bottom-8 right-8",
    "bottom-left": "bottom-8 left-8",
    "bottom-center": "bottom-8 left-1/2 -translate-x-1/2",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className={`fixed z-40 p-3 rounded-full bg-cyberpunk-dark/70 border border-cyberpunk-blue hover:bg-cyberpunk-dark shadow-lg shadow-cyberpunk-blue/20 backdrop-blur-sm ${positionClasses[position]} ${className}`}
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 text-cyberpunk-blue" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
