// src/sections/HeroAbout.tsx
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import { Scene } from "@/components/hero/Scene";
import ProfileCard from "@/components/about/ProfileCard";
import ExperienceTimeline from "@/components/about/ExperienceTimeline";
import { useHeroStore } from "@/hooks/useHero";
import { timelineData } from "@/components/about/aboutData";

export default function HeroAbout() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const profileOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const timelineOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const { mode } = useHeroStore();

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
          y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] w-full overflow-hidden"
      id="hero-about"
    >
      {/* 3D Background that stays fixed while scrolling */}
      <div className="sticky top-0 h-screen w-full">
        <motion.div style={{ opacity: heroOpacity }} className="h-full w-full">
          <Canvas shadows>
            <Scene mousePosition={mousePosition} />
          </Canvas>
        </motion.div>

        {/* Overlay content that appears on scroll */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: profileOpacity }}
        >
          <div className="max-w-4xl w-full px-4 backdrop-blur-sm bg-background/30 rounded-xl">
            <ProfileCard />
          </div>
        </motion.div>
      </div>

      {/* Timeline section that appears as user continues scrolling */}
      <motion.div
        className="relative z-10 bg-gradient-to-b from-transparent to-background pt-[60vh] pb-32"
        style={{ opacity: timelineOpacity }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <ExperienceTimeline timelineData={timelineData} isInView={true} />
        </div>
      </motion.div>
    </section>
  );
}
