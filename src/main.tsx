import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { initEmailJS } from "./utils/emailjs";

// Initialize EmailJS
initEmailJS();

// Lazy load the main App component
const App = lazy(() => import("./App.tsx"));

// Mount the application with performance optimizations
createRoot(document.getElementById("root")!).render(
  // Only use StrictMode in development
  import.meta.env.DEV ? (
    <StrictMode>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <App />
      </Suspense>
    </StrictMode>
  ) : (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <App />
    </Suspense>
  )
);
