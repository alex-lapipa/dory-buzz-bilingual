import React from 'react';

export const FloatingGarden: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 opacity-30">
      {/* Bees chasing sunflowers and bright flowers (their favorites) */}
      <div className="garden-insect animate-bee-flight" style={{animationDelay: '3s'}}>🐝<span className="text-4xl">🌻</span></div>
      <div className="garden-insect animate-bee-flight" style={{animationDelay: '13s'}}>🐝<span className="text-3xl">🌼</span></div>
      <div className="garden-insect animate-bee-flight" style={{animationDelay: '23s'}}>🐝<span className="text-4xl">🌸</span></div>
      <div className="garden-insect animate-bee-flight" style={{animationDelay: '36s'}}>🐝<span className="text-3xl">🌷</span></div>
      
      {/* Butterflies chasing nectar-rich flowers */}
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '2s'}}>🦋<span className="text-3xl">🌺</span></div>
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '12s'}}>🦋<span className="text-2xl">🌸</span></div>
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '25s'}}>🦋<span className="text-3xl">🌹</span></div>
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '35s'}}>🦋<span className="text-2xl">🌷</span></div>
      
      {/* Ladybugs prefer herbs and plants with aphids */}
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '5s'}}>🐞<span className="text-2xl">🌿</span></div>
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '18s'}}>🐞<span className="text-2xl">🍃</span></div>
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '28s'}}>🐞<span className="text-2xl">🌿</span></div>
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '40s'}}>🐞<span className="text-2xl">🍃</span></div>
      
      {/* Hummingbirds love trumpet-shaped and red flowers */}
      <div className="garden-insect animate-hummingbird-hover" style={{animationDelay: '6s'}}>🐦<span className="text-4xl">🌺</span></div>
      <div className="garden-insect animate-hummingbird-hover" style={{animationDelay: '20s'}}>🐦<span className="text-3xl">🌹</span></div>
      <div className="garden-insect animate-hummingbird-hover" style={{animationDelay: '33s'}}>🐦<span className="text-4xl">🌷</span></div>
      
      {/* Dragonflies hunt other insects, less flower-focused */}
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '8s'}}>🜻</div>
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '15s'}}>🜻</div>
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '30s'}}>🜻</div>
      
      {/* Moths prefer pale, night-blooming flowers */}
      <div className="garden-insect animate-moth-night" style={{animationDelay: '14s'}}>🦗<span className="text-2xl">🤍</span></div>
      <div className="garden-insect animate-moth-night" style={{animationDelay: '26s'}}>🦗<span className="text-2xl">🌙</span></div>
      
      {/* Beetles pollinate large, bowl-shaped flowers */}
      <div className="garden-insect animate-beetle-crawl" style={{animationDelay: '16s'}}>🪲<span className="text-3xl">🌻</span></div>
      <div className="garden-insect animate-beetle-crawl" style={{animationDelay: '32s'}}>🪲<span className="text-3xl">🌺</span></div>
      
      {/* Ants attracted to sweet nectar */}
      <div className="garden-insect animate-ant-march" style={{animationDelay: '10s'}}>🐜<span className="text-2xl">🍯</span></div>
      <div className="garden-insect animate-ant-march" style={{animationDelay: '22s'}}>🐜<span className="text-2xl">🌸</span></div>
      <div className="garden-insect animate-ant-march" style={{animationDelay: '38s'}}>🐜<span className="text-2xl">🍯</span></div>
      
      
      {/* Wild flowers that attract multiple pollinators */}
      <div className="garden-insect animate-flower-float" style={{animationDelay: '7s'}}><span className="text-5xl">🌻</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '17s'}}><span className="text-4xl">🌺</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '27s'}}><span className="text-5xl">🌹</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '37s'}}><span className="text-4xl">🌸</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '47s'}}><span className="text-5xl">🌼</span></div>
      
      {/* Herb garden that ladybugs and beneficial insects love */}
      <div className="garden-insect animate-flower-float" style={{animationDelay: '9s'}}><span className="text-4xl">🌿🍃</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '19s'}}><span className="text-3xl">🌱🌿</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '29s'}}><span className="text-4xl">🍀🌿</span></div>
    </div>
  );
};