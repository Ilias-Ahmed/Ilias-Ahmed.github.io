import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  Sphere,
  MeshDistortMaterial,
  Environment,
  Float,
  PerspectiveCamera,
  useTexture,
  Plane,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { useTheme } from "@/contexts/ThemeContext";

// 3D Text component that displays your name
const FloatingName = ({ text, isHovered }: { text: string, isHovered: boolean }) => {
  const textRef = useRef<THREE.Mesh | null>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!textRef.current) return;

    const time = state.clock.getElapsedTime();
    textRef.current.position.y = Math.sin(time * 0.3) * 0.1;
    textRef.current.rotation.x = Math.sin(time * 0.2) * 0.05;
    textRef.current.rotation.z = Math.cos(time * 0.1) * 0.03;
  });

  return (
    <Text
      ref={textRef}
      position={[0, 0, 0]}
      fontSize={viewport.width < 10 ? 0.8 : 1.2}
      color="#f0f0f0"
      font="/fonts/Inter-Bold.woff"
      letterSpacing={0.1}
      textAlign="center"
    >
      {text}
      <meshStandardMaterial
        color={isHovered ? "#EC4899" : "#8B5CF6"}
        emissive={isHovered ? "#EC4899" : "#8B5CF6"}
        emissiveIntensity={isHovered ? 2.5 : 2}
        toneMapped={false}
      />
    </Text>
  );
};
// Interactive 3D sphere that reacts to mouse movement
const InteractiveSphere = ({ mousePosition, isHovered, onClick }: { mousePosition: [number, number] | null, isHovered: boolean, onClick: () => void }) => {
  const meshRef = useRef(null);

  const [position, setPosition] = useState<[number, number, number]>([0, 0, -2]);

  useFrame(() => {
    if (!meshRef.current || !mousePosition) return;

    const targetX = (mousePosition[0] || 0) / 5;
    const targetY = (mousePosition[1] || 0) / 5;

    setPosition(prev => [
      THREE.MathUtils.lerp(prev[0], targetX, 0.1),
      THREE.MathUtils.lerp(prev[1], targetY, 0.1),
      prev[2]
    ]);
  });

  return (
    <Sphere
      args={[1.2, 64, 64]}
      position={position}
      ref={meshRef}
      onClick={onClick}
    >
      <MeshDistortMaterial
        color={isHovered ? "#EC4899" : "#8B5CF6"}
        envMapIntensity={0.8}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
        metalness={0.9}
        distort={isHovered ? 0.6 : 0.3}
        speed={isHovered ? 5 : 2}
      />
    </Sphere>
  );

};// Grid floor for the 3D scene
const GridFloor = () => {
  const gridTexture = useTexture("/images/grid.png");

  useEffect(() => {
    if (gridTexture) {
      gridTexture.wrapS = gridTexture.wrapT = THREE.RepeatWrapping;
    }
  }, [gridTexture]);

  return (
    <Plane
      args={[40, 40]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
    >
      <meshStandardMaterial
        map={gridTexture}
        transparent
        opacity={0.2}
        color="#8B5CF6"
        emissive="#8B5CF6"
        emissiveIntensity={0.5}
      />
    </Plane>
  );
};
// Post-processing effects for the 3D scene
const Effects = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={isHovered ? 2 : 1.5}
      />
      <ChromaticAberration
        offset={isHovered ? [0.006, 0.006] : [0.002, 0.002]}
      />
    </EffectComposer>
  );
};

// Main Hero component
const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0]);
  useTheme(); // Call useTheme without destructuring if no variables are used
  const navigate = useNavigate();

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position for parallax effects
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  useEffect(() => {
    // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
          const x = e.clientX - window.innerWidth / 2;
          const y = e.clientY - window.innerHeight / 2;

          mouseX.set(x);
          mouseY.set(y);
          setMousePosition([x / window.innerWidth, y / window.innerHeight]);
        };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const handleExploreClick = () => {
    navigate("/about");
  };

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight
            position={[-10, -10, -10]}
            color="#EC4899"
            intensity={0.5}
          />

          <Float
            speed={1.5}
            rotationIntensity={0.2}
            floatIntensity={0.5}
            floatingRange={[-0.1, 0.1]}
          >
            <FloatingName text="ILIAS AHMED" isHovered={isHovered} />
          </Float>

          <InteractiveSphere
            mousePosition={mousePosition}
            isHovered={isHovered}
            onClick={() => setIsHovered(!isHovered)}
          />

          <GridFloor />
          <Environment preset="city" />
          <Effects isHovered={isHovered} />
        </Canvas>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 min-h-screen">
        <motion.div
          className="max-w-4xl w-full"
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
          }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="text-center mb-8"
            variants={itemVariants}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.h2
              className="text-xl md:text-2xl font-mono text-purple-400 mb-4"
              variants={itemVariants}
            >
              <motion.span
                animate={{
                  opacity: [1, 0.7, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                &lt; Hello World /&gt;
              </motion.span>
            </motion.h2>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white font-display"
              variants={itemVariants}
            >
              I'm{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                Ilias Ahmed
              </span>
            </motion.h1>

            <motion.div
              className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"
              variants={itemVariants}
            />

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8"
              variants={itemVariants}
            >
              3D Web Developer & Creative Coder
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8"
              variants={itemVariants}
            >
              <motion.button
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg
                          shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                          border border-purple-500/50 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExploreClick}
              >
                {/* Button glow effect */}
                <motion.span
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/0 via-white/80 to-pink-600/0"
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "100%", opacity: 0.5 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                    repeatDelay: 0.5,
                  }}
                />

                <span className="relative z-10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                  <span>Explore My Work</span>
                </span>
              </motion.button>

              <motion.button
                className="w-full sm:w-auto px-8 py-3 bg-transparent text-purple-400 font-medium rounded-lg
                          border border-purple-500/30 hover:border-purple-500/70 transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContactClick}
              >
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Let's Connect</span>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <span className="text-xs text-purple-400 uppercase tracking-widest mb-2">
            Scroll Down
          </span>
          <motion.div
            className="w-6 h-10 border-2 border-purple-500/50 rounded-full flex justify-center p-1"
            animate={{
              boxShadow: [
                "0 0 0px rgba(139, 92, 246, 0)",
                "0 0 10px rgba(139, 92, 246, 0.5)",
                "0 0 0px rgba(139, 92, 246, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-purple-500 rounded-full"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating data particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;

