import React from 'react';
import { Torch } from './Torch';
import { DustParticles } from './DustParticles';
import { InstancedBookshelf } from './InstancedBookshelf';

export const MedievalLibrary: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <group>
      {/* Background Gothic Stone Wall */}
      <mesh position={[0, 2, -3.5]} receiveShadow>
        <planeGeometry args={[26, 12]} />
        <meshStandardMaterial color="#1a1512" roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Grand Archival Bookshelf with 1,000+ Instanced Books */}
      <InstancedBookshelf />

      {/* Medieval Stone Pillars */}
      {[-7, -3.5, 3.5, 7].map((x, i) => (
        <group key={i} position={[x, 1.8, -2.8]}>
          {/* Pillar Shaft */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.4, 7.5, 12]} />
            <meshStandardMaterial color="#221c18" roughness={0.88} />
          </mesh>
          {/* Capital Arch Tracery */}
          <mesh position={[0, 3.5, 0]} castShadow>
            <boxGeometry args={[1.0, 0.4, 0.9]} />
            <meshStandardMaterial color="#2a221d" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Gothic Pointed Arch Ribs */}
      {[-5.25, 0, 5.25].map((x, i) => (
        <mesh key={`arch-${i}`} position={[x, 4.8, -2.7]}>
          <torusGeometry args={[1.8, 0.12, 6, 16, Math.PI]} />
          <meshStandardMaterial color="#241d18" roughness={0.85} />
        </mesh>
      ))}

      {/* Medieval Torches with Flickering Firelight */}
      <Torch position={[-4.5, 1.2, -3.2]} intensity={2.0} />
      <Torch position={[4.5, 1.2, -3.2]} intensity={2.0} />
      <Torch position={[0, 1.8, -3.2]} intensity={1.6} />

      {/* Stained Glass Luminous Ambient Glow */}
      <mesh position={[0, 4.2, -3.4]}>
        <circleGeometry args={[1.2, 24]} />
        <meshBasicMaterial color="#d49a37" transparent opacity={0.35} />
      </mesh>

      {/* Floating Dust Particles */}
      <DustParticles count={150} />

      {children}
    </group>
  );
};
