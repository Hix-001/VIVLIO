import React from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useVaultStore } from '../../store/vaultStore';

export const VaultHUD: React.FC = () => {
  const {
    books,
    selectedCategory,
    setSelectedCategory,
    isAudioMuted,
    toggleAudio,
    setCameraTarget,
    setInspectedBook,
  } = useVaultStore();

  const categories = ['All', 'Philosophy', 'Classic', 'Psychology', 'History'];

  const resetCamera = () => {
    setCameraTarget([0, 0, 0]);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-8 select-none">
      {/* ================= TOP NAVBAR ================= */}
      <header className="flex items-center justify-between pointer-events-auto">
        {/* Brand & Sector Status */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-9 border border-[#c59b27] rounded-sm relative flex items-center justify-center bg-white/90 backdrop-blur-md shadow-sm">
            <span className="text-xs text-[#c59b27] font-mono font-bold">Ψ</span>
          </div>
          <div>
            <h1 className="font-serif text-2xl tracking-widest uppercase text-stone-900 font-normal leading-none">
              Vivlio
            </h1>
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#9b781e] uppercase block mt-1">
              Sunlit Sanctuary // {books.length} Relics
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Reset Camera Focus */}
          <button
            onClick={resetCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200/90 bg-white/80 backdrop-blur-md text-stone-700 hover:text-stone-950 hover:border-[#c59b27]/60 text-xs font-mono uppercase tracking-wider transition-all shadow-sm"
            title="Reset Vault View"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Center Focus</span>
          </button>

          {/* Audio Drone Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full border border-stone-200/90 bg-white/80 backdrop-blur-md text-stone-700 hover:text-[#c59b27] hover:border-[#c59b27]/60 transition-all shadow-sm"
            title={isAudioMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Quick Relic Opener */}
          <button
            onClick={() => setInspectedBook(books[0])}
            className="px-4 py-1.5 rounded-full border border-[#c59b27]/80 bg-[#c59b27] hover:bg-[#d8ab32] text-stone-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow"
          >
            Inspect Codices
          </button>
        </div>
      </header>

      {/* ================= BOTTOM CONTROLS & CATEGORIES ================= */}
      <footer className="flex flex-col items-center gap-3.5 pointer-events-auto">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200/90 bg-white/90 backdrop-blur-xl shadow-lg overflow-x-auto max-w-full">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1 rounded-full text-xs font-mono tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#c59b27] text-stone-950 font-bold shadow-sm'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/80 border border-transparent'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Orbit Interaction Hint */}
        <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500 uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27] animate-ping" />
          <span>Click any codex to open online reader &middot; Drag to orbit sanctuary</span>
        </div>
      </footer>
    </div>
  );
};
