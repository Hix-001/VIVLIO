import React from 'react';

export const Shelf: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <group position={[0, -1.25, 0]}>
      {/* Contact Shadow Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.4} />
      </mesh>

      {/* Solid Walnut Plinth */}
      <mesh position={[0, -0.07, 0]} receiveShadow>
        <boxGeometry args={[28, 0.15, 3.2]} />
        <meshStandardMaterial color="#241a14" roughness={0.6} metalness={0.1} />
      </mesh>

      {children}
    </group>
  );
};
