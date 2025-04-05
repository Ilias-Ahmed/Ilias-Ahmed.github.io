import { motion } from "framer-motion";
import { CheckCircle, Code, LineChart, Layers } from "lucide-react";

const ProjectStats = () => {
  const statsData = [
    {
      value: "20+",
      label: "Projects Completed",
      icon: <CheckCircle className="w-6 h-6 text-primary mb-2" />,
      description: "Successfully delivered projects across various domains",
    },
    {
      value: "50k+",
      label: "Lines of Code",
      icon: <Code className="w-6 h-6 text-primary mb-2" />,
      description: "Clean, maintainable, and well-documented code",
    },
    {
      value: "99%",
      label: "Client Satisfaction",
      icon: <LineChart className="w-6 h-6 text-primary mb-2" />,
      description: "Consistently exceeding client expectations",
    },
    {
      value: "15+",
      label: "Tech Stack Mastered",
      icon: <Layers className="w-6 h-6 text-primary mb-2" />,
      description: "Proficient in modern frameworks and technologies",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="mt-24"
    >
      <h3 className="text-2xl font-bold text-center mb-12">
        Project Highlights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-secondary/30 backdrop-blur-sm rounded-xl p-6 text-center relative overflow-hidden group"
            whileHover={{
              y: -5,
              boxShadow:
                "0 10px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(78, 149, 255, 0.2)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
          >
            {/* Background glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: 0.2 + index * 0.1,
                }}
                className="mb-2"
              >
                {stat.icon}
              </motion.div>

              <motion.div
                className="text-4xl font-bold text-gradient mb-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {stat.value}
              </motion.div>

              <motion.div
                className="text-lg font-medium mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                {stat.label}
              </motion.div>

              <motion.p
                className="text-sm text-gray-400"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                {stat.description}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectStats;
