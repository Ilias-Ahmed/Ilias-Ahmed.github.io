import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, GitBranch, Clock, Award } from "lucide-react";
import { Skill, ViewMode } from "./types";
import { triggerHapticFeedback } from "@/utils/haptics";
import { useTheme } from "@/contexts/ThemeContext";

interface SkillDetailModalProps {
  selectedSkill: Skill | null;
  setSelectedSkill: (skill: Skill | null) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  setComparisonSkills: (skills: string[]) => void;
  skills: Skill[];
}

/**
 * SkillDetailModal component displays detailed information about a selected skill
 */
const SkillDetailModal = ({
  selectedSkill,
  setSelectedSkill,
  setViewMode,
  setComparisonSkills,
  skills,
}: SkillDetailModalProps) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedSkill(null);
      }
    };

    if (selectedSkill) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedSkill, setSelectedSkill]);

  const handleCompareClick = () => {
    if (selectedSkill) {
      setViewMode("comparison");
      setComparisonSkills([selectedSkill.id]);
      setSelectedSkill(null);
      triggerHapticFeedback();
    }
  };

  const getProficiencyLevel = (level: number) => {
    if (level >= 90) return { label: "Expert", color: "#10b981" };
    if (level >= 75) return { label: "Advanced", color: "#3b82f6" };
    if (level >= 60) return { label: "Intermediate", color: "#f59e0b" };
    return { label: "Beginner", color: "#6b7280" };
  };

  const getRelatedSkills = (currentSkill: Skill) => {
    return skills
      .filter(
        (skill) =>
          skill.id !== currentSkill.id &&
          skill.category === currentSkill.category
      )
      .slice(0, 3);
  };

  if (!selectedSkill) return null;

  const proficiencyLevel = getProficiencyLevel(selectedSkill.level);
  const relatedSkills = getRelatedSkills(selectedSkill);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        onClick={() => setSelectedSkill(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border backdrop-blur-lg"
          style={{
            backgroundColor: isDark
              ? "rgba(17, 24, 39, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="p-6 border-b"
            style={{
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div
                  className="w-16 h-16 flex items-center justify-center rounded-xl mr-4 text-3xl"
                  style={{
                    backgroundColor: `${selectedSkill.color}20`,
                    color: selectedSkill.color,
                  }}
                >
                  {selectedSkill.icon}
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                  >
                    {selectedSkill.name}
                  </h2>
                  <p
                    className="text-sm"
                    style={{
                      color: isDark
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(0,0,0,0.6)",
                    }}
                  >
                    {selectedSkill.category}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${proficiencyLevel.color}20`,
                        color: proficiencyLevel.color,
                      }}
                    >
                      {proficiencyLevel.label}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedSkill(null)}
                className="p-2 rounded-lg transition-colors hover:opacity-70"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                  color: isDark ? "#ffffff" : "#1f2937",
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: isDark ? "#ffffff" : "#1f2937" }}
              >
                About This Skill
              </h3>
              <p
                className="leading-relaxed"
                style={{
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                }}
              >
                {selectedSkill.description}
              </p>
            </div>

            {/* Proficiency Bar */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                >
                  Proficiency Level
                </h3>
                <span
                  className="text-2xl font-bold"
                  style={{ color: selectedSkill.color }}
                >
                  {selectedSkill.level}%
                </span>
              </div>
              <div
                className="h-4 rounded-full overflow-hidden"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: selectedSkill.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedSkill.level}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: GitBranch,
                  label: "Projects",
                  value: selectedSkill.projects,
                },
                {
                  icon: Clock,
                  label: "Experience",
                  value: `${selectedSkill.yearsExperience}y`,
                },
                { icon: Award, label: "Level", value: proficiencyLevel.label },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-lg border text-center"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.8)",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  }}
                >
                  <stat.icon
                    size={24}
                    className="mx-auto mb-2"
                    style={{ color: selectedSkill.color }}
                  />
                  <div
                    className="text-lg font-bold"
                    style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: isDark
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(0,0,0,0.6)",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Related Skills */}
            {relatedSkills.length > 0 && (
              <div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                >
                  Related Skills
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {relatedSkills.map((skill) => (
                    <motion.button
                      key={skill.id}
                      onClick={() => {
                        setSelectedSkill(skill);
                        triggerHapticFeedback();
                      }}
                      className="p-3 rounded-lg border transition-all duration-200 hover:shadow-md"
                      style={{
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(255,255,255,0.8)",
                        borderColor: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                      }}
                      whileHover={{
                        scale: 1.05,
                        borderColor: skill.color,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className="w-8 h-8 flex items-center justify-center rounded-lg mx-auto mb-2"
                        style={{
                          backgroundColor: `${skill.color}20`,
                          color: skill.color,
                        }}
                      >
                        {skill.icon}
                      </div>
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                      >
                        {skill.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(0,0,0,0.6)",
                        }}
                      >
                        {skill.level}%
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                onClick={handleCompareClick}
                className="flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: accentColors.primary,
                  color: "white",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GitBranch size={18} />
                Compare Skills
              </motion.button>

              <motion.button
                onClick={() => {
                  // This could open external documentation or portfolio
                  window.open(
                    `https://developer.mozilla.org/en-US/search?q=${selectedSkill.name}`,
                    "_blank"
                  );
                  triggerHapticFeedback();
                }}
                className="py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 border"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.8)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                  color: isDark ? "#ffffff" : "#1f2937",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ExternalLink size={18} />
                Learn More
              </motion.button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
            <div
              className="w-full h-full rounded-full blur-2xl"
              style={{ backgroundColor: selectedSkill.color }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SkillDetailModal;
