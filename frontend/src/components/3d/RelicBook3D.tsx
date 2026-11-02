import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { VaultBook, useVaultStore } from '../../store/vaultStore';
import { sounds } from '../../lib/sound';

interface RelicBook3DProps {
  book: VaultBook;
  index: number;
  position: [number, number, number];
  rotation: [number, number, number];
  isSelected: boolean;
}

export const RelicBook3D: React.FC<RelicBook3DProps> = ({
  book,
  index,
  position,
  rotation,
  isSelected,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [coverTexture, setCoverTexture] = useState<THREE.Texture | null>(null);

  const { focusPedestal, setInspectedBook, openReader } = useVaultStore();

  const width = 0.95;
  const height = 1.35;
  const depth = 0.22;
  const boardThickness = 0.025;

  // Load cover art texture with high-fidelity anisotropic filtering
  useEffect(() => {
    if (book.coverImage) {
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = 'anonymous';
      loader.load(
        book.coverImage,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 8;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
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
    const targetY = position[1] + (isHovered || isSelected ? 0.18 : 0);
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
        focusPedestal(index);
        sounds.playTactileClick();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        openReader(book);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        sounds.playTactileClick();
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

      {/* Under-Pedestal Radiant Ring when Hovered / Selected */}
      {(isHovered || isSelected) && (
        <mesh position={[0, -height / 2 - 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.75, 48]} />
          <meshBasicMaterial
            color={book.accentHue}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Floating 3D Interactive Lectern Tooltip Card */}
      {(isHovered || isSelected) && (
        <Html
          position={[0, height / 2 + 0.38, 0]}
          center
          distanceFactor={6.5}
          className="pointer-events-auto select-none"
        >
          <div className="bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-2xl rounded-2xl p-3.5 min-w-[210px] text-center transform -translate-y-2 transition-all animate-fade-in">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c59b27] font-bold block mb-1">
              Vol. {index + 1} &middot; {book.category}
            </span>
            <h3 className="font-serif text-sm font-semibold text-stone-900 leading-snug line-clamp-1">
              {book.title}
            </h3>
            <p className="font-serif italic text-xs text-stone-600 mb-2.5">
              {book.author}
            </p>
            <div className="flex items-center justify-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openReader(book);
                }}
                className="px-3 py-1 rounded-full bg-[#c59b27] hover:bg-[#d8ab32] text-stone-950 font-bold font-mono text-[11px] uppercase tracking-wider transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <span>Read Online</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setInspectedBook(book);
                }}
                className="px-2.5 py-1 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer"
              >
                Inspect
              </button>
            </div>
            <span className="text-[9px] font-mono text-stone-400 block mt-1.5">
              (Double-click book to read)
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};

