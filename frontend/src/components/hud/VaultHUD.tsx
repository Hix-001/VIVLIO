import React from 'react';
import { Volume2, VolumeX, RotateCcw, BookOpen, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { useVaultStore } from '../../store/vaultStore';

export const VaultHUD: React.FC = () => {
  const {
    books,
    selectedCategory,
    setSelectedCategory,
    activeBookId,
    focusedPedestalIndex,
    focusPedestal,
    resetView,
    openReader,
    isAudioMuted,
    toggleAudio,
  } = useVaultStore();

  const categories = ['All', 'Philosophy', 'Classic', 'Psychology', 'History'];

  const activeBook = books.find((b) => b.id === activeBookId) || (focusedPedestalIndex !== null ? books[focusedPedestalIndex] : null);

  const prevPedestal = () => {
    const current = focusedPedestalIndex ?? 0;
    const nextIdx = (current - 1 + books.length) % books.length;
    focusPedestal(nextIdx);
  };

  const nextPedestal = () => {
    const current = focusedPedestalIndex ?? 0;
    const nextIdx = (current + 1) % books.length;
    focusPedestal(nextIdx);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-7 select-none">
      {/* ================= TOP NAVBAR ================= */}
      <header className="flex items-center justify-between pointer-events-auto">
        {/* Brand & Sanctuary Status */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-9 border border-[#c59b27] rounded-sm relative flex items-center justify-center bg-white/90 backdrop-blur-md shadow-sm">
            <span className="text-xs text-[#c59b27] font-mono font-bold">Ψ</span>
          </div>
          <div>
            <h1 className="font-serif text-2xl tracking-widest uppercase text-stone-900 font-normal leading-none">
              Vivlio
            </h1>
            <span className="font-mono text-[9px] tracking-[0.22em] text-[#9b781e] uppercase block mt-1">
              Sunlit Sanctuary // 7 Volumes
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Reset Camera Focus */}
          <button
            onClick={resetView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200/90 bg-white/85 backdrop-blur-md text-stone-700 hover:text-stone-950 hover:border-[#c59b27]/60 text-xs font-mono uppercase tracking-wider transition-all shadow-sm"
            title="Reset Sanctuary Overview (Press C)"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Overview (C)</span>
          </button>

          {/* Audio Sound Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full border border-stone-200/90 bg-white/85 backdrop-blur-md text-stone-700 hover:text-[#c59b27] hover:border-[#c59b27]/60 transition-all shadow-sm"
            title={isAudioMuted ? 'Unmute Tactile Sound' : 'Mute Sound'}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Primary Read Now Button */}
          {activeBook && (
            <button
              onClick={() => openReader(activeBook)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#c59b27] hover:bg-[#d8ab32] text-stone-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg animate-pulse"
            >
              <BookOpen size={13} strokeWidth={2.5} />
              <span>Read {activeBook.title.split(' ')[0]}</span>
            </button>
          )}
        </div>
      </header>

      {/* ================= BOTTOM CONTROLS & PEDESTAL CAROUSEL ================= */}
      <footer className="flex flex-col items-center gap-3 pointer-events-auto">
        {/* Interactive Pedestal Fast-Switcher Bar */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-stone-200/90 bg-white/90 backdrop-blur-xl shadow-xl max-w-full overflow-x-auto">
          <button
            onClick={prevPedestal}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
            title="Previous Book"
          >
            <ChevronLeft size={16} />
          </button>

          {books.map((book, idx) => {
            const isCurrent = focusedPedestalIndex === idx || activeBookId === book.id;
            return (
              <button
                key={book.id}
                onClick={() => focusPedestal(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-[#c59b27] text-stone-950 font-bold shadow-sm scale-105'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/90'
                }`}
                title={`Focus ${book.title} (Key ${idx + 1})`}
              >
                <span className="opacity-60 text-[10px] font-sans font-bold">[{idx + 1}]</span>
                <span>{book.title.length > 16 ? book.title.slice(0, 15) + '…' : book.title}</span>
              </button>
            );
          })}

          <button
            onClick={nextPedestal}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
            title="Next Book"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Category Filter Pills & Navigation Hints */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Categories */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-stone-200/80 bg-white/80 backdrop-blur-md shadow-sm">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-stone-900 text-white font-medium shadow-xs'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Interactive Navigation Keyboard Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/80 text-[10px] font-mono text-stone-600 shadow-sm">
            <Compass size={12} className="text-[#c59b27]" />
            <span><strong className="text-stone-900">WASD / Arrows</strong> to Walk</span>
            <span className="text-stone-300">&bull;</span>
            <span><strong className="text-stone-900">1–7</strong> Jump to Book</span>
            <span className="text-stone-300">&bull;</span>
            <span><strong className="text-stone-900">Double-Click</strong> to Read</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
