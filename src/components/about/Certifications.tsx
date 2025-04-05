import { motion } from "framer-motion";
export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  image: string;
}
interface CertificationsProps {
  certifications: CertificationItem[];
  isInView: boolean;
}
const Certifications = ({ certifications, isInView }: CertificationsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-12 md:mb-16"
    >
      <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center">Certifications & Achievements</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            whileHover={{
              y: -10,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            className="bg-secondary rounded-lg overflow-hidden glass-effect"
          >
            <div className="h-32 sm:h-40 overflow-hidden">
              <motion.img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="p-4 sm:p-5">
              <h4 className="font-medium text-base sm:text-lg mb-2">{cert.title}</h4>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-primary">{cert.issuer}</span>
                <span className="text-gray-400">{cert.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Certifications;
