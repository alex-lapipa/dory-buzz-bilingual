import React, { useState, useRef, useEffect } from 'react';

interface LazyVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({ 
  src, 
  className = '', 
  autoPlay = false,
  loop = false,
  muted = true,
  controls = false,
  poster = ''
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mobile optimization - reduce quality on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {isInView ? (
        <video
          autoPlay={autoPlay && !isMobile} // Disable autoplay on mobile for data saving
          loop={loop}
          muted={muted}
          controls={controls}
          poster={poster}
          className={`w-full h-auto transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-50'}`}
          onLoadedData={() => setIsLoaded(true)}
          preload={isMobile ? 'metadata' : 'auto'} // Reduce preload on mobile
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div 
          className={`w-full h-48 bg-muted animate-pulse flex items-center justify-center text-muted-foreground`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">🎥</div>
            <div className="text-sm">Loading video...</div>
          </div>
        </div>
      )}
    </div>
  );
};