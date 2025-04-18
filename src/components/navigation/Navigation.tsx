import { useNavigation } from "@/contexts/NavigationContext";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import DotsNavigation from "./DotsNavigation";
import GestureNavigation from "./GestureNavigation";
import NavigationContent from "./NavigationContent";
import VoiceNavigation from "./VoiceNavigation";
import BackToTop from "../ui/BackToTop";
import { Command } from "lucide-react";
import CommandPalette from "../ui/CommandPalette";
import { useIsMobile } from "@/hooks/use-mobile";
import { triggerHapticFeedback } from "@/utils/haptics";

interface NavigationProps {
  enableDots?: boolean;
  enableVoice?: boolean;
  enableGestures?: boolean;
  enableCommandPalette?: boolean;
  enableBackToTop?: boolean;
}



const Navigation: React.FC<NavigationProps> = ({
  enableDots = true,
  enableVoice = true,
  enableGestures = true,
  enableCommandPalette = true,
  enableBackToTop = true,
}) => {
  const { isMenuOpen, toggleMenu } = useNavigation();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const isMobile = useIsMobile();

  // Handle keyboard events for menu
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close menu on ESC key
      if (e.key === "Escape" && isMenuOpen) {
        toggleMenu();
      }

      // Toggle menu on Alt+M
      if (e.altKey && e.key === "m") {
        toggleMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, toggleMenu]);

  return (
    <>
      {/* Inline Menu Toggle Button */}
      <motion.button
        onClick={() => {
          toggleMenu();
          triggerHapticFeedback();
        }}
        className="fixed top-6 right-6 z-[60] p-3 bg-background/80 backdrop-blur-sm border border-border rounded-full"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        aria-expanded={isMenuOpen}
        aria-controls="navigation-menu"
        aria-haspopup="true"
        tabIndex={0}
        style={{ touchAction: "manipulation" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            initial={false}
            animate={isMenuOpen ? "open" : "closed"}
            variants={{
              closed: { d: "M3 6h18M3 12h18M3 18h18" },
              open: { d: "M6 6L18 18M6 18L18 6" },
            }}
            transition={{ duration: 0.3 }}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.button>

      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <NavigationContent>
            {/* Command Palette Button inside Navigation Menu */}
            {enableCommandPalette && (
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => {
                  toggleMenu();
                  setIsCommandPaletteOpen(true);
                  triggerHapticFeedback();
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{ touchAction: "manipulation" }}
              >
                <Command className="w-5 h-5" />
                <span>Command Palette</span>
                <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">
                  Ctrl+K
                </span>
              </motion.button>
            )}
          </NavigationContent>
        )}
      </AnimatePresence>

      {/* Only show these navigation elements on desktop */}
      {!isMobile && enableDots && <DotsNavigation />}
      {!isMobile && enableVoice && <VoiceNavigation />}
      {!isMobile && enableGestures && <GestureNavigation />}

      {/* Command Palette */}
      {enableCommandPalette && (
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onOpenChange={setIsCommandPaletteOpen}
        />
      )}

      {/* Back to Top Button */}
      {enableBackToTop && <BackToTop position="bottom-right" />}
    </>
  );
};

export default Navigation;
