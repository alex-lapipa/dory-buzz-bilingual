import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GardenFooter } from "@/components/GardenFooter";
import { AppHeader } from "@/components/AppHeader";
import { AuthWrapper } from "@/components/AuthWrapper";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const showLanguageSelect = !localStorage.getItem('mochi_language_selected');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthWrapper>
            <div className="flex flex-col min-h-screen bg-gradient-nature">
              {!showLanguageSelect && <AppHeader />}
              <main className={`flex-1 overflow-auto relative z-10 ${showLanguageSelect ? 'pt-0' : 'pt-20 sm:pt-24'} ${showLanguageSelect ? 'pb-0' : 'pb-52 sm:pb-56'}`}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              {!showLanguageSelect && <GardenFooter />}
            </div>
          </AuthWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
