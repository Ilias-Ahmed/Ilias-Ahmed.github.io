import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import NotFound from "./pages/NotFound";
import Index from "./pages/index";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <Routes>
              {/* Main route */}
              <Route path="/" element={<Index />} />

              {/* Section routes - all handled by Index component */}
              <Route path="/about" element={<Index />} />
              <Route path="/skills" element={<Index />} />
              <Route path="/projects" element={<Index />} />
              <Route path="/contact" element={<Index />} />

              {/* Catch all non-matching routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
