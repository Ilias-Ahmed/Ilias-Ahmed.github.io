import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

import TextGlitch from "@/components/contact/TextGlitch";
import ContactInfo from "@/components/contact/ContactInfo";
import SocialLinks from "@/components/contact/SocialLinks";
import AvailabilityBadges from "@/components/contact/AvailabilityBadges";
import InteractiveMap from "@/components/contact/InteractiveMap";
import ContactForm from "@/components/contact/ContactForm";

const ContactSection = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 });

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden theme-transition"
      id="contact"
      style={{
        background: isDark
          ? `radial-gradient(ellipse at center, ${accentColors.primary}05 0%, transparent 50%)`
          : `radial-gradient(ellipse at center, ${accentColors.primary}08 0%, transparent 50%)`,
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: accentColors.primary }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: accentColors.secondary }}
        />
        <div
          className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full blur-2xl opacity-10"
          style={{ backgroundColor: accentColors.tertiary }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={
            isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          {/* Title with glitch effect and sparkles */}
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles
              className="w-6 h-6 mr-2 animate-pulse"
              style={{ color: accentColors.primary }}
            />
            <span
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
              }}
            >
              <TextGlitch
                text="Let's Connect"
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent"
              />
            </span>
            <Sparkles
              className="w-6 h-6 ml-2 animate-pulse"
              style={{ color: accentColors.primary }}
            />
          </div>

          <p className="text-lg opacity-70 max-w-2xl mx-auto">
            Have a project in mind or want to discuss opportunities? I'm always
            open to new ideas and collaborations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact info and social links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            className="lg:col-span-2 space-y-8"
          >
            <motion.div variants={itemVariants}>
              <ContactInfo />
            </motion.div>

            <motion.div variants={itemVariants}>
              <SocialLinks />
            </motion.div>

            <motion.div variants={itemVariants}>
              <AvailabilityBadges />
            </motion.div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 30 }}
            animate={
              isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
            }
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="lg:col-span-3"
          >
            <ContactForm />

            <motion.div
              variants={itemVariants}
              className="hidden md:block mt-8"
            >
              <InteractiveMap />
            </motion.div>
          </motion.div>
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div
            className="p-8 rounded-2xl backdrop-blur-sm border relative overflow-hidden"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.02)"
                : "rgba(255,255,255,0.5)",
              borderColor: `${accentColors.primary}30`,
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  background: `linear-gradient(45deg, ${accentColors.primary}20, ${accentColors.secondary}20)`,
                }}
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Start Something Amazing?
              </h3>
              <p className="opacity-70 mb-6 max-w-2xl mx-auto">
                Whether you have a specific project in mind or just want to
                explore possibilities, I'm here to help bring your ideas to
                life.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  href="mailto:iliasahmed70023@gmail.com"
                  className="px-6 py-3 rounded-lg font-medium text-white transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${accentColors.primary}, ${accentColors.secondary})`,
                    boxShadow: `0 4px 14px ${accentColors.shadow}`,
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 6px 20px ${accentColors.shadow}`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start a Conversation
                </motion.a>

                <motion.a
                  href="https://calendly.com/your-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-300 border"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    borderColor: accentColors.primary,
                    color: accentColors.primary,
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: `${accentColors.primary}10`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Schedule a Call
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
