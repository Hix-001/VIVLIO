import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VaultBook, useVaultStore } from '../../store/vaultStore';

interface RelicBook3DProps {
  book: VaultBook;
  position: [number, number, number];
  rotation: [number, number, number];
  isSelected: boolean;
}

export const RelicBook3D: React.FC<RelicBook3DProps> = ({
  book,
  position,
  rotation,
  isSelected,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [coverTexture, setCoverTexture] = useState<THREE.Texture | null>(null);

  const { setActiveBookId, setInspectedBook } = useVaultStore();

  const width = 0.95;
  const height = 1.35;
  const depth = 0.22;
  const boardThickness = 0.025;

  // Load cover art texture
  useEffect(() => {
    if (book.coverImage) {
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = 'anonymous';
      loader.load(
        book.coverImage,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          setCoverTexture(tex);
        },
        undefined,
        () => setCoverTexture(null)
      );
    }
  }, [book.coverImage]);

  // Procedural fallback canvas texture if cover image unavailable
  const fallbackCoverTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = book.clothColor;
      ctx.fillRect(0, 0, 256, 384);

      // Cyber-monastic geometric border
      ctx.strokeStyle = book.foilColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(16, 16, 224, 352);

      // Rune glyph header
      ctx.fillStyle = book.foilColor;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(book.runeGlyph, 128, 48);

      // Book Title
      ctx.font = 'bold 18px serif';
      ctx.fillText(book.title.slice(0, 20), 128, 160);

      // Author
      ctx.font = 'italic 13px serif';
      ctx.fillStyle = '#e6d7c3';
      ctx.fillText(book.author, 128, 195);
    }
    return new THREE.CanvasTexture(canvas);
  }, [book]);

  // Smooth floating / hover animation
  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = position[1] + (isHovered || isSelected ? 0.16 : 0);
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.12;

    // Gentle levitation breathing motion when selected or hovered
    if (isHovered || isSelected) {
      const floatOffset = Math.sin(Date.now() * 0.003) * 0.03;
      groupRef.current.position.y += floatOffset * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        setActiveBookId(book.id);
        setInspectedBook(book);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Book Spine (Tilted upright facing slightly forward) */}
      <mesh position={[-width / 2, 0, 0]} castShadow>
        <boxGeometry args={[boardThickness, height, depth]} />
        <meshStandardMaterial
          color={book.clothColor}
          roughness={0.4}
          metalness={0.25}
        />
      </mesh>

      {/* Pages Block with Gilded Edges */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[width - 0.04, height - 0.04, depth - boardThickness * 2]} />
        <meshStandardMaterial
          color="#f4ecd8"
          roughness={0.75}
          metalness={0.15}
        />
      </mesh>

      {/* Back Cover Board */}
      <mesh position={[0, 0, -depth / 2 + boardThickness / 2]} castShadow>
        <boxGeometry args={[width, height, boardThickness]} />
        <meshStandardMaterial
          color={book.clothColor}
          roughness={0.4}
          metalness={0.25}
        />
      </mesh>

      {/* Front Cover Board with Artwork */}
      <mesh position={[0, 0, depth / 2 - boardThickness / 2]} castShadow>
        <boxGeometry args={[width, height, boardThickness]} />
        <meshStandardMaterial
          map={coverTexture || fallbackCoverTex}
          color={coverTexture ? '#ffffff' : book.clothColor}
          roughness={0.35}
          metalness={coverTexture ? 0.05 : 0.4}
        />
      </mesh>

      {/* Holographic Under-Pedestal Halo when Hovered / Selected */}
      {(isHovered || isSelected) && (
        <mesh position={[0, -height / 2 - 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.75, 32]} />
          <meshBasicMaterial
            color={book.accentHue}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};
