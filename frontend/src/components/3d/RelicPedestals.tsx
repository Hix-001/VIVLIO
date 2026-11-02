import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useVaultStore } from '../../store/vaultStore';
import { RelicBook3D } from './RelicBook3D';

export const RelicPedestals: React.FC = () => {
  const { books, activeBookId, selectedCategory } = useVaultStore();

  const pedestalRadius = 3.6;
  const count = books.length; // 7 books

  // Compute positions of the 7 pedestals in an arc / circle
  const pedestalNodes = useMemo(() => {
    return books.map((book, i) => {
      // Place across front-facing arc so camera has a natural view
      const angle = ((i - (count - 1) / 2) / count) * (Math.PI * 1.25) + Math.PI / 2;
      const x = Math.cos(angle) * pedestalRadius;
      const z = Math.sin(angle) * pedestalRadius;
      const rotY = -angle + Math.PI / 2;

      return {
        book,
        x,
        z,
        rotY,
      };
    });
  }, [books, count, pedestalRadius]);

  // Materials for the pedestals
  const { pedestalMat, brassMat, baseRingMat } = useMemo(() => {
    return {
      pedestalMat: new THREE.MeshStandardMaterial({
        color: '#121115',
        roughness: 0.85,
        metalness: 0.15,
      }),
      brassMat: new THREE.MeshStandardMaterial({
        color: '#c59b27',
        roughness: 0.35,
        metalness: 0.85,
      }),
      baseRingMat: new THREE.MeshBasicMaterial({
        color: '#00f0ff',
        transparent: true,
        opacity: 0.45,
      }),
    };
  }, []);

  return (
    <group>
      {pedestalNodes.map(({ book, x, z, rotY }) => {
        const isSelected = activeBookId === book.id;
        const matchesCategory =
          selectedCategory === 'All' || book.category === selectedCategory;

        return (
          <group key={book.id} position={[x, -0.7, z]} rotation={[0, rotY, 0]}>
            {/* Hexagonal Basalt Plinth Base */}
            <mesh position={[0, -0.4, 0]} receiveShadow material={pedestalMat}>
              <cylinderGeometry args={[0.7, 0.85, 0.4, 6]} />
            </mesh>

            {/* Stepped Upper Column */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow material={pedestalMat}>
              <cylinderGeometry args={[0.55, 0.65, 0.5, 6]} />
            </mesh>

            {/* Brass Trim Collar */}
            <mesh position={[0, 0.28, 0]} material={brassMat}>
              <cylinderGeometry args={[0.58, 0.58, 0.06, 6]} />
            </mesh>

            {/* Glowing Rune Altar Pad on Pedestal Top */}
            <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.2, 0.5, 6]} />
              <meshBasicMaterial
                color={matchesCategory ? book.accentHue : '#44403c'}
                transparent
                opacity={matchesCategory ? 0.85 : 0.25}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Interactive 3D Book Volume */}
            <RelicBook3D
              book={book}
              position={[0, 1.1, 0]}
              rotation={[-0.15, 0, 0]} // Slight back-tilt like an altar lectern
              isSelected={isSelected}
            />
          </group>
        );
      })}
    </group>
  );
};
