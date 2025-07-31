import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-border/30 py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center md:text-left">
          {/* Left - idiomas.io */}
          <div className="md:text-left">
            <a 
              href="https://idiomas.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              idiomas.io
            </a>
            <p className="text-muted-foreground text-xs mt-1">
              Language Learning Platform
            </p>
          </div>

          {/* Center - Built by Alex Lawton */}
          <div className="text-center">
            <p className="text-muted-foreground text-xs">
              Built by{' '}
              <a 
                href="https://www.alexlawton.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Alex Lawton
              </a>
            </p>
          </div>

          {/* Right - lapipa.io */}
          <div className="md:text-right">
            <a 
              href="https://lapipa.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              lapipa.io
            </a>
            <p className="text-muted-foreground text-xs mt-1">
              Digital Solutions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};