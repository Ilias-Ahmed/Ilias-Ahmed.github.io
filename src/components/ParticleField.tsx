import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/three";
import { useTheme } from "@/contexts/ThemeContext";
import { extend } from "@react-three/fiber";
// Define constants to avoid recreating values
const DEFAULT_DENSITY = {
  low: 800,
  medium: 1500,
  high: 3000
};

// Custom shader material for particles - defined outside component to avoid recreation
const ParticleMaterial = shaderMaterial(
  {
    time: 0,
    pointSize: 1.5,
    mousePos: new THREE.Vector3(0, 0, 0),
    resolution: new THREE.Vector2(800, 600),
    primaryColor: new THREE.Vector3(0.5, 0.2, 0.9),
    secondaryColor: new THREE.Vector3(0.1, 0.4, 0.8),
    noiseIntensity: 0.08,
    waveSpeed: 0.5,
    interactionStrength: 0.3,
  },
  // Vertex shader - simplified for better performance
  `
    uniform float time;
    uniform float pointSize;
    uniform vec3 mousePos;
    uniform float interactionStrength;
    uniform float noiseIntensity;
    uniform float waveSpeed;

    attribute float size;
    attribute vec3 velocity;
    attribute float phase;
    attribute float lifespan;

    varying vec3 vPosition;
    varying vec3 vColor;
    varying float vPhase;

    // Simplex noise function - optimized version
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      // First corner
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      // Permutations
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      // Gradients
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      // Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vPosition = position;
      vPhase = phase;

      // Calculate distance to mouse - with optimization for low performance
      float distToMouse = distance(position, mousePos);
      float interactionFactor = smoothstep(2.0, 0.0, distToMouse) * interactionStrength;

      // Apply noise-based movement - simplified for performance
      vec3 noisePos = position * 0.5 + time * waveSpeed * 0.1;
      float noiseValue = snoise(noisePos) * noiseIntensity;

      // Calculate final position with mouse interaction
      vec3 newPos = position;
      newPos += velocity * sin(time * waveSpeed + phase) * 0.2;

      // Only apply mouse interaction if close enough
      if (distToMouse < 2.0) {
        newPos += normalize(position - mousePos) * interactionFactor;
      }

      newPos.x += noiseValue;
      newPos.y += noiseValue;

      // Vary point size based on position and interaction
      float sizeFactor = 1.0 + sin(time * 0.5 + phase * 2.0) * 0.3;
      sizeFactor += interactionFactor * 2.0;

      // Set varying color based on position for fragment shader
      vColor = normalize(position) * 0.5 + 0.5;

      // Set final position and point size
      vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = pointSize * size * sizeFactor * (1.0 / -mvPosition.z);
    }
  `,
  // Fragment shader - simplified for better performance
  `
    uniform vec3 primaryColor;
    uniform vec3 secondaryColor;
    uniform float time;

    varying vec3 vPosition;
    varying vec3 vColor;
    varying float vPhase;

    void main() {
      // Create a soft, glowing particle with optimized calculations
      vec2 uv = gl_PointCoord.xy - 0.5;
      float dist = length(uv);

      // Discard pixels outside of circle with soft edge - early exit optimization
      if (dist > 0.5) discard;

      // Create a gradient between primary and secondary colors
      vec3 color = mix(primaryColor, secondaryColor, vColor.x);

      // Add time-based color pulsing - simplified
      color += 0.1 * sin(time * 0.5 + vPhase * 3.0);

      // Add radial gradient for each particle
      float alpha = smoothstep(0.5, 0.0, dist);
      alpha *= 0.7 + 0.3 * sin(time + vPhase * 6.0);

      gl_FragColor = vec4(color, alpha);
    }
  `
);

// Extend Three.js with our custom shader - do this only once
extend({ ParticleMaterial });

interface ParticleFieldProps {
  offset: { get: () => number[] };
  density?: number;
  interactionRadius?: number;
  interactionStrength?: number;
  noiseIntensity?: number;
  waveSpeed?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

export const ParticleField = ({
  offset,
  density,
  noiseIntensity = 0.08,
  waveSpeed = 0.5,
  interactionStrength = 0.3,
  primaryColor,
  secondaryColor,
}: ParticleFieldProps) => {
  const { theme, accent } = useTheme();
  const { viewport, mouse, size } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const frameCountRef = useRef(0);

  // Detect if we're on a mobile device
  const isMobile = useMemo(() => {
    return (
      size.width < 768 ||
      (typeof navigator !== "undefined" &&
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ))
    );
  }, [size.width]);

  // Determine performance level based on device
  const performanceLevel = useMemo(() => {
    if (isMobile) return "low";
    return size.width < 1200 ? "medium" : "high";
  }, [isMobile, size.width]);

  // Determine actual density based on performance level
  const actualDensity = useMemo(() => {
    // Use provided density or default based on performance mode
    const baseDensity =
      density ||
      DEFAULT_DENSITY[performanceLevel as keyof typeof DEFAULT_DENSITY] ||
      1500;

    // Reduce density on mobile
    if (isMobile) {
      return Math.floor(baseDensity * 0.3);
    }

    return baseDensity;
  }, [density, performanceLevel, isMobile]);

  // Mouse position in 3D space - memoized to avoid recreating Vector3 on every frame
  const mousePos = useMemo(() => new THREE.Vector3(), []);

  // Generate particles with additional attributes - only when density changes
  const geometry = useMemo(() => {
    // Create geometry
    const geometry = new THREE.BufferGeometry();

    // Create attributes
    const positions = new Float32Array(actualDensity * 3);
    const sizes = new Float32Array(actualDensity);
    const velocities = new Float32Array(actualDensity * 3);
    const phases = new Float32Array(actualDensity);
    const lifespans = new Float32Array(actualDensity);

    // Fill attribute arrays
    for (let i = 0; i < actualDensity; i++) {
      // Position - spherical distribution with randomness
      const radius = Math.random() * 10 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] =
        radius * Math.sin(phi) * Math.cos(theta) * (0.8 + Math.random() * 0.4);
      positions[i * 3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta) * (0.8 + Math.random() * 0.4);
      positions[i * 3 + 2] =
        radius * Math.cos(phi) * (0.8 + Math.random() * 0.4);

      // Random size variation - smaller range for better performance
      sizes[i] = 0.5 + Math.random();

      // Velocity direction - smaller values for better performance
      velocities[i * 3] = (Math.random() - 0.5) * 0.15;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.15;

      // Random phase offset for animation
      phases[i] = Math.random() * Math.PI * 2;

      // Random lifespan for potential future effects
      lifespans[i] = 0.5 + Math.random() * 0.5;
    }

    // Set attributes
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("lifespan", new THREE.BufferAttribute(lifespans, 1));

    return geometry;
  }, [actualDensity]);

  // Get colors based on theme and accent - only recalculate when theme/accent changes
  const colors = useMemo(() => {
    const accentColors = {
      purple: { primary: "#8B5CF6", secondary: "#C4B5FD" },
      blue: { primary: "#3B82F6", secondary: "#93C5FD" },
      green: { primary: "#10B981", secondary: "#6EE7B7" },
      amber: { primary: "#F59E0B", secondary: "#FCD34D" },
      pink: { primary: "#EC4899", secondary: "#F9A8D4" },
    };

    const colorSet =
      accentColors[accent as keyof typeof accentColors] || accentColors.purple;

    // Use provided colors if available
    const primary =
      primaryColor ||
      (theme === "dark" ? colorSet.primary : colorSet.secondary);
    const secondary =
      secondaryColor ||
      (theme === "dark" ? colorSet.secondary : colorSet.primary);

    // Adjust colors based on theme
    if (theme === "dark") {
      return {
        primaryColor: new THREE.Color(primary),
        secondaryColor: new THREE.Color(secondary).multiplyScalar(0.7),
      };
    } else {
      return {
        primaryColor: new THREE.Color(primary),
        secondaryColor: new THREE.Color(secondary).multiplyScalar(1.2),
      };
    }
  }, [theme, accent, primaryColor, secondaryColor]);

  // Spring animation for initial appearance
  const spring = useSpring({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    config: { mass: 1, tension: 280, friction: 60 },
  });

  // Update particles on each frame with performance optimizations
  useFrame(({ clock, camera }) => {
    if (!pointsRef.current || !materialRef.current) return;

    // Skip frames for better performance, especially on mobile
    frameCountRef.current += 1;
    const skipFrames = isMobile ? 2 : performanceLevel === "low" ? 1 : 0;
    if (frameCountRef.current % (skipFrames + 1) !== 0) return;

    // Update time uniform
    materialRef.current.uniforms.time.value = clock.getElapsedTime();

    // Update resolution for correct point sizing
    materialRef.current.uniforms.resolution.value.set(size.width, size.height);

    // Update mouse position in 3D space - only when needed
    if (interactionStrength > 0) {
      // Convert mouse coordinates to 3D space
      mousePos.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      );
      // Transform to world space
      mousePos.unproject(camera);
      // Update uniform
      materialRef.current.uniforms.mousePos.value.copy(mousePos);
    }

    // Update material uniforms based on props
    materialRef.current.uniforms.interactionStrength.value =
      interactionStrength;
    materialRef.current.uniforms.noiseIntensity.value = noiseIntensity;
    materialRef.current.uniforms.waveSpeed.value = waveSpeed;

    // Update colors from theme
    materialRef.current.uniforms.primaryColor.value.copy(colors.primaryColor);
    materialRef.current.uniforms.secondaryColor.value.copy(
      colors.secondaryColor
    );

    // Subtle rotation of the entire particle system for added movement
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
      pointsRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <animated.group
      position={[offset.get()[0], offset.get()[1], 0]}
      scale={spring.scale}
      opacity={spring.opacity}
    >
      <Points ref={pointsRef} frustumCulled={true}>
        <primitive object={geometry} attach="geometry" />
        <primitive
          object={new ParticleMaterial()}
          ref={materialRef}
          attach="material"
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </animated.group>
  );
};

