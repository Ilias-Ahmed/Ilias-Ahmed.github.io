import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { PerformanceProvider } from "./hooks/usePerformance";
import { LoadingIndicator } from "./components/ui/LoadingIndicator";

// Lazy load components
const Index = lazy(() => import("./pages"));
const NotFound = lazy(() => import("./pages/NotFound"));


function App() {
  return (
    <PerformanceProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <Router>
            <Suspense fallback={<LoadingIndicator />}>
              <Routes>
                {/* Main routes with the same Index component */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<Index />} />
                <Route path="/skills" element={<Index />} />
                <Route path="/projects" element={<Index />} />
                <Route path="/contact" element={<Index />} />

                {/* Catch all non-matching routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </ThemeProvider>
      </ErrorBoundary>
    </PerformanceProvider>
  );
}

export default App;
