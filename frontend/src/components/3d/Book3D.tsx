import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Book } from '../../types';

interface Book3DProps {
  book: Book;
  index: number;
  carouselOffset: number;
  totalBooks: number;
  isSelected: boolean;
  isInspecting: boolean;
  isCoverOpen: boolean;
  onSelect: () => void;
  onOpenCover: () => void;
}

export const Book3D: React.FC<Book3DProps> = ({
  book,
  index,
  carouselOffset,
  totalBooks,
  isSelected,
  isInspecting,
  isCoverOpen,
  onSelect,
  onOpenCover,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const frontHingeRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  const width = book.dimensions?.width || 1.5;
  const height = book.dimensions?.height || 2.2;
  const depth = book.dimensions?.depth || 0.4;
  const boardThickness = 0.04;
  const squareExtension = 0.04;

  // Lightweight 256x384 canvas texture generation
  const { frontCoverTex, spineTex } = useMemo(() => {
    try {
      // 1. Front Cover Texture (256x384 - Ultra Fast & GPU Friendly)
      const fcCanvas = document.createElement('canvas');
      fcCanvas.width = 256;
      fcCanvas.height = 384;
      const fctx = fcCanvas.getContext('2d');
      
      if (fctx) {
        fctx.fillStyle = book.cloth_color || '#1a2238';
        fctx.fillRect(0, 0, 256, 384);

        // Gold border
        fctx.strokeStyle = book.foil_color || '#d4af37';
        fctx.lineWidth = 2;
        fctx.strokeRect(20, 20, 216, 344);

        // Title
        fctx.fillStyle = book.foil_color || '#d4af37';
        fctx.font = 'bold 20px serif';
        fctx.textAlign = 'center';
        fctx.fillText(book.title.slice(0, 18), 128, 160);

        // Author
        fctx.font = 'italic 14px serif';
        fctx.fillStyle = '#ffffff';
        fctx.fillText(book.author || 'Author', 128, 200);
      }

      // 2. Spine Texture (64x384)
      const spCanvas = document.createElement('canvas');
      spCanvas.width = 64;
      spCanvas.height = 384;
      const sctx = spCanvas.getContext('2d');
      if (sctx) {
        sctx.fillStyle = book.cloth_color || '#1a2238';
        sctx.fillRect(0, 0, 64, 384);
        sctx.save();
        sctx.translate(32, 192);
        sctx.rotate(Math.PI / 2);
        sctx.font = 'bold 14px serif';
        sctx.fillStyle = book.foil_color || '#d4af37';
        sctx.textAlign = 'center';
        sctx.fillText(book.title.slice(0, 22), 0, 5);
        sctx.restore();
      }

      return {
        frontCoverTex: new THREE.CanvasTexture(fcCanvas),
        spineTex: new THREE.CanvasTexture(spCanvas),
      };
    } catch {
      return {
        frontCoverTex: null,
        spineTex: null,
      };
    }
  }, [book]);

  useFrame(() => {
    if (!groupRef.current) return;

    if (!isInspecting) {
      // Calculate carousel relative position
      let rel = ((index - carouselOffset) % totalBooks + totalBooks) % totalBooks;
      if (rel > totalBooks / 2) rel -= totalBooks;

      const targetX = rel * 1.85;
      const targetZ = -Math.pow(Math.abs(rel), 1.6) * 0.28;
      const targetRotY = -rel * 0.12 + Math.PI / 2;
      const targetY = isSelected ? 1.2 : 1.1;

      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.14;
      groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.14;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.14;
      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.14;
      groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * 0.14;
    } else if (isSelected) {
      // Inspecting pose in front of camera
      const targetPos = new THREE.Vector3(-0.4, 1.25, 0);
      const targetRot = new THREE.Euler(0.2, -0.35, 0);

      groupRef.current.position.lerp(targetPos, 0.1);
      groupRef.current.rotation.x += (targetRot.x - groupRef.current.rotation.x) * 0.1;
      groupRef.current.rotation.y += (targetRot.y - groupRef.current.rotation.y) * 0.1;
      groupRef.current.rotation.z += (targetRot.z - groupRef.current.rotation.z) * 0.1;

      // Animate front cover opening
      if (frontHingeRef.current) {
        const targetAngle = isCoverOpen ? Math.PI : isHovered ? 0.18 : 0;
        frontHingeRef.current.rotation.y += (targetAngle - frontHingeRef.current.rotation.y) * 0.15;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        if (isInspecting && isSelected) {
          onOpenCover();
        } else {
          onSelect();
        }
      }}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {/* Spine */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[boardThickness, height, depth]} />
        <meshStandardMaterial
          map={spineTex || undefined}
          roughness={0.4}
          metalness={0.2}
          color={book.cloth_color}
        />
      </mesh>

      {/* Page Block */}
      <mesh position={[width / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry
          args={[
            width - squareExtension * 2,
            height - squareExtension * 2,
            depth - boardThickness * 2,
          ]}
        />
        <meshStandardMaterial color="#f0e6d6" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Back Cover Board */}
      <mesh position={[width / 2, 0, -depth / 2 + boardThickness / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height, boardThickness]} />
        <meshStandardMaterial
          roughness={0.35}
          metalness={0.2}
          color={book.cloth_color}
        />
      </mesh>

      {/* Front Hinge & Cover Board */}
      <group ref={frontHingeRef} position={[0, 0, depth / 2 - boardThickness / 2]}>
        <mesh position={[width / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, boardThickness]} />
          <meshStandardMaterial
            map={frontCoverTex || undefined}
            roughness={0.35}
            metalness={0.2}
            color={book.cloth_color}
          />
        </mesh>
      </group>
    </group>
  );
};
