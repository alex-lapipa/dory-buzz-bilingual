import React, { useState, createContext, useContext, useEffect, lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";

import { AppHeader } from "@/components/AppHeader";
import { AuthWrapper } from "@/components/AuthWrapper";
import { FloatingGarden } from "@/components/FloatingGarden";
import { MochiVideoProcessor } from "@/components/MochiVideoProcessor";
import { LanguageWelcome } from "@/components/LanguageWelcome";

import { OnboardingFlow } from "@/components/OnboardingFlow";
import { LandingPage } from "@/components/LandingPage";
import { useLanguage } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Voice from "./pages/Voice";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import LearningHub from "./pages/LearningHub";
import TechnicalDetails from "./pages/TechnicalDetails";

// Lazy load heavy components and pages
const BeeBasics = lazy(() => import('./pages/learning/BeeBasics'));
const GardenBasics = lazy(() => import('./pages/learning/GardenBasics'));
const ProductionDashboard = lazy(() => import('@/components/ProductionDashboard'));

import { useAuth } from "@/contexts/AuthContext";
import { GDPRConsentBanner } from "@/components/GDPRConsent";
import { Footer } from "@/components/Footer";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";

// Create a context to manage active tab across components
const TabContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({
  activeTab: 'chat',
  setActiveTab: () => {},
});

export const useTab = () => useContext(TabContext);

const App = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [showLanding, setShowLanding] = useState(!localStorage.getItem('hasVisited'));
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { setLanguage } = useLanguage();
  const { user, loading: authLoading } = useAuth();

  // Debug log to verify state
  console.log('App state:', { showLanding, showLanguageSelect, showOnboarding });

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
      <TooltipProvider>
        <AuthWrapper>
          <PerformanceOptimizer />
          <MochiVideoProcessor />
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
                /* Normal app routes */
                <>
                  <div className="pt-12 sm:pt-14 md:pt-16 lg:pt-18">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/voice" element={<Voice />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/learning-hub" element={<LearningHub />} />
                      <Route path="/learning/bee-basics" element={
                        <Suspense fallback={<div className="flex items-center justify-center h-48">Loading...</div>}>
                          <BeeBasics />
                        </Suspense>
                      } />
                      <Route path="/learning/garden-basics" element={
                        <Suspense fallback={<div className="flex items-center justify-center h-48">Loading...</div>}>
                          <GardenBasics />
                        </Suspense>
                      } />
                      <Route path="/production" element={
                        <Suspense fallback={<div className="flex items-center justify-center h-48">Loading...</div>}>
                          <ProductionDashboard />
                        </Suspense>
                      } />
                      <Route path="/technical-details" element={<TechnicalDetails />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  {/* GDPR Consent Banner */}
                  <GDPRConsentBanner />
                </>
              )}
            </main>
            
            {/* Footer - only show when user is fully onboarded */}
            {!showLanding && !showLanguageSelect && !showRegistration && !showOnboarding && (
              <Footer />
            )}
            
            <FloatingGarden />
          </div>
        </AuthWrapper>
      </TooltipProvider>
    </TabContext.Provider>
  );
};

export default App;