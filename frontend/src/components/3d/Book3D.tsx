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

  // Generate procedural cover and spine textures
  const { frontCoverTex, spineTex, backCoverTex, pageEdgeTex } = useMemo(() => {
    // 1. Front Cover Texture
    const fcCanvas = document.createElement('canvas');
    fcCanvas.width = 1024;
    fcCanvas.height = 1536;
    const fctx = fcCanvas.getContext('2d')!;
    
    fctx.fillStyle = book.cloth_color || '#1a2238';
    fctx.fillRect(0, 0, 1024, 1536);

    // Subtle vignette
    const vig = fctx.createRadialGradient(512, 768, 200, 512, 768, 800);
    vig.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
    vig.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
    fctx.fillStyle = vig;
    fctx.fillRect(0, 0, 1024, 1536);

    // Foil Frame & Details
    fctx.strokeStyle = book.foil_color || '#d4af37';
    fctx.lineWidth = 3;
    fctx.strokeRect(100, 100, 824, 1336);
    fctx.lineWidth = 1;
    fctx.strokeRect(116, 116, 792, 1304);

    fctx.fillStyle = book.foil_color || '#d4af37';
    fctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    fctx.textAlign = 'center';
    fctx.fillText('THE COMPLETE SHELF · ARCHIVAL EDITION', 512, 220);

    // Central geometric motif
    fctx.lineWidth = 2.5;
    for (let r = 30; r <= 120; r += 30) {
      fctx.beginPath();
      fctx.arc(512, 650, r, 0, Math.PI * 2);
      fctx.stroke();
    }

    fctx.font = '400 78px "Instrument Serif", "Cormorant Garamond", Georgia, serif';
    fctx.fillText(book.title.toUpperCase(), 512, 1100);

    fctx.font = 'italic 400 32px "Cormorant Garamond", Georgia, serif';
    fctx.fillStyle = '#ffffff';
    fctx.fillText(book.author || 'Author', 512, 1170);

    // 2. Spine Texture
    const spCanvas = document.createElement('canvas');
    spCanvas.width = 256;
    spCanvas.height = 1536;
    const sctx = spCanvas.getContext('2d')!;
    sctx.fillStyle = book.cloth_color || '#1a2238';
    sctx.fillRect(0, 0, 256, 1536);

    sctx.save();
    sctx.translate(128, 768);
    sctx.rotate(Math.PI / 2);
    sctx.font = '400 44px "Instrument Serif", serif';
    sctx.fillStyle = book.foil_color || '#d4af37';
    sctx.textAlign = 'center';
    sctx.fillText(book.title.toUpperCase(), 0, 14);
    sctx.restore();

    // 3. Page Edge Texture
    const peCanvas = document.createElement('canvas');
    peCanvas.width = 512;
    peCanvas.height = 512;
    const pctx = peCanvas.getContext('2d')!;
    pctx.fillStyle = '#e8decb';
    pctx.fillRect(0, 0, 512, 512);
    pctx.fillStyle = 'rgba(100, 80, 60, 0.15)';
    for (let y = 0; y < 512; y += 2) {
      if (Math.random() > 0.3) pctx.fillRect(0, y, 512, 1);
    }

    return {
      frontCoverTex: new THREE.CanvasTexture(fcCanvas),
      spineTex: new THREE.CanvasTexture(spCanvas),
      backCoverTex: new THREE.CanvasTexture(fcCanvas),
      pageEdgeTex: new THREE.CanvasTexture(peCanvas),
    };
  }, [book]);

  useFrame((_, delta) => {
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
          map={spineTex}
          roughness={0.4}
          metalness={0.3}
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
        <meshStandardMaterial map={pageEdgeTex} roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Back Cover Board */}
      <mesh position={[width / 2, 0, -depth / 2 + boardThickness / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height, boardThickness]} />
        <meshStandardMaterial
          map={backCoverTex}
          roughness={0.35}
          metalness={0.3}
          color={book.cloth_color}
        />
      </mesh>

      {/* Front Hinge & Cover Board */}
      <group ref={frontHingeRef} position={[0, 0, depth / 2 - boardThickness / 2]}>
        <mesh position={[width / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, boardThickness]} />
          <meshStandardMaterial
            map={frontCoverTex}
            roughness={0.35}
            metalness={0.3}
            color={book.cloth_color}
          />
        </mesh>
      </group>
    </group>
  );
};
