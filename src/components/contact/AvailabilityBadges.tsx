import { motion } from "framer-motion";
import { Calendar, Briefcase, MessageCircle, Mic, Users } from "lucide-react";

type AvailabilityTag = {
  icon: React.ReactNode;
  label: string;
};

const AvailabilityBadges = () => {
  const availabilityTags: AvailabilityTag[] = [
    { icon: <Briefcase size={14} />, label: "Freelance" },
    { icon: <Calendar size={14} />, label: "Full-time" },
    { icon: <MessageCircle size={14} />, label: "Consultation" },
    { icon: <Mic size={14} />, label: "Speaking" },
    { icon: <Users size={14} />, label: "Collaboration" },
  ];

  return (
    <motion.div className="cosmic-card p-8 rounded-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden">
      {/* Cosmic background elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-1/3 left-1/3 w-24 h-24 rounded-full bg-accent/30 blur-2xl" />
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 rounded-full bg-primary/30 blur-2xl" />
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
              backgroundColor: "rgba(var(--primary-rgb), 0.2)",
            }}
            className="px-3 py-1.5 bg-white/5 text-sm rounded-full border border-white/10 cursor-default inline-flex items-center space-x-1"
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
