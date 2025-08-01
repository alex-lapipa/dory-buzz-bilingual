import React from 'react';

interface BeeLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const BeeLoadingSpinner: React.FC<BeeLoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Mochi is thinking...' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-mobile-md">
      <div className="relative">
        <img 
          src="/lovable-uploads/220a09ac-6570-4d48-b70b-5ba2fc26e5cf.png" 
          alt="Mochi the Bee Loading" 
          className={`${sizeClasses[size]} animate-pulse filter drop-shadow-lg`}
        />
        <div className="absolute inset-0 animate-ping">
          <div className={`${sizeClasses[size]} rounded-full bg-primary/20`}></div>
        </div>
      </div>
      {message && (
        <p className="text-responsive-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};