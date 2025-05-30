import { triggerHapticFeedback } from "@/utils/haptics";
import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface TextGlitchProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const TextGlitch: React.FC<TextGlitchProps> = ({
  text,
  className = "",
  style = {}
}) => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const originalText = useRef(text);
  const glitchChars = "!<>-_\\/[]{}—=+*^?#________";
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const intervalRef = useRef<number | null>(null);

  const startGlitch = () => {
    if (!textRef.current) return;

    let frame = 0;
    const maxFrames = 20;

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      if (!textRef.current) return;

      textRef.current.innerText = originalText.current
        .split("")
        .map((_, i) => {
          if (i < frame / 2) return originalText.current[i];
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        })
        .join("");

      frame++;
      if (frame >= maxFrames) {
        clearInterval(intervalRef.current!);
        textRef.current!.innerText = originalText.current;
      }
    }, 30);
  };

  useEffect(() => {
    originalText.current = text;
    startGlitch(); // Trigger once when mounted

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  const defaultStyle = {
    backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
    ...style,
  };

  return (
    <h2
      ref={textRef}
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
      style={defaultStyle}
      onMouseEnter={startGlitch}
      onClick={startGlitch}
      onTouchStart={() => {
        startGlitch();
        triggerHapticFeedback();
      }}
    >
      {text}
    </h2>
  );
};

export default TextGlitch;
