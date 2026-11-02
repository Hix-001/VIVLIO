import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useVaultStore } from '../../store/vaultStore';

export const BrutalistArchitecture: React.FC = () => {
  const { walkToFloorPoint, clickWaypoint } = useVaultStore();

  // PBR materials for Sunlit Travertine, White Marble, and Champagne Gold
  const {
    travertineMat,
    whiteMarbleMat,
    champagneBrassMat,
    oculusLightMat,
    inlayGoldMat,
    lampGlowMat,
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
      lampGlowMat: new THREE.MeshBasicMaterial({
        color: '#ffeaad',
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

  // 4 Perimeter Study Tables in the outer gallery
  const studyTables = useMemo(() => {
    const radius = 8.5;
    return [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((angle) => ({
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      rotY: -angle + Math.PI / 2,
    }));
  }, []);

  return (
    <group>
      {/* ================= FLOOR & PEDESTAL TIERS ================= */}
      {/* Base Foundation Ground (Honed Travertine) - Interactive Click-to-Walk */}
      <mesh
        position={[0, -1.8, 0]}
        receiveShadow
        material={travertineMat}
        onPointerDown={(e) => {
          e.stopPropagation();
          walkToFloorPoint([e.point.x, -1.2, e.point.z]);
        }}
      >
        <cylinderGeometry args={[18, 20, 0.6, 32]} />
      </mesh>

      {/* Stepped Octagonal Central Dais (Greek White Marble) */}
      <mesh
        position={[0, -1.45, 0]}
        receiveShadow
        material={whiteMarbleMat}
        onPointerDown={(e) => {
          e.stopPropagation();
          walkToFloorPoint([e.point.x, -1.2, e.point.z]);
        }}
      >
        <cylinderGeometry args={[5.2, 5.6, 0.4, 8]} />
      </mesh>

      {/* Dynamic Click-to-Walk Floor Beacon Waypoint */}
      {clickWaypoint && (
        <group position={[clickWaypoint[0], -1.22, clickWaypoint[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.2, 0.45, 32]} />
            <meshBasicMaterial color="#c8a148" transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.55, 0.65, 32]} />
            <meshBasicMaterial color="#c8a148" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

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

      {/* ================= STUDY ALCOVES & READING LECTERNS ================= */}
      {studyTables.map((t, idx) => (
        <group key={`study-table-${idx}`} position={[t.x, -0.7, t.z]} rotation={[0, t.rotY, 0]}>
          {/* Marble Table Top */}
          <mesh position={[0, 0, 0]} material={whiteMarbleMat}>
            <boxGeometry args={[2.2, 0.1, 0.8]} />
          </mesh>
          {/* Table Legs */}
          <mesh position={[-0.9, -0.4, 0]} material={travertineMat}>
            <boxGeometry args={[0.16, 0.7, 0.6]} />
          </mesh>
          <mesh position={[0.9, -0.4, 0]} material={travertineMat}>
            <boxGeometry args={[0.16, 0.7, 0.6]} />
          </mesh>
          {/* Champagne Brass Table Lamp */}
          <mesh position={[0, 0.35, -0.2]} material={champagneBrassMat}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 12]} />
          </mesh>
          <mesh position={[0, 0.62, -0.2]} material={champagneBrassMat}>
            <cylinderGeometry args={[0.2, 0.28, 0.12, 16]} />
          </mesh>
          <mesh position={[0, 0.58, -0.2]} material={lampGlowMat}>
            <sphereGeometry args={[0.08, 12, 12]} />
          </mesh>
          {/* Warm Study Glow */}
          <pointLight position={[0, 0.55, -0.2]} color="#ffeaad" intensity={0.6} distance={4} />
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

      {/* Diagonal Volumetric Sunbeam Shaft */}
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
