import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="relative w-screen h-screen bg-[#0d0c0a] text-[#f5efe6] flex flex-col items-center justify-center p-6 select-none overflow-hidden font-sans">
      {/* Subtle radial ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.08) 0%, rgba(13, 12, 10, 0.95) 70%, #0a0908 100%)',
        }}
      />

      {/* 404 Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#d4af37] mb-3">
          HTTP 404
        </span>

        <h1 className="font-serif text-6xl sm:text-7xl font-normal tracking-wide text-[#f5efe6] mb-4">
          404
        </h1>

        <div className="h-px w-16 bg-[#d4af37]/40 mb-6" />

        <h2 className="font-serif text-xl sm:text-2xl text-[#e6d7c3] font-light mb-3">
          Archive Not Found
        </h2>

        <p className="font-mono text-xs text-[#8e7f6e] leading-relaxed mb-8 max-w-sm">
          The requested volumes have been decommissioned. The library is currently undergoing full reconstruction.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono text-[#c4b5a2]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
          <span>Status: Offline for Rebuild</span>
        </div>
      </div>

      {/* Footer watermark */}
      <div className="absolute bottom-8 font-mono text-[10px] tracking-widest text-[#8e7f6e]/50 uppercase">
        VIVLIO &middot; REBUILD IN PROGRESS
      </div>
    </div>
  );
};

export default App;
