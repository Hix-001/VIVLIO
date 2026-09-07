import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

interface InstancedBookshelfProps {
  tiers?: number;
  booksPerTier?: number;
}

export const InstancedBookshelf: React.FC<InstancedBookshelfProps> = ({
  tiers = 4,
  booksPerTier = 60,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Antique leather & cloth palette
  const palette = useMemo(() => [
    new THREE.Color('#381319'), // Deep oxblood / burgundy
    new THREE.Color('#141d2e'), // Midnight navy
    new THREE.Color('#16291e'), // Dark forest green
    new THREE.Color('#321f14'), // Aged walnut
    new THREE.Color('#422718'), // Antique calfskin
    new THREE.Color('#211b18'), // Dark charcoal leather
    new THREE.Color('#54391e'), // Warm tobacco leather
    new THREE.Color('#694d26'), // Gilded amber
    new THREE.Color('#1e222a'), // Prussian slate
    new THREE.Color('#3d1e28'), // Imperial plum
  ], []);

  // Compute shelf configurations and total books
  const { totalBooks, matrices, colors, shelves } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matList: THREE.Matrix4[] = [];
    const colList: THREE.Color[] = [];
    const shelfGeoms: { position: [number, number, number]; size: [number, number, number] }[] = [];

    // 4 vertical tiers: y from -0.6 up to 3.3
    const tierHeights = [-0.5, 0.75, 2.0, 3.25];
    const shelfWidth = 19.0;
    const zPos = -3.2;

    tierHeights.forEach((yPos) => {
      // Add wood plank shelf
      shelfGeoms.push({
        position: [0, yPos - 0.05, zPos + 0.1],
        size: [shelfWidth, 0.06, 0.45],
      });

      // Populate shelf with books (with gaps for columns/torches)
      let currentX = -shelfWidth / 2 + 0.3;
      while (currentX < shelfWidth / 2 - 0.3) {
        // Leave gaps near torches/columns
        const nearPillar = Math.abs(currentX - 0) < 0.8 ||
                           Math.abs(currentX - (-3.5)) < 0.6 ||
                           Math.abs(currentX - 3.5) < 0.6 ||
                           Math.abs(currentX - (-7.0)) < 0.6 ||
                           Math.abs(currentX - 7.0) < 0.6;

        const bookWidth = 0.08 + Math.random() * 0.07;
        const bookHeight = 0.7 + Math.random() * 0.25;
        const bookDepth = 0.32 + Math.random() * 0.06;

        if (!nearPillar) {
          // Subtle natural tilt for some books
          const tilt = Math.random() > 0.88 ? (Math.random() - 0.5) * 0.15 : 0;

          dummy.position.set(currentX, yPos + bookHeight / 2, zPos + bookDepth / 2);
          dummy.rotation.set(0, 0, tilt);
          dummy.scale.set(bookWidth, bookHeight, bookDepth);
          dummy.updateMatrix();

          matList.push(dummy.matrix.clone());
          colList.push(palette[Math.floor(Math.random() * palette.length)]);
        }

        currentX += bookWidth + 0.012;
      }
    });

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
      {/* Wooden Shelf Planks */}
      {shelves.map((s, idx) => (
        <mesh key={`shelf-plank-${idx}`} position={s.position} receiveShadow>
          <boxGeometry args={s.size} />
          <meshStandardMaterial color="#211812" roughness={0.75} metalness={0.08} />
        </mesh>
      ))}

      {/* Thousands of Books rendered in 1 single GPU draw call */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, totalBooks]}
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.82} metalness={0.08} />
      </instancedMesh>
    </group>
  );
};
