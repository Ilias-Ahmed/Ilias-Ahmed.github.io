import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader, CheckCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { triggerHapticFeedback } from "@/utils/haptics";
import emailjs from '@emailjs/browser';

import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
} from "@/utils/emailjs";

// Define schema with Zod
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

// Infer TypeScript type from the schema
type ContactFormData = z.infer<typeof contactFormSchema>;



const ContactForm = () => {
  const [formState, setFormState] = useState({
    isSubmitting: false,
    isSubmitted: false,
  });

  const [activeField, setActiveField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    triggerHapticFeedback();
    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
    }));

    try {
      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject || "Portfolio Contact Form",
          message: data.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      setFormState({
        isSubmitting: false,
        isSubmitted: true,
      });

      toast("Message sent successfully!", {
        description: "I'll get back to you as soon as possible.",
      });

      // Reset form after delay
      setTimeout(() => {
        reset();
        setFormState((prev) => ({
          ...prev,
          isSubmitted: false,
        }));
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);

      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));

      toast("Something went wrong", {
        description: "Please try again later",
      });
    }
  };

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  // Success animation variants
  const successIconVariants = {
    initial: { scale: 0 },
    animate: {
      scale: [0, 1.2, 1],
      transition: { duration: 0.5, times: [0, 0.6, 1] },
    },
  };

  const successParticleVariants = {
    initial: { opacity: 0 },
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      x: [0, (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 30)],
      y: [0, -40 - Math.random() * 40],
      transition: {
        duration: 0.8 + Math.random() * 0.5,
        delay: 0.1 + Math.random() * 0.2,
      },
    }),
  };

  return (
    <div className="cosmic-card p-8 py-14 rounded-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden">
      {/* Cosmic background elements */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-2xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-accent/20 blur-2xl" />
      </div>

      <AnimatePresence mode="wait">
        {formState.isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col items-center justify-center text-center py-12 relative"
          >
            <motion.div
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 relative"
              variants={successIconVariants}
              initial="initial"
              animate="animate"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />

              {/* Success particles animation */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={successParticleVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute w-2 h-2 rounded-full bg-green-500"
                  style={{
                    top: "50%",
                    left: "50%",
                    originX: "50%",
                    originY: "50%",
                  }}
                />
              ))}
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
            <p className="text-gray-400 mb-8 max-w-md">
              Thank you for reaching out. I'll get back to you as soon as
              possible.
            </p>
            <button
              onClick={() => {
                setFormState((prev) => ({ ...prev, isSubmitted: false }));
                triggerHapticFeedback();
                reset();
              }}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-300"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 inline-flex items-center">
              <span className="bg-primary/20 p-2 rounded-lg mr-3">
                <Send className="w-5 h-5 text-primary" />
              </span>
              Send a Message
              <Sparkles className="w-5 h-5 text-primary ml-2 animate-pulse" />
            </h3>

            <form
              ref={formRef}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className={`block text-sm font-medium ${
                      activeField === "name" ? "text-primary" : "text-gray-400"
                    } transition-colors duration-200`}
                  >
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      {...register("name", {
                        onBlur: handleBlur,
                      })}
                      onFocus={() => handleFocus("name")}
                      className={`w-full p-3 bg-white/5 border ${
                        errors.name
                          ? "border-red-500"
                          : activeField === "name"
                          ? "border-primary"
                          : "border-gray-700"
                      } rounded-lg focus:outline-none transition-colors duration-200 cosmic-input`}
                      placeholder="Ilias Ahmed"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${
                      activeField === "email" ? "text-primary" : "text-gray-400"
                    } transition-colors duration-200`}
                  >
                    Your Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      {...register("email", {
                        onBlur: handleBlur,
                      })}
                      onFocus={() => handleFocus("email")}
                      className={`w-full p-3 bg-white/5 border ${
                        errors.email
                          ? "border-red-500"
                          : activeField === "email"
                          ? "border-primary"
                          : "border-gray-700"
                      } rounded-lg focus:outline-none transition-colors duration-200 cosmic-input`}
                      placeholder="mehbub@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className={`block text-sm font-medium ${
                    activeField === "subject" ? "text-primary" : "text-gray-400"
                  } transition-colors duration-200`}
                >
                  Subject (Optional)
                </label>
                <input
                  id="subject"
                  {...register("subject", {
                    onBlur: handleBlur,
                  })}
                  onFocus={() => handleFocus("subject")}
                  className={`w-full p-3 bg-white/5 border ${
                    activeField === "subject"
                      ? "border-primary"
                      : "border-gray-700"
                  } rounded-lg focus:outline-none transition-colors duration-200 cosmic-input`}
                  placeholder="What is this regarding?"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className={`block text-sm font-medium ${
                    activeField === "message" ? "text-primary" : "text-gray-400"
                  } transition-colors duration-200`}
                >
                  Your Message
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    {...register("message", {
                      onBlur: handleBlur,
                    })}
                    onFocus={() => handleFocus("message")}
                    rows={5}
                    className={`w-full p-3 bg-white/5 border ${
                      errors.message
                        ? "border-red-500"
                        : activeField === "message"
                        ? "border-primary"
                        : "border-gray-700"
                    } rounded-lg focus:outline-none transition-colors duration-200 resize-none cosmic-input`}
                    placeholder="Tell me about your project or inquiry..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full py-3 px-6 text-white font-medium rounded-lg transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cosmic-button"
                style={{
                  background: "linear-gradient(to right, #9333ea, #ec4899)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => triggerHapticFeedback()}
              >
                {formState.isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </motion.button>

              <div className="text-center text-xs text-gray-500 mt-4">
                By submitting this form, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
