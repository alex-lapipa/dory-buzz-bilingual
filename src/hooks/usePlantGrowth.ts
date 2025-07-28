import { useEffect, useRef } from 'react';

interface PlantGrowthTracker {
  incrementGrowth: () => void;
  reset: () => void;
}

export const usePlantGrowth = (): PlantGrowthTracker => {
  const growthLevelRef = useRef(0);
  const lastGrowthRef = useRef(Date.now());

  const incrementGrowth = () => {
    const now = Date.now();
    // Only grow if at least 5 seconds have passed since last growth
    if (now - lastGrowthRef.current > 5000) {
      growthLevelRef.current += 1;
      lastGrowthRef.current = now;
      
      // Apply growth to all growing plants
      const growingPlants = document.querySelectorAll('.growing-plant');
      growingPlants.forEach((plant, index) => {
        const element = plant as HTMLElement;
        const currentStage = Math.min(Math.floor(growthLevelRef.current / 3) + 1, 5);
        
        // Remove existing stage classes
        element.classList.remove('stage-1', 'stage-2', 'stage-3', 'stage-4', 'stage-5');
        
        // Add new stage class with slight delay for each plant
        setTimeout(() => {
          element.classList.add(`stage-${currentStage}`);
        }, index * 500);
      });

      // Add a subtle growing effect
      growingPlants.forEach((plant, index) => {
        setTimeout(() => {
          const element = plant as HTMLElement;
          element.style.animation = 'none';
          element.offsetHeight; // Force reflow
          element.style.animation = 'gentle-breeze 6s ease-in-out infinite, plant-growth-pulse 1s ease-out';
        }, index * 500);
      });
    }
  };

  const reset = () => {
    growthLevelRef.current = 0;
    lastGrowthRef.current = Date.now();
    
    const growingPlants = document.querySelectorAll('.growing-plant');
    growingPlants.forEach((plant) => {
      const element = plant as HTMLElement;
      element.classList.remove('stage-1', 'stage-2', 'stage-3', 'stage-4', 'stage-5');
    });
  };

  useEffect(() => {
    // Add growth pulse animation to CSS if not already present
    const style = document.createElement('style');
    style.textContent = `
      @keyframes plant-growth-pulse {
        0% { filter: brightness(1) drop-shadow(0 0 0px transparent); }
        50% { filter: brightness(1.3) drop-shadow(0 0 8px hsl(120 60% 70% / 0.6)); }
        100% { filter: brightness(1) drop-shadow(0 0 0px transparent); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return { incrementGrowth, reset };
};