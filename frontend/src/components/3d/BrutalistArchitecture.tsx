import React, { useMemo } from 'react';
import * as THREE from 'three';

export const BrutalistArchitecture: React.FC = () => {
  // PBR materials for basalt stone, brass trims, and dark obsidian
  const {
    basaltMat,
    darkStoneMat,
    brassTrimMat,
    oculusLightMat,
    conduitGlowMat,
  } = useMemo(() => {
    return {
      basaltMat: new THREE.MeshStandardMaterial({
        color: '#131215',
        roughness: 0.88,
        metalness: 0.12,
      }),
      darkStoneMat: new THREE.MeshStandardMaterial({
        color: '#0c0b0e',
        roughness: 0.92,
        metalness: 0.08,
      }),
      brassTrimMat: new THREE.MeshStandardMaterial({
        color: '#8a6e32',
        roughness: 0.38,
        metalness: 0.82,
      }),
      oculusLightMat: new THREE.MeshBasicMaterial({
        color: '#c5e3f6',
        transparent: true,
        opacity: 0.45,
      }),
      conduitGlowMat: new THREE.MeshBasicMaterial({
        color: '#00f0ff',
        transparent: true,
        opacity: 0.35,
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
      {/* Base Foundation Ground */}
      <mesh position={[0, -1.8, 0]} receiveShadow material={darkStoneMat}>
        <cylinderGeometry args={[18, 20, 0.6, 32]} />
      </mesh>

      {/* Stepped Octagonal Central Dais */}
      <mesh position={[0, -1.45, 0]} receiveShadow material={basaltMat}>
        <cylinderGeometry args={[5.2, 5.6, 0.4, 8]} />
      </mesh>
      
      {/* Brass Inlay Ring on Dais Edge */}
      <mesh position={[0, -1.24, 0]} rotation={[-Math.PI / 2, 0, 0]} material={brassTrimMat}>
        <ringGeometry args={[4.95, 5.08, 32]} />
      </mesh>

      {/* Cybernetic Energy Conduits in Floor */}
      <mesh position={[0, -1.23, 0]} rotation={[-Math.PI / 2, 0, 0]} material={conduitGlowMat}>
        <ringGeometry args={[3.45, 3.52, 32]} />
      </mesh>

      {/* Radial Floor Inlay Lines */}
      {pillars.map((p, idx) => (
        <group key={`radial-conduit-${idx}`} rotation={[0, -p.rotation, 0]}>
          <mesh position={[0, -1.23, 2.5]} material={conduitGlowMat}>
            <boxGeometry args={[0.04, 0.01, 1.8]} />
          </mesh>
        </group>
      ))}

      {/* ================= COLOSSAL BASALT PILLARS ================= */}
      {pillars.map((p, idx) => (
        <group key={`pillar-${idx}`} position={[p.x, 1.2, p.z]} rotation={[0, p.rotation, 0]}>
          {/* Main Pillar Shaft (Tapered Brutalist Monolith) */}
          <mesh castShadow receiveShadow material={basaltMat}>
            <boxGeometry args={[0.9, 5.4, 0.9]} />
          </mesh>

          {/* Recessed Brass Channel with Rune Conduit */}
          <mesh position={[0, 0, 0.46]} material={brassTrimMat}>
            <boxGeometry args={[0.16, 5.2, 0.04]} />
          </mesh>
          <mesh position={[0, 0, 0.48]} material={conduitGlowMat}>
            <boxGeometry args={[0.06, 4.8, 0.02]} />
          </mesh>

          {/* Pillar Capital Arch Tracery */}
          <mesh position={[0, 2.8, 0]} material={darkStoneMat}>
            <boxGeometry args={[1.3, 0.4, 1.3]} />
          </mesh>
        </group>
      ))}

      {/* ================= VAULTED CEILING & LIGHT OCULUS ================= */}
      {/* Monolithic Overhead Vault Ribs */}
      {pillars.map((p, idx) => (
        <group key={`rib-${idx}`} position={[p.x * 0.5, 4.3, p.z * 0.5]} rotation={[0, p.rotation, 0]}>
          <mesh material={basaltMat}>
            <boxGeometry args={[0.45, 0.35, 3.8]} />
          </mesh>
        </group>
      ))}

      {/* Central Vault Ceiling Dome / Cap */}
      <mesh position={[0, 4.6, 0]} material={darkStoneMat}>
        <cylinderGeometry args={[2.8, 4.2, 0.5, 16]} />
      </mesh>

      {/* Central Celestial Oculus (Light Shaft Well) */}
      <mesh position={[0, 4.88, 0]} rotation={[-Math.PI / 2, 0, 0]} material={oculusLightMat}>
        <circleGeometry args={[1.4, 24]} />
      </mesh>

      {/* Diagonal Volumetric Light Shaft simulation */}
      <mesh position={[0, 1.8, 0]} material={oculusLightMat}>
        <cylinderGeometry args={[1.4, 3.8, 5.8, 24, 1, true]} />
      </mesh>

      {/* ================= PERIMETER ENCLOSING WALLS ================= */}
      {/* Octagonal Outer Brutalist Chamber Shell */}
      <mesh position={[0, 3.0, 0]} receiveShadow material={darkStoneMat}>
        <cylinderGeometry args={[10.5, 11.2, 9.2, 8, 1, true]} />
      </mesh>

      {/* Heavy Perimeter Base Trim */}
      <mesh position={[0, -0.9, 0]} material={basaltMat}>
        <cylinderGeometry args={[10.1, 10.4, 1.2, 8, 1, true]} />
      </mesh>
    </group>
  );
};
