import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useKeyboardNavigation = (routes: string[]) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = routes.indexOf(location.pathname);

      // Navigate with arrow keys
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        if (currentIndex < routes.length - 1) {
          navigate(routes[currentIndex + 1]);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentIndex > 0) {
          navigate(routes[currentIndex - 1]);
        }
      }

      // Navigate with number keys (1-5)
      const numKey = parseInt(e.key);
      if (!isNaN(numKey) && numKey >= 1 && numKey <= routes.length) {
        e.preventDefault();
        navigate(routes[numKey - 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, location.pathname, routes]);
};
