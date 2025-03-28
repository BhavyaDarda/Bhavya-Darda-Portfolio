import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n"; // Initialize i18n
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Create root with StrictMode disabled for Three.js compatibility
createRoot(document.getElementById("root")!).render(
  <App />
);
