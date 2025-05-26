import { motion } from "framer-motion";
import { Search, Grid3X3, BarChart3, GitCompare, X } from "lucide-react";
import { ViewMode } from "./types";
import { skills } from "./skillsData";
import { triggerHapticFeedback } from "@/utils/haptics";
import { useTheme } from "@/contexts/ThemeContext";

interface SkillsFiltersProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setComparisonSkills: (skills: string[]) => void;
}

/**
 * SkillsFilters component provides filtering and view mode controls
 */
const SkillsFilters = ({
  viewMode,
  setViewMode,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  setComparisonSkills,
}: SkillsFiltersProps) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Get unique categories from skills
  const categories = [
    "All",
    ...Array.from(new Set(skills.map((skill) => skill.category))),
  ];

  const viewModes = [
    { id: "grid", label: "Grid View", icon: Grid3X3 },
    { id: "mastery", label: "Mastery", icon: BarChart3 },
    { id: "comparison", label: "Compare", icon: GitCompare },
  ] as const;

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode !== "comparison") {
      setComparisonSkills([]);
    }
    triggerHapticFeedback();
  };

  const clearSearch = () => {
    setSearchQuery("");
    triggerHapticFeedback();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-12"
    >
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            }}
          />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.8)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              color: isDark ? "#ffffff" : "#1f2937",
            }}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
              style={{
                color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                triggerHapticFeedback();
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor:
                  selectedCategory === category
                    ? accentColors.primary
                    : isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.8)",
                color:
                  selectedCategory === category
                    ? "white"
                    : isDark
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.7)",
                border: `1px solid ${
                  selectedCategory === category
                    ? accentColors.primary
                    : isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)"
                }`,
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor:
                  selectedCategory === category
                    ? accentColors.secondary
                    : `${accentColors.primary}20`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div
          className="flex rounded-lg p-1 border"
          style={{
            backgroundColor: isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.8)",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        >
          {viewModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;

            return (
              <motion.button
                key={mode.id}
                onClick={() => handleViewModeChange(mode.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative"
                style={{
                  backgroundColor: isActive
                    ? accentColors.primary
                    : "transparent",
                  color: isActive
                    ? "white"
                    : isDark
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.7)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{mode.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeViewIndicator"
                    className="absolute inset-0 rounded-md"
                    style={{ backgroundColor: accentColors.primary }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== "All" || searchQuery) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 flex flex-wrap gap-2 items-center"
        >
          <span
            className="text-sm font-medium"
            style={{
              color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
            }}
          >
            Active filters:
          </span>

          {selectedCategory !== "All" && (
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: `${accentColors.primary}20`,
                color: accentColors.primary,
                border: `1px solid ${accentColors.primary}30`,
              }}
            >
              Category: {selectedCategory}
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  triggerHapticFeedback();
                }}
                className="hover:opacity-70 transition-opacity"
              >
                <X size={14} />
              </button>
            </span>
          )}

          {searchQuery && (
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: `${accentColors.primary}20`,
                color: accentColors.primary,
                border: `1px solid ${accentColors.primary}30`,
              }}
            >
              Search: "{searchQuery}"
              <button
                onClick={clearSearch}
                className="hover:opacity-70 transition-opacity"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SkillsFilters;

