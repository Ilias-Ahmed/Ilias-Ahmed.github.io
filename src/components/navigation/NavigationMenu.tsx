import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  memo,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeAccent = "purple" | "blue" | "pink" | "green" | "orange";

export interface ThemeOptions {
  mode: ThemeMode;
  accent: ThemeAccent;
  reducedMotion: boolean;
  highContrast: boolean;
}

interface ThemeContextType extends ThemeOptions {
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: ThemeAccent) => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  isDark: boolean;
  systemTheme: ThemeMode | null;
  useSystemTheme: () => void;
  setThemeOptions: (options: Partial<ThemeOptions>) => void;
  resetToDefaults: () => void;
}

const DEFAULT_THEME_OPTIONS: ThemeOptions = {
  mode: "dark",
  accent: "purple",
  reducedMotion: false,
  highContrast: false,
};

// Enhanced accent colors with more options
const ACCENT_COLORS = {
  purple: {
    primary: "oklch(0.488 0.243 264.376)",
    secondary: "oklch(0.627 0.265 303.9)",
    light: "#8B5CF6",
    dark: "#6D28D9",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
  },
  blue: {
    primary: "oklch(0.6 0.118 184.704)",
    secondary: "oklch(0.696 0.17 162.48)",
    light: "#3B82F6",
    dark: "#2563EB",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
  },
  pink: {
    primary: "oklch(0.645 0.246 16.439)",
    secondary: "oklch(0.769 0.188 70.08)",
    light: "#EC4899",
    dark: "#DB2777",
    gradient: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
  },
  green: {
    primary: "oklch(0.6 0.16 142.5)",
    secondary: "oklch(0.7 0.14 158.1)",
    light: "#10B981",
    dark: "#059669",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  },
  orange: {
    primary: "oklch(0.68 0.19 70.67)",
    secondary: "oklch(0.75 0.15 85.87)",
    light: "#F59E0B",
    dark: "#D97706",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
  },
} as const;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultOptions?: Partial<ThemeOptions>;
  storageKey?: string;
}

export const ThemeProvider = memo<ThemeProviderProps>(
  ({ children, defaultOptions = {}, storageKey = "portfolio-theme" }) => {
    // Optimized initial state calculation
    const getInitialState = useCallback((): ThemeOptions => {
      if (typeof window === "undefined") {
        return { ...DEFAULT_THEME_OPTIONS, ...defaultOptions };
      }

      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<ThemeOptions>;
          return { ...DEFAULT_THEME_OPTIONS, ...parsed, ...defaultOptions };
        }
      } catch (error) {
        console.warn("Failed to parse saved theme options:", error);
      }

      // Detect system preferences
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const systemHighContrast = window.matchMedia(
        "(prefers-contrast: high)"
      ).matches;

      return {
        ...DEFAULT_THEME_OPTIONS,
        mode: systemPrefersDark ? "dark" : "light",
        reducedMotion: systemReducedMotion,
        highContrast: systemHighContrast,
        ...defaultOptions,
      };
    }, [defaultOptions, storageKey]);

    const [themeOptions, setThemeOptionsState] =
      useState<ThemeOptions>(getInitialState);
    const [systemTheme, setSystemTheme] = useState<ThemeMode | null>(null);

    // Enhanced system theme detection
    useEffect(() => {
      if (typeof window === "undefined") return;

      const mediaQueries = {
        dark: window.matchMedia("(prefers-color-scheme: dark)"),
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)"),
        highContrast: window.matchMedia("(prefers-contrast: high)"),
      };

      const handleThemeChange = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? "dark" : "light");
      };

      const handleMotionChange = (e: MediaQueryListEvent) => {
        if (themeOptions.mode === "system") {
          setThemeOptionsState((prev) => ({
            ...prev,
            reducedMotion: e.matches,
          }));
        }
      };

      const handleContrastChange = (e: MediaQueryListEvent) => {
        if (themeOptions.mode === "system") {
          setThemeOptionsState((prev) => ({
            ...prev,
            highContrast: e.matches,
          }));
        }
      };

      // Set initial system theme
      setSystemTheme(mediaQueries.dark.matches ? "dark" : "light");

      // Add listeners
      mediaQueries.dark.addEventListener("change", handleThemeChange);
      mediaQueries.reducedMotion.addEventListener("change", handleMotionChange);
      mediaQueries.highContrast.addEventListener(
        "change",
        handleContrastChange
      );

      return () => {
        mediaQueries.dark.removeEventListener("change", handleThemeChange);
        mediaQueries.reducedMotion.removeEventListener(
          "change",
          handleMotionChange
        );
        mediaQueries.highContrast.removeEventListener(
          "change",
          handleContrastChange
        );
      };
    }, [themeOptions.mode]);

    // Optimized DOM updates with batch operations
    useLayoutEffect(() => {
      if (typeof window === "undefined") return;

      const { mode, accent, reducedMotion, highContrast } = themeOptions;
      const resolvedMode = mode === "system" ? systemTheme || "dark" : mode;

      // Batch all DOM operations
      requestAnimationFrame(() => {
        const root = document.documentElement;
        const metaThemeColor = document.querySelector(
          'meta[name="theme-color"]'
        );

        // Apply theme mode
        root.classList.remove("light", "dark");
        root.classList.add(resolvedMode);

        // Apply accessibility preferences
        root.classList.toggle("reduced-motion", reducedMotion);
        root.classList.toggle("high-contrast", highContrast);

        // Apply accent color
        root.setAttribute("data-accent", accent);

        // Update CSS variables efficiently
        const colors = ACCENT_COLORS[accent];
        const cssVars = {
          "--accent-primary": colors.primary,
          "--accent-secondary": colors.secondary,
          "--accent-light": colors.light,
          "--accent-dark": colors.dark,
          "--accent-gradient": colors.gradient,
          "--sidebar-primary":
            resolvedMode === "dark" ? colors.primary : colors.dark,
          "--chart-1": resolvedMode === "dark" ? colors.primary : colors.dark,
          "--chart-3": colors.light,
          "--chart-4": colors.secondary,
        };

        Object.entries(cssVars).forEach(([property, value]) => {
          root.style.setProperty(property, value);
        });

        // Update meta theme color
        if (metaThemeColor) {
          metaThemeColor.setAttribute(
            "content",
            resolvedMode === "dark" ? "#0f172a" : "#ffffff"
          );
        }

        // Store in localStorage with error handling
        try {
          localStorage.setItem(storageKey, JSON.stringify(themeOptions));
        } catch (error) {
          console.warn("Failed to save theme options:", error);
        }
      });
    }, [themeOptions, systemTheme, storageKey]);

    // Enhanced handlers
    const setThemeOptions = useCallback((options: Partial<ThemeOptions>) => {
      setThemeOptionsState((prev) => ({ ...prev, ...options }));
    }, []);

    const toggleTheme = useCallback(() => {
      setThemeOptionsState((prev) => ({
        ...prev,
        mode: prev.mode === "light" ? "dark" : "light",
      }));
    }, []);

    const setTheme = useCallback(
      (mode: ThemeMode) => {
        setThemeOptions({ mode });
      },
      [setThemeOptions]
    );

    const setAccent = useCallback(
      (accent: ThemeAccent) => {
        setThemeOptions({ accent });
      },
      [setThemeOptions]
    );

    const toggleReducedMotion = useCallback(() => {
      setThemeOptionsState((prev) => ({
        ...prev,
        reducedMotion: !prev.reducedMotion,
      }));
    }, []);

    const toggleHighContrast = useCallback(() => {
      setThemeOptionsState((prev) => ({
        ...prev,
        highContrast: !prev.highContrast,
      }));
    }, []);

    const useSystemTheme = useCallback(() => {
      setThemeOptions({ mode: "system" });
    }, [setThemeOptions]);

    const resetToDefaults = useCallback(() => {
      setThemeOptionsState(DEFAULT_THEME_OPTIONS);
      localStorage.removeItem(storageKey);
    }, [storageKey]);

    // Computed values
    const resolvedMode =
      themeOptions.mode === "system"
        ? systemTheme || "dark"
        : themeOptions.mode;
    const isDark = resolvedMode === "dark";

    const contextValue = useMemo(
      () => ({
        ...themeOptions,
        toggleTheme,
        setTheme,
        setAccent,
        toggleReducedMotion,
        toggleHighContrast,
        isDark,
        systemTheme,
        useSystemTheme,
        setThemeOptions,
        resetToDefaults,
      }),
      [
        themeOptions,
        toggleTheme,
        setTheme,
        setAccent,
        toggleReducedMotion,
        toggleHighContrast,
        isDark,
        systemTheme,
        useSystemTheme,
        setThemeOptions,
        resetToDefaults,
      ]
    );

    return (
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    );
  }
);

ThemeProvider.displayName = "ThemeProvider";

// Export accent colors for use in components
export { ACCENT_COLORS };
