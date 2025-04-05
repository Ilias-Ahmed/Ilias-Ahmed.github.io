import React, {
  Component,
  ErrorInfo,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { motion } from "framer-motion";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * A functional wrapper around the class-based ErrorBoundary
 * This fixes the "Class constructor cannot be invoked without 'new'" error
 * by ensuring proper instantiation of the class component
 */
const ErrorBoundaryWrapper: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
}) => {
  return (
    <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>
  );
};

/**
 * The actual ErrorBoundary implementation as a class component
 * (Error Boundaries must be class components in React)
 */
class ErrorBoundaryClass extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(
    error: Error
  ): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // You could also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise use our default error UI
      return <DefaultErrorFallback error={this.state.error} />;
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

/**
 * Default error fallback UI as a functional component
 * This doesn't use useTheme to avoid the "must be used within a ThemeProvider" error
 */
const DefaultErrorFallback: React.FC<{ error: Error | null }> = ({ error }) => {
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Default accent color without relying on theme context
  const accentColor = "#8B5CF6"; // Default purple

  // Detect dark mode using media query instead of theme context
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Format error message and stack trace
  useEffect(() => {
    if (error) {
      const details = `${error.message}\n\n${
        error.stack || "No stack trace available"
      }`;
      setErrorDetails(details);
    }
  }, [error]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-5 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`max-w-md w-full rounded-lg shadow-xl p-8 relative overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Error icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
              style={{ color: accentColor }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>

        {/* Error message */}
        <h1
          className="text-2xl font-bold mb-4 text-center"
          style={{ color: accentColor }}
        >
          Something went wrong
        </h1>

        <p
          className={`mb-6 text-center ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          The application encountered an unexpected error. You can try reloading
          the page or view the error details.
        </p>

        {/* Error details (collapsible) */}
        <div className="mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`text-sm flex items-center justify-center w-full ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {showDetails ? "Hide" : "Show"} error details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`ml-1 w-4 h-4 transition-transform ${
                showDetails ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <pre
                className={`p-4 rounded-md overflow-auto text-xs max-h-60 ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {errorDetails}
              </pre>
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: accentColor }}
          >
            Reload Page
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.history.back()}
            className={`px-4 py-2 rounded-md font-medium ${
              isDarkMode
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Export the wrapper component as the default export
export default ErrorBoundaryWrapper;
