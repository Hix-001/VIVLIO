import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HolographicRunesProps {
  color?: string;
  radius?: number;
  height?: number;
}

export const HolographicRunes: React.FC<HolographicRunesProps> = ({
  color = '#9a7322',
  radius = 3.6,
  height = 1.6,
}) => {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  // Procedural holographic canvas texture with geometric runes
  const runeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 1024, 128);
      ctx.fillStyle = color;
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      
      const text = '◊ // ARCHIVAL SANCTUARY // VIVLIO RELICS // Ψ 7 VOLUMES // 1948 - 2026 // ◊ // COGNITIO ET ANIMA // ';
      ctx.fillText(text + text, 512, 70);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [color]);

  useFrame((_, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y += delta * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.22;
      ring2Ref.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.08;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group position={[0, height, 0]}>
      {/* Primary Holographic Cylinder Banner */}
      <group ref={ring1Ref}>
        <mesh>
          <cylinderGeometry args={[radius, radius, 0.45, 48, 1, true]} />
          <meshBasicMaterial
            map={runeTexture}
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Thin Geometric Champagne Accent Ring */}
      <group ref={ring2Ref} position={[0, -0.3, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.96, radius * 0.98, 48]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Concentric Golden Rune Orbit */}
      <group ref={ring3Ref} position={[0, 0.4, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.05, radius * 1.06, 64]} />
          <meshBasicMaterial
            color="#d4af37"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};

