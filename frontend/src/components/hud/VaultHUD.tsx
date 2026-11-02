import React from 'react';
import { Volume2, VolumeX, RotateCcw, BookOpen, Layers } from 'lucide-react';
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
          <div className="w-8 h-9 border border-[#c59b27] rounded-sm relative flex items-center justify-center bg-black/40 backdrop-blur-md">
            <span className="text-xs text-[#00f0ff] font-mono font-bold">Ψ</span>
          </div>
          <div>
            <h1 className="font-serif text-2xl tracking-widest uppercase text-[#f5efe6] font-normal leading-none">
              Vivlio
            </h1>
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#c59b27] uppercase block mt-1">
              Cyber-Monastic Vault // {books.length} Relics
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Reset Camera Focus */}
          <button
            onClick={resetCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-[#c4b5a2] hover:text-white hover:border-[#00f0ff]/40 text-xs font-mono uppercase tracking-wider transition-all"
            title="Reset Vault View"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Center Focus</span>
          </button>

          {/* Audio Drone Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-[#c4b5a2] hover:text-[#00f0ff] hover:border-[#00f0ff]/40 transition-all"
            title={isAudioMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Quick Relic Opener */}
          <button
            onClick={() => setInspectedBook(books[0])}
            className="px-4 py-1.5 rounded-full border border-[#c59b27]/60 bg-[#c59b27]/15 hover:bg-[#c59b27]/25 text-[#f5efe6] text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(197,155,39,0.2)]"
          >
            Inspect Codices
          </button>
        </div>
      </header>

      {/* ================= BOTTOM CONTROLS & CATEGORIES ================= */}
      <footer className="flex flex-col items-center gap-4 pointer-events-auto">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl overflow-x-auto max-w-full">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1 rounded-full text-xs font-mono tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'text-[#c4b5a2] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Orbit Interaction Telemetry Hint */}
        <div className="font-mono text-[10px] tracking-[0.2em] text-[#8e7f6e] uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
          <span>Click any codex to inspect &middot; Drag to orbit chamber</span>
        </div>
      </footer>
    </div>
  );
};
