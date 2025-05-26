import { BackgroundConfig } from '@/contexts/BackgroundContext';

export interface BackgroundPreset {
  id: string;
  name: string;
  description: string;
  config: BackgroundConfig;
  preview?: string;
  category: 'performance' | 'visual' | 'interactive' | 'minimal';
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  // Performance Presets
  {
    id: 'performance-minimal',
    name: 'Performance Minimal',
    description: 'Optimized for maximum performance with minimal visual effects',
    category: 'performance',
    config: {
      mode: 'minimal',
      intensity: 'low',
      performanceMode: 'low',
      particleCount: 20,
      opacity: 0.3,
      animationSpeed: 0.5,
      enableAudioVisualization: false,
      enableInteractivity: false,
      enableParallax: false,
      adaptToSection: false,
    },
  },
  {
    id: 'performance-balanced',
    name: 'Performance Balanced',
    description: 'Good balance between performance and visual appeal',
    category: 'performance',
    config: {
      mode: 'particles',
      intensity: 'medium',
      performanceMode: 'auto',
      particleCount: 50,
      opacity: 0.5,
      animationSpeed: 0.8,
      enableAudioVisualization: false,
      enableInteractivity: true,
      enableParallax: false,
      adaptToSection: true,
    },
  },

  // Visual Presets
  {
    id: 'visual-stunning',
    name: 'Visual Stunning',
    description: 'Maximum visual impact with all effects enabled',
    category: 'visual',
    config: {
      mode: 'neural',
      intensity: 'high',
      performanceMode: 'high',
      particleCount: 150,
      opacity: 0.8,
      animationSpeed: 1.2,
      enableAudioVisualization: true,
      enableInteractivity: true,
      enableParallax: true,
      adaptToSection: true,
    },
  },
  {
    id: 'visual-holographic',
    name: 'Holographic Display',
    description: 'Futuristic hologram-style background effects',
    category: 'visual',
    config: {
      mode: 'hologram',
      intensity: 'high',
      performanceMode: 'high',
      particleCount: 100,
      opacity: 0.7,
      animationSpeed: 1.0,
      enableAudioVisualization: true,
      enableInteractivity: true,
      enableParallax: true,
      adaptToSection: false,
    },
  },
  {
    id: 'visual-matrix',
    name: 'Digital Matrix',
    description: 'Matrix-style digital rain effect',
    category: 'visual',
    config: {
      mode: 'matrix',
      intensity: 'high',
      performanceMode: 'auto',
      particleCount: 80,
      opacity: 0.6,
      animationSpeed: 1.5,
      enableAudioVisualization: true,
      enableInteractivity: false,
      enableParallax: false,
      adaptToSection: false,
    },
  },

  // Interactive Presets
  {
    id: 'interactive-responsive',
    name: 'Interactive Responsive',
    description: 'Highly responsive to user interaction and audio',
    category: 'interactive',
    config: {
      mode: 'adaptive',
      intensity: 'high',
      performanceMode: 'auto',
      particleCount: 120,
      opacity: 0.7,
      animationSpeed: 1.0,
      enableAudioVisualization: true,
      enableInteractivity: true,
      enableParallax: true,
      adaptToSection: true,
    },
  },
  {
    id: 'interactive-audio-sync',
    name: 'Audio Synchronized',
    description: 'Background that dances with your music',
    category: 'interactive',
    config: {
      mode: 'particles',
      intensity: 'high',
      performanceMode: 'high',
      particleCount: 100,
      opacity: 0.8,
      animationSpeed: 1.2,
      enableAudioVisualization: true,
      enableInteractivity: true,
      enableParallax: false,
      adaptToSection: false,
    },
  },

  // Minimal Presets
  {
    id: 'minimal-clean',
    name: 'Clean Minimal',
    description: 'Clean and distraction-free background',
    category: 'minimal',
    config: {
      mode: 'minimal',
      intensity: 'low',
      performanceMode: 'auto',
      particleCount: 30,
      opacity: 0.2,
      animationSpeed: 0.5,
      enableAudioVisualization: false,
      enableInteractivity: false,
      enableParallax: false,
      adaptToSection: false,
    },
  },
  {
    id: 'minimal-subtle',
    name: 'Subtle Effects',
    description: 'Minimal background with subtle animations',
    category: 'minimal',
    config: {
      mode: 'particles',
      intensity: 'low',
      performanceMode: 'auto',
      particleCount: 40,
      opacity: 0.4,
      animationSpeed: 0.7,
      enableAudioVisualization: false,
      enableInteractivity: true,
      enableParallax: false,
      adaptToSection: true,
    },
  },
];

export const getPresetsByCategory = (category: BackgroundPreset['category']) => {
  return BACKGROUND_PRESETS.filter(preset => preset.category === category);
};

export const getPresetById = (id: string) => {
  return BACKGROUND_PRESETS.find(preset => preset.id === id);
};

export const getDefaultPreset = (): BackgroundPreset => {
  return BACKGROUND_PRESETS.find(preset => preset.id === 'performance-balanced') || BACKGROUND_PRESETS[0];
};

// Auto-detect optimal preset based on device capabilities
export const getOptimalPreset = (): BackgroundPreset => {
  // Check if device supports high performance
  const isHighPerformanceDevice = () => {
    // Check for hardware acceleration
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) return false;

    // Check for sufficient memory
    if ('memory' in performance) {
      interface PerformanceMemory {
        jsHeapSizeLimit: number;
        totalJSHeapSize: number;
        usedJSHeapSize: number;
      }
      const memory = (performance as { memory: PerformanceMemory }).memory;
      if (memory.jsHeapSizeLimit < 100 * 1024 * 1024) return false; // Less than 100MB
    }

    // Check device pixel ratio (high DPI displays often indicate better hardware)
    if (window.devicePixelRatio > 2) return true;

    // Check screen size (larger screens often indicate desktop/powerful devices)
    if (window.screen.width > 1920 && window.screen.height > 1080) return true;

    return false;
  };

  // Check if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Check connection speed if available
  const isSlowConnection = () => {
    if ('connection' in navigator) {
      interface NetworkInformation {
        effectiveType?: string;
      }
      const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
      return connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';
    }
    return false;
  };

  // Determine optimal preset
  if (isMobile || isSlowConnection()) {
    return getPresetById('performance-minimal') || getDefaultPreset();
  } else if (isHighPerformanceDevice()) {
    return getPresetById('visual-stunning') || getDefaultPreset();
  } else {
    return getDefaultPreset();
  }
};
