import { useSpring } from "@react-spring/web";
import { useState, useEffect } from "react";

export function useParallax(sensitivity = 15) {
  const [{ offset }, api] = useSpring(() => ({ offset: [0, 0] }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      api.start({ offset: [x * sensitivity, y * sensitivity] });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [api, sensitivity]);

  return offset;
}
