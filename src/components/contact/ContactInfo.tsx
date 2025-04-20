import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";

type ContactInfoItem = {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
};

const ContactInfo = () => {
  const contactInfo: ContactInfoItem[] = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "iliasahmed70023@gmail.com",
      href: "mailto:iliasahmed70023@gmail.com",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Location",
      value: "Kamrup, Assam",
      href: "https://maps.google.com/?q=Kamrup+Assam",
    },
  ];

  return (
    <motion.div className="cosmic-card p-8 rounded-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden">
      {/* Cosmic background elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/30 blur-2xl" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-accent/30 blur-2xl" />
      </div>

      <h3 className="text-2xl font-bold mb-6 inline-flex items-center">
        <span className="bg-primary/20 p-2 rounded-lg mr-3">
          <Mail className="w-5 h-5 text-primary" />
        </span>
        Contact Information
      </h3>

      <div className="space-y-6">
        {contactInfo.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center group"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 rounded-xl mr-4 transition-colors duration-300">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-400">{item.label}</p>
              <a
                href={item.href}
                className="text-white hover:text-primary transition-colors duration-300"
                target={item.label === "Location" ? "_blank" : undefined}
                rel={
                  item.label === "Location" ? "noopener noreferrer" : undefined
                }
              >
                {item.value}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ContactInfo;
