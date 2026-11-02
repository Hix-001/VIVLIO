import React from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Compass,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Footprints,
} from 'lucide-react';
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
    isHeroMode,
    setHeroMode,
    cameraPosition,
  } = useVaultStore();

  if (isHeroMode) return null;

  const categories = ['All', 'Philosophy', 'Classic', 'Psychology', 'History'];

  const activeBook =
    books.find((b) => b.id === activeBookId) ||
    (focusedPedestalIndex !== null ? books[focusedPedestalIndex] : null);

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

  // Radar position normalized within 20m circle
  const radarX = Math.max(10, Math.min(70, 40 + (cameraPosition[0] / 12) * 28));
  const radarZ = Math.max(10, Math.min(70, 40 + (cameraPosition[2] / 12) * 28));

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-4 sm:p-7 select-none animate-fade-in font-sans">
      {/* ================= TOP NAVBAR ================= */}
      <header className="flex items-center justify-between pointer-events-auto">
        {/* Brand & Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-10 rounded-2xl glass-pill flex items-center justify-center text-[#c59b27] font-serif font-bold text-base shadow-glass">
            Ψ
          </div>
          <div>
            <h1 className="font-serif text-2xl tracking-tight text-neutral-900 font-light leading-none">
              Vivlio
            </h1>
            <span className="font-sans text-[10px] tracking-[0.2em] text-[#9b781e] uppercase block mt-1 font-medium">
              Sanctuary Exploration World
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Return to 3D Hero Reveal Showcase */}
          <button
            onClick={() => setHeroMode(true)}
            className="glass-pill px-4 py-2 flex items-center gap-1.5 text-xs font-sans font-medium text-neutral-800 hover:text-neutral-950 transition-all shadow-glass cursor-pointer hover:scale-105"
            title="Return to 3D Hero Reveal Stage"
          >
            <Sparkles size={13} className="text-[#c59b27]" />
            <span>Hero Showcase</span>
          </button>

          {/* Center Overview */}
          <button
            onClick={resetView}
            className="glass-pill px-3.5 py-2 flex items-center gap-1.5 text-xs font-sans font-medium text-neutral-700 hover:text-neutral-950 transition-all shadow-glass cursor-pointer"
            title="Reset to Central Overview (Press C)"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Overview (C)</span>
          </button>

          {/* Audio Sound Toggle */}
          <button
            onClick={toggleAudio}
            className="glass-pill p-2 text-neutral-700 hover:text-[#c59b27] transition-all shadow-glass cursor-pointer"
            title={isAudioMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Primary Read Now Button */}
          {activeBook && (
            <button
              onClick={() => openReader(activeBook)}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#c59b27] hover:bg-[#d8ab32] text-neutral-950 text-xs font-sans font-semibold tracking-wider uppercase transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer animate-pulse"
            >
              <BookOpen size={14} strokeWidth={2.4} />
              <span>Read {activeBook.title.split(' ')[0]}</span>
            </button>
          )}
        </div>
      </header>

      {/* ================= RADAR / MINIMAP & NAVIGATION ================= */}
      <div className="flex justify-between items-end pointer-events-auto">
        {/* Floating Frosted Glass Sanctuary Compass Mini-Radar */}
        <div className="glass-card p-3 shadow-glass flex items-center gap-3 hidden sm:flex">
          <div className="relative w-16 h-16 rounded-full border border-neutral-300/80 bg-stone-100/60 overflow-hidden flex items-center justify-center">
            {/* Center Dais indicator */}
            <div className="w-5 h-5 rounded-full border border-dashed border-[#c59b27]/60" />
            
            {/* 7 Pedestals on radar */}
            {Array.from({ length: 7 }).map((_, i) => {
              const ang = ((i - 3) / 7) * (Math.PI * 1.25) + Math.PI / 2;
              const px = 32 + Math.cos(ang) * 20;
              const py = 32 + Math.sin(ang) * 20;
              const isFoc = focusedPedestalIndex === i;
              return (
                <div
                  key={i}
                  className={`absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${
                    isFoc ? 'bg-[#c59b27] scale-150' : 'bg-neutral-400'
                  }`}
                  style={{ left: `${px}px`, top: `${py}px` }}
                />
              );
            })}

            {/* Player Puck */}
            <div
              className="absolute w-2 h-2 rounded-full bg-blue-600 shadow-xs border border-white -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${radarX}%`, top: `${radarZ}%` }}
            />
          </div>

          <div className="font-sans text-[11px] text-neutral-600">
            <span className="font-semibold text-neutral-900 block font-serif">Sanctuary Radar</span>
            <span className="text-[10px] text-neutral-500 block">Click floor to walk</span>
          </div>
        </div>

        {/* ================= BOTTOM PEDESTAL FAST-SWITCHER ================= */}
        <footer className="flex-1 flex flex-col items-center gap-3 max-w-2xl mx-auto">
          {/* Horizontal Volume Bar */}
          <div className="glass-card px-3 py-2 flex items-center gap-2 max-w-full overflow-x-auto shadow-glass">
            <button
              onClick={prevPedestal}
              className="p-1.5 rounded-full hover:bg-neutral-200/50 text-neutral-700 transition-colors cursor-pointer"
              title="Previous Book"
            >
              <ChevronLeft size={16} />
            </button>

            {books.map((book, idx) => {
              const isCurrent =
                focusedPedestalIndex === idx || activeBookId === book.id;
              return (
                <button
                  key={book.id}
                  onClick={() => focusPedestal(idx)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-sans font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? 'bg-neutral-900 text-white shadow-md scale-102 font-semibold'
                      : 'text-neutral-700 hover:text-neutral-950 hover:bg-white/70'
                  }`}
                  title={`Focus ${book.title} (Key ${idx + 1})`}
                >
                  <span className="opacity-50 text-[10px] font-mono">[{idx + 1}]</span>
                  <span>
                    {book.title.length > 15
                      ? book.title.slice(0, 14) + '…'
                      : book.title}
                  </span>
                </button>
              );
            })}

            <button
              onClick={nextPedestal}
              className="p-1.5 rounded-full hover:bg-neutral-200/50 text-neutral-700 transition-colors cursor-pointer"
              title="Next Book"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Categories & Navigation Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Category Filter Pills */}
            <div className="glass-pill px-3 py-1 flex items-center gap-1.5 shadow-glass">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-0.5 rounded-full text-[11px] font-sans font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#c59b27] text-neutral-950 font-semibold shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Movement Hints */}
            <div className="glass-pill px-4 py-1 flex items-center gap-2 text-[11px] font-sans text-neutral-600 shadow-glass hidden md:flex">
              <Footprints size={12} className="text-[#c59b27]" />
              <span><strong className="text-neutral-900 font-semibold">WASD</strong> to Walk</span>
              <span className="text-neutral-300">&bull;</span>
              <span><strong className="text-neutral-900 font-semibold">Click Floor</strong> to Navigate</span>
              <span className="text-neutral-300">&bull;</span>
              <span><strong className="text-neutral-900 font-semibold">1–7</strong> Pedestals</span>
            </div>
          </div>
        </footer>

        {/* Placeholder balance for flex alignment */}
        <div className="w-16 hidden sm:block" />
      </div>
    </div>
  );
};
