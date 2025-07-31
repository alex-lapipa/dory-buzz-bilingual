import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card/90 backdrop-blur-sm py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center md:text-left">
          {/* Left - idiomas.io */}
          <div className="md:text-left">
            <a 
              href="https://idiomas.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors text-base font-semibold"
            >
              idiomas.io
            </a>
            <p className="text-foreground/80 text-sm mt-1">
              Language Learning Platform
            </p>
          </div>

          {/* Center - Built by Alex Lawton */}
          <div className="text-center">
            <p className="text-foreground/90 text-sm">
              Built by{' '}
              <a 
                href="https://www.alexlawton.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors font-semibold"
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
              className="text-foreground hover:text-primary transition-colors text-base font-semibold"
            >
              lapipa.io
            </a>
            <p className="text-foreground/80 text-sm mt-1">
              Digital Solutions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};