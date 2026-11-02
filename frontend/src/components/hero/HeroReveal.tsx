import React from 'react';
import { ArrowRight, BookOpen, Compass, Sparkles } from 'lucide-react';
import { useVaultStore } from '../../store/vaultStore';

export const HeroReveal: React.FC = () => {
  const {
    books,
    featuredHeroBookId,
    setFeaturedHeroBookId,
    setHeroMode,
    openReader,
    isHeroMode,
    isReaderOpen,
  } = useVaultStore();

  if (!isHeroMode || isReaderOpen) return null;

  const currentBook =
    books.find((b) => b.id === featuredHeroBookId) || books[0];

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-6 sm:p-10 select-none animate-fade-in">
      {/* ================= TOP BRAND ROW ================= */}
      <header className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-11 rounded-2xl glass-pill flex items-center justify-center text-[#c59b27] font-serif font-bold text-lg shadow-glass">
            Ψ
          </div>
          <div>
            <h1 className="font-serif text-3xl tracking-tight text-neutral-900 font-light leading-none">
              Vivlio
            </h1>
            <span className="font-sans text-[10px] tracking-[0.24em] text-neutral-500 uppercase block mt-1 font-medium">
              3D Archival Sanctuary &middot; Apple Edition
            </span>
          </div>
        </div>

        {/* Enter Library Direct Button */}
        <button
          onClick={() => setHeroMode(false)}
          className="glass-pill px-5 py-2.5 flex items-center gap-2 text-xs font-sans font-medium text-neutral-800 hover:text-neutral-950 transition-all hover:scale-105 shadow-glass cursor-pointer"
        >
          <Compass size={14} className="text-[#c59b27]" />
          <span>Enter 3D Library</span>
          <ArrowRight size={13} />
        </button>
      </header>

      {/* ================= CENTER / LEFT EDITORIAL HERO PRESENTATION ================= */}
      <div className="max-w-xl pointer-events-auto my-auto py-8">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 mb-5 shadow-glass">
          <Sparkles size={13} className="text-[#c59b27]" />
          <span className="text-[11px] font-sans font-semibold tracking-wider uppercase text-neutral-700">
            {currentBook.category} &middot; Volume {books.indexOf(currentBook) + 1} of 7
          </span>
        </div>

        {/* Headline in Apple's New York Serif */}
        <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-neutral-900 tracking-tight leading-[1.08] mb-4">
          {currentBook.title}
        </h2>

        {/* Author & Year */}
        <p className="font-serif italic text-xl sm:text-2xl text-[#8d6a1b] font-normal mb-3">
          {currentBook.author} &mdash; {currentBook.year}
        </p>

        {/* Generous Description in Apple's San Francisco Sans */}
        <p className="font-sans text-sm sm:text-base text-neutral-600 font-normal leading-relaxed mb-8 max-w-lg">
          {currentBook.description}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3.5">
          {/* Read Book Now Button */}
          <button
            onClick={() => openReader(currentBook)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#c59b27] hover:bg-[#d8ab32] text-neutral-950 font-sans font-semibold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
          >
            <BookOpen size={15} strokeWidth={2.4} />
            <span>Read Online</span>
          </button>

          {/* Enter Movable Library World */}
          <button
            onClick={() => setHeroMode(false)}
            className="glass-pill px-6 py-3 flex items-center gap-2 font-sans font-medium text-xs tracking-wider uppercase text-neutral-800 hover:text-neutral-950 transition-all hover:scale-105 shadow-glass cursor-pointer"
          >
            <Compass size={15} className="text-[#c59b27]" />
            <span>Explore 3D World (WASD)</span>
          </button>
        </div>
      </div>

      {/* ================= BOTTOM VOLUME CAROUSEL SELECTOR ================= */}
      <footer className="pointer-events-auto flex flex-col items-center gap-3">
        {/* Horizontal Frosted Glass Volume Cards */}
        <div className="glass-card p-2 sm:p-2.5 flex items-center gap-2 max-w-full overflow-x-auto shadow-glass">
          {books.map((b, idx) => {
            const isSelected = b.id === currentBook.id;
            return (
              <button
                key={b.id}
                onClick={() => setFeaturedHeroBookId(b.id)}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap text-left ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-md scale-102'
                    : 'hover:bg-white/60 text-neutral-700'
                }`}
              >
                {/* Mini Cover Thumbnail or Monogram */}
                <div
                  className="w-7 h-9 rounded-md overflow-hidden bg-stone-300 shadow-xs flex-shrink-0 flex items-center justify-center font-serif text-xs font-bold"
                  style={{ backgroundColor: b.clothColor, color: b.foilColor }}
                >
                  {b.coverImage ? (
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div>
                  <span
                    className={`block font-serif text-xs font-medium leading-tight ${
                      isSelected ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {b.title.length > 18 ? b.title.slice(0, 17) + '…' : b.title}
                  </span>
                  <span
                    className={`block font-sans text-[10px] ${
                      isSelected ? 'text-stone-300' : 'text-neutral-500'
                    }`}
                  >
                    Vol. {idx + 1} &middot; {b.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Gentle Navigation Hint */}
        <div className="font-sans text-[11px] text-neutral-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27] animate-pulse" />
          <span>Click any codex above to reveal in 3D &middot; Enter 3D Library to freely walk</span>
        </div>
      </footer>
    </div>
  );
};

