import React, { useState, createContext, useContext, useEffect, lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, useLocation } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";

import { AppHeader } from "@/components/AppHeader";
import { AuthWrapper } from "@/components/AuthWrapper";
import { RouteLoader } from "@/components/ui/route-loader";
import { FloatingGarden } from "@/components/FloatingGarden";
import { GlobalVoiceAgent } from "@/components/GlobalVoiceAgent";
import { MochiVideoProcessor } from "@/components/MochiVideoProcessor";
import { LanguageWelcome } from "@/components/LanguageWelcome";

import { OnboardingFlow } from "@/components/OnboardingFlow";
import { LandingPage } from "@/components/LandingPage";
import { useLanguage } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import LearningHub from "./pages/LearningHub";

// Lazy load heavy components and pages
const BeeBasics = lazy(() => import('./pages/learning/BeeBasics'));
const GardenBasics = lazy(() => import('./pages/learning/GardenBasics'));
const Admin = lazy(() => import('./pages/Admin'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const BuzzyBees = lazy(() => import('./pages/BuzzyBees'));
const KidsStories = lazy(() => import('./pages/kids/KidsStories'));
const KidsGames = lazy(() => import('./pages/kids/KidsGames'));
const KidsSongs = lazy(() => import('./pages/kids/KidsSongs'));
const StatusPage = lazy(() => import('./pages/StatusPage'));
const BrandBook = lazy(() => import('./pages/BrandBook'));
const MielDeMontes = lazy(() => import('./pages/MielDeMontes'));

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


  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    const selectedLanguage = localStorage.getItem('selectedLanguage');
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
    }
  };

  const handleLanguageSelect = (language: 'en' | 'es') => {
    setLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    localStorage.setItem('mochi_language_selected', 'true');
    setShowLanguageSelect(false);
    
    // Check if user has completed onboarding
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
            {!showLanding && !showLanguageSelect && !showOnboarding && (
              <AppHeader onTabSelect={setActiveTab} />
            )}
            <main id="main-content" tabIndex={-1} className="flex-1 overflow-auto relative z-10">
              {/* Auth page is always accessible */}
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reset-password" element={
                  <Suspense fallback={<RouteLoader />}>
                    <ResetPassword />
                  </Suspense>
                } />
                <Route path="*" element={
                  showLanding ? (
                    <LandingPage onGetStarted={handleGetStarted} />
                  ) : showLanguageSelect ? (
                    <LanguageWelcome onLanguageSelect={handleLanguageSelect} />
                  ) : showOnboarding ? (
                    <OnboardingFlow onComplete={handleOnboardingComplete} />
                  ) : (
                    <div className="pt-12 sm:pt-14 md:pt-16 lg:pt-18">
                      <Routes>
                        <Route path="/" element={<PageTransition><LearningHub /></PageTransition>} />
                        <Route path="/chat" element={<PageTransition><Chat /></PageTransition>} />
                        <Route path="/learning-hub" element={<PageTransition><LearningHub /></PageTransition>} />
                        <Route path="/learning/bee-basics" element={
                          <PageTransition>
                            <Suspense fallback={<RouteLoader />}>
                              <BeeBasics />
                            </Suspense>
                          </PageTransition>
                        } />
                        <Route path="/learning/garden-basics" element={
                          <PageTransition>
                            <Suspense fallback={<RouteLoader />}>
                              <GardenBasics />
                            </Suspense>
                          </PageTransition>
                        } />
                        <Route path="/buzzy-bees" element={
                          <PageTransition>
                            <Suspense fallback={<RouteLoader />}>
                              <BuzzyBees />
                            </Suspense>
                          </PageTransition>
                        } />
                        <Route path="/kids-stories" element={
                          <PageTransition>
                            <Suspense fallback={<RouteLoader />}>
                              <KidsStories />
                            </Suspense>
                          </PageTransition>
                        } />
                        <Route path="/kids-games" element={
                          <PageTransition>
                            <Suspense fallback={<RouteLoader />}>
                              <KidsGames />
                            </Suspense>
                          </PageTransition>
                        } />
                        <Route path="/kids-songs" element={
                          <PageTransition>
                            <Suspense fallback={<RouteLoader />}>
                              <KidsSongs />
                            </Suspense>
                          </PageTransition>
                        } />
                        <Route path="/admin" element={
                          <PageTransition>
                            <Suspense fallback={<RouteLoader />}>
                              <Admin />
                            </Suspense>
                          </PageTransition>
                        } />
                        <Route path="/privacy" element={<PageTransition><Suspense fallback={<RouteLoader />}><PrivacyPolicy /></Suspense></PageTransition>} />
                        <Route path="/terms" element={<PageTransition><Suspense fallback={<RouteLoader />}><TermsOfService /></Suspense></PageTransition>} />
                        <Route path="/cookies" element={<PageTransition><Suspense fallback={<RouteLoader />}><CookiePolicy /></Suspense></PageTransition>} />
                        <Route path="/sitemap" element={<PageTransition><Suspense fallback={<RouteLoader />}><SitemapPage /></Suspense></PageTransition>} />
                        <Route path="/brand" element={<PageTransition><Suspense fallback={<RouteLoader />}><BrandBook /></Suspense></PageTransition>} />
              <Route path="/miel-de-montes" element={<PageTransition><Suspense fallback={<RouteLoader />}><MielDeMontes /></Suspense></PageTransition>} />
                        <Route path="/status" element={<PageTransition><Suspense fallback={<RouteLoader />}><StatusPage /></Suspense></PageTransition>} />
                        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                      </Routes>
                      <GDPRConsentBanner />
                    </div>
                  )
                } />
              </Routes>
            </main>
            
            {/* Footer - only show when user is fully onboarded */}
            {!showLanding && !showLanguageSelect && !showOnboarding && (
              <Footer />
            )}
            
            <FloatingGarden />
            <GlobalVoiceAgent />
          </div>
        </AuthWrapper>
      </TooltipProvider>
    </TabContext.Provider>
  );
};

export default App;
