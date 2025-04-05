import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";

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
      className="py-24 px-6 relative overflow-hidden"
      id="contact"
    >
      {/* Cosmic background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-primary/5" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

        {/* Animated stars */}
        <div className="stars-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
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
            <Sparkles className="w-6 h-6 text-primary mr-2 animate-pulse" />
            <TextGlitch
              text="Let's Connect"
              className="text-4xl md:text-5xl font-bold text-gradient"
            />
            <Sparkles className="w-6 h-6 text-primary ml-2 animate-pulse" />
          </div>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
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
      </div>
    </section>
  );
};

export default ContactSection;
