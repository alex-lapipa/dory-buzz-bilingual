import React from 'react';
import { AppHeader } from '@/components/AppHeader';
import { FloatingGarden } from '@/components/FloatingGarden';

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFloatingGarden?: boolean;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showHeader = true,
  showFloatingGarden = true,
  className = ""
}) => {
  return (
    <div className="min-h-screen bg-gradient-nature relative overflow-hidden">
      {/* Background Elements */}
      {showFloatingGarden && <FloatingGarden />}
      
      {/* Header */}
      {showHeader && <AppHeader />}
      
      {/* Main Content */}
      <main className={`relative z-10 ${showHeader ? 'pt-20' : 'pt-4'} pb-8 px-4 ${className}`}>
        {/* Page Content */}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};