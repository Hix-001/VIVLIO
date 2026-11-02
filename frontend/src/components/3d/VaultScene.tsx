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
    <div className="absolute inset-0 w-full h-full bg-[#f5f2eb] cursor-grab active:cursor-grabbing select-none overflow-hidden">
      <ThreeErrorBoundary>
        <Canvas
          shadows={false}
          dpr={[1.5, 2]}
          camera={{ position: [0, 2.2, 7.8], fov: 42 }}
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
            alpha: false,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
        >
          {/* Luminous Architectural Daylight Background & Depth Fog */}
          <color attach="background" args={['#f5f2eb']} />
          <fog attach="fog" args={['#f5f2eb', 9.0, 24.0]} />

          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 2.2, 7.8]} fov={42} />
            <CameraController />

            {/* ================= SUNLIT ILLUMINATION SCHEME ================= */}
            {/* 1. Soft Sky Blue Atmospheric Fill */}
            <ambientLight color="#f0f6fc" intensity={1.6} />

            {/* 2. Main Overhead Oculus Sunlight */}
            <spotLight
              position={[0, 7.5, 0]}
              target-position={[0, 0, 0]}
              color="#fff9ee"
              intensity={3.2}
              angle={Math.PI / 3.5}
              penumbra={0.75}
              distance={20}
            />

            {/* 3. Golden Angled Sunbeam */}
            <directionalLight
              position={[4, 8, 5]}
              color="#fff3dc"
              intensity={2.2}
            />

            {/* 4. Champagne Warm Architectural Bounce Lights */}
            <pointLight position={[-4.5, 3.0, -3.0]} color="#edd5a4" intensity={1.6} distance={14} />
            <pointLight position={[4.5, 2.5, 3.0]} color="#f2e2be" intensity={1.4} distance={14} />

            {/* ================= 3D ARCHITECTURAL LAYERS ================= */}
            {/* 1. Honed Travertine & Carrara Marble Chamber */}
            <BrutalistArchitecture />

            {/* 2. Instanced Archival Stacks (500+ Books, 1 Draw Call) */}
            <ArchivalStacks />

            {/* 3. Radiant Gilded Rune Bands & Floating Glyphs */}
            <HolographicRunes color="#9a7322" radius={3.8} height={1.5} />

            {/* 4. The 7 Personal Relic Volumes on Travertine Pedestals */}
            <RelicPedestals />

            {/* 5. Golden Sunbeam Mote Particulates */}
            <AtmosphericDust count={150} />
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

