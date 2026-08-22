import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Lighting } from './Lighting';
import { Shelf } from './Shelf';
import { Book3D } from './Book3D';
import { MedievalLibrary } from './MedievalLibrary';
import { ThreeErrorBoundary } from './ThreeErrorBoundary';
import { useBookStore } from '../../store/bookStore';
import { useUIStore } from '../../store/uiStore';
import { useAudioStore } from '../../store/audioStore';

export const Scene: React.FC = () => {
  const { books, activeBookId, shelfIndex, setShelfIndex, setActiveBookId } = useBookStore();
  const { viewMode, setViewMode, isCoverOpen, setCoverOpen } = useUIStore();
  const { playEffect } = useAudioStore();

  const isInspecting = viewMode === 'inspect';

  return (
    <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing">
      <ThreeErrorBoundary>
        <Canvas
          shadows={false}
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
            alpha: false,
          }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor('#100f0d', 1);
            scene.background = new THREE.Color('#100f0d');
          }}
        >
          <Suspense fallback={null}>
            <Lighting />
            <PerspectiveCamera makeDefault position={[0, 0.8, 6.2]} fov={38} />
            
            <OrbitControls
              enableDamping
              dampingFactor={0.08}
              minDistance={2.0}
              maxDistance={9.0}
              maxPolarAngle={Math.PI / 2 + 0.1}
              enabled={isInspecting}
              target={[-0.4, 0, 0]}
            />

            {/* Medieval Gothic Architecture & Environment */}
            <MedievalLibrary>
              <Shelf>
                {books.map((book, idx) => {
                  const isSelected = activeBookId === book.id;
                  return (
                    <Book3D
                      key={book.id}
                      book={book}
                      index={idx}
                      carouselOffset={shelfIndex}
                      totalBooks={books.length}
                      isSelected={isSelected}
                      isInspecting={isInspecting}
                      isCoverOpen={isCoverOpen}
                      onSelect={() => {
                        playEffect('select');
                        if (isSelected && viewMode === 'shelf') {
                          setViewMode('inspect');
                          playEffect('book_open');
                        } else {
                          setShelfIndex(idx);
                          setActiveBookId(book.id);
                        }
                      }}
                      onOpenCover={() => {
                        playEffect(isCoverOpen ? 'book_close' : 'book_open');
                        setCoverOpen(!isCoverOpen);
                      }}
                    />
                  );
                })}
              </Shelf>
            </MedievalLibrary>
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};
