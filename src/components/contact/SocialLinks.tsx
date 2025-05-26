import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Dribbble,
  BookOpen,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";

type SocialLink = {
  icon: React.ReactNode;
  url: string;
  label: string;
  hoverColor: string;
};

const SocialLinks = () => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const socialLinks: SocialLink[] = [
    {
      icon: <Github size={18} />,
      url: "https://github.com/Ilias-Ahmed",
      label: "GitHub",
      hoverColor: "#ffffff",
    },
    {
      icon: <Linkedin size={18} />,
      url: "https://www.linkedin.com/in/ilias-ahmed9613/",
      label: "LinkedIn",
      hoverColor: "#0077b5",
    },
    {
      icon: <Twitter size={18} />,
      url: "https://twitter.com/your-handle",
      label: "Twitter",
      hoverColor: "#1da1f2",
    },
    {
      icon: <Instagram size={18} />,
      url: "https://instagram.com/your-handle",
      label: "Instagram",
      hoverColor: "#e4405f",
    },
    {
      icon: <Dribbble size={18} />,
      url: "https://dribbble.com/your-handle",
      label: "Dribbble",
      hoverColor: "#ea4c89",
    },
    {
      icon: <BookOpen size={18} />,
      url: "https://medium.com/@your-handle",
      label: "Medium",
      hoverColor: "#00ab6c",
    },
  ];

  return (
    <motion.div
      className="p-8 rounded-2xl backdrop-blur-sm border relative overflow-hidden theme-transition"
      style={{
        backgroundColor: isDark
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.8)",
        borderColor: isDark
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.1)",
      }}
    >
      {/* Cosmic background elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div
          className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full blur-2xl"
          style={{ backgroundColor: `${accentColors.primary}30` }}
        />
        <div
          className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full blur-2xl"
          style={{ backgroundColor: `${accentColors.secondary}30` }}
        />
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
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 group border"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
              borderColor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
            }}
            whileHover={{
              y: -5,
              backgroundColor: `${accentColors.primary}20`,
              borderColor: `${accentColors.primary}40`,
              boxShadow: `0 10px 25px -5px ${accentColors.shadow}`,
            }}
            onClick={() => triggerHapticFeedback()}
          >
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full mb-2 transition-all duration-300 group-hover:scale-110"
              style={{
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${social.hoverColor}20`;
                const icon = e.currentTarget.querySelector('svg');
                if (icon) {
                  icon.style.color = social.hoverColor;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.2)";
                const icon = e.currentTarget.querySelector('svg');
                if (icon) {
                  icon.style.color = accentColors.primary;
                }
              }}
            >
              <span style={{ color: accentColors.primary }}>
                {social.icon}
              </span>
            </div>
            <span
              className="text-xs opacity-70 group-hover:opacity-100 transition-all duration-300"
              style={{
                color: "inherit",
              }}
            >
              {social.label}
            </span>
          </motion.a>
        ))}
      </div>

      {/* Additional social stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 pt-6 border-t"
        style={{
          borderColor: isDark
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)",
        }}
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div
              className="text-lg font-bold"
              style={{ color: accentColors.primary }}
            >
              50+
            </div>
            <div className="text-xs opacity-70">Followers</div>
          </div>
          <div>
            <div
              className="text-lg font-bold"
              style={{ color: accentColors.primary }}
            >
              25+
            </div>
            <div className="text-xs opacity-70">Projects</div>
          </div>
          <div>
            <div
              className="text-lg font-bold"
              style={{ color: accentColors.primary }}
            >
              100+
            </div>
            <div className="text-xs opacity-70">Connections</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SocialLinks;
