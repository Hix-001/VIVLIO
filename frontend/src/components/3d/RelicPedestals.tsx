import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useVaultStore, getPedestalTransform } from '../../store/vaultStore';
import { RelicBook3D } from './RelicBook3D';

export const RelicPedestals: React.FC = () => {
  const { books, activeBookId, selectedCategory, focusPedestal } = useVaultStore();

  const count = books.length; // 7 books

  // Compute positions of the 7 pedestals in an arc / circle
  const pedestalNodes = useMemo(() => {
    return books.map((book, i) => {
      const { x, z, rotY } = getPedestalTransform(i, count);
      return {
        book,
        index: i,
        x,
        z,
        rotY,
      };
    });
  }, [books, count]);

  // Materials for the pedestals in Light Mode (Travertine, Carrara Marble, Champagne Gold)
  const { pedestalMat, marbleMat, brassMat } = useMemo(() => {
    return {
      pedestalMat: new THREE.MeshStandardMaterial({
        color: '#ebe6dd', // Honed Roman travertine
        roughness: 0.82,
        metalness: 0.04,
      }),
      marbleMat: new THREE.MeshStandardMaterial({
        color: '#f6f4ee', // Polished Carrara marble
        roughness: 0.62,
        metalness: 0.08,
      }),
      brassMat: new THREE.MeshStandardMaterial({
        color: '#c8a148', // Brushed champagne gold
        roughness: 0.35,
        metalness: 0.85,
      }),
    };
  }, []);

  return (
    <group>
      {pedestalNodes.map(({ book, index, x, z, rotY }) => {
        const isSelected = activeBookId === book.id;
        const matchesCategory =
          selectedCategory === 'All' || book.category === selectedCategory;

        return (
          <group key={book.id} position={[x, -0.7, z]} rotation={[0, rotY, 0]}>
            {/* Hexagonal Travertine Plinth Base */}
            <mesh position={[0, -0.4, 0]} receiveShadow material={pedestalMat}>
              <cylinderGeometry args={[0.7, 0.85, 0.4, 6]} />
            </mesh>

            {/* Stepped Upper Column in Polished Carrara Marble */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow material={marbleMat}>
              <cylinderGeometry args={[0.55, 0.65, 0.5, 6]} />
            </mesh>

            {/* Champagne Gold Trim Collar */}
            <mesh position={[0, 0.28, 0]} material={brassMat}>
              <cylinderGeometry args={[0.58, 0.58, 0.06, 6]} />
            </mesh>

            {/* Radiant Altar Pad on Pedestal Top */}
            <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.2, 0.5, 6]} />
              <meshBasicMaterial
                color={matchesCategory ? book.accentHue : '#d5cfc5'}
                transparent
                opacity={matchesCategory ? 0.9 : 0.3}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Interactive Floor Waypoint Beacon (Click to walk directly here) */}
            <mesh
              position={[0, -0.68, 1.1]}
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                focusPedestal(index);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'default';
              }}
            >
              <ringGeometry args={[0.18, 0.3, 32]} />
              <meshBasicMaterial
                color={isSelected ? '#c59b27' : '#d2c8b8'}
                transparent
                opacity={isSelected ? 0.95 : 0.45}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Interactive 3D Book Volume */}
            <RelicBook3D
              book={book}
              index={index}
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

