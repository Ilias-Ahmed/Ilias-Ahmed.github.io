import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Laptop, Palette, RotateCcw } from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CyberThemeToggleProps {
  className?: string;
  position?: "fixed" | "relative";
  showAccentSelector?: boolean;
  isGlitching?: boolean;
}

const CyberThemeToggle = ({
  className = "",
  position = "fixed",
  showAccentSelector = true,
  isGlitching = false,
}: CyberThemeToggleProps) => {
  // Use state to handle client-side rendering
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [wasClicked, setWasClicked] = useState(false);

  // Get theme context using destructuring
  const {
    theme,
    accent,
    toggleTheme,
    setTheme,
    setAccent,
    systemTheme,
    useSystemTheme,
  } = useTheme();

  // Only show the toggle after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle hover state
  const handleHoverStart = useCallback(() => {
    setIsHovered(true);
    setIsScanning(true);

    // Stop scanning after 2 seconds
    const timer = setTimeout(() => {
      if (!wasClicked) {
        setIsScanning(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [wasClicked]);

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);

    // If not clicked recently, stop scanning
    if (!wasClicked) {
      setIsScanning(false);
    }
  }, [wasClicked]);

  // Handle click to trigger scanning effect
  const handleClick = useCallback(() => {
    setIsScanning(true);
    setWasClicked(true);

    // Reset scanning and click state after 2 seconds
    setTimeout(() => {
      setIsScanning(false);
      setWasClicked(false);
    }, 2000);
  }, []);

  // Memoize accent colors to prevent recreation on each render
  const accentColors = useMemo(() => ({
    purple: { bg: "bg-purple-500", border: "border-purple-500", shadow: "shadow-purple-500/50", text: "text-purple-400" },
    blue: { bg: "bg-blue-500", border: "border-blue-500", shadow: "shadow-blue-500/50", text: "text-blue-400" },
    green: { bg: "bg-green-500", border: "border-green-500", shadow: "shadow-green-500/50", text: "text-green-400" },
    amber: { bg: "bg-amber-500", border: "border-amber-500", shadow: "shadow-amber-500/50", text: "text-amber-400" },
    pink: { bg: "bg-pink-500", border: "border-pink-500", shadow: "shadow-pink-500/50", text: "text-pink-400" },
  }), []);

  // Get current accent color styles
  const currentAccentColor = useMemo(() =>
    accentColors[accent as keyof typeof accentColors] || accentColors.purple
  , [accent, accentColors]);

  // Get glow color based on accent
  const getGlowColor = useCallback(() => {
    const colors = {
      purple: "rgba(139, 92, 246, 0.8)",
      blue: "rgba(59, 130, 246, 0.8)",
      green: "rgba(16, 185, 129, 0.8)",
      amber: "rgba(245, 158, 11, 0.8)",
      pink: "rgba(236, 72, 153, 0.8)",
    };
    return colors[accent as keyof typeof colors] || colors.purple;
  }, [accent]);

  if (!mounted) {
    return null; // Return null on server-side rendering
  }

  return (
    <div
      className={`${
        position === "fixed" ? "fixed top-4 left-4" : ""
      } z-50 ${className}`}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            onClick={handleClick}
          >
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "relative overflow-hidden",
                `border-${accent}-500/50 dark:bg-black/70 backdrop-blur-sm`,
                `shadow-[0_0_15px_${getGlowColor()}]`
              )}
            >
              {/* Scan line effect - only show when scanning */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-30 z-10"
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "linear" }}
                    style={{
                      height: "5px",
                      background: `linear-gradient(to bottom, transparent, ${getGlowColor()}, transparent)`,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Glitch effect */}
              {isGlitching && (
                <motion.div
                  className={`absolute inset-0 ${currentAccentColor.bg}/20`}
                  animate={{ opacity: [0, 0.2, 0, 0.3, 0] }}
                  transition={{ duration: 0.2, repeat: 3, repeatType: "loop" }}
                />
              )}

              {/* Icon with animation */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5 relative z-20"
                >
                  {theme === "dark" ? (
                    <Sun className={currentAccentColor.text} />
                  ) : (
                    <Moon className={currentAccentColor.text} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Glow effect on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-md"
                    style={{
                      boxShadow: `0 0 20px ${getGlowColor()}, 0 0 30px ${getGlowColor().replace("0.8", "0.6")}`,
                      zIndex: 5,
                    }}
                  />
                )}
              </AnimatePresence>

              <span className="sr-only">Toggle theme</span>
            </Button>
          </motion.div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className={cn(
            "dark:bg-gray-900/90 backdrop-blur-xl",
            `border border-${accent}-500/30`,
            `shadow-[0_0_20px_${getGlowColor().replace("0.8", "0.3")}]`,
            "text-gray-200"
          )}
        >
          <DropdownMenuLabel className={`${currentAccentColor.text} font-mono tracking-wider text-xs uppercase`}>
            Neural Interface
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              toggleTheme();
              handleClick();
            }}
            className={`hover:bg-${accent}-500/20 focus:bg-${accent}-500/20 cursor-pointer`}
          >
            <div className="flex items-center w-full">
              <RotateCcw className="mr-2 h-4 w-4 text-pink-400" />
              <span>Toggle Reality</span>
              <motion.span
                className="ml-auto text-xs opacity-60 font-mono"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                [{theme === "dark" ? "LIGHT" : "DARK"}]
              </motion.span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className={`bg-${accent}-500/30`} />

          <DropdownMenuItem
            onClick={() => {
              setTheme("light");
              handleClick();
            }}
            className={`hover:bg-${accent}-500/20 focus:bg-${accent}-500/20 cursor-pointer`}
          >
            <Sun className="mr-2 h-4 w-4 text-yellow-400" />
            <span>Light Protocol</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setTheme("dark");
              handleClick();
            }}
            className={`hover:bg-${accent}-500/20 focus:bg-${accent}-500/20 cursor-pointer`}
          >
            <Moon className="mr-2 h-4 w-4 text-blue-400" />
            <span>Dark Protocol</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              useSystemTheme();
              handleClick();
            }}
            className={`hover:bg-${accent}-500/20 focus:bg-${accent}-500/20 cursor-pointer`}
          >
            <Laptop className="mr-2 h-4 w-4 text-green-400" />
            <span>System Sync</span>
            {systemTheme && (
              <span className="ml-auto text-xs opacity-60 font-mono">
                [{systemTheme.toUpperCase()}]
              </span>
            )}
          </DropdownMenuItem>

          {showAccentSelector && (
            <>
              <DropdownMenuSeparator className={`bg-${accent}-500/30`} />
              <DropdownMenuLabel className={`flex items-center ${currentAccentColor.text} font-mono tracking-wider text-xs uppercase`}>
                <Palette className="mr-2 h-4 w-4" />
                <span>Neural Palette</span>
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={accent}
                onValueChange={(value: string) => {
                  setAccent(value as keyof typeof accentColors);
                  handleClick();
                }}
              >
                {Object.entries(accentColors).map(([color, styles]) => (
                  <DropdownMenuRadioItem
                    key={color}
                    value={color}
                    className={cn(
                      "flex items-center",
                      `hover:bg-${color}-500/20 focus:bg-${color}-500/20`,
                      "cursor-pointer",
                      `data-[state=checked]:bg-${color}-500/30`
                    )}
                  >
                    <motion.div
                      className={`w-4 h-4 rounded-full mr-2 ${styles.bg}`}
                      whileHover={{ scale: 1.2 }}
                      animate={
                        accent === color
                          ? {
                              boxShadow: [
                                "0 0 0px currentColor",
                                "0 0 10px currentColor",
                                "0 0 0px currentColor",
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="capitalize font-mono">{color}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CyberThemeToggle;
