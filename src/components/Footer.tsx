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
              className="text-yellow-400 hover:text-yellow-300 transition-colors text-base font-semibold drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
            >
              idiomas.io
            </a>
            <p className="text-yellow-300 text-sm mt-1 drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]">
              Language Learning Platform
            </p>
          </div>

          {/* Center - Built by Alex Lawton */}
          <div className="text-center">
            <p className="text-yellow-400 text-sm drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">
              Built by{' '}
              <a 
                href="https://www.alexlawton.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-200 transition-colors font-semibold drop-shadow-[0_0_10px_rgba(255,215,0,1)]"
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
              className="text-yellow-400 hover:text-yellow-300 transition-colors text-base font-semibold drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
            >
              lapipa.io
            </a>
            <p className="text-yellow-300 text-sm mt-1 drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]">
              Digital Solutions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};