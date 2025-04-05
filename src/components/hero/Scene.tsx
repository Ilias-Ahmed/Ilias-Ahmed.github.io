import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  useGLTF,
  useAnimations,
  Float,
  Text3D,
  Stars,
  Cloud,
  ContactShadows,
  useProgress,
  Html
} from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { useHeroStore } from "@/hooks/useHero";
import { useTheme } from "@/contexts/ThemeContext";
import { gsap } from "gsap";

// Optimized components
import { OptimizedAudioVisualizer } from "./OptimizedAudioVisualizer";
import { FloatingClock } from "./FloatingClock";
import { InteractiveObjects } from "./InteractiveObjects";
import { HeroText } from "./HeroText";
import { CameraController } from "./CameraController";
import { HeroControls } from "./HeroControls";

// Loading indicator
function LoadingIndicator() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 border-4 border-t-purple-600 border-r-transparent border-b-purple-600 border-l-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-white text-xl font-bold">{progress.toFixed(0)}%</div>
        <div className="text-purple-400 mt-2">Loading 3D Experience...</div>
      </div>
    </Html>
  );
}

// Environment setup based on time of day
function EnvironmentSetup() {
  const { timeOfDay, enablePostProcessing } = useHeroStore();

  // Environment lighting based on time of day
  const lightProps = useSpring({
    intensity: timeOfDay === "night" ? 0.2 :
               timeOfDay === "evening" ? 0.7 :
               timeOfDay === "morning" ? 1.2 : 1.5,
    color: timeOfDay === "night" ? "#2a2a7a" :
           timeOfDay === "evening" ? "#ff7e33" :
           timeOfDay === "morning" ? "#ffd6aa" : "#ffffff",
  });

  // Background color based on time of day
  const fogProps = useSpring({
    color: timeOfDay === "night" ? "#050520" :
           timeOfDay === "evening" ? "#331800" :
           timeOfDay === "morning" ? "#e6f7ff" : "#87ceeb",
  });

  // Memoize environment preset to prevent unnecessary re-renders
  const envPreset = useMemo(() => {
    return timeOfDay === "night" ? "night" :
           timeOfDay === "evening" ? "sunset" :
           timeOfDay === "morning" ? "dawn" : "day";
  }, [timeOfDay]);

  return (
    <>
      {/* Dynamic lighting */}
      <animated.directionalLight
        position={[5, 5, 5]}
        castShadow
        intensity={lightProps.intensity}
        color={lightProps.color}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 50]} />
      </animated.directionalLight>

      <animated.ambientLight
        intensity={lightProps.intensity.to(i => i * 0.5)}
        color={lightProps.color}
      />

      {/* Dynamic fog */}
      <animated.fog attach="fog" args={[fogProps.color, 1, 20]} />

      {/* Environment elements based on time of day */}
      {(timeOfDay === "night" || timeOfDay === "evening") && (
        <Stars
          radius={100}
          depth={50}
          count={timeOfDay === "night" ? 5000 : 2000}
          factor={4}
          saturation={0.5}
          fade
          speed={1}
        />
      )}

      {(timeOfDay === "day" || timeOfDay === "morning") && (
        <>
          <Cloud position={[-4, 2, -5]} speed={0.2} opacity={0.7} />
          <Cloud position={[4, 3, -6]} speed={0.1} opacity={0.5} />
        </>
      )}

      {/* Post-processing effects */}
      {enablePostProcessing && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
          <ChromaticAberration offset={[0.0005, 0.0005]} />
          <Vignette eskil={false} offset={0.1} darkness={0.2} />
        </EffectComposer>
      )}

      {/* Environment map for reflections */}
      <Environment preset={envPreset} />
    </>
  );
}

// Main character/avatar
function Avatar({ mousePosition }) {
  const { mode, incrementInteraction } = useHeroStore();
  const avatarRef = useRef();
  const [modelLoaded, setModelLoaded] = useState(false);

  // Load model with error handling
  const { scene, animations } = useGLTF("/models/avatar.glb", true, true, (error) => {
    console.error("Error loading 3D model:", error);
  });

  // Setup animations
  const { actions } = useAnimations(animations, avatarRef);

  // Set model as loaded if scene exists
  useEffect(() => {
    if (scene && !modelLoaded) {
      setModelLoaded(true);
    }
  }, [scene, modelLoaded]);

  // Set up avatar animations based on interactions
  useEffect(() => {
    if (modelLoaded && actions) {
      // Reset all animations
      Object.values(actions).forEach((action) => action?.stop());

      // Play idle animation by default
      if (actions.idle) {
        actions.idle.play();
      }
    }
  }, [modelLoaded, actions]);

  // Handle avatar head tracking mouse cursor
  useFrame(() => {
    if (avatarRef.current && modelLoaded) {
      // Smoothly rotate the avatar's head to follow the cursor
      const head = avatarRef.current.getObjectByName("Head");
      if (head) {
        gsap.to(head.rotation, {
          x: mousePosition.y * 0.3,
          y: mousePosition.x * 0.5,
          duration: 0.5,
        });
      }
    }
  });

  // Handle avatar wave animation on click
  const handleAvatarClick = () => {
    incrementInteraction();
    if (modelLoaded && actions && actions.wave) {
      actions.idle?.stop();
      actions.wave.reset().play();
      // Return to idle after wave animation
      setTimeout(() => {
        if (actions.wave && actions.idle) {
          actions.wave.crossFadeTo(actions.idle, 0.5, true);
          actions.idle.play();
        }
      }, 2000);
    } else {
      // Fallback animation for when we don't have the model
      if (avatarRef.current) {
        gsap.to(avatarRef.current.rotation, {
          y: avatarRef.current.rotation.y + Math.PI * 2,
          duration: 1,
          ease: "power2.inOut",
        });
      }
    }
  };

  // Memoize fallback avatar to prevent unnecessary re-renders
  const FallbackAvatar = useMemo(() => (
    <>
      <mesh castShadow position={[0, 1, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={mode === "developer" ? "#3080ff" : "#ff3080"}
          emissive={mode === "developer" ? "#104080" : "#801040"}
          emissiveIntensity={0.3}
        />
        {/* Eyes */}
        <mesh position={[0.2, 0.1, 0.4]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </mesh>
        <mesh position={[-0.2, 0.1, 0.4]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </mesh>
        {/* Mouth */}
        <mesh position={[0, -0.15, 0.4]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </mesh>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1, 32]} />
        <meshStandardMaterial
          color={mode === "developer" ? "#2060cc" : "#cc2060"}
        />
      </mesh>
      {/* Arms */}
      <mesh
        name="leftArm"
        castShadow
        position={[-0.6, 0.2, 0]}
        rotation={[0, 0, Math.PI / 4]}
      >
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial
          color={mode === "developer" ? "#3080ff" : "#ff3080"}
        />
      </mesh>
      <mesh
        name="rightArm"
        castShadow
        position={[0.6, 0.2, 0]}
        rotation={[0, 0, -Math.PI / 4]}
      >
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial
          color={mode === "developer" ? "#3080ff" : "#ff3080"}
        />
      </mesh>
    </>
  ), [mode]);

  return (
    <group
      ref={avatarRef}
      position={[0, -1, 0]}
      scale={1.5}
      onClick={handleAvatarClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {modelLoaded && scene ? (
        <primitive object={scene.clone()} />
      ) : (
        FallbackAvatar
      )}

      {/* Shadow beneath the avatar */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.5}
        scale={5}
        blur={2}
        far={5}
        resolution={256}
        color="#000000"
      />
    </group>
  );
}

// Floating objects around the scene
function FloatingObjects() {
  const { mode, enableParticles } = useHeroStore();

  // Define objects based on mode - memoized to prevent unnecessary recalculations
  const objects = useMemo(() => {
    const devObjects = [
      { position: [2, 1, -1], scale: 0.4, icon: "</>", color: "#3080ff" },
      { position: [-2, 0, -2], scale: 0.5, icon: "{ }", color: "#22c55e" },
      { position: [1, -1, -3], scale: 0.6, icon: "[]", color: "#f59e0b" },
      { position: [-1.5, 2, -2], scale: 0.4, icon: "//", color: "#ec4899" },
    ];

    const designObjects = [
      { position: [2, 1, -1], scale: 0.4, icon: "✏️", color: "#ff3080" },
      { position: [-2, 0, -2], scale: 0.5, icon: "🎨", color: "#8b5cf6" },
      { position: [1, -1, -3], scale: 0.6, icon: "📐", color: "#f59e0b" },
      { position: [-1.5, 2, -2], scale: 0.4, icon: "💡", color: "#ec4899" },
    ];

    const creativeObjects = [
      { position: [2, 1, -1], scale: 0.4, icon: "🎵", color: "#8b5cf6" },
      { position: [-2, 0, -2], scale: 0.5, icon: "🎬", color: "#22c55e" },
      { position: [1, -1, -3], scale: 0.6, icon: "📷", color: "#3080ff" },
      { position: [-1.5, 2, -2], scale: 0.4, icon: "🎭", color: "#ec4899" },
    ];

    // Select objects based on current mode
    return mode === "developer"
      ? devObjects
      : mode === "designer"
        ? designObjects
        : creativeObjects;
  }, [mode]);

  return (
    <>
      {objects.map((obj, index) => (
        <Float
          key={index}
          speed={1 + index * 0.5} // Vary speed for more natural movement
          rotationIntensity={0.5}
          floatIntensity={1}
          position={obj.position}
        >
          <Text3D
            font="/fonts/inter_bold.json"
            size={obj.scale}
            height={0.1}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            {obj.icon}
            <meshStandardMaterial
              color={obj.color}
              emissive={obj.color}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </Text3D>
        </Float>
      ))}

      {/* Particles for background effect - only if enabled */}
      {enableParticles && <Points count={500} />}
    </>
  );
  // Optimized particle system
  function Points({ count = 1000 }) {
    const { timeOfDay } = useHeroStore();
    const pointsRef = useRef();

    // Generate points only once - memoized to prevent recalculation on re-renders
    const particleData = useMemo(() => {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        // Position in a sphere around the scene
        const radius = 5 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Color based on time of day
        if (timeOfDay === "night") {
          colors[i * 3] = 0.5 + Math.random() * 0.5; // More blue
          colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
          colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        } else if (timeOfDay === "evening") {
          colors[i * 3] = 0.8 + Math.random() * 0.2; // More red/orange
          colors[i * 3 + 1] = 0.4 + Math.random() * 0.4;
          colors[i * 3 + 2] = 0.3 + Math.random() * 0.3;
        } else if (timeOfDay === "morning") {
          colors[i * 3] = 0.8 + Math.random() * 0.2; // More gold/yellow
          colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
          colors[i * 3 + 2] = 0.4 + Math.random() * 0.3;
        } else {
          colors[i * 3] = 0.4 + Math.random() * 0.4; // More cyan/blue
          colors[i * 3 + 1] = 0.6 + Math.random() * 0.4;
          colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        }
      }

      return { positions, colors };
    }, [count, timeOfDay]);

    // Animate particles with optimized frame updates
    useFrame(({ clock }) => {
      if (pointsRef.current) {
        pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
        pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.025) * 0.1;
      }
    });

    // Memoize the material to prevent unnecessary recreations
    const pointsMaterial = useMemo(() => (
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    ), []);

    return (
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particleData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={particleData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        {pointsMaterial}
      </points>
    );
  }

  // Main Scene component
  export function Scene() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const {
      mode,
      performanceMode,
      cameraAutoRotate,
      cameraDistance,
      cameraHeight,
    } = useHeroStore();

    // Handle mouse movement and scroll with debounce for better performance
    useEffect(() => {
      let timeoutId;

      const handleMouseMove = (e) => {
        // Clear the previous timeout
        clearTimeout(timeoutId);

        // Set a timeout to update the state after a delay
        timeoutId = setTimeout(() => {
          // Normalize mouse position to range [-0.5, 0.5]
          setMousePosition({
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: -(e.clientY / window.innerHeight - 0.5) * 2,
          });
        }, 10); // Small delay to debounce
      };

      // Handle scroll with throttling
      let lastScrollTime = 0;
      const handleScroll = () => {
        const now = Date.now();
        if (now - lastScrollTime > 50) { // Throttle to 50ms
          lastScrollTime = now;
          setScrollY(window.scrollY);
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("scroll", handleScroll);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    // Memoize canvas settings based on performance mode
    const canvasSettings = useMemo(() => ({
      dpr: [1, performanceMode === "high" ? 2 : 1.5],
      gl: {
        antialias: performanceMode !== "low",
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      },
      camera: {
        position: [0, cameraHeight, cameraDistance],
        fov: 50
      },
      performance: { min: 0.5 }
    }), [performanceMode, cameraHeight, cameraDistance]);

    return (
      <div className="w-full h-screen relative">
        <Canvas
          shadows
          dpr={canvasSettings.dpr}
          gl={canvasSettings.gl}
          camera={canvasSettings.camera}
          performance={canvasSettings.performance}
        >
          <Suspense fallback={<LoadingIndicator />}>
            {/* Environment and lighting */}
            <EnvironmentSetup />

            {/* Main content */}
            <group position={[0, 0, 0]}>
              {/* Avatar */}
              <Avatar mousePosition={mousePosition} />

              {/* Floating objects */}
              <FloatingObjects />

              {/* Audio visualizer */}
              <OptimizedAudioVisualizer />

              {/* Floating clock */}
              <FloatingClock position={[2, 2, -1]} />

              {/* Interactive objects */}
              <InteractiveObjects />

              {/* 3D Text */}
              <HeroText mode={mode} />
            </group>

            {/* Camera controller */}
            <CameraController mousePosition={mousePosition} scrollY={scrollY} />

            {/* Orbit controls - only enabled when auto-rotate is on */}
            {cameraAutoRotate && (
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2}
              />
            )}
          </Suspense>
        </Canvas>

        {/* UI Controls */}
        <HeroControls />
      </div>
    );
  }
}

