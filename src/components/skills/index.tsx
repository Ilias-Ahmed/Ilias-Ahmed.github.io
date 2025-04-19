import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Skill, ViewMode } from "./types";
import { skills } from "./skillsData";
import SkillsFilters from "./SkillsFilters";
import GridView from "./GridView";
import MasteryView from "./MasteryView";
import ComparisonView from "./ComparisonView";
import SkillDetailModal from "./SkillDetailModal";
import SkillVisualization from "./SkillVisualization";

/**
 * SkillsSection component displays a comprehensive view of technical skills
 * with different visualization modes and interactive features.
 */
const SkillsSection = () => {
  // Animation and visibility tracking
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // State management
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [comparisonSkills, setComparisonSkills] = useState<string[]>([]);

  // Filter skills based on category and search query
  const filteredSkills = skills.filter((skill) => {
    const matchesCategory =
      selectedCategory === "All" || skill.category === selectedCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Toggle a skill for comparison view
  const toggleComparisonSkill = (skillId: string) => {
    setComparisonSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : prev.length < 3
        ? [...prev, skillId]
        : prev
    );
  };

  return (
    <section className="py-10 px-4 sm:px-6 relative" id="skills">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Technical Expertise
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            My toolkit of technologies and methodologies, continuously refined
            through practical application and ongoing learning.
          </p>
        </motion.div>

        {/* Visual Skills Representation */}
        <SkillVisualization skills={skills} className="mb-16" />

        {/* Filters Component */}
        <SkillsFilters
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setComparisonSkills={setComparisonSkills}
        />

        {/* View Components - Conditionally rendered based on viewMode */}
        {viewMode === "grid" && (
          <GridView
            skills={filteredSkills}
            setSelectedSkill={setSelectedSkill}
            setHoveredSkill={setHoveredSkill}
            hoveredSkill={hoveredSkill}
            setViewMode={setViewMode}
            setComparisonSkills={setComparisonSkills}
            viewMode={viewMode}
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
            skills={filteredSkills}
          />
        )}

        {/* Skill Detail Modal - Appears when a skill is selected */}
        <SkillDetailModal
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setComparisonSkills={setComparisonSkills}
          skills={skills}
        />
      </div>
    </section>
  );
};

export default SkillsSection;
