import React, { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { Search, HelpCircle, ArrowUp } from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import Help from "./Help";
import { triggerHapticFeedback } from "@/utils/haptics";

interface CommandPaletteProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState<"navigation" | "help">(
    "navigation"
  );
  const [activeHelpTab, setActiveHelpTab] = useState<
    "menu" | "keyboard" | "gesture" | "voice" | "settings" | "about"
  >("menu");
  const { sections, navigateToSection } = useNavigation();

  useEffect(() => {
    // Toggle the command palette when Ctrl+K is pressed
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!isOpen);
      }

      // Close on escape
      if (e.key === "Escape" && isOpen) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onOpenChange]);

  const navigate = useCallback(
    (sectionId: string) => {
      navigateToSection(sectionId);
      onOpenChange(false);
      setSearch("");
      setActiveView("navigation");
    },
    [navigateToSection, onOpenChange]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              onOpenChange(false)
              triggerHapticFeedback();
            }}
          />

          {/* Command palette */}
          <motion.div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-cyberpunk-dark border border-cyberpunk-purple rounded-lg shadow-2xl shadow-cyberpunk-purple/20 z-50 overflow-hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === "navigation" ? (
              <Command
                className="bg-transparent text-white"
                label="Command palette"
                shouldFilter={false}
              >
                <div className="flex items-center border-b border-white/10 px-4 py-3">
                  <Search className="w-5 h-5 text-white/50 mr-2" />
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Search sections..."
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-white/50"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setActiveView("help")
                        triggerHapticFeedback();
                      }}
                      className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white"
                      title="Help"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-white/70">
                      ESC
                    </kbd>
                  </div>
                </div>

                <Command.List className="py-2 max-h-80 overflow-y-auto scrollbar-none">
                  <Command.Empty className="py-6 text-center text-sm text-white/50">
                    No results found.
                  </Command.Empty>

                  <Command.Group heading="Navigation">
                    {sections
                      .filter(
                        (section) =>
                          section.name
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          section.keywords?.some((keyword) =>
                            keyword.toLowerCase().includes(search.toLowerCase())
                          )
                      )
                      .map((section) => (
                        <Command.Item
                          key={section.id}
                          onSelect={() => navigate(section.id)}
                          className="px-4 py-2 mx-2 my-1 rounded-md text-white hover:bg-white/10 cursor-pointer data-[selected=true]:bg-white/10"
                        >
                          <div className="flex items-center">
                            <span className="font-medium">{section.name}</span>
                          </div>
                        </Command.Item>
                      ))}
                  </Command.Group>

                  <Command.Group heading="Actions">
                    <Command.Item
                      onSelect={() => setActiveView("help")}
                      className="px-4 py-2 mx-2 my-1 rounded-md text-white hover:bg-white/10 cursor-pointer data-[selected=true]:bg-white/10"
                    >
                      <div className="flex items-center">
                        <HelpCircle className="w-4 h-4 mr-2 text-cyberpunk-blue" />
                        <span className="font-medium">View Help</span>
                      </div>
                    </Command.Item>
                    <Command.Item
                      onSelect={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        onOpenChange(false);
                      }}
                      className="px-4 py-2 mx-2 my-1 rounded-md text-white hover:bg-white/10 cursor-pointer data-[selected=true]:bg-white/10"
                    >
                      <div className="flex items-center">
                        <ArrowUp className="w-4 h-4 mr-2 text-cyberpunk-blue" />
                        <span className="font-medium">Back to Top</span>
                      </div>
                    </Command.Item>
                  </Command.Group>
                </Command.List>

                <div className="p-3 border-t border-white/10 text-xs text-white/50">
                  <div className="flex justify-between items-center">
                    <span>Navigate using arrow keys and Enter</span>
                    <span>Press Ctrl+K to open/close</span>
                  </div>
                </div>
              </Command>
            ) : (
              // Help View - Using the separate Help component
              <Help
                activeTab={activeHelpTab}
                setActiveTab={setActiveHelpTab}
                onBack={() => setActiveView("navigation")}
                onClose={() => onOpenChange(false)}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;

