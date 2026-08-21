import React, { useEffect, useState } from 'react';
import { Header } from './components/ui/Header';
import { ShelfControls } from './components/ui/ShelfControls';
import { BookDetails } from './components/ui/BookDetails';
import { UploadModal } from './components/ui/UploadModal';
import { ReadingView } from './components/ui/ReadingView';
import { CollectionGrid } from './components/collections/CollectionGrid';
import { AudioControls } from './components/audio/AudioControls';
import { PasswordModal } from './components/ui/PasswordModal';
import { Scene } from './components/3d/Scene';
import { useBookStore } from './store/bookStore';
import { useUIStore } from './store/uiStore';
import { useAudioStore } from './store/audioStore';

export const App: React.FC = () => {
  const { fetchBooks, books, activeBookId } = useBookStore();
  const { viewMode } = useUIStore();
  const { initialize: initializeAudio } = useAudioStore();

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('vivlio_unlocked') === '1907';
  });

  useEffect(() => {
    fetchBooks();
    try {
      initializeAudio();
    } catch (e) {
      console.warn('Audio init:', e);
    }
  }, [fetchBooks, initializeAudio]);

  // Update dynamic CSS theme tokens when active book changes
  const activeBook = books.find((b) => b.id === activeBookId);
  useEffect(() => {
    if (activeBook) {
      document.documentElement.style.setProperty('--theme-hue', activeBook.cloth_color || '#1a2238');
      document.documentElement.style.setProperty('--theme-foil', activeBook.foil_color || '#d4af37');
      document.documentElement.style.setProperty(
        '--theme-glow',
        activeBook.theme_glow || 'rgba(212, 175, 55, 0.25)'
      );
    }
  }, [activeBook]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#100f0d]">
      {/* Password Unlock Modal Popup */}
      {!isUnlocked && (
        <PasswordModal onSuccess={() => setIsUnlocked(true)} />
      )}

      {/* Dynamic Radial Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 38%, var(--theme-glow) 0%, rgba(16, 15, 13, 0.95) 60%, #0d0c0a 100%)`,
        }}
      />

      {/* 3D WebGL Three.js Canvas Scene */}
      <Scene />

      {/* UI Overlay Layers */}
      <Header />
      <ShelfControls />
      <BookDetails />
      <CollectionGrid />
      <ReadingView />
      <UploadModal />

      {/* Medieval Audio Controls HUD */}
      <AudioControls />
    </div>
  );
};

export default App;
