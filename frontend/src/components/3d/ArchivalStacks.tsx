import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

export const ArchivalStacks: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Antique cyber-monastic palette
  const palette = useMemo(() => [
    new THREE.Color('#1f1712'), // Dark weathered leather
    new THREE.Color('#0d1824'), // Deep abyssal navy
    new THREE.Color('#102218'), // Monastic moss/emerald
    new THREE.Color('#2e1218'), // Imperial oxblood
    new THREE.Color('#1a1a1e'), // Obsidian basalt
    new THREE.Color('#382812'), // Gilded calfskin
    new THREE.Color('#141d28'), // Prussian slate
  ], []);

  // Compute positions of books in the alcoves between the 8 perimeter pillars
  const { totalBooks, matrices, colors, shelves } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matList: THREE.Matrix4[] = [];
    const colList: THREE.Color[] = [];
    const shelfGeoms: { position: [number, number, number]; rotation: [number, number, number]; size: [number, number, number] }[] = [];

    const wallRadius = 8.6;
    const alcoveCount = 8;
    const tiers = [-0.6, 0.4, 1.4, 2.4];

    // For each alcove between pillars
    for (let a = 0; a < alcoveCount; a++) {
      const angle = ((a + 0.5) / alcoveCount) * Math.PI * 2;
      const alcoveX = Math.cos(angle) * wallRadius;
      const alcoveZ = Math.sin(angle) * wallRadius;
      const alcoveRotY = -angle + Math.PI / 2;

      tiers.forEach((tierY) => {
        // Wooden/basalt shelf plank
        shelfGeoms.push({
          position: [alcoveX, tierY - 0.05, alcoveZ],
          rotation: [0, alcoveRotY, 0],
          size: [3.4, 0.06, 0.5],
        });

        // Populate row of books on this shelf
        const rowBookCount = 18;
        const rowWidth = 3.0;
        const startOffset = -rowWidth / 2;

        for (let b = 0; b < rowBookCount; b++) {
          const u = b / (rowBookCount - 1);
          const localX = startOffset + u * rowWidth;
          
          const bookW = 0.09 + Math.random() * 0.05;
          const bookH = 0.65 + Math.random() * 0.22;
          const bookD = 0.32 + Math.random() * 0.04;
          const tilt = Math.random() > 0.85 ? (Math.random() - 0.5) * 0.12 : 0;

          // Transform local shelf coords to world space
          dummy.position.set(localX, bookH / 2, 0);
          dummy.rotation.set(0, 0, tilt);
          dummy.scale.set(bookW, bookH, bookD);
          dummy.updateMatrix();

          // Create world matrix
          const worldMat = new THREE.Matrix4();
          worldMat.makeRotationY(alcoveRotY);
          worldMat.setPosition(alcoveX, tierY, alcoveZ);
          worldMat.multiply(dummy.matrix);

          matList.push(worldMat);
          colList.push(palette[Math.floor(Math.random() * palette.length)]);
        }
      });
    }

    return {
      totalBooks: matList.length,
      matrices: matList,
      colors: colList,
      shelves: shelfGeoms,
    };
  }, [palette]);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < totalBooks; i++) {
      meshRef.current.setMatrixAt(i, matrices[i]);
      meshRef.current.setColorAt(i, colors[i]);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [totalBooks, matrices, colors]);

  return (
    <group>
      {/* Basalt Wall Shelf Planks */}
      {shelves.map((s, idx) => (
        <mesh
          key={`archival-shelf-${idx}`}
          position={s.position}
          rotation={s.rotation}
          receiveShadow
        >
          <boxGeometry args={s.size} />
          <meshStandardMaterial color="#1a181c" roughness={0.85} metalness={0.15} />
        </mesh>
      ))}

      {/* Instanced Mesh of 500+ Archival Books (1 Single GPU Draw Call) */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, totalBooks]}
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.75} metalness={0.12} />
      </instancedMesh>
    </group>
  );
};
