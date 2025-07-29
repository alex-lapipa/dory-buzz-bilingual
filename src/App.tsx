import { useState, createContext, useContext } from "react";
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
import { OnboardingFlow } from "@/components/OnboardingFlow";

import { AppStatusProvider } from "@/contexts/AppStatusContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useLanguage } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Create a context to manage active tab across components
const TabContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({
  activeTab: 'chat',
  setActiveTab: () => {},
});

export const useTab = () => useContext(TabContext);

const queryClient = new QueryClient();

const AppContent = () => {
  const [showLanguageSelect, setShowLanguageSelect] = useState(!localStorage.getItem('mochi_language_selected'));
  const [showRegistration, setShowRegistration] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const { setLanguage } = useLanguage();

  const handleLanguageSelect = (language: 'en' | 'es') => {
    setLanguage(language);
    localStorage.setItem('mochi_language_selected', 'true');
    setShowLanguageSelect(false);
    
    // Check if user has already registered
    const existingRegistration = localStorage.getItem('userRegistration');
    if (!existingRegistration) {
      setShowRegistration(true);
    } else {
      // Check if user has completed onboarding
      const completedOnboarding = localStorage.getItem('mochi_onboarding_completed');
      if (!completedOnboarding) {
        setShowOnboarding(true);
      }
    }
  };

  const handleRegistrationComplete = () => {
    setShowRegistration(false);
    // Show onboarding after registration
    const completedOnboarding = localStorage.getItem('mochi_onboarding_completed');
    if (!completedOnboarding) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <BrowserRouter>
        <AppStatusProvider>
          <AuthWrapper>
            <div className="flex flex-col min-h-screen bg-gradient-nature">
              <AppHeader onTabSelect={setActiveTab} />
              <main className="flex-1 overflow-auto relative z-10 pt-16 sm:pt-18">
                {/* Always show language selection first if not selected */}
                {showLanguageSelect ? (
                  <LanguageWelcome onLanguageSelect={handleLanguageSelect} />
                ) : showRegistration ? (
                  /* Then show registration if language is selected but user hasn't registered */
                  <UserRegistration onComplete={handleRegistrationComplete} />
                ) : showOnboarding ? (
                  /* Then show onboarding if user is registered but hasn't completed onboarding */
                  <OnboardingFlow onComplete={handleOnboardingComplete} />
                ) : (
                  /* Normal app routes */
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                )}
              </main>
              <FloatingGarden />
            </div>
          </AuthWrapper>
        </AppStatusProvider>
      </BrowserRouter>
    </TabContext.Provider>
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