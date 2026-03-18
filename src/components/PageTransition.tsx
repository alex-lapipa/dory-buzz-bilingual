import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage('exit');
      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('enter');
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [children, location.pathname]);

  return (
    <div
      className={`page-transition ${transitionStage === 'enter' ? 'page-enter' : 'page-exit'}`}
    >
      {displayChildren}
    </div>
  );
};
