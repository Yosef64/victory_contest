import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DarkModeProvider } from "./DarkModeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </DarkModeProvider>
  </StrictMode>
);
