import React, { useMemo } from 'react';
import * as THREE from 'three';

export const Shelf: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // Generate procedural quarter-sawn walnut shelf texture
  const woodTexture = useMemo(() => {
    const width = 2048;
    const height = 512;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#1c1511');
    grad.addColorStop(0.5, '#281e18');
    grad.addColorStop(1, '#1a130f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(235, 195, 160, 0.04)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 400; i++) {
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(
        width * 0.3, y + (Math.random() - 0.5) * 20,
        width * 0.7, y + (Math.random() - 0.5) * 20,
        width, y
      );
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

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
        <meshStandardMaterial map={woodTexture} roughness={0.55} metalness={0.1} />
      </mesh>

      {children}
    </group>
  );
};
