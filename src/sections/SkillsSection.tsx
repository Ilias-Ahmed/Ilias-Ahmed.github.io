import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Skill, ViewMode } from "../components/skills/types";
import { skills } from "../components/skills/skillsData";
import SkillsFilters from "../components/skills/SkillsFilters";
import GridView from "../components/skills/GridView";
import MasteryView from "../components/skills/MasteryView";
import ComparisonView from "../components/skills/ComparisonView";
import SkillDetailModal from "../components/skills/SkillDetailModal";
import SkillVisualization from "../components/skills/SkillVisualization";

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [comparisonSkills, setComparisonSkills] = useState<string[]>([]);

  // Filter skills based on category and search query
  const filteredSkills = skills.filter(skill => {
    const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // For the comparison view
  const toggleComparisonSkill = (skillId: string) => {
    if (comparisonSkills.includes(skillId)) {
      setComparisonSkills(comparisonSkills.filter(id => id !== skillId));
    } else {
      if (comparisonSkills.length < 3) {
        setComparisonSkills([...comparisonSkills, skillId]);
      }
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 relative" id="skills">
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
            My toolkit of technologies and methodologies, continuously refined through practical application and ongoing learning.
          </p>
        </motion.div>

        {/* New Visual Skills Representation */}
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

        {/* View Components */}
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

        {/* Skill Detail Modal */}
        <SkillDetailModal
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setComparisonSkills={setComparisonSkills}
          skills={skills}
        />
      </div>
    </div>
  );
};

export default SkillsSection;
