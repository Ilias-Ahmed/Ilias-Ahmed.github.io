import { motion } from "framer-motion";
import { ViewMode } from "./types";
import { categories } from "./skillsData";
import { useState } from "react";
import { triggerHapticFeedback } from "@/utils/haptics";

interface SkillsFiltersProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setComparisonSkills: (skills: string[]) => void;
}

const SkillsFilters = ({
  viewMode,
  setViewMode,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  setComparisonSkills,
}: SkillsFiltersProps) => {
  // Add state to track if we're showing the quick selection modal
  const [showQuickSelect, setShowQuickSelect] = useState(false);

  // Popular skill combinations for quick comparison
  const popularCombinations = [
    { name: "Frontend Trio", skills: ["react", "javascript", "css"] },
    { name: "Backend Stack", skills: ["nodejs", "express", "mongodb"] },
    { name: "Full Stack", skills: ["react", "nodejs", "postgresql"] },
    { name: "Mobile Dev", skills: ["react-native", "flutter", "swift"] },
    { name: "Data Science", skills: ["python", "tensorflow", "pandas"] },
  ];

  // Handle switching to comparison view with initial skills
  const handleComparisonView = () => {
    setViewMode("comparison");
    // Initialize with popular frontend skills or empty array
    setComparisonSkills(["react", "javascript"]);
    setShowQuickSelect(true);
  };

  // Handle quick selection of skill combinations
  const handleQuickSelect = (skills: string[]) => {
    setComparisonSkills(skills);
    setShowQuickSelect(false);
  };

  return (
    <div className="mb-10 space-y-6">
      {/* View Mode Selector */}
      <div className="flex flex-wrap justify-center gap-4">
        <motion.button
          className={`px-5 py-2.5 rounded-full relative overflow-hidden ${
            viewMode === "grid"
              ? "text-white dark:text-white"
              : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
          onClick={() => {
            setViewMode("grid");
            triggerHapticFeedback();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            Grid View
          </span>
          {viewMode === "grid" && (
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              layoutId="viewModeHighlight"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{ zIndex: 0 }}
            />
          )}
        </motion.button>

        <motion.button
          className={`px-5 py-2.5 rounded-full relative overflow-hidden ${
            viewMode === "mastery"
              ? "text-white dark:text-white"
              : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
          onClick={() => {
            setViewMode("mastery");
            triggerHapticFeedback();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            Mastery Levels
          </span>
          {viewMode === "mastery" && (
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              layoutId="viewModeHighlight"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{ zIndex: 0 }}
            />
          )}
        </motion.button>

        <motion.button
          className={`px-5 py-2.5 rounded-full relative overflow-hidden ${
            viewMode === "comparison"
              ? "text-white dark:text-white"
              : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
          onClick={() => {
            handleComparisonView();
            triggerHapticFeedback();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
            </svg>
            Compare Skills
          </span>
          {viewMode === "comparison" && (
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              layoutId="viewModeHighlight"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{ zIndex: 0 }}
            />
          )}
        </motion.button>
      </div>

      {/* Quick Selection Modal for Comparison */}
      {showQuickSelect && viewMode === "comparison" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Quick Compare - Popular Combinations
          </h4>
          <div className="flex flex-wrap gap-2">
            {popularCombinations.map((combo, index) => (
              <button
                key={index}
                onClick={() => {
                  handleQuickSelect(combo.skills);
                  triggerHapticFeedback();
                }}
                className="px-3 py-1.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors"
              >
                {combo.name}
              </button>
            ))}
            <button
              onClick={() => {
                setShowQuickSelect(false);
                triggerHapticFeedback();
              }}
              className="px-3 py-1.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-2xl bg-gray-100 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-6 h-full border border-gray-300 dark:border-gray-700 hover:border-purple-500 transition-all duration-300 text-black dark:text-white"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <motion.button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative overflow-hidden ${
              selectedCategory === "All"
                ? "text-white dark:text-white"
                : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
            onClick={() => {
              setSelectedCategory("All");
              triggerHapticFeedback();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">All</span>
            {selectedCategory === "All" && (
              <motion.span
                className="absolute inset-0 bg-purple-700 rounded-lg"
                layoutId="categoryHighlight"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>

          {categories.map((category) => (
            <motion.button
              key={category}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative overflow-hidden ${
                selectedCategory === category
                  ? "text-white dark:text-white"
                  : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              onClick={() => {
                setSelectedCategory(category);
                triggerHapticFeedback();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">{category}</span>
              {selectedCategory === category && (
                <motion.span
                  className="absolute inset-0 bg-purple-700 rounded-lg"
                  layoutId="categoryHighlight"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Comparison Mode Helper - Only shown in comparison mode */}
      {viewMode === "comparison" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg"
        >
          <p>
            <span className="font-medium text-purple-700 dark:text-purple-300">
              Tip:
            </span>{" "}
            Select up to 3 skills to compare their proficiency levels, projects,
            and experience.
            <button
              onClick={() => {
                setShowQuickSelect(!showQuickSelect);
                triggerHapticFeedback();
              }}
              className="ml-2 underline text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
            >
              Quick select popular combinations
            </button>
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SkillsFilters;
