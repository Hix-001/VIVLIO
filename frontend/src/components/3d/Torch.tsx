import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Torch: React.FC<{ position: [number, number, number]; intensity?: number }> = ({
  position,
  intensity = 2.0,
}) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const flameMeshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 12;
    // Organic fire flicker algorithm
    const flicker = Math.sin(t) * 0.15 + Math.sin(t * 2.3) * 0.1 + Math.sin(t * 5.7) * 0.05;
    if (lightRef.current) {
      lightRef.current.intensity = intensity + flicker;
    }
    if (flameMeshRef.current) {
      flameMeshRef.current.scale.set(
        1 + flicker * 0.4,
        1 + flicker * 0.8,
        1 + flicker * 0.4
      );
    }
  });

  return (
    <group position={position}>
      {/* Wrought Iron Wall Sconce Bracket */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#1a1512" roughness={0.7} metalness={0.8} />
      </mesh>

      {/* Iron Ring Sconce */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshStandardMaterial color="#2a221a" roughness={0.6} metalness={0.9} />
      </mesh>

      {/* Burning Ember Core / Flame */}
      <mesh ref={flameMeshRef} position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#ff9922" />
      </mesh>

      {/* Warm Flickering Candle Light */}
      <pointLight
        ref={lightRef}
        color="#ffaa33"
        distance={9}
        decay={2}
        castShadow
        shadow-bias={-0.001}
      />
    </group>
  );
};
