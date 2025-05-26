import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type ContactInfoItem = {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
};

const ContactInfo = () => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

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
    <motion.div
      className="p-8 rounded-2xl backdrop-blur-sm border relative overflow-hidden theme-transition"
      style={{
        backgroundColor: isDark
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.8)",
        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      }}
    >
      {/* Cosmic background elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-2xl"
          style={{ backgroundColor: `${accentColors.primary}30` }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full blur-2xl"
          style={{ backgroundColor: `${accentColors.secondary}30` }}
        />
      </div>

      <h3 className="text-2xl font-bold mb-6 inline-flex items-center">
        <span
          className="p-2 rounded-lg mr-3"
          style={{ backgroundColor: `${accentColors.primary}20` }}
        >
          <Mail className="w-5 h-5" style={{ color: accentColors.primary }} />
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
            <div
              className="w-12 h-12 flex items-center justify-center rounded-xl mr-4 transition-all duration-300 group-hover:scale-110"
              style={{
                backgroundColor: `${accentColors.primary}10`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${accentColors.primary}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${accentColors.primary}10`;
              }}
            >
              <span style={{ color: accentColors.primary }}>{item.icon}</span>
            </div>
            <div>
              <p className="text-sm opacity-70">{item.label}</p>
              <a
                href={item.href}
                className="transition-colors duration-300 hover:underline"
                style={{
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = accentColors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "inherit";
                }}
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
