import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Torch } from './Torch';
import { DustParticles } from './DustParticles';

export const MedievalLibrary: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // Procedural medieval stone masonry texture
  const stoneTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1e1a16';
    ctx.fillRect(0, 0, 1024, 1024);

    // Stone blocks & mortar joints
    ctx.strokeStyle = '#120f0c';
    ctx.lineWidth = 4;
    const blockH = 64;
    const blockW = 128;

    for (let y = 0; y < 1024; y += blockH) {
      const offsetX = (y / blockH) % 2 === 0 ? 0 : blockW / 2;
      for (let x = -blockW; x < 1024 + blockW; x += blockW) {
        ctx.fillStyle = (x + y) % 3 === 0 ? '#26201a' : '#221c17';
        ctx.fillRect(x + offsetX, y, blockW, blockH);
        ctx.strokeRect(x + offsetX, y, blockW, blockH);
      }
    }

    // Noise speckles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 2000; i++) {
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 2);
    return tex;
  }, []);

  return (
    <group>
      {/* Background Gothic Stone Wall */}
      <mesh position={[0, 2, -3.5]} receiveShadow>
        <planeGeometry args={[26, 12]} />
        <meshStandardMaterial map={stoneTexture} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Medieval Stone Pillars */}
      {[-7, -3.5, 3.5, 7].map((x, i) => (
        <group key={i} position={[x, 1.8, -2.8]}>
          {/* Pillar Shaft */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.4, 7.5, 16]} />
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
          <torusGeometry args={[1.8, 0.12, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#241d18" roughness={0.85} />
        </mesh>
      ))}

      {/* Medieval Torches with Flickering Firelight */}
      <Torch position={[-4.5, 1.2, -3.2]} intensity={2.2} />
      <Torch position={[4.5, 1.2, -3.2]} intensity={2.2} />
      <Torch position={[0, 1.8, -3.2]} intensity={1.8} />

      {/* Stained Glass Luminous Ambient Glow */}
      <mesh position={[0, 4.2, -3.4]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#d49a37" transparent opacity={0.35} />
      </mesh>

      {/* Floating Dust Particles */}
      <DustParticles count={250} />

      {children}
    </group>
  );
};
