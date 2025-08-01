import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ConsentProvider } from "@/contexts/ConsentContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { AppStatusProvider } from "@/contexts/AppStatusContext";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ComprehensiveHealthCheck } from "@/components/ComprehensiveHealthCheck";
import App from "./App.tsx";
import "./index.css";

// Production-optimized query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (replaces cacheTime)
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 2,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ConsentProvider>
            <LanguageProvider>
              <AuthProvider>
                <VoiceProvider>
                  <AppStatusProvider>
                    <AnalyticsProvider>
                      <ComprehensiveHealthCheck />
                      <App />
                      <Toaster 
                        position="bottom-right"
                        expand={true}
                        richColors={true}
                        closeButton={true}
                      />
                    </AnalyticsProvider>
                  </AppStatusProvider>
                </VoiceProvider>
              </AuthProvider>
            </LanguageProvider>
          </ConsentProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
