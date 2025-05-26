import { motion } from "framer-motion";
import { Calendar, Briefcase, MessageCircle, Mic, Users } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type AvailabilityTag = {
  icon: React.ReactNode;
  label: string;
};

const AvailabilityBadges = () => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const availabilityTags: AvailabilityTag[] = [
    { icon: <Briefcase size={14} />, label: "Freelance" },
    { icon: <Calendar size={14} />, label: "Full-time" },
    { icon: <MessageCircle size={14} />, label: "Consultation" },
    { icon: <Mic size={14} />, label: "Speaking" },
    { icon: <Users size={14} />, label: "Collaboration" },
  ];

  return (
    <motion.div
      className="p-8 rounded-2xl backdrop-blur-sm border relative overflow-hidden theme-transition"
      style={{
        backgroundColor: isDark
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.8)",
        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      }}
    >
      {/* Cosmic background elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div
          className="absolute top-1/3 left-1/3 w-24 h-24 rounded-full blur-2xl"
          style={{ backgroundColor: `${accentColors.primary}30` }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-32 h-32 rounded-full blur-2xl"
          style={{ backgroundColor: `${accentColors.secondary}30` }}
        />
      </div>

      <h3 className="text-xl font-bold mb-4">Available For</h3>
      <div className="flex flex-wrap gap-3">
        {availabilityTags.map((tag, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{
              scale: 1.05,
              backgroundColor: `${accentColors.primary}20`,
              borderColor: `${accentColors.primary}50`,
              color: accentColors.primary,
            }}
            className="px-3 py-1.5 text-sm rounded-full cursor-default inline-flex items-center space-x-1 border transition-all duration-300"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            {tag.icon}
            <span>{tag.label}</span>
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default AvailabilityBadges;
