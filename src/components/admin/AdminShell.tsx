import React, { useState, lazy, Suspense } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminSidebar, type AdminSection } from '@/components/admin/AdminSidebar';
import { useSidebarFloat } from '@/hooks/useSidebarFloat';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

// Lazy-load heavy panels
const MasterControlPanel = lazy(() => import('@/components/MasterControlPanel'));
const ProductionDashboard = lazy(() => import('@/components/ProductionDashboard'));
const TechnicalDetails = lazy(() => import('@/pages/TechnicalDetails'));
const GoogleEcosystemDashboard = lazy(() => import('@/components/admin/GoogleEcosystemDashboard'));
const BeeBasicsAdmin = lazy(() => import('@/components/admin/BeeBasicsAdmin'));
const GardenBasicsAdmin = lazy(() => import('@/components/admin/GardenBasicsAdmin'));
const ChatManagement = lazy(() => import('@/components/admin/ChatManagement'));
const ContentIngestion = lazy(() => import('@/components/admin/ContentIngestion'));

// Direct imports for lighter components
import { BrandBook } from '@/components/admin/BrandBook';
import { DesignSystem } from '@/components/admin/DesignSystem';
import { ConsentSettings } from '@/components/GDPRConsent';
import { AccessibilityHelper } from '@/components/AccessibilityHelper';
import { ComprehensiveHealthCheck } from '@/components/ComprehensiveHealthCheck';
import LearningHub from '@/pages/LearningHub';

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-48">
    <div className="text-center space-y-2">
      <div className="text-3xl animate-bee-bounce">🐝</div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const SECTION_TITLES: Record<AdminSection, string> = {
  control: 'Control Panel',
  production: 'Production Dashboard',
  analytics: 'Analytics',
  beeducation: 'Beeducation Hub',
  'bee-basics': 'Bee Basics',
  'garden-basics': 'Garden Basics',
  chat: 'Chat Management',
  brand: 'Brand Book',
  design: 'Design System',
  'google-ecosystem': 'Google Ecosystem',
  technical: 'Technical Details',
  'system-health': 'System Health',
  privacy: 'Privacy & GDPR',
  accessibility: 'Accessibility',
  settings: 'Content Ingestion',
};

const AdminShell: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('control');
  const sidebar = useSidebarFloat();
  const isMobile = useIsMobile();

  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    if (isMobile) sidebar.closeMobile();
  };

  const sidebarContent = (
    <AdminSidebar
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
      expanded={isMobile ? true : sidebar.expanded}
      pinned={sidebar.pinned}
      togglePin={sidebar.togglePin}
      onMouseEnter={sidebar.onMouseEnter}
      onMouseLeave={sidebar.onMouseLeave}
      isMobile={isMobile}
    />
  );

  return (
    <AdminGuard>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Desktop sidebar */}
        {!isMobile && (
          <>
            {/* Backdrop when floating expanded */}
            {sidebar.expanded && !sidebar.pinned && (
              <div
                className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[1px]"
                onClick={sidebar.onMouseLeave}
              />
            )}
            <div
              className={cn(
                'fixed left-0 top-0 z-40 h-screen pt-16',
                'transition-[width] duration-300 ease-in-out',
                sidebar.expanded ? 'w-64' : 'w-16',
              )}
            >
              {sidebarContent}
            </div>
          </>
        )}

        {/* Mobile hamburger + sheet */}
        {isMobile && (
          <Sheet open={sidebar.mobileOpen} onOpenChange={(open) => open ? sidebar.toggleMobile() : sidebar.closeMobile()}>
            <SheetContent side="left" className="p-0 w-72">
              <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
              {sidebarContent}
            </SheetContent>
          </Sheet>
        )}

        {/* Main content */}
        <main
          className={cn(
            'flex-1 min-w-0 transition-[margin] duration-300 ease-in-out',
            !isMobile && (sidebar.pinned ? 'ml-64' : 'ml-16'),
          )}
        >
          {/* Top bar */}
          <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={sidebar.toggleMobile} className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-lg font-semibold text-foreground truncate">
              {SECTION_TITLES[activeSection]}
            </h1>
          </div>

          {/* Panel content */}
          <div className="p-4 md:p-6">
            <Suspense fallback={<LoadingFallback />}>
              <SectionPanel section={activeSection} />
            </Suspense>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
};

/* ── Section renderer ── */
const SectionPanel: React.FC<{ section: AdminSection }> = ({ section }) => {
  switch (section) {
    case 'control':
      return <MasterControlPanel />;
    case 'production':
      return <ProductionDashboard />;
    case 'analytics':
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-2xl mb-2">📊</p>
          <p>Analytics dashboard coming soon</p>
        </div>
      );
    case 'beeducation':
      return <LearningHub />;
    case 'bee-basics':
    case 'garden-basics':
    case 'chat':
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-2xl mb-2">🐝</p>
          <p>Content management for {section} coming soon</p>
        </div>
      );
    case 'brand':
      return <BrandBook />;
    case 'design':
      return <DesignSystem />;
    case 'google-ecosystem':
      return <GoogleEcosystemDashboard />;
    case 'technical':
      return <TechnicalDetails />;
    case 'system-health':
      return <ComprehensiveHealthCheck />;
    case 'privacy':
      return <ConsentSettings />;
    case 'accessibility':
      return <AccessibilityHelper />;
    case 'settings':
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-2xl mb-2">⚙️</p>
          <p>Platform settings coming soon</p>
        </div>
      );
    default:
      return null;
  }
};

export default AdminShell;
