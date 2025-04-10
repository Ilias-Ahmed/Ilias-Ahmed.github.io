import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Download, Github, Linkedin, Twitter } from "lucide-react";
import profileImage from "../../assets/images/profile.png";

const ProfileCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

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
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const skills = [
    "React", "Node.js", "TypeScript", "GraphQL", "AWS", "UI/UX"
  ];

  const quickFacts = [
    { icon: "🌍", title: "Location", content: "San Francisco, CA" },
    { icon: "🎓", title: "Education", content: "Computer Science, Stanford" },
    { icon: "🌱", title: "Learning", content: "AI/ML & Cloud Architecture" },
    { icon: "🎯", title: "Goal", content: "Building impactful products that solve real problems" }
  ];

  const stats = [
    { number: "6+", label: "Years Experience" },
    { number: "50+", label: "Projects Completed" },
    { number: "30+", label: "Happy Clients" },
    { number: "12+", label: "Open Source Contributions" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Main profile section */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Profile Image with Card Flip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-md w-full"
        >
          {/* Background decorative elements */}
          <div className="absolute -z-10 -top-10 -left-10 w-[120%] h-[120%] bg-gradient-to-br from-primary/10 to-purple-500/5 rounded-full blur-[60px]" />
          <div className="absolute -z-10 bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[50px]" />

          {/* Card with flip effect */}
          <div
            className="relative w-full h-[450px] perspective-1000 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className="relative w-full h-full preserve-3d transition-all duration-700 rounded-2xl"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.7, type: "spring", damping: 20 }}
            >
              {/* Front - Profile Image */}
              <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden">
                <div className="relative h-full w-full">
                  {/* Profile image */}
                  <img
                    src={profileImage}
                    alt="Ilias Ahmed"
                    className="object-cover w-full h-full"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />

                  {/* Social links */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-4">
                    {[
                      { icon: <Github size={18} />, url: "https://github.com" },
                      {
                        icon: <Linkedin size={18} />,
                        url: "https://linkedin.com",
                      },
                      {
                        icon: <Twitter size={18} />,
                        url: "https://twitter.com",
                      },
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-primary/80 transition-colors"
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>

                  {/* Flip indicator */}
                  <motion.div
                    className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/80 border border-white/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Tap for quick facts
                  </motion.div>
                </div>
              </div>

              {/* Back - Quick Facts */}
              <div className="absolute inset-0 backface-hidden rotateY-180 rounded-2xl overflow-hidden">
                <div className="h-full w-full bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md border border-white/10 shadow-xl p-8 flex flex-col">
                  <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>Quick Facts</span>
                  </h4>

                  <motion.ul
                    className="space-y-5 flex-1 overflow-y-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {quickFacts.map((fact, index) => (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        className="flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                          {fact.icon}
                        </div>
                        <div>
                          <h5 className="font-medium text-white text-base">
                            {fact.title}
                          </h5>
                          <p className="text-gray-400 text-sm">
                            {fact.content}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.div
                    className="mt-4 pt-3 border-t border-white/10 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="text-sm text-white/70">Tap to flip back</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Profile Info */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="space-y-8"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-4">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>Full Stack Developer</span>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-block"
              >
                Hello, I'm{" "}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400"
              >
                Ilias Ahmed
              </motion.span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            {[
              "I'm a passionate full-stack developer with a love for creating beautiful, functional, and user-friendly web applications. With over 6 years of experience in the industry, I've worked on a wide range of projects from small business websites to large enterprise applications.",
              "My approach combines technical expertise with creative problem-solving. I believe that great code should not only work flawlessly but also be maintainable, scalable, and accessible.",
              "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through technical writing and mentoring.",
            ].map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-gray-300 leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2">
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 pt-4"
          >
            <motion.a
              href="/contact"
              className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-primary/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Get in Touch</span>
              <ArrowRight size={18} />
            </motion.a>

            <motion.a
              href="/resume.pdf"
              target="_blank"
              className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full flex items-center gap-2 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Resume</span>
              <Download size={18} />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Experience stats */}
      <motion.div
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {stats.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors group"
          >
            <motion.h3
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.number}
            </motion.h3>
            <p className="text-gray-400 text-sm mt-2 group-hover:text-gray-300 transition-colors">
              {item.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProfileCard;
