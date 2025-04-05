import { motion } from "framer-motion";
import { Skill, MasteryLevel } from "./types";

interface MasteryViewProps {
  skills: Skill[];
  setSelectedSkill: (skill: Skill | null) => void;
}

const MasteryView = ({ skills, setSelectedSkill }: MasteryViewProps) => {
  // Group skills by proficiency level
  const masteryLevels: MasteryLevel[] = [
    { name: "Expert", range: [85, 100], skills: [] },
    { name: "Advanced", range: [70, 84], skills: [] },
    { name: "Intermediate", range: [50, 69], skills: [] },
    { name: "Beginner", range: [0, 49], skills: [] },
  ];

  skills.forEach((skill) => {
    const level = masteryLevels.find(
      (level) => skill.level >= level.range[0] && skill.level <= level.range[1]
    );
    if (level) level.skills.push(skill);
  });

  return (
    <div className="space-y-12">
      {masteryLevels.map(
        (level, levelIndex) =>
          level.skills.length > 0 && (
            <motion.div
              key={level.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: levelIndex * 0.1 }}
              className="relative"
            >
              <div className="flex items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {level.name}
                </h3>
                <div className="ml-4 h-0.5 flex-grow bg-gray-300 dark:bg-gray-700">
                  <div
                    className="h-full"
                    style={{
                      width: `${(level.range[0] + level.range[1]) / 2}%`,
                      background: "linear-gradient(to right, #9333ea, #ec4899)",
                    }}
                  />
                </div>
                <span className="ml-4 text-gray-600 dark:text-gray-400 text-sm">
                  {level.range[0]}-{level.range[1]}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {level.skills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-lg p-4 border border-gray-300 dark:border-gray-700 hover:border-purple-500 transition-all cursor-pointer"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-lg mr-3 text-xl"
                        style={{
                          backgroundColor: `${skill.color}20`,
                          color: skill.color,
                        }}
                      >
                        {skill.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          {skill.name}
                        </h4>
                        <div className="flex items-center">
                          <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-2">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${skill.level}%`,
                                backgroundColor: skill.color,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
      )}
    </div>
  );
};

export default MasteryView;
