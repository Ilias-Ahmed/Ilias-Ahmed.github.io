import { useHeroStore } from "@/hooks/useHero";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface NavigationIndicatorProps {
  currentPath: string;
  routes: string[];
  isNavigating: boolean;
}

const NavigationIndicator = ({
  currentPath,
  routes,
  isNavigating,
}: NavigationIndicatorProps) => {
  const { mode } = useHeroStore();
  const navigate = useNavigate();

  // Map route paths to readable names
  const routeNames: Record<string, string> = {
    "/": "Home",
    "/about": "About",
    "/skills": "Skills",
    "/projects": "Projects",
    "/contact": "Contact",
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-full px-6 py-3 flex items-center space-x-3 shadow-lg">
        {routes.map((route) => {
          const isActive = route === currentPath;

          return (
            <motion.div
              key={route}
              className="relative"
              initial={{ opacity: 0.5, scale: 0.8 }}
              animate={{
                opacity: isActive ? 1 : 0.5,
                scale: isActive ? 1 : 0.8,
                y: isActive && isNavigating ? [0, -10, 0] : 0,
              }}
              transition={{
                duration: 0.5,
                y: { duration: 0.5, times: [0, 0.5, 1] },
              }}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  isActive ? "cursor-default" : "cursor-pointer"
                }`}
                style={{
                  background: isActive
                    ? mode === "coder"
                      ? "#3080ff"
                      : "#ff3080"
                    : "#666",
                }}
                onClick={() => {
                  if (!isActive) {
                    navigate(route);
                  }
                }}
              />

              {isActive && (
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {routeNames[route]}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black bg-opacity-70"></div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationIndicator;
