import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 2, 
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A1A1A",
            color: "#F4F4F5",
            border: "1px solid #2E2E2E",
            borderRadius: "8px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#22C55E", secondary: "#1A1A1A" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "#1A1A1A" } },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
);