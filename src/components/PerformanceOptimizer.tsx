import { useEffect } from 'react';

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Disable animations on low-end devices
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowEndDevice = navigator.hardwareConcurrency <= 2;
    
    if (prefersReducedMotion || isLowEndDevice) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
      document.documentElement.classList.add('reduced-motion');
    }

    // Optimize scroll performance
    let ticking = false;
    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizeScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', optimizeScroll);
    };
  }, []);

  return null;
};