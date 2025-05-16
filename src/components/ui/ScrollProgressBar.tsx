import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";

interface ScrollProgressBarProps {
  progress?: number;
}

const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ progress }) => {
  const { scrollYProgress } = useScroll();
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [visible, setVisible] = useState(false);

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

  return (
    <>
      {visible && (
        <motion.div className="fixed top-0 left-0 right-0 z-100 h-1 bg-transparent">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            style={{
              scaleX: progress !== undefined ? progress : scrollYProgress,
              transformOrigin: "0%",
            }}
          />
          <div className="absolute left-4 top-2 text-xs font-medium text-cyberpunk-purple">
            {scrollPercentage}%
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ScrollProgressBar;
