import React, { useMemo } from 'react';
import * as THREE from 'three';

export const BrutalistArchitecture: React.FC = () => {
  // PBR materials for Sunlit Travertine, White Marble, and Champagne Gold
  const {
    travertineMat,
    whiteMarbleMat,
    champagneBrassMat,
    oculusLightMat,
    inlayGoldMat,
  } = useMemo(() => {
    return {
      travertineMat: new THREE.MeshStandardMaterial({
        color: '#ebe6dd',
        roughness: 0.85,
        metalness: 0.06,
      }),
      whiteMarbleMat: new THREE.MeshStandardMaterial({
        color: '#f6f4ee',
        roughness: 0.72,
        metalness: 0.04,
      }),
      champagneBrassMat: new THREE.MeshStandardMaterial({
        color: '#c8a148',
        roughness: 0.28,
        metalness: 0.85,
      }),
      oculusLightMat: new THREE.MeshBasicMaterial({
        color: '#fff9ee',
        transparent: true,
        opacity: 0.38,
      }),
      inlayGoldMat: new THREE.MeshBasicMaterial({
        color: '#d4af37',
        transparent: true,
        opacity: 0.45,
      }),
    };
  }, []);

  // 8 Perimeter Monolithic Pillars in circular ring
  const pillarCount = 8;
  const pillarRadius = 6.4;
  const pillars = useMemo(() => {
    return Array.from({ length: pillarCount }).map((_, i) => {
      const angle = (i / pillarCount) * Math.PI * 2;
      return {
        x: Math.cos(angle) * pillarRadius,
        z: Math.sin(angle) * pillarRadius,
        rotation: -angle,
      };
    });
  }, [pillarCount, pillarRadius]);

  return (
    <group>
      {/* ================= FLOOR & PEDESTAL TIERS ================= */}
      {/* Base Foundation Ground (Honed Travertine) */}
      <mesh position={[0, -1.8, 0]} receiveShadow material={travertineMat}>
        <cylinderGeometry args={[18, 20, 0.6, 32]} />
      </mesh>

      {/* Stepped Octagonal Central Dais (Greek White Marble) */}
      <mesh position={[0, -1.45, 0]} receiveShadow material={whiteMarbleMat}>
        <cylinderGeometry args={[5.2, 5.6, 0.4, 8]} />
      </mesh>

      {/* Brushed Champagne Brass Inlay Ring on Dais Edge */}
      <mesh position={[0, -1.24, 0]} rotation={[-Math.PI / 2, 0, 0]} material={champagneBrassMat}>
        <ringGeometry args={[4.95, 5.08, 48]} />
      </mesh>

      {/* Radiant Inlay Conduit Ring in Floor */}
      <mesh position={[0, -1.23, 0]} rotation={[-Math.PI / 2, 0, 0]} material={inlayGoldMat}>
        <ringGeometry args={[3.45, 3.52, 48]} />
      </mesh>

      {/* Radial Floor Inlay Lines */}
      {pillars.map((p, idx) => (
        <group key={`radial-conduit-${idx}`} rotation={[0, -p.rotation, 0]}>
          <mesh position={[0, -1.23, 2.5]} material={inlayGoldMat}>
            <boxGeometry args={[0.04, 0.01, 1.8]} />
          </mesh>
        </group>
      ))}

      {/* ================= COLOSSAL FLUTED LIMESTONE PILLARS ================= */}
      {pillars.map((p, idx) => (
        <group key={`pillar-${idx}`} position={[p.x, 1.2, p.z]} rotation={[0, p.rotation, 0]}>
          {/* Main Pillar Shaft */}
          <mesh castShadow receiveShadow material={travertineMat}>
            <boxGeometry args={[0.92, 5.4, 0.92]} />
          </mesh>

          {/* Recessed Brass Channel with Gold Inlay */}
          <mesh position={[0, 0, 0.47]} material={champagneBrassMat}>
            <boxGeometry args={[0.16, 5.2, 0.04]} />
          </mesh>
          <mesh position={[0, 0, 0.49]} material={inlayGoldMat}>
            <boxGeometry args={[0.06, 4.8, 0.02]} />
          </mesh>

          {/* Pillar Capital Arch Tracery */}
          <mesh position={[0, 2.8, 0]} material={whiteMarbleMat}>
            <boxGeometry args={[1.3, 0.4, 1.3]} />
          </mesh>
        </group>
      ))}

      {/* ================= VAULTED CEILING & SUNLIGHT OCULUS ================= */}
      {/* Monolithic Overhead Vault Ribs */}
      {pillars.map((p, idx) => (
        <group key={`rib-${idx}`} position={[p.x * 0.5, 4.3, p.z * 0.5]} rotation={[0, p.rotation, 0]}>
          <mesh material={travertineMat}>
            <boxGeometry args={[0.45, 0.35, 3.8]} />
          </mesh>
        </group>
      ))}

      {/* Central Vault Ceiling Dome */}
      <mesh position={[0, 4.6, 0]} material={whiteMarbleMat}>
        <cylinderGeometry args={[2.8, 4.2, 0.5, 24]} />
      </mesh>

      {/* Central Celestial Skylight Oculus */}
      <mesh position={[0, 4.88, 0]} rotation={[-Math.PI / 2, 0, 0]} material={oculusLightMat}>
        <circleGeometry args={[1.4, 32]} />
      </mesh>

      {/* Diagonal Volumetric Sunbeam Shaft simulation */}
      <mesh position={[0, 1.8, 0]} material={oculusLightMat}>
        <cylinderGeometry args={[1.4, 3.8, 5.8, 32, 1, true]} />
      </mesh>

      {/* ================= PERIMETER ENCLOSING WALLS ================= */}
      {/* Octagonal Outer Chamber Wall */}
      <mesh position={[0, 3.0, 0]} receiveShadow material={travertineMat}>
        <cylinderGeometry args={[10.5, 11.2, 9.2, 8, 1, true]} />
      </mesh>

      {/* Perimeter Base Marble Trim */}
      <mesh position={[0, -0.9, 0]} material={whiteMarbleMat}>
        <cylinderGeometry args={[10.1, 10.4, 1.2, 8, 1, true]} />
      </mesh>
    </group>
  );
};
