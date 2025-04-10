import { motion } from "framer-motion";

export function LoadingIndicator() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="text-white text-sm font-medium">Loading...</div>

        <div className="mt-2 text-gray-400 text-xs max-w-xs text-center animate-pulse">
          Preparing your experience...
        </div>
      </motion.div>
    </div>
  );
}
