import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AtmosphericDust: React.FC<{ count?: number }> = ({ count = 160 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Cylinder distribution around chamber center
      const radius = Math.random() * 5.5;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -1.0 + Math.random() * 5.5; // Y height
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      spd[i * 3] = (Math.random() - 0.5) * 0.003;
      spd[i * 3 + 1] = 0.002 + Math.random() * 0.004; // Gentle upward drift
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    return [pos, spd];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] += speeds[i * 3 + 1];
      array[i * 3] += speeds[i * 3];
      array[i * 3 + 2] += speeds[i * 3 + 2];

      // Loop back down when reaching top of chamber
      if (array[i * 3 + 1] > 4.6) {
        array[i * 3 + 1] = -1.2;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#ffd700"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
