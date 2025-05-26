import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { CertificationItem } from "./aboutData";
import { triggerHapticFeedback } from "@/utils/haptics";

interface CertificationsGalleryProps {
  certifications: CertificationItem[];
}

const CertificationsGallery = ({
  certifications,
}: CertificationsGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
            }}
          >
            Certifications & Achievements
          </span>
        </h3>
        <p className="opacity-70 max-w-2xl mx-auto">
          Professional qualifications and recognitions that validate my
          expertise and commitment to continuous learning
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar pb-8 cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex gap-6 px-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-[300px] h-[400px] relative rounded-xl overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: `linear-gradient(to top, ${
                    isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)"
                  } 0%, ${
                    isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)"
                  } 50%, transparent 100%)`,
                }}
              />
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span
                    className="inline-block px-3 py-1 text-xs rounded-full mb-3"
                    style={{
                      backgroundColor: `${accentColors.primary}20`,
                      color: accentColors.primary,
                    }}
                  >
                    {cert.date}
                  </span>
                  <h4 className="text-xl font-bold mb-2">{cert.title}</h4>
                  <p className="opacity-80 text-sm">{cert.issuer}</p>

                  <motion.button
                    className="mt-4 px-4 py-2 text-sm rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundColor: `${accentColors.primary}20`,
                      color: accentColors.primary,
                    }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: `${accentColors.primary}40`,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>View Certificate</span>
                    <span>→</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {certifications.map((_, index) => (
          <button
            key={index}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                activeIndex === index
                  ? accentColors.primary
                  : isDark
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)",
              transform: activeIndex === index ? "scale(1.25)" : "scale(1)",
            }}
            onClick={() => {
              triggerHapticFeedback();
              setActiveIndex(index);
              if (scrollRef.current) {
                scrollRef.current.scrollTo({
                  left: index * 320,
                  behavior: "smooth",
                });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CertificationsGallery;
