import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AudioProvider } from "@/contexts/AudioContext";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import GlobalBackground from "@/components/ui/GlobalBackground";
import BackgroundPerformanceMonitor from "@/components/ui/BackgroundPerformanceMonitor";
import Index from "@/pages/index";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AudioProvider>
          <BackgroundProvider>
            <Router>
              {/* Global Background */}
              <GlobalBackground />

              <BackgroundPerformanceMonitor
                position="bottom-left"
                showDetails={process.env.NODE_ENV === 'development'}
              />

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

              <Toaster />
            </Router>
          </BackgroundProvider>
        </AudioProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
