import React from 'react';

export const FloatingGarden: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 opacity-30">
      {/* Butterflies with larger flowers */}
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '2s'}}>🦋<span className="text-2xl">🌸</span></div>
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '12s'}}>🦋<span className="text-3xl">🌺</span></div>
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '25s'}}>🦋<span className="text-2xl">🌻</span></div>
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '35s'}}>🦋<span className="text-3xl">🌷</span></div>
      
      {/* Ladybugs with larger flowers */}
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '5s'}}>🐞<span className="text-2xl">🌼</span></div>
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '18s'}}>🐞<span className="text-3xl">🌹</span></div>
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '28s'}}>🐞<span className="text-2xl">🌸</span></div>
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '40s'}}>🐞<span className="text-3xl">🌻</span></div>
      
      {/* Dragonflies with larger flowers */}
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '8s'}}>🜻<span className="text-3xl">🌺</span></div>
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '15s'}}>🜻<span className="text-2xl">🌷</span></div>
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '30s'}}>🜻<span className="text-3xl">🌼</span></div>
      
      {/* Ants with larger flowers */}
      <div className="garden-insect animate-ant-march" style={{animationDelay: '10s'}}>🐜<span className="text-2xl">🌸</span></div>
      <div className="garden-insect animate-ant-march" style={{animationDelay: '22s'}}>🐜<span className="text-3xl">🌻</span></div>
      <div className="garden-insect animate-ant-march" style={{animationDelay: '38s'}}>🐜<span className="text-2xl">🌹</span></div>
      
      {/* Hummingbirds with larger flowers */}
      <div className="garden-insect animate-hummingbird-hover" style={{animationDelay: '6s'}}>🐦<span className="text-4xl">🌺</span></div>
      <div className="garden-insect animate-hummingbird-hover" style={{animationDelay: '20s'}}>🐦<span className="text-3xl">🌷</span></div>
      <div className="garden-insect animate-hummingbird-hover" style={{animationDelay: '33s'}}>🐦<span className="text-4xl">🌼</span></div>
      
      {/* Moths with larger flowers */}
      <div className="garden-insect animate-moth-night" style={{animationDelay: '14s'}}>🦗<span className="text-2xl">🌸</span></div>
      <div className="garden-insect animate-moth-night" style={{animationDelay: '26s'}}>🦗<span className="text-3xl">🌻</span></div>
      
      {/* Beetles with larger flowers */}
      <div className="garden-insect animate-beetle-crawl" style={{animationDelay: '16s'}}>🪲<span className="text-2xl">🌹</span></div>
      <div className="garden-insect animate-beetle-crawl" style={{animationDelay: '32s'}}>🪲<span className="text-3xl">🌺</span></div>
      
      {/* Flying bees with larger flowers */}
      <div className="garden-insect animate-bee-flight" style={{animationDelay: '3s'}}>🐝<span className="text-4xl">🌻</span></div>
      <div className="garden-insect animate-bee-flight" style={{animationDelay: '13s'}}>🐝<span className="text-3xl">🌼</span></div>
      <div className="garden-insect animate-bee-flight" style={{animationDelay: '23s'}}>🐝<span className="text-4xl">🌸</span></div>
      <div className="garden-insect animate-bee-flight" style={{animationDelay: '36s'}}>🐝<span className="text-3xl">🌷</span></div>
      
      {/* Pure floating large flowers */}
      <div className="garden-insect animate-flower-float" style={{animationDelay: '7s'}}><span className="text-5xl">🌸</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '17s'}}><span className="text-4xl">🌺</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '27s'}}><span className="text-5xl">🌻</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '37s'}}><span className="text-4xl">🌷</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '47s'}}><span className="text-5xl">🌼</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '57s'}}><span className="text-4xl">🌹</span></div>
      
      {/* Large flowering plants */}
      <div className="garden-insect animate-flower-float" style={{animationDelay: '9s'}}><span className="text-6xl">🌺🌿</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '19s'}}><span className="text-5xl">🌻🍃</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '29s'}}><span className="text-6xl">🌸🌿</span></div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '39s'}}><span className="text-5xl">🌷🍃</span></div>
    </div>
  );
};