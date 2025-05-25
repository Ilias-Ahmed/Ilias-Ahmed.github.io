import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { throttle } from "lodash";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { accent, isDark } = useTheme();

  // Get computed theme colors for cursor
  const getComputedThemeColors = () => {
    if (typeof window === "undefined") return null;

    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    // Get the HSL values and convert to usable format
    const primaryHSL = computedStyle.getPropertyValue("--primary").trim();

    // Convert HSL to RGB for cursor usage
    const hslToRgb = (h: number, s: number, l: number) => {
      s /= 100;
      l /= 100;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let r = 0,
        g = 0,
        b = 0;

      if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return { r, g, b };
    };

    // Parse HSL values
    const hslValues = primaryHSL
      .split(" ")
      .map((v) => parseFloat(v.replace("%", "")));
    const [h, s, l] = hslValues;
    const { r, g, b } = hslToRgb(h, s, l);

    return {
      primary: `${r}, ${g}, ${b}`,
      secondary: `${Math.min(255, r + 20)}, ${Math.min(
        255,
        g + 20
      )}, ${Math.min(255, b + 20)}`,
    };
  };

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

  // Get accent-based colors
  const getAccentColors = useCallback(() => {
    const themeColors = getComputedThemeColors();
    if (!themeColors) {
      // Fallback colors
      const baseColors = {
        purple: { primary: "156, 81, 255", secondary: "139, 92, 246" },
        blue: { primary: "59, 130, 246", secondary: "96, 165, 250" },
        pink: { primary: "236, 72, 153", secondary: "244, 114, 182" },
        green: { primary: "34, 197, 94", secondary: "74, 222, 128" },
        orange: { primary: "249, 115, 22", secondary: "251, 146, 60" },
      };
      const colors = baseColors[accent];
      const opacity = isDark ? 0.8 : 0.6;

      return {
        default: `rgba(${colors.primary}, ${opacity * 0.3})`,
        hover: `rgba(${colors.primary}, ${opacity * 0.2})`,
        hoverBorder: `rgba(${colors.primary}, ${opacity})`,
        click: `rgba(${colors.primary}, ${opacity})`,
        trail: `rgba(${colors.secondary}, ${opacity * 0.5})`,
        clickEffect: `rgba(${colors.primary}, ${opacity * 0.2})`,
        clickEffectBorder: `rgba(${colors.primary}, ${opacity})`,
        shadow: `rgba(${colors.primary}, ${opacity * 0.4})`,
      };
    }

    const opacity = isDark ? 0.8 : 0.6;

    return {
      default: `rgba(${themeColors.primary}, ${opacity * 0.3})`,
      hover: `rgba(${themeColors.primary}, ${opacity * 0.2})`,
      hoverBorder: `rgba(${themeColors.primary}, ${opacity})`,
      click: `rgba(${themeColors.primary}, ${opacity})`,
      trail: `rgba(${themeColors.secondary}, ${opacity * 0.5})`,
      clickEffect: `rgba(${themeColors.primary}, ${opacity * 0.2})`,
      clickEffectBorder: `rgba(${themeColors.primary}, ${opacity})`,
      shadow: `rgba(${themeColors.primary}, ${opacity * 0.4})`,
    };
  }, [accent, isDark]);

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
    };
  }, [cursorState, getCursorSize, accent, isDark]);

  if (typeof window !== "undefined" && window.innerWidth < 768) return null;

  const colors = getAccentColors();

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
              ? colors.click
              : cursorState === "hover"
              ? colors.hover
              : colors.default,
          borderRadius: "50%",
          border:
            cursorState === "hover"
              ? `2px solid ${colors.hoverBorder}`
              : "none",
          mixBlendMode: isDark ? "screen" : "multiply",
          boxShadow:
            cursorState === "default" ? `0 0 15px ${colors.shadow}` : "none",
        }}
      >
        {hoverText && cursorState === "hover" && (
          <div
            className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
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
          backgroundColor: colors.trail,
          opacity: isVisible && cursorState === "default" ? 0.7 : 0,
          transition: "opacity 0.3s ease",
          boxShadow: `0 0 10px ${colors.shadow}`,
        }}
      />

      <AnimatePresence>
        {showClickEffect && (
          <motion.div
            className="fixed z-[9997] pointer-events-none rounded-full"
            style={{
              left: clickPosition.current.x - 20,
              top: clickPosition.current.y - 20,
              backgroundColor: colors.clickEffect,
              border: `2px solid ${colors.clickEffectBorder}`,
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
