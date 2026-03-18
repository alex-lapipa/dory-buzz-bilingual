import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [stage, setStage] = useState<'enter' | 'idle'>('enter');
  const prevKey = useRef(location.key);

  useEffect(() => {
    if (location.key !== prevKey.current) {
      prevKey.current = location.key;
      setStage('enter');
    }
  }, [location.key]);

  // Remove animation class after it finishes to avoid replaying
  const handleAnimationEnd = () => {
    setStage('idle');
  };

  return (
    <div
      className={`page-transition ${stage === 'enter' ? 'page-enter' : ''}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
};
