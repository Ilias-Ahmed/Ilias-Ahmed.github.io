import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Dribbble,
  BookOpen,
} from "lucide-react";

type SocialLink = {
  icon: React.ReactNode;
  url: string;
  label: string;
  color: string;
};

const SocialLinks = () => {
  const socialLinks: SocialLink[] = [
    {
      icon: <Github size={18} />,
      url: "#",
      label: "GitHub",
      color: "group-hover:text-white",
    },
    {
      icon: <Linkedin size={18} />,
      url: "#",
      label: "LinkedIn",
      color: "group-hover:text-blue-400",
    },
    {
      icon: <Twitter size={18} />,
      url: "#",
      label: "Twitter",
      color: "group-hover:text-blue-500",
    },
    {
      icon: <Instagram size={18} />,
      url: "#",
      label: "Instagram",
      color: "group-hover:text-pink-500",
    },
    {
      icon: <Dribbble size={18} />,
      url: "#",
      label: "Dribbble",
      color: "group-hover:text-pink-400",
    },
    {
      icon: <BookOpen size={18} />,
      url: "#",
      label: "Medium",
      color: "group-hover:text-green-400",
    },
  ];

  return (
    <motion.div className="cosmic-card p-8 rounded-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden">
      {/* Cosmic background elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-primary/30 blur-2xl" />
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-accent/30 blur-2xl" />
      </div>

      <h3 className="text-2xl font-bold mb-6">FIND ME ON</h3>
      <div className="grid grid-cols-3 gap-4">
        {socialLinks.map((social, index) => (
          <motion.a
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            href={social.url}
            aria-label={social.label}
            className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-primary/20 rounded-xl transition-all duration-300 group"
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(var(--primary-rgb), 0.4)",
            }}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center bg-white/10 group-hover:bg-white/20 rounded-full mb-2 transition-colors duration-300 ${social.color}`}
            >
              {social.icon}
            </div>
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors duration-300">
              {social.label}
            </span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default SocialLinks;
