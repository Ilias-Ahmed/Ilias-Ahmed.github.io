import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";
import { useHeroStore } from "@/hooks/useHero";

// Constants to avoid recreating values
const AUDIO_PATH = "/audio/background-music.mp3";
const ROTATION_DURATION = 20000; // ms

// Helper component to animate emissive intensity
function AnimateIntensity({ material }) {
  useFrame(({ clock }) => {
    if (material) {
      material.emissiveIntensity = 0.3 + Math.sin(clock.elapsedTime * 4) * 0.2;
    }
  });

  return null;
}

export function AudioVisualizer() {
  // Get theme and hero state
  const { theme, accent } = useTheme();
  const { mode, performanceMode = "medium" } = useHeroStore();

  // Refs for audio elements
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const dataArrayRef = useRef(null);
  const barsRef = useRef(null);
  const barMaterialsRef = useRef([]);
  const loadingMaterialRef = useRef(null);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate actual bar count based on performance mode
  const actualBarCount = useMemo(() => {
    switch (performanceMode) {
      case "low":
        return 16;
      case "medium":
        return 24;
      case "high":
        return 32;
      default:
        return 24;
    }
  }, [performanceMode]);

  // Get accent color for visualizer
  const accentColor = useMemo(() => {
    const accentColors = {
      purple: new THREE.Color("#8B5CF6"),
      blue: new THREE.Color("#3B82F6"),
      green: new THREE.Color("#10B981"),
      amber: new THREE.Color("#F59E0B"),
      pink: new THREE.Color("#EC4899"),
    };
    return accentColors[accent] || accentColors.purple;
  }, [accent]);

  // Get mode-specific color
  const modeColor = useMemo(() => {
    switch (mode) {
      case "developer":
        return new THREE.Color("#3080ff");
      case "designer":
        return new THREE.Color("#ff3080");
      case "creative":
        return new THREE.Color("#8B5CF6");
      default:
        return accentColor;
    }
  }, [mode, accentColor]);

  // Initialize audio context and analyzer - only once
  const initializeAudio = useCallback(async () => {
    if (isInitialized || isLoading) return;

    setIsLoading(true);
    try {
      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio(AUDIO_PATH);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;
        audioRef.current.preload = "auto";
      }

      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;

        audioContextRef.current = new AudioContext();
      }

      // Create analyzer if it doesn't exist
      if (!analyserRef.current && audioContextRef.current) {
        const analyser = audioContextRef.current.createAnalyser();

        // Adjust FFT size based on performance mode
        analyser.fftSize =
          performanceMode === "low"
            ? 64
            : performanceMode === "medium"
            ? 128
            : 256;

        // Adjust smoothing for better visual effect
        analyser.smoothingTimeConstant = 0.8;
        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        analyserRef.current = analyser;
      }

      // Connect audio to analyzer if not already connected
      if (
        !sourceRef.current &&
        audioRef.current &&
        audioContextRef.current &&
        analyserRef.current
      ) {
        const source = audioContextRef.current.createMediaElementSource(
          audioRef.current
        );
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        sourceRef.current = source;
      }

      setIsInitialized(true);
    } catch (error) {
      console.error("Audio initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, isLoading, performanceMode]);

  // Handle play/pause with volume fade
  const toggleAudio = useCallback(async () => {
    if (!isInitialized) {
      await initializeAudio();
    }

    if (!audioRef.current || !audioContextRef.current) return;

    try {
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      if (isPlaying) {
        // Fade out
        const fadeOut = () => {
          if (!audioRef.current) return;
          if (audioRef.current.volume > 0.05) {
            audioRef.current.volume -= 0.05;
            setTimeout(fadeOut, 50);
          } else {
            audioRef.current.pause();
            audioRef.current.volume = 0;
            setIsPlaying(false);
          }
        };
        fadeOut();
      } else {
        // Fade in
        audioRef.current.volume = 0;
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              // Gradually increase volume
              const fadeIn = () => {
                if (!audioRef.current) return;
                if (audioRef.current.volume < 0.4) {
                  audioRef.current.volume += 0.05;
                  setTimeout(fadeIn, 50);
                }
              };
              fadeIn();
            })
            .catch((error) => {
              console.error("Audio play error:", error);
            });
        }
      }
    } catch (error) {
      console.error("Audio toggle error:", error);
    }
  }, [isPlaying, isInitialized, initializeAudio]);

  // Auto-initialize on user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!isInitialized && !isLoading) {
        initializeAudio();
      }
    };

    // Add event listeners for user interaction
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [isInitialized, isLoading, initializeAudio]);

  // Cleanup function
  useEffect(() => {
    return () => {
      // Clean up audio resources
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }

      // Disconnect and close audio context
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Store references to materials for efficient updates
  useEffect(() => {
    if (
      barsRef.current &&
      barsRef.current.children.length > 0 &&
      barMaterialsRef.current.length === 0
    ) {
      barMaterialsRef.current = [];
      barsRef.current.children.forEach((child) => {
        const mesh = child;
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          barMaterialsRef.current.push(mesh.material);
        }
      });
    }
  }, []);

  // Update visualizer on each frame with optimized rendering
  useFrame(({ clock }) => {
    if (
      !analyserRef.current ||
      !dataArrayRef.current ||
      !barsRef.current ||
      !isPlaying
    )
      return;

    // Get frequency data
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    // Use frame counter to reduce updates
    const frameCount = Math.floor(clock.elapsedTime * 60) % 3;

    // Update bars with frequency data
    for (
      let i = 0;
      i < Math.min(actualBarCount, barsRef.current.children.length);
      i++
    ) {
      // Only update every 3rd bar each frame for better performance
      if (i % 3 !== frameCount) continue;

      // Map frequency data to bar height - use logarithmic scale for better visual distribution
      const index = Math.floor(
        (i / actualBarCount) * dataArrayRef.current.length
      );
      const value = dataArrayRef.current[index];

      // Apply logarithmic scaling for more natural visualization
      const logValue = (Math.log10(value + 1) / Math.log10(256)) * 255;
      const height = (logValue / 255) * 2 + 0.1; // Scale height
      const intensity = value / 255;

      const bar = barsRef.current.children[i];

      // Update scale directly instead of using GSAP for better performance
      bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, height, 0.1);

      // Update material color - only update every few frames for better performance
      if (barMaterialsRef.current[i]) {
        const material = barMaterialsRef.current[i];
        const hue = (i / actualBarCount) * 0.8 + 0.1; // Keep hue in a pleasing range

        // Create base color
        const color = new THREE.Color().setHSL(hue, 0.8, 0.4 + intensity * 0.4);

        // Blend with mode color for theme consistency
        color.lerp(modeColor, 0.3);

        // Update material colors
        material.color.copy(color);
        material.emissive.copy(color).multiplyScalar(0.4);

        // Optimize by not updating roughness/metalness every frame
        if (i % 4 === 0) {
          // Only update every 4th bar
          material.roughness = 0.4 - intensity * 0.2;
          material.metalness = 0.6 + intensity * 0.2;
        }
      }
    }
  });

  // Spring animation for the entire visualizer - optimized with lower precision
  const groupProps = useSpring({
    rotation: [0, isPlaying ? Math.PI * 2 : 0, 0],
    config: {
      duration: ROTATION_DURATION,
      precision: 0.001, // Lower precision for better performance
      loop: true,
    },
  });

  // Memoize bar creation to avoid recreating on every render
  const bars = useMemo(() => {
    return Array.from({ length: actualBarCount }).map((_, i) => {
      const angle = (i / actualBarCount) * Math.PI * 2;
      const radius = 1.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Calculate initial color
      const hue = (i / actualBarCount) * 0.8 + 0.1;
      const baseColor = new THREE.Color().setHSL(hue, 0.8, 0.5);
      baseColor.lerp(modeColor, 0.3);

      return (
        <mesh
          key={i}
          position={[x, 0, z]}
          rotation={[0, -angle, 0]}
          scale={[0.05, 0.1, 0.05]} // Initial scale
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={baseColor}
            emissive={baseColor.clone().multiplyScalar(0.3)}
            metalness={0.7}
            roughness={0.3}
            toneMapped={true}
          />
        </mesh>
      );
    });
  }, [actualBarCount, modeColor]);

  // Play button appearance based on theme
  const playButtonColor = useMemo(() => {
    return theme === "dark" ? "#ffffff" : "#000000";
  }, [theme]);

  return (
    <animated.group position={[0, -0.5, -2]} rotation={groupProps.rotation}>
      <group ref={barsRef}>{bars}</group>

      {/* Play button when audio is not playing */}
      {!isPlaying && (
        <mesh position={[0, 0, 0]} onClick={toggleAudio}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={modeColor}
            emissive={modeColor}
            emissiveIntensity={0.5}
            transparent={true}
            opacity={0.9}
          />
          {/* Play icon */}
          <mesh position={[0.05, 0, 0]}>
            <boxGeometry args={[0.15, 0.15, 0.05]} />
            <meshBasicMaterial color={playButtonColor} />
          </mesh>
        </mesh>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            ref={loadingMaterialRef}
            color={modeColor}
            emissive={modeColor}
            emissiveIntensity={0.3}
            transparent={true}
            opacity={0.7}
          />
          <AnimateIntensity material={loadingMaterialRef.current} />
        </mesh>
      )}
    </animated.group>
  );
}
