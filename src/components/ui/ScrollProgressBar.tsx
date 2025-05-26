import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface ScrollProgressBarProps {
  progress?: number;
}

const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ progress }) => {
  const { scrollYProgress } = useScroll();
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [visible, setVisible] = useState(false);
  const { accent, isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const current = window.scrollY;
      const percentage = Math.round((current / height) * 100);

      setScrollPercentage(percentage);
      setVisible(current > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If progress is provided externally, use it
  useEffect(() => {
    if (progress !== undefined) {
      setScrollPercentage(Math.round(progress * 100));
      setVisible(progress > 0);
    }
  }, [progress]);

  // Get accent-based gradient
  const getAccentGradient = () => {
    const gradients = {
      purple: "from-purple-500 via-violet-500 to-indigo-500",
      blue: "from-blue-500 via-cyan-500 to-sky-500",
      pink: "from-pink-500 via-rose-500 to-red-500",
      green: "from-green-500 via-emerald-500 to-teal-500",
      orange: "from-orange-500 via-amber-500 to-yellow-500",
    };
    return gradients[accent];
  };

  return (
    <>
      {visible && (
        <motion.div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent">
          <motion.div
            className={`h-full bg-gradient-to-r ${getAccentGradient()}`}
            style={{
              scaleX: progress !== undefined ? progress : scrollYProgress,
              transformOrigin: "0%",
            }}
          />
          <div className={`absolute left-4 top-2 text-xs font-medium transition-colors ${
            isDark ? "text-foreground/70" : "text-foreground/80"
          }`}>
            {scrollPercentage}%
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ScrollProgressBar;
