import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Skill, ViewMode } from "./types";
import { skills } from "./skillsData";
import SkillsFilters from "./SkillsFilters";
import GridView from "./GridView";
import MasteryView from "./MasteryView";
import ComparisonView from "./ComparisonView";
import SkillVisualization from "./SkillVisualization";
import SkillDetailModal from "./SkillDetailModal";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Main Skills section component with comprehensive skill management
 */
const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // State management
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [comparisonSkills, setComparisonSkills] = useState<string[]>([]);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Filter skills based on category and search query
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCategory =
        selectedCategory === "All" || skill.category === selectedCategory;
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Toggle skill in comparison
  const toggleComparisonSkill = (skillId: string) => {
    setComparisonSkills((prev) => {
      if (prev.includes(skillId)) {
        return prev.filter((id) => id !== skillId);
      } else if (prev.length < 3) {
        return [...prev, skillId];
      }
      return prev;
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={ref}
      className="py-24 px-6 relative overflow-hidden"
      id="skills"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: accentColors.primary }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: accentColors.secondary }}
        />
        <div
          className="absolute top-2/3 left-1/3 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: "#10b981" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(to right, ${accentColors.primary}, ${accentColors.secondary}, #10b981)`,
              }}
            >
              Skills & Expertise
            </h2>
            <p
              className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{
                color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
              }}
            >
              A comprehensive overview of my technical skills, proficiency
              levels, and experience across various technologies and domains.
            </p>
          </motion.div>
        </motion.div>

        {/* Skills Visualization */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <SkillVisualization skills={filteredSkills} />
        </motion.div>

        {/* Filters and Controls */}
        <SkillsFilters
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setComparisonSkills={setComparisonSkills}
        />

        {/* Skills Content */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="min-h-[600px]"
        >
          {viewMode === "grid" && (
            <GridView
              skills={filteredSkills}
              setSelectedSkill={setSelectedSkill}
              hoveredSkill={hoveredSkill}
              setHoveredSkill={setHoveredSkill}
              viewMode={viewMode}
              setViewMode={setViewMode}
              setComparisonSkills={setComparisonSkills}
            />
          )}

          {viewMode === "mastery" && (
            <MasteryView
              skills={filteredSkills}
              setSelectedSkill={setSelectedSkill}
            />
          )}

          {viewMode === "comparison" && (
            <ComparisonView
              comparisonSkills={comparisonSkills}
              toggleComparisonSkill={toggleComparisonSkill}
              skills={skills}
            />
          )}
        </motion.div>

        {/* Results Summary */}
        {(selectedCategory !== "All" || searchQuery) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <p
              className="text-lg"
              style={{
                color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
              }}
            >
              Showing {filteredSkills.length} of {skills.length} skills
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredSkills.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: `${accentColors.primary}20` }}
            >
              <span className="text-3xl">🔍</span>
            </div>
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: isDark ? "#ffffff" : "#1f2937" }}
            >
              No Skills Found
            </h3>
            <p
              className="max-w-md mx-auto"
              style={{
                color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
              }}
            >
              Try adjusting your search criteria or category filter to find the
              skills you're looking for.
            </p>
            <motion.button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-6 px-6 py-3 rounded-lg font-medium transition-all duration-200"
              style={{
                backgroundColor: accentColors.primary,
                color: "white",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Skill Detail Modal */}
      <SkillDetailModal
        selectedSkill={selectedSkill}
        setSelectedSkill={setSelectedSkill}
        viewMode={viewMode}
        setViewMode={setViewMode}
        setComparisonSkills={setComparisonSkills}
        skills={skills}
      />
    </section>
  );
};

export default SkillsSection;
