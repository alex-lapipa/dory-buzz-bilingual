import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppHeader } from "@/components/AppHeader";
import { AuthWrapper } from "@/components/AuthWrapper";
import { FloatingGarden } from "@/components/FloatingGarden";
import { LanguageWelcome } from "@/components/LanguageWelcome";
import { UserRegistration } from "@/components/UserRegistration";
import { SystemStatusIndicator } from "@/components/SystemStatusIndicator";
import { AppStatusProvider } from "@/contexts/AppStatusContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useLanguage } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const [showLanguageSelect, setShowLanguageSelect] = useState(!localStorage.getItem('mochi_language_selected'));
  const [showRegistration, setShowRegistration] = useState(false);
  const { setLanguage } = useLanguage();

  const handleLanguageSelect = (language: 'en' | 'es') => {
    setLanguage(language);
    localStorage.setItem('mochi_language_selected', 'true');
    setShowLanguageSelect(false);
    
    // Check if user has already registered
    const existingRegistration = localStorage.getItem('userRegistration');
    if (!existingRegistration) {
      setShowRegistration(true);
    }
  };

  const handleRegistrationComplete = () => {
    setShowRegistration(false);
  };

  if (showLanguageSelect) {
    return <LanguageWelcome onLanguageSelect={handleLanguageSelect} />;
  }

  if (showRegistration) {
    return <UserRegistration onComplete={handleRegistrationComplete} />;
  }

  return (
    <BrowserRouter>
      <AppStatusProvider>
        <AuthWrapper>
          <div className="flex flex-col min-h-screen bg-gradient-nature">
            <AppHeader />
            <main className="flex-1 overflow-auto relative z-10 pt-16 sm:pt-18">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <FloatingGarden />
            <SystemStatusIndicator />
          </div>
        </AuthWrapper>
      </AppStatusProvider>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <AppContent />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;