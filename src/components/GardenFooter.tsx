import React from 'react';

export const GardenFooter: React.FC = () => {
  return (
    <>
      {/* Garden Insects */}
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '2s'}}>🦋</div>
      <div className="garden-insect animate-butterfly-flutter" style={{animationDelay: '12s'}}>🦋</div>
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '5s'}}>🐞</div>
      <div className="garden-insect animate-ladybug-crawl" style={{animationDelay: '18s'}}>🐞</div>
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '8s'}}>🜻</div>
      <div className="garden-insect animate-dragonfly-zip" style={{animationDelay: '15s'}}>🜻</div>
      <div className="garden-insect animate-ant-march" style={{animationDelay: '10s'}}>🐜</div>
      <div className="garden-insect animate-ant-march" style={{animationDelay: '22s'}}>🐜</div>
      
      {/* Garden Footer - Growing from ground */}
      <div className="garden-footer fixed bottom-0 left-0 right-0 z-10">
        <div className="garden-soil"></div>
        <div className="garden-grass"></div>
        <div className="garden-plants">
          <div className="garden-plant tall-plant">
            <div className="plant-flower">🌻</div>
            <div className="plant-stem">🌱</div>
            <div className="plant-leaves">🍃</div>
          </div>
          <div className="garden-plant medium-plant">
            <div className="plant-flower">🌸</div>
            <div className="plant-stem">🌿</div>
          </div>
          <div className="garden-plant short-plant">
            <div className="plant-flower">🌺</div>
            <div className="plant-stem">🌱</div>
          </div>
          <div className="garden-plant tall-plant">
            <div className="plant-flower">🌷</div>
            <div className="plant-stem">🌿</div>
            <div className="plant-leaves">🍃</div>
          </div>
          <div className="garden-plant medium-plant">
            <div className="plant-flower">🌹</div>
            <div className="plant-stem">🌱</div>
          </div>
          <div className="garden-plant short-plant">
            <div className="plant-flower">🌼</div>
            <div className="plant-stem">🌿</div>
          </div>
          <div className="garden-plant tall-plant">
            <div className="plant-flower">🌻</div>
            <div className="plant-stem">🌱</div>
            <div className="plant-leaves">🍃</div>
          </div>
          <div className="garden-plant medium-plant">
            <div className="plant-flower">🌸</div>
            <div className="plant-stem">🌿</div>
          </div>
          <div className="garden-plant short-plant">
            <div className="plant-flower">🌺</div>
            <div className="plant-stem">🌱</div>
          </div>
          <div className="garden-plant tall-plant">
            <div className="plant-flower">🌷</div>
            <div className="plant-stem">🌿</div>
            <div className="plant-leaves">🍃</div>
          </div>
          <div className="garden-plant medium-plant">
            <div className="plant-flower">🌹</div>
            <div className="plant-stem">🌱</div>
          </div>
          <div className="garden-plant short-plant">
            <div className="plant-flower">🌼</div>
            <div className="plant-stem">🌿</div>
          </div>
        </div>
      </div>
    </>
  );
};