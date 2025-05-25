import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeAccent = "purple" | "blue" | "pink" | "green" | "orange";

export interface ThemeOptions {
  mode: ThemeMode;
  accent: ThemeAccent;
}

// Enhanced theme utilities
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  accent: {
    primary: string;
    secondary: string;
    muted: string;
    alpha: (opacity: number) => string;
  };
}

interface ThemeContextType {
  mode: ThemeMode;
  accent: ThemeAccent;
  resolvedTheme: "light" | "dark";
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: ThemeAccent) => void;
  isDark: boolean;
  systemTheme: "light" | "dark";
  setThemeOptions: (options: Partial<ThemeOptions>) => void;
  // Enhanced theme utilities
  getThemeColors: () => ThemeColors;
  getAccentColors: () => Record<string, string>;
  cssVars: Record<string, string>;
}

const DEFAULT_THEME: ThemeMode = "system";
const DEFAULT_ACCENT: ThemeAccent = "purple";

// Optimized accent color definitions
const ACCENT_COLOR_MAP = {
  purple: {
    hsl: "267.1 84% 58.8%",
    hex: "#8b5cf6",
    rgb: "139, 92, 246",
    variants: {
      50: "#faf5ff",
      100: "#f3e8ff",
      500: "#8b5cf6",
      600: "#7c3aed",
      900: "#4c1d95",
    },
  },
  blue: {
    hsl: "213.1 93.9% 67.8%",
    hex: "#3b82f6",
    rgb: "59, 130, 246",
    variants: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
      900: "#1e3a8a",
    },
  },
  pink: {
    hsl: "326.8 85.4% 60.8%",
    hex: "#ec4899",
    rgb: "236, 72, 153",
    variants: {
      50: "#fdf2f8",
      100: "#fce7f3",
      500: "#ec4899",
      600: "#db2777",
      900: "#831843",
    },
  },
  green: {
    hsl: "142.1 76.2% 36.3%",
    hex: "#10b981",
    rgb: "16, 185, 129",
    variants: {
      50: "#ecfdf5",
      100: "#d1fae5",
      500: "#10b981",
      600: "#059669",
      900: "#064e3b",
    },
  },
  orange: {
    hsl: "24.6 95% 53.1%",
    hex: "#f59e0b",
    rgb: "245, 158, 11",
    variants: {
      50: "#fffbeb",
      100: "#fef3c7",
      500: "#f59e0b",
      600: "#d97706",
      900: "#92400e",
    },
  },
} as const;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultOptions?: Partial<ThemeOptions>;
}

export function ThemeProvider({
  children,
  defaultOptions = {},
}: ThemeProviderProps): React.ReactElement {
  // Initialize system theme detection
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Initialize theme options with improved persistence
  const [themeOptions, setThemeOptionsState] = useState<ThemeOptions>(() => {
    if (typeof window === "undefined") {
      return {
        mode: defaultOptions.mode ?? DEFAULT_THEME,
        accent: defaultOptions.accent ?? DEFAULT_ACCENT,
      };
    }

    try {
      const savedTheme = localStorage.getItem("theme") as ThemeMode;
      const savedAccent = localStorage.getItem("accent") as ThemeAccent;

      return {
        mode: savedTheme ?? defaultOptions.mode ?? DEFAULT_THEME,
        accent: savedAccent ?? defaultOptions.accent ?? DEFAULT_ACCENT,
      };
    } catch (error) {
      console.warn("Failed to load theme from localStorage:", error);
      return {
        mode: defaultOptions.mode ?? DEFAULT_THEME,
        accent: defaultOptions.accent ?? DEFAULT_ACCENT,
      };
    }
  });

  // Compute resolved theme
  const resolvedTheme: "light" | "dark" = useMemo(() => {
    return themeOptions.mode === "system" ? systemTheme : themeOptions.mode;
  }, [themeOptions.mode, systemTheme]);

  // Enhanced theme colors getter
  const getThemeColors = useCallback((): ThemeColors => {
    const accentData = ACCENT_COLOR_MAP[themeOptions.accent];
    const isDark = resolvedTheme === "dark";

    return {
      primary: `hsl(${accentData.hsl})`,
      secondary: isDark ? "hsl(0 0% 98%)" : "hsl(0 0% 9%)",
      background: isDark ? "hsl(0 0% 9%)" : "hsl(0 0% 98%)",
      foreground: isDark ? "hsl(0 0% 98%)" : "hsl(0 0% 9%)",
      muted: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 96%)",
      border: isDark ? "hsl(0 0% 20%)" : "hsl(0 0% 90%)",
      accent: {
        primary: accentData.hex,
        secondary: accentData.variants[600],
        muted: accentData.variants[100],
        alpha: (opacity: number) => `rgba(${accentData.rgb}, ${opacity})`,
      },
    };
  }, [themeOptions.accent, resolvedTheme]);

  // Enhanced accent colors getter
  const getAccentColors = useCallback(() => {
    const accentData = ACCENT_COLOR_MAP[themeOptions.accent];
    return {
      primary: accentData.hex,
      secondary: accentData.variants[600],
      tertiary: accentData.variants[500],
      glow: `rgba(${accentData.rgb}, 0.3)`,
      shadow: `rgba(${accentData.rgb}, 0.25)`,
      border: `rgba(${accentData.rgb}, 0.5)`,
      gradient: `linear-gradient(135deg, ${accentData.variants[400]} 0%, ${accentData.variants[600]} 100%)`,
      mesh: `linear-gradient(135deg, ${accentData.variants[500]}20 0%, ${accentData.variants[600]}20 50%, ${accentData.variants[700]}20 100%)`,
    };
  }, [themeOptions.accent]);

  // CSS variables for direct access
  const cssVars = useMemo(() => {
    const colors = getThemeColors();
    return {
      "--theme-primary": colors.primary,
      "--theme-secondary": colors.secondary,
      "--theme-background": colors.background,
      "--theme-foreground": colors.foreground,
      "--theme-accent": colors.accent.primary,
      "--theme-accent-alpha": colors.accent.alpha(0.1),
    };
  }, [getThemeColors]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent): void => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Optimized DOM theme application
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const { mode, accent } = themeOptions;
    const root = document.documentElement;

    // Batch DOM updates
    requestAnimationFrame(() => {
      // Remove existing theme classes
      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);

      // Set accent color attribute
      root.setAttribute("data-accent", accent);

      // Apply CSS custom properties efficiently
      const accentData = ACCENT_COLOR_MAP[accent];
      const updates = [
        ["--primary", accentData.hsl],
        ["--accent-current", accentData.hex],
        ["--accent-current-rgb", accentData.rgb],
      ];

      updates.forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });

      // Store preferences
      try {
        localStorage.setItem("theme", mode);
        localStorage.setItem("accent", accent);
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error);
      }

      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          "content",
          resolvedTheme === "dark" ? "#0a0a0a" : "#ffffff"
        );
      }
    });
  }, [themeOptions, resolvedTheme]);

  // Optimized theme management functions
  const setThemeOptions = useCallback(
    (options: Partial<ThemeOptions>): void => {
      setThemeOptionsState((prev) => ({ ...prev, ...options }));
    },
    []
  );

  const toggleTheme = useCallback((): void => {
    setThemeOptionsState((prev) => ({
      ...prev,
      mode:
        prev.mode === "light"
          ? "dark"
          : prev.mode === "dark"
          ? "system"
          : "light",
    }));
  }, []);

  const setTheme = useCallback(
    (mode: ThemeMode): void => {
      setThemeOptions({ mode });
    },
    [setThemeOptions]
  );

  const setAccent = useCallback(
    (accent: ThemeAccent): void => {
      setThemeOptions({ accent });
    },
    [setThemeOptions]
  );

  // Memoized context value
  const contextValue = useMemo(
    (): ThemeContextType => ({
      mode: themeOptions.mode,
      accent: themeOptions.accent,
      resolvedTheme,
      theme: resolvedTheme,
      toggleTheme,
      setTheme,
      setAccent,
      isDark: resolvedTheme === "dark",
      systemTheme,
      setThemeOptions,
      getThemeColors,
      getAccentColors,
      cssVars,
    }),
    [
      themeOptions.mode,
      themeOptions.accent,
      resolvedTheme,
      toggleTheme,
      setTheme,
      setAccent,
      systemTheme,
      setThemeOptions,
      getThemeColors,
      getAccentColors,
      cssVars,
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Utility hooks for specific theme aspects
export function useThemeColors(): ThemeColors {
  const { getThemeColors } = useTheme();
  return useMemo(() => getThemeColors(), [getThemeColors]);
}

export function useAccentColors() {
  const { getAccentColors } = useTheme();
  return useMemo(() => getAccentColors(), [getAccentColors]);
}

export function useIsDark(): boolean {
  const { isDark } = useTheme();
  return isDark;
}
