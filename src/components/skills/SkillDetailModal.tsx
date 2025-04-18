import { motion, AnimatePresence } from "framer-motion";
import { Skill } from "./types";
import { triggerHapticFeedback } from "@/utils/haptics";

interface SkillDetailModalProps {
  selectedSkill: Skill | null;
  setSelectedSkill: (skill: Skill | null) => void;
  viewMode: "grid" | "mastery" | "comparison";
  setViewMode: (mode: "grid" | "mastery" | "comparison") => void;
  setComparisonSkills: (skills: string[]) => void;
  skills: Skill[];
}

const SkillDetailModal = ({
  selectedSkill,
  setSelectedSkill,
  viewMode,
  setViewMode,
  setComparisonSkills,
  skills
}: SkillDetailModalProps) => {
  if (!selectedSkill) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => {
          setSelectedSkill(null)
          triggerHapticFeedback();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full border border-gray-700 shadow-2xl"
          onClick={(e) => {
            e.stopPropagation()
            triggerHapticFeedback();
          }}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div
                className="w-14 h-14 flex items-center justify-center rounded-lg mr-4 text-3xl"
                style={{
                  backgroundColor: `${selectedSkill.color}20`,
                  color: selectedSkill.color,
                }}
              >
                {selectedSkill.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedSkill.name}
                </h3>
                <div className="flex items-center">
                  <span className="text-gray-400">
                    {selectedSkill.category}
                  </span>
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="text-gray-400">
                    {selectedSkill.level}% Proficiency
                  </span>
                </div>
              </div>
            </div>

            <button
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => {
                setSelectedSkill(null)
                triggerHapticFeedback();
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">
                Skill Overview
              </h4>
              <p className="text-gray-300 mb-4">{selectedSkill.description}</p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Proficiency</span>
                    <span className="text-white">{selectedSkill.level}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: selectedSkill.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedSkill.level}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm mb-1">Projects</div>
                    <div className="text-2xl font-bold text-white">
                      {selectedSkill.projects}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm mb-1">Experience</div>
                    <div className="text-2xl font-bold text-white">
                      {selectedSkill.yearsExperience} years
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-3">
                Skill Breakdown
              </h4>

              <div className="space-y-3">
                {/* These would be real metrics in a production app */}
                {[
                  {
                    name: "Problem Solving",
                    value: Math.round(selectedSkill.level * 0.9),
                  },
                  {
                    name: "Code Quality",
                    value:
                      Math.round(selectedSkill.level * 1.1) > 100
                        ? 100
                        : Math.round(selectedSkill.level * 1.1),
                  },
                  {
                    name: "Best Practices",
                    value: Math.round(selectedSkill.level * 0.95),
                  },
                  {
                    name: "Performance Optimization",
                    value: Math.round(selectedSkill.level * 0.85),
                  },
                ].map((metric) => (
                  <div key={metric.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{metric.name}</span>
                      <span className="text-gray-400">{metric.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${selectedSkill.color}80, ${selectedSkill.color})`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-medium text-white mb-3">
                  Related Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter(
                      (skill) =>
                        skill.category === selectedSkill.category &&
                        skill.id !== selectedSkill.id
                    )
                    .slice(0, 4)
                    .map((skill) => (
                      <button
                        key={skill.id}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300 transition-colors"
                        onClick={() => {
                          setSelectedSkill(skill)
                          triggerHapticFeedback();
                        }}
                      >
                        {skill.name}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h4 className="text-lg font-medium text-white mb-3">
              Skill Timeline
            </h4>
            <div className="relative h-20">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-700 -translate-y-1/2"></div>

              {/* Timeline points - these would be real milestones in a production app */}
              {[
                {
                  year: `${
                    new Date().getFullYear() - selectedSkill.yearsExperience
                  }`,
                  label: "Started Learning",
                },
                {
                  year: `${
                    new Date().getFullYear() -
                    Math.round(selectedSkill.yearsExperience * 0.7)
                  }`,
                  label: "First Project",
                },
                {
                  year: `${
                    new Date().getFullYear() -
                    Math.round(selectedSkill.yearsExperience * 0.3)
                  }`,
                  label: "Professional Use",
                },
                { year: `${new Date().getFullYear()}`, label: "Current" },
              ].map((point, index, array) => {
                const position = (index / (array.length - 1)) * 100;

                return (
                  <motion.div
                    key={point.year}
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `${position}%` }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="w-4 h-4 rounded-full bg-purple-600 mb-2 mx-auto"></div>
                    <div className="text-center">
                      <div className="text-white text-sm">{point.year}</div>
                      <div className="text-gray-400 text-xs">{point.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            {viewMode !== "comparison" && (
              <button
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                onClick={() => {
                  setSelectedSkill(null);
                  setViewMode("comparison");
                  setComparisonSkills([selectedSkill.id]);
                  triggerHapticFeedback();
                }}
              >
                Compare with Others
              </button>
            )}

            <button
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              onClick={() => {
                setSelectedSkill(null)
                triggerHapticFeedback();
              }}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SkillDetailModal;
