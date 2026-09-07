import React from 'react';
import { Plus, BookOpen, Library, Lock } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useBookStore } from '../../store/bookStore';

export const Header: React.FC = () => {
  const { viewMode, setViewMode, setUploadModalOpen } = useUIStore();
  const { books } = useBookStore();

  const handleLock = () => {
    localStorage.removeItem('vivlio_unlocked');
    window.location.reload();
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-6 pointer-events-none">
      {/* Brand */}
      <div className="flex flex-col pointer-events-auto cursor-pointer" onClick={() => setViewMode('shelf')}>
        <h1 className="font-serifDisplay text-2xl tracking-widest uppercase text-[#f5efe6] font-normal">
          The 101 Archive
        </h1>
        <span className="font-mono text-[10px] tracking-widest text-[#8e7f6e] uppercase">
          Curated Masterpieces &middot; {books.length} Volumes
        </span>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => setViewMode(viewMode === 'collection' ? 'shelf' : 'collection')}
          className="flex items-center gap-2 bg-[#1a1714]/80 backdrop-blur-md border border-[#e6d7c3]/15 hover:border-gold px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase text-[#c4b5a2] hover:text-white transition-all shadow-lg"
          title="Toggle Grid View"
        >
          {viewMode === 'collection' ? <BookOpen size={14} /> : <Library size={14} />}
          <span>{viewMode === 'collection' ? '3D Shelf' : 'Library Grid'}</span>
        </button>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#e5c26b] text-[#100f0d] font-semibold px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all transform hover:-translate-y-0.5 shadow-lg shadow-gold/20"
        >
          <Plus size={14} strokeWidth={3} />
          <span>Add Book</span>
        </button>

        {/* Lock Library button */}
        <button
          onClick={handleLock}
          className="flex items-center gap-1.5 bg-[#1a1714]/80 backdrop-blur-md border border-[#d4af37]/20 hover:border-[#d4af37] px-3.5 py-2 rounded-full text-xs font-mono text-[#d4af37] hover:text-white transition-all"
          title="Lock Library"
        >
          <Lock size={12} />
          <span>Lock</span>
        </button>
      </div>
    </header>
  );
};
