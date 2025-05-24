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
}

const DEFAULT_THEME: ThemeMode = "system";
const DEFAULT_ACCENT: ThemeAccent = "purple";

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

  // Initialize theme options
  const [themeOptions, setThemeOptionsState] = useState<ThemeOptions>(() => {
    if (typeof window === "undefined") {
      return {
        mode: defaultOptions.mode ?? DEFAULT_THEME,
        accent: defaultOptions.accent ?? DEFAULT_ACCENT,
      };
    }

    const savedTheme = localStorage.getItem("theme") as ThemeMode;
    const savedAccent = localStorage.getItem("accent") as ThemeAccent;

    return {
      mode: savedTheme ?? defaultOptions.mode ?? DEFAULT_THEME,
      accent: savedAccent ?? defaultOptions.accent ?? DEFAULT_ACCENT,
    };
  });

  // Compute resolved theme
  const resolvedTheme: "light" | "dark" = useMemo(() => {
    return themeOptions.mode === "system" ? systemTheme : themeOptions.mode;
  }, [themeOptions.mode, systemTheme]);

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

  // Apply theme to DOM
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const { mode, accent } = themeOptions;
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);

    // Set accent color attribute
    root.setAttribute("data-accent", accent);

    // Define accent color mappings
    const accentColors = {
      purple: {
        primary: "267.1 84% 58.8%",
        secondary: "270.5 80.9% 71.6%",
        muted: "267.1 84% 58.8%",
      },
      blue: {
        primary: "213.1 93.9% 67.8%",
        secondary: "216.9 95.2% 76.9%",
        muted: "213.1 93.9% 67.8%",
      },
      pink: {
        primary: "326.8 85.4% 60.8%",
        secondary: "327.3 87.1% 72%",
        muted: "326.8 85.4% 60.8%",
      },
      green: {
        primary: "142.1 76.2% 36.3%",
        secondary: "138.5 76.5% 46.7%",
        muted: "142.1 76.2% 36.3%",
      },
      orange: {
        primary: "24.6 95% 53.1%",
        secondary: "32.1 94.6% 63.7%",
        muted: "24.6 95% 53.1%",
      },
    };

    // Apply CSS custom properties
    const colors = accentColors[accent];
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty(
      "--primary-foreground",
      resolvedTheme === "dark" ? "0 0% 98%" : "0 0% 9%"
    );

    // Store preferences
    localStorage.setItem("theme", mode);
    localStorage.setItem("accent", accent);

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        resolvedTheme === "dark" ? "#0a0a0a" : "#ffffff"
      );
    }
  }, [themeOptions, resolvedTheme]);

  // Theme management functions
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
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
