import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { LoadingIndicator } from "./components/ui/LoadingIndicator.tsx";

// Lazy load the main App component
const App = lazy(() => import("./App.tsx"));

// Mount the application with performance optimizations
createRoot(document.getElementById("root")!).render(
  // Only use StrictMode in development
  import.meta.env.DEV ? (
    <StrictMode>
      <Suspense fallback={<LoadingIndicator />}>
        <App />
      </Suspense>
    </StrictMode>
  ) : (
    <Suspense fallback={<LoadingIndicator />}>
      <App />
    </Suspense>
  )
);
