import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeErrorBoundary } from './ThreeErrorBoundary';
import { BrutalistArchitecture } from './BrutalistArchitecture';
import { ArchivalStacks } from './ArchivalStacks';
import { HolographicRunes } from './HolographicRunes';
import { RelicPedestals } from './RelicPedestals';
import { HeroStageBook3D } from './HeroStageBook3D';
import { AtmosphericDust } from './AtmosphericDust';
import { useVaultStore } from '../../store/vaultStore';

// Camera focal glide & WASD walking animation controller
const CameraController: React.FC = () => {
  const {
    cameraTarget,
    cameraPosition,
    walkCamera,
    focusPedestal,
    resetView,
    isReaderOpen,
    isHeroMode,
  } = useVaultStore();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const keysDown = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isReaderOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      keysDown.current[e.key.toLowerCase()] = true;

      // Hotkeys 1-7 for instant pedestal focus
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 7) {
        focusPedestal(num - 1);
      } else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
        resetView();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isReaderOpen, focusPedestal, resetView]);

  useFrame((_, delta) => {
    // 1. WASD / Arrow Key Free-Roam Walking
    if (!isReaderOpen) {
      let forward = 0;
      let strafe = 0;
      const speed = 4.4 * delta;

      if (keysDown.current['w'] || keysDown.current['arrowup']) forward += speed;
      if (keysDown.current['s'] || keysDown.current['arrowdown']) forward -= speed;
      if (keysDown.current['d'] || keysDown.current['arrowright']) strafe += speed;
      if (keysDown.current['a'] || keysDown.current['arrowleft']) strafe -= speed;

      if (forward !== 0 || strafe !== 0) {
        walkCamera(forward, strafe);
      }
    }

    // 2. Smoothly glide camera position & target
    camera.position.lerp(new THREE.Vector3(...cameraPosition), 0.08);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(
        new THREE.Vector3(...cameraTarget),
        0.08
      );
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={isHeroMode ? 1.8 : 0.8}
      maxDistance={14.0}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2 + 0.05}
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
          dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1.5, 1.75)]}
          camera={{ position: [0, 1.45, 3.8], fov: 42 }}
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
            <PerspectiveCamera makeDefault position={[0, 1.45, 3.8]} fov={42} />
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
            {/* 1. Honed Travertine & Carrara Marble Chamber with Click-to-Walk */}
            <BrutalistArchitecture />

            {/* 2. Instanced Archival Stacks (500+ Books, 1 Draw Call) */}
            <ArchivalStacks />

            {/* 3. Radiant Gilded Rune Bands & Floating Glyphs */}
            <HolographicRunes color="#9a7322" radius={3.8} height={1.5} />

            {/* 4. The 7 Personal Relic Volumes on Travertine Pedestals */}
            <RelicPedestals />

            {/* 5. 3D Book Reveal Hero Turntable Stage */}
            <HeroStageBook3D />

            {/* 6. Golden Sunbeam Mote Particulates */}
            <AtmosphericDust count={120} />
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};
