import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useHeroStore } from "@/hooks/useHero";
import CyberThemeToggle from "../ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

interface NavigationMenuProps {
  currentPath: string;
}

const navItems = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/about", label: "About", icon: "👨‍💻" },
  { path: "/skills", label: "Skills", icon: "🛠️" },
  { path: "/projects", label: "Projects", icon: "🚀" },
  { path: "/contact", label: "Contact", icon: "📬" },
];

const NavigationMenu = ({ currentPath }: NavigationMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { mode } = useHeroStore();
  const { theme, accent, isDark } = useTheme();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  // Handle navigation
  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
      setIsOpen(false);
    },
    [navigate]
  );

  // Dynamic styles
  const accentGradient = useMemo(() => {
    const colors = {
      blue: ["#2563eb", "#60a5fa"],
      green: ["#059669", "#10b981"],
      amber: ["#d97706", "#f59e0b"],
      pink: ["#db2777", "#ec4899"],
      purple: ["#7c3aed", "#8b5cf6"],
    };
    const [light, dark] = colors[accent] ?? colors.purple;
    return `linear-gradient(to right, ${isDark ? dark : light}, ${
      isDark ? light : dark
    })`;
  }, [accent, isDark]);

  const menuBg = useMemo(
    () => (isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)"),
    [isDark]
  );

  const getTextColor = useCallback(
    (isActive: boolean) =>
      isActive
        ? isDark
          ? "text-white"
          : "text-gray-900"
        : isDark
        ? "text-gray-400 hover:text-white"
        : "text-gray-500 hover:text-gray-900",
    [isDark]
  );

  return (
    <>
      {/* Theme Toggle */}
      <div className="fixed top-4 left-4 z-50">
        <CyberThemeToggle isGlitching={false} />
      </div>

      {/* Menu Button */}
      <motion.button
        className={`fixed top-4 right-4 z-50 w-10 h-10 rounded-full backdrop-blur-sm shadow-lg flex items-center justify-center
          border border-${accent}-500/30 ${
          isDark ? "bg-gray-900/70" : "bg-white/70"
        }`}
        style={{
          boxShadow: `0 0 15px ${
            isDark ? "rgba(139,92,246,0.3)" : "rgba(139,92,246,0.2)"
          }`,
        }}
        onClick={() => setIsOpen((prev) => !prev)}
        animate={{ rotate: isOpen ? 45 : 0, scale: isOpen ? 1.2 : 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        data-cursor-hover="true"
      >
        <span className={`text-${accent}-${isDark ? "400" : "500"} text-2xl`}>
          {isOpen ? "✕" : "☰"}
        </span>
      </motion.button>

      {/* Full-Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ clipPath: "circle(0% at 95% 5%)" }}
            animate={{
              clipPath: "circle(150% at 95% 5%)",
              transition: { type: "spring", stiffness: 400, damping: 40 },
            }}
            exit={{
              clipPath: "circle(0% at 95% 5%)",
              transition: { type: "spring", stiffness: 400, damping: 40 },
            }}
          >
            <div
              className="absolute inset-0 backdrop-blur-lg"
              style={{ backgroundColor: menuBg }}
            />

            <nav className="relative z-10">
              <ul className="space-y-6">
                {navItems.map((item) => (
                  <motion.li
                    key={item.path}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                      },
                    }}
                  >
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center text-2xl md:text-4xl font-bold px-6 py-3 rounded-lg transition-all duration-300 group w-full text-left ${getTextColor(
                        currentPath === item.path
                      )}`}
                      data-cursor-hover="true"
                    >
                      <span className="mr-4 text-3xl md:text-5xl transform group-hover:rotate-12 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span className="relative">
                        {item.label}
                        {currentPath === item.path && (
                          <motion.span
                            className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                            style={{ background: accentGradient }}
                            layoutId="activeNavIndicator"
                          />
                        )}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationMenu;
