
import { useState } from "react";
import { motion } from "framer-motion";

interface HoverableIconProps {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const HoverableIcon: React.FC<HoverableIconProps> = ({ 
  icon, 
  size = "md", 
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };
  
  return (
    <motion.div
      className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20"
        animate={{ 
          scale: isHovered ? [1, 1.2, 1.1] : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Multiple rings */}
      {isHovered && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/20"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/40"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}
      
      <motion.div 
        className="relative z-10 text-primary"
        animate={{ 
          rotate: isHovered ? [0, -10, 10, -5, 5, 0] : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
    </motion.div>
  );
};

export default HoverableIcon;
