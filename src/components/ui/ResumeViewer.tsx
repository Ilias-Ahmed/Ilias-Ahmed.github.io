import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, Eye } from "lucide-react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import gsap from "gsap";
import PropTypes from "prop-types";

// Utility function for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Register fonts with fallback mechanism
try {
  Font.register({
    family: "Inter",
    fonts: [
      { src: "/fonts/Inter-Regular.ttf" },
      { src: "/fonts/Inter-Bold.ttf", fontWeight: "bold" },
    ],
  });
} catch (error) {
  console.warn("Font registration failed, using system fonts instead:", error);
}

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Inter",
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#3B82F6", // primary color
  },
  subheader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#3B82F6",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 5,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  jobDetails: {
    fontSize: 12,
    marginBottom: 5,
    color: "#4B5563",
  },
  jobDescription: {
    fontSize: 10,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  skill: {
    fontSize: 10,
    backgroundColor: "#EFF6FF",
    padding: 5,
    borderRadius: 4,
    color: "#3B82F6",
  },
  contactInfo: {
    fontSize: 10,
    textAlign: "center",
    color: "#4B5563",
    marginBottom: 20,
  },
});

// Resume PDF Document
const ResumePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Ilias Ahmed</Text>
      <Text style={styles.contactInfo}>
        San Francisco, CA • ilias.ahmed@example.com • (123) 456-7890 •
        github.com/Ilias-Ahmed
      </Text>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.subheader}>PROFESSIONAL SUMMARY</Text>
        <Text style={styles.jobDescription}>
          Full Stack Developer with 6+ years of experience building responsive
          web applications and scalable backend systems. Passionate about
          creating intuitive user experiences and writing clean, maintainable
          code.
        </Text>
      </View>

      {/* Experience */}
      <View style={styles.section}>
        <Text style={styles.subheader}>EXPERIENCE</Text>

        <View style={{ marginBottom: 15 }}>
          <Text style={styles.jobTitle}>Senior Full Stack Developer</Text>
          <Text style={styles.jobDetails}>
            Tech Innovations Inc. • 2020 - Present
          </Text>
          <Text style={styles.jobDescription}>
            • Led development of a React-based dashboard that improved client
            engagement by 40% • Architected and implemented RESTful APIs using
            Node.js and Express • Mentored junior developers and conducted code
            reviews to ensure quality standards
          </Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={styles.jobTitle}>Full Stack Developer</Text>
          <Text style={styles.jobDetails}>Digital Solutions • 2018 - 2020</Text>
          <Text style={styles.jobDescription}>
            • Developed responsive web applications using React, TypeScript, and
            Node.js • Implemented CI/CD pipelines that reduced deployment time
            by 60% • Collaborated with UX designers to implement intuitive user
            interfaces
          </Text>
        </View>

        <View>
          <Text style={styles.jobTitle}>Web Developer</Text>
          <Text style={styles.jobDetails}>Creative Agency • 2016 - 2018</Text>
          <Text style={styles.jobDescription}>
            • Built and maintained websites for various clients using modern web
            technologies • Optimized website performance resulting in 30% faster
            load times • Implemented responsive designs ensuring cross-browser
            compatibility
          </Text>
        </View>
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.subheader}>EDUCATION</Text>
        <Text style={styles.jobTitle}>
          Computer Science, Stanford University
        </Text>
        <Text style={styles.jobDetails}>Master's Degree • 2014 - 2016</Text>
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.subheader}>SKILLS</Text>
        <View style={styles.skillsContainer}>
          {[
            "React",
            "Node.js",
            "TypeScript",
            "GraphQL",
            "AWS",
            "UI/UX",
            "MongoDB",
            "Express",
            "Next.js",
            "Docker",
          ].map((skill) => (
            <Text key={skill} style={styles.skill}>
              {skill}
            </Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

// Resume data for interactive view
const resumeData = {
  experience: [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Innovations Inc.",
      period: "2020 - Present",
      description:
        "Led development of a React-based dashboard that improved client engagement by 40%. Architected and implemented RESTful APIs using Node.js and Express. Mentored junior developers and conducted code reviews to ensure quality standards.",
    },
    {
      title: "Full Stack Developer",
      company: "Digital Solutions",
      period: "2018 - 2020",
      description:
        "Developed responsive web applications using React, TypeScript, and Node.js. Implemented CI/CD pipelines that reduced deployment time by 60%. Collaborated with UX designers to implement intuitive user interfaces.",
    },
    {
      title: "Web Developer",
      company: "Creative Agency",
      period: "2016 - 2018",
      description:
        "Built and maintained websites for various clients using modern web technologies. Optimized website performance resulting in 30% faster load times. Implemented responsive designs ensuring cross-browser compatibility.",
    },
  ],
  education: [
    {
      degree: "Master of Computer Science",
      institution: "Stanford University",
      period: "2014 - 2016",
    },
    {
      degree: "Bachelor of Science in Computer Engineering",
      institution: "MIT",
      period: "2010 - 2014",
    },
  ],
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "GraphQL",
    "AWS",
    "UI/UX Design",
    "Next.js",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "CI/CD",
    "Agile Methodologies",
  ],
  certifications: [
    "AWS Certified Developer",
    "Google Cloud Professional",
    "MongoDB Certified Developer",
  ],
};

const ResumeViewer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState("interactive");
  const interactiveRef = useRef(null);

  // GSAP animations for interactive view - optimized with cleanup
  useEffect(() => {
    const animations: gsap.core.Tween[] = [];

    if (isOpen && viewMode === "interactive" && interactiveRef.current) {
      const sections = gsap.utils.toArray(".resume-section");

      // Reset elements
      gsap.set(sections, { opacity: 0, y: 20 });

      // Animate sections
      animations.push(
        gsap.to(sections, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.3,
        })
      );

      // Animate items within each section
      sections.forEach((section) => {
        const items = (section as HTMLElement).querySelectorAll(".resume-item");
        gsap.set(items, { opacity: 0, x: -20 });

        animations.push(
          gsap.to(items, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.5,
          })
        );
      });
    }

    // Cleanup function
    return () => {
      animations.forEach((animation) => {
        if (animation) animation.kill();
      });
    };
  }, [isOpen, viewMode]);

  // Handle PDF rendering with error handling
  const renderPDFViewer = () => {
    try {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900/50">
          <div
            className="w-full h-full"
            style={{ height: "calc(90vh - 120px)" }}
          >
            <iframe
              src="/resume.pdf#view=FitH"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                backgroundColor: "transparent",
              }}
              title="Resume PDF"
            />
          </div>
        </div>
      );
    } catch {
      return (
        <div className="flex items-center justify-center h-full bg-red-500/10 p-6">
          <p className="text-red-400 text-center">
            Error loading PDF viewer. Please try the interactive view or
            download the PDF.
          </p>
        </div>
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/10 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
              <motion.h3
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-white flex items-center gap-2"
              >
                <FileText className="text-primary" size={20} />
                <span>My Resume</span>
              </motion.h3>

              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex bg-black/30 rounded-full p-1"
                >
                  <button
                    onClick={() => setViewMode("interactive")}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all",
                      viewMode === "interactive"
                        ? "bg-primary text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    <Eye size={14} />
                    <span>Interactive</span>
                  </button>
                  <button
                    onClick={() => setViewMode("pdf")}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all",
                      viewMode === "pdf"
                        ? "bg-primary text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    <FileText size={14} />
                    <span>PDF</span>
                  </button>
                </motion.div>

                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <PDFDownloadLink
                    document={<ResumePDF />}
                    fileName="Ilias_Ahmed_Resume.pdf"
                    className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                  >
                    {({ loading }) =>
                      loading ? (
                        <span className="w-[18px] h-[18px] border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span>
                      ) : (
                        <Download size={18} />
                      )
                    }
                  </PDFDownloadLink>
                </motion.div>

                <motion.button
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {viewMode === "interactive" ? (
                <div ref={interactiveRef} className="p-6 md:p-8">
                  {/* Interactive Resume View */}
                  <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10 resume-section">
                      <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 mb-2">
                        Ilias Ahmed
                      </h2>
                      <p className="text-gray-400">
                        Full Stack Developer • San Francisco, CA
                      </p>
                      <div className="w-20 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full mx-auto mt-4"></div>
                    </div>

                    {/* Experience Section */}
                    <div className="mb-10 resume-section">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        Professional Experience
                      </h3>

                      <div className="space-y-6">
                        {resumeData.experience.map((job, index) => (
                          <div
                            key={index}
                            className="resume-item bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                          >
                            <div className="flex justify-between flex-wrap gap-2 mb-2">
                              <h4 className="text-xl font-semibold text-white">
                                {job.title}
                              </h4>
                              <span className="text-primary font-medium">
                                {job.period}
                              </span>
                            </div>
                            <p className="text-gray-400 mb-4">{job.company}</p>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {job.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education Section */}
                    <div className="mb-10 resume-section">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        Education
                      </h3>

                      <div className="space-y-6">
                        {resumeData.education.map((edu, index) => (
                          <div
                            key={index}
                            className="resume-item bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300"
                          >
                            <div className="flex justify-between flex-wrap gap-2 mb-2">
                              <h4 className="text-xl font-semibold text-white">
                                {edu.degree}
                              </h4>
                              <span className="text-primary font-medium">
                                {edu.period}
                              </span>
                            </div>
                            <p className="text-gray-400">{edu.institution}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="mb-10 resume-section">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        Skills & Technologies
                      </h3>

                      <div className="resume-item flex flex-wrap gap-3">
                        {resumeData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Certifications Section */}
                    <div className="resume-section">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        Certifications
                      </h3>

                      <div className="resume-item grid grid-cols-1 md:grid-cols-3 gap-4">
                        {resumeData.certifications.map((cert, index) => (
                          <div
                            key={index}
                            className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 transition-colors"
                          >
                            <span className="text-gray-300">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                renderPDFViewer()
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-4 flex justify-between items-center bg-black/20">
              <p className="text-sm text-gray-400">Last updated: May 2023</p>
              <a
                href="/resume.pdf"
                download="Ilias_Ahmed_Resume.pdf"
                className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 text-sm hover:bg-primary/90 transition-colors"
              >
                <span>Download Resume</span>
                <Download size={14} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Add prop type validation
ResumeViewer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ResumeViewer;
