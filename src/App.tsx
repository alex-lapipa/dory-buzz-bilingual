import { useState, createContext, useContext, useEffect } from "react";
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
import { LandingPage } from "@/components/LandingPage";
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
  const [activeTab, setActiveTab] = useState('chat');
  const [showLanding, setShowLanding] = useState(!localStorage.getItem('hasVisited'));
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { setLanguage } = useLanguage();

  // Debug log to verify state
  console.log('AppContent state:', { showLanding, showLanguageSelect, showRegistration, showOnboarding });

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    const userRegistration = localStorage.getItem('userRegistration');
    const completedOnboarding = localStorage.getItem('mochi_onboarding_completed');

    if (!hasVisited) {
      setShowLanding(true);
    } else if (!selectedLanguage) {
      setShowLanguageSelect(true);
    } else if (!userRegistration) {
      setShowRegistration(true);
    } else if (!completedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowLanding(false);
    
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (!selectedLanguage) {
      setShowLanguageSelect(true);
    } else {
      const userRegistration = localStorage.getItem('userRegistration');
      if (!userRegistration) {
        setShowRegistration(true);
      }
    }
  };

  const handleLanguageSelect = (language: 'en' | 'es') => {
    setLanguage(language);
    localStorage.setItem('selectedLanguage', language);
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
              {/* Only show header when user is fully onboarded */}
              {!showLanding && !showLanguageSelect && !showRegistration && !showOnboarding && (
                <AppHeader onTabSelect={setActiveTab} />
              )}
              <main className="flex-1 overflow-auto relative z-10">
                {/* Show landing page first for new visitors */}
                {showLanding ? (
                  <LandingPage onGetStarted={handleGetStarted} />
                ) : showLanguageSelect ? (
                  <LanguageWelcome onLanguageSelect={handleLanguageSelect} />
                ) : showRegistration ? (
                  <UserRegistration onComplete={handleRegistrationComplete} />
                ) : showOnboarding ? (
                  <OnboardingFlow onComplete={handleOnboardingComplete} />
                ) : (
                  /* Normal app with header when fully onboarded */
                  <>
                    <div className="pt-12 sm:pt-14 md:pt-16 lg:pt-18">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </>
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