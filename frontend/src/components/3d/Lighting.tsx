import React from 'react';

export const Lighting: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.7} color="#ffeedd" />
      
      {/* Warm Key Light */}
      <directionalLight
        position={[4, 7, 5]}
        intensity={2.2}
        color="#fffaed"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      
      {/* Cool Fill Light */}
      <directionalLight
        position={[-5, 3, -2]}
        intensity={0.9}
        color="#90b0e0"
      />
      
      {/* Golden Rim Light */}
      <directionalLight
        position={[0, -3, -4]}
        intensity={1.1}
        color="#ffd7a0"
      />
    </>
  );
};
