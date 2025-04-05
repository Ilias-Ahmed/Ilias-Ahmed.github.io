import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "../SmoothScroll";
import { throttle } from "lodash";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [cursorState, setCursorState] = useState<"default" | "hover" | "click">(
    "default"
  );
  const [hoverText, setHoverText] = useState("");
  const [showClickEffect, setShowClickEffect] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const clickPosition = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);
  const hoverElementRef = useRef<HTMLElement | null>(null);
  const { lenis } = useLenis();

  // Cursor size based on state
  const getCursorSize = useCallback(() => {
    switch (cursorState) {
      case "hover":
        return 40;
      case "click":
        return 32;
      default:
        return 16;
    }
  }, [cursorState]);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    document.documentElement.style.cursor = "none";

    const interactiveElements = document.querySelectorAll(
      "a, button, [role=button], input[type=submit], input[type=button], .clickable"
    );

    interactiveElements.forEach((el) => {
      el.setAttribute("data-cursor-hover", "true");
    });

    let animationFrameId: number;

    const updateCursorPosition = () => {
      const { x, y } = positionRef.current;
      const size = getCursorSize();

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x - size / 2}px, ${
          y - size / 2
        }px, 0)`;
      }

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${x - 4}px, ${
          y - 4
        }px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateCursorPosition);
    };

    const throttledMouseMove = throttle((e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };

      if (hoverElementRef.current && cursorState === "hover") {
        const rect = hoverElementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX ** 2 + distY ** 2);

        if (distance < 100) {
          const pull = 0.3;
          positionRef.current = {
            x: e.clientX - distX * pull,
            y: e.clientY - distY * pull,
          };
        }
      }
    }, 10);

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown.current = true;
      setCursorState("click");
      clickPosition.current = { x: e.clientX, y: e.clientY };
      setShowClickEffect(true);
      setTimeout(() => setShowClickEffect(false), 500);
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
      setCursorState(hoverElementRef.current ? "hover" : "default");
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const throttledHoverDetect = throttle((e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverEl = target.closest(
        "[data-cursor-hover]"
      ) as HTMLElement | null;

      if (hoverEl) {
        hoverElementRef.current = hoverEl;
        setCursorState(isMouseDown.current ? "click" : "hover");

        const tag = hoverEl.tagName.toLowerCase();
        setHoverText(tag === "a" ? "View" : tag === "button" ? "Press" : "");
      } else {
        hoverElementRef.current = null;
        setCursorState(isMouseDown.current ? "click" : "default");
        setHoverText("");
      }
    }, 100);

    window.addEventListener("mousemove", throttledMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", throttledHoverDetect);

    if (lenis) {
      lenis.on("scroll", updateCursorPosition);
    }

    animationFrameId = requestAnimationFrame(updateCursorPosition);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", throttledMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", throttledHoverDetect);
      cancelAnimationFrame(animationFrameId);
      throttledMouseMove.cancel();
      throttledHoverDetect.cancel();

      if (lenis) lenis.off("scroll", updateCursorPosition);
    };
  }, [cursorState, lenis, getCursorSize]);

  if (typeof window !== "undefined" && window.innerWidth < 768) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed z-[9999] pointer-events-none transition-[width,height,background-color,opacity] duration-300"
        style={{
          width: `${getCursorSize()}px`,
          height: `${getCursorSize()}px`,
          opacity: isVisible ? 1 : 0,
          backgroundColor:
            cursorState === "click"
              ? "rgba(156, 81, 255, 0.8)"
              : "rgba(156, 81, 255, 0.3)",
          borderRadius: "50%",
          border:
            cursorState === "hover"
              ? "2px solid rgba(156, 81, 255, 0.8)"
              : "none",
          mixBlendMode: "difference",
          boxShadow:
            cursorState === "default"
              ? "0 0 15px rgba(156, 81, 255, 0.4)"
              : "none",
        }}
      >
        {hoverText && cursorState === "hover" && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
            {hoverText}
          </div>
        )}
      </div>

      <div
        ref={trailRef}
        className="fixed z-[9998] pointer-events-none rounded-full"
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: "rgba(156, 81, 255, 0.5)",
          opacity: isVisible && cursorState === "default" ? 0.7 : 0,
          transition: "opacity 0.3s ease",
          boxShadow: "0 0 10px rgba(156, 81, 255, 0.3)",
        }}
      />

      <AnimatePresence>
        {showClickEffect && (
          <motion.div
            className="fixed z-[9997] pointer-events-none rounded-full"
            style={{
              left: clickPosition.current.x - 20,
              top: clickPosition.current.y - 20,
              backgroundColor: "rgba(156, 81, 255, 0.2)",
              border: "2px solid rgba(156, 81, 255, 0.8)",
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 80, height: 80, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
