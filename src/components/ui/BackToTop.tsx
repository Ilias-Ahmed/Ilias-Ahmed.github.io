import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { triggerHapticFeedback } from "@/utils/haptics";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isScrolling, setIsScrolling] = useState(false);
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > threshold);

      // Detect active scrolling for animation
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    triggerHapticFeedback();
  };

  // Position classes
  const positionClasses = {
    "bottom-right": "bottom-8 right-8",
    "bottom-left": "bottom-8 left-8",
    "bottom-center": "bottom-8 left-1/2 -translate-x-1/2",
  };

  // Get CSS custom properties that are already set by ThemeContext
  const primaryColor = `hsl(var(--primary))`;
  const primaryGlow = `hsl(var(--primary) / 0.25)`;
  const borderColor = `hsl(var(--primary) / 0.5)`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className={`fixed z-50 ${
            isMobile ? "p-4 min-w-[56px] min-h-[56px]" : "p-3"
          } rounded-full border-2 shadow-2xl transition-all duration-300 ${
            isDark
              ? "bg-gray-900/90 hover:bg-gray-800/90"
              : "bg-white/90 hover:bg-white/95"
          } flex items-center justify-center ${
            positionClasses[position]
          } ${className}`}
          style={{
            borderColor: borderColor,
            boxShadow: `0 4px 20px ${primaryGlow}`,
            backgroundColor: isDark
              ? "rgba(17, 24, 39, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          aria-label="Back to top"
        >
          <ArrowUp size={isMobile ? 24 : 20} style={{ color: primaryColor }} />

          {/* Active scroll indicator */}
          {isScrolling && (
            <motion.div
              className="absolute -inset-1 rounded-full border-2 border-opacity-30"
              style={{ borderColor: primaryColor }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Subtle pulse effect */}
          <motion.div
            className="absolute -inset-2 rounded-full border border-opacity-20"
            style={{ borderColor: primaryColor }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
