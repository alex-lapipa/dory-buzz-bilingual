import React from 'react';

export const FloatingGarden: React.FC = () => {
  // Mobile optimization - reduce elements on small screens
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const maxElements = isMobile ? 6 : 12;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-20 opacity-30">
      {/* Reduced animations for mobile performance */}
      {!isMobile && (
        <>
          {/* Fast-moving bees chasing sunflowers */}
          <div className="garden-insect animate-bee-flutter" style={{animationDelay: '0s'}}>🐝<span className="text-4xl">🌻</span></div>
          <div className="garden-insect animate-bee-flutter" style={{animationDelay: '1s'}}>🐝<span className="text-4xl">🌸</span></div>
      
      {/* Slower bees feeding at bottom */}
      <div className="garden-insect animate-bee-feed-bottom" style={{animationDelay: '13s'}}>🐝<span className="text-3xl">🌼</span></div>
      <div className="garden-insect animate-bee-feed-bottom" style={{animationDelay: '36s'}}>🐝<span className="text-3xl">🌷</span></div>
      
      {/* Fast butterflies chasing nectar */}
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '2s'}}>🦋<span className="text-3xl">🌺</span></div>
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '25s'}}>🦋<span className="text-3xl">🌹</span></div>
      
      {/* Slower butterflies feeding at bottom */}
      <div className="garden-insect animate-butterfly-feed-bottom" style={{animationDelay: '12s'}}>🦋<span className="text-2xl">🌸</span></div>
      <div className="garden-insect animate-butterfly-feed-bottom" style={{animationDelay: '35s'}}>🦋<span className="text-2xl">🌷</span></div>
      
      {/* Ladybugs crawling slowly on herbs at bottom */}
      <div className="garden-insect animate-ladybug-crawl-bottom" style={{animationDelay: '5s'}}>🐞<span className="text-2xl">🌿</span></div>
      <div className="garden-insect animate-ladybug-crawl-bottom" style={{animationDelay: '18s'}}>🐞<span className="text-2xl">🍃</span></div>
      <div className="garden-insect animate-ladybug-crawl-bottom" style={{animationDelay: '28s'}}>🐞<span className="text-2xl">🌿</span></div>
      <div className="garden-insect animate-ladybug-crawl-bottom" style={{animationDelay: '40s'}}>🐞<span className="text-2xl">🍃</span></div>
      
      {/* Fast hummingbirds */}
      <div className="garden-insect animate-hummingbird-hover" style={{animationDelay: '6s'}}>🐦<span className="text-4xl">🌺</span></div>
      
      {/* Slower hummingbirds feeding at bottom */}
      <div className="garden-insect animate-hummingbird-feed-bottom" style={{animationDelay: '20s'}}>🐦<span className="text-3xl">🌹</span></div>
      <div className="garden-insect animate-hummingbird-feed-bottom" style={{animationDelay: '33s'}}>🐦<span className="text-4xl">🌷</span></div>
      
      {/* Fast dragonflies hunting */}
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '8s'}}>🜻</div>
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '30s'}}>🜻</div>
      
      {/* Stationary dragonfly resting */}
      <div className="garden-insect animate-dragonfly-rest-bottom" style={{animationDelay: '15s'}}>🜻</div>
      
      {/* Moths prefer pale, night-blooming flowers - moving slowly */}
      <div className="garden-insect animate-moth-slow-bottom" style={{animationDelay: '14s'}}>🦗<span className="text-2xl">🤍</span></div>
      <div className="garden-insect animate-moth-slow-bottom" style={{animationDelay: '26s'}}>🦗<span className="text-2xl">🌙</span></div>
      
      {/* Beetles feeding slowly on large flowers at bottom */}
      <div className="garden-insect animate-beetle-feed-bottom" style={{animationDelay: '16s'}}>🪲<span className="text-3xl">🌻</span></div>
      <div className="garden-insect animate-beetle-feed-bottom" style={{animationDelay: '32s'}}>🪲<span className="text-3xl">🌺</span></div>
      
      {/* Fast ants marching */}
      <div className="garden-insect animate-ant-march" style={{animationDelay: '10s'}}>🐜<span className="text-2xl">🍯</span></div>
      
      {/* Slower ants feeding at bottom */}
      <div className="garden-insect animate-ant-feed-bottom" style={{animationDelay: '22s'}}>🐜<span className="text-2xl">🌸</span></div>
      <div className="garden-insect animate-ant-feed-bottom" style={{animationDelay: '38s'}}>🐜<span className="text-2xl">🍯</span></div>
      
      
      {/* Wild flowers that attract multiple pollinators */}
      <div className="garden-insect animate-flower-float" style={{animationDelay: '7s'}}><span className="text-5xl">🌻</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '17s'}}><span className="text-4xl">🌺</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '27s'}}><span className="text-5xl">🌹</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '37s'}}><span className="text-4xl">🌸</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '47s'}}><span className="text-5xl">🌼</span></div>
      
      {/* Herb garden that ladybugs and beneficial insects love */}
      <div className="garden-insect animate-flower-float" style={{animationDelay: '9s'}}><span className="text-4xl">🌿🍃</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '19s'}}><span className="text-3xl">🌱🌿</span></div>
        </>
      )}
      
      {/* Essential elements for mobile */}
      <div className="garden-insect animate-bee-flutter" style={{animationDelay: '0s'}}>🐝<span className="text-3xl">🌻</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '7s'}}><span className="text-4xl">🌺</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '17s'}}><span className="text-3xl">🌸</span></div>
    </div>
  );
};