import React, { lazy, Suspense } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { BrandBook } from '@/components/admin/BrandBook';
import { DesignSystem } from '@/components/admin/DesignSystem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Activity, Wrench, Palette, Layers, Shield } from 'lucide-react';
import { ConsentSettings } from '@/components/GDPRConsent';
import { AccessibilityHelper } from '@/components/AccessibilityHelper';

const MasterControlPanel = lazy(() => import('@/components/MasterControlPanel'));
const ProductionDashboard = lazy(() => import('@/components/ProductionDashboard'));

// Lazy load TechnicalDetails content
const TechnicalDetails = lazy(() => import('@/pages/TechnicalDetails'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-48">
    <div className="text-center space-y-2">
      <div className="text-3xl animate-bee-bounce">🐝</div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const Admin: React.FC = () => {
  return (
    <AdminGuard>
      <PageLayout>
        {/* Admin Header */}
        <div className="mb-6 glass-card rounded-xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Settings className="h-7 w-7 text-primary" />
                Admin Panel
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your MochiBee platform
              </p>
            </div>
            <Badge variant="default" className="gap-1">
              <Activity className="h-3 w-3" />
              Authenticated
            </Badge>
          </div>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="control" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="control" className="gap-1.5 text-xs sm:text-sm">
              <Settings className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Control</span> Panel
            </TabsTrigger>
            <TabsTrigger value="production" className="gap-1.5 text-xs sm:text-sm">
              <Activity className="h-3.5 w-3.5" />
              Production
            </TabsTrigger>
            <TabsTrigger value="technical" className="gap-1.5 text-xs sm:text-sm">
              <Wrench className="h-3.5 w-3.5" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="brand" className="gap-1.5 text-xs sm:text-sm">
              <Palette className="h-3.5 w-3.5" />
              Brand Book
            </TabsTrigger>
            <TabsTrigger value="design" className="gap-1.5 text-xs sm:text-sm">
              <Layers className="h-3.5 w-3.5" />
              Design System
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-1.5 text-xs sm:text-sm">
              <Shield className="h-3.5 w-3.5" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control">
            <Suspense fallback={<LoadingFallback />}>
              <MasterControlPanel />
            </Suspense>
          </TabsContent>

          <TabsContent value="production">
            <Suspense fallback={<LoadingFallback />}>
              <ProductionDashboard />
            </Suspense>
          </TabsContent>

          <TabsContent value="technical">
            <Suspense fallback={<LoadingFallback />}>
              <TechnicalDetails />
            </Suspense>
          </TabsContent>

          <TabsContent value="brand">
            <BrandBook />
          </TabsContent>

          <TabsContent value="design">
            <DesignSystem />
          </TabsContent>

          <TabsContent value="privacy">
            <div className="space-y-6">
              <ConsentSettings />
              <AccessibilityHelper />
            </div>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </AdminGuard>
  );
};

export default Admin;
