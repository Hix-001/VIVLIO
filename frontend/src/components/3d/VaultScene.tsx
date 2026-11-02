import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeErrorBoundary } from './ThreeErrorBoundary';
import { BrutalistArchitecture } from './BrutalistArchitecture';
import { ArchivalStacks } from './ArchivalStacks';
import { HolographicRunes } from './HolographicRunes';
import { RelicPedestals } from './RelicPedestals';
import { AtmosphericDust } from './AtmosphericDust';
import { useVaultStore } from '../../store/vaultStore';

// Camera focal glide animation controller
const CameraController: React.FC = () => {
  const { cameraTarget } = useVaultStore();
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.target.lerp(
        new THREE.Vector3(...cameraTarget),
        0.05
      );
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={3.2}
      maxDistance={11.0}
      minPolarAngle={Math.PI / 4.5}
      maxPolarAngle={Math.PI / 2 + 0.02}
      autoRotate={false}
      target={[0, 0, 0]}
    />
  );
};

export const VaultScene: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#0a090b] cursor-grab active:cursor-grabbing select-none overflow-hidden">
      <ThreeErrorBoundary>
        <Canvas
          shadows={false}
          dpr={[1, 1.75]}
          camera={{ position: [0, 2.2, 7.8], fov: 42 }}
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
            alpha: false,
          }}
        >
          {/* Deep Void Ambient Background Color */}
          <color attach="background" args={['#0c0b0e']} />
          <fog attach="fog" args={['#0c0b0e', 7.5, 18.0]} />

          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 2.2, 7.8]} fov={42} />
            <CameraController />

            {/* ================= LIGHTING SCHEME ================= */}
            {/* Ambient Monastic Fill Light */}
            <ambientLight color="#181520" intensity={0.9} />

            {/* Main Overhead Oculus Sunlight / Spotlight */}
            <spotLight
              position={[0, 5.2, 0]}
              target-position={[0, 0, 0]}
              color="#fff5e6"
              intensity={2.8}
              angle={Math.PI / 4}
              penumbra={0.8}
              distance={14}
            />

            {/* Cyan Cybernetic Accent Light */}
            <pointLight position={[-4.5, 2.5, -3.0]} color="#00f0ff" intensity={1.4} distance={9} />

            {/* Warm Gilded Brass Accent Light */}
            <pointLight position={[4.5, 2.5, 3.0]} color="#ffb700" intensity={1.4} distance={9} />

            {/* ================= 3D ARCHITECTURAL LAYERS ================= */}
            {/* 1. Monolithic Basalt Chamber & Pillars */}
            <BrutalistArchitecture />

            {/* 2. Instanced Archival Stacks (500+ Books, 1 Draw Call) */}
            <ArchivalStacks />

            {/* 3. Holographic Rune Bands & Floating Glyphs */}
            <HolographicRunes color="#00f0ff" radius={3.8} height={1.5} />

            {/* 4. The 7 Personal Relic Volumes on Hexagonal Pedestals */}
            <RelicPedestals />

            {/* 5. Volumetric Atmospheric Particulate Field */}
            <AtmosphericDust count={150} />
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};
