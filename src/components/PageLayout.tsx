import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="max-w-7xl mx-auto w-full px-mobile-lg md:px-mobile-xl lg:px-mobile-2xl py-mobile-lg">
        {children}
      </div>
    </div>
  );
};