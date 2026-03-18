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
    <div className="min-h-screen bg-gradient-nature relative overflow-hidden parallax-container">
      {/* Background Elements - parallax back layer */}
      {showFloatingGarden && (
        <div className="parallax-layer-back">
          <FloatingGarden />
        </div>
      )}
      
      {/* Header */}
      {showHeader && <AppHeader />}
      
      {/* Main Content - Mobile-first responsive spacing */}
      <main className={`relative z-10 content-spacing parallax-layer-front ${className}`}>
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};