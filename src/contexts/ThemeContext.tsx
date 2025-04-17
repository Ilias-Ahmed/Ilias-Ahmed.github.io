import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

// Theme types
export type ThemeMode = "light" | "dark";
export type ThemeAccent = "purple" | "blue" | "pink";

export interface ThemeOptions {
  mode: ThemeMode;
  accent: ThemeAccent;
}

interface ThemeContextType {
  theme: ThemeMode;
  accent: ThemeAccent;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: ThemeAccent) => void;
  isDark: boolean;
  systemTheme: ThemeMode | null;
  useSystemTheme: () => void;
  setThemeOptions: (options: Partial<ThemeOptions>) => void;
}

// Default values
const DEFAULT_THEME: ThemeMode = "dark";
const DEFAULT_ACCENT: ThemeAccent = "purple";

// Create context
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
}

export function ThemeProvider({
  children,
  defaultOptions = {},
}: ThemeProviderProps) {
  // Lazy initialization for theme & accent
  const getInitialTheme = (): ThemeMode => {
    if (typeof window === "undefined") return DEFAULT_THEME;
    return (
      (localStorage.getItem("theme") as ThemeMode) ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  };

  const getInitialAccent = (): ThemeAccent => {
    if (typeof window === "undefined") return DEFAULT_ACCENT;
    return (localStorage.getItem("accent") as ThemeAccent) ?? DEFAULT_ACCENT;
  };

  const [themeOptions, setThemeOptionsState] = useState<ThemeOptions>(() => ({
    mode: defaultOptions.mode ?? getInitialTheme(),
    accent: defaultOptions.accent ?? getInitialAccent(),
  }));

  const [systemTheme, setSystemTheme] = useState<ThemeMode | null>(null);

  // Detect system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Apply theme changes to DOM
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const { mode, accent } = themeOptions;

    // Apply theme mode
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);

    // Apply accent color
    document.documentElement.setAttribute("data-accent", accent);

    // Update CSS variables for accent colors
    const accentColors = {
      purple: {
        primary: "oklch(0.488 0.243 264.376)",
        secondary: "oklch(0.627 0.265 303.9)",
        light: "#8B5CF6",
        dark: "#6D28D9",
      },
      blue: {
        primary: "oklch(0.6 0.118 184.704)",
        secondary: "oklch(0.696 0.17 162.48)",
        light: "#3B82F6",
        dark: "#2563EB",
      },
      pink: {
        primary: "oklch(0.645 0.246 16.439)",
        secondary: "oklch(0.769 0.188 70.08)",
        light: "#EC4899",
        dark: "#DB2777",
      },
    };

    // Apply accent color to CSS variables
    const root = document.documentElement;
    if (mode === "dark") {
      root.style.setProperty("--sidebar-primary", accentColors[accent].primary);
      root.style.setProperty("--chart-1", accentColors[accent].primary);
      root.style.setProperty("--chart-4", accentColors[accent].secondary);
    } else {
      root.style.setProperty("--chart-1", accentColors[accent].dark);
      root.style.setProperty("--chart-3", accentColors[accent].light);
    }

    // Store in localStorage
    localStorage.setItem("theme", mode);
    localStorage.setItem("accent", accent);

    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        mode === "dark" ? "#0f172a" : "#ffffff"
      );
    }
  }, [themeOptions]);

  const setThemeOptions = useCallback((options: Partial<ThemeOptions>) => {
    setThemeOptionsState((prev) => ({ ...prev, ...options }));
  }, []);

  // Handlers with `setThemeOptions`
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

  const useSystemTheme = useCallback(() => {
    if (systemTheme) {
      setThemeOptions({ mode: systemTheme });
    }
  }, [systemTheme, setThemeOptions]);

  // Memoized values
  const { mode, accent } = themeOptions;
  const isDark = mode === "dark";

  const contextValue = useMemo(
    () => ({
      theme: mode,
      accent,
      toggleTheme,
      setTheme,
      setAccent,
      isDark,
      systemTheme,
      useSystemTheme,
      setThemeOptions,
    }),
    [
      mode,
      accent,
      toggleTheme,
      setTheme,
      setAccent,
      isDark,
      systemTheme,
      useSystemTheme,
      setThemeOptions,
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
