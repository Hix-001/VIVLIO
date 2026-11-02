import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVaultStore } from '../../store/vaultStore';

export const HeroStageBook3D: React.FC = () => {
  const { books, featuredHeroBookId, isHeroMode, openReader } = useVaultStore();
  const book = useMemo(() => {
    return books.find((b) => b.id === featuredHeroBookId) || books[0];
  }, [books, featuredHeroBookId]);

  const groupRef = useRef<THREE.Group>(null);
  const bookMeshRef = useRef<THREE.Group>(null);
  const [coverTexture, setCoverTexture] = useState<THREE.Texture | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const width = 1.25;
  const height = 1.75;
  const depth = 0.28;
  const boardThickness = 0.032;

  // Load high-resolution texture with memory disposal
  useEffect(() => {
    let active = true;
    let loadedTex: THREE.Texture | null = null;

    if (book.coverImage) {
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = 'anonymous';
      loader.load(
        book.coverImage,
        (tex) => {
          if (!active) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 8;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          loadedTex = tex;
          setCoverTexture(tex);
        },
        undefined,
        () => {
          if (active) setCoverTexture(null);
        }
      );
    }

    return () => {
      active = false;
      if (loadedTex) {
        loadedTex.dispose();
      }
    };
  }, [book.coverImage]);

  // Procedural fallback canvas texture if cover art unavailable
  const fallbackCoverTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 460;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = book.clothColor;
      ctx.fillRect(0, 0, 320, 460);

      ctx.strokeStyle = book.foilColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 280, 420);

      ctx.fillStyle = book.foilColor;
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(book.runeGlyph, 160, 60);

      ctx.font = 'bold 22px serif';
      ctx.fillText(book.title.slice(0, 20), 160, 200);

      ctx.font = 'italic 16px serif';
      ctx.fillStyle = '#f2e8dc';
      ctx.fillText(book.author, 160, 240);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, [book]);

  useFrame((_, delta) => {
    if (!groupRef.current || !bookMeshRef.current) return;

    // Smooth entry / exit fade
    const targetScale = isHeroMode ? 1.0 : 0.001;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    if (isHeroMode) {
      // Elegant turntable continuous rotation & breathing hover
      const time = Date.now() * 0.0012;
      bookMeshRef.current.rotation.y += delta * 0.35;
      bookMeshRef.current.position.y = 0.85 + Math.sin(time) * 0.06;
      bookMeshRef.current.rotation.z = Math.sin(time * 0.8) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Illuminated Turntable Plinth */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.3, 32]} />
        <meshStandardMaterial
          color="#f6f4ee"
          roughness={0.45}
          metalness={0.1}
        />
      </mesh>

      {/* Champagne Gold Rotating Collar */}
      <mesh position={[0, -0.48, 0]}>
        <cylinderGeometry args={[1.22, 1.22, 0.06, 32]} />
        <meshStandardMaterial
          color="#c8a148"
          roughness={0.25}
          metalness={0.88}
        />
      </mesh>

      {/* Radiant Floor Inlay Light Halo */}
      <mesh position={[0, -0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 1.15, 48]} />
        <meshBasicMaterial
          color={book.accentHue || '#c8a148'}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating Rotating Hero Codex */}
      <group
        ref={bookMeshRef}
        position={[0, 0.85, 0]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          e.stopPropagation();
          openReader(book);
        }}
      >
        {/* Spine */}
        <mesh position={[-width / 2, 0, 0]} castShadow>
          <boxGeometry args={[boardThickness, height, depth]} />
          <meshStandardMaterial
            color={book.clothColor}
            roughness={0.35}
            metalness={0.2}
          />
        </mesh>

        {/* Gilded Page Block */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[width - 0.05, height - 0.05, depth - boardThickness * 2]} />
          <meshStandardMaterial
            color="#f7f1e1"
            roughness={0.65}
            metalness={0.25}
          />
        </mesh>

        {/* Back Cover */}
        <mesh position={[0, 0, -depth / 2 + boardThickness / 2]} castShadow>
          <boxGeometry args={[width, height, boardThickness]} />
          <meshStandardMaterial
            color={book.clothColor}
            roughness={0.35}
            metalness={0.2}
          />
        </mesh>

        {/* Front Cover with Artwork */}
        <mesh position={[0, 0, depth / 2 - boardThickness / 2]} castShadow>
          <boxGeometry args={[width, height, boardThickness]} />
          <meshStandardMaterial
            map={coverTexture || fallbackCoverTex}
            color={coverTexture ? '#ffffff' : book.clothColor}
            roughness={0.3}
            metalness={coverTexture ? 0.08 : 0.4}
          />
        </mesh>

        {/* Hover Radiant Pulse Halo */}
        {isHovered && (
          <mesh position={[0, -height / 2 - 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.7, 0.95, 36]} />
            <meshBasicMaterial
              color={book.accentHue}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};

