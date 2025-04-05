import { motion } from "framer-motion";
import TechStack, { TechStackItem } from "./TechStack";
interface WhoIAmProps {
  techStack: TechStackItem[];
  isInView: boolean;
}
const WhoIAm = ({ techStack, isInView }: WhoIAmProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Who I Am</h3>
      <p className="text-sm sm:text-base text-gray-400 mb-4">
        I'm a passionate full-stack developer with a love for creating
        beautiful, functional, and user-friendly web applications. With
        over 6 years of experience in the industry, I've worked on a wide
        range of projects from small business websites to large enterprise
        applications.
      </p>
      <p className="text-sm sm:text-base text-gray-400 mb-4">
        My approach combines technical expertise with creative problem-solving.
        I believe that great code should not only work flawlessly but also be
        maintainable, scalable, and accessible.
      </p>
      <p className="text-sm sm:text-base text-gray-400">
        When I'm not coding, you can find me exploring new technologies,
        contributing to open-source projects, or sharing my knowledge through
        technical writing and mentoring.
      </p>

      {/* Tech Stack Section */}
      <TechStack techStack={techStack} />
    </motion.div>
  );
};

export default WhoIAm;
