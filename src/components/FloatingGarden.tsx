import React from 'react';

export const FloatingGarden: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {/* Butterflies with flowers */}
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '2s'}}>🦋🌸</div>
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '12s'}}>🦋🌺</div>
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '25s'}}>🦋🌻</div>
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '35s'}}>🦋🌷</div>
      
      {/* Ladybugs with flowers */}
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '5s'}}>🐞🌼</div>
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '18s'}}>🐞🌹</div>
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '28s'}}>🐞🌸</div>
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '40s'}}>🐞🌻</div>
      
      {/* Dragonflies with flowers */}
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '8s'}}>🜻🌺</div>
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '15s'}}>🜻🌷</div>
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '30s'}}>🜻🌼</div>
      
      {/* Ants with flowers */}
      <div className="garden-insect animate-ant-march" style={{animationDelay: '10s'}}>🐜🌸</div>
      <div className="garden-insect animate-ant-march" style={{animationDelay: '22s'}}>🐜🌻</div>
      <div className="garden-insect animate-ant-march" style={{animationDelay: '38s'}}>🐜🌹</div>
      
      {/* Hummingbirds with flowers */}
      <div className="garden-insect animate-hummingbird-hover" style={{animationDelay: '6s'}}>🐦🌺</div>
      <div className="garden-insect animate-hummingbird-hover" style={{animationDelay: '20s'}}>🐦🌷</div>
      <div className="garden-insect animate-hummingbird-hover" style={{animationDelay: '33s'}}>🐦🌼</div>
      
      {/* Moths with flowers */}
      <div className="garden-insect animate-moth-night" style={{animationDelay: '14s'}}>🦗🌸</div>
      <div className="garden-insect animate-moth-night" style={{animationDelay: '26s'}}>🦗🌻</div>
      
      {/* Beetles with flowers */}
      <div className="garden-insect animate-beetle-crawl" style={{animationDelay: '16s'}}>🪲🌹</div>
      <div className="garden-insect animate-beetle-crawl" style={{animationDelay: '32s'}}>🪲🌺</div>
      
      {/* Flying bees with flowers */}
      <div className="garden-insect animate-bee-flight" style={{animationDelay: '3s'}}>🐝🌻</div>
      <div className="garden-insect animate-bee-flight" style={{animationDelay: '13s'}}>🐝🌼</div>
      <div className="garden-insect animate-bee-flight" style={{animationDelay: '23s'}}>🐝🌸</div>
      <div className="garden-insect animate-bee-flight" style={{animationDelay: '36s'}}>🐝🌷</div>
      
      {/* Pure floating flowers */}
      <div className="garden-insect animate-flower-float" style={{animationDelay: '7s'}}>🌸</div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '17s'}}>🌺</div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '27s'}}>🌻</div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '37s'}}>🌷</div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '47s'}}>🌼</div>
      <div className="garden-insect animate-flower-float" style={{animationDelay: '57s'}}>🌹</div>
    </div>
  );
};